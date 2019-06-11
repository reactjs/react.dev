---
id: faq-ajax
title: AJAX and APIs
permalink: docs/faq-ajax.html
layout: docs
category: FAQ
---

### How can I make an AJAX call? {#how-can-i-make-an-ajax-call}

You can use any AJAX library you like with React. Some popular ones are [Axios](https://github.com/axios/axios), [jQuery AJAX](https://api.jquery.com/jQuery.ajax/), and the browser built-in [window.fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

## Using Hooks {#using-hooks}

Since React 16.8 we can use state and other React features without writing a class.
We can use the [`useEffect`](/docs/hooks-effect.html) hook to perform side effects (like fetching over http) in function components. We can then handle the component state with
the [`useState`](/docs/hooks-state.html) hook.

The example below uses hooks to fetch a todo from a [placeholder api endpoint](https://jsonplaceholder.typicode.com/), and update the UI based on the response. It's important we pass the `url` in as a dependency to `useEffect` to ensure it is called _only_ when the url updates.

An example of a response from this endpoint looks like this:

```js
// Example response from https://jsonplaceholder.typicode.com/todos/1

{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
```

```jsx
export function Todo() {
  const url = 'https://jsonplaceholder.typicode.com/todos/1';

  const [todo, setTodo] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(res => {
        setTodo(res);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [url]); // Note we're passing url in as a dependency to useEffect

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>My todo: {todo.title}</h1>
      <span>Completed: {todo.completed ? 'Yes' : 'No'}</span>
    </div>
  );
}
```

## Using Class Components {#using-class-components}

### Where in the component lifecycle should I make an AJAX call? {#where-in-the-component-lifecycle-should-i-make-an-ajax-call}

You should populate data with AJAX calls in the [`componentDidMount`](/docs/react-component.html#mounting) lifecycle method. This is so you can use `setState` to update your component when the data is retrieved.

### Example: Using AJAX results to set local state {#example-using-ajax-results-to-set-local-state}

The component below demonstrates how to make an AJAX call in `componentDidMount` to populate local component state.

The example API returns a JSON object like this:

```
{
  "items": [
    { "id": 1, "name": "Apples",  "price": "$2" },
    { "id": 2, "name": "Peaches", "price": "$5" }
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
      items: [],
    };
  }

  componentDidMount() {
    fetch('https://api.example.com/items')
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            items: result.items,
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
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
