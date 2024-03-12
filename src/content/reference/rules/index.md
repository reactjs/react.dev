---
title: Rules of React
---

<Intro>
JavaScript rendering libraries and frameworks like React have constraints or "rules" to make the programming model cohesive and easy to reason about, while also helping you prevent bugs in your code. The rules also have the added benefit of creating a safe space for React to optimize and run your code more efficiently. This page lists all the Rules of React.
</Intro>

<InlineToc />

---

These constraints are known as the **Rules of React**. They are rules – and not just guidelines – in the sense that if they are broken, your app likely has bugs. Your code also becomes unidiomatic and harder to understand and reason about.

We strongly recommend using [Strict Mode](/reference/react/StrictMode) alongside React's [ESLint plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to help your codebase follow the Rules of React. By following the Rules of React, you'll be able to find and address these bugs, as well as prepare your codebase to work out of the box with the upcoming compiler.

<DeepDive>
#### Why are rules necessary in React? {/*why-are-rules-necessary-in-react*/}

You can think of React's constraints like the grammatical rules and patterns of languages: they constrain what we can do with words, so that we can correctly and efficiently communicate our thoughts.

These rules have been used in the design of all of React's features over the years. Enabling Strict Mode catches bugs caused by breaking these rules, and with the release of React's upcoming compiler, more rules will now be statically checked to help you find more bugs as well as allow for correct optimization of your code.

The Rules of React are proven rules used at companies like Meta that help you maintain an application and codebase that scales with you. When followed, your codebase becomes easier to understand and maintain, is less buggy, and helps React ensure your code runs efficiently by default.
</DeepDive>

---

## Components and Hooks must be pure {/*components-and-hooks-must-be-pure*/}

[Purity in Components and Hooks](/reference/rules/components-and-hooks-must-be-pure) is a key rule of React that makes your app predictable, easy to debug, and creates a safe space for the compiler to safely optimize your code.

* [Components must be idempotent](/reference/rules/components-and-hooks-must-be-pure#components-must-be-idempotent) – React components are assumed to always return the same output with respect to their inputs – props, state, and context.
* [Side effects must run outside of render](/reference/rules/components-and-hooks-must-be-pure#side-effects-must-run-outside-of-render) – Side effects should not run in render, as React can render components multiple times to create the best possible user experience.
* [Props and state are immutable](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable) – A component’s props and state are immutable snapshots with respect to a single render. Never mutate them directly.
* [Return values and arguments to Hooks are immutable](/reference/rules/components-and-hooks-must-be-pure#return-values-and-arguments-to-hooks-are-immutable) – Once values are passed to a Hook, you should not modify them. Like props in JSX, values become immutable when passed to a Hook.
* [Values are immutable after being passed to JSX](/reference/rules/components-and-hooks-must-be-pure#values-are-immutable-after-being-passed-to-jsx) – Don’t mutate values after they’ve been used in JSX. Move the mutation before the JSX is created.

---

## React orchestrates Components and Hooks {/*react-orchestrates-components-and-hooks*/}

[React takes care of when your code runs](/reference/rules/react-orchestrates-components-and-hooks) for you so that your application has a great user experience. It is declarative: you tell React what to render in your component’s logic, and React will figure out how best to display it to your user.

* [Never call component functions directly](/reference/rules/react-orchestrates-components-and-hooks#never-call-component-functions-directly) – Components should only be used in JSX. Don’t call them as regular functions.
* [Never pass around hooks as regular values](/reference/rules/react-orchestrates-components-and-hooks#never-pass-around-hooks-as-regular-values) – Hooks should only be called inside of components. Never pass it around as a regular value.

---

## Rules of Hooks {/*rules-of-hooks*/}

Hooks are JavaScript functions, but you need to follow the [Rules of Hooks](/reference/rules/rules-of-hooks) when using them.

* [Only call Hooks at the top level](/reference/rules/rules-of-hooks#only-call-hooks-at-the-top-level) – Don’t call Hooks inside loops, conditions, or nested functions. Instead, always use Hooks at the top level of your React function, before any early returns.
* [Only call Hooks from React functions](/reference/rules/rules-of-hooks#only-call-hooks-from-react-functions) – Don’t call Hooks from regular JavaScript functions.
