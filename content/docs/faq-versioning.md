---
id: faq-versioning
title: Versioning Policy
permalink: docs/faq-versioning.html
layout: docs
category: FAQ
---

React follows [semantic versioning (semver)](https://semver.org/) principles.

That means that with a version number **x.y.z**:

* When releasing **critical bug fixes**, we make a **patch release** by changing the **z** number (ex: 15.6.2 to 15.6.3).
* When releasing **new features** or **non-critical fixes**, we make a **minor release** by changing the **y** number (ex: 15.6.2 to 15.7.0).
* When releasing **breaking changes**, we make a **major release** by changing the **x** number (ex: 15.6.2 to 16.0.0).

Major releases can also contain new features, and any release can include bug fixes.

Minor releases are the most common type of release.

### Breaking Changes {#breaking-changes}

Breaking changes are inconvenient for everyone, so we try to minimize the number of major releases – for example, React 15 was released in April 2016 and React 16 was released in September 2017; React 17 isn't expected until 2019.

Instead, we release new features in minor versions. That means that minor releases are often more interesting and compelling than majors, despite their unassuming name.

### Commitment to Stability {#commitment-to-stability}

As we change React over time, we try to minimize the effort required to take advantage of new features. When possible, we'll keep an older API working, even if that means putting it in a separate package. For example, [mixins have been discouraged for years](/blog/2016/07/13/mixins-considered-harmful.html) but they're supported to this day [via create-react-class](/docs/react-without-es6.html#mixins) and many codebases continue to use them in stable, legacy code.

Over a million developers use React, collectively maintaining millions of components. The Facebook codebase alone has over 50,000 React components. That means we need to make it as easy as possible to upgrade to new versions of React; if we make large changes without a migration path, people will be stuck on old versions. We test these upgrade paths on Facebook itself – if our team of less than 10 people can update 50,000+ components alone, we hope the upgrade will be manageable for anyone using React. In many cases, we write [automated scripts](https://github.com/reactjs/react-codemod) to upgrade component syntax, which we then include in the open-source release for everyone to use.

### Gradual Upgrades via Warnings {#gradual-upgrades-via-warnings}

Development builds of React include many helpful warnings. Whenever possible, we add warnings in preparation for future breaking changes. That way, if your app has no warnings on the latest release, it will be compatible with the next major release. This allows you to upgrade your apps one component at a time.

Development warnings won't affect the runtime behavior of your app. That way, you can feel confident that your app will behave the same way between the development and production builds -- the only differences are that the production build won't log the warnings and that it is more efficient. (If you ever notice otherwise, please file an issue.)

### What Counts as a Breaking Change? {#what-counts-as-a-breaking-change}

In general, we *don't* bump the major version number for changes to:

* **Development warnings.** Since these don't affect production behavior, we may add new warnings or modify existing warnings in between major versions. In fact, this is what allows us to reliably warn about upcoming breaking changes.
* **APIs starting with `unstable_`.** These are provided as experimental features whose APIs we are not yet confident in. By releasing these with an `unstable_` prefix, we can iterate faster and get to a stable API sooner.
* **Alpha and canary versions of React.** We provide alpha versions of React as a way to test new features early, but we need the flexibility to make changes based on what we learn in the alpha period. If you use these versions, note that APIs may change before the stable release.
* **Undocumented APIs and internal data structures.** If you access internal property names like `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` or `__reactInternalInstance$uk43rzhitjg`, there is no warranty.  You are on your own.

This policy is designed to be pragmatic: certainly, we don't want to cause headaches for you. If we bumped the major version for all of these changes, we would end up releasing more major versions and ultimately causing more versioning pain for the community. It would also mean that we can't make progress in improving React as fast as we'd like.

That said, if we expect that a change on this list will cause broad problems in the community, we will still do our best to provide a gradual migration path.

### If a Minor Release Includes No New Features, Why Isn't It a Patch? {#minors-versus-patches}

It's possible that a minor release will not include new features. [This is allowed by semver](https://semver.org/#spec-item-7), which states **"[a minor version] MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes."**

However, it does raise the question of why these releases aren't versioned as patches instead.

The answer is that any change to React (or other software) carries some risk of breaking in unexpected ways. Imagine a scenario where a patch release that fixes one bug accidentally introduces a different bug. This would not only be disruptive to developers, but also harm their confidence in future patch releases. It's especially regrettable if the original fix is for a bug that is rarely encountered in practice.

We have a pretty good track record for keeping React releases free of bugs, but patch releases have an even higher bar for reliability because most developers assume they can be adopted without adverse consequences.

For these reasons, we reserve patch releases only for the most critical bugs and security vulnerabilities.

If a release includes non-essential changes — such as internal refactors, changes to implementation details, performance improvements, or minor bugfixes — we will bump the minor version even when there are no new features.
