# vfile-sort

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[`vfile`][vfile] utility to sort files or messages.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`compareFile(a, b)`](#comparefilea-b)
    *   [`compareMessage(a, b)`](#comparemessagea-b)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package exposes comparators for vfile files and messages.

## When should I use this?

You can use this right before a reporter is used to give humans a coherent
report.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install vfile-sort
```

In Deno with [`esm.sh`][esmsh]:

```js
import {sort} from 'https://esm.sh/vfile-sort@4'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {sort} from 'https://esm.sh/vfile-sort@4?bundle'
</script>
```

## Use

```js
import {VFile} from 'vfile'
import {VFileMessage} from 'vfile-message'
import {compareFile, compareMessage} from 'vfile-sort'

console.log(
  [
    new VFileMessage('Error!', {place: {line: 3, column: 1}}),
    new VFileMessage('Another!', {place: {line: 2, column: 2}})
  ]
    .toSorted(compareMessage)
    .map(String)
) //=> ['2:2: Another!', '3:1: Error!']

console.log(
  [
    new VFile(new URL(import.meta.url)),
    new VFile(new URL('.', import.meta.url))
  ]
    .toSorted(compareFile)
    .map((d) => d.path)
) //=> ['/Users/tilde/Projects/oss/vfile-sort/', '/Users/tilde/Projects/oss/vfile-sort/example.js']
```

## API

This package exports the identifiers [`compareFile`][api-compare-file] and
[`compareMessage`][api-compare-message].
There is no default export.

### `compareFile(a, b)`

Compare files (since: `4.0.0`).

###### Parameters

*   `a` ([`VFile`][vfile])
    — file
*   `b` ([`VFile`][vfile])
    — other file

###### Returns

Order (`number`).

### `compareMessage(a, b)`

Compare messages (since: `4.0.0`).

###### Algorithm

It first sorts by line/column: earlier messages come first.
When two messages occurr at the same place, sorts fatal error before
warnings, before info messages.
Finally, it sorts using `localeCompare` on `source`, `ruleId`, or finally
`reason`.

###### Parameters

*   `a` ([`VFile`][vfile])
    — message
*   `b` ([`VFile`][vfile])
    — other message

###### Returns

Order (`number`).

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line, `vfile-sort@^4`,
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

[build-badge]: https://github.com/vfile/vfile-sort/workflows/main/badge.svg

[build]: https://github.com/vfile/vfile-sort/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/vfile/vfile-sort.svg

[coverage]: https://codecov.io/github/vfile/vfile-sort

[downloads-badge]: https://img.shields.io/npm/dm/vfile-sort.svg

[downloads]: https://www.npmjs.com/package/vfile-sort

[size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=vfile-sort

[size]: https://bundlejs.com/?q=vfile-sort

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

[api-compare-file]: #comparefilea-b

[api-compare-message]: #comparemessagea-b
