/**
 * @import {Options, State} from 'mdast-util-to-markdown'
 */

/**
 * Checks the preferred quote option.
 *
 * @param {State} state
 *   Info passed around.
 * @returns {Exclude<Options['quote'], null | undefined>}
 *   Preferred quote.
 */
export function checkQuote(state) {
  const marker = state.options.quote || '"'

  if (marker !== '"' && marker !== "'") {
    throw new Error(
      'Cannot serialize title with `' +
        marker +
        '` for `options.quote`, expected `"`, or `\'`'
    )
  }

  return marker
}
