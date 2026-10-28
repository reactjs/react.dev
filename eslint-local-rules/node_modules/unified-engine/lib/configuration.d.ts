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
    constructor(options: Options);
    /** @type {string} */
    cwd: string;
    /** @type {string | undefined} */
    packageField: string | undefined;
    /** @type {string | undefined} */
    pluginPrefix: string | undefined;
    /** @type {ConfigTransform | undefined} */
    configTransform: ConfigTransform | undefined;
    /** @type {PresetSupportingSpecifiers | undefined} */
    defaultConfig: PresetSupportingSpecifiers | undefined;
    /** @type {PresetSupportingSpecifiers} */
    given: PresetSupportingSpecifiers;
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
    create(buf: Buffer | undefined, filePath: string | undefined): Promise<ConfigResult | undefined>;
    /** @type {FindUp<ConfigResult>} */
    findUp: FindUp<ConfigResult>;
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
    load(filePath: string, callback: Callback): undefined;
}
/**
 * Callback called when loading a config.
 */
export type Callback = (error: Error | undefined, result?: ConfigResult | undefined) => undefined;
/**
 * Resolved configuration.
 */
export type ConfigResult = {
    /**
     *   File path of found configuration.
     */
    filePath: string | undefined;
    /**
     *   Resolved plugins.
     */
    plugins: Array<PluginTuple<Array<unknown>>>;
    /**
     *   Resolved settings.
     */
    settings: Settings;
};
/**
 * Transform arbitrary configs to our format.
 */
export type ConfigTransform = (config: any, filePath: string) => PresetSupportingSpecifiers;
/**
 * Result from an `import` call.
 */
export type ImportResult = {
    /**
     * Default field.
     *
     * Note: we can’t use `@-callback` because TS doesn’t deal with `this` correctly.
     */
    default?: unknown;
};
/**
 * Loader for different config files.
 */
export type Loader = (this: Configuration, buf: Buffer, filePath: string) => Promise<PresetSupportingSpecifiers | undefined>;
/**
 * How to merge.
 */
export type MergeConfiguration = {
    /**
     *   Plugin prefix.
     */
    prefix: string | undefined;
    /**
     *   File path to merge from.
     *
     *   Used to resolve plugins.
     */
    root: string;
};
/**
 * List of plugins and configuration, with support for specifiers.
 */
export type PluggableListSupportingSpecifiers = Array<PluggableSupportingSpecifiers>;
/**
 * Map where each key is a plugin specifier and each value is its primary parameter.
 */
export type PluggableMap = Record<string, unknown>;
/**
 * Usable values, with support for specifiers.
 */
export type PluggableSupportingSpecifiers = PluginSupportingSpecifiers | PluginTupleSupportingSpecifiers | Preset;
/**
 * A plugin, or a specifier to one.
 */
export type PluginSupportingSpecifiers = Plugin<Array<unknown>> | string;
/**
 * A plugin with configuration, with support for specifiers.
 */
export type PluginTupleSupportingSpecifiers = [plugin: string, ...parameters: Array<unknown>] | PluginTuple<Array<unknown>>;
/**
 * Sharable configuration, with support for specifiers.
 *
 * Specifiers should *not* be used in actual presets (because they can’t be
 * used by regular unified), but they can be used in config files locally,
 * as those are only for the engine.
 *
 * They can contain plugins and settings.
 */
export type PresetSupportingSpecifiers = {
    /**
     * List of plugins and presets (optional).
     */
    plugins?: PluggableListSupportingSpecifiers | PluggableMap | undefined;
    /**
     * Shared settings for parsers and compilers (optional).
     */
    settings?: Settings | undefined;
};
/**
 * Configuration.
 */
export type Options = {
    /**
     * Transform config files from a different schema (optional).
     */
    configTransform?: ConfigTransform | undefined;
    /**
     *   Base (required).
     */
    cwd: string;
    /**
     * Default configuration to use if no config file is given or found
     * (optional).
     */
    defaultConfig?: PresetSupportingSpecifiers | undefined;
    /**
     * Whether to search for configuration files.
     */
    detectConfig?: boolean | undefined;
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
    plugins?: PluggableListSupportingSpecifiers | PluggableMap | undefined;
    /**
     * Name of configuration files to load (optional).
     */
    rcName?: string | undefined;
    /**
     * Filepath to a configuration file to load (optional).
     */
    rcPath?: string | undefined;
    /**
     * Configuration for the parser and compiler of the processor (optional).
     */
    settings?: Settings | undefined;
};
import { FindUp } from './find-up.js';
import type { PluginTuple } from 'unified';
import type { Settings } from 'unified';
import type { Preset } from 'unified';
import type { Plugin } from 'unified';
//# sourceMappingURL=configuration.d.ts.map