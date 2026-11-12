/**
 * @import {Processor, Settings as UnifiedSettings} from 'unified'
 * @import {Options as VFileReporterKnownFields} from 'vfile-reporter'
 * @import {VFile} from 'vfile'
 * @import {ConfigTransform, PresetSupportingSpecifiers} from './configuration.js'
 * @import {FileSet} from './file-set.js'
 * @import {ResolveFrom} from './ignore.js'
 * @import {Context} from './index.js'
 */

/**
 * @callback Callback
 *   Callback called when done.
 *
 *   Called with a fatal error if things went horribly wrong (probably due to
 *   incorrect configuration), or a status code and the processing context.
 * @param {Error | undefined} error
 *   Error.
 * @param {0 | 1 | undefined} [code]
 *   Exit code, `0` if successful or `1` if unsuccessful.
 * @param {Context | undefined} [context]
 *   Processing context.
 * @returns {undefined | void}
 *   Nothing.
 *
 *   Note: `void` included because `promisify` otherwise fails.
 *
 * @typedef Context
 *   Processing context.
 * @property {FileSet} fileSet
 *   Internally used info.
 * @property {Array<VFile>} files
 *   Processed files.
 *
 * @typedef Options
 *   Configuration.
 *
 *   > 👉 **Note**: `options.processor` is required.
 * @property {boolean | undefined} [alwaysStringify=false]
 *   Whether to always serialize successfully processed files (default:
 *   `false`).
 * @property {boolean | undefined} [color=false]
 *   Whether to report with ANSI color sequences (default: `false`); given to
 *   the reporter.
 * @property {ConfigTransform | undefined} [configTransform]
 *   Transform config files from a different schema (optional).
 * @property {URL | string | undefined} [cwd]
 *   Folder to search files in, load plugins from, and more (default:
 *   `process.cwd()`).
 * @property {PresetSupportingSpecifiers | undefined} [defaultConfig]
 *   Default configuration to use if no config file is given or found
 *   (optional).
 * @property {boolean | undefined} [detectConfig]
 *   Whether to search for configuration files (default: `true` if
 *   `options.packageField` or `options.rcName`).
 * @property {boolean | undefined} [detectIgnore]
 *   Whether to search for ignore files (default: `true` if
 *   `options.ignoreName`).
 * @property {Array<string> | undefined} [extensions]
 *   Search for files with these extensions, when folders are passed
 *   (optional); generated files are also given the first extension if `treeIn`
 *   is on and `output` is on or points to a folder.
 * @property {URL | string | undefined} [filePath]
 *   File path to process the given file on `streamIn` as (optional).
 * @property {Array<URL | VFile | string> | undefined} [files]
 *   Paths or globs to files and folders, or virtual files, to process
 *   (optional).
 * @property {boolean | undefined} [frail=false]
 *   Call back with an unsuccessful (`1`) code on warnings as well as errors
 *   (default: `false`).
 * @property {string | undefined} [ignoreName]
 *   Name of ignore files to load (optional).
 * @property {URL | string | undefined} [ignorePath]
 *   Filepath to an ignore file to load (optional).
 * @property {ResolveFrom | undefined} [ignorePathResolveFrom]
 *   Resolve patterns in `ignorePath` from the current working
 *   directory (`'cwd'`) or the ignore file’s folder (`'dir'`) (default:
 *   `'dir'`).
 * @property {Array<string> | undefined} [ignorePatterns]
 *   Patterns to ignore in addition to ignore files (optional).
 * @property {boolean | undefined} [ignoreUnconfigured=false]
 *   Ignore files that do not have an associated detected configuration file
 *   (default: `false`); either `rcName` or `packageField` must be defined too;
 *   cannot be combined with `rcPath` or `detectConfig: false`.
 * @property {boolean | undefined} [inspect=false]
 *   Whether to output a formatted syntax tree for debugging (default:
 *   `false`).
 * @property {boolean | undefined} [out=false]
 *   Whether to write the processed file to `streamOut` (default: `false`).
 * @property {URL | boolean | string | undefined} [output=false]
 *   Whether to write successfully processed files, and where to (default:
 *   `false`).
 *
 *   * When `true`, overwrites the given files
 *   * When `false`, does not write to the file system
 *   * When pointing to an existing folder, files are written to that
 *     folder and keep their original basenames
 *   * When the parent folder of the given path exists and one file is
 *     processed, the file is written to the given path
 * @property {string | undefined} [packageField]
 *   Field where configuration can be found in `package.json` files
 *   (optional).
 * @property {string | undefined} [pluginPrefix]
 *   Prefix to use when searching for plugins (optional).
 * @property {PresetSupportingSpecifiers['plugins'] | undefined} [plugins]
 *   Plugins to use (optional).
 * @property {() => Processor<any, any, any, any, any>} processor
 *   Unified processor to transform files (required).
 * @property {boolean | undefined} [quiet=false]
 *   Do not report successful files (default: `false`); given to the reporter.
 * @property {string | undefined} [rcName]
 *   Name of configuration files to load (optional).
 * @property {string | undefined} [rcPath]
 *   Filepath to a configuration file to load (optional).
 * @property {VFileReporter | string | undefined} [reporter]
 *   Reporter to use (default: `'vfile-reporter'`); if a `string` is passed,
 *   it’s loaded from `cwd`, and `'vfile-reporter-'` can be omitted
 * @property {VFileReporterOptions | undefined} [reporterOptions]
 *   Config to pass to the used reporter (optional).
 * @property {UnifiedSettings | undefined} [settings]
 *   Configuration for the parser and compiler of the processor (optional).
 * @property {boolean | undefined} [silent=false]
 *   Report only fatal errors (default: `false`); given to the reporter.
 * @property {boolean | undefined} [silentlyIgnore=false]
 *   Skip given files if they are ignored (default: `false`).
 * @property {NodeJS.WritableStream | undefined} [streamError]
 *   Stream to write the report (if any) to (default: `process.stderr`).
 * @property {NodeJS.ReadableStream | undefined} [streamIn]
 *   Stream to read from if no files are given (default: `process.stdin`).
 * @property {NodeJS.WritableStream | undefined} [streamOut]
 *   Stream to write processed files to (default: `process.stdout`); nothing is
 *   streamed if either `out` is `false`, `output` is not `false`, multiple
 *   files are processed, or a fatal error occurred while processing a file.
 * @property {boolean | undefined} [tree=false]
 *   Whether to treat both input and output as a syntax tree (default:
 *   `false`).
 * @property {boolean | undefined} [treeIn]
 *   Whether to treat input as a syntax tree (default: `options.tree`).
 * @property {boolean | undefined} [treeOut]
 *   Whether to output as a syntax tree (default: `options.tree`).
 * @property {boolean | undefined} [verbose=false]
 *   Report extra info (default: `false`); given to the reporter.
 *
 * @typedef Settings
 *   Resolved {@link Options `Options`} passed around.
 * @property {Options['processor']} processor
 * @property {Exclude<Options['cwd'], URL | undefined>} cwd
 * @property {Array<VFile | string>} files
 * @property {Exclude<Options['extensions'], undefined>} extensions
 * @property {Exclude<Options['streamIn'], undefined>} streamIn
 * @property {Options['filePath']} filePath
 * @property {Exclude<Options['streamOut'], undefined>} streamOut
 * @property {Exclude<Options['streamError'], undefined>} streamError
 * @property {Options['out']} out
 * @property {Options['output']} output
 * @property {Options['alwaysStringify']} alwaysStringify
 * @property {Options['tree']} tree
 * @property {Options['treeIn']} treeIn
 * @property {Options['treeOut']} treeOut
 * @property {Options['inspect']} inspect
 * @property {Options['rcName']} rcName
 * @property {Options['packageField']} packageField
 * @property {Options['detectConfig']} detectConfig
 * @property {Options['rcPath']} rcPath
 * @property {Exclude<Options['settings'], undefined>} settings
 * @property {Options['ignoreName']} ignoreName
 * @property {Options['detectIgnore']} detectIgnore
 * @property {Options['ignorePath']} ignorePath
 * @property {Options['ignorePathResolveFrom']} ignorePathResolveFrom
 * @property {Exclude<Options['ignorePatterns'], undefined>} ignorePatterns
 * @property {Exclude<Options['ignoreUnconfigured'], undefined>} ignoreUnconfigured
 * @property {Exclude<Options['silentlyIgnore'], undefined>} silentlyIgnore
 * @property {Options['plugins']} plugins
 * @property {Options['pluginPrefix']} pluginPrefix
 * @property {Options['configTransform']} configTransform
 * @property {Options['defaultConfig']} defaultConfig
 * @property {Options['reporter']} reporter
 * @property {Options['reporterOptions']} reporterOptions
 * @property {Options['color']} color
 * @property {Options['silent']} silent
 * @property {Options['quiet']} quiet
 * @property {Options['frail']} frail
 * @property {Options['verbose']} verbose
 *
 * @callback VFileReporter
 *   Reporter.
 *
 *   This is essentially the interface of `vfile-reporter`, with added support
 *   for unknown fields in options and async support.
 * @param {Array<VFile>} files
 *   Files.
 * @param {VFileReporterOptions} options
 *   Configuration.
 * @returns {Promise<string> | string}
 *   Report.
 *
 * @typedef {{[Key in keyof VFileReporterKnownFields]: VFileReporterKnownFields[Key]} & Record<string, unknown>} VFileReporterOptions
 *   Configuration.
 *
 *   Note: this weird type fixes TSC:
 */

