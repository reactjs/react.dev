---
id: web-components
title: Web Components
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React and [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) are built to solve different problems.  Web Components provide strong encapsulation for reusable components, while React provides a declarative library that keeps the DOM in sync with your data. The two goals are complementary. As a developer, you are free to use React in your Web Components, or to use Web Components in React, or both.

Most people who use React don't use Web Components, but you may want to, especially if you are using third-party UI components that are written using Web Components.

## Using Web Components in React {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> Note:
>
> Web Components often expose an imperative API. For instance, a `video` Web Component might expose `play()` and `pause()` functions. To access the imperative APIs of a Web Component, you will need to use a ref to interact with the DOM node directly. If you are using third-party Web Components, the best solution is to write a React component that behaves as a wrapper for your Web Component.
>
> Events emitted by a Web Component may not properly propagate through a React render tree.
> You will need to manually attach event handlers to handle these events within your React components.

One common confusion is that Web Components use "class" instead of "className".

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

## Using React in your Web Components {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    const root = ReactDOM.createRoot(mountPoint);
    root.render(<a href={url}>{name}</a>);
  }
}
customElements.define('x-search', XSearch);
```

>Note:
>
>This code **will not** work if you transform classes with Babel. See [this issue](https://github.com/w3c/webcomponents/issues/587) for the discussion.
>Include the [custom-elements-es5-adapter](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs#custom-elements-es5-adapterjs) before you load your web components to fix this issue.

## Additional toolchains and resources {#additional-toolchains-and-resources}

Given some of the fundamental differences between React and Web Components, using them together usually doesn't come without some tweaking and tuning in order to align React's Virtual DOM and Web Component's Shadow DOM.  
There exists various resources available to make this process a little easier.  

### Direflow {#direflow}

[Direflow](https://direflow.io/) is a new project that provides a toolchain for using React together with Web Components and attempts to solve all major issues with integrating the two technologies.  
Direflow is based on [Create React App](https://create-react-app.dev/docs/getting-started/) and the setup will feel very familiar.
  
### ReactShadow {#reactshadow}

[ReactShadow](https://github.com/Wildhoney/ReactShadow#readme) is a module that offers to utilize Shadow DOM in React with all the benefits of style encapsulation.  
ReactShadow also handles a common problem with React and Web Components; event propagation through the Shadow DOM.  

### react-shadow-dom-retarget-events {#react-shadow-dom-retarget-events}

[react-shadow-dom-retarget-events](https://github.com/spring-media/react-shadow-dom-retarget-events#readme) is a module that specifically handles the issue with event propagation when events are triggered from within a Shadow DOM inside a React app.  
