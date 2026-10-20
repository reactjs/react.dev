---
title: react-dom/test-utils Deprecation Warnings
---

## ReactDOMTestUtils.act() warning {/*reactdomtestutilsact-warning*/}

`act` from `react-dom/test-utils` has been deprecated in favor of `act` from `react`.

Before:

```js
import {act} from 'react-dom/test-utils';
```

After:

```js
import {act} from 'react';
```

## Rest of ReactDOMTestUtils APIS {/*rest-of-reactdomtestutils-apis*/}

All APIs except `act` have been removed.

The React Team recommends migrating your tests to [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) for a modern and well supported testing experience.

### ReactDOMTestUtils.renderIntoDocument {/*reactdomtestutilsrenderintodocument*/}

`renderIntoDocument` can be replaced with `render` from `@testing-library/react`.
Unlike `renderIntoDocument`, `render` gives you access to the rendered container and explicit cleanup APIs.

Before:

```js
import {renderIntoDocument} from 'react-dom/test-utils';

renderIntoDocument(<Component />);
```

After:

```js
import {render} from '@testing-library/react';

render(<Component />);
```

`renderIntoDocument` rendered into a detached DOM node and returned the component instance instead of the container.
This made it difficult to inspect the rendered output or reliably clean it up after a test.
`render` returns helpers for the rendered tree, including `unmount`, and React Testing Library also provides `cleanup` to remove any trees mounted with `render` between tests.

```js
import {render} from '@testing-library/react';

test('renders a component', () => {
  const {unmount} = render(<Component />);

  // ...assertions...

  unmount();
});
```

### ReactDOMTestUtils.Simulate {/*reactdomtestutilssimulate*/}

`Simulate` can be replaced with `fireEvent` from `@testing-library/react`.

Before:

```js
import {Simulate} from 'react-dom/test-utils';

const element = document.querySelector('button');
Simulate.click(element);
```

After:

```js
import {fireEvent} from '@testing-library/react';

const element = document.querySelector('button');
fireEvent.click(element);
```

Be aware that `fireEvent` dispatches an actual event on the element and doesn't just synthetically call the event handler.

### List of all removed APIs {/*list-of-all-removed-apis-list-of-all-removed-apis*/}

- `mockComponent()`
- `isElement()`
- `isElementOfType()`
- `isDOMComponent()`
- `isCompositeComponent()`
- `isCompositeComponentWithType()`
- `findAllInRenderedTree()`
- `scryRenderedDOMComponentsWithClass()`
- `findRenderedDOMComponentWithClass()`
- `scryRenderedDOMComponentsWithTag()`
- `findRenderedDOMComponentWithTag()`
- `scryRenderedComponentsWithType()`
- `findRenderedComponentWithType()`
- `renderIntoDocument`
- `Simulate`
