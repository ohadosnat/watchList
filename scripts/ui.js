class siteUI {
    constructor(list) {
        this.list = list;
    }
    render(film) {
        const html = `
        <div id="boxContent" class="relative h-40 rounded-md overflow-hidden">
            <div class="global-transition relative w-full h-full bg-cover bg-no-repeat bg-center scale-110"
                style="background-image: url(${film.poster_path});">
                <div data-name="overlay"
                    class="absolute inset-0 bg-gradient-to-tr from-overlayBlack bg-opacity-20 flex justify-start items-end">
                </div>
            </div>
            <div class="absolute left-3 bottom-3">
                <h2 class="font-bold text-sm">${film.title}</h2>
                <p class="font-ligh text-xs">${film.releaseYear}</p>
            </div>
            <button id="watchToggle"
                class="global-transition top-0 left-0 absolute w-10 h-10 bg-white rounded-br-md justify-center items-center hidden opacity-0">
                <img src="./css/icons/ic_eye-empty.svg" alt="">
            </button>
        </div>
        `;

        this.list.innerHTML += html;
    }
}


