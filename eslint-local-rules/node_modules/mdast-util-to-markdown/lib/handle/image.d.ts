/**
 * Serialize an image node.
 *
 * @param {Image} node
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
export function image(node: Image, _: Parents | undefined, state: State, info: Info): string;
export namespace image {
    export { imagePeek as peek };
}
import type { Image } from 'mdast';
import type { Parents } from 'mdast';
import type { State } from 'mdast-util-to-markdown';
import type { Info } from 'mdast-util-to-markdown';
/**
 * Peek at this node.
 *
 * @returns {string}
 *   Start of the serialized markdown.
 */
declare function imagePeek(): string;
export {};
//# sourceMappingURL=image.d.ts.map