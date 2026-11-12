/**
 * Serialize an image reference node.
 *
 * @param {ImageReference} node
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
export function imageReference(node: ImageReference, _: Parents | undefined, state: State, info: Info): string;
export namespace imageReference {
    export { imageReferencePeek as peek };
}
import type { ImageReference } from 'mdast';
import type { Parents } from 'mdast';
import type { State } from 'mdast-util-to-markdown';
import type { Info } from 'mdast-util-to-markdown';
/**
 * Peek at this node.
 *
 * @returns {string}
 *   Start of the serialized markdown.
 */
declare function imageReferencePeek(): string;
export {};
//# sourceMappingURL=image-reference.d.ts.map