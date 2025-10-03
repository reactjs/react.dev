---
title: static-components
version: rc
---

<Intro>

Validates that components are static, not recreated every render. Components that are recreated dynamically can reset state and trigger excessive re-rendering.

</Intro>

<Note>

This rule is available in `eslint-plugin-react-hooks` v6.

</Note>

## Rule Details {/*rule-details*/}

Components defined inside other components are recreated on every render. React sees each as a brand new component type, unmounting the old one and mounting the new one, destroying all state and DOM nodes in the process.

### Invalid {/*invalid*/}

Examples of incorrect code for this rule:

```js
// ❌ Component defined inside component
function Parent() {
  const ChildComponent = () => { // New component every render!
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  };

  return <ChildComponent />; // State resets every render
}

// ❌ Dynamic component creation
function Parent({type}) {
  const Component = type === 'button' 
    ? () => <button>Click</button>
    : () => <div>Text</div>;
  
  return <Component />;
}
```

### Valid {/*valid*/}

Examples of correct code for this rule:

```js
// ✅ Components at module level
const ButtonComponent = () => <button>Click</button>;
const TextComponent = () => <div>Text</div>;

function Parent({type}) {
  const Component = type === 'button' 
    ? ButtonComponent  // Reference existing component
    : TextComponent;
  
  return <Component />;
}
```

## Troubleshooting {/*troubleshooting*/}

### I need to render different components conditionally {/*conditional-components*/}

You might define components inside to access local state:

```js {expectedErrors: {'react-compiler': [13]}}
// ❌ Wrong: Inner component to access parent state
function Parent() {
  const [theme, setTheme] = useState('light');
  
  function ThemedButton() { // Recreated every render!
    return (
      <button className={theme}>
        Click me
      </button>
    );
  }
  
  return <ThemedButton />;
}
```

Pass data as props instead:

```js
// ✅ Better: Pass props to static component
function ThemedButton({theme}) {
  return (
    <button className={theme}>
      Click me
    </button>
  );
}

function Parent() {
  const [theme, setTheme] = useState('light');
  return <ThemedButton theme={theme} />;
}
```

<Note>

If you find yourself wanting to define components inside other components to access local variables, that's a sign you should be passing props instead. This makes components more reusable and testable.

</Note>