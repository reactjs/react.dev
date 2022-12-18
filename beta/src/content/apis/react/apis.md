---
title: "react: APIs"
---

<Intro>

In addition to [Hooks](/apis/react) and [Components](/apis/react/components), the `react` package exports a few other APIs that are useful for defining components. This page lists all the remaining modern React APIs.

</Intro>

<InlineToc />

---

## React APIs {/*react-apis*/}

* [`createContext`](/apis/react/createContext) lets you define and provide context to the child components. Used with [`useContext`.](/apis/react/useContext)
* [`forwardRef`](/apis/react/forwardRef) lets your component expose a DOM node as a ref to the parent. Used with [`useRef`.](/apis/react/useRef)
* [`lazy`](/apis/react/lazy) lets you defer loading a component's code until it's rendered for the first time.
* [`memo`](/apis/react/memo) lets your component skip re-renders with same props. Used with [`useMemo`](/apis/react/useMemo) and [`useCallback`.](/apis/react/useCallback)
* [`startTransition`](/apis/react/startTransition) lets you mark a state update as non-urgent. Similar to [`useTransition`.](/apis/react/useTransition)
