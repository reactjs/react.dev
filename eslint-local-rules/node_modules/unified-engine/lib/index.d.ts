/**
 * Process.
 *
 * @param {Options} options
 *   Configuration (required).
 * @param {Callback} callback
 *   Callback.
 * @returns {undefined}
 *   Nothing.
 */
export function engine(options: Options, callback: Callback): undefined;
/**
 * Callback called when done.
 *
 * Called with a fatal error if things went horribly wrong (probably due to
 * incorrect configuration), or a status code and the processing context.
 */
export type Callback = (error: Error | undefined, code?: 0 | 1 | undefined, context?: Context | undefined) => undefined | void;
/**
 * Processing context.
 */
export type Context = {
    /**
     *   Internally used info.
     */
    fileSet: FileSet;
    /**
     *   Processed files.
     */
    files: Array<VFile>;
};
/**
 * Configuration.
 *
 * > 👉 **Note**: `options.processor` is required.
 */
export type Options = {
    /**
     * Whether to always serialize successfully processed files (default:
     * `false`).
     */
    alwaysStringify?: boolean | undefined;
    /**
     * Whether to report with ANSI color sequences (default: `false`); given to
     * the reporter.
     */
    color?: boolean | undefined;
    /**
     * Transform config files from a different schema (optional).
     */
    configTransform?: ConfigTransform | undefined;
    /**
     * Folder to search files in, load plugins from, and more (default:
     * `process.cwd()`).
     */
    cwd?: URL | string | undefined;
    /**
     * Default configuration to use if no config file is given or found
     * (optional).
     */
    defaultConfig?: PresetSupportingSpecifiers | undefined;
    /**
     * Whether to search for configuration files (default: `true` if
     * `options.packageField` or `options.rcName`).
     */
    detectConfig?: boolean | undefined;
    /**
     * Whether to search for ignore files (default: `true` if
     * `options.ignoreName`).
     */
    detectIgnore?: boolean | undefined;
    /**
     * Search for files with these extensions, when folders are passed
     * (optional); generated files are also given the first extension if `treeIn`
     * is on and `output` is on or points to a folder.
     */
    extensions?: Array<string> | undefined;
    /**
     * File path to process the given file on `streamIn` as (optional).
     */
    filePath?: URL | string | undefined;
    /**
     * Paths or globs to files and folders, or virtual files, to process
     * (optional).
     */
    files?: Array<URL | VFile | string> | undefined;
    /**
     * Call back with an unsuccessful (`1`) code on warnings as well as errors
     * (default: `false`).
     */
    frail?: boolean | undefined;
    /**
     * Name of ignore files to load (optional).
     */
    ignoreName?: string | undefined;
    /**
     * Filepath to an ignore file to load (optional).
     */
    ignorePath?: URL | string | undefined;
    /**
     * Resolve patterns in `ignorePath` from the current working
     * directory (`'cwd'`) or the ignore file’s folder (`'dir'`) (default:
     * `'dir'`).
     */
    ignorePathResolveFrom?: ResolveFrom | undefined;
    /**
     * Patterns to ignore in addition to ignore files (optional).
     */
    ignorePatterns?: Array<string> | undefined;
    /**
     * Ignore files that do not have an associated detected configuration file
     * (default: `false`); either `rcName` or `packageField` must be defined too;
     * cannot be combined with `rcPath` or `detectConfig: false`.
     */
    ignoreUnconfigured?: boolean | undefined;
    /**
     * Whether to output a formatted syntax tree for debugging (default:
     * `false`).
     */
    inspect?: boolean | undefined;
    /**
     * Whether to write the processed file to `streamOut` (default: `false`).
     */
    out?: boolean | undefined;
    /**
     * Whether to write successfully processed files, and where to (default:
     * `false`).
     *
     * * When `true`, overwrites the given files
     * * When `false`, does not write to the file system
     * * When pointing to an existing folder, files are written to that
     * folder and keep their original basenames
     * * When the parent folder of the given path exists and one file is
     * processed, the file is written to the given path
     */
    output?: URL | boolean | string | undefined;
    /**
     * Field where configuration can be found in `package.json` files
     * (optional).
     */
    packageField?: string | undefined;
    /**
     * Prefix to use when searching for plugins (optional).
     */
    pluginPrefix?: string | undefined;
    /**
     * Plugins to use (optional).
     */
    plugins?: PresetSupportingSpecifiers["plugins"] | undefined;
    /**
     *   Unified processor to transform files (required).
     */
    processor: () => Processor<any, any, any, any, any>;
    /**
     * Do not report successful files (default: `false`); given to the reporter.
     */
    quiet?: boolean | undefined;
    /**
     * Name of configuration files to load (optional).
     */
    rcName?: string | undefined;
    /**
     * Filepath to a configuration file to load (optional).
     */
    rcPath?: string | undefined;
    /**
     * Reporter to use (default: `'vfile-reporter'`); if a `string` is passed,
     * it’s loaded from `cwd`, and `'vfile-reporter-'` can be omitted
     */
    reporter?: VFileReporter | string | undefined;
    /**
     * Config to pass to the used reporter (optional).
     */
    reporterOptions?: VFileReporterOptions | undefined;
    /**
     * Configuration for the parser and compiler of the processor (optional).
     */
    settings?: UnifiedSettings | undefined;
    /**
     * Report only fatal errors (default: `false`); given to the reporter.
     */
    silent?: boolean | undefined;
    /**
     * Skip given files if they are ignored (default: `false`).
     */
    silentlyIgnore?: boolean | undefined;
    /**
     * Stream to write the report (if any) to (default: `process.stderr`).
     */
    streamError?: NodeJS.WritableStream | undefined;
    /**
     * Stream to read from if no files are given (default: `process.stdin`).
     */
    streamIn?: NodeJS.ReadableStream | undefined;
    /**
     * Stream to write processed files to (default: `process.stdout`); nothing is
     * streamed if either `out` is `false`, `output` is not `false`, multiple
     * files are processed, or a fatal error occurred while processing a file.
     */
    streamOut?: NodeJS.WritableStream | undefined;
    /**
     * Whether to treat both input and output as a syntax tree (default:
     * `false`).
     */
    tree?: boolean | undefined;
    /**
     * Whether to treat input as a syntax tree (default: `options.tree`).
     */
    treeIn?: boolean | undefined;
    /**
     * Whether to output as a syntax tree (default: `options.tree`).
     */
    treeOut?: boolean | undefined;
    /**
     * Report extra info (default: `false`); given to the reporter.
     */
    verbose?: boolean | undefined;
};
/**
 * Resolved {@link Options `Options`} passed around.
 */
