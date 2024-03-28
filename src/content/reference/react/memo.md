---
title: memo
---

<Intro>

`memo` lets you skip re-rendering a Component when its props are unchanged.

```
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `memo(Component, arePropsEqual?)` {/*memo*/}

Wrap a Component in `memo` to get a *memoized* version of that Component. This memoized version of your Component will usually not be re-rendered when its parent Component is re-rendered as long as its props have not changed. But React may still re-render it: memoization is a performance optimization, not a guarantee.

```js
import { memo } from 'react';

const SomeComponent = memo(function SomeComponent(props) {
  // ...
});
```

[See more examples below.](#usage)

#### Parameters {/*parameters*/}

* `Component`: The Component that you want to memoize. The `memo` does not modify this Component, but returns a new, memoized Component instead. Any valid React Component, including functions and [`forwardRef`](/reference/react/forwardRef) Components, is accepted.

* **optional** `arePropsEqual`: A function that accepts two arguments: the Component's previous props, and its new props. It should return `true` if the old and new props are equal: that is, if the Component will render the same output and behave in the same way with the new props as with the old. Otherwise it should return `false`. Usually, you will not specify this function. By default, React will compare each prop with [`Object.is`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

#### Returns {/*returns*/}

`memo` returns a new React Component. It behaves the same as the Component provided to `memo` except that React will not always re-render it when its parent is being re-rendered unless its props have changed.

---

## Usage {/*usage*/}

### Skipping re-rendering when props are unchanged {/*skipping-re-rendering-when-props-are-unchanged*/}

React normally re-renders a Component whenever its parent re-renders. With `memo`, you can create a Component that React will not re-render when its parent re-renders so long as its new props are the same as the old props. Such a Component is said to be *memoized*.

To memoize a Component, wrap it in `memo` and use the value that it returns in place of your original Component:

```js
const Greeting = memo(function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
});

export default Greeting;
```

A React Component should always have [pure rendering logic.](/learn/keeping-components-pure) This means that it must return the same output if its props, state, and context haven't changed. By using `memo`, you are telling React that your Component complies with this requirement, so React doesn't need to re-render as long as its props haven't changed. Even with `memo`, your Component will re-render if its own state changes or if a context that it's using changes.

In this example, notice that the `Greeting` Component re-renders whenever `name` is changed (because that's one of its props), but not when `address` is changed (because it's not passed to `Greeting` as a prop):

<Sandpack>

```js
import { memo, useState } from 'react';

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

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
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

<Note>

**You should only rely on `memo` as a performance optimization.** If your code doesn't work without it, find the underlying problem and fix it first. Then you may add `memo` to improve performance.

</Note>

<DeepDive>

#### Should you add memo everywhere? {/*should-you-add-memo-everywhere*/}

If your app is like this site, and most interactions are coarse (like replacing a page or an entire section), memoization is usually unnecessary. On the other hand, if your app is more like a drawing editor, and most interactions are granular (like moving shapes), then you might find memoization very helpful. 

Optimizing with `memo`  is only valuable when your Component re-renders often with the same exact props, and its re-rendering logic is expensive. If there is no perceptible lag when your Component re-renders, `memo` is unnecessary. Keep in mind that `memo` is completely useless if the props passed to your Component are *always different,* such as if you pass an object or a plain function defined during rendering. This is why you will often need [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) and [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) together with `memo`.

There is no benefit to wrapping a Component in `memo` in other cases. There is no significant harm to doing that either, so some teams choose to not think about individual cases, and memoize as much as possible. The downside of this approach is that code becomes less readable. Also, not all memoization is effective: a single value that's "always new" is enough to break memoization for an entire Component.

**In practice, you can make a lot of memoization unnecessary by following a few principles:**

