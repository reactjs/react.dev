/**
 * Write a virtual file to `streamOut`.
 * Ignored when `output` is given, more than one file was processed, or `out`
 * is false.
 *
 * @param {Context} context
 *   Context.
 * @param {VFile} file
 *   File.
 * @param {Callback} next
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */
export function stdout(context: Context, file: VFile, next: Callback): undefined;
import type { Context } from './index.js';
import type { VFile } from 'vfile';
import type { Callback } from 'trough';
//# sourceMappingURL=stdout.d.ts.map