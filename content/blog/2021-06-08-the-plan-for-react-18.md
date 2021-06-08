---
title: "The Plan for React 18"
author: [acdlite, bvaughn, abernathyca, gaearon, rachelnabors, rickhanlonii, sebmarkbage, sethwebster]
---

The React team is excited to share a few updates:

1. We’ve started work on the React 18 release, which will be our next major version.
2. We’ve created a Working Group to prepare the community for gradual adoption of new features in React 18.
3. We’ve published a React 18 Alpha so that library authors can try it and provide feedback.

These updates are primarily aimed at maintainers of third-party libraries. If you’re learning, teaching, or using React to build user-facing applications, you can safely ignore this post. But you are welcome to follow the discussions in the React 18 Working Group if you're curious!

## What’s coming in React 18

When it’s released, React 18 will include out-of-the-box improvements (like [automatic batching](https://github.com/reactwg/react-18/discussions/21)), new APIs (like [`startTransition`](https://github.com/reactwg/react-18/discussions/41)), and a [new streaming server renderer](https://github.com/reactwg/react-18/discussions/37) with built-in support for `React.lazy`.

These features are possible thanks to a new opt-in mechanism we’re adding in React 18. It’s called “concurrent rendering” and it lets React prepare multiple versions of the UI at the same time. This change is mostly behind-the-scenes, but it unlocks new possibilities to improve both real and perceived performance of your app.

If you've been following our research into the future of React (we don't expect you to!), you might have heard of something called “concurrent mode” or that it might break your app. In response to this feedback from the community, we’ve redesigned the upgrade strategy for gradual adoption. Instead of an all-or-nothing “mode”, concurrent rendering will only be enabled for updates triggered by one of the new features. In practice, this means **you will be able to adopt React 18 without rewrites and try the new features at your own pace.**

## A gradual adoption strategy

Since concurrency in React 18 is opt-in, there are no significant out-of-the-box breaking changes to component behavior. **You can upgrade to React 18 with minimal or no changes to your application code, with a level of effort comparable to a typical major React release**. Based on our experience converting several apps to React 18, we expect that many users will be able to upgrade within a single afternoon.

We successfully shipped concurrent features to tens of thousands of components at Facebook, and in our experience, we've found that most React components “just work” without additional changes. We're committed to making sure this is a smooth upgrade for the entire community, so today we're announcing the React 18 Working Group.

## Working with the community

We’re trying something new for this release: We've invited a panel of experts, developers, library authors, and educators from across the React community to participate in our [React 18 Working Group](https://github.com/reactwg/react-18) to provide feedback, ask questions, and collaborate on the release. We couldn't invite everyone we wanted to this initial, small group, but if this experiment works out, we hope there will be more in the future!

**The goal of the React 18 Working Group is to prepare the ecosystem for a smooth, gradual adoption of React 18 by existing applications and libraries.** The Working Group is hosted on [GitHub Discussions](https://github.com/reactwg/react-18/discussions) and is available for the public to read. Members of the working group can leave feedback, ask questions, and share ideas. The core team will also use the discussions repo to share our research findings. As the stable release gets closer, any important information will also be posted on this blog.

For more information on upgrading to React 18, or additional resources about the release, see the [React 18 announcement post](https://github.com/reactwg/react-18/discussions/4).

## Accessing the React 18 Working Group

Everyone can read the discussions in the [React 18 Working Group repo](https://github.com/reactwg/react-18).

Because we expect an initial surge of interest in the Working Group, only invited members will be allowed to create or comment on threads. However, the threads are fully visible to the public, so everyone has access to the same information. We believe this is a good compromise between creating a productive environment for working group members, while maintaining transparency with the wider community.

As always, you can submit bug reports, questions, and general feedback to our [issue tracker](https://github.com/facebook/react/issues).

## How to try React 18 Alpha today

New alphas are [regularly published to npm using the `@alpha` tag](https://github.com/reactwg/react-18/discussions/9). These releases are built using the most recent commit to our main repo. When a feature or bugfix is merged, it will appear in an alpha the following weekday.

There may be significant behavioral or API changes between alpha releases. Please remember that **alpha releases are not recommended for user-facing, production applications**.

## Projected React 18 release timeline

We don't have a specific release date scheduled, but we expect it will take several months of feedback and iteration before React 18 is ready for most production applications.

* Library Alpha: Available today
* Public Beta: At least several months
* Release Candidate (RC): At least several weeks after Beta
* General Availability: At least several weeks after RC

More details about our projected release timeline are [available in the Working Group](https://github.com/reactwg/react-18/discussions/9). We'll post updates on this blog when we're closer to a public release.
