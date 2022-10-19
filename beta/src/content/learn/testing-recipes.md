---
title: Testing Components
---

<Intro>
On this page, we'll show common testing patterns for React components. We will primarily use function components. However, these testing strategies don't depend on implementation details, and work just as well for class components too.
</Intro>

> Note:
>
> This page assumes you're using [Jest](https://jestjs.io/) as a test runner. If you use a different test runner, you may need to adjust the API, but the overall shape of the solution will likely be the same. Read more details on setting up a testing environment on the [Testing Environments](/learn/testing-environments.html) page.


<YouWillLearn>

- [Setup/Teardown of component tests](#setupteardown)
- [What is `act()`?](#act)
- [Rendering components in a test](#rendering)
- [Testing Data Fetching](#data-fetching)
- [Firing events](#events)
- [Snapshot Testing](#snapshot-testing)
- [Multiple Renderers](#multiple-renderers)

</YouWillLearn>

## Setup/Teardown {/*setupteardown*/}

For each test, we usually want to render our React tree to a DOM element that's attached to `document`. This is important so that it can receive DOM events. When the test ends, we want to "clean up" and unmount the tree from the `document`.

A common way to do it is to use a pair of `beforeEach` and `afterEach` blocks so that they'll always run and isolate the effects of a test to itself:

```jsx
import {createRoot} from 'react-dom/client';
import {act} from 'react-dom/test-utils';

let container = null;
let root = null;
beforeEach(() => {
  // setup a React root as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
  global.IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  // cleanup on exiting
  // We'll explain `act` and `IS_REACT_ACT_ENVIRONMENT` later
  act(() => {
    root.unmount();
  });
  global.IS_REACT_ACT_ENVIRONMENT = false;
  root = null;
  container.remove();
  container = null;
});
```

You may use a different pattern, but keep in mind that we want to execute the cleanup _even if a test fails_. Otherwise, tests can become "leaky", and one test can change the behavior of another test. That makes them difficult to debug.

---

## `act()` {/*act*/}

When writing UI tests, tasks like rendering, user events, or data fetching can be considered as "units" of interaction with a user interface. `react-dom/test-utils` provides a helper called `act()` that makes sure all updates related to these "units" have been processed and applied to the DOM before you make any assertions:

```js
act(() => {
  // render components
});
// make assertions
```

This helps make your tests run closer to what real users would experience when using your application. The rest of these examples use `act()` to make these guarantees.

Note that you the global `IS_REACT_ACT_ENVIRONMENT` has to be set e.g. by doing `global.IS_REACT_ACT_ENVIRONMENT = false`.
If you're not setting `IS_REACT_ACT_ENVIRONMENT` we assume your test is more of an end-to-end test and that you're waiting for React updates by other means (e.g. periodically checking if an update was applied to the screen).

You might find using `act()` directly a bit too verbose. To avoid some of the boilerplate, you could use a library like [React Testing Library](https://testing-library.com/react), whose helpers are wrapped with `act()`.

> Note:
>
> The name `act` comes from the [Arrange-Act-Assert](http://wiki.c2.com/?ArrangeActAssert) pattern.

---

## Rendering {/*rendering*/}

Commonly, you might want to test whether a component renders correctly for given props. Consider a simple component that renders a message based on a prop:

```jsx
// hello.js

import React from 'react';

export default function Hello(props) {
  if (props.name) {
    return <h1>Hello, {props.name}!</h1>;
  } else {
    return <span>Hey, stranger</span>;
  }
}
```

We can write a test for this component:

```jsx{24-27}
// hello.test.js

import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

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

it("renders with or without a name", () => {
  act(() => {
    root.render(<Hello />);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    root.render(<Hello name="Jenny" />);
  });
  expect(container.textContent).toBe("Hello, Jenny!");

  act(() => {
    root.render(<Hello name="Margaret" />);
  });
  expect(container.textContent).toBe("Hello, Margaret!");
});
```

---

### Data Fetching {/*data-fetching*/}

Instead of calling real APIs in all your tests, you can mock requests with dummy data. Mocking data fetching with "fake" data prevents flaky tests due to an unavailable backend, and makes them run faster. Note: you may still want to run a subset of tests using an ["end-to-end"](/learn/testing-environments.html#end-to-end-tests-aka-e2e-tests) framework that tells whether the whole app is working together.

```jsx
// user.js

import React, {useState, useEffect} from 'react';

export default function User(props) {
  const [user, setUser] = useState(null);

  async function fetchUserData(id) {
    const response = await fetch('/' + id);
    setUser(await response.json());
  }

  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);

  if (!user) {
    return 'loading...';
  }

  return (
    <details>
      <summary>{user.name}</summary>
      <strong>{user.age}</strong> years old
      <br />
      lives in {user.address}
    </details>
  );
}
```

We can write tests for it:

```jsx{23-33,44-45}
// user.test.js

import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import User from "./user";

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


  // remove the mock to ensure tests are completely isolated.
  // It is better to do this here than at the end of a test in case the test fails earlier and doesn't reach its end.
  jest.restoreAllMocks()
});

it("renders user data", async () => {
  const fakeUser = {
    name: "Joni Baez",
    age: "32",
    address: "123, Charming Avenue"
  };

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakeUser)
    })
  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<User id="123" />, container);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);
});
```

---

### Events {/*events*/}

We recommend dispatching real DOM events on DOM elements, and then asserting on the result. Consider a `Toggle` component:

```jsx
// toggle.js

import {useState} from 'react';

export default function Toggle(props) {
  const [state, setState] = useState(false);
  return (
    <button
      onClick={() => {
        setState((previousState) => !previousState);
        props.onChange(!state);
      }}
      data-testid="toggle">
      {state === true ? 'Turn off' : 'Turn on'}
    </button>
  );
}
```

We could write tests for it:

```jsx{13-14,35,43}
// toggle.test.js

import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

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

it("changes value when clicked", () => {
  const onChange = jest.fn();
  act(() => {
    root.render(<Toggle onChange={onChange} />, container);
  });

  // get a hold of the button element, and trigger some clicks on it
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerHTML).toBe("Turn on");

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerHTML).toBe("Turn off");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(6);
  expect(button.innerHTML).toBe("Turn on");
});
```

Different DOM events and their properties are described in [MDN](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent). Note that you need to pass `{ bubbles: true }` in each event you create for it to reach the React listener because React automatically delegates events to the root.

> Note:
>
> React Testing Library offers a [more concise helper](https://testing-library.com/docs/dom-testing-library/api-events) for firing events.

---

### Snapshot Testing {/*snapshot-testing*/}

Frameworks like Jest also let you save "snapshots" of data with [`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/en/snapshot-testing). With these, we can "save" the rendered component output and ensure that a change to it has to be explicitly committed as a change to the snapshot.

In this example, we render a component and format the rendered HTML with the [`pretty`](https://www.npmjs.com/package/pretty) package, before saving it as an inline snapshot:

```jsx{29-31}
// hello.test.js, again

import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

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

it("should render a greeting", () => {
  act(() => {
    root.render(<Hello />);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */

  act(() => {
    root.render(<Hello name="Jenny" />);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */

  act(() => {
    root.render(<Hello name="Margaret" />);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */
});
```

It's typically better to make more specific assertions than to use snapshots. These kinds of tests include implementation details so they break easily, and teams can get desensitized to snapshot breakages. Selectively [mocking some child components](#mocking-modules) can help reduce the size of snapshots and keep them readable for the code review.

---

### Multiple Renderers {/*multiple-renderers*/}

In rare cases, you may be running a test on a component that uses multiple renderers. For example, you may be running snapshot tests on a component with `react-test-renderer`, that internally uses `render` from `react-dom` inside a child component to render some content. In this scenario, you can wrap updates with `act()`s corresponding to their renderers.

```jsx
import {act as domAct} from 'react-dom/test-utils';
import {act as testAct, create} from 'react-test-renderer';
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```

---

### Something Missing? {/*something-missing*/}

If some common scenario is not covered, please let us know on the [issue tracker](https://github.com/reactjs/reactjs.org/issues) for the documentation website.
