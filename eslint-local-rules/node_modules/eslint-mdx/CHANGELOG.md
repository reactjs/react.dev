# Change Log

## 3.8.2

### Patch Changes

- [#618](https://github.com/mdx-js/eslint-mdx/pull/618) [`f07115b`](https://github.com/mdx-js/eslint-mdx/commit/f07115b9b14e6b4d0eb4635b92632af091863c56) Thanks [@renovate](https://github.com/apps/renovate)! - fix: surface worker failures instead of hanging forever

  Upgrade `synckit` to `^0.12.3` so a worker failure is reported to the caller
  instead of leaving ESLint blocked in `Atomics.wait()`, which made lint runs over
  large projects appear to hang with no diagnostics.

  Closes [#605](https://github.com/mdx-js/eslint-mdx/issues/605).

## 3.8.1

## 3.8.0

## 3.7.1

### Patch Changes

- [#610](https://github.com/mdx-js/eslint-mdx/pull/610) [`a581355`](https://github.com/mdx-js/eslint-mdx/commit/a581355bb56f4c8def8adf5808fdc5b31f9418c6) Thanks [@JounQin](https://github.com/JounQin)! - chore: restore better node compatibility

## 3.7.0

### Patch Changes

- [#606](https://github.com/mdx-js/eslint-mdx/pull/606) [`a381990`](https://github.com/mdx-js/eslint-mdx/commit/a38199079b79ba787fd4c7e50a34b15615ac727b) Thanks [@remcohaszing](https://github.com/remcohaszing)! - chore: use OIDC for publishing

- [#600](https://github.com/mdx-js/eslint-mdx/pull/600) [`00a8369`](https://github.com/mdx-js/eslint-mdx/commit/00a836938fed26c4bd95358d25a0f045fcee6245) Thanks [@Jason3S](https://github.com/Jason3S)! - fix: remove unneeded dependency upon uvu

## 3.6.2

## 3.6.1

### Patch Changes

- [#591](https://github.com/mdx-js/eslint-mdx/pull/591) [`a45ee72`](https://github.com/mdx-js/eslint-mdx/commit/a45ee72a71634fbc843596ba36dbc0cc569f0bba) Thanks [@JounQin](https://github.com/JounQin)! - fix: pass through `remarkConfigPath` of `parserOptions`

## 3.6.0

### Minor Changes

- [#589](https://github.com/mdx-js/eslint-mdx/pull/589) [`7b5e748`](https://github.com/mdx-js/eslint-mdx/commit/7b5e7489f59659df7cc8d03b5ed5354e0f8a452e) Thanks [@JounQin](https://github.com/JounQin)! - feat: support specifying `remarkConfigPath` manually

## 3.5.0

### Minor Changes

- [#580](https://github.com/mdx-js/eslint-mdx/pull/580) [`27da917`](https://github.com/mdx-js/eslint-mdx/commit/27da91768c55979f6d65bd6d0226403f05ef5470) Thanks [@renovate](https://github.com/apps/renovate) and [@JounQin](https://github.com/JounQin)! - refactor: target `ES2022` and drop unnecessary `tslib` dependency

## 3.4.2

### Patch Changes

- [#577](https://github.com/mdx-js/eslint-mdx/pull/577) [`b670ae4`](https://github.com/mdx-js/eslint-mdx/commit/b670ae4b6b8e509d278ab3a90834231666b98609) Thanks [@JounQin](https://github.com/JounQin)! - fix: take `cwd` into cache key account

- [#577](https://github.com/mdx-js/eslint-mdx/pull/577) [`b670ae4`](https://github.com/mdx-js/eslint-mdx/commit/b670ae4b6b8e509d278ab3a90834231666b98609) Thanks [@JounQin](https://github.com/JounQin)! - fix: remove buggy `module-sync` entry

## 3.4.1

### Patch Changes

- [#569](https://github.com/mdx-js/eslint-mdx/pull/569) [`c101877`](https://github.com/mdx-js/eslint-mdx/commit/c101877715455bd7663510459a4623086091df20) Thanks [@JounQin](https://github.com/JounQin)! - fix: `types` field should point to `.d.cts`

- [#571](https://github.com/mdx-js/eslint-mdx/pull/571) [`5b965b3`](https://github.com/mdx-js/eslint-mdx/commit/5b965b3b603af656c782f95c63126c1c5c4dfcc0) Thanks [@lopenchi](https://github.com/lopenchi)! - fix: pass `cwd` into `getRemarkConfig` from `getRemarkProcessor`

## 3.4.0

### Minor Changes

- [#562](https://github.com/mdx-js/eslint-mdx/pull/562) [`3aa0f20`](https://github.com/mdx-js/eslint-mdx/commit/3aa0f20174361adce25f969bfb48a4fc214fcdff) Thanks [@JounQin](https://github.com/JounQin)! - refactor: remove unnecessary `loadEsmModule` helper, use native `import()` instead

- [#561](https://github.com/mdx-js/eslint-mdx/pull/561) [`c62c541`](https://github.com/mdx-js/eslint-mdx/commit/c62c541dc317e6069f11dbd724b8fb925c2e64e5) Thanks [@JounQin](https://github.com/JounQin)! - feat: respect `.remarkignore` at the same time

## 3.3.2

### Patch Changes

- [#558](https://github.com/mdx-js/eslint-mdx/pull/558) [`cb2a660`](https://github.com/mdx-js/eslint-mdx/commit/cb2a660fc1a712b0ac91a603f5b34f7b8a050aac) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): pin dependencies, bump `synckit`

## 3.3.1

### Patch Changes

- [#554](https://github.com/mdx-js/eslint-mdx/pull/554) [`816a2a6`](https://github.com/mdx-js/eslint-mdx/commit/816a2a632a4c96c12e8b549321168db428a12917) Thanks [@JounQin](https://github.com/JounQin)! - chore: add `module-sync` entry

## 3.3.0

### Minor Changes

- [#552](https://github.com/mdx-js/eslint-mdx/pull/552) [`1c31834`](https://github.com/mdx-js/eslint-mdx/commit/1c31834fa987452df774111e60c36e5912756ad7) Thanks [@JounQin](https://github.com/JounQin)! - feat: the new version is ESM primary, while commonjs is still supported.

  ESM migration:

  ```ts
  // before
  import eslintMdx from 'eslint-mdx'
  import eslintPluginMdx from 'eslint-plugin-mdx'
  ```

  ```ts
  // after
  import * as eslintMdx from 'eslint-mdx'
  import * as eslintPluginMdx from 'eslint-plugin-mdx'
  ```

## 3.2.0

### Minor Changes

- [#550](https://github.com/mdx-js/eslint-mdx/pull/550) [`f093ff9`](https://github.com/mdx-js/eslint-mdx/commit/f093ff9e2f159fffead825dd9f0ff97170e45441) Thanks [@JounQin](https://github.com/JounQin)! - chore: drop `eslint-plugin-markdown` dep

## 3.1.5

## 3.1.4

### Patch Changes

- [`d593901`](https://github.com/mdx-js/eslint-mdx/commit/d593901379672aeca11d4f60729a7eaa5762fe5c) Thanks [@JounQin](https://github.com/JounQin)! - fix: re-release as latest tag - close #517

## 3.1.3

### Patch Changes

- [#514](https://github.com/mdx-js/eslint-mdx/pull/514) [`1f2dd73`](https://github.com/mdx-js/eslint-mdx/commit/1f2dd73c2be73cc6882e12a693530079c4dc74f1) Thanks [@JounQin](https://github.com/JounQin)! - chore: bump synckit

## 3.1.2

### Patch Changes

- [#511](https://github.com/mdx-js/eslint-mdx/pull/511) [`f2067c1`](https://github.com/mdx-js/eslint-mdx/commit/f2067c1df1ebc06effaab119251db9247affbbd8) Thanks [@JounQin](https://github.com/JounQin)! - chore: log error details on `--debug` flag enabled

## 3.1.1

### Patch Changes

- [#499](https://github.com/mdx-js/eslint-mdx/pull/499) [`97ade8f`](https://github.com/mdx-js/eslint-mdx/commit/97ade8f39bad40709bbf25ac5ec9750168281f8d) Thanks [@JounQin](https://github.com/JounQin)! - fix: incorrect docs due to prettier + mdx v2+ incompatible

## 3.1.0

## 3.0.1

### Patch Changes

- [#493](https://github.com/mdx-js/eslint-mdx/pull/493) [`e3c225b`](https://github.com/mdx-js/eslint-mdx/commit/e3c225bbc3e3908984982adbdc259008081db852) Thanks [@JounQin](https://github.com/JounQin)! - fix: incorrect `JSXAttribute` node position info - close #488, related #425

- [#493](https://github.com/mdx-js/eslint-mdx/pull/493) [`e3c225b`](https://github.com/mdx-js/eslint-mdx/commit/e3c225bbc3e3908984982adbdc259008081db852) Thanks [@JounQin](https://github.com/JounQin)! - fix: incompatible with some react rules: `jsx-curly-brace-presence`, `jsx-sort-props`, `self-closing-comp`

## 3.0.0

### Major Changes

- [#486](https://github.com/mdx-js/eslint-mdx/pull/486) [`508e7ce`](https://github.com/mdx-js/eslint-mdx/commit/508e7cef15d1cdafe2a4ac1c635b8c320567de46) Thanks [@JounQin](https://github.com/JounQin)! - feat!: bump all unified ecosystem dependencies, support mdx v3

- [#486](https://github.com/mdx-js/eslint-mdx/pull/486) [`508e7ce`](https://github.com/mdx-js/eslint-mdx/commit/508e7cef15d1cdafe2a4ac1c635b8c320567de46) Thanks [@JounQin](https://github.com/JounQin)! - chore!: require node >= 18, drop node 12, 14 and 16

## 2.2.0

### Minor Changes

- [#468](https://github.com/mdx-js/eslint-mdx/pull/468) [`5b04837`](https://github.com/mdx-js/eslint-mdx/commit/5b04837cfc8cc9881c18356f9fcd67105d423a75) Thanks [@JounQin](https://github.com/JounQin)! - feat: add metadata for parser, processor and plugin

## 2.1.0

### Minor Changes

- [#461](https://github.com/mdx-js/eslint-mdx/pull/461) [`296a319`](https://github.com/mdx-js/eslint-mdx/commit/296a319bf7f385d97c6d647e093233552e7d99b3) Thanks [@JounQin](https://github.com/JounQin)! - feat: use unified-engine to load ESM configurations

### Patch Changes

- [#460](https://github.com/mdx-js/eslint-mdx/pull/460) [`58639a0`](https://github.com/mdx-js/eslint-mdx/commit/58639a0aa214ec930d07dada0afc1d1449c52a9e) Thanks [@JounQin](https://github.com/JounQin)! - fix: jsx name could be namespace or member expression

- [#458](https://github.com/mdx-js/eslint-mdx/pull/458) [`9a71318`](https://github.com/mdx-js/eslint-mdx/commit/9a71318de1b6d8d5adac5b7cf7fba0526d294c49) Thanks [@JounQin](https://github.com/JounQin)! - fix: void attribute and empty attribute are different

## 2.0.5

### Patch Changes

- [#431](https://github.com/mdx-js/eslint-mdx/pull/431) [`bebc564`](https://github.com/mdx-js/eslint-mdx/commit/bebc564fdf0587b2aa47bb13707031da676b851c) Thanks [@JounQin](https://github.com/JounQin)! - fix: parse error on void boolean attributes

- [#428](https://github.com/mdx-js/eslint-mdx/pull/428) [`ff52be2`](https://github.com/mdx-js/eslint-mdx/commit/ff52be232611275307681a53c69ed40c3a419da1) Thanks [@JounQin](https://github.com/JounQin)! - fix: handle pure ESM robustly

## 2.0.4

### Patch Changes

- [#425](https://github.com/mdx-js/eslint-mdx/pull/425) [`fb3f154`](https://github.com/mdx-js/eslint-mdx/commit/fb3f154d89b6081d671e2590eb59fd2bf158a213) Thanks [@chenxsan](https://github.com/chenxsan)! - fix: incorrect jsx attribute `name` AST

## 2.0.3

### Patch Changes

- [#424](https://github.com/mdx-js/eslint-mdx/pull/424) [`2ae592a`](https://github.com/mdx-js/eslint-mdx/commit/2ae592a06b54e252dfbc1c79f9b2beeac9e7a418) Thanks [@JounQin](https://github.com/JounQin)! - fix: pass consistent acorn parser for micromark-extension-mdxjs

- [#422](https://github.com/mdx-js/eslint-mdx/pull/422) [`d321cf2`](https://github.com/mdx-js/eslint-mdx/commit/d321cf26724631f1184fe57c5f0f365fe652bb68) Thanks [@JounQin](https://github.com/JounQin)! - chore(deps): bump (dev)dependencies

## 2.0.2

### Patch Changes

- [#412](https://github.com/mdx-js/eslint-mdx/pull/412) [`e69791`](https://github.com/mdx-js/eslint-mdx/commit/e6979104fbee6626bbe9d2ef6293d9f0084e5b54) Thanks [@EdisonSu768](https://github.com/EdisonSu768)! - fix: resolve circular imports in worker

- [#414](https://github.com/mdx-js/eslint-mdx/pull/414) [`58e529c`](https://github.com/mdx-js/eslint-mdx/commit/58e529cdee262455efb36a1e65dc10865d7d9146) Thanks [@JounQin](https://github.com/JounQin)! - fix(deps): add missing dependencies for yarn@v2+ and pnpm

## [2.0.1](https://github.com/mdx-js/eslint-mdx/compare/v2.0.0...v2.0.1) (2022-06-29)

### Bug Fixes

- add missing unist-util-visit and vfile deps ([#405](https://github.com/mdx-js/eslint-mdx/issues/405)) ([6b4fea7](https://github.com/mdx-js/eslint-mdx/commit/6b4fea75c5b63c37b066d6fbd0a3abdf497ebc26))

# [2.0.0](https://github.com/mdx-js/eslint-mdx/compare/v2.0.0-next.6...v2.0.0) (2022-06-19)

**Note:** Version bump only for package eslint-mdx

# [2.0.0-next.6](https://github.com/mdx-js/eslint-mdx/compare/v2.0.0-next.5...v2.0.0-next.6) (2022-06-19)

### Bug Fixes

- same markdown processor cached for .md and .mdx ([#401](https://github.com/mdx-js/eslint-mdx/issues/401)) ([c1b4671](https://github.com/mdx-js/eslint-mdx/commit/c1b467120db47ee43510785ceea942566968c597))

# [1.17.0](https://github.com/mdx-js/eslint-mdx/compare/v1.16.0...v1.17.0) (2022-03-21)

### Features

- allow to ignore remark config ([#374](https://github.com/mdx-js/eslint-mdx/issues/374)) ([1c9e3fd](https://github.com/mdx-js/eslint-mdx/commit/1c9e3fdccbd7571cec4ea2758412ace1dfe19222))

# [1.16.0](https://github.com/mdx-js/eslint-mdx/compare/v1.15.1...v1.16.0) (2021-10-20)

### Features

- add support for eslint 8 ([#353](https://github.com/mdx-js/eslint-mdx/issues/353)) ([d47af33](https://github.com/mdx-js/eslint-mdx/commit/d47af33f86522a3292a8ad04f62191f12a3743a4))

## [1.15.1](https://github.com/mdx-js/eslint-mdx/compare/v1.15.0...v1.15.1) (2021-09-15)

### Bug Fixes

- allow comments to contain `--` ([#348](https://github.com/mdx-js/eslint-mdx/issues/348)) ([65028b9](https://github.com/mdx-js/eslint-mdx/commit/65028b996ffc20011c9565599bc67ebf96432728))
- **deps:** update dependency cosmiconfig to ^7.0.1 ([1dbac89](https://github.com/mdx-js/eslint-mdx/commit/1dbac892ad61e49a139bbaf2a67fae6b22e2bc2a))
- **deps:** update dependency unified to ^9.2.2 ([29ba0c5](https://github.com/mdx-js/eslint-mdx/commit/29ba0c5f1c677970ec09398b67549fe2c8a6fef0))

# [1.15.0](https://github.com/mdx-js/eslint-mdx/compare/v1.14.1...v1.15.0) (2021-08-21)

### Bug Fixes

- should only fallback on parse error ([#335](https://github.com/mdx-js/eslint-mdx/issues/335)) ([0feb2d3](https://github.com/mdx-js/eslint-mdx/commit/0feb2d395a5f6efc7e515afc2ae0cf07ec77af78)), closes [#334](https://github.com/mdx-js/eslint-mdx/issues/334)

### Features

- resolve custom remark config on parsing ([#337](https://github.com/mdx-js/eslint-mdx/issues/337)) ([94fcb4c](https://github.com/mdx-js/eslint-mdx/commit/94fcb4c1346d9bfdec61a8335b65e536d5b59ac4))

## [1.14.1](https://github.com/mdx-js/eslint-mdx/compare/v1.14.0...v1.14.1) (2021-07-14)

**Note:** Version bump only for package eslint-mdx

# [1.14.0](https://github.com/mdx-js/eslint-mdx/compare/v1.13.0...v1.14.0) (2021-07-11)

### Features

- bump all upgradable deps, fix related usage ([#321](https://github.com/mdx-js/eslint-mdx/issues/321)) ([ea49cac](https://github.com/mdx-js/eslint-mdx/commit/ea49cacaedf72fb0bcf61aa84c3c0ea5e58f9733))

# [1.13.0](https://github.com/mdx-js/eslint-mdx/compare/v1.12.0...v1.13.0) (2021-04-29)

### Features

- use official eslint-plugin-markdown package ([#304](https://github.com/mdx-js/eslint-mdx/issues/304)) ([e6828be](https://github.com/mdx-js/eslint-mdx/commit/e6828bee09259511cbef5020a1f0f7c89bca9dd8))

# [1.12.0](https://github.com/mdx-js/eslint-mdx/compare/v1.11.1...v1.12.0) (2021-04-05)

### Bug Fixes

- check is eslint-plugin-react available ([#299](https://github.com/mdx-js/eslint-mdx/issues/299)) ([ed82698](https://github.com/mdx-js/eslint-mdx/commit/ed826983ca21341e4eca819428f596646f0aa533))

## [1.11.1](https://github.com/mdx-js/eslint-mdx/compare/v1.11.0...v1.11.1) (2021-03-21)

### Bug Fixes

- add helper getPositionAt to fix incorrect loc ([#293](https://github.com/mdx-js/eslint-mdx/issues/293)) ([260a07e](https://github.com/mdx-js/eslint-mdx/commit/260a07e8bccf76508f19df9501b78a8a402e8a34)), closes [#292](https://github.com/mdx-js/eslint-mdx/issues/292)

# [1.11.0](https://github.com/mdx-js/eslint-mdx/compare/v1.10.0...v1.11.0) (2021-03-18)

### Features

- fix incorrect node loc ([#288](https://github.com/mdx-js/eslint-mdx/issues/288)) ([c52039c](https://github.com/mdx-js/eslint-mdx/commit/c52039c566c9f6430a414992a24e755f050c332a)), closes [#287](https://github.com/mdx-js/eslint-mdx/issues/287)

# [1.10.0](https://github.com/mdx-js/eslint-mdx/compare/v1.9.1...v1.10.0) (2021-03-16)

### Features

- use eslint-plugin-markdown as processor! ([#283](https://github.com/mdx-js/eslint-mdx/issues/283)) ([abe30cb](https://github.com/mdx-js/eslint-mdx/commit/abe30cbfd62d89f700888053b01331bc74394bd2))

## [1.9.1](https://github.com/mdx-js/eslint-mdx/compare/v1.9.0...v1.9.1) (2021-03-11)

### Bug Fixes

- wrong end.offset - close [#279](https://github.com/mdx-js/eslint-mdx/issues/279) ([#280](https://github.com/mdx-js/eslint-mdx/issues/280)) ([188c6aa](https://github.com/mdx-js/eslint-mdx/commit/188c6aab729b3b50bacc00c1502060fb705f4255))

# [1.9.0](https://github.com/mdx-js/eslint-mdx/compare/v1.8.2...v1.9.0) (2021-02-22)

### Bug Fixes

- **deps:** update dependency espree to ^7.3.1 ([0f602e3](https://github.com/mdx-js/eslint-mdx/commit/0f602e3ee3f894d5f2bfaa2b77f20f2da5e7c953))
- **deps:** update dependency remark-mdx to ^1.6.22 ([8692bf7](https://github.com/mdx-js/eslint-mdx/commit/8692bf70c75a3987a732044a96c9162272bbbe8a))

### Features

- bump (dev)Dependencies, fix: consider first jsx node as open tag - close [#272](https://github.com/mdx-js/eslint-mdx/issues/272) ([#273](https://github.com/mdx-js/eslint-mdx/issues/273)) ([cb846e9](https://github.com/mdx-js/eslint-mdx/commit/cb846e9a565de26f2f174b54f33092bd7f523399)), closes [#207](https://github.com/mdx-js/eslint-mdx/issues/207)

## [1.8.2](https://github.com/mdx-js/eslint-mdx/compare/v1.8.1...v1.8.2) (2020-08-23)

### Bug Fixes

- parsing many comments error due to mutable regex ([#227](https://github.com/mdx-js/eslint-mdx/issues/227)) ([1130911](https://github.com/mdx-js/eslint-mdx/commit/11309110841e30149ee0302b653c5b64ba59902a))

## [1.8.1](https://github.com/mdx-js/eslint-mdx/compare/v1.8.0...v1.8.1) (2020-08-05)

**Note:** Version bump only for package eslint-mdx

# [1.8.0](https://github.com/mdx-js/eslint-mdx/compare/v1.7.1...v1.8.0) (2020-08-05)

### Features

- remark-mdx is not compatible with normal markdown syntaxes ([#206](https://github.com/mdx-js/eslint-mdx/issues/206)) ([3413315](https://github.com/mdx-js/eslint-mdx/commit/3413315f2305ada846008c67fec83644a426b3b9))

## [1.7.1](https://github.com/mdx-js/eslint-mdx/compare/v1.7.0...v1.7.1) (2020-07-14)

### Bug Fixes

- compatibility with typescript-eslint ([#209](https://github.com/mdx-js/eslint-mdx/issues/209)) ([28dc160](https://github.com/mdx-js/eslint-mdx/commit/28dc160ca108ca44e4f2be3a1d7d645275c2ea6c))
- use source code to get combined jsx value ([#218](https://github.com/mdx-js/eslint-mdx/issues/218)) ([4da12a9](https://github.com/mdx-js/eslint-mdx/commit/4da12a917d215a4179f169e91c2f0e209f225137))

# [1.7.0](https://github.com/mdx-js/eslint-mdx/compare/v1.6.9...v1.7.0) (2020-05-26)

### Bug Fixes

- **deps:** update dependency remark-parse to ^8.0.1 ([a16ebb0](https://github.com/mdx-js/eslint-mdx/commit/a16ebb0ba045d2f39e862a3f915fd5089f2f4594))

### Features

- catch remark process error ([80686eb](https://github.com/mdx-js/eslint-mdx/commit/80686eb0e9cb7e0f8d468d9616b85c1f7ebc6cca))

## [1.6.9](https://github.com/mdx-js/eslint-mdx/compare/v1.6.8...v1.6.9) (2020-04-12)

### Bug Fixes

- self closing tag should not be combined - close [#158](https://github.com/mdx-js/eslint-mdx/issues/158) ([#196](https://github.com/mdx-js/eslint-mdx/issues/196)) ([1adc171](https://github.com/mdx-js/eslint-mdx/commit/1adc171a3b436c22cd33e64dfebbbfdc31fcdfaf))

## [1.6.8](https://github.com/mdx-js/eslint-mdx/compare/v1.6.6...v1.6.8) (2020-01-26)

**Note:** Version bump only for package eslint-mdx

## [1.6.7](https://github.com/mdx-js/eslint-mdx/compare/v1.6.5...v1.6.7) (2020-01-26)

### Bug Fixes

- adjacent self-closing jsx nodes parsing error - close [#138](https://github.com/mdx-js/eslint-mdx/issues/138) ([1ef8b2c](https://github.com/mdx-js/eslint-mdx/commit/1ef8b2cb48e4f4f0fa2094bc29de336ebdfe4835))

## [1.6.5](https://github.com/mdx-js/eslint-mdx/compare/v1.6.4...v1.6.5) (2019-12-17)

### Bug Fixes

- add `prepublishOnly` lifecycle script, close [#116](https://github.com/mdx-js/eslint-mdx/issues/116) ([#117](https://github.com/mdx-js/eslint-mdx/issues/117)) ([785117b](https://github.com/mdx-js/eslint-mdx/commit/785117ba3178c698710907e032f59a38289a844b))

## [1.6.4](https://github.com/mdx-js/eslint-mdx/compare/v1.6.3...v1.6.4) (2019-12-10)

### Bug Fixes

- change organization of project repository to mdx-js :tada: ([275b9dc](https://github.com/mdx-js/eslint-mdx/commit/275b9dce5a8b5619d873c841793ef1c5e0bf7f39))

## [1.6.3](https://github.com/rx-ts/eslint-mdx/compare/v1.6.2...v1.6.3) (2019-11-11)

### Bug Fixes

- **dpes:** bump cosmiconfig to v6.0.0 ([712c872](https://github.com/rx-ts/eslint-mdx/commit/712c8726c8b7ff59f4d3620f8a2de18936dd3487))

## [1.6.2](https://github.com/rx-ts/eslint-mdx/compare/v1.6.1...v1.6.2) (2019-11-03)

**Note:** Version bump only for package eslint-mdx

## [1.6.1](https://github.com/rx-ts/eslint-mdx/compare/v1.6.0...v1.6.1) (2019-10-23)

### Bug Fixes

- handle loc and range could be undefined for babel-eslint ([a98bf9d](https://github.com/rx-ts/eslint-mdx/commit/a98bf9d9fca73b04adf8b607568e28f2883967df))

# [1.6.0](https://github.com/rx-ts/eslint-mdx/compare/v1.5.9...v1.6.0) (2019-10-23)

### Features

- try all known parsers at runtime if no parser specific ([b801d56](https://github.com/rx-ts/eslint-mdx/commit/b801d56521922a384f4a9951ad930a901ee5dd26))

## [1.5.9](https://github.com/rx-ts/eslint-mdx/compare/v1.5.7...v1.5.9) (2019-10-22)

### Bug Fixes

- package content been cleared unexpectedly ([9b8dd3e](https://github.com/rx-ts/eslint-mdx/commit/9b8dd3e91c06088f66448939f99c33511f37fe7f))

## [1.5.7](https://github.com/rx-ts/eslint-mdx/compare/v1.5.6...v1.5.7) (2019-10-22)

### Bug Fixes

- always pass through parserOptions ([6d58ad8](https://github.com/rx-ts/eslint-mdx/commit/6d58ad84e9ebed6bf2b0f057e55a0669da547ee0))

## [1.5.6](https://github.com/rx-ts/eslint-mdx/compare/v1.5.5...v1.5.6) (2019-10-06)

### Bug Fixes

- **deps:** bump (dev)Dependencies, simplify output structure, prefer esm ([463ed4d](https://github.com/rx-ts/eslint-mdx/commit/463ed4d))

## [1.5.5](https://github.com/rx-ts/eslint-mdx/compare/v1.5.4...v1.5.5) (2019-09-23)

**Note:** Version bump only for package eslint-mdx

## [1.5.3](https://github.com/rx-ts/eslint-mdx/compare/v1.5.2...v1.5.3) (2019-09-23)

### Bug Fixes

- react could be unavailable, add hardcoded component names to… ([#70](https://github.com/rx-ts/eslint-mdx/issues/70)) ([0281fb3](https://github.com/rx-ts/eslint-mdx/commit/0281fb3))

## [1.5.2](https://github.com/rx-ts/eslint-mdx/compare/v1.5.1...v1.5.2) (2019-09-21)

**Note:** Version bump only for package eslint-mdx

## [1.5.1](https://github.com/rx-ts/eslint-mdx/compare/v1.5.0...v1.5.1) (2019-09-21)

### Bug Fixes

- correct repository field in package.json, bump devDependencies ([68799e1](https://github.com/rx-ts/eslint-mdx/commit/68799e1))

## [1.4.5](https://github.com/rx-ts/eslint-mdx/compare/v1.4.4...v1.4.5) (2019-09-09)

**Note:** Version bump only for package eslint-mdx

## [1.4.4](https://github.com/rx-ts/eslint-mdx/compare/v1.4.3...v1.4.4) (2019-09-09)

### Bug Fixes

- **deps:** update dependency remark-mdx to ^1.4.4 ([#60](https://github.com/rx-ts/eslint-mdx/issues/60)) ([d252e0b](https://github.com/rx-ts/eslint-mdx/commit/d252e0b))

## [1.4.3](https://github.com/rx-ts/eslint-mdx/compare/v1.4.2...v1.4.3) (2019-09-07)

### Bug Fixes

- **core:** add missing dependencies although it worked ([b742150](https://github.com/rx-ts/eslint-mdx/commit/b742150))

## [1.4.2](https://github.com/rx-ts/eslint-mdx/compare/v1.4.1...v1.4.2) (2019-09-04)

### Bug Fixes

- **deps:** update dependency remark-mdx to ^1.4.3 ([#56](https://github.com/rx-ts/eslint-mdx/issues/56)) ([b49641a](https://github.com/rx-ts/eslint-mdx/commit/b49641a))

# [1.4.0](https://github.com/rx-ts/eslint-mdx/compare/v1.3.1...v1.4.0) (2019-08-22)

### Features

- add support of linting plain markdown files ([9979c79](https://github.com/rx-ts/eslint-mdx/commit/9979c79))

## [1.1.0](https://github.com/rx-ts/eslint-mdx/compare/v0.11.2...v1.1.0) (2019-08-21)

### Features

- feat: integrate with remark plugins without remark-lint, close #19 ([4b50e27](https://github.com/rx-ts/eslint-mdx/commit/4b50e27))
- feat: rename plugin to `eslint-plugin-mdx`, thanks to @azz ([3c6fd15](https://github.com/rx-ts/eslint-mdx/commit/3c6fd15))

## [0.11.2](https://github.com/rx-ts/eslint-mdx/compare/v0.11.1...v0.11.2) (2019-08-13)

### Bug Fixes

- use <$> instead of <> to wrap jsx blocks for parsing ([#41](https://github.com/rx-ts/eslint-mdx/issues/41)) ([3ea2d99](https://github.com/rx-ts/eslint-mdx/commit/3ea2d99))

## [0.11.1](https://github.com/rx-ts/eslint-mdx/compare/v0.11.0...v0.11.1) (2019-08-12)

**Note:** Version bump only for package eslint-mdx

# [0.11.0](https://github.com/rx-ts/eslint-mdx/compare/v0.10.0...v0.11.0) (2019-08-11)

### Features

- all rebass components considered as global variables ([a36a69b](https://github.com/rx-ts/eslint-mdx/commit/a36a69b))
- overrides react/jsx-no-undef to allow globals ([f7d5194](https://github.com/rx-ts/eslint-mdx/commit/f7d5194))
- support top level JSX with blank lines ([e59cbdc](https://github.com/rx-ts/eslint-mdx/commit/e59cbdc))

# [0.10.0](https://github.com/rx-ts/eslint-mdx/compare/v0.9.11...v0.10.0) (2019-08-11)

### Features

- remove deprecated functions, test coverage 100% ([fd2694e](https://github.com/rx-ts/eslint-mdx/commit/fd2694e))

## [0.9.11](https://github.com/rx-ts/eslint-mdx/compare/v0.9.10...v0.9.11) (2019-08-10)

**Note:** Version bump only for package eslint-mdx

## [0.9.10](https://github.com/rx-ts/eslint-mdx/compare/v0.9.9...v0.9.10) (2019-08-10)

**Note:** Version bump only for package eslint-mdx

## [0.9.9](https://github.com/rx-ts/eslint-mdx/compare/v0.9.8...v0.9.9) (2019-08-10)

### Bug Fixes

- incorrect jsx html comment end location ([67b74b5](https://github.com/rx-ts/eslint-mdx/commit/67b74b5))

## [0.9.8](https://github.com/rx-ts/eslint-mdx/compare/v0.9.6...v0.9.8) (2019-08-10)

### Bug Fixes

- handler jsx parsing error, correct column info ([3b4797d](https://github.com/rx-ts/eslint-mdx/commit/3b4797d))

## [0.9.6](https://github.com/rx-ts/eslint-mdx/compare/v0.9.5...v0.9.6) (2019-08-07)

### Bug Fixes

- custom parser resolved undefined error ([1bbb1ff](https://github.com/rx-ts/eslint-mdx/commit/1bbb1ff))

## [0.9.5](https://github.com/rx-ts/eslint-mdx/compare/v0.9.3...v0.9.5) (2019-08-05)

### Bug Fixes

- options unchangeable issue for default parser ([e76c483](https://github.com/rx-ts/eslint-mdx/commit/e76c483))

## [0.9.4](https://github.com/rx-ts/eslint-mdx/compare/v0.9.3...v0.9.4) (2019-08-05)

### Bug Fixes

- adjacent jsx nodes should be allowed in mdx ([8456381](https://github.com/rx-ts/eslint-mdx/commit/8456381))
- skip combine jsx nodes for root/jsx node ([90583f7](https://github.com/rx-ts/eslint-mdx/commit/90583f7))

## [0.9.3](https://github.com/rx-ts/eslint-mdx/compare/v0.9.1...v0.9.3) (2019-08-04)

### Bug Fixes

- error from typescript parser in plain object ([f634e40](https://github.com/rx-ts/eslint-mdx/commit/f634e40))

## [0.9.1](https://github.com/rx-ts/eslint-mdx/compare/v0.9.0...v0.9.1) (2019-08-03)

### Bug Fixes

- always extends base config ([530160a](https://github.com/rx-ts/eslint-mdx/commit/530160a))

## [0.9.0](https://github.com/rx-ts/eslint-mdx/compare/v0.8.1...v0.9.0) (2019-08-03)

### Features

- support other extensions, detect parsers automatically ([5386098](https://github.com/rx-ts/eslint-mdx/commit/5386098))

## [0.8.1](https://github.com/rx-ts/eslint-mdx/compare/v0.7.1...v0.8.1) (2019-08-03)

### Features

- split into two packages, use lerna as publisher ([#22](https://github.com/rx-ts/eslint-mdx/issues/22)) ([349b1ff](https://github.com/rx-ts/eslint-mdx/commit/349b1ff)), closes [#21](https://github.com/rx-ts/eslint-mdx/issues/21)

## [0.8.0](https://github.com/rx-ts/eslint-mdx/compare/v0.7.1...v0.8.0) (2019-08-03)

### Features

- split into two packages, use lerna as publisher ([#22](https://github.com/rx-ts/eslint-mdx/issues/22)) ([349b1ff](https://github.com/rx-ts/eslint-mdx/commit/349b1ff)), closes [#21](https://github.com/rx-ts/eslint-mdx/issues/21)

## [0.7.1](https://github.com/rx-ts/eslint-mdx/compare/v0.7.0...v0.7.1) (2019-08-03)

### Features

- export a parse function for compatibility usage ([0fdaf9f](https://github.com/rx-ts/eslint-mdx/commit/0fdaf9f))

## [0.7.0](https://github.com/rx-ts/eslint-mdx/compare/v0.6.0...v0.7.0) (2019-08-02)

### Features

- add new rule no-unescaped-entities ([dca8633](https://github.com/rx-ts/eslint-mdx/commit/dca8633))

## [0.6.0](https://github.com/rx-ts/eslint-mdx/compare/v0.5.0...v0.6.0) (2019-08-02)

### Features

- add new rule `no-jsx-html-comments`, close [#13](https://github.com/rx-ts/eslint-mdx/issues/13) ([67ba91e](https://github.com/rx-ts/eslint-mdx/commit/67ba91e))
- processor support for normalize comments in jsx [ci skip] ([114831c](https://github.com/rx-ts/eslint-mdx/commit/114831c))

## [0.5.0](https://github.com/rx-ts/eslint-mdx/compare/v0.4.1...v0.5.0) (2019-07-31)

### Features

- add `@rxts/mdx/no-unused-expressions` rule to replace eslint's ([5d62b55](https://github.com/rx-ts/eslint-mdx/commit/5d62b55))

## [0.4.1](https://github.com/rx-ts/eslint-mdx/compare/v0.4.0...v0.4.1) (2019-07-31)

### Features

- perf: extract `parseMdx`, exports everything in package ([1f965a1](https://github.com/rx-ts/eslint-mdx/commit/1f965a1))

## [0.4.0](https://github.com/rx-ts/eslint-mdx/compare/v0.3.1...v0.4.0) (2019-07-31)

### Features

- add body and comments into ast, fix [#12](https://github.com/rx-ts/eslint-mdx/issues/12) ([5b28bd5](https://github.com/rx-ts/eslint-mdx/commit/5b28bd5))

## [0.3.1](https://github.com/rx-ts/eslint-mdx/compare/v0.3.0...v0.3.1) (2019-07-30)

### Bug Fixes

- `.*` could not match multi lines, use `[\s\S]*` instead, close [#4](https://github.com/rx-ts/eslint-mdx/issues/4) ([f7e7efe](https://github.com/rx-ts/eslint-mdx/commit/f7e7efe))

## [0.3.0](https://github.com/rx-ts/eslint-mdx/compare/v0.2.1...v0.3.0) (2019-07-30)

### Bug Fixes

- inline jsx and comment parsing error, close [#4](https://github.com/rx-ts/eslint-mdx/issues/4), [#7](https://github.com/rx-ts/eslint-mdx/issues/7) ([5297a0b](https://github.com/rx-ts/eslint-mdx/commit/5297a0b))

## [0.2.1](https://github.com/rx-ts/eslint-mdx/compare/v0.2.0...v0.2.1) (2019-07-30)

### Bug Fixes

- eslint@5 is actually supported ([e470ddc](https://github.com/rx-ts/eslint-mdx/commit/e470ddc))

## [0.2.0](https://github.com/rx-ts/eslint-mdx/compare/v0.1.3...v0.2.0) (2019-07-30)

### Features

- support custom parser like babel-eslint ([b718574](https://github.com/rx-ts/eslint-mdx/commit/b718574))

## [0.1.3](https://github.com/rx-ts/eslint-mdx/compare/v0.1.2...v0.1.3) (2019-07-29)

### Bug Fixes

- upgrade peer dependency eslint to >= 6.0.0 ([#3](https://github.com/rx-ts/eslint-mdx/issues/3) [#4](https://github.com/rx-ts/eslint-mdx/issues/4)) ([f0ab288](https://github.com/rx-ts/eslint-mdx/commit/f0ab288))

## [0.1.2](https://github.com/rx-ts/eslint-mdx/compare/v0.1.1...v0.1.2) (2019-07-29)

### Bug Fixes

- show correct column and line on lint error ([90c5390](https://github.com/rx-ts/eslint-mdx/commit/90c5390))

## [0.1.1](https://github.com/rx-ts/eslint-mdx/compare/v0.1.0...v0.1.1) (2019-07-29)

### Bug Fixes

- overrides in node_modules seems not working ([d2f1535](https://github.com/rx-ts/eslint-mdx/commit/d2f1535))

## 0.1.0 (2019-07-29)

### Features

- traverse ast nodes ([6a71e25](https://github.com/rx-ts/eslint-mdx/commit/6a71e25))
