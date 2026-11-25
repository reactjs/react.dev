---
title: React Developer Tools
---

<Intro>

React Developer Tools is a powerful browser extension that helps you inspect React components, edit props and state, and identify performance issues. This guide provides practical, step-by-step examples to debug common React challenges, making it easier to build robust applications.

</Intro>

<YouWillLearn>

* How to install React Developer Tools
* How to debug component issues step-by-step
* How to identify and fix performance bottlenecks
* How to debug state updates and effects
* How to track down error sources effectively

</YouWillLearn>

## Browser Extension {/*browser-extension*/}

The easiest way to debug React websites is to install the React Developer Tools browser extension, available for:

* [Install for **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Install for **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Install for **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

When you visit a React-built website, you'll see the _Components_ and _Profiler_ tabs in your browser's developer tools.

![React Developer Tools extension](/images/docs/react-devtools-extension.png)

## Safari and Other Browsers {/*safari-and-other-browsers*/}

For browsers like Safari, install the [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm package:

```bash
# Yarn
yarn global add react-devtools

# npm
npm install -g react-devtools
```

Open the developer tools from the terminal:

```bash
react-devtools
```

Add this `<script>` tag to your website's `<head>`:

```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Reload your website to view it in the developer tools.

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## Mobile (React Native) {/*mobile-react-native*/}

For React Native apps, use [React Native DevTools](https://reactnative.dev/docs/react-native-devtools), which integrates React Developer Tools for native element highlighting and debugging. Features mirror the browser extension.

[Learn more about debugging in React Native.](https://reactnative.dev/docs/debugging)

> For React Native versions before 0.76, follow the [Safari and other browsers](#safari-and-other-browsers) guide.

## Common Debugging Scenarios {/*common-debugging-scenarios*/}

React Developer Tools is most effective when used systematically. Below are practical examples to debug common issues, with step-by-step instructions and code snippets.

### Debugging Unexpected Re-Renders {/*debugging-unexpected-re-renders*/}

**Scenario**: Your app feels sluggish due to components re-rendering unnecessarily, impacting performance.

**Steps to Debug:**

1. Open React Developer Tools and select the **Profiler** tab.
2. Click the record button (🔴) to start profiling.
3. Interact with your app (e.g., click buttons, type in inputs) to trigger re-renders.
4. Stop recording and review the flame graph, where wider bars indicate longer render times and multiple bars show frequent re-renders.
5. Click a component to see the "Why did this render?" section, identifying causes like prop or state changes.
6. Check if parent components are causing unnecessary child re-renders.

**Common Causes:**

* New object/array references created on every render.
* Missing memoization for props or functions.
* Unnecessary state updates.

**Solution:**
Consider this example where a child component re-renders unnecessarily:

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const data = { value: 'test' }; // New object every render
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Child data={data} />
    </div>
  );
}

function Child({ data }) {
  return <div>{data.value}</div>;
}
```

Clicking "Increment" causes Parent to re-render, creating a new data object, which triggers Child to re-render.

**Fix:**
Use `useMemo` to stabilize the data reference:

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  const data = useMemo(() => ({ value: 'test' }), []); // Stable reference
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <Child data={data} />
    </div>
  );
}
```

Now, Child only re-renders if data changes. Use the Profiler to confirm reduced render counts.

### Debugging State Updates That Don't Work {/*debugging-state-updates*/}

**Scenario**: Clicking a button doesn't update the UI as expected, despite state changes.

**Steps to Debug:**

1. Open the **Components** tab in React Developer Tools.
2. Select the component in the tree and inspect its state values.
3. Trigger the action (e.g., button click) and watch if state updates in real-time.
4. If state doesn't change, check the event handler logic.
5. If state changes but the UI doesn't update, verify JSX rendering logic.

**Common Causes:**

* Mutating state directly instead of using setState.
* Incorrect state dependencies or conditional rendering.

**Solution:**
Consider this faulty component:

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => {
    count += 1; // Incorrect: mutates state directly
  };
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

The UI doesn't update because count is mutated directly.

**Fix:**
Use `setCount`:

```jsx
const increment = () => {
  setCount(prevCount => prevCount + 1); // Correct: triggers re-render
};
```

Use DevTools to confirm count updates in the Components tab.

### Debugging useEffect Issues {/*debugging-useeffect-issues*/}

**Scenario**: An effect runs too often or not at all, causing performance issues or missing updates.

**Steps to Debug:**

1. Add a `console.log` inside your `useEffect` to track when it runs:

```jsx
useEffect(() => {
  console.log('Effect ran with:', { dep1, dep2 });
}, [dep1, dep2]);
```

2. Open the **Components** tab and select the component.
3. Inspect the hooks section to view dependency values.
4. Check if dependencies are stable or changing unnecessarily.

**Common Causes:**

* Missing dependencies in the array, causing stale data.
* Unstable references (e.g., objects created on every render).

**Solution:**
Consider this problematic effect:

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []); // Missing userId dependency
}
```

