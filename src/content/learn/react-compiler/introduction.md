---
title: Introduction
---

<Intro>
React Compiler is a new build-time tool that automatically optimizes your React app. It works with plain JavaScript, and understands the [Rules of React](/reference/rules), so you don't need to rewrite any code to use it.
</Intro>

<YouWillLearn>

* What React Compiler does
* Getting started with the compiler
* Incremental adoption strategies
* Debugging and troubleshooting when things go wrong
* Using the compiler on your React library

</YouWillLearn>

<Note>
React Compiler is currently in Release Candidate (RC). We now recommend everyone to try the compiler and provide feedback. The latest RC release can be found with the `@rc` tag.
</Note>

## What does React Compiler do? {/*what-does-react-compiler-do*/}

React Compiler automatically optimizes your React application at build time. React is often fast enough without optimization, but sometimes you need to manually memoize components and values to keep your app responsive. This manual memoization is tedious, easy to get wrong, and adds extra code to maintain. React Compiler does this optimization automatically for you, freeing you from this mental burden so you can focus on building features.

### Before React Compiler {/*before-react-compiler*/}

Without the compiler, you need to manually memoize components and values to optimize re-renders:

```js
import { useMemo, useCallback, memo } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data, onClick }) {
  const processedData = useMemo(() => {
    return expensiveProcessing(data);
  }, [data]);

  const handleClick = useCallback((item) => {
    onClick(item.id);
  }, [onClick]);

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
});
```

### After React Compiler {/*after-react-compiler*/}

With React Compiler, you write the same code without manual memoization:

```js
function ExpensiveComponent({ data, onClick }) {
  const processedData = expensiveProcessing(data);

  const handleClick = (item) => {
    onClick(item.id);
  };

  return (
    <div>
      {processedData.map(item => (
        <Item key={item.id} onClick={() => handleClick(item)} />
      ))}
    </div>
  );
}
```

_[See this example in the React Compiler Playground](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAogB4AOCmYeAbggMIQC2Fh1OAFMEQCYBDHAIA0RQowA2eOAGsiAXwCURYAB1iROITA4iFGBERgwCPgBEhAogF4iCStVoMACoeO1MAcy6DhSgG4NDSItHT0ACwFMPkkmaTlbIi48HAQWFRsAPlUQ0PFMKRlZFLSWADo8PkC8hSDMPJgEHFhiLjzQgB4+eiyO-OADIwQTM0thcpYBClL02xz2zXz8zoBJMqJZBABPG2BU9Mq+BQKiuT2uTJyomLizkoOMk4B6PqX8pSUFfs7nnro3qEapgFCAFEA)_

React Compiler automatically applies the equivalent optimizations, ensuring your app only re-renders when necessary.

<DeepDive>
#### What kind of memoization does React Compiler add? {/*what-kind-of-memoization-does-react-compiler-add*/}

React Compiler's automatic memoization is primarily focused on **improving update performance** (re-rendering existing components), so it focuses on these two use cases:

1. **Skipping cascading re-rendering of components**
    * Re-rendering `<Parent />` causes many components in its component tree to re-render, even though only `<Parent />` has changed
1. **Skipping expensive calculations from outside of React**
    * For example, calling `expensivelyProcessAReallyLargeArrayOfObjects()` inside of your component or hook that needs that data

#### Optimizing Re-renders {/*optimizing-re-renders*/}

React lets you express your UI as a function of their current state (more concretely: their props, state, and context). In its current implementation, when a component's state changes, React will re-render that component _and all of its children_ — unless you have applied some form of manual memoization with `useMemo()`, `useCallback()`, or `React.memo()`. For example, in the following example, `<MessageButton>` will re-render whenever `<FriendList>`'s state changes:

```javascript
function FriendList({ friends }) {
  const onlineCount = useFriendOnlineCount();
  if (friends.length === 0) {
    return <NoFriends />;
  }
  return (
    <div>
      <span>{onlineCount} online</span>
      {friends.map((friend) => (
        <FriendListCard key={friend.id} friend={friend} />
      ))}
      <MessageButton />
    </div>
  );
}
```
[_See this example in the React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAMygOzgFwJYSYAEAYjHgpgCYAyeYOAFMEWuZVWEQL4CURwADrEicQgyKEANnkwIAwtEw4iAXiJQwCMhWoB5TDLmKsTXgG5hRInjRFGbXZwB0UygHMcACzWr1ABn4hEWsYBBxYYgAeADkIHQ4uAHoAPksRbisiMIiYYkYs6yiqPAA3FMLrIiiwAAcAQ0wU4GlZBSUcbklDNqikusaKkKrgR0TnAFt62sYHdmp+VRT7SqrqhOo6Bnl6mCoiAGsEAE9VUfmqZzwqLrHqM7ubolTVol5eTOGigFkEMDB6u4EAAhKA4HCEZ5DNZ9ErlLIWYTcEDcIA)

React Compiler automatically applies the equivalent of manual memoization, ensuring that only the relevant parts of an app re-render as state changes, which is sometimes referred to as "fine-grained reactivity". In the above example, React Compiler determines that the return value of `<FriendListCard />` can be reused even as `friends` changes, and can avoid recreating this JSX _and_ avoid re-rendering `<MessageButton>` as the count changes.