1. When a Component visually wraps other Components, let it [accept JSX as children.](/learn/passing-props-to-a-component#passing-jsx-as-children) This way, when the wrapper Component updates its own state, React knows that its children don't need to re-render.
1. Prefer local state and don't [lift state up](/learn/sharing-state-between-components) any further than necessary. For example, don't keep transient state like forms and whether an item is hovered at the top of your tree or in a global state library.
1. Keep your [rendering logic pure.](/learn/keeping-components-pure) If re-rendering a Component causes a problem or produces some noticeable visual artifact, it's a bug in your Component! Fix the bug instead of adding memoization.
1. Avoid [unnecessary Effects that update state.](/learn/you-might-not-need-an-effect) Most performance problems in React apps are caused by chains of updates originating from Effects that cause your Components to render over and over.
1. Try to [remove unnecessary dependencies from your Effects.](/learn/removing-effect-dependencies) For example, instead of memoization, it's often simpler to move some object or a function inside an Effect or outside the Component.

If a specific interaction still feels laggy, [use the React Developer Tools profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) to see which Components would benefit the most from memoization, and add memoization where needed. These principles make your Components easier to debug and understand, so it's good to follow them in any case. In the long term, we're researching [doing granular memoization automatically](https://www.youtube.com/watch?v=lGEMwh32soc) to solve this once and for all.

</DeepDive>

---

### Updating a memoized Component using state {/*updating-a-memoized-component-using-state*/}

Even when a Component is memoized, it will still re-render when its own state changes. Memoization only has to do with props that are passed to the Component from its parent.

<Sandpack>

```js
import { memo, useState } from 'react';

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

const Greeting = memo(function Greeting({ name }) {
  console.log('Greeting was rendered at', new Date().toLocaleTimeString());
  const [greeting, setGreeting] = useState('Hello');
  return (
    <>
      <h3>{greeting}{name && ', '}{name}!</h3>
      <GreetingSelector value={greeting} onChange={setGreeting} />
    </>
  );
});

function GreetingSelector({ value, onChange }) {
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

If you set a state variable to its current value, React will skip re-rendering your Component even without `memo`. You may still see your Component function being called an extra time, but the result will be discarded.

---

### Updating a memoized Component using a context {/*updating-a-memoized-component-using-a-context*/}

Even when a Component is memoized, it will still re-render when a context that it's using changes. Memoization only has to do with props that are passed to the Component from its parent.

<Sandpack>

```js
import { createContext, memo, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('dark');

  function handleClick() {
    setTheme(theme === 'dark' ? 'light' : 'dark'); 
  }

  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={handleClick}>
        Switch theme
      </button>
      <Greeting name="Taylor" />
    </ThemeContext.Provider>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  const theme = useContext(ThemeContext);
  return (
    <h3 className={theme}>Hello, {name}!</h3>
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

To make your Component re-render only when a _part_ of some context changes, split your Component in two. Read what you need from the context in the outer Component, and pass it down to a memoized child as a prop.

---

### Minimizing props changes {/*minimizing-props-changes*/}

When you use `memo`, your Component re-renders whenever any prop is not *shallowly equal* to what it was previously. This means that React compares every prop in your Component with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. Note that `Object.is(3, 3)` is `true`, but `Object.is({}, {})` is `false`.


To get the most out of `memo`, minimize the times that the props change. For example, if the prop is an object, prevent the parent Component from re-creating that object every time by using [`useMemo`:](/reference/react/useMemo)

```js {5-8}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

A better way to minimize props changes is to make sure the Component accepts the minimum necessary information in its props. For example, it could accept individual values instead of a whole object:

```js {4,7}
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```

Even individual values can sometimes be projected to ones that change less frequently. For example, here a Component accepts a boolean indicating the presence of a value rather than the value itself:

```js {3}
function GroupsLanding({ person }) {
  const hasGroups = person.groups !== null;
  return <CallToAction hasGroups={hasGroups} />;
}

const CallToAction = memo(function CallToAction({ hasGroups }) {
  // ...
});
```

When you need to pass a function to memoized Component, either declare it outside your Component so that it never changes, or [`useCallback`](/reference/react/useCallback#skipping-re-rendering-of-components) to cache its definition between re-renders.

---

### Specifying a custom comparison function {/*specifying-a-custom-comparison-function*/}

In rare cases it may be infeasible to minimize the props changes of a memoized Component. In that case, you can provide a custom comparison function, which React will use to compare the old and new props instead of using shallow equality. This function is passed as a second argument to `memo`. It should return `true` only if the new props would result in the same output as the old props; otherwise it should return `false`.

```js {3}
const Chart = memo(function Chart({ dataPoints }) {
  // ...
}, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.dataPoints.length === newProps.dataPoints.length &&
    oldProps.dataPoints.every((oldPoint, index) => {
      const newPoint = newProps.dataPoints[index];
      return oldPoint.x === newPoint.x && oldPoint.y === newPoint.y;
    })
  );
}
```

If you do this, use the Performance panel in your browser developer tools to make sure that your comparison function is actually faster than re-rendering the Component. You might be surprised.

When you do performance measurements, make sure that React is running in the production mode.

<Pitfall>

If you provide a custom `arePropsEqual` implementation, **you must compare every prop, including functions.** Functions often [close over](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) the props and state of parent Components. If you return `true` when `oldProps.onClick !== newProps.onClick`, your Component will keep "seeing" the props and state from a previous render inside its `onClick` handler, leading to very confusing bugs.

Avoid doing deep equality checks inside `arePropsEqual` unless you are 100% sure that the data structure you're working with has a known limited depth. **Deep equality checks can become incredibly slow** and can freeze your app for many seconds if someone changes the data structure later.

</Pitfall>

---

## Troubleshooting {/*troubleshooting*/}
### My Component re-renders when a prop is an object, array, or function {/*my-component-rerenders-when-a-prop-is-an-object-or-array*/}

React compares old and new props by shallow equality: that is, it considers whether each new prop is reference-equal to the old prop. If you create a new object or array each time the parent is re-rendered, even if the individual elements are each the same, React will still consider it to be changed. Similarly, if you create a new function when rendering the parent Component, React will consider it to have changed even if the function has the same definition. To avoid this, [simplify props or memoize props in the parent Component](#minimizing-props-changes).
