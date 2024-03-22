---
title: React Compiler
---

<Intro>
TODO
</Intro>

<YouWillLearn>

* What is the compiler

</YouWillLearn>

## React Compiler {/*react-compiler*/}

The core idea of React is that developers define their UI as a function of the current state. You work with plain JavaScript values — numbers, strings, arrays, objects — and use standard JavaScript idioms — if/else, for, etc — to describe your component logic. The mental model is that React will re-render whenever the application state changes. We believe this simple mental model and keeping close to JavaScript semantics is an important principle in React’s programming model.

The catch is that React can sometimes be too reactive: it can re-render too much. For example, in JavaScript we don’t have cheap ways to compare if two objects or arrays are equivalent (having the same keys and values), so creating a new object or array on each render may cause React to do more work than it strictly needs to. This means developers have to explicitly memoize components so as to not over-react to changes.

Manual memoization is a reasonable compromise, but we weren’t satisfied. Our vision is for React to automatically re-render just the right parts of the UI when state changes, without compromising on React’s core mental model. We believe that React’s approach — UI as a simple function of state, with standard JavaScript values and idioms — is a key part of why React has been approachable for so many developers. That’s why we’ve invested in building an optimizing compiler for React.