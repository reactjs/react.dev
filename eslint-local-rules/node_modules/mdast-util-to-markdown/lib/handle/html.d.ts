/**
 * Serialize an HTML node.
 *
 * @param {Html} node
 *   Node to serialize.
 * @returns {string}
 *   Serialized markdown.
 */
export function html(node: Html): string;
export namespace html {
    export { htmlPeek as peek };
}
import type { Html } from 'mdast';
/**
 * Peek at this node.
 *
 * @returns {string}
 *   Start of the serialized markdown.
 */
declare function htmlPeek(): string;
export {};
//# sourceMappingURL=html.d.ts.map