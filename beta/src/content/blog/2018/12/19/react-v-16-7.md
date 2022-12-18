---
title: 'React v16.7: No, This Is Not the One With Hooks'
author: [acdlite]
---

Our latest release includes an important performance bugfix for `React.lazy`. Although there are no API changes, we're releasing it as a minor instead of a patch.

## Why Is This Bugfix a Minor Instead of a Patch? {/*why-is-this-bugfix-a-minor-instead-of-a-patch*/}

React follows [semantic versioning](/docs/faq-versioning). Typically, this means that we use patch versions for bugfixes, and minors for new (non-breaking) features. However, we reserve the option to release minor versions even if they do not include new features. The motivation is to reserve patches for changes that have a very low chance of breaking. Patches are the most important type of release because they sometimes contain critical bugfixes. That means patch releases have a higher bar for reliability. It's unacceptable for a patch to introduce additional bugs, because if people come to distrust patches, it compromises our ability to fix critical bugs when they arise — for example, to fix a security vulnerability.

We never intend to ship bugs. React has a hard-earned reputation for stability, and we intend to keep it that way. We thoroughly test every version of React before releasing. This includes unit tests, generative (fuzzy) tests, integration tests, and internal dogfooding across tens of thousands of components. However, sometimes we make mistakes. That's why, going forward, our policy will be that if a release contains non-trivial changes, we will bump the minor version, even if the external behavior is the same. We'll also bump the minor when changing `unstable_`-prefixed APIs.

## Can I Use Hooks Yet? {/*can-i-use-hooks-yet*/}

Not yet, but soon!

At React Conf, we said that 16.7 would be the first release to include Hooks. This was a mistake. We shouldn't have attached a specific version number to an unreleased feature. We'll avoid this in the future.

Although 16.7 does not include Hooks, please do not infer anything about the timeline of the Hooks launch. Our plans for Hooks are unchanged:

- The [Hooks proposal](https://github.com/reactjs/rfcs/pull/68) was accepted ([with minor planned changes in response to feedback](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884)).
- The [implementation](https://github.com/facebook/react/commit/7bee9fbdd49aa5b9365a94b0ddf6db04bc1bf51c) was merged into the React repo (behind a feature flag).
- We're currently in the testing phase, and you can expect a public release within a few months.

We've heard from many people who want to start using Hooks in their apps. We also can't wait to ship them! But because Hooks changes how we write React components, we are taking extra time to get the details right. We appreciate your patience as we prepare this exciting new feature for widespread, ahem, _use_.

Learn more about [our roadmap](/blog/2018/11/27/react-16-roadmap) in our previous post.

## Installation {/*installation*/}

React v16.7.0 is available on the npm registry.

To install React 16 with Yarn, run:

```bash
yarn add react@^16.7.0 react-dom@^16.7.0
```

To install React 16 with npm, run:

```bash
npm install --save react@^16.7.0 react-dom@^16.7.0
```

We also provide UMD builds of React via a CDN:

```html
<script
  crossorigin
  src="https://unpkg.com/react@16/umd/react.production.min.js"
></script>
<script
  crossorigin
  src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"
></script>
```

Refer to the documentation for [detailed installation instructions](/docs/installation).

## Changelog {/*changelog*/}

### React DOM {/*react-dom*/}

- Fix performance of `React.lazy` for large numbers of lazily-loaded components. ([@acdlite](http://github.com/acdlite) in [#14429](https://github.com/facebook/react/pull/14429))
- Clear fields on unmount to avoid memory leaks. ([@trueadm](http://github.com/trueadm) in [#14276](https://github.com/facebook/react/pull/14276))
- Fix bug with SSR and context when mixing `react-dom/server@16.6` and `react@<16.6`. ([@gaearon](http://github.com/gaearon) in [#14291](https://github.com/facebook/react/pull/14291))
- Fix a performance regression in profiling mode. ([@bvaughn](http://github.com/bvaughn) in [#14383](https://github.com/facebook/react/pull/14383))

### Scheduler (Experimental) {/*scheduler-experimental*/}

- Post to MessageChannel instead of window. ([@acdlite](http://github.com/acdlite) in [#14234](https://github.com/facebook/react/pull/14234))
- Reduce serialization overhead. ([@developit](http://github.com/developit) in [#14249](https://github.com/facebook/react/pull/14249))
- Fix fallback to `setTimeout` in testing environments. ([@bvaughn](http://github.com/bvaughn) in [#14358](https://github.com/facebook/react/pull/14358))
- Add methods for debugging. ([@mrkev](http://github.com/mrkev) in [#14053](https://github.com/facebook/react/pull/14053))
