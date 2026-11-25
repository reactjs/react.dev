/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */

/**
 * Checks the preferred rule option.
 *
 * @param {State} state
 *   Info passed around.
 * @returns {Exclude<Options['rule'], null | undefined>}
 *   Preferred rule marker.
 */
export function checkRule(state) {
  const marker = state.options.rule || '*'

  if (marker !== '*' && marker !== '-' && marker !== '_') {
    throw new Error(
      'Cannot serialize rules with `' +
        marker +
        '` for `options.rule`, expected `*`, `-`, or `_`'
    )
  }

  return marker
}
