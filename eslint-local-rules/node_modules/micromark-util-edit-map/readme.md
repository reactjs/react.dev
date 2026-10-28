# micromark-util-edit-map

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][bundle-size-badge]][bundle-size]
[![Sponsors][sponsors-badge]][opencollective]
[![Backers][backers-badge]][opencollective]
[![Chat][chat-badge]][chat]

[micromark][] utility to batch changes to lists of events.

## Contents

* [What is this?](#what-is-this)
* [When should I use this?](#when-should-i-use-this)
* [Install](#install)
* [Use](#use)
* [API](#api)
  * [`EditMap()`](#editmap)
  * [`EditMap#add(index, remove, add)`](#editmapaddindex-remove-add)
  * [`EditMap#addBefore(index, remove, add)`](#editmapaddbeforeindex-remove-add)
  * [`EditMap#consume(events)`](#editmapconsumeevents)
* [Types](#types)
* [Compatibility](#compatibility)
* [Security](#security)
* [Contribute](#contribute)
* [License](#license)

## What is this?

This package exposes an algorithm to batch changes to lists of events,
needed when authoring complex resolvers, such as for tables or lists.

## When should I use this?

This package is only useful when you are making your own micromark extensions
that need to change many places in lists of events,
such as injecting the result of parsing subcontent,
or cleaning up how a construct is represented.

## Install

This package is [ESM only][esm].
In Node.js (version 16+), install with [npm][]:

```sh
npm install micromark-util-edit-map
```

In Deno with [`esm.sh`][esmsh]:

```js
import {EditMap} from 'https://esm.sh/micromark-util-edit-map@1'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {EditMap} from 'https://esm.sh/micromark-util-edit-map@1?bundle'
</script>
```

## Use

```js
/**
 * @import {Event} from 'micromark-util-types'
 */

import {EditMap} from 'micromark-util-edit-map'

/** @type {Array<Event>} */
const events = [] // Assume this is filled.

const editMap = new EditMap()

editMap.add(1, 0, [['enter', events[2][1], events[2][2]]])
editMap.add(2, 1, [])

editMap.consume(events)
```

## API

This module exports the identifier [`EditMap`][api-edit-map].
There is no default export.

### `EditMap()`

Create a new edit map.

###### Returns

New instance (`EditMap`).

### `EditMap#add(index, remove, add)`

Create an edit: a remove and/or add at a certain place.

###### Parameters

* `index` (`number`)
  — index at which to apply the edit
* `remove` (`number`)
  — count of items to remove at the index
* `add` (`Array<Event>`)
  — items to add at the index

###### Returns

Nothing (`undefined`).

### `EditMap#addBefore(index, remove, add)`

Create an edit: but insert `add` before existing additions at `index`,
instead of after them.

###### Parameters

* `index` (`number`)
  — index at which to apply the edit
* `remove` (`number`)
  — count of items to remove at the index
* `add` (`Array<Event>`)
  — items to add at the index

###### Returns

Nothing (`undefined`).

### `EditMap#consume(events)`

Done, change the events.

###### Parameters

* `events` (`Array<Event>`)
  — list of events to apply the edits to

###### Returns

Nothing (`undefined`).

## Types

This package is fully typed with [TypeScript][].
It exports no additional types.

## Compatibility

Projects maintained by the unified collective are compatible with maintained
versions of Node.js.

When we cut a new major release, we drop support for unmaintained versions of
Node.
This means we try to keep the current release line,
`micromark-util-edit-map@1`, compatible with Node.js 16.
This package works with `micromark@4`.

## Security

This package is safe.
See [`security.md`][securitymd] in [`micromark/.github`][health] for how to
submit a security report.

## Contribute

See [`contributing.md`][contributing] in [`micromark/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[api-edit-map]: #editmap

[author]: https://wooorm.com

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[build]: https://github.com/micromark/micromark/actions

[build-badge]: https://github.com/micromark/micromark/workflows/main/badge.svg

[bundle-size]: https://bundlejs.com/?q=micromark-util-edit-map

[bundle-size-badge]: https://img.shields.io/badge/dynamic/json?label=minzipped%20size&query=$.size.compressedSize&url=https://deno.bundlejs.com/?q=micromark-util-edit-map

[chat]: https://github.com/micromark/micromark/discussions

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[coc]: https://github.com/micromark/.github/blob/main/code-of-conduct.md

[contributing]: https://github.com/micromark/.github/blob/main/contributing.md

[coverage]: https://codecov.io/github/micromark/micromark

[coverage-badge]: https://img.shields.io/codecov/c/github/micromark/micromark.svg

[downloads]: https://www.npmjs.com/package/micromark-util-edit-map

[downloads-badge]: https://img.shields.io/npm/dm/micromark-util-edit-map.svg

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[health]: https://github.com/micromark/.github

[license]: https://github.com/micromark/micromark/blob/main/license

[micromark]: https://github.com/micromark/micromark

[npm]: https://docs.npmjs.com/cli/install

[opencollective]: https://opencollective.com/unified

[securitymd]: https://github.com/micromark/.github/blob/main/security.md

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[support]: https://github.com/micromark/.github/blob/main/support.md

[typescript]: https://www.typescriptlang.org
