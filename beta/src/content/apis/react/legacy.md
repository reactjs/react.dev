---
title: "react: Legacy APIs"
---

<Intro>

These APIs are exported from the `react` package, but they are not recommended for use in the newly written code. See the linked individual API pages for the suggested alternatives.

</Intro>

<InlineToc />

---

## Legacy React APIs {/*legacy-react-apis*/}

* [`Children`](/apis/react/Children) lets you manipulate and transform the JSX received as the `children` prop. [See alternatives.](/apis/react/Children#alternatives)
* [`cloneElement`](/apis/react/cloneElement) lets you create a React element using another element as a starting point. [See alternatives.](/apis/react/cloneElement#alternatives)
* [`Component`](/apis/react/Component) lets you define a React component as a JavaScript class. [See alternatives.](/apis/react/Component#alternatives)
* [`createElement`](/apis/react/createElement) lets you create a React element. Typically, you'll use JSX instead.
* [`createRef`](/apis/react/createRef) creates a ref object which can contain arbitrary value. [See alternatives.](/apis/react/createRef#alternatives)
* [`isValidElement`](/apis/react/isValidElement) checks whether a value is a React element. Typically used with [`cloneElement`.](/apis/react/cloneElement)
* [`PureComponent`](/apis/react/PureComponent) is similar to [`Component`,](/apis/react/Component) but it skip re-renders with same props. [See alternatives.](/apis/react/PureComponent#alternatives)


---

## Deprecated React APIs {/*deprecated-react-apis*/}

<Deprecated>

This API will be removed in a future major version of React.

</Deprecated>

* [`createFactory`](/apis/react/createFactory) lets you create a function that produces React elements of a certain type.