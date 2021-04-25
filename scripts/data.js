
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
            .where('releaseYear', '==', 2008)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === "added") {
                        const document = {
                            info: change.doc.data(),
                            id: change.doc.id
                        }
                        callback(document);
                    }
                })
            })
    }

    updateStatus(film) {
        this.db.doc(film.id).update({
            watchStatus: film.watchStatus,
        })
            .then(() => console.log(`${film.title} Status has been updated to ${film.watchStatus}`))
            .catch(err => console.log(err))
    }
}




