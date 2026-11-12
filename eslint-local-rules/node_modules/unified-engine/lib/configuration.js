/**
 * @import {PluginTuple, Plugin, Preset, Settings} from 'unified'
 */

/**
 * @callback Callback
 *   Callback called when loading a config.
 * @param {Error | undefined} error
 *   Error if something happened.
 * @param {ConfigResult | undefined} [result]
 *   Result.
 * @returns {undefined}
 *   Nothing.
 *
 * @typedef ConfigResult
 *   Resolved configuration.
 * @property {string | undefined} filePath
 *   File path of found configuration.
 * @property {Array<PluginTuple<Array<unknown>>>} plugins
 *   Resolved plugins.
 * @property {Settings} settings
 *   Resolved settings.
 *
 * @callback ConfigTransform
 *   Transform arbitrary configs to our format.
 * @param {any} config
 *   Arbitrary config.
 * @param {string} filePath
 *   File path of config file.
 * @returns {PresetSupportingSpecifiers}
 *   Our config format.
 *
 * @typedef ImportResult
 *   Result from an `import` call.
 * @property {unknown} [default]
 *   Default field.
 *
 * Note: we can’t use `@-callback` because TS doesn’t deal with `this` correctly.
 * @typedef {(this: Configuration, buf: Buffer, filePath: string) => Promise<PresetSupportingSpecifiers | undefined>} Loader
 *   Loader for different config files.
 *
 *
 * @typedef MergeConfiguration
 *   How to merge.
 * @property {string | undefined} prefix
 *   Plugin prefix.
 * @property {string} root
 *   File path to merge from.
 *
 *   Used to resolve plugins.
 *
 * @typedef {Array<PluggableSupportingSpecifiers>} PluggableListSupportingSpecifiers
 *   List of plugins and configuration, with support for specifiers.
 *
 * @typedef {Record<string, unknown>} PluggableMap
 *   Map where each key is a plugin specifier and each value is its primary parameter.
 *
 * @typedef {PluginSupportingSpecifiers | PluginTupleSupportingSpecifiers | Preset} PluggableSupportingSpecifiers
 *   Usable values, with support for specifiers.
 *
 * @typedef {Plugin<Array<unknown>> | string} PluginSupportingSpecifiers
 *   A plugin, or a specifier to one.
 *
 * @typedef {[plugin: string, ...parameters: Array<unknown>] | PluginTuple<Array<unknown>>} PluginTupleSupportingSpecifiers
 *   A plugin with configuration, with support for specifiers.
 *
 * @typedef PresetSupportingSpecifiers
 *   Sharable configuration, with support for specifiers.
 *
 *   Specifiers should *not* be used in actual presets (because they can’t be
 *   used by regular unified), but they can be used in config files locally,
 *   as those are only for the engine.
 *
 *   They can contain plugins and settings.
 * @property {PluggableListSupportingSpecifiers | PluggableMap | undefined} [plugins]
 *   List of plugins and presets (optional).
 * @property {Settings | undefined} [settings]
 *   Shared settings for parsers and compilers (optional).
 */

import assert from 'node:assert/strict'
import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'
import extend from 'extend'
import createDebug from 'debug'
import isPlainObj from 'is-plain-obj'
import {resolvePlugin} from 'load-plugin'
import parseJson from 'parse-json'
import yaml from 'yaml'
import {FindUp} from './find-up.js'

const debug = createDebug('unified-engine:configuration')

const own = {}.hasOwnProperty

/** @type {Record<string, Loader>} */
const loaders = {
  '.json': loadJson,
  '.cjs': loadScriptOrModule,
  '.mjs': loadScriptOrModule,
  '.js': loadScriptOrModule,
  '.yaml': loadYaml,
  '.yml': loadYaml
}

const defaultLoader = loadJson

/**
 * @typedef Options
 *   Configuration.
 * @property {ConfigTransform | undefined} [configTransform]
 *   Transform config files from a different schema (optional).
 * @property {string} cwd
 *   Base (required).
 * @property {PresetSupportingSpecifiers | undefined} [defaultConfig]
 *   Default configuration to use if no config file is given or found
 *   (optional).
 * @property {boolean | undefined} [detectConfig]
 *   Whether to search for configuration files.
 * @property {string | undefined} [packageField]
 *   Field where configuration can be found in `package.json` files
 *   (optional).
 * @property {string | undefined} [pluginPrefix]
 *   Prefix to use when searching for plugins (optional).
 * @property {PluggableListSupportingSpecifiers | PluggableMap | undefined} [plugins]
 *   Plugins to use (optional).
 * @property {string | undefined} [rcName]
 *   Name of configuration files to load (optional).
 * @property {string | undefined} [rcPath]
 *   Filepath to a configuration file to load (optional).
 * @property {Settings | undefined} [settings]
 *   Configuration for the parser and compiler of the processor (optional).
 */

