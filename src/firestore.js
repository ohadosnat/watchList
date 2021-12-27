/// <reference path="./types/types.js" />

export class Firestore {
  constructor(db) {
    this.db = db.collection("watchlist");
    this.latestDoc = "";
  }

  /**
   * Get documents from Firestore
   * @param {number} limit - number of documents to fetch
   * @returns {Promise<FirestoreEntry[]>} An array of formatted entries
   */
  async getDocuments(limit) {
    const ref = this.db
      .orderBy("dateAdded", "desc")
      .startAfter(this.latestDoc)
      .limit(limit);
    const { docs } = await ref.get();
    this.latestDoc = docs[docs.length - 1]; // last doc to keep track

    /** @type {FirestoreEntry[]} */
    const entries = docs.map((doc) => {
      const { dateAdded, releaseYear, title, type, watchStatus } = doc.data();

      /** @type {FirestoreEntry} */
      return {
        id: doc.id,
        dateAdded,
        releaseYear,
        title,
        type,
        watchStatus,
      };
    });

    return entries;
  }

  /**
   * Update a document on Firestore
   * @param {string} id - document ID
   * @param {Object} values - the value you want to update
   * @example
   * updateDocument("1234", {watchStatus: true})
   * updateDocument("ohad", {darkmode: false})
   */
  async updateDocument(id, values) {
    await this.db.doc(id).update(values);
  }

  /**
   * Add a document to Firestore
   * @param {FormEntryValues} entry - form entry values
   * @returns
   */
  async addEntry({ id, type, title }) {
    // check if there's already exists in Firestore
    const { exists } = await this.db.doc(id).get();
    if (exists) throw new Error("already exists in database");

    /** @type {FirestoreEntry} */
    const newDoc = {
      title,
      type,
      watchStatus: false,
      releaseYear: parseInt(id.slice(-4)),
      dateAdded: firebase.firestore.Timestamp.fromDate(new Date()),
    };

    await this.db.doc(id).set(newDoc);
  }

  /**
   * Delete a document from Firestore
   * @param {string} id - Document ID
   */
  async deleteEntry(id) {
    await this.db.doc(id).delete();
  }
}
