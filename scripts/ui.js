class siteUI {
    constructor(list) {
        this.list = list;
        this.films = [];
    }
    render(film) {
        let status = (film.watchStatus ? "bg-watched" : "bg-didntWatch");
        let btn;
        if (film.watchStatus) {
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

        const img = (film.backdrop_path === null) ? film.poster_path : film.backdrop_path;
        const html = `
        <div id="${film.id}" class="relative h-40 rounded-md overflow-hidden shadow-sm 2xl:h-52">
            <div id="filmCover" class="global-transition relative w-full h-full bg-cover bg-no-repeat bg-center scale-105"
                style="background-image: url(${img});">
                <div 
                    class="absolute inset-0 bg-gradient-to-tr from-overlayBlack to-transparent bg-opacity-40 flex justify-start items-end">
                </div>
            </div>
            <div id="overlay" class="absolute inset-0 ">
            <div class="h-full pb-4 px-4 flex justify-end flex-col">
                <h2 class="font-bold text-sm">${film.title}</h2>
                <p class="font-light text-xs">${film.runtime}</p>
            </div>
            ${btn}
            </div>
        </div>
        `;

        this.films.push(film);
        this.list.innerHTML += html;
    }
    // Update Message Animation Effects
    updateMessageAnimation(element) {
        setTimeout(() => element.classList.remove('opacity-0'), 1)
        setTimeout(() => element.firstElementChild.classList.add('opacity-0'), 2000)
        setTimeout(() => element.removeChild(element.firstElementChild), 2500)
    }
    EnterEditMode(entry) {
        // adds edit mode overlay to all cards
        for (let i = 0; i < myList.films.length; i++) {
            const mainDiv = container.children.namedItem(entry[i].id);
            const editOverlay = mainDiv.children.filmCover.firstElementChild;
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
    }

    ExitEditMode(entry) {
        // adds edit mode overlay to all cards
        console.log(entry)
        for (let i = 0; i < myList.films.length; i++) {
            if (container.children.namedItem(entry[i].id) != null) {
                const mainDiv = container.children.namedItem(entry[i].id);
                const editOverlay = mainDiv.children.filmCover.firstElementChild;
                editOverlay.innerHTML = "";
                editOverlay.classList.remove('bg-red-900', 'global-transition', 'z-20', 'flex-col', 'justify-center', 'items-center', 'transform', 'hover:bg-opacity-90', 'hover:scale-105')
                editOverlay.classList.add('bg-gradient-to-tr', 'from-overlayBlack', 'to-transparent', 'justify-start', 'items-end');
            }
        };
        container.children.addCard.classList.replace('hidden', 'flex');
        saveEditBtn.classList.add('hidden');
        editBtn.classList.remove('hidden');
    }
}