#### Expensive calculations also get memoized {/*expensive-calculations-also-get-memoized*/}

React Compiler can also automatically memoize expensive calculations used during rendering:

```js
// **Not** memoized by React Compiler, since this is not a component or hook
function expensivelyProcessAReallyLargeArrayOfObjects() { /* ... */ }

// Memoized by React Compiler since this is a component
function TableContainer({ items }) {
  // This function call would be memoized:
  const data = expensivelyProcessAReallyLargeArrayOfObjects(items);
  // ...
}
```
[_See this example in the React Compiler Playground_](https://playground.react.dev/#N4Igzg9grgTgxgUxALhAejQAgFTYHIQAuumAtgqRAJYBeCAJpgEYCemASggIZyGYDCEUgAcqAGwQwANJjBUAdokyEAFlTCZ1meUUxdMcIcIjyE8vhBiYVECAGsAOvIBmURYSonMCAB7CzcgBuCGIsAAowEIhgYACCnFxioQAyXDAA5gixMDBcLADyzvlMAFYIvGAAFACUmMCYaNiYAHStOFgAvk5OGJgAshTUdIysHNy8AkbikrIKSqpaWvqGIiZmhE6u7p7ymAAqXEwSguZcCpKV9VSEFBodtcBOmAYmYHz0XIT6ALzefgFUYKhCJRBAxeLcJIsVIZLI5PKFYplCqVa63aoAbm6u0wMAQhFguwAPPRAQA+YAfL4dIloUmBMlODogDpAA)

However, if `expensivelyProcessAReallyLargeArrayOfObjects` is truly an expensive function, you may want to consider implementing its own memoization outside of React, because:

- React Compiler only memoizes React components and hooks, not every function
- React Compiler's memoization is not shared across multiple components or hooks

So if `expensivelyProcessAReallyLargeArrayOfObjects` was used in many different components, even if the same exact items were passed down, that expensive calculation would be run repeatedly. We recommend [profiling](reference/react/useMemo#how-to-tell-if-a-calculation-is-expensive) first to see if it really is that expensive before making code more complicated.
</DeepDive>

## Should I try out the compiler? {/*should-i-try-out-the-compiler*/}

We encourage everyone to start using React Compiler. While the compiler is still an optional addition to React today, in the future some features may require the compiler in order to fully work.

### Is it safe to use? {/*is-it-safe-to-use*/}

React Compiler is now in RC and has been tested extensively in production. While it has been used in production at companies like Meta, rolling out the compiler to production for your app will depend on the health of your codebase and how well you've followed the [Rules of React](/reference/rules).

## What build tools are supported? {/*what-build-tools-are-supported*/}

React Compiler can be installed across [several build tools](/learn/react-compiler/installation) such as Babel, Vite, Metro, and Rsbuild.

React Compiler is primarily a light Babel plugin wrapper around the core compiler, which was designed to be decoupled from Babel itself. While the initial stable version of the compiler will remain primarily a Babel plugin, we are working with the swc and [oxc](https://github.com/oxc-project/oxc/issues/10048) teams to build first class support for React Compiler so you won't have to add Babel back to your build pipelines in the future.

Next.js users can enable the swc-invoked React Compiler by using [v15.3.1](https://github.com/vercel/next.js/releases/tag/v15.3.1) and up.

## What should I do about useMemo, useCallback, and React.memo? {/*what-should-i-do-about-usememo-usecallback-and-reactmemo*/}

React Compiler adds automatic memoization more precisely and granularly than is possible with [`useMemo`](/reference/react/useMemo), [`useCallback`](/reference/react/useCallback), and [`React.memo`](/reference/react/memo). If you choose to keep manual memoization, React Compiler will analyze them and determine if your manual memoization matches its automatically inferred memoization. If there isn't a match, the compiler will choose to bail out of optimizing that component.

This is done out of caution as a common anti-pattern with manual memoization is using it for correctness.  This means your app depends on specific values being memoized to work properly. For example, in order to prevent an infinite loop, you may have memoized some values to stop a `useEffect` call from firing. This breaks the Rules of React, but since it can potentially be dangerous for the compiler to automatically remove manual memoization, the compiler will just bail out instead. You should manually remove your handwritten memoization and verify that your app still works as expected.

## Try React Compiler {/*try-react-compiler*/}

This section will help you get started with React Compiler and understand how to use it effectively in your projects.

* **[Installation](/learn/react-compiler/installation)** - Install React Compiler and configure it for your build tools
* **[React Version Compatibility](/reference/react-compiler/target)** - Support for React 17, 18, and 19
* **[Configuration](/reference/react-compiler/configuration)** - Customize the compiler for your specific needs
* **[Incremental Adoption](/learn/react-compiler/incremental-adoption)** - Strategies for gradually rolling out the compiler in existing codebases
* **[Debugging and Troubleshooting](/learn/react-compiler/debugging)** - Identify and fix issues when using the compiler
* **[Compiling Libraries](/reference/react-compiler/compiling-libraries)** - Best practices for shipping compiled code
* **[API Reference](/reference/react-compiler/configuration)** - Detailed documentation of all configuration options

## Additional resources {/*additional-resources*/}

In addition to these docs, we recommend checking the [React Compiler Working Group](https://github.com/reactwg/react-compiler) for additional information and discussion about the compiler.