export class Configuration {
  /**
   * Internal class to load configuration files.
   *
   * Exposed to build more complex integrations.
   *
   * @param {Options} options
   *   Configuration (required).
   * @returns
   *   Self.
   */
  constructor(options) {
    /** @type {Array<string>} */
    const names = []

    /** @type {string} */
    this.cwd = options.cwd
    /** @type {string | undefined} */
    this.packageField = options.packageField
    /** @type {string | undefined} */
    this.pluginPrefix = options.pluginPrefix
    /** @type {ConfigTransform | undefined} */
    this.configTransform = options.configTransform
    /** @type {PresetSupportingSpecifiers | undefined} */
    this.defaultConfig = options.defaultConfig

    if (options.rcName) {
      names.push(
        options.rcName,
        ...Object.keys(loaders).map(function (d) {
          return options.rcName + d
        })
      )
      debug('Looking for `%s` configuration files', names)
    }

    if (options.packageField) {
      names.push('package.json')
      debug(
        'Looking for `%s` fields in `package.json` files',
        options.packageField
      )
    }

    /** @type {PresetSupportingSpecifiers} */
    this.given = {plugins: options.plugins, settings: options.settings}
    this.create = this.create.bind(this)

    /** @type {FindUp<ConfigResult>} */
    this.findUp = new FindUp({
      create: this.create,
      cwd: options.cwd,
      detect: options.detectConfig,
      filePath: options.rcPath,
      names
    })
  }

  /**
   * Get the config for a file.
   *
   * @param {string} filePath
   *   File path to load.
   * @param {Callback} callback
   *   Callback.
   * @returns {undefined}
   *   Nothing.
   */
  load(filePath, callback) {
    const self = this

    this.findUp.load(
      filePath || path.resolve(this.cwd, 'stdin.js'),
      function (error, file) {
        if (error || file) {
          return callback(error, file)
        }

        self.create(undefined, undefined).then(function (result) {
          callback(undefined, result)
        }, callback)
      }
    )
  }

  /**
   * This is an internal method, consider it private.
   *
   * @param {Buffer | undefined} buf
   *   File value.
   * @param {string | undefined} filePath
   *   File path.
   * @returns {Promise<ConfigResult | undefined>}
   *   Result.
   */
  async create(buf, filePath) {
    const options = {cwd: this.cwd, prefix: this.pluginPrefix}
    /** @type {ConfigResult} */
    const result = {filePath: undefined, plugins: [], settings: {}}
    const extname = filePath ? path.extname(filePath) : undefined
    const loader =
      extname && extname in loaders ? loaders[extname] : defaultLoader
    /** @type {PresetSupportingSpecifiers | undefined} */
    let value

    if (filePath && buf) {
      value = await loader.call(this, buf, filePath)

      if (this.configTransform && value !== undefined) {
        value = this.configTransform(value, filePath)
      }
    }

    // Exit if we did find a `package.json`, but it does not have configuration.
    if (
      filePath &&
      path.basename(filePath) === 'package.json' &&
      value === undefined
    ) {
      filePath = undefined
    }

    if (value === undefined) {
      if (this.defaultConfig) {
        await merge(result, this.defaultConfig, {...options, root: this.cwd})
      }
    } else {
      assert(typeof filePath === 'string', 'Expected `filePath` to be set')
      await merge(result, value, {...options, root: path.dirname(filePath)})
    }

    await merge(result, this.given, {...options, root: this.cwd})

    result.filePath = filePath

    return result
  }
}

/**
 * @this {Configuration}
 *   Class.
 * @type {Loader}
 *   Loader.
 */
async function loadScriptOrModule(_, filePath) {
  // Assume it’s a config.
  const result = /** @type {ConfigResult} */ (
    await loadFromAbsolutePath(pathToFileURL(filePath).href, this.cwd)
  )
  return result
}

/** @type {Loader} */
async function loadYaml(buf) {
  return yaml.parse(String(buf))
}

/**
 * @this {Configuration}
 *   Class.
 * @type {Loader}
 *   Loader.
 */
async function loadJson(buf, filePath) {
  /** @type {Record<string, unknown>} */
  const data = parseJson(String(buf), filePath)

  // Assume it’s a config.
  const result = /** @type {ConfigResult} */ (
    this.packageField && path.basename(filePath) === 'package.json'
      ? data[this.packageField]
      : data
  )

  return result
}

/**
 * @param {ConfigResult} target
 *   Result to merge into.
 * @param {PresetSupportingSpecifiers} raw
 *   Raw found config.
 * @param {MergeConfiguration} options
 *   Configuration.
 * @returns {Promise<undefined>}
 *   Nothing.
 */
