/**
 * Color a string.
 *
 * @param {string} d
 *   Value.
 * @returns {string}
 *   Colored value.
 */
export function color(d) {
  return '\u001B[33m' + d + '\u001B[39m'
}
