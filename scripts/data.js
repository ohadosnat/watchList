
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
    // For Real-Time Updates, No longer in use but keep it for reference (for now)
    getOnSnapshot(callback) {
        this.db
            .orderBy('dateAdded')
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

    // Gets the inital documents
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
        });
        // To keep track of the last document
        this.latestDoc = data.docs[data.docs.length - 1];
    }

    // Gets the next set of documents (5)
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
        });
        // To keep track of the last document
        this.latestDoc = data.docs[data.docs.length - 1];

        // remove event when reaching the end
        if (data.empty) {
            section.removeEventListener('scroll', scrollHandle);
        };
    }

    // Handles the update status event - Updates the collection and creates a update message for the user
    updateStatus(entry) {
        this.db.doc(entry.id).update({
            watchStatus: entry.watchStatus,
        })
            .then(() => {
                // Generates Update Message
                if (entry.watchStatus) {
                    const html = `
                    <div class="global-transition z-10 absolute bottom-0 text-center px-4 py-3 bg-gray-50 rounded-md shadow-md">
                    <span class="font-semibold text-[#484FFA]">${entry.title}</span> is now marked as 
                    <span class="font-semibold text-[#484FFA]">watched</span></div>`;
                    updateMessage.innerHTML += html;
                    myList.updateMessageAnimation(updateMessage)
                } else {
                    const html = `
                    <div class="global-transition z-10 absolute bottom-0 text-center px-4 py-3 bg-gray-50 rounded-md shadow-md">
                    <span class="font-semibold text-[#484FFA]">${entry.title}</span> is no longer marked as 
                    <span class="font-semibold text-[#484FFA]">watched</span></div>`;
                    updateMessage.innerHTML += html;
                    myList.updateMessageAnimation(updateMessage)
                }
            })
            .catch(err => console.log(err))
    }
    // Handles adding new entries
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
                            newData.getEntryData(docTemplete)
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
        const title = myList.entries.find(e => e.id === entry.id).title;
        this.db.doc(entry.id).delete()
            .then(() => {
                // Updates the overall entries to make sure the edit mode will work
                myList.entries = myList.entries.filter(e => e.id !== entry.id);

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

