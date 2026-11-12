# synckit

## 0.12.3

### Patch Changes

- [#282](https://github.com/un-ts/synckit/pull/282) [`d9febd8`](https://github.com/un-ts/synckit/commit/d9febd889d7ee9b0e668d1c9bd0eab798aa9cf27) Thanks [@JounQin](https://github.com/JounQin)! - Restore the npm provenance attestation on releases. `changesets` 3 publishes Yarn projects with `yarn npm publish`, which only writes a provenance statement when `npmPublishProvenance` (or `publishConfig.provenance`) asks for it, so `0.12.0` onwards shipped without npm's "Built and signed with provenance" badge.

## 0.12.2

### Patch Changes

- [#280](https://github.com/un-ts/synckit/pull/280) [`7d87fd3`](https://github.com/un-ts/synckit/commit/7d87fd3fa47c4c70023f17ceaa198941d2b72035) Thanks [@JounQin](https://github.com/JounQin)! - Fix workers never starting under Yarn PnP since v0.12: the failure guard (`register.cjs`) was preloaded ahead of the PnP API require inherited from Yarn, but the guard lives inside the project's package archive and cannot be read until `.pnp.cjs` has patched module resolution. The worker then died at startup with nothing left to report it, so every `createSyncFn` call waited in `Atomics.wait()` until its timeout. Under PnP the worker's `NODE_OPTIONS` now opens with the PnP API require and the guard follows it; every other inherited preload still loads after the guard, and the "already inherited" check scans the whole value so a nested worker does not add a second guard.

## 0.12.1

### Patch Changes

- [#276](https://github.com/un-ts/synckit/pull/276) [`5d741f2`](https://github.com/un-ts/synckit/commit/5d741f2a719f31f6d98e9c54baa1fc0aa879e953) Thanks [@git-credential-broker](https://github.com/apps/git-credential-broker)! - Use `node-fetch-native` for the default global `fetch` shim instead of `node-fetch`: it is a dual ESM/CommonJS package that prefers the native `fetch` and only falls back to its own implementation, so the shim is no longer tied to the CommonJS-only `node-fetch` v2. The shim imports the named `fetch` export, because `require('node-fetch-native')` is the module namespace rather than the function. If you enable `SYNCKIT_GLOBAL_SHIMS`, install `node-fetch-native` instead of `node-fetch`.

## 0.12.0

### Minor Changes

- [#265](https://github.com/un-ts/synckit/pull/265) [`523e75c`](https://github.com/un-ts/synckit/commit/523e75c0fe1dd3abdb886f517df2423fabd3acae) Thanks [@JounQin](https://github.com/JounQin)! - feat: surface worker failures and exits instead of hanging forever in `Atomics.wait()`

  A worker that never answers no longer leaves its caller blocked: a module graph that fails to load (a missing top-level import, a syntax error, a failing global shim), a throw after a top-level `await`, a runtime failure while a call is in flight, and a worker that exits — through a handler that calls `process.exit()`, or on its own — are all reported to the caller instead.

  The guard now reaches a worker through its own `NODE_OPTIONS` rather than its `execArgv`, so it is in place before a preload the worker inherits from `NODE_OPTIONS`, which run first: a failure there reaches the caller like any other instead of being left to the call's deadline, or to no deadline at all. The worker's environment is passed explicitly to do that, and its `NODE_OPTIONS` keeps whatever it inherited, after the preload. A runtime that refuses that environment — Node 18 with `--openssl-legacy-provider`, Node 24 with `--title`, the set varies by version — makes the worker fall back to the inherited environment with the guard in its `execArgv` instead, so the guard loads after preloads inherited through `NODE_OPTIONS` and a failure in one of those is reported by nothing. synckit warns once per worker that takes that path, under the `SYNCKIT_GUARD_ORDERING` code, so the caller can bound the wait themselves with `SYNCKIT_TIMEOUT` or a timeout passed per call.

  This changes the failure semantics, which is why it is a minor. A call that used to hang now throws; a worker that swallows the failure in its own handler no longer lets the call in flight return normally; and a worker that fails fatally no longer takes the process down with it — the caller gets the failure instead, and later calls keep throwing it.

  A worker which reached `runAsWorker` and still has a handler for the event keeps serving later calls: the guard reports the failure and re-arms rather than deciding for that handler, so the worker stays usable — it does not mean the handler ran. For a rejection, the guard's own `unhandledRejection` listener is what keeps the runtime from promoting it under the default `throw` mode, so a handler listening only on `uncaughtException` never sees it; under `strict` the runtime promotes it anyway, and that handler does see it. Otherwise the failure is fatal for that synchronous function, and later calls keep throwing it rather than waiting on a worker which never registered, or which has nothing left to keep it alive.

  A recoverable failure only tells the caller that the worker can still serve; it does not stop the request that was in flight. A worker whose own handler absorbs the failure may still be running that request, so a retry can overlap it — a worker module holding state across calls has to expect that.

  The timeout is now a single deadline for the whole call, and each wait receives only the time left of it. Previously every wait measured its own slice, so the time spent between waits was not counted and outdated responses could push the total wait past the timeout.

  The module specifiers `encodeImportModule` generates are escaped with `JSON.stringify` now — double quotes and full escaping — where a single-quoted literal escaped only backslashes and quotes, so a path carrying a newline or another control character is emitted correctly instead of breaking the generated source.

  **Breaking:** the `INT32_BYTES` export is gone. It was reachable from the public entry point — `src/index.ts` re-exports the whole constants module — so an import of it that compiles on `main` no longer compiles here. Nothing in the package used it, and the release stays a `minor` under the 0.x convention rather than a `major`.

  The `hasFlag` utility now reads the flags the runtime applies — `execArgv` and `NODE_OPTIONS`, in either the `--flag=value` or `--flag value` form — and no longer counts a flag that is only a script argument, which Node does not apply. `NODE_OPTIONS` is now read the way the runtime reads it: split on spaces, with double quotes grouping and removed and a backslash escaping inside them, so a quoted value keeps its spaces and an unset variable is `[]` where a naive split gave `['']`.

  `DataMessage<T>` is now a discriminated union whose failure arm requires `error`, so a reason that is present but `undefined` is still a failure rather than a result, and `properties` on that arm is typed `object` instead of `unknown`.

  A reported failure carries the worker's reason exactly as it was thrown, even a falsy one; when its properties cannot cross the thread boundary the error is sent bare, and only a reason that cannot be cloned at all is replaced by a synthetic error that still names it.

### Patch Changes

- [#269](https://github.com/un-ts/synckit/pull/269) [`0086192`](https://github.com/un-ts/synckit/commit/008619265ef409bf656af8ea80b4ddbd06df14b0) Thanks [@JounQin](https://github.com/JounQin)! - Resolve global shims from the worker for both CommonJS and ESM: the CommonJS eval entry rebinds `require` to `createRequire(workerPath)`, and the ESM entry resolves each shim against the worker's path and export conditions — `@dual-bundle/import-meta-resolve` under `node_modules`, `pnpapi` under Yarn PnP — and imports it as an absolute URL, instead of loading a generated file under the package's own `node_modules`. Availability is judged with that same resolver, and the conditions follow the worker's `execArgv` (`node-addons`, `module-sync`, `--conditions`) as well as this thread's.

## 0.11.13

### Patch Changes

- [#258](https://github.com/un-ts/synckit/pull/258) [`e752c6a`](https://github.com/un-ts/synckit/commit/e752c6a26f96c4df5c3c48c61c73065beb6de636) Thanks [@JounQin](https://github.com/JounQin)! - fix(deps): update dependency @pkgr/core

## 0.11.12

### Patch Changes

- [#255](https://github.com/un-ts/synckit/pull/255) [`4fb10bd`](https://github.com/un-ts/synckit/commit/4fb10bd12d5e145377f44402fc87a0434930be3e) Thanks [@clemyan](https://github.com/clemyan)! - Fix PnP ESM support

## 0.11.9

### Patch Changes

- [#249](https://github.com/un-ts/synckit/pull/249) [`173ef5e`](https://github.com/un-ts/synckit/commit/173ef5e17bea2eec072074f7610fab38d04e1476) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update dependency @pkgr/core to ^0.3.0

## 0.11.8

### Patch Changes

- [#246](https://github.com/un-ts/synckit/pull/246) [`a5cf309`](https://github.com/un-ts/synckit/commit/a5cf3099292d60f8a5e4fb426f4c3fc7bee84d66) Thanks [@JounQin](https://github.com/JounQin)! - fix: republish as npm `latest` tag version

## 0.11.7

### Patch Changes

- [#217](https://github.com/un-ts/synckit/pull/217) [`2a3f936`](https://github.com/un-ts/synckit/commit/2a3f9361c37110f7f096a2f2ffb690dd3432a755) Thanks [@fisker](https://github.com/fisker) and [@JounQin](https://github.com/JounQin)! - fix: unexpected null pointer exception due to race condition

## 0.11.6

### Patch Changes

- [#240](https://github.com/un-ts/synckit/pull/240) [`e0caff5`](https://github.com/un-ts/synckit/commit/e0caff54a9865ee49e53e610ee1a1bc80ca1279c) Thanks [@JounQin](https://github.com/JounQin)! - refactor: target ES2020 to drop `tslib` dependency

## 0.11.5

### Patch Changes

- [#235](https://github.com/un-ts/synckit/pull/235) [`abdb67a`](https://github.com/un-ts/synckit/commit/abdb67a11f67151fd39ac646b4ea11b325e079ac) Thanks [@JounQin](https://github.com/JounQin)! - fix: use `tsdown` to bundle `cjs` outputs

## 0.11.4

### Patch Changes

- [#232](https://github.com/un-ts/synckit/pull/232) [`18e6cd4`](https://github.com/un-ts/synckit/commit/18e6cd477919310d5f230bc0c3b5e9cb89183405) Thanks [@JounQin](https://github.com/JounQin)! - fix: remove buggy `module-sync` entry

## 0.11.3

### Patch Changes

- [#228](https://github.com/un-ts/synckit/pull/228) [`cc7c724`](https://github.com/un-ts/synckit/commit/cc7c724e0a3ef1fe6fa425767f50f7206f130ec4) Thanks [@JounQin](https://github.com/JounQin)! - fix: legacy top level `types` entry should prefer `.d.cts`

## 0.11.2

### Patch Changes

- [#226](https://github.com/un-ts/synckit/pull/226) [`133408d`](https://github.com/un-ts/synckit/commit/133408db2d42ddd4e6c9b1c902700949c27117a2) Thanks [@JounQin](https://github.com/JounQin)! - fix: `.cts` should never be treated as esm

## 0.11.1

### Patch Changes

- [#224](https://github.com/un-ts/synckit/pull/224) [`0966d2a`](https://github.com/un-ts/synckit/commit/0966d2aa2f9a8d4b2c8692edf6b2e2d150f8b9ed) Thanks [@JounQin](https://github.com/JounQin)! - fix: add missing `MessageChannel` from `node:worker_threads` for Node 14 compatibility

## 0.11.0

### Minor Changes

- [#222](https://github.com/un-ts/synckit/pull/222) [`59f7432`](https://github.com/un-ts/synckit/commit/59f743294c1843b1c4946fa08df42fa785975ffc) Thanks [@JounQin](https://github.com/JounQin)! - feat: add `oxc` ts runner support, correct `swc` ts runner with `--import` flag support

### Patch Changes

- [#222](https://github.com/un-ts/synckit/pull/222) [`59f7432`](https://github.com/un-ts/synckit/commit/59f743294c1843b1c4946fa08df42fa785975ffc) Thanks [@JounQin](https://github.com/JounQin)! - fix: `.cjs` should never be treated as ESM

- [#219](https://github.com/un-ts/synckit/pull/219) [`79fa3a2`](https://github.com/un-ts/synckit/commit/79fa3a2386666be6379244414066888fbebeefac) Thanks [@JounQin](https://github.com/JounQin)! - refactor: split into chunk files, add `module-sync` entry

- [#222](https://github.com/un-ts/synckit/pull/222) [`59f7432`](https://github.com/un-ts/synckit/commit/59f743294c1843b1c4946fa08df42fa785975ffc) Thanks [@JounQin](https://github.com/JounQin)! - fix: only consider `process.features.typescript` when `--no-experimental-strip-types` flag enabled

## 0.10.3

### Patch Changes

- [#214](https://github.com/un-ts/synckit/pull/214) [`386bfb9`](https://github.com/un-ts/synckit/commit/386bfb91434e4947785085720ab66b24f7679639) Thanks [@fisker](https://github.com/fisker)! - chore: improve performance on first run

## 0.10.2

### Minor Changes

- [#206](https://github.com/un-ts/synckit/pull/206) [`011e9c0`](https://github.com/un-ts/synckit/commit/011e9c0e3fa12493068a009f6359904aeb3dced8) Thanks [@JounQin](https://github.com/JounQin)! - refactor: simplify types, any function should be accepted

- [#210](https://github.com/un-ts/synckit/pull/210) [`888302c`](https://github.com/un-ts/synckit/commit/888302c6f30d83c76a0f924e07e7867695a6ca3e) Thanks [@JounQin](https://github.com/JounQin)! - feat: add new `bun` ts runner

- [#211](https://github.com/un-ts/synckit/pull/211) [`19f9a78`](https://github.com/un-ts/synckit/commit/19f9a78fcc3596eceb123b6b65bd3c32f01d0d34) Thanks [@JounQin](https://github.com/JounQin)! - feat: support `node` runner by default for Node 22.6+

- [#213](https://github.com/un-ts/synckit/pull/213) [`0d168d7`](https://github.com/un-ts/synckit/commit/0d168d729d3f67c64b655718c24752e580559bec) Thanks [@JounQin](https://github.com/JounQin)! - feat: support `stdio` overriding in worker, what means `stdio` will be streamed in correct order now

- [#208](https://github.com/un-ts/synckit/pull/208) [`d3da4c3`](https://github.com/un-ts/synckit/commit/d3da4c3542483022248ff191d43d4f1de3136a86) Thanks [@JounQin](https://github.com/JounQin)! - feat: support file url worker path

### Patch Changes

- [#209](https://github.com/un-ts/synckit/pull/209) [`61f2ff2`](https://github.com/un-ts/synckit/commit/61f2ff29186a12e624697fc5898cdee792f9361b) Thanks [@JounQin](https://github.com/JounQin)! - fix: incorrect commonjs types

## 0.10.1

### Patch Changes

- [#204](https://github.com/un-ts/synckit/pull/204) [`e13a68a`](https://github.com/un-ts/synckit/commit/e13a68aed92b90099741bab712c695c3bccbfcff) Thanks [@nwidynski](https://github.com/nwidynski)! - fix: add support for type transformations to node runner, clarify correct Node versions support

## 0.10.0

### Minor Changes

- [#199](https://github.com/un-ts/synckit/pull/199) [`7a5f1bd`](https://github.com/un-ts/synckit/commit/7a5f1bd22d5535a896457b4bcc8028f0d15e3cde) Thanks [@nwidynski](https://github.com/nwidynski)! - feat: add support for `--experimental-strip-types`

  Introducing the `node` runner, which will replace `ts-node` as the new default:
  - when running on Node 22 with the `--experimental-strip-types`
    flag enabled via `NODE_OPTIONS` env or cli args
  - or when running on Node 23+ without `--no-experimental-strip-types`
    flag enabled via `NODE_OPTIONS` env or cli args

  An error will be thrown when attempting to run with `node` on unsupported versions (<22).
  On these versions, the default runner remains `ts-node` when available.

## 0.9.2

### Patch Changes

- [#184](https://github.com/un-ts/synckit/pull/184) [`30d28ae`](https://github.com/un-ts/synckit/commit/30d28aefd5a5cdc86f82ee9f1d53853909814fc5) Thanks [@jedlikowski](https://github.com/jedlikowski)! - fix: handle outdated message in channel queue

## 0.9.1

### Patch Changes

- [#175](https://github.com/un-ts/synckit/pull/175) [`e99bf89`](https://github.com/un-ts/synckit/commit/e99bf89a28e64d45643a819d1f74f038699c480e) Thanks [@fmal](https://github.com/fmal)! - fix: support yarn pnp with node 20

## 0.9.0

### Minor Changes

- [#154](https://github.com/un-ts/synckit/pull/154) [`2541a1e`](https://github.com/un-ts/synckit/commit/2541a1e9b3d0e8f01f29f78ac53cb835936f6a30) Thanks [@onigoetz](https://github.com/onigoetz)! - feat!: use a single SharedArrayBuffer, remove useless `bufferSize` option

### Patch Changes

- [#156](https://github.com/un-ts/synckit/pull/156) [`be4648c`](https://github.com/un-ts/synckit/commit/be4648c45a698aee1be8e267b78542b13c8596aa) Thanks [@JounQin](https://github.com/JounQin)! - refactor: lazy initialize caches

## 0.8.8

### Patch Changes

- [#148](https://github.com/un-ts/synckit/pull/148) [`7b6a0eb`](https://github.com/un-ts/synckit/commit/7b6a0eb2c7e1f4482c72dc89e0f7474cd1bcc6d9) Thanks [@JounQin](https://github.com/JounQin)! - feat: migrate `@pkgr/utils` to lite `@pkgr/core` - This will make the whole package much more smaller

## 0.8.7

### Patch Changes

- [#145](https://github.com/un-ts/synckit/pull/145) [`b2affa0`](https://github.com/un-ts/synckit/commit/b2affa0e639bcdf252b7115402f22765aabedf3c) Thanks [@JounQin](https://github.com/JounQin)! - feat: add new `globalShims` option, what means you can env `SYNCKIT_GLOBAL_SHIMS=1` to enable auto polyfilling for some modules, for example: `fetch` from `node-fetch`, `performance` from `node:perf_hooks`.

  You can also pass a custom `globalShims` option as `GlobalShim` `Array` to custom your own shims:

  ````ts
  export interface GlobalShim {
    moduleName: string
    /** `undefined` means side effect only */
    globalName?: string
    /**
     * 1. `undefined` or empty string means `default`, for example:
     *
     * ```js
     * import globalName from 'module-name'
     * ```
     *
     * 2. `null` means namespaced, for example:
     *
     * ```js
     * import * as globalName from 'module-name'
     * ```
     */
    named?: string | null
    /**
     * If not `false`, the shim will only be applied when the original
     * `globalName` unavailable, for example you may only want polyfill
     * `globalThis.fetch` when it's unavailable natively:
     *
     * ```js
     * import fetch from 'node-fetch'
     *
     * if (!globalThis.fetch) {
     *   globalThis.fetch = fetch
     * }
     * ```
     */
    conditional?: boolean
  }
  ````

  You can aslo reuse the exported `DEFAULT_GLOBAL_SHIMS_PRESET` for extanding:

  ```js
  import { DEFAULT_GLOBAL_SHIMS_PRESET, createSyncFn } from 'synckit'

  const syncFn = createSyncFn(require.resolve('./worker'), {
    globalShims: [
      ...DEFAULT_GLOBAL_SHIMS_PRESET,
      // your own shim here
    ],
  })
  ```

## 0.8.6

### Patch Changes

- [#141](https://github.com/un-ts/synckit/pull/141) [`608c9d9`](https://github.com/un-ts/synckit/commit/608c9d9f9f98acfc1ff681706034bddc5bebba98) Thanks [@JounQin](https://github.com/JounQin)! - fix: only fallback to `ts-node` when it's available - close #128

- [#142](https://github.com/un-ts/synckit/pull/142) [`097e5cd`](https://github.com/un-ts/synckit/commit/097e5cd47a132b895f1f3d476197f909a364a9ec) Thanks [@JounQin](https://github.com/JounQin)! - feat: add custom transferList support - close #131

## 0.8.5

### Patch Changes

- [#126](https://github.com/un-ts/synckit/pull/126) [`758aaf1`](https://github.com/un-ts/synckit/commit/758aaf13f3a27f050269fb46116b5123fda1bd71) Thanks [@krossekrabbe](https://github.com/krossekrabbe)! - fix: pnp loader path on Windows

## 0.8.4

### Patch Changes

- [#109](https://github.com/un-ts/synckit/pull/109) [`b61087f`](https://github.com/un-ts/synckit/commit/b61087f02d9745375b85ed719126399d75b6be28) Thanks [@JounQin](https://github.com/JounQin)! - fix: incorrect `extractProperties` typings for known object

## 0.8.3

### Patch Changes

- [#106](https://github.com/un-ts/synckit/pull/106) [`9f27ff9`](https://github.com/un-ts/synckit/commit/9f27ff9b10c802cd670af97d660387ec9a9f4333) Thanks [@JounQin](https://github.com/JounQin)! - feat: add `swc` (`@swc-node/register`) support out of box

- [#103](https://github.com/un-ts/synckit/pull/103) [`b1308ac`](https://github.com/un-ts/synckit/commit/b1308accc392370fcac131c3d4d1a862c0c9170f) Thanks [@noahnu](https://github.com/noahnu)! - fix: pass yarn PnP experimental loader to worker if it exists

## 0.8.2

### Patch Changes

- [#98](https://github.com/un-ts/synckit/pull/98) [`4fe6aef`](https://github.com/un-ts/synckit/commit/4fe6aef243872ef5a1e05a72785f5f21d6736a41) Thanks [@noahnu](https://github.com/noahnu)! - feat: support yarn PnP out of box, propagate PnP runtime

- [#97](https://github.com/un-ts/synckit/pull/97) [`d1bed37`](https://github.com/un-ts/synckit/commit/d1bed37310edf4e4b92f57402e4f950cf4ff01a8) Thanks [@noahnu](https://github.com/noahnu)! - fix: typo of `SYNCKIT_EXEC_ARGV` environment variable

- [#101](https://github.com/un-ts/synckit/pull/101) [`34e44ae`](https://github.com/un-ts/synckit/commit/34e44ae42699dc3261affe8ad8e98a25a6134879) Thanks [@JounQin](https://github.com/JounQin)! - feat: propagate sync errors from worker

## 0.8.1

### Patch Changes

- [#92](https://github.com/un-ts/synckit/pull/92) [`396e964`](https://github.com/un-ts/synckit/commit/396e964549a1c7ede9faae07ab1b3165cd1bffce) Thanks [@JounQin](https://github.com/JounQin)! - fix: better compatibility on Node 14

## 0.8.0

### Minor Changes

- [#90](https://github.com/un-ts/synckit/pull/90) [`ffcf174`](https://github.com/un-ts/synckit/commit/ffcf174aae7f735f3706c11673cf40d79c6cdc16) Thanks [@JounQin](https://github.com/JounQin)! - build!: drop Node 12 support, remove testing on Node 14

- [#90](https://github.com/un-ts/synckit/pull/90) [`ffcf174`](https://github.com/un-ts/synckit/commit/ffcf174aae7f735f3706c11673cf40d79c6cdc16) Thanks [@JounQin](https://github.com/JounQin)! - feat: support more ts runners for TypeScript files
  - https://github.com/TypeStrong/ts-node
  - https://github.com/egoist/esbuild-register
  - https://github.com/folke/esbuild-runner
  - https://github.com/esbuild-kit/tsx

  Feel free to PR to add more runner support like [`swc`](https://github.com/swc-project/swc) if you want

## 0.7.3

### Patch Changes

- [#88](https://github.com/un-ts/synckit/pull/88) [`f9d0c3e`](https://github.com/un-ts/synckit/commit/f9d0c3e26f10a64c683bdb1117c5c1453b0036b4) Thanks [@JounQin](https://github.com/JounQin)! - feat: support map `cjs` to `cts`, `mjs` to `mts` automatically

## 0.7.2

### Patch Changes

- [`1101ede`](https://github.com/un-ts/synckit/commit/1101ede3fbc02df1561c9f84a183b3dbd8f8e7cb) Thanks [@JounQin](https://github.com/JounQin)! - chore: add donate and funding fields, update node engine field

## 0.7.1

### Patch Changes

- [`f098d29`](https://github.com/un-ts/synckit/commit/f098d2970b4aadd0a5687baaeeaec3d9b6697f30) Thanks [@JounQin](https://github.com/JounQin)! - fix: known Windows issues

- [`c53d9dc`](https://github.com/un-ts/synckit/commit/c53d9dc47e174bbf3e5c35b07d40194dda6173e9) Thanks [@JounQin](https://github.com/JounQin)! - feat: use workerPath as URL for Windows

  related mdx-js/eslint-mdx#389

## 0.7.0

### Minor Changes

- [#78](https://github.com/un-ts/synckit/pull/78) [`fd85ccd`](https://github.com/un-ts/synckit/commit/fd85ccd41f012f677619441694c3044f0b70c653) Thanks [@JounQin](https://github.com/JounQin)! - feat: support js as ts, ts as esm, etc

## 0.6.2

### Patch Changes

- [#76](https://github.com/un-ts/synckit/pull/76) [`e7393f1`](https://github.com/un-ts/synckit/commit/e7393f19b84e2b3ffdac7b48c7a1442e7cbabaf4) Thanks [@JounQin](https://github.com/JounQin)! - chore: export extractProperties

## 0.6.1

### Patch Changes

- [`da19076`](https://github.com/un-ts/synckit/commit/da1907659806b31b49a6e9c73ae07b160bb02ff9) Thanks [@JounQin](https://github.com/JounQin)! - fix: extract and apply error properties

## 0.6.0

### Minor Changes

- [`18106a5`](https://github.com/un-ts/synckit/commit/18106a511c9dfc21a9ae19c70ab19fb3b71fcbf5) Thanks [@JounQin](https://github.com/JounQin)! - feat: add custom `execArgv` support

  close #55

## 0.5.0

### Minor Changes

- [#47](https://github.com/un-ts/synckit/pull/47) [`a362982`](https://github.com/un-ts/synckit/commit/a362982eac4083ff3d00b4f6a9d4f4183dd2418e) Thanks [@JounQin](https://github.com/JounQin)! - feat: drop child_process

## 0.4.0

### Minor Changes

- [#45](https://github.com/un-ts/synckit/pull/45) [`f38de5f`](https://github.com/un-ts/synckit/commit/f38de5fe5dfc8e4a8871d3d55e7a4d9bdc3a5d05) Thanks [@JounQin](https://github.com/JounQin)! - feat: use native esm

## 0.3.4

### Patch Changes

- [#39](https://github.com/un-ts/synckit/pull/39) [`0698572`](https://github.com/un-ts/synckit/commit/0698572d048e38d9c1e5de233c07e89a7ca01eca) Thanks [@JounQin](https://github.com/JounQin)! - fix: test whether `receiveMessageOnPort` available for `--experimental-worker`

## 0.3.3

### Patch Changes

- [#37](https://github.com/un-ts/synckit/pull/37) [`4ae675a`](https://github.com/un-ts/synckit/commit/4ae675ad4b0bc02ac459e9d49319154048ee40dd) Thanks [@JounQin](https://github.com/JounQin)! - fix: `worker_threads` API changes a lot

## 0.3.2

### Patch Changes

- [#35](https://github.com/un-ts/synckit/pull/35) [`578db5b`](https://github.com/un-ts/synckit/commit/578db5bd33fdd137ca09b450a211e46d3f7299cf) Thanks [@JounQin](https://github.com/JounQin)! - fix: improve compatibility with node >=8.10 <12.11

## 0.3.1

### Patch Changes

- [#34](https://github.com/un-ts/synckit/pull/34) [`255736c`](https://github.com/un-ts/synckit/commit/255736ca98731cf52aa1391d855737f45edb457f) Thanks [@JounQin](https://github.com/JounQin)! - fix: `worker_threads` is only available on Node 12

- [#32](https://github.com/un-ts/synckit/pull/32) [`d84e48e`](https://github.com/un-ts/synckit/commit/d84e48e643124c3d5801bec3147ec158ccf6db49) Thanks [@JounQin](https://github.com/JounQin)! - fix(types): stricter but internal types

## 0.3.0

### Minor Changes

- [#27](https://github.com/un-ts/synckit/pull/27) [`2809da0`](https://github.com/un-ts/synckit/commit/2809da0d25b9e4c617b3699c78cf80fbae895c6f) Thanks [@JounQin](https://github.com/JounQin)! - feat: add more env variables support

## 0.2.0

### Minor Changes

- [#23](https://github.com/un-ts/synckit/pull/23) [`6577e86`](https://github.com/un-ts/synckit/commit/6577e86bff97a6a4d803394571e9406a86dd82dc) Thanks [@JounQin](https://github.com/JounQin)! - feat: use worker_threads by default for performance

## 0.1.6

### Patch Changes

- [`b3e9760`](https://github.com/un-ts/synckit/commit/b3e976062f1c568d495ad0a578c55b83506208c9) Thanks [@JounQin](https://github.com/JounQin)! - feat: support custom TSCONFIG_PATH env

## 0.1.4

### Patch Changes

- [#9](https://github.com/un-ts/synckit/pull/9) [`cad2e05`](https://github.com/un-ts/synckit/commit/cad2e059bba51779115f63121077532b97d8aa6e) Thanks [@JounQin](https://github.com/JounQin)! - fix: try to fix clean-publish + changeset publish again

## 0.1.2

### Patch Changes

- [#7](https://github.com/un-ts/synckit/pull/7) [`0336c22`](https://github.com/un-ts/synckit/commit/0336c22a5f159fa6d35b9a6b8f93f0a56a35b3dd) Thanks [@JounQin](https://github.com/JounQin)! - fix: try to fix clean-publish + changeset publish

## 0.1.1

### Patch Changes

- [#5](https://github.com/un-ts/synckit/pull/5) [`e451004`](https://github.com/un-ts/synckit/commit/e4510040211b139a423d64eaf6607804c00a9915) Thanks [@JounQin](https://github.com/JounQin)! - fix: improve type definitions, mark tslib as dep

## 0.1.0

### Minor Changes

- [`e7446f9`](https://github.com/un-ts/synckit/commit/e7446f91421df5ee59e05adc002b3daa52dff96f) Thanks [@JounQin](https://github.com/JounQin)! - feat: first blood, should just work
