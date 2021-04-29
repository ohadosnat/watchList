class siteUI {
    constructor(list) {
        this.list = list;
        this.entries = [];
    }
    // used for the inital set of entries when the page loads + when adding a new entry (to make sure it will be at the top)
    render(entry) {
        let status = (entry.watchStatus ? "bg-watched" : "bg-didntWatch");
        let btn;
        if (entry.watchStatus) {
            btn = `
            <button id="watchToggle"
            class="${status} bg-no-repeat bg-center global-transition top-0 left-0 absolute w-10 h-10 bg-white rounded-br-md justify-center items-center flex">
            </button>
        `;
        } else {
            btn = `
            <button id="watchToggle"
            class="${status} bg-no-repeat bg-center global-transition top-0 left-0 absolute w-10 h-10 bg-white rounded-br-md justify-center items-center hidden opacity-0">
            </button>
            `;
        }
        const img = (entry.backdrop_path === null) ? entry.poster_path : entry.backdrop_path;
        // will add after thet "addCard" element
        addCard.insertAdjacentHTML('afterend', `
        <div id="${entry.id}" class="relative h-40 rounded-md overflow-hidden shadow-sm 2xl:h-52">
            <div id="entryCover" class="global-transition relative w-full h-full bg-cover bg-no-repeat bg-center scale-105"
                style="background-image: url(${img});">
                <div 
                    class="absolute inset-0 bg-gradient-to-tr from-overlayBlack to-transparent bg-opacity-40 flex justify-start items-end">
                </div>
            </div>
            <div id="overlay" class="absolute inset-0 ">
            <div class="h-full pb-4 px-4 flex justify-end flex-col">
                <h2 class="font-bold text-sm">${entry.title}</h2>
                <p class="font-light text-xs">${entry.runtime}</p>
            </div>
            ${btn}
            </div>
        </div>
        `);

        // To keep track of active entries (used in edit mode)
        this.entries.push(entry);
    }
    // to make sure that the next set of entries loads, it will be at the bottom and not at the top
    nextRender(entry) {
        let status = (entry.watchStatus ? "bg-watched" : "bg-didntWatch");
        let btn;
        if (entry.watchStatus) {
            btn = `
            <button id="watchToggle"
            class="${status} bg-no-repeat bg-center global-transition top-0 left-0 absolute w-10 h-10 bg-white rounded-br-md justify-center items-center flex">
            </button>
        `;
        } else {
            btn = `
            <button id="watchToggle"
            class="${status} bg-no-repeat bg-center global-transition top-0 left-0 absolute w-10 h-10 bg-white rounded-br-md justify-center items-center hidden opacity-0">
            </button>
            `;
        }
        const img = (entry.backdrop_path === null) ? entry.poster_path : entry.backdrop_path;
        const html = `
        <div id="${entry.id}" class="relative h-40 rounded-md overflow-hidden shadow-sm 2xl:h-52">
            <div id="entryCover" class="global-transition relative w-full h-full bg-cover bg-no-repeat bg-center scale-105"
                style="background-image: url(${img});">
                <div 
                    class="absolute inset-0 bg-gradient-to-tr from-overlayBlack to-transparent bg-opacity-40 flex justify-start items-end">
                </div>
            </div>
            <div id="overlay" class="absolute inset-0 ">
            <div class="h-full pb-4 px-4 flex justify-end flex-col">
                <h2 class="font-bold text-sm">${entry.title}</h2>
                <p class="font-light text-xs">${entry.runtime}</p>
            </div>
            ${btn}
            </div>
        </div>
        `;
        // adds at the bottom of the list
        this.list.innerHTML += html;
        // To keep track of active entries (used in edit mode)
        this.entries.push(entry);
    }
    // Update Message Animation Effects
    updateMessageAnimation(element) {
        setTimeout(() => element.classList.remove('opacity-0'), 1)
        setTimeout(() => element.firstElementChild.classList.add('opacity-0'), 2000)
        setTimeout(() => element.removeChild(element.firstElementChild), 2500)
    }
    EnterEditMode(entry) {
        //  removes the scroll event (to prevent more loading while scrolling during edit mode)
        section.removeEventListener('scroll', scrollHandle);

        // adds edit mode overlay to all cards
        for (let i = 0; i < this.entries.length; i++) {
            const mainDiv = container.children.namedItem(entry[i].id);
            const editOverlay = mainDiv.children.entryCover.firstElementChild;
            const html = `
            <div id="deleteArea" class="cursor-pointer p-3 flex flex-col justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-lg font-bold mt-1 select-none">Delete</span>
            `;
            editOverlay.innerHTML = "";
            editOverlay.classList.remove('bg-gradient-to-tr', 'from-overlayBlack', 'to-transparent', 'justify-start', 'items-end')
            editOverlay.classList.add('bg-red-900', 'global-transition', 'z-20', 'flex-col', 'justify-center', 'items-center', 'transform', 'hover:bg-opacity-90', 'hover:scale-105')
            editOverlay.innerHTML += html;
        };
        container.children.addCard.classList.replace('flex', 'hidden');
        if (container.children.addForm) { container.children.addForm.remove(); }
        editBtn.classList.add('hidden');
        saveEditBtn.classList.remove('hidden');

        // Update Message
        container.insertAdjacentHTML('beforeBegin', `
        <div id="editMessage" class="global-transition fixed bottom-5 right-3 left-3 opacity-0 flex justify-center items-center z-50">
            <div class="global-transition z-10 absolute bottom-0 text-center px-4 py-3 bg-gray-50 rounded-md shadow-md">
                    You're Currently in
                    <span class="font-semibold text-[#484FFA]">Edit Mode</span> to leave, click the
                    <span class="font-semibold text-[#49A600]">Green Icon</span>
            </div>
        </div>`);
        setTimeout(() => editMessage.classList.remove('opacity-0'), 100)
    }

    ExitEditMode(entry) {
        // adds the scroll event again (to allow the user to scroll and load more entries)
        section.addEventListener('scroll', scrollHandle);
        // removes edit mode overlay from all cards
        for (let i = 0; i < this.entries.length; i++) {
            if (container.children.namedItem(entry[i].id) != null) {
                const mainDiv = container.children.namedItem(entry[i].id);
                const editOverlay = mainDiv.children.entryCover.firstElementChild;
                editOverlay.innerHTML = "";
                editOverlay.classList.remove('bg-red-900', 'global-transition', 'z-20', 'flex-col', 'justify-center', 'items-center', 'transform', 'hover:bg-opacity-90', 'hover:scale-105')
                editOverlay.classList.add('bg-gradient-to-tr', 'from-overlayBlack', 'to-transparent', 'justify-start', 'items-end');
            }
        };

        setTimeout(() => editMessage.classList.add('opacity-0'), 50)
        setTimeout(() => editMessage.remove(), 350)

        container.children.addCard.classList.replace('hidden', 'flex');
        saveEditBtn.classList.add('hidden');
        editBtn.classList.remove('hidden');

    }
}