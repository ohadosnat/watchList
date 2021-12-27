import { ui } from "../main";

/** Finds the most popular entry in the array
 * @param {SearchResults["results"]} entries - The entries data array.
 * @returns {MovieListSearchResult | TVListSearchResult} The most popular entry from the given array.
 */
function findCorrectEntry(entries) {
  let max = 0;
  entries.forEach(({ popularity }) => (max = Math.max(popularity, max))); // find most popular
  const mostPopularEntry = entries.find(({ popularity }) => popularity === max); // find the entry

  // Check if the entry already exists in the UI
  const doesEntryExists = ui.entries.find(
    ({ title }) => title === mostPopularEntry.title
  );

  // Return the first result if the most popular entry already exists.
  if (doesEntryExists) return entries[0];
  return mostPopularEntry;
}

export default findCorrectEntry;
