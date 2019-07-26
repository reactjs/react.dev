---
id: testing-recipes
title: Testing Recipes
permalink: docs/testing-recipes.html
prev: testing-environments.html
---

Common testing patterns for React components

> Note:
>
> This page assumes you're using [Jest](https://jestjs.io/) as a test runner. If you use a different test runner, you may need to adjust the API, but the overall shape of the solution will likely be the same. Read more details on setting up a testing environment in [the Environments doc](/docs/testing-environments.html).

These testing strategies work just as well for class components as they do for function components.

### Setup / Teardown

For each test, we usually want to render our React app to a DOM element that's attached to `document`. Further, we want to 'clean up' and unmount the app once the test is over. It's useful to write this in `beforeEach`/`afterEach` blocks so that they'll always run and isolate the effects of a test to itself.

```jsx
import { unmountComponentAtNode } from "react-dom";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});
```

### `act()` {#act}

When writing UI tests, tasks like rendering, user events, or data fetching can be considered as 'units' of interaction with a user interface. `act()` makes sure all updates related to these 'units' have been processed and applied to the DOM before asserting on the result. This helps make your tests run closer to what real users would experience when using your application. The rest of these examples use `act()` to make these gurantees. (To avoid some of the boilerplate, you could use a library like [React Testing Library](https://testing-library.com/react), whose helpers are wrapped with `act()`.)

> Note:
>
> The name `act` comes from the [arrange-act-assert pattern](http://wiki.c2.com/?ArrangeActAssert).

### Rendering {#rendering}

Testing whether a component renders correctly for given props is a useful signal to the stability of a component. Consider a simple component that renders a message based on a prop.

```jsx
// hello.js

import React from "react";

export default function Hello(props) {
  return props.name === undefined ? (
    <h1>Hello, {props.name}!</h1>
  ) : (
    <span>Hey, stranger</span>
  );
}
```

We can write a test for this component:

```jsx{24-27}
// hello.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    render(<Hello name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Hello Jenny!");

  act(() => {
    render(<Hello name="Margaret" />, container);
  });
  expect(container.textContent).toBe("Hello Margaret!");
});
```

### Data fetching {#data-fetching}

Instead of calling real APIs in all your tests, you can mock requests with dummy data. Mocking data fetching with 'fake' data prevents flaky tests due to an unavailable backend, and makes them run faster. Note: you may still want to run a subset of tests using an "end-to-end" framework that tells whether the whole app is working together.

```jsx
// user.js

import React, { useState, useEffect } from "react";

export default function User(props) {
  const [user, setUser] = useState(null);
  async function fetchUserData(id) {
    const response = await fetch("/" + id);
    setUser(await response.json());
  }
  useEffect(() => {
    fetchUserData(props.id);
  }, [props.id]);
  return user === null ? (
    "loading..."
  ) : (
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

```jsx{23-32,44}
// user.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import User from "./user";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
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
    render(<User id="123" />, div);
  });

  expect(container.querySelector("summary").textContent).toBe(fakeUser.name);
  expect(container.querySelector("strong").textContent).toBe(fakeUser.age);
  expect(container.textContent).toContain(fakeUser.address);

  // remove the mock to ensure tests are completely isolated
  global.fetch.mockRestore();
});
```

### Mocking modules {#mocking-modules}

Some modules might not work well inside a testing environment, or may not be as essential to the tests itself. Mocking out these modules with different versions can make it easier to write tests for your own code. In this example, a `Contact` component embeds a GoogleMaps component from [`@react-google-maps/api`](https://react-google-maps-api-docs.netlify.com/)

```jsx
// map.js

import React from "react";

import { LoadScript, GoogleMap } from "react-google-maps";
export default function Map(props) {
  return (
    <LoadScript id="script-loader" googleMapsApiKey="YOUR_API_KEY">
      <GoogleMap id="example-map" center={props.center} />
    </LoadScript>
  );
}

// contact.js

import React from "react";
import Map from "./map";

function Contact(props) {
  return (
    <div>
      <address>
        Contact {props.name} via <a href={"mailto:" + props.email}>email</a>
        or on their <a href={props.site}>website</a>.
      </address>
      <Map center={props.center} />
    </div>
  );
}
```

In a testing environment, it's not very useful to load the Map component, besides also being inessential to testing our own code. In this situation, we can mock out the dependency itself to a dummy component, and run our tests.

```jsx{10,31-32}
// contact.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => jest.fn(() => "DummyMap"));

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render contact information", () => {
  const center = { lat: 0, lang: 0 };
  act(() => {
    render(<Contact name="" email="" site="" center={center} />, container);
  });
  // ensure the mocked map component function was called correctly
  expect(MockedMap).toHaveBeenCalledWith({ id: "example-map", center }, {});
});
```

### Events {#events}

Dispatch real events on components and elements, and observe the side effects of those actions on UI elements. Consider a `Toggle` component:

```jsx
// toggle.js

