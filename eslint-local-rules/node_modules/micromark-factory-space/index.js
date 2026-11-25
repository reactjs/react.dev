/**
 * @import {Effects, State, TokenType} from 'micromark-util-types'
 */

import { markdownSpace } from 'micromark-util-character';

// To do: implement `spaceOrTabWithOptions` (`connect`, `content`).

/**
 * Parse spaces and tabs.
 *
 * There is no `nok` parameter:
 *
 * *   spaces in markdown are often optional, in which case this factory can be
 *     used and `ok` will be switched to whether spaces were found or not
 * *   one line ending or space can be detected with `markdownSpace(code)` right
 *     before using `factorySpace`
 *
 * ###### Examples
 *
 * Where `␉` represents a tab (plus how much it expands) and `␠` represents a
 * single space.
 *
 * ```markdown
 * ␉
 * ␠␠␠␠
 * ␉␠
 * ```
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {TokenType} type
 *   Type of the whole whitespace.
 * @param {number | undefined} [max=Infinity]
 *   Max (exclusive).
 * @returns {State}
 *   Start state.
 */
export function factorySpace(effects, ok, type, max) {
  const limit = max ? max - 1 : Infinity;
  let size = 0;
  return start;

  /** @type {State} */
  function start(code) {
    if (markdownSpace(code)) {
      effects.enter(type);
      return prefix(code);
    }
    return ok(code);
  }

  /** @type {State} */
  function prefix(code) {
    if (markdownSpace(code) && size++ < limit) {
      effects.consume(code);
      return prefix;
    }
    effects.exit(type);
    return ok(code);
  }
}

/**
 * Parse spaces and tabs, with a required minimum and maximum, matching
 * `markdown-rs`’s `space_or_tab_min_max`.
 *
 * Unlike `factorySpace`, this can fail: `nok` is used when fewer than
 * `min` spaces or tabs are found.
 *
 * @param {Effects} effects
 *   Context.
 * @param {State} ok
 *   State switched to when successful.
 * @param {State} nok
 *   State switched to when unsuccessful.
 * @param {TokenType} type
 *   Type of the whole whitespace.
 * @param {number} min
 *   Minimum allowed characters (inclusive).
 * @param {number} max
 *   Maximum allowed characters (inclusive).
 * @returns {State}
 *   Start state.
 */
export function factorySpaceMinMax(effects, ok, nok, type, min, max) {
  let size = 0;
  return start;

  /** @type {State} */
  function start(code) {
    if (max > 0 && markdownSpace(code)) {
      effects.enter(type);
      return prefix(code);
    }
    return after(code);
  }

  /** @type {State} */
  function prefix(code) {
    if (markdownSpace(code) && size < max) {
      effects.consume(code);
      size++;
      return prefix;
    }
    effects.exit(type);
    return after(code);
  }

  /** @type {State} */
  function after(code) {
    return size >= min ? ok(code) : nok(code);
  }
}