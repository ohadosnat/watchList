/**
 * Converts the runtime into a string with values
 * @param {number} runtime - runtime value
 * @returns {string} with the correct runtime format
 */
export function timeConvert(runtime) {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (hours === 0 && minutes === 0) {
    return `TBA`;
  } else if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}
