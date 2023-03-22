---
title: "React Labs: What We've Been Working On – March 2023"
---

March 22, 2023 by [Joseph Savona](https://twitter.com/en_JS), [Josh Story](https://twitter.com/joshcstory), [Lauren Tan](https://twitter.com/potetotes), [Mengdi Chen](https://twitter.com/mengdi_en), [Samuel Susla](https://twitter.com/SamuelSusla), [Sathya Gunasekaran](https://twitter.com/_gsathya), and [Sebastian Markbåge](https://twitter.com/sebmarkbage)

---

<Intro>

We’ve made good progress on many of the projects we covered in our [last update](https://react.dev/blog/2022/06/15/react-labs-what-we-have-been-working-on-june-2022). We’ve learned many lessons throughout the process of working on these projects and we’re excited to share them with you!

</Intro>

---

*In React Labs posts, we write about ongoing research and projects in development. Though not everything in these posts may eventually ship, we want to share with you the problem spaces we’re actively thinking about, and what we’ve learned so far.*

One guiding philosophy the React team believes in is in “[trusting the theory](https://overreacted.io/what-are-the-react-team-principles/#trust-the-theory)”. The research we undertake is often in the pursuit of a long term theory, and we’re willing to invest the effort to get there even if it might take longer. This time around, we’re sharing greater details on some of the lessons and theory that underpin these projects.

As before, this isn’t a roadmap with clear timelines, but we are hopeful that we’ll be able to continue sharing greater details on these projects with you in the coming months.

---

## Server Components {/*server-components*/}

React Server Components, or RSC, let you run React components entirely on the server, without ever downloading them to the client or requiring hydration. They let you use client rendering for rich interactivity while minimizing payload sizes, and also simplify your app architecture.

Since our last update, we have merged the [React Server Components (RSC) RFC](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) to ratify the proposal. We resolved outstanding issues with the [React Server Module Conventions](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) proposal, and reached consensus with our partners to go with the `"use client"` convention. These documents also act as specification for what an RSC-compatible implementation should support.

The biggest change is that we introduced [`async` Components](https://github.com/reactjs/rfcs/pull/229) as the primary way to do data fetching from Server Components. We also plan to support data loading from the client by introducing a new hook called `use` that is conceptually similar to `await`. ~~We also plan on supporting these as Data Components on the Client for parity, alongside the `use()` Hook that can be used to read values from Promises in Client Components.~~

Now that we have data fetching pretty well sorted, we’re exploring the other direction: sending data from the client to the server, so that you can execute database mutations and implement forms. We’re doing this by letting you pass Server Functions across the server/client boundary, which the client can then call, providing seamless RPC. Server Functions also give you progressively enhanced forms as a hydration fallback. ~~We're currently exploring the other side of the coin of Server Functions that lets you pass or import functions from the Server to the Client. This provides a seamless RPC. We're exploring this as a primitive for supporting mutations to a database API and progressively enhanced `<form>` as a hydration fallback.~~

React Server Components has shipped in [Next.js App Router](https://beta.nextjs.org/docs). This showcases a deep integration of a router that really buys into RSC as a primitive, but it's not the only way to build a RSC-compatible router and framework. There's a clear separation for features provided by the RSC spec and implementation. React Server Components is meant as a spec for components that work across compatible React frameworks.

We generally recommend using an existing framework, but if you have need to build your own custom framework, it should be possible. Building your own RSC-compatible framework is not as easy as we'd like it to be, mainly due to the deep bundler integration needed. Bundlers come with a lot of features built-in for client use that has evolved as an expected feature. We're now partnering directly with bundlers to get the primitives for RSC built-in.

## Asset Loading and Document Metadata {/*asset-loading-and-document-metadata*/}

--
new attempt:

If you use React to render your entire app, whether with Server Components or just with the new Streaming SSR capabilities of React 18, you need to have some way to manage the tags that go in the document `<head>`.  These include assets such as scripts, stylesheets, and fonts, and also document metadata such as the `<title>` tag and `<meta>` tags. In addition to these tags that go in the document `<head>`, you need a good way to pre-load images and other assets that are needed by components, all in a manner that gives a deliberate loading experience and the best possible performance.

It’s important for composition and scalability that each component define everything that it needs to work, rather than being coupled to parent components. But you don’t want each component directly manipulating the document head or fetching images directly. You want to coordinate and de-duplicate them across every component. And any `<head>` tags shouldn’t be rendered within the individual component’s output, but in the document head, which has to be streamed *first*, before the body even begins.

People have addressed this in various ways: you can render head-based tags inline in the body and then use client JavaScript to hoist them up to the head. Or you can render in two passes, doing a first pass to collect the head information and then rendering again with the stuff you collected at the top. Unfortunately this last solution isn't compatible with Streaming SSR, since it prevents you from flushing anything until you've already rendered the entire body once through. And often this metadata is used by clients that don't execute JavaScript, so the client hoisting solution isn't ideal either. We need something that works with streaming and doesn't require client code. It should also work without even rendering the component, so that assets can be pre-loaded ahead of navigations.

Finally, one of our goals is to not require components to care whether they're running on the client or the server. React should handle the details.

We’ve created a solution that addresses all of these problems in a unified way. We’re publishing an RFC soon that describes the tradeoffs of this approach and the decision-making behind it.

One area of further research is how these new capabilities might better serve CSS-in-JS libraries. We believe the solution we’ve already implemented will form a solid foundation for better interop between Server Components and CSS-in-JS. Stay tuned for future updates on that!

--

In our last update, we said we were trying to make asset loading for things like scripts and stylesheets more compatible with client navigations and streaming Server Side Rendering (streaming SSR). Since then we’ve made progress on a working implementation, and expanded it to include any element that goes in the document `<head>`, such as `<meta>` tags for document metadata, or the `<title>` tag. These are challenging to support with streaming SSR since the `<head`> has to come before the `<body>`, but it may be components deep in the tree that determine what `<head>` elements are wanted — since having the resources that components depend on co-located with each component is an important part of making applications out of composable components.

For example, let's say I want to use a certain stylesheet and script in multiple components, but I don't want to load them more than once. Or maybe I want to describe the page title and description in a component specific to a certain route, but that component is buried deep inside other components that act as layouts or context for some or all routes. In these cases, I have data that's specific to certain components, but I may want them to only render once or render somewhere else in the document, like the document head.

This is a problem with SSR because the document head has to come before the body. People have addressed this in various ways: you can render head-based tags inline in the body and then use client JavaScript to hoist them up to the head. Or you can render in two passes, doing a first pass to collect the head information and then rendering again with the stuff you collected at the top. Unfortunately this last solution isn't compatible with Streaming SSR, since it prevents you from flushing anything until you've already rendered the entire body once through. And often this metadata is used by clients that don't execute JavaScript, so the client hoisting solution isn't ideal either. We need something that works with streaming and doesn't require client code.

There are also times when rendering something isn’t the best way to model the dependency. For instance, if you are preparing to navigate to another page and you know certain fonts will be used and should be preloaded. Today, you can render a link preload, however if the transition is blocked by data loading, the browser won’t see this preload until it’s already needed. A new approach is required that allows applications to reason about external resources loading independently from rendering them as elements.

~~Since the last update, we have implemented what we describe as hoistable elements and hoistable resources which unlocks the ability to colocate loadable assets and Document metadata with the components that depend on them.~~ ~~~~ We also have an implementation of some resource loading methods in `react-dom` for cases better served outside of rendering elements. ~~In the near future we will publish an RFC outlining these implementations, their tradeoffs, and the decision-making that went into the design.~~

We have implemented primitives called *hoistable elements* and *hoistable resources* to solve these problems, letting us co-locate loadable assets and document metadata with the components that need them, in a way that’s compatible with streaming SSR and doesn’t require client code for document metadata. We’re publishing an RFC soon that describes the tradeoffs of this approach and the decision-making behind it.

~~One of the goals of the research we are doing here is to make the solutions we come up with for these problems not require awareness of the runtime your components are running in. In an ideal world, there would be no `isServer` or `isClient` checks or checking if `window` exists to figure out what behavior is needed to maximize performance. You just write your components to run anywhere, and React does the right thing.~~ One of our goals is to not require components to care whether they're running on the client or the server. React should handle the details.

One area of further research is how these new capabilities might better serve css-in-js libraries. We believe there is a lot of reason to think the solutions we’ve already implemented will form a solid foundation for better interop between React Server Components and streaming server rendering with css-in-js. Stay tuned for future updates on that!

## React Optimizing Compiler {/*react-optimizing-compiler*/}

Since our previous update we’ve been actively iterating on the design of React Forget, an optimizing compiler for React. We’ve previously talked about it as an “auto-memoizing compiler”, and that is true in some sense. But building the compiler has helped us understand React’s programming model even more deeply. A better way to understand React Forget is as an automatic *reactivity* compiler.

The core idea of React is that developers define their UI as a function of the current state. You work with plain JavaScript values — numbers, strings, arrays, objects — and use standard JavaScript idioms — if/else, for, etc — to describe your component logic. The mental model is that React will re-render whenever the application state changes. We believe this simple mental model and keeping close to JavaScript semantics is an important principle in React’s programming model.

The catch is that React can sometimes be *too* reactive: it can re-render too much. For example, in JavaScript we don’t have cheap ways to compare if two objects or arrays are equivalent (having the same keys and values), so creating a new object or array on each render may cause React to do more work than it strictly needs to. This means developers have to explicitly memoize components so as to not over-react to changes.

Our goal with React Forget is to ensure that React apps have just the right amount of reactivity by default: that apps re-render only when state values *meaningfully* change. From an implementation perspective this means automatically memoizing, but we believe that the reactivity framing is a better way to understand React and Forget. One way to think about this is that React currently re-renders when object identity changes. With Forget, React re-renders when the semantic value changes — but without incurring the runtime cost of deep comparisons.

In terms of concrete progress, since our last update we have substantially iterated on the design of the compiler to align with this automatic reactivity approach and to incorporate feedback from using the compiler internally. After some significant refactors to the compiler starting late last year, we’ve now begun using the compiler in production in limited areas at Meta. We plan to open-source it once we’ve proved it in production.

Finally, a lot of people have expressed interest in how the compiler works. We're looking forward to sharing a lot more details when we prove the compiler and open-source it. But there are a few bits we can share now:

The core of the compiler is almost completely decoupled from Babel, and the core compiler API is (roughly) old AST in, new AST out (while retaining source location data). Under the hood we use a custom code representation and transformation pipeline in order to do low-level semantic analysis. However, the primary public interface to the compiler will be via Babel and other build system plugins. For ease of testing we currently have a Babel plugin which is a very thin wrapper that calls the compiler to generate a new version of each function and swap it in.

As we refactored the compiler over the last few months, we wanted to focus on refining the core compilation model to ensure we could handle complexities such as conditionals, loops, reassignment, and mutation. However, JavaScript has a lot of ways to express each of those features: if/else, ternaries, for, for-in, for-of, etc. Trying to support the full language up-front would have delayed the point where we could validate the core model. Instead, we started with a small but representative subset of the language: let/const, if/else, for loops, objects, arrays, primitives, function calls, and a few other features. As we gained confidence in the core model and refined our internal abstractions, we expanded the supported language subset. We're also explicit about syntax we don't support, logging diagnostics and skipping compilation for unsupported input. We have utilities to try the compiler on our codebase and see what unsupported features are most common so we can prioritize those next. We'll continue incrementally expanding towards supporting the whole language.

Making plain JavaScript reactive requires a very sophisticated compiler so that it can understand exactly what the code is doing. By taking this approach, we’re creating a system for reactivity within JavaScript that lets you write normal product code of any complexity, instead of being limited to some DSL for reactivity. You write a function that takes in data and returns a UI, just like React has always done.


## Offscreen Rendering {/*offscreen-rendering*/}

We’re researching an API that makes it easy to hide and show components while preserving their state, without additional performance overhead. One of the use cases we’ve been exploring is pre-rendering — so you can load and render screens in the background before they’re navigated to.

Since our last update, we’ve tested an experimental offscreen API internally at Meta when pre-rendering screens in React Native on Android and iOS. When a screen is pre-rendered in the background, we render it at a low priority and keep the app responsive to a user’s actions. The offscreen API only *mounts* components once they become visible, so all components work out of the box without the need to account for pre-rendering — for example, if a component logs analytics when it’s mounted, pre-rendering it won’t mess up the accuracy of those analytics.

Currently we're researching different modes to control behavior ranging from fully automatic to fully manual. Automatic mode uses [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to detect when a subtree is in the viewport and hides and shows it accordingly. The different levels of control support use cases like pre-rendering, virtualized lists, or background content.

## Transition Tracing {/*transition-tracing*/}

The Transition Tracing API lets you detect when React transitions become slower and to investigate why they may be slow. Following our last update, we have completed the initial design of the API and published an [RFC](https://github.com/reactjs/rfcs/pull/238). The basic capabilities have also been implemented. The project is currently on hold. We welcome feedback on the RFC and look forward to resuming its development to provide a better performance measurement tool for React transitions.
* * *
In addition to this update, our team has made recent guest appearances on community podcasts and livestreams to speak more on our work and answer questions.

* [Dan Abramov](https://twitter.com/dan_abramov) and [Joe Savona](https://twitter.com/en_JS) were interviewed by [Kent C. Dodds on his YouTube channel](https://www.youtube.com/watch?v=h7tur48JSaw), where they discussed concerns around React Server Components.
* [Dan Abramov](https://twitter.com/dan_abramov) and [Joe Savona](https://twitter.com/en_JS) were guests on the [JSParty podcast](https://jsparty.fm/267) and shared their thoughts about the future of React.

Thanks to [Dave McCabe](https://twitter.com/mcc_abe), [Luna Wei](https://twitter.com/lunaleaps), [Matt Carroll](https://twitter.com/mattcarrollcode), [Sebastian Silbermann](https://twitter.com/sebsilbermann), [Seth Webster](https://twitter.com/sethwebster), and [Sophie Alpert](https://twitter.com/sophiebits) for reviewing this post.

Thanks for reading, and see you in the next update!
