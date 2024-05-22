---
title: act
---

<Intro>

To prepare a component for assertions, wrap the code rendering it and performing updates inside an act() call. This makes your test run closer to how React works in the browser.

</Intro>

<InlineToc />

---

When writing UI tests, tasks like rendering, user events, or data fetching can be considered as “units” of interaction with a user interface. React provides a helper called `act()` that makes sure all updates related to these “units” have been processed and applied to the DOM before you make any assertions.

The name `act` comes from the [Arrange-Act-Assert](https://wiki.c2.com/?ArrangeActAssert) pattern.

```js
act(() => {
  // render components
});
// make assertions
```

## Usage {/*usage*/}

<Note>
You might find using `act()` directly a bit too verbose. To avoid some of the boilerplate, you could use a library like [React Testing Library](https://testing-library.com/docs/react-testing-library/intro), whose helpers are wrapped with `act()`.
</Note>

For example, let’s say we have this `Counter` component:

```js
function Counter() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    setCount(prev => prev + 1);
  }

  useEffect(() => {
    document.title = `You clicked ${this.state.count} times`;
  }, [count]);

  return (
    <div>
      <p>You clicked {this.state.count} times</p>
      <button onClick={this.handleClick}>
        Click me
      </button>
    </div>
  )
}
```

Here is how we can test it:

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('can render and update a counter', () => {
  // Test first render and effect
  React.act(() => {
    ReactDOM.createRoot(container).render(<Counter />);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('You clicked 0 times');
  expect(document.title).toBe('You clicked 0 times');

  // Test second render and effect
  React.act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('You clicked 1 times');
  expect(document.title).toBe('You clicked 1 times');
});

```

<Pitfall>

Don’t forget that dispatching DOM events only works when the DOM container is added to the document. You can use a library like [React Testing Library](https://testing-library.com/docs/react-testing-library/intro) to reduce the boilerplate code.

</Pitfall>