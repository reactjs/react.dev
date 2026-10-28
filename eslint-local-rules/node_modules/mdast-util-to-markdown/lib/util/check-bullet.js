/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */

/**
 * Checks the preferred list bullet option.
 *
 * @param {State} state
 *   Info passed around.
 * @returns {Exclude<Options['bullet'], null | undefined>}
 *   Preferred list bullet.
 */
export function checkBullet(state) {
  const marker = state.options.bullet || '*'

  if (marker !== '*' && marker !== '+' && marker !== '-') {
    throw new Error(
      'Cannot serialize items with `' +
        marker +
        '` for `options.bullet`, expected `*`, `+`, or `-`'
    )
  }

  return marker
}
