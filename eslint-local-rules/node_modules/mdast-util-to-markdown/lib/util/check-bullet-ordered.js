/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */

/**
 * Checks the preferred ordered list bullet option.
 *
 * @param {State} state
 *   Info passed around.
 * @returns {Exclude<Options['bulletOrdered'], null | undefined>}
 *   Preferred ordered list bullet.
 */
export function checkBulletOrdered(state) {
  const marker = state.options.bulletOrdered || '.'

  if (marker !== '.' && marker !== ')') {
    throw new Error(
      'Cannot serialize items with `' +
        marker +
        '` for `options.bulletOrdered`, expected `.` or `)`'
    )
  }

  return marker
}
