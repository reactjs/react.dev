/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */

/**
 * Checks the preferred fence option.
 *
 * @param {State} state
 *   Info passed around.
 * @returns {Exclude<Options['fence'], null | undefined>}
 *   Preferred fence marker.
 */
export function checkFence(state) {
  const marker = state.options.fence || '`'

  if (marker !== '`' && marker !== '~') {
    throw new Error(
      'Cannot serialize code with `' +
        marker +
        '` for `options.fence`, expected `` ` `` or `~`'
    )
  }

  return marker
}
