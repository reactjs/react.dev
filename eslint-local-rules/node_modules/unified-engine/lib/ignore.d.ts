export class Ignore {
    /**
     * @param {Options} options
     *   Configuration.
     * @returns
     *   Self.
     */
    constructor(options: Options);
    /** @type {string} */
    cwd: string;
    /** @type {ResolveFrom | undefined} */
    ignorePathResolveFrom: ResolveFrom | undefined;
    /** @type {FindUp<Result>} */
    findUp: FindUp<Result>;
    /**
     * @param {string} filePath
     *   File path.
     * @param {Callback} callback
     *   Callback
     * @returns {undefined}
     *   Nothing.
     */
    check(filePath: string, callback: Callback): undefined;
}
/**
 * Callback.
 */
export type Callback = (error: Error | undefined, result?: boolean | undefined) => undefined;
/**
 * Configuration.
 */
export type Options = {
    /**
     *   Base.
     */
    cwd: string;
    /**
     *   Whether to detect ignore files.
     */
    detectIgnore: boolean | undefined;
    /**
     *   Basename of ignore files.
     */
    ignoreName: string | undefined;
    /**
     *   Explicit path to an ignore file.
     */
    ignorePath: URL | string | undefined;
    /**
     *   How to resolve.
     */
    ignorePathResolveFrom: ResolveFrom | undefined;
};
/**
 * How to resolve.
 */
export type ResolveFrom = "cwd" | "dir";
/**
 * Result.
 */
export type Result = ignore_.Ignore & ResultFields;
/**
 * Extra fields.
 */
export type ResultFields = {
    /**
     *   File path.
     */
    filePath: string;
};
import { FindUp } from './find-up.js';
import ignore_ from 'ignore';
//# sourceMappingURL=ignore.d.ts.map