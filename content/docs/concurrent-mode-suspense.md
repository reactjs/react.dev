---
id: concurrent-mode-suspense
title: Suspense for Data Fetching (Experimental)
permalink: docs/concurrent-mode-suspense.html
prev: concurrent-mode-intro.html
next: concurrent-mode-patterns.html
---

>Caution:
>
>This page describes **experimental features that are [not yet available](/docs/concurrent-mode-adoption.html) in a stable release**. Don't rely on experimental builds of React in production apps. These features may change significantly and without a warning before they become a part of React.
>
>This documentation is aimed at early adopters and people who are curious. If you're new to React, don't worry about these features -- you don't need to learn them right now.


React 16.6 added a `<Suspense>` component that lets you "wait" for some code to load and declaratively specify a loading state (like a spinner) while we're waiting:

```jsx
const ProfilePage = React.lazy(() => import('./ProfilePage')); // Lazy-loaded

// Show a spinner while the profile is loading
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

Suspense for Data Fetching is a new feature that lets you also use `<Suspense>` to **declaratively "wait" for anything else, including data.** This page focuses on the data fetching use case, but it can also wait for images, scripts, or other asynchronous work.

- [What Is Suspense, Exactly?](#what-is-suspense-exactly)
  - [What Suspense Is Not](#what-suspense-is-not)
  - [What Suspense Lets You Do](#what-suspense-lets-you-do)
- [Using Suspense in Practice](#using-suspense-in-practice)
  - [What If I Don’t Use Relay?](#what-if-i-dont-use-relay)
  - [For Library Authors](#for-library-authors)
- [Traditional Approaches vs Suspense](#traditional-approaches-vs-suspense)
  - [Approach 1: Fetch-on-Render (not using Suspense)](#approach-1-fetch-on-render-not-using-suspense)
  - [Approach 2: Fetch-Then-Render (not using Suspense)](#approach-2-fetch-then-render-not-using-suspense)
  - [Approach 3: Render-as-You-Fetch (using Suspense)](#approach-3-render-as-you-fetch-using-suspense)
  - [We’re Still Figuring This Out](#were-still-figuring-this-out)
- [Suspense and Race Conditions](#suspense-and-race-conditions)
  - [Race Conditions with useEffect](#race-conditions-with-useeffect)
  - [Race Conditions with componentDidUpdate](#race-conditions-with-componentdidupdate)
  - [The Problem](#the-problem)
  - [Solving Race Conditions with Suspense](#solving-race-conditions-with-suspense)
- [Handling Errors](#handling-errors)
- [Next Steps](#next-steps)

## What Is Suspense, Exactly? {#what-is-suspense-exactly}

Suspense lets your components "wait" for something before they can render. In [this example](https://codesandbox.io/s/frosty-hermann-bztrp), two components wait for an asynchronous API call to fetch some data:

```js
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

