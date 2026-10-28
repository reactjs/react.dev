/**
 * @typedef {import('./lib/configuration.js').ConfigResult} ConfigResult
 * @typedef {import('./lib/file-set.js').Completer} Completer
 * @typedef {import('./lib/index.js').Callback} Callback
 * @typedef {import('./lib/configuration.js').ConfigTransform} ConfigTransform
 * @typedef {import('./lib/index.js').Context} Context
 * @typedef {import('./lib/file-set.js').FileSet} FileSet
 * @typedef {import('./lib/index.js').Options} Options
 * @typedef {import('./lib/configuration.js').PresetSupportingSpecifiers} Preset
 * @typedef {import('./lib/ignore.js').ResolveFrom} ResolveFrom
 * @typedef {import('./lib/index.js').VFileReporter} VFileReporter
 */

// it’s mostly private, but useful for tools like `eslint-mdx`.
export {Configuration} from './lib/configuration.js'

export {engine} from './lib/index.js'
