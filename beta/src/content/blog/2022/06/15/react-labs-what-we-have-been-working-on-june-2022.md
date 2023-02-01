---
title: "React Labs: What We've Been Working On – June 2022"
---

June 15, 2022 by [Andrew Clark](https://twitter.com/acdlite), [Dan Abramov](https://twitter.com/dan_abramov), [Jan Kassens](https://twitter.com/kassens), [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Luna Ruan](https://twitter.com/lunaruan), [Mengdi Chen](https://twitter.com/mengdi_en), [Rick Hanlon](https://twitter.com/rickhanlonii), [Robert Zhang](https://twitter.com/jiaxuanzhang01), [Sathya Gunasekaran](https://twitter.com/_gsathya), [Sebastian Markbåge](https://twitter.com/sebmarkbage), and [Xuan Huang](https://twitter.com/Huxpro)

---

<Intro>

[React 18](https://reactjs.org/blog/2022/03/29/react-v18) was years in the making, and with it brought valuable lessons for the React team. Its release was the result of many years of research and exploring many paths. Some of those paths were successful; many more were dead-ends that led to new insights. One lesson we’ve learned is that it’s frustrating for the community to wait for new features without having insight into these paths that we’re exploring.

</Intro>

---

We typically have a number of projects being worked on at any time, ranging from the more experimental to the clearly defined. Looking ahead, we’d like to start regularly sharing more about what we’ve been working on with the community across these projects.

To set expectations, this is not a roadmap with clear timelines. Many of these projects are under active research and are difficult to put concrete ship dates on. They may possibly never even ship in their current iteration depending on what we learn. Instead, we want to share with you the problem spaces we’re actively thinking about, and what we’ve learned so far.

## Server Components {/*server-components*/}

We announced an [experimental demo of React Server Components](https://reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components) (RSC) in December 2020. Since then we’ve been finishing up its dependencies in React 18, and working on changes inspired by experimental feedback.

In particular, we’re abandoning the idea of having forked I/O libraries (eg react-fetch), and instead adopting an async/await model for better compatibility. This doesn’t technically block RSC’s release because you can also use routers for data fetching. Another change is that we’re also moving away from the file extension approach in favor of [annotating boundaries](https://github.com/reactjs/rfcs/pull/189#issuecomment-1116482278).

We’re working together with Vercel and Shopify to unify bundler support for shared semantics in both Webpack and Vite. Before launch, we want to make sure that the semantics of RSCs are the same across the whole React ecosystem. This is the major blocker for reaching stable.

## Asset Loading {/*asset-loading*/}

Currently, assets like scripts, external styles, fonts, and images are typically preloaded and loaded using external systems. This can make it tricky to coordinate across new environments like streaming, server components, and more.
We’re looking at adding APIs to preload and load deduplicated external assets through React APIs that work in all React environments.

We’re also looking at having these support Suspense so you can have images, CSS, and fonts that block display until they’re loaded but don’t block streaming and concurrent rendering. This can help avoid [“popcorning“](https://twitter.com/sebmarkbage/status/1516852731251724293) as the visuals pop and layout shifts.

## Static Server Rendering Optimizations {/*static-server-rendering-optimizations*/}

Static Site Generation (SSG) and Incremental Static Regeneration (ISR) are great ways to get performance for cacheable pages, but we think we can add features to improve performance of dynamic Server Side Rendering (SSR) – especially when most but not all of the content is cacheable. We're exploring ways to optimize server rendering utilizing compilation and static passes.

## React Optimizing Compiler {/*react-compiler*/}

We gave an [early preview](https://www.youtube.com/watch?v=lGEMwh32soc) of React Forget at React Conf 2021. It’s a compiler that automatically generates the equivalent of `useMemo` and `useCallback` calls to minimize the cost of re-rendering, while retaining React’s programming model.

Recently, we finished a rewrite of the compiler to make it more reliable and capable. This new architecture allows us to analyze and memoize more complex patterns such as the use of [local mutations](https://beta.reactjs.org/learn/keeping-components-pure#local-mutation-your-components-little-secret), and opens up many new compile-time optimization opportunities beyond just being on par with memoization hooks.

We’re also working on a playground for exploring many aspects of the compiler. While the goal of the playground is to make development of the compiler easier, we think that it will make it easier to try it out and build intuition for what the compiler does. It reveals various insights into how it works under the hood, and live renders the compiler’s outputs as you type. This will be shipped together with the compiler when it’s released.

## Offscreen {/*offscreen*/}

Today, if you want to hide and show a component, you have two options. One is to add or remove it from the tree completely. The problem with this approach is that the state of your UI is lost each time you unmount, including state stored in the DOM, like scroll position.

The other option is to keep the component mounted and toggle the appearance visually using CSS. This preserves the state of your UI, but it comes at a performance cost, because React must keep rendering the hidden component and all of its children whenever it receives new updates.

Offscreen introduces a third option: hide the UI visually, but deprioritize its content. The idea is similar in spirit to the `content-visibility` CSS property: when content is hidden, it doesn't need to stay in sync with the rest of the UI. React can defer the rendering work until the rest of the app is idle, or until the content becomes visible again.

Offscreen is a low level capability that unlocks high level features. Similar to React's other concurrent features like `startTransition`, in most cases you won't interact with the Offscreen API directly, but instead via an opinionated framework to implement patterns like:

* **Instant transitions.** Some routing frameworks already prefetch data to speed up subsequent navigations, like when hovering over a link. With Offscreen, they'll also be able to prerender the next screen in the background.
* **Reusable state.** Similarly, when navigating between routes or tabs, you can use Offscreen to preserve the state of the previous screen so you can switch back and pick up where you left off.
* **Virtualized list rendering.** When displaying large lists of items, virtualized list frameworks will prerender more rows than are currently visible. You can use Offscreen to prerender the hidden rows at a lower priority than the visible items in the list.
* **Backgrounded content.** We're also exploring a related feature for deprioritizing content in the background without hiding it, like when displaying a modal overlay.

## Transition Tracing {/*transition-tracing*/}

Currently, React has two profiling tools. The [original Profiler](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) shows an overview of all the commits in a profiling session. For each commit, it also shows all components that rendered and the amount of time it took for them to render. We also have a beta version of a [Timeline Profiler](https://github.com/reactwg/react-18/discussions/76) introduced in React 18 that shows when components schedule updates and when React works on these updates. Both of these profilers help developers identify performance problems in their code.

We’ve realized that developers don’t find knowing about individual slow commits or components out of context that useful. It’s more useful to know about what actually causes the slow commits. And that developers want to be able to track specific interactions (eg a button click, an initial load, or a page navigation) to watch for performance regressions and to understand why an interaction was slow and how to fix it.

We previously tried to solve this issue by creating an [Interaction Tracing API](https://gist.github.com/bvaughn/8de925562903afd2e7a12554adcdda16), but it had some fundamental design flaws that reduced the accuracy of tracking why an interaction was slow and sometimes resulted in interactions never ending. We ended up [removing this API](https://github.com/facebook/react/pull/20037) because of these issues.

We are working on a new version for the Interaction Tracing API (tentatively called Transition Tracing because it is initiated via `startTransition`) that solves these problems.

## New React Docs {/*new-react-docs*/}

Last year, we announced the [beta version](https://beta.reactjs.org/) of the new React documentation website. The new learning materials teach Hooks first and has new diagrams, illustrations, as well as many interactive examples and challenges. We took a break from that work to focus on the React 18 release, but now that React 18 is out, we’re actively working to finish and ship the new documentation.

We are currently writing a detailed section about effects, as we’ve heard that is one of the more challenging topics for both new and experienced React users. [Synchronizing with Effects](https://beta.reactjs.org/learn/synchronizing-with-effects) is the first published page in the series, and there are more to come in the following weeks. When we first started writing a detailed section about effects, we’ve realized that many common effect patterns can be simplified by adding a new primitive to React. We’ve shared some initial thoughts on that in the [useEvent RFC](https://github.com/reactjs/rfcs/pull/220). It is currently in early research, and we are still iterating on the idea. We appreciate the community’s comments on the RFC so far, as well as the [feedback](https://github.com/reactjs/reactjs.org/issues/3308) and contributions to the ongoing documentation rewrite. We’d specifically like to thank [Harish Kumar](https://github.com/harish-sethuraman) for submitting and reviewing many improvements to the new website implementation.

*Thanks to [Sophie Alpert](https://twitter.com/sophiebits) for reviewing this blog post!*
