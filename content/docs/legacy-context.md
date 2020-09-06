---
id: legacy-context
title: Legacy Context
permalink: docs/legacy-context.html
---

> Note:
>
> The legacy context API will be removed in a future major version.
> Use the [new context API](/docs/context.html) introduced with version 16.3.
> The legacy API will continue working for all 16.x releases.

## How To Use Context {#how-to-use-context}

> This section documents a legacy API. See the [new API](/docs/context.html).

Suppose you have a structure like:

```javascript
class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.props.color}}>
        {this.props.children}
      </button>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button color={this.props.color}>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const color = "purple";
    const children = this.props.messages.map((message) =>
      <Message text={message.text} color={color} />
    );
    return <div>{children}</div>;
  }
}
```

In this example, we manually thread through a `color` prop in order to style the `Button` and `Message` components appropriately. Using context, we can pass this through the tree automatically:

```javascript{6,13-15,21,28-30,40-42}
import PropTypes from 'prop-types';

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  color: PropTypes.string
};

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }

  render() {
    const children = this.props.messages.map((message) =>
      <Message text={message.text} />
    );
    return <div>{children}</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string
};
```

By adding `childContextTypes` and `getChildContext` to `MessageList` (the context provider), React passes the information down automatically and any component in the subtree (in this case, `Button`) can access it by defining `contextTypes`.

If `contextTypes` is not defined, then `context` will be an empty object.

> Note:
>
> `React.PropTypes` has moved into a different package since React v15.5. Please use [the `prop-types` library instead](https://www.npmjs.com/package/prop-types) to define `contextTypes`.
>
> We provide [a codemod script](/blog/2017/04/07/react-v15.5.0.html#migrating-from-react.proptypes) to automate the conversion.

### Parent-Child Coupling {#parent-child-coupling}

> This section documents a legacy API. See the [new API](/docs/context.html).

Context can also let you build an API where parents and children communicate. For example, one library that works this way is [React Router V4](https://reacttraining.com/react-router):

```javascript
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);
```

By passing down some information from the `Router` component, each `Link` and `Route` can communicate back to the containing `Router`.

Before you build components with an API similar to this, consider if there are cleaner alternatives. For example, you can pass entire React components as props if you'd like to.

### Referencing Context in Lifecycle Methods {#referencing-context-in-lifecycle-methods}

> This section documents a legacy API. See the [new API](/docs/context.html).

If `contextTypes` is defined within a component, the following [lifecycle methods](/docs/react-component.html#the-component-lifecycle) will receive an additional parameter, the `context` object:

- [`constructor(props, context)`](/docs/react-component.html#constructor)
- [`componentWillReceiveProps(nextProps, nextContext)`](/docs/react-component.html#componentwillreceiveprops)
- [`shouldComponentUpdate(nextProps, nextState, nextContext)`](/docs/react-component.html#shouldcomponentupdate)
- [`componentWillUpdate(nextProps, nextState, nextContext)`](/docs/react-component.html#componentwillupdate)

> Note:
>
> As of React 16, `componentDidUpdate` no longer receives `prevContext`.

### Referencing Context in Function Components {#referencing-context-in-stateless-function-components}

> This section documents a legacy API. See the [new API](/docs/context.html).

Function components are also able to reference `context` if `contextTypes` is defined as a property of the function. The following code shows a `Button` component written as a function component.

```javascript
import PropTypes from 'prop-types';

const Button = ({children}, context) =>
  <button style={{background: context.color}}>
    {children}
  </button>;

Button.contextTypes = {color: PropTypes.string};
```

### Updating Context {#updating-context}

> This section documents a legacy API. See the [new API](/docs/context.html).

Don't do it.

React has an API to update context, but it is fundamentally broken and you should not use it.

The `getChildContext` function will be called when the state or props changes. In order to update data in the context, trigger a local state update with `this.setState`. This will trigger a new context and changes will be received by the children.

```javascript
import PropTypes from 'prop-types';

class MediaQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type:'desktop'};
  }

  getChildContext() {
    return {type: this.state.type};
  }

  componentDidMount() {
    const checkMediaQuery = () => {
      const type = window.matchMedia("(min-width: 1025px)").matches ? 'desktop' : 'mobile';
      if (type !== this.state.type) {
        this.setState({type});
      }
    };

    window.addEventListener('resize', checkMediaQuery);
    checkMediaQuery();
  }

  render() {
    return this.props.children;
  }
}

MediaQuery.childContextTypes = {
  type: PropTypes.string
};
```

The problem is, if a context value provided by component changes, descendants that use that value won't update if an intermediate parent returns `false` from `shouldComponentUpdate`. This is totally out of control of the components using context, so there's basically no way to reliably update the context. [This blog post](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076) has a good explanation of why this is a problem and how you might get around it.
