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
