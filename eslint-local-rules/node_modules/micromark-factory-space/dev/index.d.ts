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
export function factorySpace(effects: Effects, ok: State, type: TokenType, max?: number | undefined): State;
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
export function factorySpaceMinMax(effects: Effects, ok: State, nok: State, type: TokenType, min: number, max: number): State;
import type { Effects } from 'micromark-util-types';
import type { State } from 'micromark-util-types';
import type { TokenType } from 'micromark-util-types';
//# sourceMappingURL=index.d.ts.map