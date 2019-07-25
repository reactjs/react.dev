---
id: mock-scheduler
title: Mocking the scheduler
permalink: docs/mock-scheduler.html
---

Mocking the scheduler for tests can guarantee consistent behaviour across modes.

React uses the `scheduler` module to sequence how and when 'work' get queued and executed in time. While this behaviour varies across modes, we still want to write tests that are decoupled from the mode they are running in. To make tests run consistently across modes, we can use [module mocking](/docs/testing-recipes.html#mock-modules) to mock `scheduler` with a test friendly version `scheduler/unstable_mock`. Combined with `act()`, you should be able to write tests that run consistently across modes.

### Setup

For jest, we can setup the mocked scheduler by adding this line before any other imports in a test suite, or adding it to a [global configuration file](https://jestjs.io/docs/en/cli#config-path).

```jsx
jest.mock("scheduler", () => require("scheduler/unstable_mock"));
```


* In environments that don't support module mocks, we could still (with some effort) setup the builds for tests such that the scheduler is replaced with the mock version.
* While not mocking the scheduler means that we can't guarantee the order and timing of updates to the rendering surface, this might not be a problem for certain classes of tests like end-to-end tests, etc.