This demo is a teaser. Don't worry if it doesn't quite make sense yet. We'll talk more about how it works below. Keep in mind that Suspense is more of a *mechanism*, and particular APIs like `fetchProfileData()` or `resource.posts.read()` in the above example are not very important. If you're curious, you can find their definitions right in the [demo sandbox](https://codesandbox.io/s/frosty-hermann-bztrp).

Suspense is not a data fetching library. It's a **mechanism for data fetching libraries** to communicate to React that *the data a component is reading is not ready yet*. React can then wait for it to be ready and update the UI. At Facebook, we use Relay and its [new Suspense integration](https://relay.dev/docs/en/experimental/a-guided-tour-of-relay#loading-states-with-suspense). We expect that other libraries like Apollo can provide similar integrations.

In the long term, we intend Suspense to become the primary way to read asynchronous data from components -- no matter where that data is coming from.

### What Suspense Is Not {#what-suspense-is-not}

Suspense is significantly different from existing approaches to these problems, so reading about it for the first time often leads to misconceptions. Let's clarify the most common ones:

 * **It is not a data fetching implementation.** It does not assume that you use GraphQL, REST, or any other particular data format, library, transport, or protocol.

 * **It is not a ready-to-use client.** You can't "replace" `fetch` or Relay with Suspense. But you can use a library that's integrated with Suspense (for example, [new Relay APIs](https://relay.dev/docs/en/experimental/api-reference)).

 * **It does not couple data fetching to the view layer.** It helps orchestrate displaying the loading states in your UI, but it doesn't tie your network logic to React components.

### What Suspense Lets You Do {#what-suspense-lets-you-do}

So what's the point of Suspense? There's a few ways we can answer this:

* **It lets data fetching libraries deeply integrate with React.** If a data fetching library implements Suspense support, using it from React components feels very natural.

* **It lets you orchestrate intentionally designed loading states.** It doesn't say _how_ the data is fetched, but it lets you closely control the visual loading sequence of your app.

* **It helps you avoid race conditions.** Even with `await`, asynchronous code is often error-prone. Suspense feels more like reading data *synchronously* — as if it was already loaded.

## Using Suspense in Practice {#using-suspense-in-practice}

At Facebook, so far we have only used the Relay integration with Suspense in production. **If you're looking for a practical guide to get started today, [check out the Relay Guide](https://relay.dev/docs/en/experimental/a-guided-tour-of-relay)!** It demonstrates patterns that have already worked well for us in production.

**The code demos on this page use a "fake" API implementation rather than Relay.** This makes them easier to understand if you're not familiar with GraphQL, but they won't tell you the "right way" to build an app with Suspense. This page is more conceptual and is intended to help you see *why* Suspense works in a certain way, and which problems it solves.

### What If I Don't Use Relay? {#what-if-i-dont-use-relay}

If you don't use Relay today, you might have to wait before you can really try Suspense in your app. So far, it's the only implementation that we tested in production and are confident in.

Over the next several months, many libraries will appear with different takes on Suspense APIs. **If you prefer to learn when things are more stable, you might prefer to ignore this work for now, and come back when the Suspense ecosystem is more mature.**

You can also write your own integration for a data fetching library, if you'd like.

### For Library Authors {#for-library-authors}

We expect to see a lot of experimentation in the community with other libraries. There is one important thing to note for data fetching library authors.

Although it's technically doable, Suspense is **not** currently intended as a way to start fetching data when a component renders. Rather, it lets components express that they're "waiting" for data that is *already being fetched*. Unless you have an idea for a solution that helps prevent waterfalls, we suggest to prefer APIs that favor or enforce fetching before render. The current documentation for [Relay Suspense API](https://relay.dev/docs/en/experimental/api-reference#usepreloadedquery) doesn't yet dive deep into preloading, but we plan to publish more about these techniques in the near future.

Our messaging about this hasn't been very consistent in the past. Suspense for Data Fetching is still experimental, so you can expect our recommendations to change over time as we learn more from production usage and understand the problem space better.

## Traditional Approaches vs Suspense {#traditional-approaches-vs-suspense}

We could introduce Suspense without mentioning the popular data fetching approaches. However, this makes it more difficult to see which problems Suspense solves, why these problems are worth solving, and how Suspense is different from the existing solutions.

Instead, we'll look at Suspense as a logical next step in a sequence of approaches:

* **Fetch-on-render (for example, `fetch` in `useEffect`):** Start rendering components. Each of these components may trigger data fetching in their effects and lifecycle methods. This approach often leads to "waterfalls".
* **Fetch-then-render (for example, Relay without Suspense):** Start fetching all the data for the next screen as early as possible. When the data is ready, render the new screen. We can't do anything until the data arrives.
* **Render-as-you-fetch (for example, Relay with Suspense):** Start fetching all the required data for the next screen as early as possible, and start rendering the new screen *immediately — before we get a network response*. As data streams in, React retries rendering components that still need data until they're all ready.

>Note
>
>This is a bit simplified, and in practice solutions tend to use a mix of different approaches. Still, we will look at them in isolation to better contrast their tradeoffs.

To compare these approaches, we'll implement a profile page with each of them.

### Approach 1: Fetch-on-Render (not using Suspense) {#approach-1-fetch-on-render-not-using-suspense}

A common way to fetch data in React apps today is to use an effect:

```js
// In a function component:
useEffect(() => {
  fetchSomething();
}, []);

// Or, in a class component:
componentDidMount() {
  fetchSomething();
}
```

We call this approach "fetch-on-render" because it doesn't start fetching until *after* the component has rendered on the screen. This leads to a problem known as a "waterfall".

Consider these `<ProfilePage>` and `<ProfileTimeline>` components:

```js{4-6,22-24}
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(u => setUser(u));
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline />
    </>
  );
}

function ProfileTimeline() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts().then(p => setPosts(p));
  }, []);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/fragrant-glade-8huj6)**

If you run this code and watch the console logs, you'll notice the sequence is:

1. We start fetching user details
2. We wait...
3. We finish fetching user details
4. We start fetching posts
5. We wait...
6. We finish fetching posts

If fetching user details takes three seconds, we'll only *start* fetching the posts after three seconds! That's a "waterfall": an unintentional *sequence* that should have been parallelized.

Waterfalls are common in code that fetches data on render. They're possible to solve, but as the product  grows, many people prefer to use a solution that guards against this problem.

### Approach 2: Fetch-Then-Render (not using Suspense) {#approach-2-fetch-then-render-not-using-suspense}

Libraries can prevent waterfalls by offering a more centralized way to do data fetching. For example, Relay solves this problem by moving the information about the data a component needs to statically analyzable *fragments*, which later get composed into a single query.

On this page, we don't assume knowledge of Relay, so we won't be using it for this example. Instead, we'll write something similar manually by combining our data fetching methods:

```js
function fetchProfileData() {
  return Promise.all([
    fetchUser(),
    fetchPosts()
  ]).then(([user, posts]) => {
    return {user, posts};
  })
}
```

In this example,  `<ProfilePage>` waits for both requests but starts them in parallel:

```js{1,2,8-13}
// Kick off fetching as early as possible
const promise = fetchProfileData();

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    promise.then(data => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, []);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline posts={posts} />
    </>
  );
}

// The child doesn't trigger fetching anymore
function ProfileTimeline({ posts }) {
  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/wandering-morning-ev6r0)**

The event sequence now becomes like this:

1. We start fetching user details
2. We start fetching posts
3. We wait...
4. We finish fetching user details
5. We finish fetching posts

We've solved the previous network "waterfall", but accidentally introduced a different one. We wait for *all* data to come back with `Promise.all()` inside `fetchProfileData`, so now we can't render profile details until the posts have been fetched too. We have to wait for both.

Of course, this is possible to fix in this particular example. We could remove the `Promise.all()` call, and wait for both Promises separately. However, this approach gets progressively more difficult as the complexity of our data and component tree grows. It's hard to write reliable components when arbitrary parts of the data tree may be missing or stale. So fetching all data for the new screen and *then* rendering is often a more practical option.

### Approach 3: Render-as-You-Fetch (using Suspense) {#approach-3-render-as-you-fetch-using-suspense}

In the previous approach, we fetched data before we called `setState`:

1. Start fetching
2. Finish fetching
3. Start rendering

With Suspense, we still start fetching first, but we flip the last two steps around:

1. Start fetching
2. **Start rendering**
3. **Finish fetching**

**With Suspense, we don't wait for the response to come back before we start rendering.** In fact, we start rendering *pretty much immediately* after kicking off the network request:

```js{2,17,23}
// This is not a Promise. It's a special object from our Suspense integration.
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Try to read user info, although it might not have loaded yet
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Try to read posts, although they might not have loaded yet
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

Here's what happens when we render `<ProfilePage>` on the screen:

1. We've already kicked off the requests in `fetchProfileData()`. It gave us a special "resource" instead of a Promise. In a realistic example, it would be provided by our data library's Suspense integration, like Relay.
2. React tries to render `<ProfilePage>`. It returns `<ProfileDetails>` and `<ProfileTimeline>` as children.
3. React tries to render `<ProfileDetails>`. It calls `resource.user.read()`. None of the data is fetched yet, so this component "suspends". React skips over it, and tries rendering other components in the tree.
4. React tries to render `<ProfileTimeline>`. It calls `resource.posts.read()`. Again, there's no data yet, so this component also "suspends". React skips over it too, and tries rendering other components in the tree.
5. There's nothing left to try rendering. Because `<ProfileDetails>` suspended, React shows the closest `<Suspense>` fallback above it in the tree: `<h1>Loading profile...</h1>`. We're done for now.

This `resource` object represents the data that isn't there yet, but might eventually get loaded. When we call `read()`, we either get the data, or the component "suspends".

**As more data streams in, React will retry rendering, and each time it might be able to progress "deeper".** When `resource.user` is fetched, the `<ProfileDetails>` component will render successfully and we'll no longer need the `<h1>Loading profile...</h1>` fallback. Eventually, we'll get all the data, and there will be no fallbacks on the screen.

This has an interesting implication. Even if we use a GraphQL client that collects all data requirements in a single request, *streaming the response lets us show more content sooner*. Because we render-*as-we-fetch* (as opposed to *after* fetching), if `user` appear in the response earlier than `posts`, we'll be able to "unlock" the outer `<Suspense>` boundary before the response even finishes. We might have missed this earlier, but even the fetch-then-render solution contained a waterfall: between fetching and rendering. Suspense doesn't inherently suffer from this waterfall, and libraries like Relay take advantage of this.

Note how we eliminated the `if (...)` "is loading" checks from our components. This doesn't only remove boilerplate code, but it also simplifies making quick design changes. For example, if we wanted profile details and posts to always "pop in" together, we could delete the `<Suspense>` boundary between them. Or we could make them independent from each other by giving each *its own* `<Suspense>` boundary. Suspense lets us change the granularity of our loading states and orchestrate their sequencing without invasive changes to our code.

### We're Still Figuring This Out {#were-still-figuring-this-out}

Suspense itself as a mechanism is flexible and doesn't have many constraints. Product code needs to be more constrained to ensure no waterfalls, but there are different ways to provide these guarantees. Some questions that we're currently exploring include:

* Fetching early can be cumbersome to express. How do we make it easier to avoid waterfalls?
* When we fetch data for a page, can the API encourage including data for instant transitions *from* it?
* What is the lifetime of a response? Should caching be global or local? Who manages the cache?
* Can Proxies help express lazy-loaded APIs without inserting `read()` calls everywhere?
* What would the equivalent of composing GraphQL queries look like for arbitrary Suspense data?

Relay has its own answers to some of these questions. There is certainly more than a single way to do it, and we're excited to see what new ideas the React community comes up with.

## Suspense and Race Conditions {#suspense-and-race-conditions}

Race conditions are bugs that happen due to incorrect assumptions about the order in which our code may run. Fetching data in the `useEffect` Hook or in class lifecycle methods like `componentDidUpdate` often leads to them. Suspense can help here, too — let's see how.

To demonstrate the issue, we will add a top-level `<App>` component that renders our `<ProfilePage>` with a button that lets us **switch between different profiles**:

```js{9-11}
function getNextId(id) {
  // ...
}

function App() {
  const [id, setId] = useState(0);
  return (
    <>
      <button onClick={() => setId(getNextId(id))}>
        Next
      </button>
      <ProfilePage id={id} />
    </>
  );
}
```

Let's compare how different data fetching strategies deal with this requirement.

### Race Conditions with `useEffect` {#race-conditions-with-useeffect}

First, we'll try a version of our original "fetch in effect" example. We'll modify it to pass an `id` parameter from the `<ProfilePage>` props to `fetchUser(id)` and `fetchPosts(id)`:

```js{1,5,6,14,19,23,24}
function ProfilePage({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(u => setUser(u));
  }, [id]);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline id={id} />
    </>
  );
}

