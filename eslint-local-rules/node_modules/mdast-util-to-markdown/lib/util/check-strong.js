/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */

/**
 * Checks the preferred strong option.
 *
 * @param {State} state
 *   Info passed around.
 * @returns {Exclude<Options['strong'], null | undefined>}
 *   Preferred strong marker.
 */
export function checkStrong(state) {
  const marker = state.options.strong || '*'

  if (marker !== '*' && marker !== '_') {
    throw new Error(
      'Cannot serialize strong with `' +
        marker +
        '` for `options.strong`, expected `*`, or `_`'
    )
  }

  return marker
}
