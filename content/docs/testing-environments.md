---
id: testing-environments
title: Testing environments
permalink: docs/testing-environments.html
---

<!-- This document is intended for folks who are comfortable with Javascript, and have probably written tests with it. It acts as a reference for the differences in testing environments for React components, and how those differences affect the tests that they write. This document also assumes a slant towards web-based react-dom components, but has notes for other renderers. -->

Testing environments can affect the way you write and run tests for React Components. 

This document goes through the major factors that can affect your environment, the implications of those decisions, and recommendations for some scenarios.

### Test frameworks {#test-frameworks}

Test frameworks like [Jest](https://jestjs.io/), [mocha](https://mochajs.org/), [ava](https://github.com/avajs/ava) let you write test suites as regular Javascript, and run them as part of your development process. Additionally, test suites are run as part of workflows like builds, CI/CD, etc.

- Jest is widely compatible with React projects, supporting features like mocked [modules](#mocking-modules) and [timers](#mocking-timers), [jsdom](#mocking-a-rendering-surface) support, etc.
- Libraries like `mocha` work well in real browser environments (when combined with a browser test runner like [Karma](https://karma-runner.github.io)), and could help for tests that explicitly need it.
- End-to-End tests are used for testing longer flows across multiple pages, and require a [different setup](#end-to-end-tests-aka-e2e-tests)

### Mocking a rendering surface {#mocking-a-rendering-surface}

Tests could run in an environment without access to a 'real' rendering surface. (eg: React Native or ReactDOM based components could be tested on Node.js) Depending on the type of test, you could simulate a browser-like DOM with something like [jsdom](https://github.com/jsdom/jsdom), or use [`react-test-renderer`](https://reactjs.org/docs/test-renderer.html) to render your components.

- [`jsdom`](https://github.com/jsdom/jsdom) is a lightweight browser implementation that's _mostly_ spec compliant, but runs inside Node.js. It behaves like a regular browser would, but doesn't have features like [layout and navigation](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform). This is still useful for most web-based component tests, since it runs quicker than having to start up a browser for each test. It also runs in the same process as your tests, so you can write code to examine and assert on the rendered DOM.

- Just like in a real browser, `jsdom` lets us model user interactions; tests can dispatch 'real' events on DOM nodes, and then observe and assert on the side effects of these actions on a rendered surface.[<sup>(example)</sup>](/docs/testing-recipes.html#events)

- A large portion of UI tests can be written with the above setup: using Jest as a test runner, rendered to `jsdom`, with user interactions specified as sequences of browser events, powered by [`act()`](/docs/act.html)[<sup>(examples)</sup>](/docs/testing-recipes.html). For example, a lot of React's own tests are written with this combination.

- If you're writing a library that tests mostly browser-specific behaviour, and requires 'native' browser behaviour like layout, you could use a framework like [mocha](https://mochajs.org/) in combination with [Karma](https://karma-runner.github.io) to run your tests in a browser.[<sup>(example)</sup>](packages/mocha/README.md)

- In an environment where you _can't_ simulate a DOM (eg: testing React Native components on Node.js), you could use [event simulation helpers](https://reactjs.org/docs/test-utils.html#simulate) to simulate interactions with elements. Alternatively, you could use the `fireEvent` helper from [`@testing-library/react-native`](https://testing-library.com/docs/native-testing-library).

- Frameworks like [Cypress](https://www.cypress.io/), [puppeteer](https://github.com/GoogleChrome/puppeteer) and [webdriver](https://www.seleniumhq.org/projects/webdriver/) are useful for running [end-to-end tests](#end-to-end-tests-aka-e2e-tests) (puppeteer and webdriver both run in a separate process from the actual code being tested).

### Mocking functions {#mocking-functions}

When writing tests, we'd like to mock out the parts of our code that don't have equivalents inside our testing environment (eg: checking `navigator.onLine` status inside Node.js). Tests could also spy on some functions, and observe how other parts of the test interact with them. It is then useful to be able to selectively mock these functions with test-friendly versions.

Particularly so for mocking data fetching infrastructure; consuming 'fake' data for tests wihtout fetching from 'real' (possibly flaky) api endpoints[<sup>(example)</sup>](/docs/testing-recipes.html#data-fetching) make tests predictable. Libraries like [Jest](https://jestjs.io/) and [sinon](https://sinonjs.org/), among others, support mocked functions. It's harder to do so for end-to-end tests.

### Mocking modules {#mocking-modules}

Some components have dependencies for modules that may not work well in test environments, or aren't essential to our tests. It can be useful to selectively mock these modules out with suitable replacements.[<sup>(example)</sup>](/docs/testing-recipes.html#mocking-modules).

- On Node.js, runners like Jest supports mocking modules. You can also use libraries like [`mock-require`](https://www.npmjs.com/package/mock-require).[<sup>(example)</sup>](packages/mock-require/README.md)

- Testing environments without a module mocking mechanism (like browsers) might have to manually setup their builds to alias modules, possibly globally for all their tests. [<sup>(example)</sup>](packages/aliased-mocha-browser) Notably, [end-to-end tests](#end-to-end-tests-aka-e2e-tests) might have a harder time setting up module mocks.

### Mocking timers {#mocking-timers}

Components might be using time based functions `setTimeout`, `setInterval`, `Date.now`, etc. In testing environments, it's advantageous to mock these functions out with replacements that can be manually advanced and resolved. This is great for making sure your tests run fast! Tests that are dependent on timers resolve in order, but quicker.[<sup>(example)</sup>](/docs/testing-recipes.html#timers) Most frameworks, including [Jest](https://jestjs.io/docs/en/timer-mocks), [sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) and [lolex](https://github.com/sinonjs/lolex) let you mock timers in your tests.

- A pattern that's harder without mocked timers, is waiting for all 'live' timers to resolve, and then for the UI to render. A solution is waiting for actual elements to appear/change on the rendering surface[<sup>(example)</sup>](/docs/testing-recipes.html#elements). Tests could also 'await' specific periods, but makes them subject to change when the component's behaviour changes[<sup>(example)</sup>](/docs/testing-recipes.html#real-timers).

- You may not want to mock timers for testing something that's dependent on the 'real' time passing. Examples include animation tests, or if you're interacting with a timing specific endpoint (like an api rate-limiter). Libraries with timer mocks let you enable and disable them on a per test/suite basis, so you can explicitly choose how these tests would run.

### End To End tests (aka 'e2e' tests) {#end-to-end-tests-aka-e2e-tests}

End To End tests are useful for testing longer workflows; tests that not only need a 'real' browser to render their components, but probably also fetch data from 'real' api endpoints, uses sessions and cookies in the browser, navigating between different links and asserting not just on the DOM state, but also backing data (like a database, to verify if updates happened as expected). In this scenario, you would use a framework like [Cypress](https://www.cypress.io/) or a library like [puppeteer](https://github.com/GoogleChrome/puppeteer) and move between multiple 'pages'/routes and assert on side effects not just in the browser, but maybe on the backend too.[<sup>(example)</sup>](packages/e2e/README.md)
