---
title: "React Canaries: Enabling Incremental Feature Rollout Outside Meta"
---

May 3, 2023 by [Dan Abramov](https://twitter.com/dan_abramov), [Sophie Alpert](https://twitter.com/sophiebits), [Rick Hanlon](https://twitter.com/rickhanlonii), [Sebastian Markbåge](https://twitter.com/sebmarkbage), and [Andrew Clark](https://twitter.com/acdlite)

---

<Intro>

Traditionally, new React features used to only be available at Meta first, and land in the open source releases later. We'd like to offer the React community an option to adopt individual new features as soon as their design is close to final--similar to how Meta uses React internally. We are introducing a new officially supported [Canary release channel](/community/versioning-policy#canary-channel). It lets curated setups like frameworks decouple adoption of individual React features from the React release schedule.

</Intro>

---

## tl;dr {/*tldr*/}

* We're introducing an officially supported [Canary release channel](/community/versioning-policy#canary-channel) for React.
* Canaries let you start using individual new React features before they land in the semver-stable releases.
* Unlike the [Experimental](/community/versioning-policy#experimental-channel) channel, React Canaries only include features that we reasonably believe to be ready for adoption. We encourage frameworks to consider bundling pinned Canary React releases.
* We will announce breaking changes and new features on our blog as they land in Canary releases.
* **As always, React continues to follow semver for every Stable release.**

## How React features are usually developed {/*how-react-features-are-usually-developed*/}

Typically, every React feature goes through the same stages:

1. We develop an initial version and prefix it with `experimental_` or `unstable_`. The feature is only available in the `experimental` release channel and at Meta. At this point, the feature is expected to change significantly.
2. We find a team at Meta willing to help us test this feature and provide feedback on it. This leads to a round of changes. As the feature becomes more stable, we work with more teams at Meta to try it out.
3. Eventually, we feel confident in the design. We remove the prefix from the API name, and make the feature available on the `main` branch by default. At this point, any team at Meta can use this feature.
4. When we are close to cutting an open source release, we post an RFC for the new feature. At this point we are confident the  design works for a broad set of cases, but we might make some last minute adjustments.
5. Finally, we release the feature together with its documentation in a stable React release.

This playbook works well for most features we've released so far. However, there can be a significant gap between when the feature is generally ready to use (step 3) and when it is released in open source (step 5).

**We'd like to offer the React community an option to follow the same approach as Meta, and adopt individual new features earlier (as they become available) without having to wait for the next release cycle of React.**

As always, all React features will eventually make it into a Stable release.

## Can we just do more minor releases? {/*can-we-just-do-more-minor-releases*/}

Generally, we *do* use minor releases for introducing new features.

However, this isn't always possible. Sometimes, new features are interconnected with *other* new features which have not yet been fully completed and that we're still actively iterating on. We can't release them separately because their implementations are related. We can't version them separately because they affect the same packages (for example, `react` and `react-dom`). And we need to keep the ability to iterate on the pieces that aren't ready without a flurry of major version releases, which semver would require us to do.

At Meta, we've solved this problem by building React from the `main` branch, and manually updating it to a specific pinned commit every week. This is also the approach that React Native releases have been following for the last several years. Every *stable* release of React Native is pinned to a specific commit from the `main` branch of the React repository. This lets React Native include important bugfixes and incrementally adopt new React features at the framework level without getting coupled to the global React release schedule.

We would like to make this workflow available to other frameworks and curated setups. For example, it lets a framework *on top of* React include a React-related breaking change *before* this breaking change gets included into a stable React release. This is particularly useful because some breaking changes only affect framework integrations. This lets a framework release such a change in its own minor version without breaking semver.

## Why not use experimental releases instead? {/*why-not-use-experimental-releases-instead*/}

Although you *can* technically use [Experimental releases](/community/versioning-policy#canary-channel), we recommend against using them in production because they can contain significant unannounced breaking changes, or be completely broken. While Canaries can also contain mistakes (as with any release), going forward we plan to announce any significant breaking changes in Canaries on our blog. Canaries are the closest to the code we run internally, so you can generally expect them to be relatively stable. However, you *do* need to keep the version pinned and manually scan the GitHub commit log when updating between the pinned commits.

**We expect that most people using React outside a curated setup (like a framework) will want to continue using the Stable releases.** However, if you're building a framework, you might want to consider bundling a Canary version of React pinned to a particular commit, and update it at your own pace. The benefit of that is that it lets you ship individual completed React features and bugfixes earlier for your users and at your own release schedule, similar to how React Native has been doing it for the last few years. The downside is that you would take on additional responsibility to communicate which React changes are included with your releases.

If you're a framework author and want to try this approach, please get in touch with us.

## Announcing breaking changes and new features early {/*announcing-breaking-changes-and-new-features-early*/}

Canary releases represent our best guess of what will go into the next stable React release at any given time.

Traditionally, we've only announced breaking changes at the *end* of the release cycle (when doing a major release). Now that Canary releases are an officially supported way to consume React, we plan to shift towards announcing breaking changes and significant new features *as they land* in Canaries. For example, if we merge a breaking change that will go out in a Canary, we will write a post about it on the React blog, including codemods and migration instructions if necessary. Then, if you're a framework author cutting a major release that updates the pinned React canary to include that change, you can link to our blog post from your release notes. Finally, when a stable major version of React is ready, we will link to those already published blog posts.

We plan to document APIs as they land in Canaries--even if these APIs are not yet available outside of them. APIs that are only available in Canaries will be marked with a special note on the corresponding pages. This will include APIs like [`use`](https://github.com/reactjs/rfcs/pull/229), and some others (like `cache` and `createServerContext`) which we'll send RFCs for.

## Canaries must be pinned {/*canaries-must-be-pinned*/}

If you decide to adopt the Canary workflow for your app or framework, make sure you always pin the *exact* version of the Canary you're using. Since Canaries are pre-releases, they may still include breaking changes.

## Example: React Server Components {/*example-react-server-components*/}

As we [announced in March](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components), the React Server Components conventions have been finalized, and we do not expect significant breaking changes related to their user-facing API contract. However, we can't release support for React Server Components in a stable version of React yet because we are still working on several intertwined framework-only features (such as [asset loading](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#asset-loading)) and expect more breaking changes there.

This means that React Server Components are ready to be adopted by frameworks. However, until the next major React release, the only way for a framework to adopt them is to ship a pinned Canary version of React. (To avoid bundling two copies of React, frameworks that wish to do this would need to enforce resolution of `react` and `react-dom` to the pinned Canary they ship with their framework, and explain that to their users.)

## Testing libraries against both Stable and Canary versions {/*testing-libraries-against-both-stable-and-canary-versions*/}

We do not expect library authors to test every single Canary release since it would be prohibitively difficult. However, just as when we [originally introduced the different React pre-release channels three years ago](https://legacy.reactjs.org/blog/2019/10/22/react-release-channels.html), we encourage libraries to run tests against *both* the latest Stable and latest Canary versions. If you see a change in behavior that wasn't announced, please file a bug in the React repository so that we can help diagnose it. We expect that as this practice becomes widely adopted, it will reduce the amount of effort necessary to upgrade libraries to new major versions of React, since accidental regressions would be found as they land.

<Note>

Strictly speaking, Canary is not a *new* release channel--it used to be called Next. However, we've decided to rename it to avoid confusion with Next.js. We're announcing it as a *new* release channel to communicate the new expectations, such as Canaries being an officially supported way to use React.

</Note>

## Stable releases work like before {/*stable-releases-work-like-before*/}

We are not introducing any changes to stable React releases.



