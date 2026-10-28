/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */

/**
 * Checks the preferred emphasis option.
 *
 * @param {State} state
 *   Info passed around.
 * @returns {Exclude<Options['emphasis'], null | undefined>}
 *   Preferred emphasis marker.
 */
export function checkEmphasis(state) {
  const marker = state.options.emphasis || '*'

  if (marker !== '*' && marker !== '_') {
    throw new Error(
      'Cannot serialize emphasis with `' +
        marker +
        '` for `options.emphasis`, expected `*`, or `_`'
    )
  }

  return marker
}
