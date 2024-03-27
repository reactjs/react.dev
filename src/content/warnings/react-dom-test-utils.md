---
title: react-dom/test-utils Deprecation Warnings
---

## ReactDOMTestUtils.act() warning {/*reactdomtestutilsact-warning*/}

`act` from `react-dom/test-utils` has been deprecated in favor of `act` from `react`:

```diff
-import {act} from 'react-dom/test-utils';
+import {act} from 'react';
```

## Rest of ReactDOMTestUtils APIS {/*rest-of-reactdomtestutils-apis*/}

All APIs except `act` have been removed.

The React Team recommends migrating your tests to [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) for a modern and well supported testing experience.

### ReactDOMTestUtils.renderIntoDocument {/*reactdomtestutilsrenderintodocument*/}

`renderIntoDocument` can be replaced with `render` from `@testing-library/react`:

```diff
-import {renderIntoDocument} from 'react-dom/test-utils';
+import {render} from '@testing-library/react';

-renderIntoDocument(<Component />);
+render(<Component />);
```

### ReactDOMTestUtils.Simulate {/*reactdomtestutilssimulate*/}

`Simulate` can be replaced with `fireEvent` from `@testing-library/react`.

```diff
-import {Simulate} from 'react-dom/test-utils';
+import {fireEvent} from '@testing-library/react';

const element = document.querySelector('button');
-Simulate.click(element);
+fireEvent.click(element);
```

Be aware, that `fireEvent` dispatches an actual event on the element and doesn't just synthetically call the event handler.

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
