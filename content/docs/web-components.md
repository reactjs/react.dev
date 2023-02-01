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

Web components are just custom (HTML) elements which can be used directly in React:

```javascript
function Dropdown(props) {
  return <my-dropdown></my-dropdown>;
};
```

> Note:
>
> Web Components often expose an imperative API. For instance, a `video` Web Component might expose `play()` and `pause()` functions. To access the imperative APIs of a Web Component, you will need to use a ref to interact with the DOM node directly. If you are using third-party Web Components, the best solution is to write a React component that behaves as a wrapper for your Web Component.
>
> Events emitted by a Web Component may not properly propagate through a React render tree.
> You will need to manually attach event handlers to handle these events within your React components.

It's possible to pass primitive JavaScript data types directly as attributes. However, in case of arrays and objects (or other complex data structures), make sure to pass them in JSON format if you want to use them as attributes. As alternative, it's also possible to pass information as properties by defining them on the element instance. Last but not least, functions should be registered as event listeners. Events emitted by a Web Component may not properly propagate through a React render tree. You will need to manually attach event handlers to handle these events within your React components.

```javascript
function Dropdown({ label, option, options, onChange }) {
  const ref = React.useRef();
  
  React.useLayoutEffect(() => {
    const { current } = ref;

    const handleChange = customEvent => onChange(customEvent.detail);

    current.addEventListener('onChange', handleChange);

    return () => current.removeEventListener('onChange', handleChange);
  }, [onChange]);
  
  return (
    <my-dropdown
      ref={ref}
      label={label}
      option={option}
      options={JSON.stringify(options)}
    />
  );
};
```

Check out this tutorial [about using Web Components in React](https://www.robinwieruch.de/react-web-components/), if you want to dig deeper. 

There exists a custom React hook, called [use-custom-element](https://github.com/the-road-to-learn-react/use-custom-element), which takes care about all the event listener registration, unregistration, and serialization of arrays/objects into JSON. It doesn't serialize Date or Immutable data structures though. Any contributions to this custom React hook are welcome.

```javascript
import useCustomElement from 'use-custom-element';

const Dropdown = props => {
  const [customElementProps, ref] = useCustomElement(props);
  
  return <my-dropdown {...customElementProps} ref={ref} />;
};
```

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
