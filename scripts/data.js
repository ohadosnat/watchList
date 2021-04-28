
// importing json data to firestore

class Watchlist {
    constructor(uri) {
        this.uri = uri;
        this.db = db.collection('watchlist');
        this.latestDoc = null;
        this.limit = null;
    }
    async getLocalJSON() {
        const response = await fetch('json/watchlist.json');
        const data = await response.json();
        return data;
    }
    jsonToFirestore(items) {
        // loops through the items in the json file and format them for firestore
        for (let i = 0; i < items.length; i++) {
            const time = new Date(items[i].dateAdded)
            const id = `${items[i].title.replace(/[&:.!,' ]/g, "-").replace(/-{2,}/g, "-").toLowerCase()}_${items[i].releaseYear}`;
            const docTemplete = {
                title: items[i].title,
                releaseYear: items[i].releaseYear,
                dateAdded: firebase.firestore.Timestamp.fromDate(time),
                letterboxdURI: items[i].letterboxdURI,
            }
            console.log(docTemplete)
            // based on the item's id, if exists in firestore db, do nothing, it doesn't exists then add to firestore db.
            this.db.doc(id).get()
                .then((doc) => {
                    if (!doc.exists) {
                        this.db.doc(id).set(docTemplete)
                            .then(() => console.log(`${items[i].title} has been added!`))
                            .catch(err => console.log(err));
                    }
                })
                .catch(err => console.log(err));
        }
        return items;
    }
    // try remove the onSnapshot and add a regular get() and each time, get 10 (inital 15, and every scroll 5 more)
    getCollection(callback) {
        this.db
            // .where('releaseYear', '==', 2021)
            .orderBy('dateAdded')
            .startAfter(this.latestDoc)
            .limit(19)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                        const document = {
                            info: change.doc.data(),
                            id: change.doc.id
                        }
                        callback(document);
                    } else if (change.type === "removed") {
                        const id = change.doc.id
                        container.removeChild(container.children.namedItem(id))
                    }
                })
                this.latestDoc = snapshot.docs.length - 1;
            })
    }
    async getDocuments(callback) {
        // Sets limit based on screen size
        if (section.offsetWidth > 1024) {
            this.limit = 15
        } else if (section.offsetWidth < 1024) {
            this.limit = 9;
        }
        const ref = this.db
            .orderBy("dateAdded", 'desc')
            .limit(this.limit)
        const data = await ref.get()

        data.docs.forEach(doc => {
            const documentData = { info: doc.data(), id: doc.id }
            const { id, info: { dateAdded, releaseYear, title, type, watchStatus } } = documentData
            const document = { id, dateAdded, releaseYear, title, type, watchStatus }
            callback(document);
        })
        this.latestDoc = data.docs[data.docs.length - 1];
    }
    async getNextDocuments(callback) {

        const ref = this.db
            .orderBy("dateAdded", 'desc')
            .startAfter(this.latestDoc || 0)
            .limit(4)
        const data = await ref.get()

        data.docs.forEach(doc => {
            const documentData = { info: doc.data(), id: doc.id }
            const { id, info: { dateAdded, releaseYear, title, type, watchStatus } } = documentData
            const document = { id, dateAdded, releaseYear, title, type, watchStatus }
            callback(document);
        })
        this.latestDoc = data.docs[data.docs.length - 1];
        // remove event when reaching the end
        if (data.empty) {
            section.removeEventListener('scroll', () => {
                let triggerHeigh = section.scrollTop + section.offsetHeight;
                if (triggerHeigh >= section.scrollHeight) {
                    console.log('hello')
                    myWatchlist.getNextDocuments(data => {
                        newData.getFilm(data)
                            .then((result) => myList.render(result))
                            .catch(err => console.log(err))
                    });
                }
            });
        }
    }

    updateStatus(film) {
        this.db.doc(film.id).update({
            watchStatus: film.watchStatus,
        })
            .then(() => {
                // Generates Update Message
                if (film.watchStatus) {
                    const html = `
                    <div class="global-transition z-10 absolute bottom-0 text-center px-4 py-3 bg-gray-50 rounded-md shadow-md">
                    <span class="font-semibold text-[#484FFA]">${film.title}</span> is now marked as 
                    <span class="font-semibold text-[#484FFA]">watched</span></div>`;
                    updateMessage.innerHTML += html;
                    myList.updateMessageAnimation(updateMessage)
                } else {
                    const html = `
                    <div class="global-transition z-10 absolute bottom-0 text-center px-4 py-3 bg-gray-50 rounded-md shadow-md">
                    <span class="font-semibold text-[#484FFA]">${film.title}</span> is no longer marked as 
                    <span class="font-semibold text-[#484FFA]">watched</span></div>`;
                    updateMessage.innerHTML += html;
                    myList.updateMessageAnimation(updateMessage)
                }
            })
            .catch(err => console.log(err))
    }

    addEntry(entry) {
        const time = new Date
        const docTemplete = {
            title: entry.title,
            releaseYear: parseInt(entry.id.slice(-4)),
            dateAdded: firebase.firestore.Timestamp.fromDate(time),
            watchStatus: false,
            type: entry.type
        }
        // based on the item's id, if exists in firestore db, do nothing, it doesn't exists then add to firestore db.
        this.db.doc(entry.id).get()
            .then((doc) => {
                if (!doc.exists) {
                    this.db.doc(entry.id).set(docTemplete)
                        .then(() => {

                            // Generate a New Card
                            newData.getFilm(docTemplete)
                                .then((result) => myList.render(result))
                                .catch(err => console.log(err))

                            // Added Message
                            console.log(`${entry.title} has been added!`)
                            const html = `
                            <div class="global-transition z-10 absolute bottom-0 text-center px-4 py-3 bg-gray-50 rounded-md shadow-md">
                            <span class="font-semibold text-[#484FFA]">${entry.title}</span> has been 
                            <span class="font-semibold text-[#484FFA]">added</span></div>`;
                            updateMessage.innerHTML += html;
                            myList.updateMessageAnimation(updateMessage)

                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));

    }
    deleteEntry(entry) {
        // need to remove/disable the scroll event, to prevent more loading

        const title = myList.films.find(e => e.id === entry.id).title;
        this.db.doc(entry.id).delete()
            .then(() => {
                // Updates the overall films to make sure the edit mode will work
                myList.films = myList.films.filter(e => e.id !== entry.id);

                // Delete Message
                console.log(`${title} has been deleted!`);
                const html = `
                <div class="global-transition z-10 absolute bottom-20 text-center px-4 py-3 bg-gray-50 rounded-md shadow-md">
                <span class="font-semibold text-[#484FFA]">${title}</span> has been 
                <span class="font-semibold text-[#484FFA]">deleted</span></div>`;
                updateMessage.innerHTML += html;
                myList.updateMessageAnimation(updateMessage);
            })
            .catch(err => console.log(err));
    }
}

