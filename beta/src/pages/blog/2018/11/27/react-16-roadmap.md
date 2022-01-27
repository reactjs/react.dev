---
title: 'React 16.x Roadmap'
author: [gaearon]
---

You might have heard about features like "Hooks", "Suspense", and "Concurrent Rendering" in the previous blog posts and talks. In this post, we'll look at how they fit together and the expected timeline for their availability in a stable release of React.

> An Update from August, 2019
>
> You can find an update to this roadmap in the [React 16.9 release blog post](/blog/2019/08/08/react-v16.9.0#an-update-to-the-roadmap).

## tl;dr {/*tldr*/}

We plan to split the rollout of new React features into the following milestones:

- React 16.6 with [Suspense for Code Splitting](#react-166-shipped-the-one-with-suspense-for-code-splitting) (_already shipped_)
- A minor 16.x release with [React Hooks](#react-16x-q1-2019-the-one-with-hooks) (~Q1 2019)
- A minor 16.x release with [Concurrent Mode](#react-16x-q2-2019-the-one-with-concurrent-mode) (~Q2 2019)
- A minor 16.x release with [Suspense for Data Fetching](#react-16x-mid-2019-the-one-with-suspense-for-data-fetching) (~mid 2019)

_(The original version of this post used exact version numbers. We edited it to reflect that there might need to be a few other minor releases in the middle between these ones.)_

These are estimates, and the details may change as we're further along. There's at least two more projects we plan to complete in 2019. They require more exploration and aren't tied to a particular release yet:

- [Modernizing React DOM](#modernizing-react-dom)
- [Suspense for Server Rendering](#suspense-for-server-rendering)

We expect to get more clarity on their timeline in the coming months.

> Note
>
> This post is just a roadmap -- there is nothing in it that requires your immediate attention. When each of these features are released, we'll publish a full blog post announcing them.

## Release Timeline {/*release-timeline*/}

We have a single vision for how all of these features fit together, but we're releasing each part as soon as it is ready so that you can test and start using them sooner. The API design doesn't always make sense when looking at one piece in isolation; this post lays out the major parts of our plan to help you see the whole picture. (See our [versioning policy](/docs/faq-versioning) to learn more about our commitment to stability.)

The gradual release strategy helps us refine the APIs, but the transitional period when some things aren't ready can be confusing. Let's look at what these different features mean for your app, how they relate to each other, and when you can expect to start learning and using them.

### [React 16.6](/blog/2018/10/23/react-v-16-6) (shipped): The One with Suspense for Code Splitting {/*react-166-shipped-the-one-with-suspense-for-code-splitting*/}

_Suspense_ refers to React's new ability to "suspend" rendering while components are waiting for something, and display a loading indicator. In React 16.6, Suspense supports only one use case: lazy loading components with `React.lazy()` and `<React.Suspense>`.

```js
// This component is loaded dynamically
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

Code splitting with `React.lazy()` with `<React.Suspense>` is documented [in the Code Splitting guide](/docs/code-splitting#reactlazy). You can find another practical explanation in [this article](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d).

We have been using Suspense for code splitting at Facebook since July, and expect it to be stable. There's been a few regressions in the initial public release in 16.6.0, but they were fixed in 16.6.3.

Code splitting is just the first step for Suspense. Our longer term vision for Suspense involves letting it handle data fetching too (and integrate with libraries like Apollo). In addition to a convenient programming model, Suspense also provides better user experience in Concurrent Mode. You'll find information about these topics further below.

**Status in React DOM:** Available since React 16.6.0.

**Status in React DOM Server:** Suspense is not available in the server renderer yet. This isn't for the lack of attention. We've started work on a new asynchronous server renderer that will support Suspense, but it's a large project and will take a good chunk of 2019 to complete.

**Status in React Native:** Bundle splitting isn't very useful in React Native, but there's nothing technically preventing `React.lazy()` and `<Suspense>` from working when given a Promise to a module.

**Recommendation:** If you only do client rendering, we recommend widely adopting `React.lazy()` and `<React.Suspense>` for code splitting React components. If you do server rendering, you'll have to wait with adoption until the new server renderer is ready.

### React 16.x (~Q1 2019): The One with Hooks {/*react-16x-q1-2019-the-one-with-hooks*/}

_Hooks_ let you use features like state and lifecycle from function components. They also let you reuse stateful logic between components without introducing extra nesting in your tree.

```js
function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

Hooks [introduction](/docs/hooks-intro) and [overview](/docs/hooks-overview) are good places to start. Watch [these talks](https://www.youtube.com/watch?v=V-QO-KO90iQ) for a video introduction and a deep dive. The [FAQ](/docs/hooks-faq) should answer most of your further questions. To learn more about the motivation behind Hooks, you can read [this article](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889). Some of the rationale for the API design of Hooks is explained in [this RFC thread reply](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884).

We have been dogfooding Hooks at Facebook since September. We don't expect major bugs in the implementation. Hooks are only available in the 16.7 alpha versions of React. Some of their API is expected to change in the final version (see the end of [this comment](https://github.com/reactjs/rfcs/pull/68#issuecomment-439314884) for details). It is possible that the minor release with Hooks might not be React 16.7.

Hooks represent our vision for the future of React. They solve both problems that React users experience directly ("wrapper hell" of render props and higher-order components, duplication of logic in lifecycle methods), and the issues we've encountered optimizing React at scale (such as difficulties in inlining components with a compiler). Hooks don't deprecate classes. However, if Hooks are successful, it is possible that in a future _major_ release class support might move to a separate package, reducing the default bundle size of React.

**Status in React DOM:** The first version of `react` and `react-dom` supporting Hooks is `16.7.0-alpha.0`. We expect to publish more alphas over the next months (at the time of writing, the latest one is `16.7.0-alpha.2`). You can try them by installing `react@next` with `react-dom@next`. Don't forget to update `react-dom` -- otherwise Hooks won't work.

**Status in React DOM Server:** The same 16.7 alpha versions of `react-dom` fully support Hooks with `react-dom/server`.

**Status in React Native:** There is no officially supported way to try Hooks in React Native yet. If you're feeling adventurous, check out [this thread](https://github.com/facebook/react-native/issues/21967) for unofficial instructions. There is a known issue with `useEffect` firing too late which still needs to be solved.

**Recommendation:** When you’re ready, we encourage you to start trying Hooks in new components you write. Make sure everyone on your team is on board with using them and familiar with this documentation. We don’t recommend rewriting your existing classes to Hooks unless you planned to rewrite them anyway (e.g. to fix bugs). Read more about the adoption strategy [here](/docs/hooks-faq#adoption-strategy).

### React 16.x (~Q2 2019): The One with Concurrent Mode {/*react-16x-q2-2019-the-one-with-concurrent-mode*/}

_Concurrent Mode_ lets React apps be more responsive by rendering component trees without blocking the main thread. It is opt-in and allows React to interrupt a long-running render (for example, rendering a news feed story) to handle a high-priority event (for example, text input or hover). Concurrent Mode also improves the user experience of Suspense by skipping unnecessary loading states on fast connections.

> Note
>
> You might have previously heard Concurrent Mode being referred to as ["async mode"](/blog/2018/03/27/update-on-async-rendering). We've changed the name to Concurrent Mode to highlight React's ability to perform work on different priority levels. This sets it apart from other approaches to async rendering.

```js
// Two ways to opt in:

// 1. Part of an app (not final API)
<React.unstable_ConcurrentMode>
  <Something />
</React.unstable_ConcurrentMode>;

// 2. Whole app (not final API)
ReactDOM.unstable_createRoot(domNode).render(<App />);
```

There is no documentation written for the Concurrent Mode yet. It is important to highlight that the conceptual model will likely be unfamiliar at first. Documenting its benefits, how to use it efficiently, and its pitfalls is a high priority for us, and will be a prerequisite for calling it stable. Until then, [Andrew's talk](https://www.youtube.com/watch?v=ByBPyMBTzM0) is the best introduction available.

Concurrent Mode is _much_ less polished than Hooks. Some APIs aren't properly "wired up" yet and don't do what they're expected to. At the time of writing this post, we don't recommend using it for anything except very early experimentation. We don't expect many bugs in Concurrent Mode itself, but note that components that produce warnings in [`<React.StrictMode>`](https://reactjs.org/docs/strict-mode) may not work correctly. On a separate note, we've seen that Concurrent Mode _surfaces_ performance problems in other code which can sometimes be mistaken for performance issues in Concurrent Mode itself. For example, a stray `setInterval(fn, 1)` call that runs every millisecond would have a worse effect in Concurrent Mode. We plan to publish more guidance about diagnosing and fixing issues like this as part of this release's documentation.

Concurrent Mode is a big part of our vision for React. For CPU-bound work, it allows non-blocking rendering and keeps your app responsive while rendering complex component trees. That's demoed in the first part of [our JSConf Iceland talk](/blog/2018/03/01/sneak-peek-beyond-react-16). Concurrent Mode also makes Suspense better. It lets you avoid flickering a loading indicator if the network is fast enough. It's hard to explain without seeing so [Andrew's talk](https://www.youtube.com/watch?v=ByBPyMBTzM0) is the best resource available today. Concurrent Mode relies on a cooperative main thread [scheduler](https://github.com/facebook/react/tree/master/packages/scheduler), and we are [collaborating with the Chrome team](https://www.youtube.com/watch?v=mDdgfyRB5kg) to eventually move this functionality into the browser itself.

**Status in React DOM:** A _very_ unstable version of Concurrent Mode is available behind an `unstable_` prefix in React 16.6 but we don't recommend trying it unless you're willing to often run into walls or missing features. The 16.7 alphas include `React.ConcurrentMode` and `ReactDOM.createRoot` without an `unstable_` prefix, but we'll likely keep the prefix in 16.7, and only document and mark Concurrent Mode as stable in this future minor release.

**Status in React DOM Server:** Concurrent Mode doesn't directly affect server rendering. It will work with the existing server renderer.

**Status in React Native:** The current plan is to delay enabling Concurrent Mode in React Native until [React Fabric](https://github.com/react-native-community/discussions-and-proposals/issues/4) project is near completion.

**Recommendation:** If you wish to adopt Concurrent Mode in the future, wrapping some component subtrees in [`<React.StrictMode>`](https://reactjs.org/docs/strict-mode) and fixing the resulting warnings is a good first step. In general it's not expected that legacy code would immediately be compatible. For example, at Facebook we mostly intend to use the Concurrent Mode in the more recently developed codebases, and keep the legacy ones running in the synchronous mode for the near future.

### React 16.x (~mid 2019): The One with Suspense for Data Fetching {/*react-16x-mid-2019-the-one-with-suspense-for-data-fetching*/}

As mentioned earlier, _Suspense_ refers to React's ability to "suspend" rendering while components are waiting for something, and display a loading indicator. In the already shipped React 16.6, the only supported use case for Suspense is code splitting. In this future minor release, we'd like to provide officially supported ways to use it for data fetching too. We'll provide a reference implementation of a basic "React Cache" that's compatible with Suspense, but you can also write your own. Data fetching libraries like Apollo and Relay will be able to integrate with Suspense by following a simple specification that we'll document.

```js
// React Cache for simple data fetching (not final API)
import {unstable_createResource} from 'react-cache';

// Tell React Cache how to fetch your data
const TodoResource = unstable_createResource(fetchTodo);

function Todo(props) {
  // Suspends until the data is in the cache
  const todo = TodoResource.read(props.id);
  return <li>{todo.title}</li>;
}

function App() {
  return (
    // Same Suspense component you already use for code splitting
    // would be able to handle data fetching too.
    <React.Suspense fallback={<Spinner />}>
      <ul>
        {/* Siblings fetch in parallel */}
        <Todo id="1" />
        <Todo id="2" />
      </ul>
    </React.Suspense>
  );
}

// Other libraries like Apollo and Relay can also
// provide Suspense integrations with similar APIs.
```

There is no official documentation for how to fetch data with Suspense yet, but you can find some early information in [this talk](https://youtu.be/ByBPyMBTzM0?t=1312) and [this small demo](https://github.com/facebook/react/blob/master/packages/react-devtools/CHANGELOG.md#suspense-toggle). We'll write documentation for React Cache (and how to write your own Suspense-compatible library) closer to this React release, but if you're curious, you can find its very early source code [here](https://github.com/facebook/react/blob/master/packages/react-cache/src/ReactCache.js).

The low-level Suspense mechanism (suspending rendering and showing a fallback) is expected to be stable even in React 16.6. We've used it for code splitting in production for months. However, the higher-level APIs for data fetching are very unstable. React Cache is rapidly changing, and will change at least a few more times. There are some low-level APIs that are [missing](https://github.com/reactjs/rfcs/pull/89) for a good higher-level API to be possible. We don't recommend using React Cache anywhere except very early experiments. Note that React Cache itself isn't strictly tied to React releases, but the current alphas lack basic features as cache invalidation, and you'll run into a wall very soon. We expect to have something usable with this React release.

Eventually we'd like most data fetching to happen through Suspense but it will take a long time until all integrations are ready. In practice we expect it to be adopted very incrementally, and often through layers like Apollo or Relay rather than directly. Missing higher level APIs aren't the only obstacle — there are also some important UI patterns we don't support yet such as [showing progress indicator outside of the loading view hierarchy](https://github.com/facebook/react/issues/14248). As always, we will communicate our progress in the release notes on this blog.

**Status in React DOM and React Native:** Technically, a compatible cache would already work with `<React.Suspense>` in React 16.6. However, we don't expect to have a good cache implementation until this React minor release. If you're feeling adventurous, you can try to write your own cache by looking at the React Cache alphas. However, note that the mental model is sufficiently different that there's a high risk of misunderstanding it until the docs are ready.

**Status in React DOM Server:** Suspense is not available in the server renderer yet. As we mentioned earlier, we've started work on a new asynchronous server renderer that will support Suspense, but it's a large project and will take a good chunk of 2019 to complete.

**Recommendation:** Wait for this minor React release in order to use Suspense for data fetching. Don’t try to use Suspense features in 16.6 for it; it’s not supported. However, your existing `<Suspense>` components for code splitting will be able to show loading states for data too when Suspense for Data Fetching becomes officially supported.

## Other Projects {/*other-projects*/}

### Modernizing React DOM {/*modernizing-react-dom*/}

We started an investigation into [simplifying and modernizing](https://github.com/facebook/react/issues/13525) ReactDOM, with a goal of reduced bundle size and aligning closer with the browser behavior. It is still early to say which specific bullet points will "make it" because the project is in an exploratory phase. We will communicate our progress on that issue.

### Suspense for Server Rendering {/*suspense-for-server-rendering*/}

We started designing a new server renderer that supports Suspense (including waiting for asynchronous data on the server without double rendering) and progressively loading and hydrating page content in chunks for best user experience. You can watch an overview of its early prototype in [this talk](https://www.youtube.com/watch?v=z-6JC0_cOns). The new server renderer is going to be our major focus in 2019, but it's too early to say anything about its release schedule. Its development, as always, [will happen on GitHub](https://github.com/facebook/react/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Aopen+fizz).

---

And that's about it! As you can see, there's a lot here to keep us busy but we expect much progress in the coming months.

We hope this post gives you an idea of what we're working on, what you can use today, and what you can expect to use in the future. While there's a lot of discussion about new features on social media platforms, you won't miss anything important if you read this blog.

We're always open to feedback, and love to hear from you in the [RFC repository](https://github.com/reactjs/rfcs), [the issue tracker](https://github.com/facebook/react/issues), and [on Twitter](https://mobile.twitter.com/reactjs).
