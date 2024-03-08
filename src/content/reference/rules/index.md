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

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure)
* [React orchestrates Components and Hooks](/reference/rules/react-orchestrates-components-and-hooks)
* [Rules of Hooks](/reference/rules/rules-of-hooks)
* [Rules of JSX](/reference/rules/rules-of-jsx)