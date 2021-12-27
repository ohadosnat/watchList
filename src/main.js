import "./index.css";
import { APIData } from "./api";
import { Firestore } from "./firestore";
import { db } from "./firestoreConfig";
import { siteUI } from "./ui";
import createElement from "./utils/createElement";

export const ui = new siteUI();
export const firestoreDB = new Firestore(db);
export const apiData = new APIData();

ui.initUI();
initSite(20);

/**
 * Fetch docs from firestore & render
 * @param {number} amount - the amount of docs to fetch
 */
async function initSite(amount) {
  const docs = await firestoreDB.getDocuments(amount);
  docs.sort((a, b) => b.dateAdded - a.dateAdded); // desc order - dated added

  docs.forEach(async (doc) => {
    try {
      const entry = await apiData.getEntry(doc, true);
      ui.render(entry);
    } catch (error) {
      const content = createElement(
        "span",
        { class: "font-semibold text-red-500" },
        error.message
      );
      ui.createUpdateMessage(content);
    }
  });
}
