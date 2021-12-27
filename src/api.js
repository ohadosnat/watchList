/// <reference path="./types/types.js" />

import findCorrectEntry from "./utils/findMostPopular";
import { timeConvert } from "./utils/timeConvert";

export class APIData {
  constructor() {
    this.key = import.meta.env.VITE_TMDB_API_KEY;
  }

  /**
   * Search an entry inside TMDB API.
   * @param {FirestoreEntry} entry
   * @returns {Promise<SearchResults>} Search results object
   */
  async searchEntry(entry) {
    let requestURL = `https://api.themoviedb.org/3/search/${entry.type}?api_key=${this.key}&query=${entry.title}`;
    if (entry.releaseYear) requestURL += `&year=${entry.releaseYear}`;

    const res = await fetch(requestURL);
    return await res.json();
  }

  /**
   * Get entry info from TMDB API
   * @param {FirestoreEntry["type"]} type - Type of entry
   * @param {string} title - the entry id
   * @returns {Promise<MoveResultByID | TVResultByID>} - Entry Object
   */
  async getEntryData(type, id) {
    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${this.key}`
    );
    return await res.json();
  }
  /**
   * Get Entry Data and formats it to `Entry` type.
   * @param {FirestoreEntry} entry - Firestore Entry Document
   * @param {boolean} isInital - Decides if to take the first result from the search of take the most popular.
   *
   * On initial load, we fetch documents with the correct title so we can assume the title is right and we can take the first result from our search.
   *
   * if not, then take the most popular result from our search.
   * @returns {Promise<Entry>} Formatted Entry Object
   */
  async getEntry(entry, isInital = false) {
    // Search
    const searchResults = await this.searchEntry(entry);
    if (searchResults.status_code) {
      throw new Error("There was a problem getting this title");
    }
    if (!searchResults.total_results) {
      throw new Error(`We couldn't find ${entry.title}`);
    }

    // Find most popular & Get Data
    /** @type {Entry} */
    const formattedEntry = {};
    let correctEntry;

    // if it's the first time, take the first result since the title is correct.
    // otherwise, find the correct entry.
    if (isInital) correctEntry = searchResults.results[0];
    else correctEntry = findCorrectEntry(searchResults.results);

    const entryData = await this.getEntryData(entry.type, correctEntry.id);

    // Format Data
    formattedEntry["image"] = `https://image.tmdb.org/t/p/${
      entryData.backdrop_path
        ? `w300/${entryData.backdrop_path}`
        : `w342/${entryData.poster_path}`
    }`;

    const entryTitle = entryData?.name || entryData?.title;
    if (!entry.id) {
      const releaseYear =
        entryData.release_date?.slice(0, 4) ||
        entryData.first_air_date?.slice(0, 4);

      formattedEntry["id"] = `${entryTitle
        .replace(/[&:.!,' ]/g, "-")
        .replace(/-{2,}/g, "-")
        .toLowerCase()}_${releaseYear}`;
    } else formattedEntry["id"] = entry.id.toLowerCase();

    formattedEntry["runtime"] =
      entry.type === "tv"
        ? timeConvert(entryData.episode_run_time[0])
        : timeConvert(entryData.runtime);

    Object.assign(formattedEntry, {
      title: entryTitle,
      watchStatus: entry.watchStatus || false,
      type: entry.type,
    });

    return formattedEntry;
  }
}
