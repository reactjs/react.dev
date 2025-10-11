---
title: "React Compiler Beta Release"
author: Lauren Tan
date: 2024/10/21
description: At React Conf 2024, we announced the experimental release of React Compiler, a build-time tool that optimizes your React app through automatic memoization. In this post, we want to share what's next for open source, and our progress on the compiler.

---

October 21, 2024 by [Lauren Tan](https://twitter.com/potetotes).

---

<Note>

### React Compiler is now stable! {/*react-compiler-is-now-in-rc*/}

Please see the [stable release blog post](/blog/2025/10/07/react-compiler-1) for details.

</Note>

<Intro>

The React team is excited to share new updates:

</Intro>

1. We're publishing React Compiler Beta today, so that early adopters and library maintainers can try it and provide feedback.
2. We're officially supporting React Compiler for apps on React 17+, through an optional `react-compiler-runtime` package.
3. We're opening up public membership of the [React Compiler Working Group](https://github.com/reactwg/react-compiler) to prepare the community for gradual adoption of the compiler.

---

At [React Conf 2024](/blog/2024/05/22/react-conf-2024-recap), we announced the experimental release of React Compiler, a build-time tool that optimizes your React app through automatic memoization. [You can find an introduction to React Compiler here](/learn/react-compiler).

Since the first release, we've fixed numerous bugs reported by the React community, received several high quality bug fixes and contributions[^1] to the compiler, made the compiler more resilient to the broad diversity of JavaScript patterns, and have continued to roll out the compiler more widely at Meta.

In this post, we want to share what's next for React Compiler.

## Try React Compiler Beta today {/*try-react-compiler-beta-today*/}

At [React India 2024](https://www.youtube.com/watch?v=qd5yk2gxbtg), we shared an update on React Compiler. Today, we are excited to announce a new Beta release of React Compiler and ESLint plugin. New betas are published to npm using the `@beta` tag.

To install React Compiler Beta:

<TerminalBlock>
npm install -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

Or, if you're using Yarn:

<TerminalBlock>
yarn add -D babel-plugin-react-compiler@beta eslint-plugin-react-compiler@beta
</TerminalBlock>

You can watch [Sathya Gunasekaran's](https://twitter.com/_gsathya) talk at React India here:

<YouTubeIframe src="https://www.youtube.com/embed/qd5yk2gxbtg" />

## We recommend everyone use the React Compiler linter today {/*we-recommend-everyone-use-the-react-compiler-linter-today*/}

React Compiler’s ESLint plugin helps developers proactively identify and correct [Rules of React](/reference/rules) violations. **We strongly recommend everyone use the linter today**. The linter does not require that you have the compiler installed, so you can use it independently, even if you are not ready to try out the compiler.

To install the linter only:

<TerminalBlock>
npm install -D eslint-plugin-react-compiler@beta
</TerminalBlock>

Or, if you're using Yarn:

<TerminalBlock>
yarn add -D eslint-plugin-react-compiler@beta
</TerminalBlock>

After installation you can enable the linter by [adding it to your ESLint config](/learn/react-compiler/installation#eslint-integration). Using the linter helps identify Rules of React breakages, making it easier to adopt the compiler when it's fully released.

## Backwards Compatibility {/*backwards-compatibility*/}

React Compiler produces code that depends on runtime APIs added in React 19, but we've since added support for the compiler to also work with React 17 and 18. If you are not on React 19 yet, in the Beta release you can now try out React Compiler by specifying a minimum `target` in your compiler config, and adding `react-compiler-runtime` as a dependency. [You can find docs on this here](/reference/react-compiler/configuration#react-17-18).

## Using React Compiler in libraries {/*using-react-compiler-in-libraries*/}

Our initial release was focused on identifying major issues with using the compiler in applications. We've gotten great feedback and have substantially improved the compiler since then. We're now ready for broad feedback from the community, and for library authors to try out the compiler to improve performance and the developer experience of maintaining your library.

React Compiler can also be used to compile libraries. Because React Compiler needs to run on the original source code prior to any code transformations, it is not possible for an application's build pipeline to compile the libraries they use. Hence, our recommendation is for library maintainers to independently compile and test their libraries with the compiler, and ship compiled code to npm.

Because your code is pre-compiled, users of your library will not need to have the compiler enabled in order to benefit from the automatic memoization applied to your library. If your library targets apps not yet on React 19, specify a minimum `target` and add `react-compiler-runtime` as a direct dependency. The runtime package will use the correct implementation of APIs depending on the application's version, and polyfill the missing APIs if necessary.

[You can find more docs on this here.](/reference/react-compiler/compiling-libraries)

## Opening up React Compiler Working Group to everyone {/*opening-up-react-compiler-working-group-to-everyone*/}

We previously announced the invite-only [React Compiler Working Group](https://github.com/reactwg/react-compiler) at React Conf to provide feedback, ask questions, and collaborate on the compiler's experimental release.

From today, together with the Beta release of React Compiler, we are opening up Working Group membership to everyone. The goal of the React Compiler Working Group is to prepare the ecosystem for a smooth, gradual adoption of React Compiler by existing applications and libraries. Please continue to file bug reports in the [React repo](https://github.com/facebook/react), but please leave feedback, ask questions, or share ideas in the [Working Group discussion forum](https://github.com/reactwg/react-compiler/discussions).

The core team will also use the discussions repo to share our research findings. As the Stable Release gets closer, any important information will also be posted on this forum.

## React Compiler at Meta {/*react-compiler-at-meta*/}

At [React Conf](/blog/2024/05/22/react-conf-2024-recap), we shared that our rollout of the compiler on Quest Store and Instagram were successful. Since then, we've deployed React Compiler across several more major web apps at Meta, including [Facebook](https://www.facebook.com) and [Threads](https://www.threads.net). That means if you've used any of these apps recently, you may have had your experience powered by the compiler. We were able to onboard these apps onto the compiler with few code changes required, in a monorepo with more than 100,000 React components.

We've seen notable performance improvements across all of these apps. As we've rolled out, we're continuing to see results on the order of [the wins we shared previously at ReactConf](https://youtu.be/lyEKhv8-3n0?t=3223). These apps have already been heavily hand tuned and optimized by Meta engineers and React experts over the years, so even improvements on the order of a few percent are a huge win for us.

We also expected developer productivity wins from React Compiler. To measure this, we collaborated with our data science partners at Meta[^2] to conduct a thorough statistical analysis of the impact of manual memoization on productivity. Before rolling out the compiler at Meta, we discovered that only about 8% of React pull requests used manual memoization and that these pull requests took 31-46% longer to author[^3]. This confirmed our intuition that manual memoization introduces cognitive overhead, and we anticipate that React Compiler will lead to more efficient code authoring and review. Notably, React Compiler also ensures that *all* code is memoized by default, not just the (in our case) 8% where developers explicitly apply memoization.

## Roadmap to Stable {/*roadmap-to-stable*/}

*This is not a final roadmap, and is subject to change.*

We intend to ship a Release Candidate of the compiler in the near future following the Beta release, when the majority of apps and libraries that follow the Rules of React have been proven to work well with the compiler. After a period of final feedback from the community, we plan on a Stable Release for the compiler. The Stable Release will mark the beginning of a new foundation for React, and all apps and libraries will be strongly recommended to use the compiler and ESLint plugin.

* ✅ Experimental: Released at React Conf 2024, primarily for feedback from early adopters.
* ✅ Public Beta: Available today, for feedback from the wider community.
* 🚧 Release Candidate (RC): React Compiler works for the majority of rule-following apps and libraries without issue.
* 🚧 General Availability: After final feedback period from the community.

These releases also include the compiler's ESLint plugin, which surfaces diagnostics statically analyzed by the compiler. We plan to combine the existing eslint-plugin-react-hooks plugin with the compiler's ESLint plugin, so only one plugin needs to be installed.

Post-Stable, we plan to add more compiler optimizations and improvements. This includes both continual improvements to automatic memoization, and new optimizations altogether, with minimal to no change of product code. Upgrading to each new release of the compiler is aimed to be straightforward, and each upgrade will continue to improve performance and add better handling of diverse JavaScript and React patterns.

Throughout this process, we also plan to prototype an IDE extension for React. It is still very early in research, so we expect to be able to share more of our findings with you in a future React Labs blog post.

---

Thanks to [Sathya Gunasekaran](https://twitter.com/_gsathya), [Joe Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Alex Taylor](https://github.com/alexmckenley), [Jason Bonta](https://twitter.com/someextent), and [Eli White](https://twitter.com/Eli_White) for reviewing and editing this post.

---

[^1]: Thanks [@nikeee](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Anikeee), [@henryqdineen](https://github.com/facebook/react/pulls?q=is%3Apr+author%3Ahenryqdineen), [@TrickyPi](https://github.com/facebook/react/pulls?q=is%3Apr+author%3ATrickyPi), and several others for their contributions to the compiler.

[^2]: Thanks [Vaishali Garg](https://www.linkedin.com/in/vaishaligarg09) for leading this study on React Compiler at Meta, and for reviewing this post.

[^3]: After controlling on author tenure, diff length/complexity, and other potential confounding factors.