function ProfileTimeline({ id }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts(id).then(p => setPosts(p));
  }, [id]);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/nervous-glade-b5sel)**

Note how we also changed the effect dependencies from `[]` to `[id]` — because we want the effect to re-run when the `id` changes. Otherwise, we wouldn't refetch new data.

If we try this code, it might seem like it works at first. However, if we randomize the delay time in our "fake API" implementation and press the "Next" button fast enough, we'll see from the console logs that something is going very wrong. **Requests from the previous profiles may sometimes "come back" after we've already switched the profile to another ID -- and in that case they can overwrite the new state with a stale response for a different ID.**

This problem is possible to fix (you could use the effect cleanup function to either ignore or cancel stale requests), but it's unintuitive and difficult to debug.

### Race Conditions with `componentDidUpdate` {#race-conditions-with-componentdidupdate}

One might think that this is a problem specific to `useEffect` or Hooks. Maybe if we port this code to classes or use convenient syntax like `async` / `await`, it will solve the problem?

Let's try that:

```js
class ProfilePage extends React.Component {
  state = {
    user: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const user = await fetchUser(id);
    this.setState({ user });
  }
  render() {
    const { id } = this.props;
    const { user } = this.state;
    if (user === null) {
      return <p>Loading profile...</p>;
    }
    return (
      <>
        <h1>{user.name}</h1>
        <ProfileTimeline id={id} />
      </>
    );
  }
}

class ProfileTimeline extends React.Component {
  state = {
    posts: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const posts = await fetchPosts(id);
    this.setState({ posts });
  }
  render() {
    const { posts } = this.state;
    if (posts === null) {
      return <h2>Loading posts...</h2>;
    }
    return (
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
    );
  }
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/trusting-clarke-8twuq)**

This code is deceptively easy to read.

Unfortunately, neither using a class nor the `async` / `await` syntax helped us solve this problem. This version suffers from exactly the same race conditions, for the same reasons.

### The Problem {#the-problem}

React components have their own "lifecycle". They may receive props or update state at any point in time. However, each asynchronous request *also* has its own "lifecycle". It starts when we kick it off, and finishes when we get a response. The difficulty we're experiencing is "synchronizing" several processes in time that affect each other. This is hard to think about.

### Solving Race Conditions with Suspense {#solving-race-conditions-with-suspense}

Let's rewrite this example again, but using Suspense only:

```js
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}

