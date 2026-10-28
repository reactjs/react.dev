/**
 * Get the first character of a value.
 *
 * Is aware of astral characters (such as emoji).
 *
 * @param {string} value
 *   Value.
 * @returns {string}
 *   First character; empty if `value` is empty.
 */
export function firstCharacter(value) {
  const code = value.codePointAt(0)
  return code === undefined ? '' : String.fromCodePoint(code)
}

/**
 * Get the last character of a value.
 *
 * Is aware of astral characters (such as emoji).
 *
 * @param {string} value
 *   Value.
 * @returns {string}
 *   Last character; empty if `value` is empty.
 */
export function lastCharacter(value) {
  // Only a surrogate pair gives a code point above the BMP.
  const code = value.codePointAt(value.length - 2)
  return code !== undefined && code > 0xff_ff
    ? value.slice(-2)
    : value.slice(-1)
}
