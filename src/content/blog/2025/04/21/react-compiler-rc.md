---
title: "React Compiler RC"
author: Lauren Tan and Mofei Zhang
date: 2025/04/21
description: We are releasing the compiler's first Release Candidate (RC) today.

---

April 21, 2025 by [Lauren Tan](https://x.com/potetotes) and [Mofei Zhang](https://x.com/zmofei).

---

<Intro>

The React team is excited to share new updates:

</Intro>

1. We're publishing React Compiler RC today, in preparation of the compiler's stable release.
2. We're merging `eslint-plugin-react-compiler` into `eslint-plugin-react-hooks`.
3. We've added support for swc and are working with oxc to support Babel-free builds.

---

[React Compiler](https://react.dev/learn/react-compiler) is a build-time tool that optimizes your React app through automatic memoization. Last year, we published React Compiler’s [first beta](https://react.dev/blog/2024/10/21/react-compiler-beta-release) and received lots of great feedback and contributions. We’re excited about the wins we’ve seen from folks adopting the compiler (see case studies from [Sanity Studio](https://github.com/reactwg/react-compiler/discussions/33) and [Wakelet](https://github.com/reactwg/react-compiler/discussions/52)) and are working towards a stable release.

We are releasing the compiler's first Release Candidate (RC) today. The RC is intended to be a stable and near-final version of the compiler, and safe to try out in production.

## Use React Compiler RC today {/*use-react-compiler-rc-today*/}
To install the RC:

npm
<TerminalBlock>
{`npm install --save-dev --save-exact babel-plugin-react-compiler@rc`}
</TerminalBlock>

pnpm
<TerminalBlock>
{`pnpm add --save-dev --save-exact babel-plugin-react-compiler@rc`}
</TerminalBlock>

yarn
<TerminalBlock>
{`yarn add --dev --exact babel-plugin-react-compiler@rc`}
</TerminalBlock>

As part of the RC, we've been making React Compiler easier to add to your projects and added optimizations to how the compiler generates memoization. React Complier now supports optional chains and array indices as dependencies. We're exploring how to infer even more dependencies like equality checks and string interpolation. These improvements ultimately result in fewer re-renders and more responsive UIs.

We have also heard from the community that the ref-in-render validation sometimes has false positives. Since as a general philosophy we want you to be able to fully trust in the compiler's error messages and hints, we are turning it off by default for now. We will keep working to improve this validation, and we will re-enable it in a follow up release.

You can find more details on using the Compiler in [our docs](https://react.dev/learn/react-compiler).

## Feedback {/*feedback*/}
During the RC period, we encourage all React users to try the compiler and provide feedback in the React repo. Please [open an issue](https://github.com/facebook/react/issues) if you encounter any bugs or unexpected behavior. If you have a general question or suggestion, please post them in the [React Compiler Working Group](https://github.com/reactwg/react-compiler/discussions).

## Backwards Compatibility {/*backwards-compatibility*/}
As noted in the Beta announcement, React Compiler is compatible with React 17 and up. If you are not yet on React 19, you can use React Compiler by specifying a minimum target in your compiler config, and adding `react-compiler-runtime` as a dependency. You can find docs on this [here](https://react.dev/learn/react-compiler#using-react-compiler-with-react-17-or-18).

## Migrating from eslint-plugin-react-compiler to eslint-plugin-react-hooks {/*migrating-from-eslint-plugin-react-compiler-to-eslint-plugin-react-hooks*/}
If you have already installed eslint-plugin-react-compiler, you can now remove it and use `eslint-plugin-react-hooks@6.0.0-rc.1`. Many thanks to [@michaelfaith](https://bsky.app/profile/michael.faith) for contributing to this improvement!

To install:

npm
<TerminalBlock>
{`npm install --save-dev eslint-plugin-react-hooks@6.0.0-rc.1`}
</TerminalBlock>

pnpm
<TerminalBlock>
{`pnpm add --save-dev eslint-plugin-react-hooks@6.0.0-rc.1`}
</TerminalBlock>

yarn
<TerminalBlock>
{`yarn add --dev eslint-plugin-react-hooks@6.0.0-rc.1`}
</TerminalBlock>

```js
// eslint.config.js
import * as reactHooks from 'eslint-plugin-react-hooks';

export default [
  // Flat Config (eslint 9+)
  reactHooks.configs.recommended,

  // Legacy Config
  reactHooks.configs['recommended-latest']
];
```

To enable the React Compiler rule, add `'react-hooks/react-compiler': 'error'` to your ESLint configuration.

The linter does not require the compiler to be installed, so there's no risk in upgrading eslint-plugin-react-hooks. We recommend everyone upgrade today.

## swc support (experimental) {/*swc-support-experimental*/}
React Compiler can be installed across [several build tools](/learn/react-compiler#installation) such as Babel, Vite, and Rsbuild.

In addition to those tools, we have been collaborating with Kang Dongyoon ([@kdy1dev](https://x.com/kdy1dev)) from the [swc](https://swc.rs/) team on adding additional support for React Compiler as an swc plugin. While this work isn't done, Next.js build performance should now be considerably faster when the [React Compiler is enabled in your Next.js app](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler).

We recommend using Next.js [15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) or greater to get the best build performance.

Vite users can continue to use [vite-plugin-react](https://github.com/vitejs/vite-plugin-react) to enable the compiler, by adding it as a [Babel plugin](https://react.dev/learn/react-compiler#usage-with-vite). We are also working with the [oxc](https://oxc.rs/) team to [add support for the compiler](https://github.com/oxc-project/oxc/issues/10048). Once [rolldown](https://github.com/rolldown/rolldown) is officially released and supported in Vite and oxc support is added for React Compiler, we'll update the docs with information on how to migrate.

## Upgrading React Compiler {/*upgrading-react-compiler*/}
React Compiler works best when the auto-memoization applied is strictly for performance. Future versions of the compiler may change how memoization is applied, for example it could become more granular and precise.

However, because product code may sometimes break the [rules of React](https://react.dev/reference/rules) in ways that aren't always statically detectable in JavaScript, changing memoization can occasionally have unexpected results. For example, a previously memoized value might be used as a dependency for a useEffect somewhere in the component tree. Changing how or whether this value is memoized can cause over or under-firing of that useEffect. While we encourage [useEffect only for synchronization](https://react.dev/learn/synchronizing-with-effects), your codebase may have useEffects that cover other use-cases such as effects that needs to only run in response to specific values changing.

In other words, changing memoization may under rare circumstances cause unexpected behavior. For this reason, we recommend following the Rules of React and employing continuous end-to-end testing of your app so you can upgrade the compiler with confidence and identify any rules of React violations that might cause issues.

If you don't have good test coverage, we recommend pinning the compiler to an exact version (eg `19.1.0`) rather than a SemVer range (eg `^19.1.0`). You can do this by passing the `--save-exact` (npm/pnpm) or `--exact` flags (yarn) when upgrading the compiler. You should then do any upgrades of the compiler manually, taking care to check that your app still works as expected.

## Roadmap to Stable {/*roadmap-to-stable*/}
*This is not a final roadmap, and is subject to change.*

After a period of final feedback from the community on the RC, we plan on a Stable Release for the compiler.

* ✅ Experimental: Released at React Conf 2024, primarily for feedback from application developers.
* ✅ Public Beta: Available today, for feedback from library authors.
* ✅ Release Candidate (RC): React Compiler works for the majority of rule-following apps and libraries without issue.
* General Availability: After final feedback period from the community.

Post-Stable, we plan to add more compiler optimizations and improvements. This includes both continual improvements to automatic memoization, and new optimizations altogether, with minimal to no change of product code. Each upgrade will continue to improve performance and add better handling of diverse JavaScript and React patterns.

---

Thanks to [Joe Savona](https://x.com/en_JS), [Jason Bonta](https://x.com/someextent), [Jimmy Lai](https://x.com/feedthejim), and [Kang Dongyoon](https://x.com/kdy1dev) (@kdy1dev) for reviewing and editing this post.
