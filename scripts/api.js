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
        let searchData;
        if (film.releaseYear != undefined) {
            // Searching Film with release year to grab id
            const filmSearch = await fetch(`https://api.themoviedb.org/3/search/${film.type}?api_key=${this.key}&query=${film.title}&year=${film.releaseYear}`)
            searchData = await filmSearch.json();
        } else {
            // Searching Film to grab id
            const filmSearch = await fetch(`https://api.themoviedb.org/3/search/${film.type}?api_key=${this.key}&query=${film.title}}`)
            searchData = await filmSearch.json();
        }


        // Using the Film id to get more Information
        const filmInfo = await fetch(`https://api.themoviedb.org/3/${film.type}/${searchData.results[0].id}?api_key=${this.key}`);
        const filmData = await filmInfo.json();




        const backdrop_path = (filmData.backdrop_path === null) ? null : `${this.secure_base_url}${this.ImageSize}/${filmData.backdrop_path}`
        const poster_path = `${this.secure_base_url}${this.ImageSize}/${filmData.poster_path}`;

        if (film.type === "tv") {
            if (!film.id) {
                const releaseYear = filmData.first_air_date.slice(0, 4)
                film.id = `${filmData.name.replace(/[&:.!,' ]/g, "-").replace(/-{2,}/g, "-").toLowerCase()}_${releaseYear}`;
            }
            const result = {
                id: film.id,
                title: filmData.name,
                runtime: this.timeConvert(filmData.episode_run_time[0]),
                backdrop_path,
                poster_path,
                watchStatus: film.watchStatus,
                type: film.type,
            }
            return result;
        } else {
            if (!film.id) {
                const releaseYear = filmData.release_date.slice(0, 4)
                film.id = `${filmData.title.replace(/[&:.!,' ]/g, "-").replace(/-{2,}/g, "-").toLowerCase()}_${releaseYear}`;
            }
            const result = {
                id: film.id,
                title: filmData.title,
                runtime: this.timeConvert(filmData.runtime),
                backdrop_path,
                poster_path,
                watchStatus: film.watchStatus,
                type: film.type,
            }
            return result;
        }
    }
    timeConvert(runtime) {
        const hours = Math.floor(runtime / 60);
        const minutes = runtime % 60;
        if (hours === 0 && minutes === 0) {
            return `TBA`
        } else if (hours === 0) {
            return `${minutes}m`;
        } else if (minutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${minutes}m`;
        }
    }
}



