---
id: testing-recipes
title: Test recipes 
permalink: docs/testing-recipes.html
---

This document lists some common testing patterns for React components.

- This assumes tests are running in jest. For details on setting up a testing environment, read [the Environments doc](/docs/testing-environments.html).
- This guide uses React's [`act()`](/docs/act.html) testing helper.

### Rendering {#rendering}

Testing whether a component renders correctly for given props is a useful signal to the stability of a component. Consider a simple component that renders a message based on a prop.

```jsx
// hello.js
export default function Hello(props) {
  return props.name === undefined ? (
    <h1>Hello, {props.name}!</h1>
  ) : (
    <span>Hey, stranger</span>
  );
}
```

We can write a test for this component:

```jsx
// hello.test.js
import Hello from "./hello";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div')
  // attach the container to document so events works correctly
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  container.remove();
  container = null  
})

it("renders with or without a name", () => {
  act(() => {
    render(<Hello />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    render(<Hello name="Sophie" />, container);
  });
  expect(container.textContent).toBe("Hello Sophie!");

  act(() => {
    render(<Hello name="Flarnie" />, container);
  });
  expect(container.textContent).toBe("Hello Flarnie!");
});
```

### Data fetching {#data-fetching}

Instead of calling real APIs in all your tests, you can mock requests with dummy data. Mocking data fetching with 'fake' data prevents flaky tests due to an unavailable backend, and makes them run faster. Note: you may still want to run a subset of tests using an "end-to-end" framework that tells whether the whole app is working together.

```jsx
// user.js
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

```jsx
import User from "./user";
import { render } from "react-dom";
import { act } from "react-dom/test-utils";

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  container.remove();
  container = null  
})

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

  // Use the asynchronous version of act to flush resolved promises
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

```jsx
// contact.test.js
import React from "react";
import { render } from "react-dom";
import Contact from "./contact";
import MockedMap from "./map";

jest.mock("./map", () => jest.fn(() => "DummyMap"));

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  container.remove();
  container = null  
})

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
function Toggle(props) {
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

```jsx
// toggle.test.js
import React from "react";
import { render } from "react-dom";
import Toggle from "./toggle";

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  container.remove();
  container = null  
})

it("changes value when clicked", () => {
  // a counter to track clicks
  let clicks = 0;
  act(() => {
    render(<Toggle initial={true} onChange={() => clicks++} />, container);
  });
  // get a hold of the button element, and trigger some clicks on it
  const button = document.querySelector("[data-testid=toggle]");
  expect(button.innerText).toBe("Turn on!");
  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  expect(clicks).toBe(1);
  expect(button.innerText).toBe("Turn off!");
  act(() => {
    for (let i = 0; i < 5; i++) {
      button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  });
  expect(clicks).toBe(6);
  expect(button.innerText).toBe("Turn on!");
});
```

### Timers {#timers}

UIs could use timer based functions like `setTimeout` to run time sensitive code. In this example, a multiple choice panel waits for a selection and advances, timing out if a selection isn't made in 5 seconds.

```jsx
function Card(props) {
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

We can write tests for this component by leveraging jest's timer mocks, and testing the different states it can be in.

```jsx
// card.test.js
jest.useFakeTimers();

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  container.remove();
  container = null  
})

function render(ui){
  act(() => {
    ReactDOM.render(ui, container);
  });
}

it("should select null after timing out", () => {
  const yields = [];
  render(<Card onSelect={selection => yields.push(selection)} />);
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(yields).toBe([]);
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(yields).toBe([null]);
});

it("should cleanup on being removed", () => {
  const yields = [];
  render(
    <Card onSelect={selection => yields.push(selection)} />
  );
  act(() => {
    jest.advanceTimersByTime(100);
  });
  expect(yields).toBe([]);
  act(() => {
    render(null);
  });
  act(() => {
    jest.advanceTimersByTime(1000);
  });
  expect(yields).toBe([]);
});

it("should accept selections", () => {
  const yields = [];
  render(
    <Card onSelect={selection => yields.push(selection)} />
  );

  act(() => {
    container
      .querySelector("[data-test-id=2]")
      .dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(yields).toBe([2]);
});
```

### Snapshot testing {#snapshot-testing}

Frameworks like Jest also let you save 'snapshots' of data. Combined with react-test-renderer, we can save component structures, and verify they don't break in the future. It's typically better to make more specific assertions than to use snapshots (or at least ensure that the snapshot is small) because these kinds of tests include implementation details meaning they break easily and teams can get desensitized to snapshot breakages.

```jsx
// hello.test.js, again
import Hello from "./hello";
import { create, act } from "react-test-renderer";

// a helper to convert a React component tree to json
function toJSON(element) {
  let root;
  act(() => {
    root = create(element);
  });
  return root.toJSON();
}

it("should preserve it's structure", () => {
  expect(toJSON(<Hello />)).toMatchSnapshot();
  expect(toJSON(<Hello name="Sophie" />)).toMatchSnapshot();
  expect(toJSON(<Hello name="Flarnie" />)).toMatchSnapshot();
});
```

- [Jest snapshots](https://jestjs.io/docs/en/snapshot-testing)
- [`react-test-renderer`](https://reactjs.org/docs/test-renderer.html)
