/**
 * @template {FindValue} Value
 *   Value to find.
 */
export class FindUp<Value extends FindValue> {
    /**
     * @param {Options<Value>} options
     *   Configuration.
     * @returns
     *   Self.
     */
    constructor(options: Options<Value>);
    /** @type {Record<string, Array<Callback<Value>> | Value | Error | undefined>} */
    cache: Record<string, Array<Callback<Value>> | Value | Error | undefined>;
    /** @type {string} */
    cwd: string;
    /** @type {boolean | undefined} */
    detect: boolean | undefined;
    /** @type {Array<string>} */
    names: Array<string>;
    /** @type {Create<Value>} */
    create: Create<Value>;
    /** @type {string | undefined} */
    givenFilePath: string | undefined;
    /** @type {Array<Callback<Value>> | Error | Value | undefined} */
    givenFile: Array<Callback<Value>> | Error | Value | undefined;
    /**
     * @param {string} filePath
     *   File path to look from.
     * @param {Callback<Value>} callback
     *   Callback called when done.
     * @returns {undefined}
     *   Nothing.
     */
    load(filePath: string, callback: Callback<Value>): undefined;
}
/**
 * Callback called when something is found.
 */
export type Callback<Value> = (error: Error | undefined, result?: Value | undefined) => undefined;
/**
 * Transform a file to a certain value.
 */
export type Create<Value> = (value: Buffer, filePath: string) => Promise<Value | undefined> | Value | undefined;
/**
 * Bare interface of value.
 */
export type FindValue = {
    /**
     *   File path.
     */
    filePath: string | undefined;
};
/**
 * Configuration.
 */
export type Options<Value> = {
    /**
     *   Base.
     */
    cwd: string;
    /**
     *   File path of a given file.
     */
    filePath: URL | string | undefined;
    /**
     * Whether to detect files (default: `false`).
     */
    detect?: boolean | undefined;
    /**
     *   Basenames of files to look for.
     */
    names: Array<string>;
    /**
     *   Turn a found file into a value.
     */
    create: Create<Value>;
};
//# sourceMappingURL=find-up.d.ts.map