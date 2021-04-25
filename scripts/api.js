/*
getCollection()            searchFilm()                                                         render()
get firestore document -> search the document title on the api -> get information & poster -> display information on the site
*/

class APIdata {
    constructor() {
        this.key = '838716e49cbf582392d75874724aeb1f';
        this.id;
        this.secure_base_url = "https://image.tmdb.org/t/p/";
        this.ImageSize = "original";
    }
    async getAPI() {
        const response = await fetch(`https://api.themoviedb.org/3/movie/550?api_key=${this.key}`);
        const data = await response.json();
        return data;
    }
    async getFilm(film) {
        // Searching Film to grab id
        const filmSearch = await fetch(`https://api.themoviedb.org/3/search/${film.info.type}?api_key=${this.key}&query=${film.info.title}&year=${film.info.releaseYear}`)
        const searchData = await filmSearch.json();


        // Using the Film id to get more Information
        const filmInfo = await fetch(`https://api.themoviedb.org/3/${film.info.type}/${searchData.results[0].id}?api_key=${this.key}`);
        const filmData = await filmInfo.json();

        const backdrop_path = `${this.secure_base_url}${this.ImageSize}/${filmData.backdrop_path}`;
        const poster_path = `${this.secure_base_url}${this.ImageSize}/${filmData.poster_path}`;
        const result = {
            id: film.id,
            title: filmData.title,
            runtime: this.timeConvert(filmData.runtime),
            backdrop_path,
            poster_path,
            watchStatus: film.info.watchStatus,
            type: film.info.type
        }
        return result;

    }
    timeConvert(runtime) {
        const hours = Math.floor(runtime / 60);
        const minutes = runtime % 60;
        return `${hours}h ${minutes}m`
    }
}



