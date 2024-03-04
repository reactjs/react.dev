---
title: Rules of React
---

<Intro>
JavaScript rendering libraries and frameworks like React have constraints or "rules" to make the programming model cohesive and easy to reason about, while also helping you prevent bugs in your code. The rules also have the added benefit of creating a safe space for React to optimise and run your code more efficiently. This page lists all the Rules of React.
</Intro>

---

These constraints are known as the **Rules of React**. They are rules – and not just guidelines – in the sense that if they are broken, your app likely has bugs. Your code also becomes unidiomatic and harder to understand and reason about.

We strongly recommend using Strict Mode alongside React's ESLint plugin to help your codebase follow the Rules of React. By following the Rules of React, you'll be able to find and address these bugs, as well as prepare your codebase to work out of the box with the upcoming compiler.

<DeepDive>
#### Why are rules necessary in React? {/*why-are-rules-necessary-in-react*/}

You can think of React's constraints like the grammatical rules and patterns of languages: they constrain what we can do with words, so that we can correctly and efficiently communicate our thoughts. These rules have been used in the design of all of React's features over the years. React's Strict Mode enforces several of these rules at runtime in DEV mode, and with the release of React's upcoming compiler, more rules will now be statically checked to help you find more bugs as well as allow for correct optimisation of your code.

The upcoming compiler automatically makes writing simple and intuitive React code run efficiently by default. It understands JavaScript semantics and relies on the Rules of React in order to correctly and precisely optimise your codebase.

However, while the compiler can detect most cases of Rules of React breakages, because of the dynamic and flexible nature of JavaScript, it is not possible to exhaustively detect all edge cases. Future iterations of the compiler will continue to improve its static detection, but it's important to understand and follow the Rules of React so that your code continues to run correctly and efficiently even if it's not possible to statically detect.

If the Rules of React are broken, at best the upcoming compiler will skip optimising the components that broke the rules; and at worst, if the breakage is not statically detectable the compiled code may break in unexpected ways.
</DeepDive>

---

## Rules {/*rules*/}
* [Side effects must run outside of render](/reference/rules/side-effects-must-run-outside-of-render): React can start and stop rendering components multiple times to create the best possible user experience.
* [Components must be idempotent](/reference/rules/components-must-be-idempotent): React components are assumed to always return the same output with respect to their props.
* [Props and State are immutable](/reference/rules/props-and-state-are-immutable): A component's props and state are immutable "snapshots" with respect to a single render.
* [Never call component functions directly](/reference/rules/never-call-component-functions-directly): TODO React must orchestrate rendering
* [Never pass around Hooks as regular values](/reference/rules/never-pass-around-hooks-as-regular-values): TODO
* [Only call Hooks at the top level](/reference/rules/only-call-hooks-at-the-top-level): TODO
* [Only call Hooks from React functions](/reference/rules/only-call-hooks-from-react-functions): TODO
* [Values are immutable after being passed to JSX](/reference/rules/values-are-immutable-after-being-passed-to-jsx): TODO
* [Return values and arguments to Hooks are immutable](/reference/rules/return-values-and-arguments-to-hooks-are-immutable): TODO