function ProfilePage({ resource }) {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/infallible-feather-xjtbu)**

In the previous Suspense example, we only had one `resource`, so we held it in a top-level variable. Now that we have multiple resources, we moved it to the `<App>`'s component state:

```js{4}
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
```

When we click "Next", the `<App>` component kicks off a request for the next profile, and passes *that* object down to the `<ProfilePage>` component:

```js{4,8}
  <>
    <button onClick={() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    }}>
      Next
    </button>
    <ProfilePage resource={resource} />
  </>
```

Again, notice that **we're not waiting for the response to set the state. It's the other way around: we set the state (and start rendering) immediately after kicking off a request**. As soon as we have more data, React "fills in" the content inside `<Suspense>` components.

This code is very readable, but unlike the examples earlier, the Suspense version doesn't suffer from race conditions. You might be wondering why. The answer is that in the Suspense version, we don't have to think about *time* as much in our code. Our original code with race conditions needed to set the state *at the right moment later*, or otherwise it would be wrong. But with Suspense, we set the state *immediately* -- so it's harder to mess it up.

## Handling Errors {#handling-errors}

When we write code with Promises, we might use `catch()` to handle errors. How does this work with Suspense, given that we don't *wait* for Promises to start rendering?

With Suspense, handling fetching errors works the same way as handling rendering errors -- you can render an [error boundary](/docs/error-boundaries.html) anywhere to "catch" errors in components below.

First, we'll define an error boundary component to use across our project:

```js
// Error boundaries currently have to be classes.
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

And then we can put it anywhere in the tree to catch errors:

```js{5,9}
function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
        <Suspense fallback={<h1>Loading posts...</h1>}>
          <ProfileTimeline />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/adoring-goodall-8wbn7)**

It would catch both rendering errors *and* errors from Suspense data fetching. We can have as many error boundaries as we like but it's best to [be intentional](https://aweary.dev/fault-tolerance-react/) about their placement.

## Next Steps {#next-steps}

We've now covered the basics of Suspense for Data Fetching! Importantly, we now better understand *why* Suspense works this way, and how it fits into the data fetching space.

Suspense answers some questions, but it also poses new questions of its own:

* If some component "suspends", does the app freeze? How to avoid this?
* What if we want to show a spinner in a different place than "above" the component in a tree?
* If we intentionally *want* to show an inconsistent UI for a small period of time, can we do that?
* Instead of showing a spinner, can we add a visual effect like "greying out" the current screen?
* Why does our [last Suspense example](https://codesandbox.io/s/infallible-feather-xjtbu) log a warning when clicking the "Next" button?

To answer these questions, we will refer to the next section on [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html).
