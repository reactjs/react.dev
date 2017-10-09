---
id: faq-ajax
title: AJAX and APIs
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### How can I make an AJAX call?

You can use an AJAX library you like with React. Some popular ones are [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/), and the browser built-in [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

### Where in the component lifecycle should I make an AJAX call?

You should populate data with AJAX calls in the [`componentDidMount`](https://reactjs.org/docs/react-component.html#mounting) lifecycle method. This is so you can use `setState` to update your component when the data is retrieved.

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
    super(props)
    this.state = {
      isLoaded: false,
      error: null,
      items: [],
    }
  }
  
  componentDidMount() {
    fetch('https://api.example.com/items')
      .then(res => res.json())
      .then(result => this.setState({items: result.items))
      .catch(err => this.setState({ err: error }))
  }
  
  render() {
    const {error, items} = this.state
    if (err) return <div>{error}</div>
    return (
      <ul>
        { items.map(item => <li>{item.name} {item.price}</li> }
      </ul>
    )
  }
}
```
