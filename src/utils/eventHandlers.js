import { apiData, firestoreDB, ui } from "../main";
import createElement from "./createElement";

/**
 * Scroll Event Handler
 *
 * Fetches 5 documents when reaching the bottom of the page
 * @param {Event} e - The event object
 * @fires getDocuments - get documents from firestore
 * @fires getEntry - get an entry data from TMDB api
 * @fires render - render an entry
 */
export async function scrollHandler(e) {
  /** @type {HTMLDivElement} */
  const element = e.target;
  const heightTrigger = element.scrollTop + element.offsetHeight;
  if (heightTrigger < element.scrollHeight) return;

  try {
    const docs = await firestoreDB.getDocuments(5);
    docs.forEach(async (doc, idx) => {
      try {
        const entry = await apiData.getEntry(doc);
        ui.render(entry);
      } catch (error) {
        const content = createElement(
          "span",
          { class: "font-semibold text-red-500" },
          error.message
        );
        ui.createToastMessage(content, idx);
      }
    });
  } catch (error) {
    const content = createElement(
      "span",
      { class: "font-semibold text-red-500" },
      "An error occurred while fetching documents "
    );
    ui.createToastMessage(content, 2);
    console.error(error);
  }
}

/**
 * Creates a new Add Entry Form with event listeners.
 * @param {Event} e - The Event Object
 */
export function addCardHandler(e) {
  /* Reference at app.js  48:74*/

  if (ui.container.children.namedItem("addForm")) return; // prevent from adding a new form.

  const addForm = createElement(
    "form",
    {
      id: "addForm",
      autocomplete: "off",
      class:
        "relative global-transition pb-4 px-2 flex justify-center items-center flex-col h-40 rounded-md overflow-hidden shadow-sm 2xl:h-52 border-white border-2 text-white",
    },
    createElement("input", {
      id: "entryTitle",
      type: "text",
      required: "",
      placeholder: "Enter a Film/TV Show Title",
      class:
        "w-full text-sm bg-transparent border-white border-b text-center pb-1 placeholder-current",
    }),
    createElement(
      "div",
      { class: "flex items-center justify-center mt-3" },
      createElement("input", {
        type: "radio",
        name: "type",
        id: "movie",
        value: "movie",
        class: "mr-1",
        required: "",
      }),
      createElement("label", { for: "movie", class: "mr-5" }, "Film"),
      createElement("input", {
        type: "radio",
        name: "type",
        id: "tv",
        value: "tv",
        class: "mr-1",
      }),
      createElement("label", { for: "tv" }, "TV Series")
    ),
    createElement(
      "button",
      {
        type: "submit",
        class: "absolute bottom-0 bg-white shadow-sm text-black w-full py-1",
      },
      "Add Entry"
    ),
    createElement(
      "button",
      {
        id: "closeForm",
        class: "absolute top-2 right-2 h-5 w-5",
        type: "button",
      },
      "❌"
    )
  );

  // Events
  addForm.addEventListener("submit", addFormHandler);
  addForm.addEventListener("click", function (e) {
    if (e.target.id === "closeForm") this.remove();
  });

  /** @type {HTMLDivElement} */
  const element = e.target;
  element.after(addForm);
}

/**
 * Add Entry Form Handler
 *
 * Adds a new entry inside Firestore & renders it to the DOM.
 * @param {Event} e - The Event object.
 */
async function addFormHandler(e) {
  e.preventDefault();

  const formValues = {
    type: e.target.type.value,
    title: e.target.entryTitle.value,
  };

  let entryData;
  try {
    // Fetch Entry from TMDB
    entryData = await apiData.getEntry(formValues);

    // Check if it exists in the UI - if it does, create a new toast message.
    const doesEntryExists = ui.entries.find(
      ({ title }) => title === entryData.title
    );
    if (doesEntryExists) {
      const content = createElement(
        "span",
        { class: "font-semibold text-red-500" },
        `${entryData.title} already exists`
      );
      ui.createToastMessage(content, 5);
      return;
    }
  } catch (error) {
    const content = createElement(
      "span",
      { class: "font-semibold text-red-500" },
      error.message
    );
    ui.createToastMessage(content, 2);
    return;
  }

  // Add entry to Firestore, if it already exists, create a new toast message (error)
  // otherwise, render it and remove the form from the page.
  try {
    await firestoreDB.addEntry({
      id: entryData.id,
      type: entryData.type,
      title: entryData.title,
    });
    ui.render(entryData, true);
    this.remove();
  } catch (error) {
    const content = createElement(
      "span",
      { class: "font-semibold text-red-500" },
      `${entryData.title} ${error.message}`
    );
    ui.createToastMessage(content, 2);
  }
}

/**
 * Delete an Entry from Firestore & the DOM
 * @param {Event} e - The Event Object
 */
export async function deleteEntryHandler(e) {
  /* Reference at app.js - 102:111 */
  const entryID = e.target.parentElement.parentElement.parentElement.id;
  const { title } = ui.entries.find(({ id }) => id === entryID);

  try {
    await firestoreDB.deleteEntry(entryID);
    ui.removeEntry(entryID);
  } catch (error) {
    const content = createElement(
      "span",
      { class: "font-semibold text-red-500" },
      `An error occurred while deleting ${title}`
    );
    ui.createToastMessage(content, 2);
    console.error(error);
  }
}

/**
 * Toggles the watch status on an entry & update it inside Firestore and the DOM.
 * @param {Event} e - The Event Object
 */
export async function watchToggleHandler(e) {
  /* Reference at app.js - 32:46 */
  const entryID = e.target.parentElement.parentElement.id;
  const { title } = ui.entries.find(({ id }) => id === entryID);

  try {
    const watchStatus = e.target.className.includes("bg-watched"); // true - watched | false - didn't watch
    if (watchStatus) {
      e.target.classList.replace("bg-watched", "bg-didntWatch");
      await firestoreDB.updateDocument(entryID, { watchStatus: false });
    } else {
      e.target.classList.replace("bg-didntWatch", "bg-watched");
      await firestoreDB.updateDocument(entryID, { watchStatus: true });
    }

    const messageText = !watchStatus
      ? " is now marked as "
      : " is no longer marked as ";

    const updateMessage = createElement(
      "span",
      {},
      createElement("span", { class: "font-semibold text-[#484FFA]" }, title),
      messageText,
      createElement(
        "span",
        { class: "font-semibold text-[#484FFA]" },
        "watched"
      )
    );
    ui.createToastMessage(updateMessage, 2);
  } catch (error) {
    const content = createElement(
      "span",
      { class: "font-semibold text-red-500" },
      `An error occurred while updating ${title}`
    );
    ui.createToastMessage(content, 2);
    console.error(error);
  }
}
