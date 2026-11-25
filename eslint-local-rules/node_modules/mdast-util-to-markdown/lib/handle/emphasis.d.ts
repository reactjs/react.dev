/**
 * Serialize an emphasis node.
 *
 * Attention is properly handled by `containerPhrasing`.
 *
 * @param {Emphasis} node
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
export function emphasis(node: Emphasis, _: Parents | undefined, state: State, info: Info): string;
export namespace emphasis {
    export { attention };
    export { peek };
}
import type { Emphasis } from 'mdast';
import type { Parents } from 'mdast';
import type { State } from 'mdast-util-to-markdown';
import type { Info } from 'mdast-util-to-markdown';
/**
 * Serialize an emphasis node as attention.
 *
 * @param {Emphasis} _
 *   Node to serialize.
 * @param {State} state
 *   Info passed around.
 * @returns {AttentionInfo}
 *   Info on how to serialize the node.
 */
declare function attention(_: Emphasis, state: State): AttentionInfo;
/**
 * Peek at this node.
 *
 * @param {Emphasis} _
 *   Node to serialize.
 * @param {Parents | undefined} _1
 *   Parent node.
 * @param {State} state
 *   Info passed around.
 * @returns {string}
 *   Start of the serialized markdown.
 */
declare function peek(_: Emphasis, _1: Parents | undefined, state: State): string;
import type { AttentionInfo } from 'mdast-util-to-markdown';
export {};
//# sourceMappingURL=emphasis.d.ts.map