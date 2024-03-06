---
title: Rules of React
---

<Intro>
JavaScript rendering libraries and frameworks like React have constraints or "rules" to make the programming model cohesive and easy to reason about, while also helping you prevent bugs in your code. The rules also have the added benefit of creating a safe space for React to optimize and run your code more efficiently. This page lists all the Rules of React.
</Intro>

---

These constraints are known as the **Rules of React**. They are rules – and not just guidelines – in the sense that if they are broken, your app likely has bugs. Your code also becomes unidiomatic and harder to understand and reason about.

We strongly recommend using Strict Mode alongside React's ESLint plugin to help your codebase follow the Rules of React. By following the Rules of React, you'll be able to find and address these bugs, as well as prepare your codebase to work out of the box with the upcoming compiler.

<DeepDive>
#### Why are rules necessary in React? {/*why-are-rules-necessary-in-react*/}

You can think of React's constraints like the grammatical rules and patterns of languages: they constrain what we can do with words, so that we can correctly and efficiently communicate our thoughts.

These rules have been used in the design of all of React's features over the years. React's Strict Mode enforces several of these rules at runtime in DEV mode, and with the release of React's upcoming compiler, more rules will now be statically checked to help you find more bugs as well as allow for correct optimisation of your code.

The Rules of React are proven rules used at companies like Meta that help you maintain an application and codebase that scales with you. When followed, your codebase becomes easier to understand and maintain, is less buggy, and helps React ensure your code runs efficiently by default.
</DeepDive>

---

## Rules {/*rules*/}
* [Side effects must run outside of render](/reference/rules/side-effects-must-run-outside-of-render): React can start and stop rendering components multiple times to create the best possible user experience.
* [Components must be idempotent](/reference/rules/components-must-be-idempotent): React components are assumed to always return the same output with respect to their props.
* [Props and state are immutable](/reference/rules/props-and-state-are-immutable): A component's props and state are immutable "snapshots" with respect to a single render.
* [Never call component functions directly](/reference/rules/never-call-component-functions-directly): Components should only be used in JSX. Don't call them as regular functions.
* [Never pass around Hooks as regular values](/reference/rules/never-pass-around-hooks-as-regular-values): Hooks should only be called inside of components. Never pass it around as a regular value.
* [Only call Hooks at the top level](/reference/rules/only-call-hooks-at-the-top-level): Don’t call Hooks inside loops, conditions, or nested functions. Instead, always use Hooks at the top level of your React function, before any early returns.
* [Only call Hooks from React functions](/reference/rules/only-call-hooks-from-react-functions): Don’t call Hooks from regular JavaScript functions.
* [Values are immutable after being passed to JSX](/reference/rules/values-are-immutable-after-being-passed-to-jsx): Don't mutate values after they've been used in JSX. Move the mutation before the JSX is created.
* [Return values and arguments to Hooks are immutable](/reference/rules/return-values-and-arguments-to-hooks-are-immutable): TODO
