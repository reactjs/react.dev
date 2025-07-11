---
title: React Compiler
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
React Compiler is currently in RC. We now recommend everyone to try the compiler and provide feedback. The latest RC release can be found with the `@rc` tag.
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

React Compiler automatically applies the equivalent optimizations, ensuring your app only re-renders when necessary. This is sometimes referred to as "fine-grained reactivity."

## Should I try out the compiler? {/*should-i-try-out-the-compiler*/}

React Compiler is now in RC and has been tested extensively in production. While it has been used in production at companies like Meta, rolling out the compiler to production for your app will depend on the health of your codebase and how well you've followed the [Rules of React](/reference/rules).

**You don't have to rush into using the compiler now. It's okay to wait until it reaches a stable release before adopting it.** However, we do appreciate trying it out in small experiments in your apps so that you can provide feedback to us to help make the compiler better.

## Try React Compiler {/*try-react-compiler*/}

This section will help you get started with React Compiler and understand how to use it effectively in your projects.

* **[Getting Started](/learn/react-compiler/getting-started)** - Install React Compiler and configure it for your build tools
* **[Backwards Compatibility](/learn/react-compiler/compatibility)** - Support for React 17, 18, and 19
* **[Configuration](/learn/react-compiler/configuration)** - Customize the compiler for your specific needs
* **[Incremental Adoption](/learn/react-compiler/incremental-adoption)** - Strategies for gradually rolling out the compiler in existing codebases
* **[Debugging and Troubleshooting](/learn/react-compiler/debugging)** - Identify and fix issues when using the compiler
* **[Library Authors Guide](/learn/react-compiler/library-authors)** - Best practices for shipping compiled code
* **[API Reference](/reference/react/react-compiler)** - Detailed documentation of all configuration options

## Additional resources {/*additional-resources*/}

In addition to these docs, we recommend checking the [React Compiler Working Group](https://github.com/reactwg/react-compiler) for additional information and discussion about the compiler.

