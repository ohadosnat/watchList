class APIdata {
    constructor() {
        this.key = '838716e49cbf582392d75874724aeb1f';
        this.id;
        this.secure_base_url = "https://image.tmdb.org/t/p/";
        this.poster_size = "original";
    }
    async getAPI() {
        const response = await fetch(`https://api.themoviedb.org/3/movie/550?api_key=${this.key}`);
        const data = await response.json();
        return data;
    }
    async getFilm(film) {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${this.key}&query=${film.title}&year=${film.releaseYear}`)
        const data = await response.json();
        const poster = `${this.secure_base_url}${this.poster_size}/${data.results[0].poster_path}`;
        const result = {
            title: data.results[0].title,
            releaseYear: data.results[0].release_date.slice(0, 4),
            poster_path: poster,
        }
        return result;

    }
    getPoster(url) {

        return poster;
    }
}



/*
getCollection()            searchFilm()                                                         render()
get firestore document -> search the document title on the api -> get information & poster -> display information on the site
*/