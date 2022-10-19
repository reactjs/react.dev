---
title: Testing Environments
---


<Intro>
This page goes through the factors that can affect your environment and recommendations for some scenarios.
</Intro>

<YouWillLearn>

- [About different test runners](#test-runners)
- [Mocking a rendering surface](#mocking-a-rendering-surface)
- [Mocking functions](#mocking-functions)
- [Mocking modules](#mocking-modules)
- [Mocking timers](#mocking-timers)
- [What are end-to-end test](#end-to-end-tests)


</YouWillLearn>

### Test runners {/*test-runners*/}

Test runners like [Jest](https://jestjs.io/), [mocha](https://mochajs.org/), [ava](https://github.com/avajs/ava) let you write test suites as regular JavaScript, and run them as part of your development process. Additionally, test suites are run as part of continuous integration.

- Jest is widely compatible with React projects, supporting features like mocked [modules](#mocking-modules) and [timers](#mocking-timers), and [`jsdom`](#mocking-a-rendering-surface) support. **If you use Create React App, [Jest is already included out of the box](https://facebook.github.io/create-react-app/docs/running-tests) with useful defaults.**
- Libraries like [mocha](https://mochajs.org/#running-mocha-in-the-browser) work well in real browser environments, and could help for tests that explicitly need it.
- End-to-end tests are used for testing longer flows across multiple pages, and require a [different setup](#end-to-end-tests-aka-e2e-tests).

### Mocking a rendering surface {/*mocking-a-rendering-surface*/}

Tests often run in an environment without access to a real rendering surface like a browser. For these environments, we recommend simulating a browser with [`jsdom`](https://github.com/jsdom/jsdom), a lightweight browser implementation that runs inside Node.js.

In most cases, jsdom behaves like a regular browser would, but doesn't have features like [layout and navigation](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform). This is still useful for most web-based component tests, since it runs quicker than having to start up a browser for each test. It also runs in the same process as your tests, so you can write code to examine and assert on the rendered DOM.

Just like in a real browser, jsdom lets us model user interactions; tests can dispatch events on DOM nodes, and then observe and assert on the side effects of these actions [<small>(example)</small>](/learn/testing-recipes.html#events).

A large portion of UI tests can be written with the above setup: using Jest as a test runner, rendered to jsdom, with user interactions specified as sequences of browser events, powered by the `act()` helper [<small>(example)</small>](/learn/testing-recipes.html). For example, a lot of React's own tests are written with this combination.

If you're writing a library that tests mostly browser-specific behavior, and requires native browser behavior like layout or real inputs, you could use a framework like [mocha.](https://mochajs.org/)

In an environment where you _can't_ simulate a DOM (e.g. testing React Native components on Node.js), you could use [event simulation helpers](/docs/test-utils.html#simulate) to simulate interactions with elements. Alternately, you could use the `fireEvent` helper from [`@testing-library/react-native`](https://testing-library.com/docs/react-native-testing-library/intro).

Frameworks like [Cypress](https://www.cypress.io/), [Playwright](https://playwright.dev), [Puppeteer](https://pptr.dev/), and [webdriver](https://www.selenium.dev/projects/) are useful for running [end-to-end tests](#end-to-end-tests).

### Mocking functions {/*mocking-functions*/}

When writing tests, we'd like to mock out the parts of our code that don't have equivalents inside our testing environment (e.g. checking `navigator.onLine` status inside Node.js). Tests could also spy on some functions, and observe how other parts of the test interact with them. It is then useful to be able to selectively mock these functions with test-friendly versions.

This is especially useful for data fetching. It is usually preferable to use "fake" data for tests to avoid the slowness and flakiness due to fetching from real API endpoints [<small>(example)</small>](/learn/testing-recipes.html#data-fetching). This helps make the tests predictable. Libraries like [Jest](https://jestjs.io/) and [sinon](https://sinonjs.org/), among others, support mocked functions. For end-to-end tests, mocking network can be more difficult, but you might also want to test the real API endpoints in them anyway.

### Mocking modules {/*mocking-modules*/}

Some components have dependencies for modules that may not work well in test environments, or aren't essential to our tests. It can be useful to selectively mock these modules out with suitable replacements.

On Node.js, runners like Jest [support mocking modules](https://jestjs.io/docs/en/manual-mocks). 


Consider a `Contact` component that embeds a third-party `GoogleMap` component:

```jsx
// map.js
import { LoadScript, GoogleMap } from "react-google-maps";

export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import Map from "./map";

export default function Contact(props) {
  return (
    <div>
      <address>
        Contact {props.name} via{" "}
        <a data-testid="email" href={"mailto:" + props.email}>
          email
        </a>
        or on their <a data-testid="site" href={props.site}>
          website
        </a>.
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

If we don't want to load this component in our tests, we can mock out the dependency itself to a dummy component, and run our tests:

```jsx{10-18}
// contact.test.js

import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => {
  return function DummyMap(props) {
    return (
      <div data-testid="map">
        {props.center.lat}:{props.center.long}
      </div>
    );
  };
});

let container = null;
let root = null;
beforeEach(() => {
  // setup a React root as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container)
  global.IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  // cleanup on exiting
  act(() => {
    root.unmount();
  });
  global.IS_REACT_ACT_ENVIRONMENT = false;
  root = null;
  container.remove();
  container = null;
});

it("should render contact information", () => {
  const center = { lat: 0, long: 0 };
  act(() => {
    root.render(
      <Contact
        name="Joni Baez"
        email="test@example.com"
        site="http://test.com"
        center={center}
      />
    );
  });

  expect(
    container.querySelector("[data-testid='email']").getAttribute("href")
  ).toEqual("mailto:test@example.com");

  expect(
    container.querySelector('[data-testid="site"]').getAttribute("href")
  ).toEqual("http://test.com");

  expect(container.querySelector('[data-testid="map"]').textContent).toEqual(
    "0:0"
  );
});
```


You could also use libraries like [`mock-require`](https://www.npmjs.com/package/mock-require).

### Mocking timers {/*mocking-timers*/}

Components might be using time-based functions like `setTimeout`, `setInterval`, or `Date.now`. In testing environments, it can be helpful to mock these functions out with replacements that let you manually "advance" time. This is great for making sure your tests run fast! Tests that are dependent on timers would still resolve in order, but quicker. Most frameworks, including [Jest](https://jestjs.io/docs/en/timer-mocks) and [sinon](https://sinonjs.org/releases/latest/fake-timers), let you mock timers in your tests.


Your code might use timer-based functions like `setTimeout` to schedule more work in the future. In this example, a multiple choice panel waits for a selection and advances, timing out if a selection isn't made in 5 seconds:

```jsx
// card.js

import {useEffect} from 'react';

export default function Card(props) {
  useEffect(() => {
    const timeoutID = setTimeout(() => {
      props.onSelect(null);
    }, 5000);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [props.onSelect]);

  return [1, 2, 3, 4].map((choice) => (
    <button
      key={choice}
      data-testid={choice}
      onClick={() => props.onSelect(choice)}>
      {choice}
    </button>
  ));
}
```

We can write tests for this component by leveraging [Jest's timer mocks](https://jestjs.io/docs/en/timer-mocks), and testing the different states it can be in.

```jsx{7,31,37,49,59}
// card.test.js

import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import Card from "./card";

let container = null;
let root = null;
beforeEach(() => {
  // setup a React root as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container)
  global.IS_REACT_ACT_ENVIRONMENT = true;

  jest.useFakeTimers();
});

afterEach(() => {
  // cleanup on exiting
  act(() => {
    root.unmount();
  });
  global.IS_REACT_ACT_ENVIRONMENT = false;
  root = null;
  container.remove();
  container = null;

  jest.useRealTimers();
});

it("should select null after timing out", () => {
  const onSelect = jest.fn();
  act(() => {
    root.render(<Card onSelect={onSelect} />);
  });

  // move ahead in time by 100ms
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // and then move ahead by 5 seconds
  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("should cleanup on being removed", () => {
  const onSelect = jest.fn();
  act(() => {
    root.render(<Card onSelect={onSelect} />);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();

  // unmount the app
  act(() => {
    root.render(null);
  });

  act(() => {
    jest.advanceTimersByTime(5000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("should accept selections", () => {
  const onSelect = jest.fn();
  act(() => {
    root.render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-testid='2']")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

Sometimes, you may not want to mock timers. For example, maybe you're testing an animation, or interacting with an endpoint that's sensitive to timing (like an API rate limiter). Libraries with timer mocks let you enable and disable them on a per test/suite basis, so you can explicitly choose how these tests would run.

### End-to-end tests {/*end-to-end-tests*/}

End-to-end tests are useful for testing longer workflows, especially when they're critical to your business (such as payments or signups). For these tests, you'd probably want to test how a real browser renders the whole app, fetches data from the real API endpoints, uses sessions and cookies, navigates between different links. You might also likely want to make assertions not just on the DOM state, but on the backing data as well (e.g. to verify whether the updates have been persisted to the database).

In this scenario, you would use a framework like [Cypress](https://www.cypress.io/), [Playwright](https://playwright.dev) or a library like [Puppeteer](https://pptr.dev/) so you can navigate between multiple routes and assert on side effects not just in the browser, but potentially on the backend as well.
