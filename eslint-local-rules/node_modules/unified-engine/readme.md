# unified-engine

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[unified][]** engine to process multiple files, lettings users
[configure][config-files] from the file system.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`engine(options, callback)`](#engineoptions-callback)
  * [`Configuration`](#configuration)
  * [`Completer`](#completer)
  * [`Callback`](#callback)
  * [`ConfigResult`](#configresult)
  * [`ConfigTransform`](#configtransform)
  * [`Context`](#context)
  * [`FileSet`](#fileset)
  * [`Options`](#options)
  * [`Preset`](#preset)
  * [`ResolveFrom`](#resolvefrom)
  * [`VFileReporter`](#vfilereporter)
* [Config files](#config-files)
  * [Explicit configuration](#explicit-configuration)
  * [Implicit configuration](#implicit-configuration)
  * [Examples](#examples)
* [Ignore files](#ignore-files)
  * [Explicit ignoring](#explicit-ignoring)
  * [Implicit ignoring](#implicit-ignoring)
  * [Extra ignoring](#extra-ignoring)
  * [Ignoring](#ignoring)
  * [Examples](#examples-1)
* [Plugins](#plugins)
* [Examples](#examples-2)
  * [`options.alwaysStringify`](#optionsalwaysstringify)
  * [`options.configTransform`](#optionsconfigtransform)
  * [`options.defaultConfig`](#optionsdefaultconfig)
  * [`options.detectConfig`](#optionsdetectconfig)
  * [`options.detectIgnore`](#optionsdetectignore)
  * [`options.extensions`](#optionsextensions)
  * [`options.filePath`](#optionsfilepath)
  * [`options.files`](#optionsfiles)
  * [`options.frail`](#optionsfrail)
  * [`options.ignoreName`](#optionsignorename)
  * [`options.ignorePath`](#optionsignorepath)
  * [`options.ignorePathResolveFrom`](#optionsignorepathresolvefrom)
  * [`options.ignorePatterns`](#optionsignorepatterns)
  * [`options.ignoreUnconfigured`](#optionsignoreunconfigured)
  * [`options.inspect`](#optionsinspect)
  * [`options.out`](#optionsout)
  * [`options.output`](#optionsoutput)
  * [`options.packageField`](#optionspackagefield)
  * [`options.pluginPrefix`](#optionspluginprefix)
  * [`options.plugins`](#optionsplugins)
  * [`options.processor`](#optionsprocessor)
  * [`options.quiet`](#optionsquiet)
  * [`options.rcName`](#optionsrcname)
  * [`options.rcPath`](#optionsrcpath)
  * [`options.reporter` and `options.reporterOptions`](#optionsreporter-and-optionsreporteroptions)
  * [`options.settings`](#optionssettings)
  * [`options.silent`](#optionssilent)
  * [`options.streamError`](#optionsstreamerror)
  * [`options.streamIn`](#optionsstreamin)
  * [`options.streamOut`](#optionsstreamout)
  * [`options.tree`](#optionstree)
  * [`options.treeIn`](#optionstreein)
  * [`options.treeOut`](#optionstreeout)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package is the engine.
It’s what you use underneath when you use [`remark-cli`][remark-cli] or a
language server.
Compared to unified, this deals with multiple files, often from the file
system, and with [configuration files][config-files] and
[ignore files][ignore-files].

## When should I use this?

You typically use something that wraps this, such as:

* [`unified-args`][unified-args]
  — create CLIs
* [`unified-engine-gulp`][unified-engine-gulp]
  — create Gulp plugins
* [`unified-language-server`][unified-language-server]
  — create language servers

You can use this to make such things.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install unified-engine
```

## Use

The following example processes all files in the current folder with a
markdown extension with **[remark][]**, allows [configuration][config-files]
from `.remarkrc` and `package.json` files, ignoring files from `.remarkignore`
files, and more.

```js
/**
 * @import {Callback} from 'unified-engine'
 */

import process from 'node:process'
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    color: true,
    extensions: ['md', 'markdown', 'mkd', 'mkdn', 'mkdown'],
    files: ['.'],
    ignoreName: '.remarkignore',
    packageField: 'remarkConfig',
    pluginPrefix: 'remark',
    processor: remark,
    rcName: '.remarkrc'
  },
  done
)

/** @type {Callback} */
function done(error, code) {
  if (error) throw error
  process.exitCode = code
}
```

## API

This package exports the identifiers [`Configuration`][api-configuration] and
[`engine`][api-engine].
There is no default export.

### `engine(options, callback)`

Process.

###### Parameters

* `options` ([`Options`][api-options], required)
  — configuration
* `callback` ([`Callback`][api-callback], required)
  — configuration

###### Returns

Nothing (`undefined`).

### `Configuration`

Internal class to load configuration files.

Exposed to build more complex integrations.

###### Parameters

* `options` (subset of [`Options`][api-options], required)
  — configuration (`cwd` is required)

###### Fields

* `load(string, (Error?[, ConfigResult?]): undefined): undefined`
  — get the config for a file

### `Completer`

Completer (TypeScript type).

###### Type

```ts
type Completer = (CompleterCallback | CompleterRegular) & {
    pluginId?: string | symbol | undefined
}

type CompleterCallback = (set: FileSet, next: CompleterCallbackNext) => undefined
type CompleterCallbackNext = (error?: Error | null | undefined) => undefined
type CompleterRegular = (set: FileSet) => Promise<undefined> | undefined
```

### `Callback`

Callback called when done (TypeScript type).

Called with a fatal error if things went horribly wrong (probably due to
incorrect configuration), or a status code and the processing context.

###### Parameters

* `error` (`Error`, optional)
  — error
* `code` (`0` or `1`, optional)
  — exit code, `0` if successful or `1` if unsuccessful
* `context` ([`Context`][api-context], optional)
  — processing context

###### Returns

Nothing (`undefined`).

### `ConfigResult`

Resolved configuration from [`Configuration`][api-configuration] (TypeScript
type).

###### Fields

* `filePath` (`string`)
  — file path of found configuration
* `plugins` (`Array<PluginTuple>` from `unified`)
  — resolved plugins
* `settings` ([`Settings` from `unified`][unified-settings])
  — resolved settings

### `ConfigTransform`

Transform arbitrary configs to our format (TypeScript type).

###### Parameters

* `config` (`unknown`)
  — arbitrary config
* `filePath` (`string`)
  — file path of config file

###### Returns

Our config format ([`Preset`][api-preset]).

### `Context`

Processing context (TypeScript type).

###### Fields

* `fileSet` ([`FileSet`][api-file-set])
  — internally used info
* `files` ([`Array<VFile>`][vfile])
  — processed files

### `FileSet`

A FileSet is created to process multiple files through unified processors
(TypeScript type).

This set, containing all files, is exposed to plugins as the second parameter.

###### Parameters

None.

###### Fields

* `valueOf(): Array<VFile>`
  — get files in a set
* `use(completer: Completer): this`
  — add middleware to be called when done (see: [`Completer`][api-completer])
* `add(file: VFile | string): this`
  — add a file; the given file is processed like other files with a few
  differences: it’s ignored when their file path is already added, never
  written to the file system or `streamOut`, and not included in the  report

### `Options`

Configuration (TypeScript type).

> 👉 **Note**: `options.processor` is required.

###### Fields

* `alwaysStringify` (`boolean`, default: `false`)
  — whether to always serialize successfully processed files
* `color` (`boolean`, default: `false`)
  — whether to report with ANSI color sequences; given to the reporter
* `configTransform` ([`ConfigTransform`][api-config-transform], optional)
  — transform config files from a different schema
* `cwd` (`URL` or `string`, default: `process.cwd()`)
  — folder to search files in, load plugins from, and more
* `defaultConfig` ([`Preset`][api-preset], optional)
  — default configuration to use if no config file is given or found
* `detectConfig` (`boolean`, default: `true` if `options.packageField` or
  `options.rcName`)
  — whether to search for configuration files
* `detectIgnore` (`boolean`, default: `true` if `options.ignoreName`)
  — whether to search for ignore files
* `extensions` (`Array<string>`, optional)
  — search for files with these extensions, when folders are passed;
  generated files are also given the first extension if `treeIn` is on and
  `output` is on or points to a folder
* `filePath` (`URL` or `string`, optional)
  — file path to process the given file on `streamIn` as
* `files` (`Array<URL | VFile | string>`, optional)
  — paths or [globs][node-glob] to files and folder, or virtual files, to
  process
* `frail` (`boolean`, default: `false`)
  — call back with an unsuccessful (`1`) code on warnings as well as errors
* `ignoreName` (`string`, optional)
  — name of ignore files to load
* `ignorePath` (`URL` or `string`, optional)
  — filepath to an ignore file to load
* `ignorePathResolveFrom` ([`ResolveFrom`][api-resolve-from], default:
  `'dir'`)
  — resolve patterns in `ignorePath` from the current working folder
  (`'cwd'`) or the ignore file’s folder (`'dir'`)
* `ignorePatterns` (optional)
  — patterns to ignore in addition to ignore files
* `ignoreUnconfigured` (`boolean`, default: `false`)
  — ignore files that do not have an associated detected configuration file;
  either `rcName` or `packageField` must be defined too; cannot be combined
  with `rcPath` or `detectConfig: false`
* `inspect` (`boolean`, default: `false`)
  — whether to output a formatted syntax tree for debugging
* `out` (`boolean`, default: `false`)
  — whether to write the processed file to `streamOut`
* `output` (`URL`, `boolean` or `string`, default: `false`)
  — whether to write successfully processed files, and where to; when `true`,
  overwrites the given files, when `false`, does not write to the file system;
  when pointing to an existing folder, files are written to that folder and
  keep their original basenames; when the parent folder of the given path
  exists and one file is processed, the file is written to the given path
* `packageField` (`string`, optional)
  — field where configuration can be found in `package.json` files
* `pluginPrefix` (`string`, optional)
  — prefix to use when searching for plugins
* `plugins` ([`Preset['plugins']`][api-preset], optional)
  — plugins to use
* `processor` ([`Processor`][unified-processor], **required**)
  — unified processor to transform files
* `quiet` (`boolean`, default: `false`)
  — do not report successful files; given to the reporter
* `rcName` (`string`, optional)
  — name of configuration files to load
* `rcPath` (`URL` or `string`, optional)
  — filepath to a configuration file to load
* `reporter` ([`VFileReporter`][api-vfile-reporter] or `string`, default:
  `vfile-reporter`)
  — reporter to use; if a `string` is passed, it’s loaded from `cwd`, and
  `'vfile-reporter-'` can be omitted
* `reporterOptions` ([`Options`][vfile-reporter-options] from
  `vfile-reporter`, optional)
  — config to pass to the used reporter
* `settings` ([`Settings`][unified-settings] from `unified`, optional)
  — configuration for the parser and compiler of the processor
* `silent` (`boolean`, default: `false`)
  — report only fatal errors; given to the reporter
* `silentlyIgnore` (`boolean`, default: `false`)
  — skip given files if they are ignored
* `streamError` ([`WritableStream`][node-writable-stream] from Node.js,
  default: `process.stderr`)
  — stream to write the report (if any) to
* `streamIn` ([`ReadableStream`][node-readable-stream] from Node.js,
  default: `process.stdin`)
  — stream to read from if no files are found or given
* `streamOut` ([`WritableStream`][node-writable-stream] from Node.js,
  default: `process.stdout`)
  — stream to write processed files to, nothing is streamed if either `out`
  is `false`, `output` is not `false`, multiple files are processed, or a
  fatal error occurred while processing a file
* `tree` (`boolean`, default: `false`)
  — whether to treat both input and output as a syntax tree
* `treeIn` (`boolean`, default: `options.tree`)
  — whether to treat input as a syntax tree
* `treeOut` (`boolean`, default: `options.tree`)
  — whether to output as a syntax tree
* `verbose` (`boolean`, default: `false`)
  — report extra info; given to the reporter

### `Preset`

Sharable configuration, with support for specifiers (TypeScript type).

Specifiers should *not* be used in actual presets (because they can’t be
used by regular unified), but they can be used in config files locally,
as those are only for the engine.

They can contain plugins and settings.

###### Type

```ts
import type {
  Plugin as UnifiedPlugin,
  PluginTuple as UnifiedPluginTuple,
  Preset as UnifiedPreset,
  Settings
} from 'unified'

type Preset = {
  plugins?: PluggableList | PluggableMap | undefined
  settings?: Settings | undefined
}

type Pluggable = Plugin | PluginTuple | UnifiedPreset
type PluggableList = Array<Pluggable>
type PluggableMap = Record<string, unknown>
type Plugin = UnifiedPlugin | string
type PluginTupleSupportingSpecifiers =
  | [plugin: string, ...parameters: Array<unknown>]
  | UnifiedPluginTuple
```

### `ResolveFrom`

How to resolve (TypeScript type).

###### Type

```ts
type ResolveFrom = 'cwd' | 'dir';
```

### `VFileReporter`

Transform arbitrary configs to our format (TypeScript type).

This is essentially the interface of [`vfile-reporter`][vfile-reporter], with
added support for unknown fields in options and async support.

###### Parameters

* `files` ([`Array<VFile>`][vfile])
  — files
* `options` ([`Options`][vfile-reporter-options] from `vfile-reporter`,
  optional)
  — configuration

###### Returns

Report (`Promise<string>` or `string`).

## Config files

`unified-engine` accepts configuration through options and through
configuration files (*rc files*).

### Explicit configuration

One configuration file can be given through `options.rcPath`, this is loaded
regardless of `options.detectConfig` and `options.rcName`.

### Implicit configuration

Otherwise, configuration files are detected if `options.detectConfig` is turned
on, depending on the following options:

* if `options.rcName` is given, `$rcName` (JSON), `$rcName.js` (CommonJS or
  ESM depending on the `type` field of the closest `package.json`),
  `$rcName.cjs` (CommonJS), `$rcName.mjs` (ESM), `$rcName.yml` (YAML),
  and `$rcName.yaml` (YAML) are loaded
* if `options.packageField` is given, `package.json` (JSON) files are loaded
  and the configuration at their `$packageField` field is used

The first file that is searched for in a folder is used as the configuration.
If no file is found, the parent folder is searched, and so on.

The schema (type) of rc files is [`Preset`][api-preset].

### Examples

An example **rc** file could look as follows:

```json
{
  "plugins": [
    "remark-inline-links",
    "remark-lint-recommended"
  ],
  "settings": {
    "bullet": "*",
    "ruleRepetition": 3,
    "fences": true
  }
}
```

Another example, **rc.js**, could look as follows:

```js
exports.plugins = [
  './script/natural-language.js',
  'remark-lint-recommended',
  'remark-license'
]

exports.settings = {bullet: '*'}
```

When using ESM (ECMAScript modules), **rc.mjs** could look as folows:

```js
export default {
  plugins: [
    './script/natural-language.js',
    'remark-lint-recommended',
    'remark-license'
  ],
  settings: {bullet: '*'}
}
```

Another example, **rc.yaml**, could look as follows:

```js
plugins:
  - 'rehype-document'
  - 'rehype-preset-minify'
settings:
  preferUnquoted: true
  quote: "'"
  quoteSmart: true
  verbose: true
```

## Ignore files

`unified-engine` accepts patterns to ignore when searching for files to process
through ignore files.

### Explicit ignoring

One ignore file can be given through `options.ignorePath`, this is loaded
regardless of `options.detectIgnore` and `options.ignoreName`.

### Implicit ignoring

Otherwise, ignore files are detected if `options.detectIgnore` is turned on and
`options.ignoreName` is given.

The first file named `$ignoreName` in the parent folder of a checked file is
used.
Or, if no file is found, the parent folder if searched, and so on.

### Extra ignoring

In addition to explicit and implicit ignore files, other patterns can be given
with `options.ignorePatterns`.
The format of each pattern in `ignorePatterns` is the same as a line in an
ignore file.
Patterns and files are resolved based on the current working folder.

It is also possible to ignore files that do not have an associated detected
configuration file by turning on `options.ignoreUnconfigured`.

### Ignoring

Ignoring is used when searching for files in folders.
If paths (including those expanded from [globs][node-glob]) are passed in that
are ignored, an error is thrown.
These files can be silently ignored by turning on `options.silentlyIgnore`.

Normally, files are ignored based on the path of the found ignore file and the
patterns inside it.
Patterns passed with `options.ignorePatterns` are resolved based on the current
working directory.

Patterns in an explicit ignore file passed in with `options.ignorePath` can be
resolved from the current working directory instead, by setting
`options.ignorePathResolveFrom` to `'cwd'` instead of `'dir'` (default).

If paths or globs to folders are given to the engine, they will be searched
for matching files, but `node_modules` are normally not searched.
Pass paths (or globs) to the `node_modules` you want to include in
`options.files` to search them.

The format for ignore files is the same as [`.gitignore`][gitignore], so it’s
possible to pass a `.gitignore` in as `options.ignorePath`.

[`node-ignore`][node-ignore] is used under the hood, see its documentation
for more information.

### Examples

An example **ignore** file could look as follows:

```ini
# Ignore files in `.github`.
.github/

# Bower.
bower_components/
# Duo dependencies.
components/

# Fixtures.
test/{input,tree}/
```

If we had an ignore file `folder/.remarkignore`, with the value: `index.txt`,
and our file system looked as follows:

```txt
folder/.remarkignore
folder/index.txt
index.txt
```

Then `folder/index.txt` would be ignored but `index.txt` would not be.

## Plugins

Normally, **unified** plugins receive a single `options` argument upon attaching
(an `Object` users can provide to configure the plugin).

If a plugin is attached by **unified-engine**, a second argument is given:
[`FileSet`][api-file-set].

## Examples

`unified-engine` can be configured extensively by engine authors.

### `options.alwaysStringify`

This example shows how you can use `options.alwaysStringify` when you don’t
want the engine to write to the file system, but still want to get the compiled
results.
One example that does this is `unified-engine-gulp`.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'
import {VFile} from 'vfile'

const file = new VFile({path: 'example.md', value: '_hi_'})

engine(
  {alwaysStringify: true, files: [file], processor: remark},
  function (error, code, context) {
    if (error) throw error
    console.log(context?.files.map((d) => String(d)))
  }
)
```

Yields:

```txt
example.md: no issues found
```

```js
[ '*hi*\n' ]
```

### `options.configTransform`

To support custom rc files, that have a different format than what the engine
supports, pass as [`ConfigTransform`][api-config-transform].

This example processes `readme.md` and loads options from `custom` (from a
`package.json`).
`configTransform` is called with those options and transforms it to
configuration `unified-engine` understands.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    configTransform,
    files: ['readme.md'],
    packageField: 'custom',
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)

function configTransform(config) {
  return {settings: (config || {}).options}
}
```

Where `package.json` contains:

```json
{
  "name": "foo",
  "private": true,
  "custom": {
    "options": {
      "bullet": "+"
    }
  }
}
```

### `options.defaultConfig`

This example processes `readme.md`.
If `package.json` exists, that config is used, otherwise the configuration at
`defaultConfig` is used.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    defaultConfig: {settings: {bullet: '+'}},
    files: ['readme.md'],
    packageField: 'remarkConfig',
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)
```

Where `package.json` contains:

```json
{
  "name": "foo",
  "private": true,
  "remarkConfig": {
    "settings": {
      "bullet": "-"
    }
  }
}
```

### `options.detectConfig`

This example processes `readme.md` but does **not** allow configuration from
`.remarkrc` or `package.json` files, as `detectConfig` is `false`.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    detectConfig: false,
    files: ['readme.md'],
    processor: remark(),
    packageField: 'remarkConfig',
    rcName: '.remarkrc'
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.detectIgnore`

This example processes files in the current working directory with an `md`
extension but does **not** ignore file paths from the closest `.remarkignore`
file, because `detectIgnore` is `false`.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    detectIgnore: false,
    extensions: ['md'],
    files: ['.'],
    ignoreName: '.remarkignore',
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.extensions`

This example reformats all files with `md`, `markdown`, and `mkd`
extensions in the current folder.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    extensions: ['md', 'mkd', 'markdown'],
    files: ['.'],
    output: true,
    processor: remark
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.filePath`

This example shows that `streamIn` is named as `filePath`:

```js
import {PassThrough} from 'node:stream'
import {remark} from 'remark'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import {engine} from 'unified-engine'

const streamIn = new PassThrough()

streamIn.write('doc')

setImmediate(function () {
  streamIn.end('ument')
})

engine(
  {
    filePath: '~/alpha/bravo/charlie.md',
    out: false,
    plugins: [remarkPresetLintRecommended],
    processor: remark(),
    streamIn
  },
  function (error) {
    if (error) throw error
  }
)
```

Yields:

```txt
~/alpha/bravo/charlie.md
  1:1  warning  Missing newline character at end of file  final-newline  remark-lint

⚠ 1 warning
```

### `options.files`

This example processes `LICENSE` and all files with an `md` extension in `doc`.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    extensions: ['md'],
    files: ['LICENSE', 'doc/'],
    processor: remark
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.frail`

This example uses [`remark-lint`][remark-lint] to lint `readme.md` and exits
with the given exit code.
Normally, only errors turn the `code` to `1`, but in `frail` mode lint warnings
result in the same.

```js
import process from 'node:process'
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    files: ['readme.md'],
    frail: true,
    plugins: ['remark-preset-lint-recommended'],
    processor: remark()
  },
  function (error, code) {
    process.exitCode = error ? 1 : code
  }
)
```

### `options.ignoreName`

This example processes files in the current working directory with an `md`
extension, and is configured to ignore file paths from the closest
`.remarkignore` file.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    extensions: ['md'],
    files: ['.'],
    ignoreName: '.remarkignore',
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.ignorePath`

This example processes files in the current working directory with an `md`
extension and ignores file paths specified in `.gitignore`.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    extensions: ['md'],
    files: ['.'],
    ignorePath: '.gitignore',
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.ignorePathResolveFrom`

This example processes files in the current working directory with an `md`
extension and takes a reusable configuration file from a dependency.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    extensions: ['md'],
    files: ['.'],
    ignorePath: 'node_modules/my-config/my-ignore',
    ignorePathResolveFrom: 'cwd',
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.ignorePatterns`

This example processes files in the current working directory with an `md`
extension, except for `readme.md`:

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    extensions: ['md'],
    files: ['.'],
    ignorePatterns: ['readme.md'],
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.ignoreUnconfigured`

This example processes files in the current working directory with an
`md` extension, but only if there is an explicit `.remarkrc` config file near
(upwards) to them:

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    extensions: ['md'],
    files: ['.'],
    ignoreUnconfigured: true,
    processor: remark(),
    rcName: '.remarkrc'
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.inspect`

This example shows a module which reads and parses `doc.md`, then
[`remark-unlink`][remark-unlink] transforms the syntax tree, the tree is
formatted with [`unist-util-inspect`][unist-util-inspect], and finally written
to **stdout**(4).

```js
import {remark} from 'remark'
import remarkUnlink from 'remark-unlink'
import {engine} from 'unified-engine'

engine(
  {
    files: ['doc.md'],
    inspect: true,
    plugins: [remarkUnlink],
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)
```

Where `doc.md` looks as follows:

```markdown
[foo](https://example.com)
```

Yields:

```txt
root[1] (1:1-2:1, 0-27)
└─ paragraph[1] (1:1-1:27, 0-26)
   └─ text: "foo" (1:2-1:5, 1-4)
```

### `options.out`

This example uses [`remark-lint`][remark-lint] to lint `readme.md`, writes the
report, and ignores the serialized document.

```js
import {remark} from 'remark'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import {engine} from 'unified-engine'

engine(
  {
    files: ['readme.md'],
    out: false,
    plugins: [remarkPresetLintRecommended],
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.output`

This example writes all files in `src/` with an `md` extension compiled to
`dest/`.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    extensions: ['md'],
    files: ['src/'],
    output: 'dest/',
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.packageField`

This example processes `readme.md`, and allows configuration from
`remarkConfig` fields in `package.json` files.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    files: ['readme.md'],
    packageField: 'remarkConfig',
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.pluginPrefix`

This example processes `readme.md` and loads the
`preset-lint-recommended` plugin.
Because `pluginPrefix` is given, this resolves to
[`remark-preset-lint-recommended`][remark-preset-lint-recommended] (from
`node_modules/`) if available.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    files: ['readme.md'],
    pluginPrefix: 'remark',
    plugins: ['preset-lint-recommended'],
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.plugins`

This example processes `readme.md` and loads the
[`remark-preset-lint-recommended`][remark-preset-lint-recommended]
preset.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    files: ['readme.md'],
    plugins: ['remark-preset-lint-recommended'],
    processor: remark()
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.processor`

This example reformats **stdin**(4) using [remark][], writes the report
to **stderr**(4), and formatted document to **stdout**(4).

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine({processor: remark}, function (error) {
  if (error) throw error
})
```

### `options.quiet`

This example uses [`remark-lint`][remark-lint] to lint `readme.md`.
Nothing is reported if the file processed successfully.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    files: ['readme.md'],
    plugins: ['remark-preset-lint-recommended'],
    processor: remark(),
    quiet: true
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.rcName`

This example processes `readme.md` and allows configuration from `.remarkrc`,
`.remarkrc.json`, `.remarkrc.yml`, `.remarkrc.yaml`, `.remarkrc.js`,
`.remarkrc.cjs`, and `.remarkrc.mjs` files.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {files: ['readme.md'], processor: remark(), rcName: '.remarkrc'},
  function (error) {
    if (error) throw error
  }
)
```

### `options.rcPath`

This example processes `readme.md` and loads configuration from `config.json`.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {files: ['readme.md'], processor: remark(), rcPath: 'config.json'},
  function (error) {
    if (error) throw error
  }
)
```

### `options.reporter` and `options.reporterOptions`

This example processes all HTML files in the current folder with rehype,
configures the processor with `.rehyperc` files, and prints a report in
JSON using [`vfile-reporter-json`][vfile-reporter-json] with
[reporter options][vfile-reporter-options].

```js
import {rehype} from 'rehype'
import {engine} from 'unified-engine'

engine(
  {
    extensions: ['html'],
    files: ['.'],
    processor: rehype(),
    rcName: '.rehyperc',
    reporter: 'json',
    reporterOptions: {pretty: true}
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.settings`

This example processes `readme.md` and configures the compiler
([`remark-stringify`][remark-stringify]) with `bullet: '+'`.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {files: ['readme.md'], processor: remark(), settings: {bullet: '+'}},
  function (error) {
    if (error) throw error
  }
)
```

### `options.silent`

This example uses [`remark-lint`][remark-lint] to lint `readme.md` but does not
report any warnings or success messages, only fatal errors, if they occur.

```js
import {remark} from 'remark'
import {engine} from 'unified-engine'

engine(
  {
    files: ['readme.md'],
    plugins: ['remark-preset-lint-recommended'],
    processor: remark(),
    silent: true
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.streamError`

This example uses [`remark-lint`][remark-lint] to lint `readme.md` and writes
the report to `report.txt`.

```js
import fs from 'node:fs'
import {remark} from 'remark'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import {engine} from 'unified-engine'

engine(
  {
    files: ['readme.md'],
    out: false,
    plugins: [remarkPresetLintRecommended],
    processor: remark(),
    streamErr: fs.createWriteStream('report.txt')
  },
  function (error) {
    if (error) throw error
  }
)
```

### `options.streamIn`

This example uses [`remark-lint`][remark-lint] to lint an incoming
stream.

```js
import {PassThrough} from 'node:stream'
import {remark} from 'remark'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import {engine} from 'unified-engine'

const streamIn = new PassThrough()

streamIn.write('doc')

setImmediate(function () {
  streamIn.end('ument')
})

engine(
  {
    out: false,
    plugins: [remarkPresetLintRecommended],
    processor: remark(),
    streamIn
  },
  function (error) {
    if (error) throw error
  }
)
```

Yields:

```txt
<stdin>
  1:1  warning  Missing newline character at end of file  final-newline  remark-lint

⚠ 1 warning
```

### `options.streamOut`

This example reads `readme.md` and writes the serialized document to
`readme-two.md`.
This can also be achieved by passing `output: 'readme-two.md'` instead of
`streamOut`.

```js
import fs from 'node:fs'
import {remark} from 'remark'
import {engine} from 'unified-engine'

const streamOut = fs.createWriteStream('readme-two.md')

engine(
  {files: ['readme.md'], processor: remark(), streamOut},
  function (error) {
    if (error) throw error
  }
)
```

### `options.tree`

This example reads `tree.json`, then [`remark-unlink`][remark-unlink]
transforms the syntax tree, and the transformed tree is written to
**stdout**(4).

```js
import {remark} from 'remark'
import remarkUnlink from 'remark-unlink'
import {engine} from 'unified-engine'

engine(
  {
    files: ['tree.json'],
    plugins: [remarkUnlink],
    processor: remark(),
    tree: true
  },
  function (error) {
    if (error) throw error
  }
)
```

Where `tree.json` looks as follows:

```json
{
  "type": "paragraph",
  "children": [{
    "type": "link",
    "url": "https://example.com",
    "children": [{
      "type": "text",
      "value": "foo"
    }]
  }]
}
```

Yields:

```json
{
  "type": "paragraph",
  "children": [{
    "type": "text",
    "value": "foo"
  }]
}
```

### `options.treeIn`

This example reads `tree.json`, then [`remark-unlink`][remark-unlink]
transforms the syntax tree, the tree is serialized, and the resulting document
is written to **stdout**(4).

```js
import {remark} from 'remark'
import remarkUnlink from 'remark-unlink'
import {engine} from 'unified-engine'

engine(
  {
    files: ['tree.json'],
    plugins: [remarkUnlink],
    processor: remark(),
    treeIn: true
  },
  function (error) {
    if (error) throw error
  }
)
```

Where `tree.json` looks as follows:

```json
{
  "type": "paragraph",
  "children": [{
    "type": "link",
    "url": "https://example.com",
    "children": [{
      "type": "text",
      "value": "foo"
    }]
  }]
}
```

Yields:

```markdown
foo
```

### `options.treeOut`

This example shows a module which reads and parses `doc.md`, then
[`remark-unlink`][remark-unlink] transforms the syntax tree, and the tree is
written to **stdout**(4).

```js
import {remark} from 'remark'
import remarkUnlink from 'remark-unlink'
import {engine} from 'unified-engine'

engine(
  {
    files: ['doc.md'],
    plugins: [remarkUnlink],
    processor: remark(),
    treeOut: true
  },
  function (error) {
    if (error) throw error
  }
)
```

Where `doc.md` looks as follows:

```markdown
[foo](https://example.com)
```

Yields:

```json
{
  "type": "paragraph",
  "children": [{
    "type": "text",
    "value": "foo"
  }]
}
```

## Types

This package is fully typed with [TypeScript][].
It exports the additional types
[`Completer`][api-completer],
[`Callback`][api-callback],
[`ConfigResult`][api-config-result],
[`ConfigTransform`][api-config-transform],
[`Context`][api-context],
[`FileSet`][api-file-set],
[`Options`][api-options],
[`Preset`][api-preset],
[`ResolveFrom`][api-resolve-from], and
[`VFileReporter`][api-vfile-reporter].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `unified-engine@^11`,
compatible with Node.js 16.

## Security

`unified-engine` loads and evaluates configuration files, plugins, and presets
from the file system (often from `node_modules/`).
That means code that is on your file system runs.
Make sure you trust the workspace where you run `unified-engine` and be careful
with packages from npm and changes made by contributors.

## Contribute

See [`contributing.md`][contributing] in [`unifiedjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/unifiedjs/unified-engine/workflows/main/badge.svg

[build]: https://github.com/unifiedjs/unified-engine/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/unifiedjs/unified-engine.svg

[coverage]: https://codecov.io/github/unifiedjs/unified-engine

[downloads-badge]: https://img.shields.io/npm/dm/unified-engine.svg

[downloads]: https://www.npmjs.com/package/unified-engine

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/unifiedjs/unified/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[typescript]: https://www.typescriptlang.org

[health]: https://github.com/unifiedjs/.github

[contributing]: https://github.com/unifiedjs/.github/blob/main/contributing.md

[support]: https://github.com/unifiedjs/.github/blob/main/support.md

[coc]: https://github.com/unifiedjs/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[gitignore]: https://git-scm.com/docs/gitignore

[node-glob]: https://github.com/isaacs/node-glob#glob-primer

[node-ignore]: https://github.com/kaelzhang/node-ignore

[remark]: https://github.com/remarkjs/remark

[remark-cli]: https://github.com/remarkjs/remark/tree/main/packages/remark-cli#readme

[remark-lint]: https://github.com/remarkjs/remark-lint

[remark-preset-lint-recommended]: https://github.com/remarkjs/remark-lint/tree/main/packages/remark-preset-lint-recommended

[remark-stringify]: https://github.com/remarkjs/remark/tree/main/packages/remark-stringify

[remark-unlink]: https://github.com/remarkjs/remark-unlink

[unified]: https://github.com/unifiedjs/unified

[unified-processor]: https://github.com/unifiedjs/unified#processor-1

[unified-args]: https://github.com/unifiedjs/unified-args

[unified-engine-gulp]: https://github.com/unifiedjs/unified-engine-gulp

[unified-language-server]: https://github.com/unifiedjs/unified-language-server

[unified-settings]: https://github.com/unifiedjs/unified#settings

[unist-util-inspect]: https://github.com/syntax-tree/unist-util-inspect

[vfile]: https://github.com/vfile/vfile

[vfile-reporter]: https://github.com/vfile/vfile-reporter

[vfile-reporter-json]: https://github.com/vfile/vfile-reporter-json

[vfile-reporter-options]: https://github.com/vfile/vfile-reporter#options

[node-readable-stream]: https://nodejs.org/api/stream.html#readable-streams

[node-writable-stream]: https://nodejs.org/api/stream.html#writable-streams

[config-files]: #config-files

[ignore-files]: #ignore-files

[api-configuration]: #configuration

[api-engine]: #engineoptions-callback

[api-completer]: #completer

[api-callback]: #callback

[api-config-result]: #configresult

[api-config-transform]: #configtransform

[api-context]: #context

[api-file-set]: #fileset

[api-options]: #options

[api-preset]: #preset

[api-resolve-from]: #resolvefrom

[api-vfile-reporter]: #vfilereporter
