/**
 * Queue all files which came this far.
 * When the last file gets here, run the file-set pipeline and flush the queue.
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
export function queue(context: Context, file: VFile, next: Callback): undefined;
import type { Context } from './index.js';
import type { VFile } from 'vfile';
import type { Callback } from 'trough';
//# sourceMappingURL=queue.d.ts.map