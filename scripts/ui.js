class siteUI {
    constructor(list) {
        this.list = list;
    }
    render(film) {
        const html = `
        <div class="list-group-item">
        <img src="${film.poster_path}" alt="${film.title}">
        <div>${film.title}</div>
        <div>${film.releaseYear}</div>
        </div>
        `;

        this.list.innerHTML += html;
    }
}