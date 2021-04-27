
// importing json data to firestore

class Watchlist {
    constructor(uri) {
        this.uri = uri;
        this.db = db.collection('watchlist');
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

    getCollection(callback) {
        this.db
            .where('releaseYear', '==', 2021)
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
            })
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
        const title = myList.films.find(e => e.id === entry.id).title;
        this.db.doc(entry.id).delete()
            .then(() => {
                myList.films = myList.films.filter(e => e.id !== entry.id);
                console.log(myList.films)
                console.log(`${title} has been deleted!`);
                const html = `
                <div class="global-transition z-10 absolute bottom-0 text-center px-4 py-3 bg-gray-50 rounded-md shadow-md">
                <span class="font-semibold text-[#484FFA]">${title}</span> has been 
                <span class="font-semibold text-[#484FFA]">deleted</span></div>`;
                updateMessage.innerHTML += html;
                myList.updateMessageAnimation(updateMessage);
            })
            .catch(err => console.log(err));
    }
}

