/// <reference path="./types/types.js" />
import createElement from "./utils/createElement";
import {
  addCardHandler,
  deleteEntryHandler,
  scrollHandler,
  watchToggleHandler,
} from "./utils/eventHandlers";

/** Class for handling the site's UI */
export class siteUI {
  constructor() {
    /** Container Element
     * @type {HTMLDivElement} */
    this.container = document.querySelector("#EntriesWrapper");

    /** App's Section Element
     * @type {HTMLElement} */
    this.section = this.container.parentElement;

    /** top Content Wrapper Element - Holds the title & edit/save buttons
     * @type {HTMLDivElement} */
    this.topContentWrapper = document.querySelector("#topContent");

    /** Array of IDs
     * @type {Entry[]} */
    this.entries = [];
  }

  /** Adds Event Listeners to the UI */
  initUI() {
    // Section Events (Click & Scroll)
    this.section.addEventListener("click", (e) => {
      if (e.target.id === "edit") return this.EnterEditMode(this.entries);

      if (e.target.id === "saveEdit") return this.ExitEditMode(this.entries);

      if (e.target.id === "addCard") return addCardHandler(e);

      if (e.target.className.includes("deleteArea")) {
        return deleteEntryHandler(e);
      }

      if (e.target.className.includes("watchToggle")) {
        return watchToggleHandler(e);
      }
    });

    this.section.addEventListener("scroll", scrollHandler);

    const updateMessageElement = createElement("div", {
      id: "updateMessage",
      class:
        "global-transition fixed bottom-5 right-3 left-3 opacity-0 flex flex flex-col gap-2 justify-center items-center z-50",
    });

    this.section.appendChild(updateMessageElement);
  }

  /**
   * Creates a Entry Card Element and append it to the DOM (Container)
   * @param {Entry} entry - A single entry object
   * @param {boolean} isNew - is the entry is new? if yes, it will added at top, if not it will be added at the bottom (defaults to `false`)
   */
  render(entry, isNew = false) {
    const { watchStatus, image, id, title, runtime } = entry;
    const status = watchStatus ? "bg-watched" : "bg-didntWatch";

    const cardEntry = createElement(
      "div",
      {
        id: id,
        role: "button",
        tabindex: "0",
        class:
          "cardEntry relative h-40 rounded-md overflow-hidden shadow-sm 2xl:h-52",
      },
      createElement(
        "div",
        {
          id: "entryCover",
          class:
            "global-transition relative w-full h-full bg-cover bg-no-repeat bg-center pointer-events-none",
          style: `background-image: url(${image});`,
        },
        createElement("div", {
          class:
            "absolute inset-0 bg-gradient-to-tr from-overlayBlack to-transparent bg-opacity-40 flex justify-start items-end",
        })
      ),
      createElement(
        "div",
        {
          id: "overlay",
          class: "absolute inset-0",
        },
        createElement(
          "div",
          {
            class:
              "h-full pb-4 px-4 flex justify-end flex-col pointer-events-none",
          },
          createElement("h2", { class: "font-bold text-sm" }, title),
          createElement("p", { class: "font-light text-xs" }, runtime)
        ),
        createElement("button", {
          class: `watchToggle ${status} bg-no-repeat bg-center top-0 left-0 absolute w-10 h-10 bg-white rounded-br-md justify-center items-center global-transition`,
        })
      )
    );

    const addCard = this.container.children.namedItem("addCard");
    isNew ? addCard.after(cardEntry) : this.container.appendChild(cardEntry);

    // To keep track of active entries (used in edit mode)
    this.entries.push(entry);
  }
  /**
   * Enters to Edit Mode.
   *
   * Creates an overlay element for each entry, set the entry's card to `editMode` which disables the ability to update watch status or to add a new entry.
   * @param {Entry[]} entries - The current displayed entries
   */
  EnterEditMode(entries) {
    //  removes the scroll event (to prevent more loading while scrolling during edit mode)
    this.section.removeEventListener("scroll", scrollHandler);

    // adds edit mode overlay to all cards
    entries.forEach(({ id }) => {
      const mainDiv = this.container.children.namedItem(id);
      const overlay = mainDiv.children.entryCover.firstElementChild;
      mainDiv.classList.add("editMode"); // mark as edit mode.

      overlay.classList.remove(
        "bg-gradient-to-tr",
        "from-overlayBlack",
        "to-transparent",
        "justify-start",
        "items-end"
      );
      overlay.classList.add(
        "deleteWrapper",
        "bg-red-900",
        "global-transition",
        "z-20",
        "flex-col",
        "justify-center",
        "items-center",
        "hover:bg-opacity-90",
        "hover:scale-105"
      );

      //   overlay.id = "deleteWrapper";
      overlay.appendChild(this.createDeleteOverlayElement());
    });

    const saveEditBtn = createElement(
      "button",
      { id: "saveEdit", class: "p-2 text-green-400" },
      createElement(
        "svg",
        {
          class: "pointer-events-none h-6 w-6",
          fill: "currentColor",
          viewBox: "0 0 20 20",
        },
        createElement("path", {
          "fill-rule": "evenodd",
          "clip-rule": "evenodd",
          d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
        })
      )
    );

    // remove save button from the DOM & add the save edit button
    this.topContentWrapper.children.namedItem("edit").remove();
    this.topContentWrapper.appendChild(saveEditBtn);

    this.container.firstElementChild.remove(); // "addCard" will always be the first child of container. So it can be assumed to be the first element child.

    // if the add entry form is displayed -> remove it.
    this.container.children.namedItem("addForm")?.remove();

    // Update Message
    const updateMessage = this.section.children.namedItem("updateMessage");
    updateMessage.appendChild(this.createEditModeMessage());

    // show message after 100ms for nice transition.
    setTimeout(() => {
      updateMessage.classList.remove("opacity-0");
    }, 100);
  }

