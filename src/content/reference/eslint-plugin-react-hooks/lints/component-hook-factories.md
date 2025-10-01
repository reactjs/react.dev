---
title: component-hook-factories
---

<Intro>

Validates against higher order functions defining nested components or hooks. Components and hooks should be defined at the module level.

</Intro>

<Note>

This rule is available in `eslint-plugin-react-hooks` v6.

</Note>

## Rule Details {/*rule-details*/}

Defining components or hooks inside other functions creates new instances on every call. React treats each as a completely different component, destroying and recreating the entire component tree, losing all state, and causing performance problems.

### Invalid {/*invalid*/}

Examples of incorrect code for this rule:

```js {expectedErrors: {'react-compiler': [14]}}
// ❌ Factory function creating components
function createComponent(defaultValue) {
  return function Component() {
    // ...
  };
}

// ❌ Component defined inside component
function Parent() {
  function Child() {
    // ...
  }

  return <Child />;
}

// ❌ Hook factory function
function createCustomHook(endpoint) {
  return function useData() {
    // ...
  };
}
```

### Valid {/*valid*/}

Examples of correct code for this rule:

```js
// ✅ Component defined at module level
function Component({ defaultValue }) {
  // ...
}

// ✅ Custom hook at module level
function useData(endpoint) {
  // ...
}
```

## Troubleshooting {/*troubleshooting*/}

### I need dynamic component behavior {/*dynamic-behavior*/}

You might think you need a factory to create customized components:

```js
// ❌ Wrong: Factory pattern
function makeButton(color) {
  return function Button({children}) {
    return (
      <button style={{backgroundColor: color}}>
        {children}
      </button>
    );
  };
}

const RedButton = makeButton('red');
const BlueButton = makeButton('blue');
```

Pass [JSX as children](/learn/passing-props-to-a-component#passing-jsx-as-children) instead:

```js
// ✅ Better: Pass JSX as children
function Button({color, children}) {
  return (
    <button style={{backgroundColor: color}}>
      {children}
    </button>
  );
}

function App() {
  return (
    <>
      <Button color="red">Red</Button>
      <Button color="blue">Blue</Button>
    </>
  );
}
```
