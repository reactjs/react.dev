/**
 * @import {IndentLines} from '../types.js'
 */

const eol = /\r?\n|\r/g

/**
 * Indents each line.
 *
 * @type {IndentLines}
 */
export function indentLines(value, map) {
  /** @type {Array<string>} */
  const result = []
  let start = 0
  let line = 0
  /** @type {RegExpExecArray | null} */
  let match

  while ((match = eol.exec(value))) {
    one(value.slice(start, match.index))
    result.push(match[0])
    start = match.index + match[0].length
    line++
  }

  one(value.slice(start))

  return result.join('')

  /**
   * Indents a single line.
   *
   * @param {string} value
   *   Line.
   */
  function one(value) {
    result.push(map(value, line, !value))
  }
}