  /**
   * Exits Edit Mode.
   *
   * Removes the delete overlay for each entry, removes `editMode` from the entry's card.
   * @param {Entry[]} entries - The current displayed entries
   */
  ExitEditMode(entries) {
    // adds the scroll event again (to allow the user to scroll and load more entries)
    this.section.addEventListener("scroll", scrollHandler); //TODO: scrollHandle

    // removes edit mode overlay from all cards
    entries.forEach(({ id }) => {
      const mainDiv = this.container.children.namedItem(id);
      const overlay = mainDiv.children.entryCover.firstElementChild;
      mainDiv.classList.remove("editMode"); // mark as edit mode.
      overlay.firstElementChild.remove();

      overlay.classList.remove(
        "deleteWrapper",
        "bg-red-900",
        "global-transition",
        "z-20",
        "flex-col",
        "justify-center",
        "items-center",
        "hover:bg-opacity-90",
        "hover:scale-105"
      );

      overlay.classList.add(
        "bg-gradient-to-tr",
        "from-overlayBlack",
        "to-transparent",
        "justify-start",
        "items-end"
      );
    });

    const editBtn = createElement(
      "button",
      {
        id: "edit",
        class: "global-transition p-2 text-white hover:text-green-400",
      },
      createElement(
        "svg",
        {
          class: "pointer-events-none h-6 w-6",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
        },
        createElement("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
        })
      )
    );

