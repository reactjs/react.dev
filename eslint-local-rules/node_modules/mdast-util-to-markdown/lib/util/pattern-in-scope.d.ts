/**
 * @import {ConstructName, Unsafe} from 'mdast-util-to-markdown'
 */
/**
 * Check if a pattern is in scope based on the current stack of constructs.
 *
 * @param {Array<ConstructName>} stack
 *   Current stack of constructs.
 * @param {Unsafe} pattern
 *   Pattern to check.
 * @returns {boolean}
 *   Whether the pattern is in scope.
 */
export function patternInScope(stack: Array<ConstructName>, pattern: Unsafe): boolean;
import type { ConstructName } from 'mdast-util-to-markdown';
import type { Unsafe } from 'mdast-util-to-markdown';
//# sourceMappingURL=pattern-in-scope.d.ts.map