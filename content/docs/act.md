---
id: act
title: act
permalink: docs/act.html
---

`act()` provides an abstraction to make sure what's rendered reflects a state where pending actions have been 'committed' and the DOM has been updated. When writing UI tests, tasks like rendering, user events, or data fetching can be considered as 'units' of interaction with a user interface. `act` allows you be sure all effects related to a unit have been processed before asserting on the result.

Note: The name `act` comes from the `act` section of the [arrange-act-assert pattern](http://wiki.c2.com/?ArrangeActAssert). 

For example:

```jsx
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import App from "./app";

it("should render content", () => {
  const container = document.createElement("div");
  act(() => {
    render(<App />, container);
  });
  // ... make assertions about the UI
});
```

### Guarantees {#guarantees}

`act()` provides some guarantees when it's run.

- It batches updates triggered inside its scope, and applies them all in one go.
- It flushes any queued effects and updates.
- When nested, the work is flushed only on exiting the outermost `act()`.
- The asynchronous version of `act()` also flushes any resolved promises.

These guarantees ensure that tests can assert on a 'stable' state of the UI without missing any updates.

### Warnings {#warnings}

When running tests with jest, React triggers warnings for test code that should be wrapped with `act()`.

- Code that triggers a Hook-based state update.
- In strict mode, code that triggers an Effect Hook.

If you are seeing these warnings, it's possible that your test will is making assertions on an unreliable state of the UI, before it's had a chance to stabilise. Wrapping the test code that triggers these conditions with `act()` will avoid this problem and silence the warnings.

### Asynchronous Testing {#asynchronous-testing}

When working with asynchronous code, an async version of `act()` can be used to flush resolved promises and write assertions on asynchronous updates.

```jsx
import {act} from 'react-dom/test-utils'
import App from './app'
it('flushes microtasks', () => {
  await act(async () => {
    render(<App/>, document.createElement('div'))
  }) // guarantees that all resolved promises will be flushed after this call
})
```

### Nested `act()`s {#nested-acts}

When `act()` calls are nested, React will flush queued work on exiting the outermost `act()` call. This lets you compose sequences of UI changes, guaranteeing that they'll still be batched together as one. For example, consider a helper function that dispatches clicks on elements.

```jsx
function click(element) {
  act(() => {
    element.dispatchEvent(
      new MouseEvent("click", { bubbles: true })
    );
  });
}
```

You could use this in tests:

```jsx
// ...
click(element);
// then assert on the side effects of the click
// ...
```

However, if we need to batch multiple clicks as one 'unit', we can wrap them with another `act()` call.

```jsx
act(() => {
  click(element);
  click(element);
  click(element);
}); // guarantees that updates will be batched and run as one unit
```

### Multiple renderers {#multiple-renderers}

In rare cases, you may be running a test on a component that uses multiple renderers. For example, you may be running snapshot tests on a component with `react-test-renderer`, that uses `ReactDOM.render` inside a child component to render some content. In this scenario, you can wrap updates with `act()`s corresponding to their renderers.

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
