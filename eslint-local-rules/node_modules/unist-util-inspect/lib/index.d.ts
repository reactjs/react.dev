/**
 * Inspect a node, without color.
 *
 * @param {unknown} tree
 *   Tree to inspect.
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration.
 * @returns {string}
 *   Pretty printed `tree`.
 */
export function inspect(tree: unknown, options?: Readonly<Options> | null | undefined): string;
/**
 * Inspect a node, without color.
 *
 * @deprecated
 *   Use `inspect` instead, with `color: false`.
 * @param {unknown} tree
 *   Tree to inspect.
 * @param {Readonly<Omit<Options, 'color'>> | null | undefined} [options]
 *   Configuration.
 * @returns {string}
 *   Pretty printed `tree`.
 */
export function inspectNoColor(tree: unknown, options?: Readonly<Omit<Options, "color">> | null | undefined): string;
/**
 * Inspects a node, using color.
 *
 * @deprecated
 *   Use `inspect` instead, with `color: true`.
 * @param {unknown} tree
 *   Tree to inspect.
 * @param {Readonly<Omit<Options, 'color'>> | null | undefined} [options]
 *   Configuration (optional).
 * @returns {string}
 *   Pretty printed `tree`.
 */
export function inspectColor(tree: unknown, options?: Readonly<Omit<Options, "color">> | null | undefined): string;
import type { Options } from 'unist-util-inspect';
//# sourceMappingURL=index.d.ts.map