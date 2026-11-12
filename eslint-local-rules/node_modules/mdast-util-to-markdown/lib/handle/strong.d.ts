/**
 * Serialize a strong node.
 *
 * Attention is properly handled by `containerPhrasing`.
 *
 * @param {Strong} node
 *   Node to serialize.
 * @param {Parents | undefined} _
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @param {Info} info
 *   Info on surrounding context.
 * @returns {string}
 *   Serialized markdown.
 */
export function strong(node: Strong, _: Parents | undefined, state: State, info: Info): string;
export namespace strong {
    export { attention };
    export { peek };
}
import type { Strong } from 'mdast';
import type { Parents } from 'mdast';
import type { State } from 'mdast-util-to-markdown';
import type { Info } from 'mdast-util-to-markdown';
/**
 * Serialize a strong node as attention.
 *
 * @param {Strong} _
 *   Node to serialize.
 * @param {State} state
 *   Info passed around.
 * @returns {AttentionInfo}
 *   Info on how to serialize the node.
 */
declare function attention(_: Strong, state: State): AttentionInfo;
/**
 * Peek at this node.
 *
 * @param {Strong} _
 *   Node to serialize.
 * @param {Parents | undefined} _1
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Start of the serialized markdown.
 */
declare function peek(_: Strong, _1: Parents | undefined, state: State): string;
import type { AttentionInfo } from 'mdast-util-to-markdown';
export {};
//# sourceMappingURL=strong.d.ts.map