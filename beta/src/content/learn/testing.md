---
title: Testing Overview
---

<Intro>

Testing React components is similar to testing other JavaScript code.
This chapter will focus on how to setup and write tests for React components.

</Intro>

<YouWillLearn isChapter={true}>

* [Common patterns when writing tests for React components](/learn/testing-recipes)
* [What to consider when setting up a testing environment for React components.](/learn/testing-environments)

</YouWillLearn>


There are a few ways to test React components. Broadly, they divide into two categories:

- **Rendering component trees** in a simplified test environment and asserting on their output.
- **Running a complete app** in a realistic browser environment (also known as “end-to-end” tests).

<LearnMore path="/learn/testing-recipes">

This documentation section focuses on testing strategies for the first case. Read **[Testing Components](/learn/testing-recipes)** to learn how to test components.

</LearnMore>

 While full end-to-end tests can be very useful to prevent regressions to important workflows, such tests are not concerned with React components in particular, and are out of the scope of this section.

## Tradeoffs {/*tradeoffs*/}

When choosing testing tools, it is worth considering a few tradeoffs:

- **Iteration speed vs Realistic environment:** Some tools offer a very quick feedback loop between making a change and seeing the result, but don't model the browser behavior precisely. Other tools might use a real browser environment, but reduce the iteration speed and are flakier on a continuous integration server.
- **How much to mock:** With components, the distinction between a "unit" and "integration" test can be blurry. If you're testing a form, should its test also test the buttons inside of it? Or should a button component have its own test suite? Should refactoring a button ever break the form test?

<LearnMore path="/learn/reacting-to-input-with-state">

Different answers may work for different teams and products.
Read **[Testing Environments](/learn/testing-environments)** to learn more about different tradeoffs.

</LearnMore>

Different answers may work for different teams and products.

## Recommended Tools {/*recommended-tools*/}

**[Jest](https://facebook.github.io/jest/)** is a JavaScript test runner that lets you access the DOM via [`jsdom`](/learn/testing-environments.html#mocking-a-rendering-surface). While jsdom is only an approximation of how the browser works, it is often good enough for testing React components. Jest provides a great iteration speed combined with powerful features like mocking [modules](/learn/testing-environments.html#mocking-modules) and [timers](/learn/testing-environments.html#mocking-timers) so you can have more control over how the code executes.

**[React Testing Library](https://testing-library.com/react)** is a set of helpers that let you test React components without relying on their implementation details. This approach makes refactoring a breeze and also nudges you towards best practices for accessibility. Although it doesn't provide a way to "shallowly" render a component without its children, a test runner like Jest lets you do this by [mocking](/learn/testing-recipes.html#mocking-modules).
