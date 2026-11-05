# vfile-statistics

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[vfile][] utility to count messages per category (fatal, warn, info, etc).

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`statistics(file)`](#statisticsfile)
    *   [`Statistics`](#statistics)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This tiny package gives you stats about messages in files.

## When should I use this?

This is really tiny, you could do it yourself, but this is useful as a building
block.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install vfile-statistics
```

In Deno with [`esm.sh`][esmsh]:

```js
import {statistics} from 'https://esm.sh/vfile-statistics@3'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {statistics} from 'https://esm.sh/vfile-statistics@3?bundle'
</script>
```

## Use

```js
import {VFile} from 'vfile'
import {statistics} from 'vfile-statistics'

const file = new VFile({path: '~/example.md'})

file.message('This could be better')
file.message('That could be better')

try {
  file.fail('This is terribly wrong')
} catch {}

file.info('This is perfect')

console.log(statistics(file))
```

Yields:

```js
{fatal: 1, nonfatal: 3, warn: 2, info: 1, total: 4}
```

## API

This package exports the identifier [`statistics`][api-statistics].
There is no default export.

### `statistics(file)`

Get stats for a file, list of files, or list of messages.

###### Parameters

*   `file` ([`Array<VFile>`][vfile], [`Array<VFileMessage>`][vfile-message],
    `VFile`, or `VFileMessage`)
    — file, message, or list of files or messages

###### Returns

Statistics ([`Statistics`][api-statistics-map]).

### `Statistics`

Statistics (TypeScript type).

###### Fields

*   `fatal` — fatal errors (`fatal: true`)
*   `warn` — warning messages (`fatal: false`)
*   `info` — informational messages (`fatal: undefined`)
*   `nonfatal` — warning or info messages
*   `total` — all messages

## Types

This package is fully typed with [TypeScript][].
It exports the additional type [`Statistics`][api-statistics-map].

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `vfile-statistics@^3`,
compatible with Node.js 16.

## Contribute

See [`contributing.md`][contributing] in [`vfile/.github`][health] for ways to
get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/vfile/vfile-statistics/workflows/main/badge.svg

[build]: https://github.com/vfile/vfile-statistics/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-statistics.svg

[coverage]: https://codecov.io/github/vfile/vfile-statistics

[downloads-badge]: https://img.shields.io/npm/dm/vfile-statistics.svg

[downloads]: https://www.npmjs.com/package/vfile-statistics

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=vfile-statistics

[size]: https://bundlejs.com/?q=vfile-statistics

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/vfile/vfile/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[contributing]: https://github.com/vfile/.github/blob/main/contributing.md

[support]: https://github.com/vfile/.github/blob/main/support.md

[health]: https://github.com/vfile/.github

[coc]: https://github.com/vfile/.github/blob/main/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[vfile]: https://github.com/vfile/vfile

[vfile-message]: https://github.com/vfile/vfile-message

[api-statistics]: #statisticsfile

[api-statistics-map]: #statistics
