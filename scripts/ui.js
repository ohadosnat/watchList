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

        const html = `
        <div id="${film.id}" class="relative h-40 rounded-md overflow-hidden shadow-sm">
            <div id="filmCover" class="global-transition relative w-full h-full bg-cover bg-no-repeat bg-center scale-105"
                style="background-image: url(${film.backdrop_path});">
                <div 
                    class="absolute inset-0 bg-gradient-to-tr from-overlayBlack to-transparent bg-opacity-40 flex justify-start items-end">
                </div>
            </div>
            <div id="overlay" class="absolute inset-0 ">
            <div class="h-full pb-4 px-4 flex justify-end flex-col">
                <h2 class="font-bold text-sm">${film.title}</h2>
                <p class="font-ligh text-xs">${film.runtime}</p>
            </div>
            ${btn}
            </div>
        </div>
        `;

        this.films.push(film);
        this.list.innerHTML += html;
    }
}