async function merge(target, raw, options) {
  if (raw !== null && typeof raw === 'object') {
    await addPreset(raw)
  } else {
    throw new Error('Expected preset, not `' + raw + '`')
  }

  /**
   * @param {PresetSupportingSpecifiers} result
   *   Configuration file.
   * @returns {Promise<undefined>}
   *   Nothing.
   */
  async function addPreset(result) {
    const plugins = result.plugins

    if (plugins === null || plugins === undefined) {
      // Empty.
    } else if (plugins !== null && typeof plugins === 'object') {
      await (Array.isArray(plugins) ? addEach(plugins) : addIn(plugins))
    } else {
      throw new Error(
        'Expected a list or object of plugins, not `' + plugins + '`'
      )
    }

    target.settings = extend(true, target.settings, result.settings)
  }

  /**
   * @param {PluggableListSupportingSpecifiers} result
   *   List of plugins.
   * @returns {Promise<undefined>}
   *   Nothing.
   */
  async function addEach(result) {
    let index = -1

    while (++index < result.length) {
      const value = result[index]

      // Keep order sequential instead of parallel.
      if (Array.isArray(value)) {
        const [plugin, primaryValue] = value
        await use(plugin, primaryValue)
      } else {
        await use(value, undefined)
      }
    }
  }

  /**
   * @param {PluggableMap} result
   *   Map of plugins.
   * @returns {Promise<undefined>}
   *   Nothing.
   */
  async function addIn(result) {
    /** @type {string} */
    let key

    for (key in result) {
      if (own.call(result, key)) {
        // Keep order sequential instead of parallel.
        await use(key, result[key])
      }
    }
  }

  /**
   * @param {PluginSupportingSpecifiers | Preset} usable
   *   Usable value.
   * @param {unknown} value
   *   Primary parameter.
   * @returns {Promise<undefined>}
   *   Nothing.
   */
  async function use(usable, value) {
    if (typeof usable === 'string') {
      await addModule(usable, value)
    } else if (typeof usable === 'function') {
      addPlugin(usable, value)
    } else {
      await merge(target, usable, options)
    }
  }

  /**
   * @param {string} id
   *   Specifier.
   * @param {unknown} value
   *   Primary parameter.
   * @returns {Promise<undefined>}
   *   Nothing.
   */
  async function addModule(id, value) {
    /** @type {string} */
    let fileUrl

    try {
      fileUrl = await resolvePlugin(id, {
        from: pathToFileURL(options.root) + '/',
        prefix: options.prefix
      })
    } catch (error) {
      addPlugin(function () {
        throw new Error('Cannot find module `' + id + '`', {cause: error})
      }, value)
      return
    }

    const result = await loadFromAbsolutePath(fileUrl, options.root)

    try {
      if (typeof result === 'function') {
        // Assume plugin.
        const plugin = /** @type {Plugin<Array<unknown>>} */ (result)
        addPlugin(plugin, value)
      } else {
        // Assume preset.
        const preset = /** @type {Preset} */ (result)
        await merge(target, preset, {
          ...options,
          root: path.dirname(fileURLToPath(fileUrl))
        })
      }
    } catch (error) {
      throw new Error(
        'Expected preset or plugin, not `' +
          result +
          '`, at `' +
          path.relative(options.root, fileURLToPath(fileUrl)) +
          '`',
        {cause: error}
      )
    }
  }

  /**
   * @param {Plugin<Array<unknown>>} plugin
   *   Plugin.
   * @param {unknown} value
   *   Primary parameter.
   * @returns {undefined}
   *   Nothing.
   */
  function addPlugin(plugin, value) {
    const entry = find(target.plugins, plugin)

    if (value === null) {
      value = undefined
    }

    if (entry) {
      reconfigure(entry, value)
    } else {
      target.plugins.push([plugin, value])
    }
  }
}

/**
 * @param {PluginTuple<Array<unknown>>} entry
 *   Tuple.
 * @param {unknown} value
 *   Primary value.
 * @returns {undefined}
 *   Nothing.
 */
function reconfigure(entry, value) {
  if (isPlainObj(entry[1]) && isPlainObj(value)) {
    value = extend(true, entry[1], value)
  }

  entry[1] = value
}

/**
 * @param {Array<PluginTuple<Array<unknown>>>} entries
 *   Tuples.
 * @param {Plugin<Array<unknown>>} plugin
 *   Plugin.
 * @returns {PluginTuple<Array<unknown>> | undefined}
 *   Tuple.
 */
function find(entries, plugin) {
  let index = -1

  while (++index < entries.length) {
    const entry = entries[index]
    if (entry[0] === plugin) {
      return entry
    }
  }
}

/**
 * @param {string} fileUrl
 *   Specifier.
 * @param {string} base
 *   Base.
 * @returns {Promise<unknown>}
 *   Result.
 */
async function loadFromAbsolutePath(fileUrl, base) {
  try {
    /** @type {ImportResult} */
    const result = await import(fileUrl)

    if (!('default' in result)) {
      throw new Error(
        'Expected a plugin or preset exported as the default export'
      )
    }

    return result.default
  } catch (error) {
    throw new Error(
      'Cannot import `' + path.relative(base, fileURLToPath(fileUrl)) + '`',
      {cause: error}
    )
  }
}
