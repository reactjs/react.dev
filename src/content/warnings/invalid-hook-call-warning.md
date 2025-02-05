---
title: Rules of Hooks
---

You are probably here because you got the following error message:

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component.

</ConsoleBlock>

There are three common reasons you might be seeing it:

1. You might be **breaking the Rules of Hooks**.
2. You might have **mismatching versions** of React and React DOM.
3. You might have **more than one copy of React** in the same app.

Let's look at each of these cases.

## Breaking Rules of Hooks {/*breaking-rules-of-hooks*/}

Functions whose names start with `use` are called [*Hooks*](/reference/react) in React.

**Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function, before any early returns. You can only call Hooks while React is rendering a function component:

* ✅ Call them at the top level in the body of a [function component](/learn/your-first-component).
* ✅ Call them at the top level in the body of a [custom Hook](/learn/reusing-logic-with-custom-hooks).

```js{2-3,8-9}
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

It’s **not** supported to call Hooks (functions starting with `use`) in any other cases, for example:

* 🔴 Do not call Hooks inside conditions or loops.
* 🔴 Do not call Hooks after a conditional `return` statement.
* 🔴 Do not call Hooks in event handlers.
* 🔴 Do not call Hooks in class components.
* 🔴 Do not call Hooks inside functions passed to `useMemo`, `useReducer`, or `useEffect`.

If you break these rules, you might see this error.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
    useEffect(() => {})
    // ...
  }
}
```

You can use the [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to catch these mistakes.

<Note>

[Custom Hooks](/learn/reusing-logic-with-custom-hooks) *may* call other Hooks (that's their whole purpose). This works because custom Hooks are also supposed to only be called while a function component is rendering.

</Note>

## Mismatching Versions of React and React DOM {/*mismatching-versions-of-react-and-react-dom*/}

You might be using a version of `react-dom` (< 16.8.0) or `react-native` (< 0.59) that doesn't yet support Hooks. You can run `npm ls react-dom` or `npm ls react-native` in your application folder to check which version you're using. If you find more than one of them, this might also create problems (more on that below).

## Duplicate React {/*duplicate-react*/}

In order for Hooks to work, the `react` import from your application code needs to resolve to the same module as the `react` import from inside the `react-dom` package.

If these `react` imports resolve to two different exports objects, you will see this warning. This may happen if you **accidentally end up with two copies** of the `react` package.

If you use Node for package management, you can run this check in your project folder:

<TerminalBlock>

npm ls react

</TerminalBlock>

If you see more than one React, you'll need to figure out why this happens and fix your dependency tree. For example, maybe a library you're using incorrectly specifies `react` as a dependency (rather than a peer dependency). Until that library is fixed, [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) is one possible workaround.

You can also try to debug this problem by adding some logs and restarting your development server:

```js
// Add this in node_modules/react-dom/index.js
window.React1 = require('react');

// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

If it prints `false` then you might have two Reacts and need to figure out why that happened. [This issue](https://github.com/facebook/react/issues/13991) includes some common reasons encountered by the community.

This problem can also come up when you use `npm link` or an equivalent. In that case, your bundler might "see" two Reacts — one in application folder and one in your library folder. Assuming `myapp` and `mylib` are sibling folders, one possible fix is to run `npm link ../myapp/node_modules/react` from `mylib`. This should make the library use the application's React copy.

<Note>

In general, React supports using multiple independent copies on one page (for example, if an app and a third-party widget both use it). It only breaks if `require('react')` resolves differently between the component and the `react-dom` copy it was rendered with.

</Note>

## Other Causes {/*other-causes*/}

If none of this worked, please comment in [this issue](https://github.com/facebook/react/issues/13991) and we'll try to help. Try to create a small reproducing example — you might discover the problem as you're doing it.