import process from 'node:process'
import {PassThrough} from 'node:stream'
import {fileURLToPath} from 'node:url'
import {statistics} from 'vfile-statistics'
import {fileSetPipeline} from './file-set-pipeline/index.js'

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
export function engine(options, callback) {
  /** @type {Settings} */
  const settings = {}
  /** @type {NodeJS.ReadStream | PassThrough} */
  let stdin = new PassThrough()

  try {
    stdin = process.stdin
    // See: <https://github.com/nodejs/node/blob/f856234/lib/internal/process/stdio.js#L82>,
    // <https://github.com/AtomLinter/linter-markdown/pull/85>.
    /* c8 ignore next 3 -- obscure bug in Node (seen on Windows). */
  } catch {
    // Empty.
  }

  if (!callback) {
    throw new Error('Missing `callback`')
  }

  if (!options || !options.processor) {
    return next(new Error('Missing `processor`'))
  }

  // Processor.
  settings.processor = options.processor

  // Path to run as.
  settings.cwd =
    typeof options.cwd === 'object'
      ? fileURLToPath(options.cwd)
      : options.cwd || process.cwd()

  // Input.
  settings.files = (options.files || []).map(function (d) {
    const result = isUrl(d) ? fileURLToPath(d) : d
    return result
  })
  settings.extensions = (options.extensions || []).map(function (value) {
    return value.charAt(0) === '.' ? value : '.' + value
  })

  settings.filePath = options.filePath
  settings.streamIn = options.streamIn || stdin

  // Output.
  settings.streamOut = options.streamOut || process.stdout
  settings.streamError = options.streamError || process.stderr
  settings.alwaysStringify = options.alwaysStringify
  settings.output = options.output
  settings.out = options.out

  // Null overwrites config settings, `undefined` does not.
  if (settings.output === null || settings.output === undefined) {
    settings.output = undefined
  }

  if (settings.output && settings.out) {
    return next(new Error('Cannot accept both `output` and `out`'))
  }

  // Process phase management.
  const tree = options.tree || false

  settings.treeIn = options.treeIn
  settings.treeOut = options.treeOut
  settings.inspect = options.inspect

  if (settings.treeIn === null || settings.treeIn === undefined) {
    settings.treeIn = tree
  }

  if (settings.treeOut === null || settings.treeOut === undefined) {
    settings.treeOut = tree
  }

  // Configuration.
  const detectConfig = options.detectConfig
  const hasConfig = Boolean(options.rcName || options.packageField)

  if (detectConfig && !hasConfig) {
    return next(
      new Error('Missing `rcName` or `packageField` with `detectConfig`')
    )
  }

  settings.detectConfig =
    detectConfig === null || detectConfig === undefined
      ? hasConfig
      : detectConfig
  settings.rcName = options.rcName
  settings.rcPath = options.rcPath
  settings.packageField = options.packageField
  settings.settings = options.settings || {}
  settings.configTransform = options.configTransform
  settings.defaultConfig = options.defaultConfig

  // Ignore.
  const detectIgnore = options.detectIgnore
  const hasIgnore = Boolean(options.ignoreName)
  const ignoreUnconfigured = Boolean(options.ignoreUnconfigured)

  settings.detectIgnore =
    detectIgnore === null || detectIgnore === undefined
      ? hasIgnore
      : detectIgnore
  settings.ignoreName = options.ignoreName
  settings.ignorePath = options.ignorePath
  settings.ignorePathResolveFrom = options.ignorePathResolveFrom || 'dir'
  settings.ignorePatterns = options.ignorePatterns || []
  settings.ignoreUnconfigured = ignoreUnconfigured
  settings.silentlyIgnore = Boolean(options.silentlyIgnore)

  if (ignoreUnconfigured && settings.rcPath) {
    return next(
      new Error(
        'Cannot accept both `rcPath` and `ignoreUnconfigured`, as former prevents looking for configuration but the latter requires it'
      )
    )
  }

  if (ignoreUnconfigured && !hasConfig) {
    return next(
      new Error(
        'Missing `rcName` or `packageField` with `ignoreUnconfigured`, the former are needed to look for configuration'
      )
    )
  }

  if (ignoreUnconfigured && !settings.detectConfig) {
    return next(
      new Error(
        'Cannot use `detectConfig: false` with `ignoreUnconfigured`, the former prevents looking for configuration but the latter requires it'
      )
    )
  }

  if (detectIgnore && !hasIgnore) {
    return next(new Error('Missing `ignoreName` with `detectIgnore`'))
  }

  // Plugins.
  settings.pluginPrefix = options.pluginPrefix
  settings.plugins = options.plugins || []

  // Reporting.
  settings.reporter = options.reporter
  settings.reporterOptions = options.reporterOptions
  settings.color = options.color || false
  settings.silent = options.silent
  settings.quiet = options.quiet
  settings.frail = options.frail
  settings.verbose = options.verbose

  // Process.
  fileSetPipeline.run({files: settings.files}, settings, next)

  /**
   * @param {Error | undefined} error
   *   Error.
   * @param {Context | undefined} [context]
   *   Context.
   * @returns {undefined}
   *   Nothing.
   */
  function next(error, context) {
    const stats = statistics((context || {}).files || [])
    const failed = Boolean(
      settings.frail ? stats.fatal || stats.warn : stats.fatal
    )

    if (error) {
      callback(error)
    } else {
      callback(undefined, failed ? 1 : 0, context)
    }
  }
}

/**
 *
 * @param {unknown} value
 *   Value.
 * @returns {value is URL}
 *   Whether `value` is a URL.
 */
function isUrl(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    'href' in value &&
    'searchParams' in value &&
    // Extra, for vfiles.
    !('path' in value)
  )
}
