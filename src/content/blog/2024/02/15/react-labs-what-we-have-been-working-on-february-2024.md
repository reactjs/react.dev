---
title: "React Labs: What We've Been Working On – February 2024"
---

February 15, 2024 by [Joseph Savona](https://twitter.com/en_JS), [Ricky Hanlon](https://twitter.com/rickhanlonii), [Andrew Clark](https://twitter.com/acdlite), [Matt Carroll](https://twitter.com/mattcarrollcode), and [Dan Abramov](https://twitter.com/dan_abramov).

---

<Intro>

In React Labs posts, we write about projects in active research and development. We’ve made significant progress since our [last update](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023), and we’d like to share our progress.

</Intro>

<Note>

React Conf 2024 is scheduled for May 15–16 in Henderson, Nevada! If you’re interested in attending React Conf in person, you can [sign up for the ticket lottery](https://forms.reform.app/bLaLeE/react-conf-2024-ticket-lottery/1aRQLK) until February 28th. 

For more info on tickets, free streaming, sponsoring, and more, see [the React Conf website](https://conf.react.dev).

</Note>

---

## React Compiler {/*react-compiler*/}

React Compiler is no longer a research project: the compiler now powers instagram.com in production, and we are working to ship the compiler across additional surfaces at Meta and to prepare the first open source release.

As discussed in our [previous post](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-optimizing-compiler), React can *sometimes* re-render too much when state changes. Since the early days of React our solution for such cases has been manual memoization. In our current APIs, this means applying the [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback), and [`memo`](/reference/react/memo) APIs to manually tune how much React re-renders on state changes. But manual memoization is a compromise. It clutters up our code, is easy to get wrong, and requires extra work to keep up to date.

Manual memoization is a reasonable compromise, but we weren’t satisfied. Our vision is for React to *automatically* re-render just the right parts of the UI when state changes, *without compromising on React’s core mental model*. We believe that React’s approach — UI as a simple function of state, with standard JavaScript values and idioms — is a key part of why React has been approachable for so many developers. That’s why we’ve invested in building an optimizing compiler for React.

JavaScript is a notoriously challenging language to optimize, thanks to its loose rules and dynamic nature. React Compiler is able to compile code safely by modeling both the rules of JavaScript *and* the “rules of React”. For example, React components must be idempotent — returning the same value given the same inputs — and can’t mutate props or state values. These rules limit what developers can do and help to carve out a safe space for the compiler to optimize.

Of course, we understand that developers sometimes bend the rules a bit, and our goal is to make React Compiler work out of the box on as much code as possible. The compiler attempts to detect when code doesn’t strictly follow React’s rules and will either compile the code where safe or skip compilation if it isn’t safe. We’re testing against Meta’s large and varied codebase in order to help validate this approach.

For developers who are curious about making sure their code follows React’s rules, we recommend [enabling Strict Mode](/reference/react/StrictMode) and [configuring React’s ESLint plugin](/learn/editor-setup#linting). These tools can help to catch subtle bugs in your React code, improving the quality of your applications today, and future-proofs your applications for upcoming features such as React Compiler. We are also working on consolidated documentation of the rules of React and updates to our ESLint plugin to help teams understand and apply these rules to create more robust apps.

To see the compiler in action, you can check out our [talk from last fall](https://www.youtube.com/watch?v=qOQClO3g8-Y). At the time of the talk, we had early experimental data from trying React Compiler on one page of instagram.com. Since then, we shipped the compiler to production across instagram.com. We’ve also expanded our team to accelerate the rollout to additional surfaces at Meta and to open source. We’re excited about the path ahead and will have more to share in the coming months.

## Actions {/*actions*/}


We [previously shared](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components) that we were exploring solutions for sending data from the client to the server with Server Actions, so that you can execute database mutations and implement forms. During development of Server Actions, we extended these APIs to support data handling in client-only applications as well.

We refer to this broader collection of features as simply "Actions". Actions allow you to pass a function to DOM elements such as [`<form/>`](/reference/react-dom/components/form):

```js
<form action={search}>
  <input name="query" />
  <button type="submit">Search</button>
</form>
```

The `action` function can operate synchronously or asynchronously. You can define them on the client side using standard JavaScript or on the server with the  [`'use server'`](/reference/react/use-server) directive. When using an action, React will manage the life cycle of the data submission for you, providing hooks like [`useFormStatus`](/reference/react-dom/hooks/useFormStatus), and [`useFormState`](/reference/react-dom/hooks/useFormState) to access the current state and response of the form action. 

By default, Actions are submitted within a [transition](/reference/react/useTransition), keeping the current page interactive while the action is processing. Since Actions support async functions, we've also added the ability to use `async/await` in transitions. This allows you to show pending UI with the `isPending` state of a transition when an async request like `fetch` starts, and show the pending UI all the way through the update being applied. 

Alongside Actions, we're introducing a feature named [`useOptimistic`](/reference/react/useOptimistic) for managing optimistic state updates. With this hook, you can apply temporary updates that are automatically reverted once the final state commits. For Actions, this allows you to optimistically set the final state of the data on the client, assuming the submission is successful, and revert to the value for data received from the server. It works using regular `async`/`await`, so it works the same whether you're using `fetch` on the client, or a Server Action from the server.

Library authors can implement custom `action={fn}` props in their own components with `useTransition`. Our intent is for libraries to adopt the Actions pattern when designing their component APIs, to provide a consistent experience for React developers. For example, if your library provides a `<Calendar onSelect={eventHandler}>` component, consider also exposing a `<Calendar selectAction={action}>` API, too.

While we initially focused on Server Actions for client-server data transfer, our philosophy for React is to provide the same programming model across all platforms and environments. When possible, if we introduce a feature on the client, we aim to make it also work on the server, and vice versa. This philosophy allows us to create a single set of APIs that work no matter where your app runs, making it easier to upgrade to different environments later. 

Actions are now available in the Canary channel and will ship in the next release of React.

## New Features in React Canary {/*new-features-in-react-canary*/}

We introduced [React Canaries](/blog/2023/05/03/react-canaries) as an option to adopt individual new stable features as soon as their design is close to final, before they’re released in a stable semver version. 

Canaries are a change to the way we develop React. Previously, features would be researched and built privately inside of Meta, so users would only see the final polished product when released to Stable. With Canaries, we’re building in public with the help of the community to finalize features we share in the React Labs blog series. This means you hear about new features sooner, as they’re being finalized instead of after they’re complete.

React Server Components, Asset Loading, Document Metadata, and Actions have all landed in the React Canary, and we've added docs for these features on react.dev:

- **Directives**: [`"use client"`](/reference/react/use-client) and [`"use server"`](/reference/react/use-server) are bundler features designed for full-stack React frameworks. They mark the "split points" between the two environments: `"use client"` instructs the bundler to generate a `<script>` tag (like [Astro Islands](https://docs.astro.build/en/concepts/islands/#creating-an-island)), while `"use server"` tells the bundler to generate a POST endpoint (like [tRPC Mutations](https://trpc.io/docs/concepts)). Together, they let you write reusable components that compose client-side interactivity with the related server-side logic.

- **Document Metadata**: we added built-in support for rendering [`<title>`](/reference/react-dom/components/title), [`<meta>`](/reference/react-dom/components/meta), and metadata [`<link>`](/reference/react-dom/components/link) tags anywhere in your component tree. These work the same way in all environments, including fully client-side code, SSR, and RSC. This provides built-in support for features pioneered by libraries like [React Helmet](https://github.com/nfl/react-helmet).

- **Asset Loading**: we integrated Suspense with the loading lifecycle of resources such as stylesheets, fonts, and scripts so that React takes them into account to determine whether the content in elements like [`<style>`](/reference/react-dom/components/style), [`<link>`](/reference/react-dom/components/link), and [`<script>`](/reference/react-dom/components/script) are ready to be displayed. We’ve also added new [Resource Loading APIs](/reference/react-dom#resource-preloading-apis) like `preload` and `preinit` to provide greater control for when a resource should load and initialize.

- **Actions**: As shared above, we've added Actions to manage sending data from the client to the server. You can add `action` to elements like [`<form/>`](/reference/react-dom/components/form), access the status with [`useFormStatus`](/reference/react-dom/hooks/useFormStatus), handle the result with [`useFormState`](/reference/react-dom/hooks/useFormState), and optimistically update the UI with [`useOptimistic`](/reference/react/useOptimistic).

Since all of these features work together, it’s difficult to release them in the Stable channel individually. Releasing Actions without the complementary hooks for accessing form states would limit the practical usability of Actions. Introducing React Server Components without integrating Server Actions would complicate modifying data on the server. 

Before we can release a set of features to the Stable channel, we need to ensure they work cohesively and developers have everything they need to use them in production. React Canaries allow us to develop these features individually, and release the stable APIs incrementally until the entire feature set is complete.

The current set of features in React Canary are complete and ready to release.

## The Next Major Version of React {/*the-next-major-version-of-react*/}

After a couple of years of iteration, `react@canary` is now ready to ship to `react@latest`. The new features mentioned above are compatible with any environment your app runs in, providing everything needed for production use. Since Asset Loading and Document Metadata may be a breaking change for some apps, the next version of React will be a major version: **React 19**.

There’s still more to be done to prepare for release. In React 19, we’re also adding long-requested improvements which require breaking changes like support for Web Components. Our focus now is to land these changes, prepare for release, finalize docs for new features, and publish announcements for what’s included.

We’ll share more information about everything React 19 includes, how to adopt the new client features, and how to build support for React Server Components in the coming months.

## Offscreen (renamed to Activity). {/*offscreen-renamed-to-activity*/}

Since our last update, we’ve renamed a capability we’re researching from “Offscreen” to “Activity”. The name “Offscreen” implied that it only applied to parts of the app that were not visible, but while researching the feature we realized that it’s possible for parts of the app to be visible and inactive, such as content behind a modal. The new name more closely reflects the behavior of marking certain parts of the app “active” or “inactive”.

Activity is still under research and our remaining work is to finalize the primitives that are exposed to library developers. We’ve deprioritized this area while we focus on shipping features that are more complete.

* * *

In addition to this update, our team has presented at conferences and made appearances on podcasts to speak more on our work and answer questions.

- [Sathya Gunasekaran](/community/team#sathya-gunasekaran) spoke about the React Compiler at the [React India](https://www.youtube.com/watch?v=kjOacmVsLSE) conference

- [Dan Abramov](/community/team#dan-abramov) gave a talk at [RemixConf](https://www.youtube.com/watch?v=zMf_xeGPn6s) titled “React from Another Dimension” which explores an alternative history of how React Server Components and Actions could have been created

- [Dan Abramov](/community/team#dan-abramov) was interviewed on [the Changelog’s JS Party podcast](https://changelog.com/jsparty/311) about React Server Components

- [Matt Carroll](/community/team#matt-carroll) was interviewed on the [Front-End Fire podcast](https://www.buzzsprout.com/2226499/14462424-interview-the-two-reacts-with-rachel-nabors-evan-bacon-and-matt-carroll) where he discussed [The Two Reacts](https://overreacted.io/the-two-reacts/)

Thanks [Lauren Tan](https://twitter.com/potetotes), [Sophie Alpert](https://twitter.com/sophiebits), [Jason Bonta](https://threads.net/someextent), [Eli White](https://twitter.com/Eli_White), and [Sathya Gunasekaran](https://twitter.com/_gsathya) for reviewing this post.

Thanks for reading, and [see you at React Conf](https://conf.react.dev/)!