    const addCard = createElement(
      "button",
      {
        id: "addCard",
        class:
          "bg-white bg-opacity-5 global-transition flex justify-center items-center flex-col h-40 rounded-md overflow-hidden shadow-sm  2xl:h-52 border-white border-2 border-opacity-60 hover:border-opacity-100",
      },
      createElement(
        "svg",
        {
          class: "mb-2 h-7 w-7 pointer-events-none",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
        },
        createElement("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
        })
      ),
      createElement(
        "h2",
        { class: "font-bold text-lg pointer-events-none" },
        "Add Film"
      )
    );

    this.topContentWrapper.children.namedItem("saveEdit").remove();
    this.topContentWrapper.appendChild(editBtn);
    this.container.prepend(addCard);

    const updateMessage = this.section.children.namedItem("updateMessage");
    setTimeout(() => updateMessage.classList.add("opacity-0"), 50);
    setTimeout(() => updateMessage.firstElementChild.remove(), 350);
  }

  /**
   * Create delete overlay element
   * @returns {HTMLDivElement} Delete Overlay Element
   */
  createDeleteOverlayElement() {
    return createElement(
      "div",
      {
        class:
          "deleteArea cursor-pointer p-3 flex flex-col justify-center items-center",
      },
      createElement(
        "svg",
        {
          stroke: "currentColor",
          fill: "none",
          viewBox: "0 0 24 24",
          class: "h-10 w-10 text-white pointer-events-none",
        },
        createElement("path", {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "1.5",
          d: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
        })
      ),
      createElement(
        "span",
        { class: "text-lg font-bold mt-1 select-none pointer-events-none" },
        "Delete"
      )
    );
  }
  /**
   * Create Edit Mode Message Element
   * @returns {HTMLDivElement} Edit Mode Message Element
   */
  createEditModeMessage() {
    return createElement(
      "div",
      {
        class:
          "global-transition z-10 text-center px-4 py-3 bg-gray-50 rounded-md shadow-md",
      },
      "You're Currently in ",
      createElement(
        "span",
        { class: "font-semibold text-[#484FFA]" },
        "Edit Mode"
      ),
      " to leave, click the ",
      createElement(
        "span",
        { class: "font-semibold text-[#49A600]" },
        "Green Icon"
      )
    );
    // return createElement(
    //   "div",
    //   {
    //     class:
    //       "cursor-default text-black global-transition fixed bottom-5 right-3 left-3 opacity-0 flex justify-center items-center z-50",
    //     id: "editMessage",
    //   },
    //   createElement(
    //     "div",
    //     {
    //       class:
    //         "global-transition z-10 text-center px-4 py-3 bg-gray-50 rounded-md shadow-md",
    //     },
    //     "You're Currently in ",
    //     createElement(
    //       "span",
    //       { class: "font-semibold text-[#484FFA]" },
    //       "Edit Mode"
    //     ),
    //     " to leave, click the ",
    //     createElement(
    //       "span",
    //       { class: "font-semibold text-[#49A600]" },
    //       "Green Icon"
    //     )
    //   )
    // );
  }

  /**
   * Create a Update Message Element Popup Style.
   * @param {any} content - The message content. Can be a new child element or a string
   * @param {number} delay - delay value for delete
   * @returns A Update Message Element
   */
  createToastMessage(content, delay = 1) {
    const updateMessage = this.section.children.namedItem("updateMessage");
    const element = createElement(
      "div",
      {
        class:
          "global-transition z-10 relative text-center px-4 py-3 bg-gray-50 rounded-md shadow-md",
      },
      content
    );

    // Add element & animate
    updateMessage.prepend(element);
    this.toastMessageAnimation(updateMessage);

    // // Delete
    setTimeout(() => {
      updateMessage.firstElementChild.remove();
      if (updateMessage.childElementCount) return;
      updateMessage.classList.add("opacity-0");
    }, 1500 * delay);
  }
  /**
   * Update Message Animation Effects
   * @param {HTMLElement} element - Update Message Element
   */
  toastMessageAnimation(element) {
    setTimeout(() => element.classList.remove("opacity-0"), 350);
    setTimeout(() => {
      element.firstElementChild.classList.add("opacity-0");
    }, 2000);
  }
  /**
   * Removes the entry from the entries array, and from the DOM.
   * @param {string} idToRemove - Entry ID to remove
   */
  removeEntry(idToRemove) {
    this.entries = this.entries.filter(({ id }) => id !== idToRemove);
    this.container.children.namedItem(idToRemove).remove();
  }
}