import React, { useState } from "react";

export default function Toggle(props) {
  // initial, onChange
  const [state, setState] = useState(Boolean(initial));
  return (
    <button
      onClick={() => {
        setState(previousState => !previousState);
        onChange(!previousState);
      }}
      data-testid="toggle"
    >
      {state === true ? "Turn off" : "Turn on"}
    </button>
  );
}
```

We could write tests for it:

```jsx{13-14,34,42}
// toggle.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Toggle from "./toggle";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  // container *must* be attached to document so events work correctly.
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("changes value when clicked", () => {
  const onChange = jest.fn();
  act(() => {
    render(<Toggle initial={true} onChange={onChange} />, container);
  });

  // get a hold of the button element, and trigger some clicks on it
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerText).toBe("Turn on!");
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(button.innerText).toBe("Turn off!");

  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });

  expect(onChange).toHaveBeenCalledTimes(5);
  expect(button.innerText).toBe("Turn on!");
});
```

### Timers {#timers}

UIs could use timer based functions like `setTimeout` to run time sensitive code. In this example, a multiple choice panel waits for a selection and advances, timing out if a selection isn't made in 5 seconds.

```jsx
//card.js

import React, { useEffect } from "react";

export default function Card(props) {
  useEffect(
    props => {
      const timeoutID = setTimeout(() => {
        props.onSelect(null);
      }, 5000);
      return () => {
        clearTimeout(timeoutID);
      };
    },
    [props.onSelect]
  );
  return [1, 2, 3, 4].map(choice => {
    <button
      key={choice}
      data-test-id={choice}
      onClick={() => props.onSelect(choice)}
    >
      {choice}
    </button>;
  });
}
```

We can write tests for this component by leveraging [Jest's timer mocks](https://jestjs.io/docs/en/timer-mocks), and testing the different states it can be in.

```jsx{7,29,33,44,51}
// card.test.js

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

jest.useFakeTimers();

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should select null after timing out", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(onSelect).toHaveBeenCalledWith(null);
});

it("should cleanup on being removed", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(onSelect).not.toHaveBeenCalled();
  act(() => {
    render(null, container);
  });
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(onSelect).not.toHaveBeenCalled();
});

it("should accept selections", () => {
  const onSelect = jest.fn();
  act(() => {
    render(<Card onSelect={onSelect} />, container);
  });

  act(() => {
    container
      .querySelector("[data-test-id=2]")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(onSelect).toHaveBeenCalledWith(2);
});
```

### Snapshot testing {#snapshot-testing}

Frameworks like Jest also let you save 'snapshots' of data with [`toMatchSnapshot` / `toMatchInlineSnapshot`](https://jestjs.io/docs/en/snapshot-testing). With these, we can 'save' renderered components and verify they don't break in the future.

In this example, we render a component and format the rendered html with the [`pretty`](https://www.npmjs.com/package/pretty) package, before saving it as an inline snapshot.

```jsx{28-31}
// hello.test.js, again

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import pretty from "pretty";

import Hello from "./hello";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("should render a greeting", () => {
  act(() => {
    render(<Hello />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */

  act(() => {
    render(<Hello name="Jenny" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */

  act(() => {
    render(<Hello name="Margaret" />, container);
  });

  expect(
    pretty(container.innerHTML)
  ).toMatchInlineSnapshot(); /* ... gets filled automatically by jest ... */
});
```

It's typically better to make more specific assertions than to use snapshots (or at least ensure that the snapshot is small) because these kinds of tests include implementation details meaning they break easily and teams can get desensitized to snapshot breakages.

### Multiple renderers {#multiple-renderers}

In rare cases, you may be running a test on a component that uses multiple renderers. For example, you may be running snapshot tests on a component with `react-test-renderer`, that internally uses `ReactDOM.render` inside a child component to render some content. In this scenario, you can wrap updates with `act()`s corresponding to their renderers.

```jsx
import { act as domAct } from "react-dom/test-utils";
import { act as testAct, create } from "react-test-renderer";
// ...
let root;
domAct(() => {
  testAct(() => {
    root = create(<App />);
  });
});
expect(root).toMatchSnapshot();
```
