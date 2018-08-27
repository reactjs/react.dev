---
id: faq-ajax
title: AJAX and APIs
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### How can I make an AJAX call?

You can use any AJAX library you like with React. Some popular ones are [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/), and the browser built-in [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

### Where in the component lifecycle should I make an AJAX call?

You should populate data with AJAX calls in the [`componentDidMount`](/docs/react-component.html#mounting) lifecycle method. This is so you can use `setState` to update your component when the data is retrieved.

### Example: Using AJAX results to set local state

The component below demonstrates how to make an AJAX call in `componentDidMount` to populate local component state. 

The example API returns a JSON object like this:

```
{
  items: [
    { id: 1, name: 'Apples', price: '$2' },
    { id: 2, name: 'Peaches', price: '$5' }
  ] 
}
```

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
    // Note: If the component unmounts before the AJAX call is complete
    // you may see a error like 'Can’t call setState (or forceUpdate) 
    // on an unmounted component.' To avoid this, we can abort any XHR request
    // in componentWillUnmount lifecycle
    // Read more on abort controller in AJAX calls
    // https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort 
    this.abortController = new window.AbortController();
    this.mySignal = this.abortController.signal;
  }

  componentDidMount() {
    fetch("https://api.example.com/items", { signal: this.mySignal })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            items: result.items
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          if (error.name === 'AbortError') {
            // If the AJAX request was aborted you can check that here
            console.log('Fetch aborted:', error.message);
          }
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  componentWillUnmount() {
    // When the component unmounts abort the AJAX request, to avoid
    // unnecessary memory leaks in your application.
    this.abortController.abort();
  }

  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <ul>
          {items.map(item => (
            <li key={item.name}>
              {item.name} {item.price}
            </li>
          ))}
        </ul>
      );
    }
  }
}
```
