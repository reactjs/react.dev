---
title: immutability
---

<Intro>

Validates against mutating props, state, and other values that [are immutable](/reference/rules/components-and-hooks-must-be-pure#props-and-state-are-immutable).

</Intro>

## Rule Details {/*rule-details*/}

A component’s props and state are immutable snapshots. Never mutate them directly. Instead, pass new props down, and use the setter function from `useState`.

## Common Violations {/*common-violations*/}

### Invalid {/*invalid*/}

```js
// ❌ Object property assignment
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    user.name = 'Bob'; // Mutating!
    setUser(user); // Same reference
  };
}
```

<Note>

The rule reports mutations it can prove, such as assigning to a property of a value from props or state. It does not infer the types of state values, so it cannot tell that a method call like `items.push(4)` or `items.sort()` mutates an array, and it does not report those calls yet. They still mutate state and are bugs, so create a new array instead, as shown below.

</Note>

### Valid {/*valid*/}

```js
// ✅ Create new array
function Component() {
  const [items, setItems] = useState([1, 2, 3]);

  const addItem = () => {
    setItems([...items, 4]); // New array
  };
}

// ✅ Sort a copy
function Component() {
  const [items, setItems] = useState([3, 1, 2]);

  const sortItems = () => {
    setItems([...items].sort()); // Sorts the copy, not the state
  };
}

// ✅ Create new object
function Component() {
  const [user, setUser] = useState({name: 'Alice'});

  const updateName = () => {
    setUser({...user, name: 'Bob'}); // New object
  };
}
```

## Troubleshooting {/*troubleshooting*/}

### I need to add items to an array {/*add-items-array*/}

Mutating arrays with methods like `push()` won't trigger re-renders. The linter doesn't currently report these method calls on state, so you need to catch them yourself:

```js
// ❌ Wrong: Mutating the array
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    todos.push({id, text});
    setTodos(todos); // Same array reference!
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

Create a new array instead:

```js
// ✅ Better: Create a new array
function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (id, text) => {
    setTodos([...todos, {id, text}]);
    // Or: setTodos(todos => [...todos, {id: Date.now(), text}])
  };

  return (
    <ul>
      {todos.map(todo => <li key={todo.id}>{todo.text}</li>)}
    </ul>
  );
}
```

### I need to update nested objects {/*update-nested-objects*/}

Mutating nested properties doesn't trigger re-renders:

```js
// ❌ Wrong: Mutating nested object
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    user.settings.theme = 'dark'; // Mutation!
    setUser(user); // Same object reference
  };
}
```

Spread at each level that needs updating:

```js
// ✅ Better: Create new objects at each level
function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice',
    settings: {
      theme: 'light',
      notifications: true
    }
  });

  const toggleTheme = () => {
    setUser({
      ...user,
      settings: {
        ...user.settings,
        theme: 'dark'
      }
    });
  };
}
```