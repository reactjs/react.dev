---
title: React.memo
---

<Intro>

`memo` lets you avoid re-rendering a component when its props are unchanged.

```
export default memo(function Button({title}) {
  return <button>{title}</button>
});
```

</Intro>

- [Usage](#usage)
  - [Avoiding re-rendering when props are unchanged](#avoiding-rerendering-when-props-are-unchanged)
  - [Updating a memoized component using state](#updating-a-memoized-component-using-state)
  - [Updating a memoized component using a context](#updating-a-memoized-component-using-state)
  - [Minimizing props changes](#minimizng-props-changes)
  - [Specifying a custom comparison function](#specifying-a-custom-comparison-function)
- [Reference](#reference)
- [Troubleshooting](#troubleshooting)
  - [My component re-renders when a prop is an object or array](#my-component-rerenders-when-a-prop-is-an-object-or-array)
  - [My component re-renders when a prop is a function](#my-component-rerenders-when-a-prop-is-a-function)

---

## Usage {/*usage*/}

### Avoiding re-rendering when props are unchanged {/*avoiding-rerendering-when-props-are-unchanged*/}

React normally re-renders a component whenever its parent re-renders. With `memo`, you can create a component that React will not re-render when its parent re-renders so long as its new props are the same as the old props. Such a component is said to be *memoized*.

`memo` is a function: you use it by wrapping your component in a call to `memo` and using the value that it returns in place of your original component:

```
export default memo(function Greeting({name}) {
  return <>Hello, {name}!</>;
});
```

A React component should always render the same output if its props, state, and context haven't changed. By using `memo`, you are telling React that your component complies with this requirement, so React doesn't need to re-render as long as none of those things have changed. When you use `memo`, your component will still re-render if its own state changes or if a context that it's using changes.

<Gotcha>

Use `memo` only as a performance optimization, not to guarantee that a re-render
will not happen. React may choose to re-render anyway in some situations, such as to save
memory when a component is off-screen.

</Gotcha>


In this example, notice that the `Greeting` component re-renders whenever `name` is changed (because that's one of its props), but not when `address` is changed (because it's not a prop):

<Sandpack>

```js
import { memo, useEffect, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({name}) {
  useEffect(() => {
    console.log("Greeting was rendered");
  });
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

### Updating a memoized component using state {/*updating-a-memoized-component-using-state*/}

Even when a component is memoized, it will still re-render when its own state changes. Memoization only has to do with props that are passed to the component from its parent.

<Sandpack>

```js
import { memo, useEffect, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({name}) {
  useEffect(() => {
    console.log("Greeting was rendered");
  });
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({value, onChange}) {
  return (
    <>
      <label>
        <input
          type="radio"
          checked={value === 'Hello'}
          onChange={e => onChange('Hello')}
        />
        Regular greeting
      </label>
      <label>
        <input
          type="radio"
          checked={value === 'Hello and welcome'}
          onChange={e => onChange('Hello and welcome')}
        />
        Enthusiastic greeting
      </label>
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

### Updating a memoized component using a context {/*updating-a-memoized-component-using-state*/}

Even when a component is memoized, it will still re-render when a context that it's using changes. Memoization only has to do with props that are passed to the component from its parent.

<Sandpack>

```js
import { createContext, memo, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </button>
      <Greeting name={name} />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({name}) {
  useEffect(() => {
    console.log("Greeting was rendered");
  });
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello!</h3>
  );
});
```

```css
label {
  display: block;
  margin-bottom: 16px;
}

.light {
  color: black;
  background-color: white;
}

.dark {
  color: white;
  background-color: black;
}
```
</Sandpack>

### Minimizing props changes {/*minimizng-props-changes*/}

When you use `memo`, your component re-renders whenever any prop is not shallow-equal to what it was previously. To get the most out of `memo`, minimize the times that the props change. For example, if the prop is an object, prevent the parent component from re-creating that object every time by using `useMemo`:

```
function ParentComponent() {
  const [name, setName] = useState(...);
  const [age, setAge] = useState(...);

  const person = useMemo(
    () => ({name, age}),
    [name, age]
  );

  return <PersonProfile person={person} />;
}

const PersonProfile = memo(function PersonProfile({person}) {
  ...
});
```

Another way to minimize props changes is to make sure the component accepts the minimum necessary information in its props. For example, it could accept individual values instead of a whole object. Even individual values can sometimes be projected to ones that change less frequently — for example, here a component accepts a boolean indicating the presence of a value rather than the value itself:

```
function ParentComponent({person}) {
  const hasGroups = person.groups != null;
  return <JoinAGroupCallToAction hasGroups={hasGroups} />;
}

const JoinAGroupCallToAction = memo(function JoinAGroupCallToAction({hasGroups}) {
  ...
});
```

### Specifying a custom comparison function {/*specifying-a-custom-comparison-function*/}

In rare cases it may be infeasible to minimize the props changes of a memoized component. In that case, you can provide a custom comparison function, which React will use to compare the old and new props instead of using shallow equality. This function is passed as a second argument to `memo`. It should return `true` only if the new props would result in the same output as the old props; otherwise it should return `false`.

```
function arePropsEqual(oldProps, newProps) {
  return oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    });
}

const ScatterChart = memo(
  function ScatterChart({dataPoints}) {
    ...
  },
  arePropsEqual,
);
```

If you do this, use the [React Profiler](/learn/react-developer-tools) to make sure that your comparison function is actually faster than re-rendering the component. You might be surprised.

---

## Reference {/*reference*/}

### `memo(component, [arePropsEqual])` {/*memo*/}

Call `memo` outside of any components to define a memoized version of a component. This memoized component will usually not be re-rendered when its component is re-rendered as long as its props have not changed. But React may still re-render it: memoization is only a performance optimization, not a semantic guarantee.

```js
import { memo } from 'react';

function SomeComponent(props) {
  ...
}

const MemoizedComponent = memo(SomeComponent);
```

#### Parameters {/*parameters*/}

* `component`: The component that you want to memoize. The `memo` does not modify this component, but returns a new, memoized component instead. The component must be a function, not a class.

* **optional** `arePropsEqual`: A function that accepts two arguments: the component's previous props, and its new props. It should return `true` if the old and new props are equal: that is, if the component will render the same output and behave in the same way with the new props as with the old. Otherwise it should return `false`.

#### Returns {/*returns*/}

`memo` returns a new React component. It behaves the same as the component provided to `memo` except that React will not always re-render it when its parent is being re-rendered unless its props have changed.

---

## Troubleshooting {/*troubleshooting*/}
### My component re-renders when a prop is an object, array, or function {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React compares old and new props by shallow equality: that is, it considers whether each new prop is reference-equal to the old prop. If you create a new object or array each time the parent is re-rendered, even if the individual elements are each the same, React will still consider it to be changed. Similarly, if you create a new function when rendering the parent component, React will consider it to changed even if the function has the same definition.  Avoid this by [simplifying props or memoizing props in the parent component](#minimizng-props-changes).
