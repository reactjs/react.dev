---
id: testing-environments
title: Testing Environments
permalink: docs/testing-environments.html
next: testing-recipes.html
prev: testing.html
---

<!-- This document is intended for folks who are comfortable with Javascript, and have probably written tests with it. It acts as a reference for the differences in testing environments for React components, and how those differences affect the tests that they write. This document also assumes a slant towards web-based react-dom components, but has notes for other renderers. -->

Testing environments affect the way you write and run tests for React Components.

This document goes through the major factors that can affect your environment, the implications of those decisions, and recommendations for some scenarios.

### Test runners {#test-runners}

Test runners like [Jest](https://jestjs.io/), [mocha](https://mochajs.org/), [ava](https://github.com/avajs/ava) let you write test suites as regular Javascript, and run them as part of your development process. Additionally, test suites are run as part of workflows like builds, CI/CD, etc.

- Jest is widely compatible with React projects, supporting features like mocked [modules](#mocking-modules) and [timers](#mocking-timers), [`jsdom`](#mocking-a-rendering-surface) support, etc. Frameworks like `create-react-app` [include `Jest`](https://facebook.github.io/create-react-app/docs/running-tests) with useful defaults.
- Libraries like [mocha](https://mochajs.org/#running-mocha-in-the-browser) work well in real browser environments, and could help for tests that explicitly need it.
- End-to-End tests are used for testing longer flows across multiple pages, and require a [different setup](#end-to-end-tests-aka-e2e-tests).

### Mocking a rendering surface {#mocking-a-rendering-surface}

Tests commonly run in an environment without access to a 'real' rendering surface like a browser. For these environments, we recommend simulating a browser with [`jsdom`](https://github.com/jsdom/jsdom), a lightweight browser implementation that runs inside Node.js.

`jsdom` behaves like a regular browser would, but doesn't have features like [layout and navigation](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform). This is still useful for most web-based component tests, since it runs quicker than having to start up a browser for each test. It also runs in the same process as your tests, so you can write code to examine and assert on the rendered DOM.

Just like in a real browser, `jsdom` lets us model user interactions; tests can dispatch 'real' events on DOM nodes, and then observe and assert on the side effects of these actions [<small>(example)</small>](/docs/testing-recipes.html#events).

A large portion of UI tests can be written with the above setup: using Jest as a test runner, rendered to `jsdom`, with user interactions specified as sequences of browser events, powered by the `act()` helper [<small>(example)</small>](/docs/testing-recipes.html). For example, a lot of React's own tests are written with this combination.

If you're writing a library that tests mostly browser-specific behavior, and requires 'native' browser behavior like layout, you could use a framework like [mocha.](https://mochajs.org/)

In an environment where you _can't_ simulate a DOM (eg: testing React Native components on Node.js), you could use [event simulation helpers](https://reactjs.org/docs/test-utils.html#simulate) to simulate interactions with elements. Alternately, you could use the `fireEvent` helper from [`@testing-library/react-native`](https://testing-library.com/docs/native-testing-library).

Frameworks like [Cypress](https://www.cypress.io/), [puppeteer](https://github.com/GoogleChrome/puppeteer) and [webdriver](https://www.seleniumhq.org/projects/webdriver/) are useful for running [end-to-end tests](#end-to-end-tests-aka-e2e-tests).

### Mocking functions {#mocking-functions}

When writing tests, we'd like to mock out the parts of our code that don't have equivalents inside our testing environment (eg: checking `navigator.onLine` status inside Node.js). Tests could also spy on some functions, and observe how other parts of the test interact with them. It is then useful to be able to selectively mock these functions with test-friendly versions.

Particularly so for mocking data fetching infrastructure; consuming 'fake' data for tests without fetching from 'real' (possibly flaky) api endpoints [<small>(example)</small>](/docs/testing-recipes.html#data-fetching) make tests predictable. Libraries like [Jest](https://jestjs.io/) and [sinon](https://sinonjs.org/), among others, support mocked functions. It's harder to do so for end-to-end tests.

### Mocking modules {#mocking-modules}

Some components have dependencies for modules that may not work well in test environments, or aren't essential to our tests. It can be useful to selectively mock these modules out with suitable replacements [<small>(example)</small>](/docs/testing-recipes.html#mocking-modules).

On Node.js, runners like Jest [support mocking modules](https://jestjs.io/docs/en/manual-mocks). You could also use libraries like [`mock-require`](https://www.npmjs.com/package/mock-require).

### Mocking timers {#mocking-timers}

Components might be using time based functions `setTimeout`, `setInterval`, `Date.now`, etc. In testing environments, it's advantageous to mock these functions out with replacements that can be manually advanced and resolved. This is great for making sure your tests run fast! Tests that are dependent on timers resolve in order, but quicker [<small>(example)</small>](/docs/testing-recipes.html#timers). Most frameworks, including [Jest](https://jestjs.io/docs/en/timer-mocks), [sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) and [lolex](https://github.com/sinonjs/lolex) let you mock timers in your tests.

You may not want to mock timers for testing something that's dependent on the 'real' time passing. Examples include animation tests, or if you're interacting with a timing specific endpoint (like an api rate-limiter). Libraries with timer mocks let you enable and disable them on a per test/suite basis, so you can explicitly choose how these tests would run.

### End To End tests (aka 'e2e' tests) {#end-to-end-tests-aka-e2e-tests}

End To End tests are useful for testing longer workflows; tests that not only need a 'real' browser to render their components, but probably also fetch data from 'real' api endpoints, uses sessions and cookies in the browser, navigating between different links and asserting not just on the DOM state, but also backing data (like a database, to verify if updates happened as expected). In this scenario, you would use a framework like [Cypress](https://www.cypress.io/) or a library like [puppeteer](https://github.com/GoogleChrome/puppeteer) and move between multiple 'pages'/routes and assert on side effects not just in the browser, but maybe on the backend too.
