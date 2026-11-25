/**
 * @typedef {1 | 2 | 3 | 4 | 5 | 6 | 7} Kind
 *   Kind of HTML (flow) element.
 */
/**
 * Infer the kind of HTML that `value` is.
 *
 * This works on valid trees as produced by `micromark`.
 * Kinds:
 *
 * 1. raw
 * 2. comment
 * 3. instruction
 * 4. declaration
 * 5. cdata
 * 6. block
 * 7. other
 *
 * See: <https://spec.commonmark.org/0.31.2/#html-blocks>.
 *
 * @param {string} value
 *   HTML.
 * @returns {Kind | undefined}
 *   Kind; `undefined` if unknown.
 */
export function htmlKind(value: string): Kind | undefined;
/**
 * Kind of HTML (flow) element.
 */
export type Kind = 1 | 2 | 3 | 4 | 5 | 6 | 7;
//# sourceMappingURL=html-kind.d.ts.map