/* Plan:
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
    async getEntryData(entry) {
        let searchData;
        if (entry.releaseYear != undefined) {
            // Searching an Entry with release year to grab id
            const entrySearch = await fetch(`https://api.themoviedb.org/3/search/${entry.type}?api_key=${this.key}&query=${entry.title}&year=${entry.releaseYear}`)
            searchData = await entrySearch.json();
        } else {
            // Searching an Entry to grab id
            const entrySearch = await fetch(`https://api.themoviedb.org/3/search/${entry.type}?api_key=${this.key}&query=${entry.title}`)
            searchData = await entrySearch.json();
        }
        // finds the result with the highest pupularity and returns the right result
        const entryPopularity = [];
        searchData.results.forEach(e => entryPopularity.push(e.popularity));
        let maxPopularity = Math.max(...entryPopularity);
        const result = searchData.results.find(e => e.popularity === maxPopularity)


        // Using the Entry's id to get more Information
        const entryInfo = await fetch(`https://api.themoviedb.org/3/${entry.type}/${result.id}?api_key=${this.key}`);
        const entryData = await entryInfo.json();



        // Structure the backdrop/poster path according to the API
        const backdrop_path = (entryData.backdrop_path === null) ? null : `${this.secure_base_url}${this.ImageSize}/${entryData.backdrop_path}`
        const poster_path = `${this.secure_base_url}${this.ImageSize}/${entryData.poster_path}`;

        // If it's a TV Show
        if (entry.type === "tv") {
            if (!entry.id) {
                const releaseYear = entryData.first_air_date.slice(0, 4);
                entry.id = `${entryData.name.replace(/[&:.!,' ]/g, "-").replace(/-{2,}/g, "-").toLowerCase()}_${releaseYear}`;
            };
            const result = {
                id: entry.id,
                title: entryData.name,
                runtime: this.timeConvert(entryData.episode_run_time[0]),
                backdrop_path,
                poster_path,
                watchStatus: entry.watchStatus,
                type: entry.type,
            }
            return result;
            // If it's a Movie
        } else {
            if (!entry.id) {
                const releaseYear = entryData.release_date.slice(0, 4)
                entry.id = `${entryData.title.replace(/[&:.!,' ]/g, "-").replace(/-{2,}/g, "-").toLowerCase()}_${releaseYear}`;
            }
            const result = {
                id: entry.id,
                title: entryData.title,
                runtime: this.timeConvert(entryData.runtime),
                backdrop_path,
                poster_path,
                watchStatus: entry.watchStatus,
                type: entry.type,
            }
            return result;
        }
    }
    // Converts the runtime into a string with values
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



