---
title: Versioning Policy
---

<Intro>

All stable builds of React go through a high level of testing and follow semantic versioning (semver). React also offers unstable release channels to encourage early feedback on experimental features. This page describes what you can expect from React releases.

</Intro>

## Stable releases {/*stable-releases*/}

Stable React releases (also known as "Latest" release channel) follow [semantic versioning (semver)](https://semver.org/) principles.

That means that with a version number **x.y.z**:

* When releasing **critical bug fixes**, we make a **patch release** by changing the **z** number (ex: 15.6.2 to 15.6.3).
* When releasing **new features** or **non-critical fixes**, we make a **minor release** by changing the **y** number (ex: 15.6.2 to 15.7.0).
* When releasing **breaking changes**, we make a **major release** by changing the **x** number (ex: 15.6.2 to 16.0.0).

Major releases can also contain new features, and any release can include bug fixes.

Minor releases are the most common type of release.

### Breaking Changes {/*breaking-changes*/}

Breaking changes are inconvenient for everyone, so we try to minimize the number of major releases – for example, React 15 was released in April 2016 and React 16 was released in September 2017, and React 17 was released in October 2020.

Instead, we release new features in minor versions. That means that minor releases are often more interesting and compelling than majors, despite their unassuming name.

### Commitment to stability {/*commitment-to-stability*/}

As we change React over time, we try to minimize the effort required to take advantage of new features. When possible, we'll keep an older API working, even if that means putting it in a separate package. For example, [mixins have been discouraged for years](https://legacy.reactjs.org/blog/2016/07/13/mixins-considered-harmful.html) but they're supported to this day [via create-react-class](https://legacy.reactjs.org/docs/react-without-es6.html#mixins) and many codebases continue to use them in stable, legacy code.

Over a million developers use React, collectively maintaining millions of components. The Facebook codebase alone has over 50,000 React components. That means we need to make it as easy as possible to upgrade to new versions of React; if we make large changes without a migration path, people will be stuck on old versions. We test these upgrade paths on Facebook itself – if our team of less than 10 people can update 50,000+ components alone, we hope the upgrade will be manageable for anyone using React. In many cases, we write [automated scripts](https://github.com/reactjs/react-codemod) to upgrade component syntax, which we then include in the open-source release for everyone to use.

### Gradual upgrades via warnings {/*gradual-upgrades-via-warnings*/}

Development builds of React include many helpful warnings. Whenever possible, we add warnings in preparation for future breaking changes. That way, if your app has no warnings on the latest release, it will be compatible with the next major release. This allows you to upgrade your apps one component at a time.

Development warnings won't affect the runtime behavior of your app. That way, you can feel confident that your app will behave the same way between the development and production builds -- the only differences are that the production build won't log the warnings and that it is more efficient. (If you ever notice otherwise, please file an issue.)

### What counts as a breaking change? {/*what-counts-as-a-breaking-change*/}

In general, we *don't* bump the major version number for changes to:

* **Development warnings.** Since these don't affect production behavior, we may add new warnings or modify existing warnings in between major versions. In fact, this is what allows us to reliably warn about upcoming breaking changes.
* **APIs starting with `unstable_`.** These are provided as experimental features whose APIs we are not yet confident in. By releasing these with an `unstable_` prefix, we can iterate faster and get to a stable API sooner.
* **Alpha and canary versions of React.** We provide alpha versions of React as a way to test new features early, but we need the flexibility to make changes based on what we learn in the alpha period. If you use these versions, note that APIs may change before the stable release.
* **Undocumented APIs and internal data structures.** If you access internal property names like `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` or `__reactInternalInstance$uk43rzhitjg`, there is no warranty.  You are on your own.

This policy is designed to be pragmatic: certainly, we don't want to cause headaches for you. If we bumped the major version for all of these changes, we would end up releasing more major versions and ultimately causing more versioning pain for the community. It would also mean that we can't make progress in improving React as fast as we'd like.

That said, if we expect that a change on this list will cause broad problems in the community, we will still do our best to provide a gradual migration path.

### If a minor release includes no new features, why isn't it a patch? {/*if-a-minor-release-includes-no-new-features-why-isnt-it-a-patch*/}

It's possible that a minor release will not include new features. [This is allowed by semver](https://semver.org/#spec-item-7), which states **"[a minor version] MAY be incremented if substantial new functionality or improvements are introduced within the private code. It MAY include patch level changes."**

However, it does raise the question of why these releases aren't versioned as patches instead.

The answer is that any change to React (or other software) carries some risk of breaking in unexpected ways. Imagine a scenario where a patch release that fixes one bug accidentally introduces a different bug. This would not only be disruptive to developers, but also harm their confidence in future patch releases. It's especially regrettable if the original fix is for a bug that is rarely encountered in practice.

We have a pretty good track record for keeping React releases free of bugs, but patch releases have an even higher bar for reliability because most developers assume they can be adopted without adverse consequences.

For these reasons, we reserve patch releases only for the most critical bugs and security vulnerabilities.

If a release includes non-essential changes — such as internal refactors, changes to implementation details, performance improvements, or minor bugfixes — we will bump the minor version even when there are no new features.

## All release channels {/*all-release-channels*/}

React relies on a thriving open source community to file bug reports, open pull requests, and [submit RFCs](https://github.com/reactjs/rfcs). To encourage feedback we sometimes share special builds of React that include unreleased features.

<Note>

This section will be most relevant to developers who work on frameworks, libraries, or developer tooling. Developers who use React primarily to build user-facing applications should not need to worry about our prerelease channels.

</Note>

Each of React's release channels is designed for a distinct use case:

- [**Latest**](#latest-channel) is for stable, semver React releases. It's what you get when you install React from npm. This is the channel you're already using today. **User-facing applications that consume React directly use this channel.**
- [**Canary**](#canary-channel) tracks the main branch of the React source code repository. Think of these as release candidates for the next semver release. **[Frameworks or other curated setups may choose to use this channel with a pinned version of React.](/blog/2023/05/03/react-canaries) You can also Canaries for integration testing between React and third party projects.**
- [**Experimental**](#experimental-channel) includes experimental APIs and features that aren't available in the stable releases. These also track the main branch, but with additional feature flags turned on. Use this to try out upcoming features before they are released.

All releases are published to npm, but only Latest uses semantic versioning. Prereleases (those in the Canary and Experimental channels) have versions generated from a hash of their contents and the commit date, e.g. `18.3.0-canary-388686f29-20230503` for Canary and `0.0.0-experimental-388686f29-20230503` for Experimental.

**Both Latest and Canary channels are officially supported for user-facing applications, but with different expectations**:

* Latest releases follow the traditional semver model.
* Canary releases [must be pinned](/blog/2023/05/03/react-canaries) and may include breaking changes. They exist for curated setups (like frameworks) that want to gradually release new React features and bugfixes on their own release schedule.

The Experimental releases are provided for testing purposes only, and we provide no guarantees that behavior won't change between releases. They do not follow the semver protocol that we use for releases from Latest.

By publishing prereleases to the same registry that we use for stable releases, we are able to take advantage of the many tools that support the npm workflow, like [unpkg](https://unpkg.com) and [CodeSandbox](https://codesandbox.io).

### Latest channel {/*latest-channel*/}

Latest is the channel used for stable React releases. It corresponds to the `latest` tag on npm. It is the recommended channel for all React apps that are shipped to real users.

**If you're not sure which channel you should use, it's Latest.** If you're using React directly, this is what you're already using. You can expect updates to Latest to be extremely stable. Versions follow the semantic versioning scheme, as [described earlier.](#stable-releases)

### Canary channel {/*canary-channel*/}

The Canary channel is a prerelease channel that tracks the main branch of the React repository. We use prereleases in the Canary channel as release candidates for the Latest channel. You can think of Canary as a superset of Latest that is updated more frequently.

The degree of change between the most recent Canary release and the most recent Latest release is approximately the same as you would find between two minor semver releases. However, **the Canary channel does not conform to semantic versioning.** You should expect occasional breaking changes between successive releases in the Canary channel.

**Do not use prereleases in user-facing applications directly unless you're following the [Canary workflow](/blog/2023/05/03/react-canaries).**

Releases in Canary are published with the `canary` tag on npm. Versions are generated from a hash of the build's contents and the commit date, e.g. `18.3.0-canary-388686f29-20230503`.

#### Using the canary channel for integration testing {/*using-the-canary-channel-for-integration-testing*/}

The Canary channel also supports integration testing between React and other projects.

All changes to React go through extensive internal testing before they are released to the public. However, there are a myriad of environments and configurations used throughout the React ecosystem, and it's not possible for us to test against every single one.

If you're the author of a third party React framework, library, developer tool, or similar infrastructure-type project, you can help us keep React stable for your users and the entire React community by periodically running your test suite against the most recent changes. If you're interested, follow these steps:

- Set up a cron job using your preferred continuous integration platform. Cron jobs are supported by both [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) and [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- In the cron job, update your React packages to the most recent React release in the Canary channel, using `canary` tag on npm. Using the npm cli:

  ```console
  npm update react@canary react-dom@canary
  ```

  Or yarn:

  ```console
  yarn upgrade react@canary react-dom@canary
  ```
- Run your test suite against the updated packages.
- If everything passes, great! You can expect that your project will work with the next minor React release.
- If something breaks unexpectedly, please let us know by [filing an issue](https://github.com/facebook/react/issues).

A project that uses this workflow is Next.js. You can refer to their [CircleCI configuration](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) as an example.

### Experimental channel {/*experimental-channel*/}

Like Canary, the Experimental channel is a prerelease channel that tracks the main branch of the React repository. Unlike Canary, Experimental releases include additional features and APIs that are not ready for wider release.

Usually, an update to Canary is accompanied by a corresponding update to Experimental. They are based on the same source revision, but are built using a different set of feature flags.

Experimental releases may be significantly different than releases to Canary and Latest. **Do not use Experimental releases in user-facing applications.** You should expect frequent breaking changes between releases in the Experimental channel.

Releases in Experimental are published with the `experimental` tag on npm. Versions are generated from a hash of the build's contents and the commit date, e.g. `0.0.0-experimental-68053d940-20210623`.

#### What goes into an experimental release? {/*what-goes-into-an-experimental-release*/}

Experimental features are ones that are not ready to be released to the wider public, and may change drastically before they are finalized. Some experiments may never be finalized -- the reason we have experiments is to test the viability of proposed changes.

For example, if the Experimental channel had existed when we announced Hooks, we would have released Hooks to the Experimental channel weeks before they were available in Latest.

You may find it valuable to run integration tests against Experimental. This is up to you. However, be advised that Experimental is even less stable than Canary. **We do not guarantee any stability between Experimental releases.**

#### How can I learn more about experimental features? {/*how-can-i-learn-more-about-experimental-features*/}

Experimental features may or may not be documented. Usually, experiments aren't documented until they are close to shipping in Canary or Latest.

If a feature is not documented, they may be accompanied by an [RFC](https://github.com/reactjs/rfcs).

We will post to the [React blog](/blog) when we're ready to announce new experiments, but that doesn't mean we will publicize every experiment.

You can always refer to our public GitHub repository's [history](https://github.com/facebook/react/commits/main) for a comprehensive list of changes.
