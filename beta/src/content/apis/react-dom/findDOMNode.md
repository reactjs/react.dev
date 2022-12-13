---
title: findDOMNode
---

<Deprecated>

`findDOMNode` is an escape hatch used to access the underlying DOM node. In most cases, use of this escape hatch is discouraged because it pierces the component abstraction.

This API has been deprecated in Strict Mode.

</Deprecated>

<Intro>

`findDOMNode` finds the native browser DOM element for a React node.

```
findDOMNode(component)
```

This API has many flaws and should be avoided in new code. See [Manipulating the DOM with Refs](/learn/manipulating-the-dom-with-refs) instead.

</Intro>

<InlineToc />

## Usage {/*usage*/}

### Manipulate browser DOM elements {/*some-usage*/}

`findDOMNode` should be avoided in new code. In older versions of React, it was common to use `findDOMNode` to look up a native DOM element and do something with it. In this example, we use `findDOMNode` to look up the browser DOM input element and focus it:

<Sandpack>

```js
import { useRef, Component } from 'react';
import {findDOMNode} from 'react-dom';

class Form extends Component {
  handleClick = () => {
    // Warning: This is a hidden bug!
    // If this component is refactored,
    // this might break!
    findDOMNode(this).focus();
  }
  
  render() {
    return (
      <>
        <input />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}

export default Form;
```

</Sandpack>

To understand why `findDOMNode` is deprecated, let's make a small change to this component.

Inside of `render`, let move the `button` to be first, and the `input` second:

<Sandpack>

```js
import { useRef, Component } from 'react';
import {findDOMNode} from 'react-dom';

class Form extends Component {
  handleClick = () => {
    // Warning: This is a hidden bug!
    // If this component is refactored,
    // this might break!
    findDOMNode(this).focus();
  }
  
  render() {
    return (
      <>
        <button onClick={this.handleClick}>
          Focus the input
        </button>
        <input />
      </>
    );
  }
}

export default Form;
```

</Sandpack>

This small change has broken our button and the `focus` doesn't work!

This bug is because `findDOMNode` only returns the first child, but with the use of Fragments, our component renders multiple DOM nodes. When we switched the order, the `button` became the first element, and the element `findDOMNode` returned changed.

`findDOMNode` creates a refactoring hazard where you can’t change the implementation details of a component because a parent might be reaching into its DOM node. `findDOMNode` is also only a one time read API. If a child component renders a different node, there is no way to handle this change. Therefore, `findDOMNode` only works if components always return a single DOM node that never changes.

For these reasons, `findDOMNode` has been deprecated in Strict Mode and will be removed in a future version.

For a better way to manipulate DOM elements, see [Manipulating the DOM with Refs](/learn/manipulating-the-dom-with-refs).

## Reference {/*reference*/}

### `findDOMNode(component)` {/*finddomnode*/}

<Deprecated>

This API will be removed in a future major version of React.

</Deprecated>

Call `findDOMNode` to find the native browser DOM element for a given React node.

```js
const node = findDOMNode(Component);
```

[See examples above.](#usage)

#### Parameters {/*parameters*/}

* `component`: A *React node* that you want to find.


#### Returns {/*returns*/}

`findDOMNode` returns the corresponding native browser DOM element. When a component renders to `null`, or renders `false`, `findDOMNode` returns `null`. When a component renders to a string, `findDOMNode` returns a text DOM node containing that value.

#### Caveats {/*caveats*/}

* As of React 16, a component may return a fragment with multiple children, in which case `findDOMNode` will return the DOM node corresponding to the first non-empty child.

* `findDOMNode` only works on mounted components (that is, components that have been placed in the DOM). If you try to call this on a component that has not been mounted yet (like calling `findDOMNode()` in `render()` on a component that has yet to be created) an exception will be thrown.

* `findDOMNode` is a one time read API. If a child component renders a different node, there is no way to handle this change.

* `findDOMNode` cannot be used on function components.
