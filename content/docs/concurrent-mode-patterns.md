---
id: concurrent-mode-patterns
title: Concurrent UI Patterns (Experimental)
permalink: docs/concurrent-mode-patterns.html
prev: concurrent-mode-suspense.html
next: concurrent-mode-adoption.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Caution:
>
>This page is **somewhat outdated** and only exists for historical purposes.
>
>React 18 was released with support for concurrency. However, **there is no "mode" anymore,** and the new behavior is fully opt-in and only enabled [when you use the new features](https://reactjs.org/blog/2022/03/29/react-v18.html#gradually-adopting-concurrent-features).
>
>**For up-to-date high-level information, refer to:**
>* [React 18 Announcement](https://reactjs.org/blog/2022/03/29/react-v18.html)
>* [Upgrading to React 18](https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html)
>* [React Conf 2021 Videos](https://reactjs.org/blog/2021/12/17/react-conf-2021-recap.html)
>
>**For details about concurrent APIs in React 18, refer to:**
>* [`React.Suspense`](https://reactjs.org/docs/react-api.html#reactsuspense) reference
>* [`React.startTransition`](https://reactjs.org/docs/react-api.html#starttransition) reference
>* [`React.useTransition`](https://reactjs.org/docs/hooks-reference.html#usetransition) reference
>* [`React.useDeferredValue`](https://reactjs.org/docs/hooks-reference.html#usedeferredvalue) reference
>
>The rest of this page includes content that's stale, broken, or incorrect.

Usually, when we update the state, we expect to see changes on the screen immediately. This makes sense because we want to keep our app responsive to user input. However, there are cases where we might prefer to **defer an update from appearing on the screen**.

For example, if we switch from one page to another, and none of the code or data for the next screen has loaded yet, it might be frustrating to immediately see a blank page with a loading indicator. We might prefer to stay longer on the previous screen. Implementing this pattern has historically been difficult in React. Concurrent Mode offers a new set of tools to do that.

- [Transitions](#transitions)
  - [Wrapping setState in a Transition](#wrapping-setstate-in-a-transition)
  - [Adding a Pending Indicator](#adding-a-pending-indicator)
  - [Reviewing the Changes](#reviewing-the-changes)
  - [Where Does the Update Happen?](#where-does-the-update-happen)
  - [Transitions Are Everywhere](#transitions-are-everywhere)
  - [Baking Transitions Into the Design System](#baking-transitions-into-the-design-system)
- [The Three Steps](#the-three-steps)
  - [Default: Receded → Skeleton → Complete](#default-receded-skeleton-complete)
  - [Preferred: Pending → Skeleton → Complete](#preferred-pending-skeleton-complete)
  - [Wrap Lazy Features in `<Suspense>`](#wrap-lazy-features-in-suspense)
  - [Suspense Reveal “Train”](#suspense-reveal-train)
  - [Delaying a Pending Indicator](#delaying-a-pending-indicator)
  - [Recap](#recap)
- [Other Patterns](#other-patterns)
  - [Splitting High and Low Priority State](#splitting-high-and-low-priority-state)
  - [Deferring a Value](#deferring-a-value)
  - [SuspenseList](#suspenselist)
- [Next Steps](#next-steps)

## Transitions {#transitions}

Let's revisit [this demo](https://codesandbox.io/s/sparkling-field-41z4r3) from the previous page about [Suspense for Data Fetching](/docs/concurrent-mode-suspense.html).

When we click the "Next" button to switch the active profile, the existing page data immediately disappears, and we see the loading indicator for the whole page again. We can call this an "undesirable" loading state. **It would be nice if we could "skip" it and wait for some content to load before transitioning to the new screen.**

React offers a new built-in `useTransition()` Hook to help with this.

We can use it in three steps.

First, we'll make sure that we're actually using Concurrent Mode. We'll talk more about [adopting Concurrent Mode](/docs/concurrent-mode-adoption.html) later, but for now it's sufficient to know that we need to use `ReactDOM.createRoot()` rather than `ReactDOM.render()` for this feature to work:

```js
const rootElement = document.getElementById("root");
// Opt into Concurrent Mode
ReactDOM.createRoot(rootElement).render(<App />);
```

Next, we'll add an import for the `useTransition` Hook from React:

```js
import React, { useState, useTransition, Suspense } from "react";
```

Finally, we'll use it inside the `App` component:

```js{3-5}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [isPending, startTransition] = useTransition();
  // ...
```

**By itself, this code doesn't do anything yet.** We will need to use this Hook's return values to set up our state transition. There are two values returned from `useTransition`:

* `isPending` is a boolean. It's React telling us whether that transition is ongoing at the moment.
* `startTransition` is a function. We'll use it to tell React *which* state update we want to defer.

We will use them right below.

<div class="scary">

>Caution:
>
>In earlier experimental releases and demos, the order of the return values was reversed.

</div>


### Wrapping setState in a Transition {#wrapping-setstate-in-a-transition}

Our "Next" button click handler sets the state that switches the current profile in the state:

```js{4}
<button
  onClick={() => {
    const nextUserId = getNextId(resource.userId);
    setResource(fetchProfileData(nextUserId));
  }}
>
```

 We'll wrap that state update into `startTransition`. That's how we tell React **we don't mind React delaying that state update** if it leads to an undesirable loading state:

```js{3,6}
<button
  onClick={() => {
    startTransition(() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    });
  }}
>
```

**[Try it on CodeSandbox](https://codesandbox.io/s/elastic-vaughan-ykzsi0?file=/src/index.js)**

Press "Next" a few times. Notice it already feels very different. **Instead of immediately seeing an empty screen on click, we now keep seeing the previous page for a while.** When the data has loaded, React transitions us to the new screen.

React only "waits" for `<Suspense>` boundaries that are already displayed. If you mount a new `<Suspense>` boundary as a part of transition, React will display its fallback immediately.

<div class="scary">

>Caution:
>
>In earlier experimental releases and demos, there was a configurable timeout. It was removed.

</div>


### Adding a Pending Indicator {#adding-a-pending-indicator}

There's still something that feels broken about [our last example](https://codesandbox.io/s/vigilant-feynman-kpjy8w). Sure, it's nice not to see a "bad" loading state. **But having no indication of progress at all feels even worse!** When we click "Next", nothing happens and it feels like the app is broken.

Our `useTransition()` call returns two values: `startTransition` and `isPending`.

```js
  const [isPending, startTransition] = useTransition();
```

We've already used `startTransition` to wrap the state update. Now we're going to use `isPending` too. React gives this boolean to us so we can tell whether **we're currently waiting for this transition to finish**. We'll use it to indicate that something is happening:

```js{4,14}
return (
  <>
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          const nextUserId = getNextId(resource.userId);
          setResource(fetchProfileData(nextUserId));
        });
      }}
    >
      Next
    </button>
    {isPending ? " Loading..." : null}
    <ProfilePage resource={resource} />
  </>
);
```

**[Try it on CodeSandbox](https://codesandbox.io/s/serverless-fast-isjkvt)**

Now, this feels a lot better! When we click Next, it gets disabled because clicking it multiple times doesn't make sense. And the new "Loading..." tells the user that the app didn't freeze.

### Reviewing the Changes {#reviewing-the-changes}

Let's take another look at all the changes we've made since the [original example](https://codesandbox.io/s/nice-shadow-zvosx0):

```js{3,9-12,17}
function App() {
  const [resource, setResource] = useState(initialResource);
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " Loading..." : null}
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/serverless-fast-isjkvt)**

It took us only seven lines of code to add this transition:

* We've imported the `useTransition` Hook and used it in the component that updates the state.
* We've wrapped our state update into `startTransition` to tell React it's okay to delay it.
* We're using `isPending` to communicate the state transition progress to the user and to disable the button.

As a result, clicking "Next" doesn't perform an immediate state transition to an "undesirable" loading state, but instead stays on the previous screen and communicates progress there.

### Where Does the Update Happen? {#where-does-the-update-happen}

This wasn't very difficult to implement. However, if you start thinking about how this could possibly work, it might become a little mindbending. If we set the state, how come we don't see the result right away? *Where* is the next `<ProfilePage>` rendering?

Clearly, both "versions" of `<ProfilePage>` exist at the same time. We know the old one exists because we see it on the screen and even display a progress indicator on it. And we know the new version also exists *somewhere*, because it's the one that we're waiting for!

**But how can two versions of the same component exist at the same time?**

This gets at the root of what Concurrent Mode is. We've [previously said](/docs/concurrent-mode-intro.html#intentional-loading-sequences) it's a bit like React working on state update on a "branch". Another way we can conceptualize is that wrapping a state update in `startTransition` begins rendering it *"in a different universe"*, much like in science fiction movies. We don't "see" that universe directly -- but we can get a signal from it that tells us something is happening (`isPending`). When the update is ready, our "universes" merge back together, and we see the result on the screen!

Play a bit more with the [demo](https://codesandbox.io/s/frosty-haslett-ds0h9h), and try to imagine it happening.

Of course, two versions of the tree rendering *at the same time* is an illusion, just like the idea that all programs run on your computer at the same time is an illusion. An operating system switches between different applications very fast. Similarly, React can switch between the version of the tree you see on the screen and the version that it's "preparing" to show next.

An API like `useTransition` lets you focus on the desired user experience, and not think about the mechanics of how it's implemented. Still, it can be a helpful metaphor to imagine that updates wrapped in `startTransition` happen "on a branch" or "in a different world".

### Transitions Are Everywhere {#transitions-are-everywhere}

As we learned from the [Suspense walkthrough](/docs/concurrent-mode-suspense.html), any component can "suspend" any time if some data it needs is not ready yet. We can strategically place `<Suspense>` boundaries in different parts of the tree to handle this, but it won't always be enough.

Let's get back to our [first Suspense demo](https://codesandbox.io/s/frosty-hermann-bztrp) where there was just one profile. Currently, it fetches the data only once. We'll add a "Refresh" button to check for server updates.

Our first attempt might look like this:

```js{6-8,13-15}
const initialResource = fetchUserAndPosts();

function ProfilePage() {
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    setResource(fetchUserAndPosts());
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <button onClick={handleRefreshClick}>
        Refresh
      </button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/trusting-brown-6hj0m0)**

In this example, we start data fetching at the load *and* every time you press "Refresh". We put the result of calling `fetchUserAndPosts()` into state so that components below can start reading the new data from the request we just kicked off.

We can see in [this example](https://codesandbox.io/s/trusting-brown-6hj0m0) that pressing "Refresh" works. The `<ProfileDetails>` and `<ProfileTimeline>` components receive a new `resource` prop that represents the fresh data, they "suspend" because we don't have a response yet, and we see the fallbacks. When the response loads, we can see the updated posts (our fake API adds them every 3 seconds).

However, the experience feels really jarring. We were browsing a page, but it got replaced by a loading state right as we were interacting with it. It's disorienting. **Just like before, to avoid showing an undesirable loading state, we can wrap the state update in a transition:**

```js{2,6-8,18}
function ProfilePage() {
  const [isPending, startTransition] = useTransition();
  const [resource, setResource] = useState(initialResource);

  function handleRefreshClick() {
    startTransition(() => {
      setResource(fetchProfileData());
    });
  }

  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <button
        onClick={handleRefreshClick}
        disabled={isPending}
      >
        {isPending ? "Refreshing..." : "Refresh"}
      </button>
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/inspiring-dawn-vho1yg?file=/src/index.js)**

This feels a lot better! Clicking "Refresh" doesn't pull us away from the page we're browsing anymore. We see something is loading "inline", and when the data is ready, it's displayed.

## The Three Steps {#the-three-steps}

By now we have discussed all of the different visual states that an update may go through. In this section, we will give them names and talk about the progression between them.

<br>

<img src="../images/docs/cm-steps-simple.png" alt="Three steps" />

<div class="scary">

>Caution:
>
>The "timeout" case that switches from Pending to Receded has been removed.

</div>


At the very end, we have the **Complete** state. That's where we want to eventually get to. It represents the moment when the next screen is fully rendered and isn't loading more data.

But before our screen can be Complete, we might need to load some data or code. When we're on the next screen, but some parts of it are still loading, we call that a **Skeleton** state.

Finally, there are two primary ways that lead us to the Skeleton state. We will illustrate the difference between them with a concrete example.

### Default: Receded → Skeleton → Complete {#default-receded-skeleton-complete}

Open [this example](https://codesandbox.io/s/xenodochial-breeze-khk2fh) and click "Open Profile". You will see several visual states one by one:

* **Receded**: For a second, you will see the `<h1>Loading the app...</h1>` fallback.
* **Skeleton:** You will see the `<ProfilePage>` component with `<h2>Loading posts...</h2>` inside.
* **Complete:** You will see the `<ProfilePage>` component with no fallbacks inside. Everything was fetched.

How do we separate the Receded and the Skeleton states? The difference between them is that the **Receded** state feels like "taking a step back" to the user, while the **Skeleton** state feels like "taking a step forward" in our progress to show more content.

In this example, we started our journey on the `<HomePage>`:

```js
<Suspense fallback={...}>
  {/* previous screen */}
  <HomePage />
</Suspense>
```

After the click, React started rendering the next screen:

```js
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

Both `<ProfileDetails>` and `<ProfileTimeline>` need data to render, so they suspend:

```js{4,6}
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails /> {/* suspends! */}
    <Suspense fallback={<h2>Loading posts...</h2>}>
      <ProfileTimeline /> {/* suspends! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

When a component suspends, React needs to show the closest fallback. But the closest fallback to `<ProfileDetails>` is at the top level:

```js{2,3,7}
<Suspense fallback={
  // We see this fallback now because of <ProfileDetails>
  <h1>Loading the app...</h1>
}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails /> {/* suspends! */}
    <Suspense fallback={...}>
      <ProfileTimeline />
    </Suspense>
  </ProfilePage>
</Suspense>
```

This is why when we click the button, it feels like we've "taken a step back". The `<Suspense>` boundary which was previously showing useful content (`<HomePage />`) had to "recede" to showing the fallback (`<h1>Loading the app...</h1>`). We call that a **Receded** state.

As we load more data, React will retry rendering, and `<ProfileDetails>` can render successfully. Finally, we're in the **Skeleton** state. We see the new page with missing parts:

```js{6,7,9}
<Suspense fallback={...}>
  {/* next screen */}
  <ProfilePage>
    <ProfileDetails />
    <Suspense fallback={
      // We see this fallback now because of <ProfileTimeline>
      <h2>Loading posts...</h2>
    }>
      <ProfileTimeline /> {/* suspends! */}
    </Suspense>
  </ProfilePage>
</Suspense>
```

Eventually, they load too, and we get to the **Complete** state.

This scenario (Receded → Skeleton → Complete) is the default one. However, the Receded state is not very pleasant because it "hides" existing information. This is why React lets us opt into a different sequence (**Pending** → Skeleton → Complete) with `useTransition`.

### Preferred: Pending → Skeleton → Complete {#preferred-pending-skeleton-complete}

When we `useTransition`, React will let us "stay" on the previous screen -- and show a progress indicator there. We call that a **Pending** state. It feels much better than the Receded state because none of our existing content disappears, and the page stays interactive.

You can compare these two examples to feel the difference:

* Default: [Receded → Skeleton → Complete](https://codesandbox.io/s/xenodochial-breeze-khk2fh)
* **Preferred: [Pending → Skeleton → Complete](https://codesandbox.io/s/serene-pascal-w3no1l)**

The only difference between these two examples is that the first uses regular `<button>`s, but the second one uses our custom `<Button>` component with `useTransition`.

### Wrap Lazy Features in `<Suspense>` {#wrap-lazy-features-in-suspense}

Open [this example](https://codesandbox.io/s/mystifying-tamas-1f2xjg). When you press a button, you'll see the Pending state for a second before moving on. This transition feels nice and fluid.

We will now add a brand new feature to the profile page -- a list of fun facts about a person:

```js{8,13-25}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <ProfileTrivia resource={resource} />
    </>
  );
}

function ProfileTrivia({ resource }) {
  const trivia = resource.trivia.read();
  return (
    <>
      <h2>Fun Facts</h2>
      <ul>
        {trivia.map(fact => (
          <li key={fact.id}>{fact.text}</li>
        ))}
      </ul>
    </>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/blue-shape-lqwc82)**

If you press "Open Profile" now, you can tell something is wrong. It takes a whole seven seconds to make the transition now! This is because our trivia API is too slow. Let's say we can't make the API faster. How can we improve the user experience with this constraint?

Let's "disconnect" the slow component from the transition by wrapping it into `<Suspense>`:

```js{8,10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/nice-shaw-k6t10j)**

**If some feature isn't a vital part of the next screen, wrap it in `<Suspense>` and let it load lazily.** This ensures we can show the rest of the content as soon as possible. Conversely, if a screen is *not worth showing* without some component, such as `<ProfileDetails>` in our example, do *not* wrap it in `<Suspense>`. Then the transitions will "wait" for it to be ready.

### Suspense Reveal "Train" {#suspense-reveal-train}

When we're already on the next screen, sometimes the data needed to "unlock" different `<Suspense>` boundaries arrives in quick succession. For example, two different responses might arrive after 1000ms and 1050ms, respectively. If you've already waited for a second, waiting another 50ms is not going to be perceptible. This is why React reveals `<Suspense>` boundaries on a schedule, like a "train" that arrives periodically. This trades a small delay for reducing the layout thrashing and the number of visual changes presented to the user.

You can see a demo of this [here](https://codesandbox.io/s/great-sea-3d788s). The "posts" and "fun facts" responses come within 100ms of each other. But React coalesces them and "reveals" their Suspense boundaries together. 

### Delaying a Pending Indicator {#delaying-a-pending-indicator}

Our `Button` component will immediately show the Pending state indicator on click:

```js{2,13}
function Button({ children, onClick }) {
  const [startTransition, isPending] = useTransition();

  // ...

  return (
    <>
      <button onClick={handleClick} disabled={isPending}>
        {children}
      </button>
      {isPending ? spinner : null}
    </>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/happy-cloud-2m8lxg)**

This signals to the user that some work is happening. However, if the transition is relatively short (less than 200ms), it might be too distracting and make the transition itself feel *slower*.

The recommended solution is to use CSS to *reveal the spinner gradually and delay it*:

```js
return (
  <>
    <button onClick={handleClick}>{children}</button>
    <span
      style={{
        transition: isPending
          ? "opacity 0.3s 0.2s linear"
          : "opacity 0s 0s linear",
        opacity: isPending ? 1 : 0
      }}
    >
      {/* ... */}
    </span>
  </>
);
```

**[Try it on CodeSandbox](https://codesandbox.io/s/great-feistel-xb5ic7)**

With this change, even though we're in the Pending state, we don't display any indication to the user until 200ms has passed, and even after that, it takes a while to become fully visible. In cases where you expect the transition to be short, you might want to not use spinners at all, and instead display the button itself in an "active" state similar to being pressed.

### Recap {#recap}

The most important things we learned so far are:

* By default, our loading sequence is Receded → Skeleton → Complete.
* The Receded state doesn't feel very nice because it hides existing content.
* With `useTransition`, we can opt into showing a Pending state first instead. This will keep us on the previous screen while the next screen is being prepared.
* If we don't want some component to delay the transition, we can wrap it in its own `<Suspense>` boundary.

## Other Patterns {#other-patterns}

Transitions are probably the most common Concurrent Mode pattern you'll encounter, but there are a few more patterns you might find useful.

### Splitting High and Low Priority State {#splitting-high-and-low-priority-state}

When you design React components, it is usually best to find the "minimal representation" of state. For example, instead of keeping `firstName`, `lastName`, and `fullName` in state, it's usually better keep only `firstName` and `lastName`, and then calculate `fullName` during rendering. This lets us avoid mistakes where we update one state but forget the other state.

However, in Concurrent Mode there are cases where you might *want* to "duplicate" some data in different state variables. Consider this tiny translation app:

```js
const initialQuery = "Hello, world";
const initialResource = fetchTranslation(initialQuery);

function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    setResource(fetchTranslation(value));
  }

  return (
    <>
      <input
        value={query}
        onChange={handleChange}
      />
      <Suspense fallback={<p>Loading...</p>}>
        <Translation resource={resource} />
      </Suspense>
    </>
  );
}

function Translation({ resource }) {
  return (
    <p>
      <b>{resource.read()}</b>
    </p>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/nervous-sunset-zuxrid)**

Notice how when you type into the input, the `<Translation>` component suspends, and we see the `<p>Loading...</p>` fallback until we get fresh results. This is not ideal. It would be better if we could see the *previous* translation for a bit while we're fetching the next one.

As we mentioned earlier, if some state update causes a component to suspend, that state update should be wrapped in a transition. Let's add `useTransition` to our component:

```js{4,8,11}
function App() {
  const [query, setQuery] = useState(initialQuery);
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition();

  function handleChange(e) {
    const value = e.target.value;
    startTransition(() => {
      setQuery(value);
      setResource(fetchTranslation(value));
    });
  }
  // ...
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/relaxed-sanne-23nrn7)**

Try typing into the input now. Something's wrong! The input is updating very slowly.

We've fixed the first problem (suspending outside of a transition). But now because of the transition, our state doesn't update immediately, and it can't "drive" a controlled input!

The answer to this problem **is to split the state in two parts:** a "high priority" part that updates immediately, and a "low priority" part that may wait for a transition.

In our example, we already have two state variables. The input text is in `query`, and we read the translation from `resource`. We want changes to the `query` state to happen immediately, but changes to the `resource` (i.e. fetching a new translation) should trigger a transition.

So the correct fix is to put `setQuery` (which doesn't suspend) *outside* the transition, but `setResource` (which will suspend) *inside* of it.

```js{4,5}
function handleChange(e) {
  const value = e.target.value;
  
  // Outside the transition (urgent)
  setQuery(value);

  startTransition(() => {
    // Inside the transition (may be delayed)
    setResource(fetchTranslation(value));
  });
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/muddy-sun-lg10ks)**

With this change, it works as expected. We can type into the input immediately, and the translation later "catches up" to what we have typed.

### Deferring a Value {#deferring-a-value}

By default, React always renders a consistent UI. Consider code like this:

```js
<>
  <ProfileDetails user={user} />
  <ProfileTimeline user={user} />
</>
```

React guarantees that whenever we look at these components on the screen, they will reflect data from the same `user`. If a different `user` is passed down because of a state update, you would see them changing together. You can't ever record a screen and find a frame where they would show values from different `user`s. (If you ever run into a case like this, file a bug!)

This makes sense in the vast majority of situations. Inconsistent UI is confusing and can mislead users. (For example, it would be terrible if a messenger's Send button and the conversation picker pane "disagreed" about which thread is currently selected.)

However, sometimes it might be helpful to intentionally introduce an inconsistency. We could do it manually by "splitting" the state like above, but React also offers a built-in Hook for this:

```js
import { useDeferredValue } from 'react';

const deferredValue = useDeferredValue(value);
```

To demonstrate this feature, we'll use [the profile switcher example](https://codesandbox.io/s/serene-roman-9t9njd). Click the "Next" button and notice how it takes 1 second to do a transition.

Let's say that fetching the user details is very fast and only takes 300 milliseconds. Currently, we're waiting a whole second because we need both user details and posts to display a consistent profile page. But what if we want to show the details faster?

If we're willing to sacrifice consistency, we could **pass potentially stale data to the components that delay our transition**. That's what `useDeferredValue()` lets us do:

```js{2-4,10,11,21}
function ProfilePage({ resource }) {
  const deferredResource = useDeferredValue(resource);
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline
          resource={deferredResource}
          isStale={deferredResource !== resource}
        />
      </Suspense>
    </Suspense>
  );
}

function ProfileTimeline({ isStale, resource }) {
  const posts = resource.posts.read();
  return (
    <ul style={{ opacity: isStale ? 0.7 : 1 }}>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/zealous-sun-3k3uhe)**

The tradeoff we're making here is that `<ProfileTimeline>` will be inconsistent with other components and potentially show an older item. Click "Next" a few times, and you'll notice it. But thanks to that, we were able to cut down the transition time from 1000ms to 300ms.

Whether or not it's an appropriate tradeoff depends on the situation. But it's a handy tool, especially when the content doesn't change noticeably between items, and the user might not even realize they were looking at a stale version for a second.

It's worth noting that `useDeferredValue` is not *only* useful for data fetching. It also helps when an expensive component tree causes an interaction (e.g. typing in an input) to be sluggish. Just like we can "defer" a value that takes too long to fetch (and show its old value despite other components updating), we can do this with trees that take too long to render.

For example, consider a filterable list like this:

```js
function App() {
  const [text, setText] = useState("hello");

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={text} />
    </div>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/agitated-glitter-ybnfni)**

In this example, **every item in `<MySlowList>` has an artificial slowdown -- each of them blocks the thread for a few milliseconds**. We'd never do this in a real app, but this helps us simulate what can happen in a deep component tree with no single obvious place to optimize.

We can see how typing in the input causes stutter. Now let's add `useDeferredValue`:

```js{3,16}
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text);

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <div className="App">
      <label>
        Type into the input:{" "}
        <input value={text} onChange={handleChange} />
      </label>
      ...
      <MySlowList text={deferredText} />
    </div>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/jovial-frost-30embe)**

Now typing has a lot less stutter -- although we pay for this by showing the results with a lag.

How is this different from debouncing? Our example has a fixed artificial delay (3ms for every one of 80 items), so there is always a delay, no matter how fast our computer is. However, the `useDeferredValue` value only "lags behind" if the rendering takes a while. There is no minimal lag imposed by React. With a more realistic workload, you can expect the lag to adjust to the user’s device. On fast machines, the lag would be smaller or non-existent, and on slow machines, it would be more noticeable. In both cases, the app would remain responsive. That’s the advantage of this mechanism over debouncing or throttling, which always impose a minimal delay and can't avoid blocking the thread while rendering.

Even though there is an improvement in responsiveness, this example isn't as compelling yet because Concurrent Mode is missing some crucial optimizations for this use case. Still, it is interesting to see that features like `useDeferredValue` (or `useTransition`) are useful regardless of whether we're waiting for network or for computational work to finish.

### SuspenseList {#suspenselist}

<div class="scary">

>Caution:
>
>`<SuspenseList>` is not a part of React 18 and will be included in a future release.

</div>

`<SuspenseList>` is the last pattern that's related to orchestrating loading states.

Consider this example:

```js{5-10}
function ProfilePage({ resource }) {
  return (
    <>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/hardcore-river-14ecuq)**

The API call duration in this example is randomized. If you keep refreshing it, you will notice that sometimes the posts arrive first, and sometimes the "fun facts" arrive first.

This presents a problem. If the response for fun facts arrives first, we'll see the fun facts below the `<h2>Loading posts...</h2>` fallback for posts. We might start reading them, but then the *posts* response will come back, and shift all the facts down. This is jarring.

One way we could fix it is by putting them both in a single boundary:

```js
<Suspense fallback={<h2>Loading posts and fun facts...</h2>}>
  <ProfileTimeline resource={resource} />
  <ProfileTrivia resource={resource} />
</Suspense>
```

**[Try it on CodeSandbox](https://codesandbox.io/s/quirky-meadow-w1c61p)**

The problem with this is that now we *always* wait for both of them to be fetched. However, if it's the *posts* that came back first, there's no reason to delay showing them. When fun facts load later, they won't shift the layout because they're already below the posts.

Other approaches to this, such as composing Promises in a special way, are increasingly difficult to pull off when the loading states are located in different components down the tree.

To solve this, we will import `SuspenseList`:

```js
import { SuspenseList } from 'react';
```

`<SuspenseList>` coordinates the "reveal order" of the closest `<Suspense>` nodes below it:

```js{3,11}
function ProfilePage({ resource }) {
  return (
    <SuspenseList revealOrder="forwards">
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h2>Loading posts...</h2>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
      <Suspense fallback={<h2>Loading fun facts...</h2>}>
        <ProfileTrivia resource={resource} />
      </Suspense>
    </SuspenseList>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/empty-leaf-lp7eom)**

The `revealOrder="forwards"` option means that the closest `<Suspense>` nodes inside this list **will only "reveal" their content in the order they appear in the tree -- even if the data for them arrives in a different order**. `<SuspenseList>` has other interesting modes: try changing `"forwards"` to `"backwards"` or `"together"` and see what happens.

You can control how many loading states are visible at once with the `tail` prop. If we specify `tail="collapsed"`, we'll see *at most one* fallback at a time. You can play with it [here](https://codesandbox.io/s/keen-leaf-gccxd8).

Keep in mind that `<SuspenseList>` is composable, like anything in React. For example, you can create a grid by putting several `<SuspenseList>` rows inside a `<SuspenseList>` table.

## Next Steps {#next-steps}

Concurrent Mode offers a powerful UI programming model and a set of new composable primitives to help you orchestrate delightful user experiences.

It's a result of several years of research and development, but it's not finished. In the section on [adopting Concurrent Mode](/docs/concurrent-mode-adoption.html), we'll describe how you can try it and what you can expect.
