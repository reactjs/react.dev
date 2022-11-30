---
title: "react: Other APIs"
---

<Intro>

In addition to [Hooks,](/apis/react) the `react` package exports a few components and other APIs that are useful for defining components. This page lists all the modern React APIs that are not Hooks.

</Intro>

<InlineToc />

---

## Built-in React components {/*built-in-react-components*/}

React exposes a few built-in components that you can use in your JSX.

* [`<Fragment>`](/apis/react/Fragment), alternatively written as `<>...</>`, lets you group multiple JSX nodes together.
* [`<Suspense>`](/apis/react/Suspense) lets you display a fallback while the child components are loading.
* [`<StrictMode>`](/apis/react/StrictMode) enables extra development-only checks that help you find bugs early.

---

## Other React APIs {/*other-react-apis*/}

* [`createContext`](/apis/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/apis/react/useContext)
* [`forwardRef`](/apis/react/forwardRef) lets your component expose a DOM node as a ref to the parent. Used with [`useRef`.](/apis/react/useRef)
* [`lazy`](/apis/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/apis/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/apis/react/useMemo) and [`useCallback`.](/apis/react/useCallback)
* [`startTransition`](/apis/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/apis/react/useTransition)
