---
id: render-props
title: Render Props
permalink: docs/render-props.html
---

**Before:**

```js
<OtherComponent>
  <h1>Hello World</h1>
</OtherComponent>
```

**After:**

```js
<OtherComponent render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```

### Replacing a Higher-Order Component with a render prop

**Before:**

```js
function WithTarget(Component) {
  return class WrappedComponent extends React.Component {
    static contextTypes = {
      target: PropTypes.string.isRequired,
    };

    render() {
      return (
        <Component {...this.props} target={this.context.target}/>
      );
    }
  }
}

const Hello = WithTarget(props => (
  <h1>Hello {props.target}</h1>
));
```

**After:**

```js
class TargetProvider extends React.Component {
  static contextTypes = {
    target: PropTypes.string.isRequired,
  };

  render() {
    return this.props.render({ target: this.context.target });
  }
}

const Hello = props => (
  <TargetProvider render={data => (
    <h1>Hello {props.target}</h1>
  )}/>
);
```
