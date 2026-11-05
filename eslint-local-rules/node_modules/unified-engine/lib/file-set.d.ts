export class FileSet extends EventEmitter<any> {
    /**
     * FileSet.
     *
     * A FileSet is created to process multiple files through unified processors.
     * This set, containing all files, is exposed to plugins as an argument to the
     * attacher.
     */
    constructor();
    /**
     * @deprecated
     *   Internal field that should be considered private.
     * @type {number}
     */
    actual: number;
    /**
     * This is used by the `queue` to stash async work.
     *
     * @deprecated
     *   Internal field that should be considered private.
     * @type {Record<string, Function>}
     */
    complete: Record<string, Function>;
    /**
     * @deprecated
     *   Internal field that should be considered private.
     * @type {number}
     */
    expected: number;
    /**
     * @deprecated
     *   Internal field that should be considered private.
     * @type {Array<VFile>}
     */
    files: Array<VFile>;
    /**
     * @deprecated
     *   Internal field that should be considered private.
     * @type {Array<string>}
     */
    origins: Array<string>;
    /**
     * @deprecated
     *   Internal field that should be considered private.
     * @type {Pipeline}
     */
    pipeline: Pipeline;
    /**
     * @deprecated
     *   Internal field that should be considered private.
     * @type {Array<Completer>}
     */
    plugins: Array<Completer>;
    /**
     * Get files in a set.
     */
    valueOf(): VFile[];
    /**
     * Add middleware to be called when done.
     *
     * @param {Completer} completer
     *   Plugin.
     * @returns
     *   Self.
     */
    use(completer: Completer): this;
    /**
     * Add a file.
     *
     * The given file is processed like other files with a few differences:
     *
     * *   Ignored when their file path is already added
     * *   Never written to the file system or `streamOut`
     * *   Not included in the  report
     *
     * @param {VFile | string} file
     *   File or file path.
     * @returns
     *   Self.
     */
    add(file: VFile | string): this;
}
/**
 * Completer.
 */
export type Completer = (CompleterCallback | CompleterRegular) & {
    pluginId?: string | symbol | undefined;
};
/**
 * Handle a set having processed, in callback-style.
 */
export type CompleterCallback = (set: FileSet, next: CompleterCallbackNext) => undefined | void;
/**
 * Callback called when done.
 */
export type CompleterCallbackNext = (error?: Error | null | undefined) => undefined;
/**
 * Handle a set having processed.
 */
export type CompleterRegular = (set: FileSet) => Promise<undefined> | undefined | void;
import { EventEmitter } from 'node:events';
import { VFile } from 'vfile';
import type { Pipeline } from 'trough';
//# sourceMappingURL=file-set.d.ts.map