The effect doesn't run when userId changes, leading to outdated data.

**Fix:**
Add userId to the dependency array:

```jsx
useEffect(() => {
  fetchUser(userId).then(setUser);
}, [userId]);
```

Use DevTools to verify the effect runs only when userId changes.

### Debugging Component Errors {/*debugging-component-errors*/}

**Scenario**: A component throws an error, causing the app to crash or display incorrect data.

**Steps to Debug:**

1. Wrap components with an Error Boundary to catch errors:

```jsx
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.log('Error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <h1>Error: {this.state.error?.message}</h1>;
    }
    return this.props.children;
  }
}
```

2. Open the **Components** tab and select the failing component.
3. Check props and state for null/undefined values or incorrect types.
4. Use the browser console's stack trace to trace the error source.

**Example:**
This component crashes if user is null:

```jsx
function UserProfile({ user }) {
  return <div>{user.name}</div>;
}
```

**Fix:**
Add a null check:

```jsx
function UserProfile({ user }) {
  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

DevTools highlights the error in the component tree, helping you pinpoint the issue.

## Performance Debugging {/*performance-debugging*/}

The Profiler tab is key for identifying performance bottlenecks.

### Reading the Flame Graph {/*reading-the-flame-graph*/}

* **Height**: Indicates component nesting depth.
* **Width**: Shows render time (wider = slower).
* **Color Intensity**: Darker colors mean slower renders.
* **Gray Components**: Didn't re-render (optimal).

### Common Performance Issues {/*common-performance-issues*/}

**Scenario**: Scrolling a large list is slow.

**Steps to Debug:**

1. Start profiling in the Profiler tab.
2. Scroll through the list to reproduce the issue.
3. Stop profiling and analyze the flame graph for slow components.
4. Check for large lists or expensive calculations.

**Example:**
This renders all items, causing lag:

```jsx
function ProductList({ products }) {
  return (
    <div>
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
```

**Solution:**
Use react-window for virtualization:

```jsx
import { FixedSizeList as List } from 'react-window';

function ProductList({ products }) {
  return (
    <List height={600} itemCount={products.length} itemSize={120}>
      {({ index, style }) => (
        <div style={style}>
          <ProductCard product={products[index]} />
        </div>
      )}
    </List>
  );
}
```

Install react-window:

```bash
npm install react-window
```

The Profiler confirms reduced render times for visible items only.

## Advanced Debugging Techniques {/*advanced-debugging-techniques*/}

* **Console API**: Select a component in DevTools, then type `$r` in the console to inspect props (`$r.props`) or state (`$r.state` for class components).
* **Select in Editor**: Right-click a component in DevTools to jump to its source code in your IDE (if supported).
* **Time Travel**: Use DevTools to revert state changes and see how the UI responds, useful for debugging state transitions.

## Troubleshooting DevTools Issues {/*troubleshooting-devtools-issues*/}

* **DevTools Not Appearing**: Ensure React 16.0+ is used, check for multiple React versions (`npm ls react`), and verify development mode.
* **Poor Performance**: Disable profiling when not needed, collapse large component trees, or filter components using the search box.
* **Missing Component Names**: Use named components or set displayName:

```jsx
const HelloComponent = () => <div>Hello</div>;
HelloComponent.displayName = 'HelloComponent';
export default HelloComponent;
```

This enhanced documentation equips you with practical tools to debug and optimize React applications effectively.