export type Settings = {
    processor: Options["processor"];
    cwd: Exclude<Options["cwd"], URL | undefined>;
    files: Array<VFile | string>;
    extensions: Exclude<Options["extensions"], undefined>;
    streamIn: Exclude<Options["streamIn"], undefined>;
    filePath: Options["filePath"];
    streamOut: Exclude<Options["streamOut"], undefined>;
    streamError: Exclude<Options["streamError"], undefined>;
    out: Options["out"];
    output: Options["output"];
    alwaysStringify: Options["alwaysStringify"];
    tree: Options["tree"];
    treeIn: Options["treeIn"];
    treeOut: Options["treeOut"];
    inspect: Options["inspect"];
    rcName: Options["rcName"];
    packageField: Options["packageField"];
    detectConfig: Options["detectConfig"];
    rcPath: Options["rcPath"];
    settings: Exclude<Options["settings"], undefined>;
    ignoreName: Options["ignoreName"];
    detectIgnore: Options["detectIgnore"];
    ignorePath: Options["ignorePath"];
    ignorePathResolveFrom: Options["ignorePathResolveFrom"];
    ignorePatterns: Exclude<Options["ignorePatterns"], undefined>;
    ignoreUnconfigured: Exclude<Options["ignoreUnconfigured"], undefined>;
    silentlyIgnore: Exclude<Options["silentlyIgnore"], undefined>;
    plugins: Options["plugins"];
    pluginPrefix: Options["pluginPrefix"];
    configTransform: Options["configTransform"];
    defaultConfig: Options["defaultConfig"];
    reporter: Options["reporter"];
    reporterOptions: Options["reporterOptions"];
    color: Options["color"];
    silent: Options["silent"];
    quiet: Options["quiet"];
    frail: Options["frail"];
    verbose: Options["verbose"];
};
/**
 * Reporter.
 *
 * This is essentially the interface of `vfile-reporter`, with added support
 * for unknown fields in options and async support.
 */
export type VFileReporter = (files: Array<VFile>, options: VFileReporterOptions) => Promise<string> | string;
/**
 * Configuration.
 *
 * Note: this weird type fixes TSC:
 */
export type VFileReporterOptions = { [Key in keyof VFileReporterKnownFields]: VFileReporterKnownFields[Key]; } & Record<string, unknown>;
import type { FileSet } from './file-set.js';
import type { VFile } from 'vfile';
import type { ConfigTransform } from './configuration.js';
import type { PresetSupportingSpecifiers } from './configuration.js';
import type { ResolveFrom } from './ignore.js';
import type { Processor } from 'unified';
import type { Settings as UnifiedSettings } from 'unified';
import type { Options as VFileReporterKnownFields } from 'vfile-reporter';
//# sourceMappingURL=index.d.ts.map