---
title: React.PureComponent
---

<Wip>

This section is incomplete, please see the old docs for [React.PureComponent](https://reactjs.org/docs/react-api.html#reactpurecomponent).

</Wip>


<Intro>

React.PureComponent is similar to React.Component. The difference between them is that React.Component doesn’t implement shouldComponentUpdate(), but React.PureComponent implements it with a shallow prop and state comparison.

If your React component’s render() function renders the same result given the same props and state, you can use React.PureComponent for a performance boost in some cases.

```js
class Welcome extends React.PureComponent {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

</Intro>

<InlineToc />
