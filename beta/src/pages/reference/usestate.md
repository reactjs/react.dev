---
title: useState()
---

<Intro>

`useState` is a React Hook that lets a component "remember" some information (called [state](/learn/state-a-components-memory)). It returns two values: the current state, and the function you can use to update it.

```js
const [state, setState] = useState(initialState);
```

</Intro>

## Using state {/*using-state*/}

You can add state to your component in three steps:

<APIAnatomy>

<AnatomyStep title="Declare a state variable">

Call `useState` and pass the initial state to it. React will store the state that you passed, and give it back to you.

</AnatomyStep>

<AnatomyStep title="Update state on interaction">

To change it, call the state setter function with the next state value. React will put that value into state instead.

</AnatomyStep>

<AnatomyStep title="Render state in the UI">

Use the state for rendering by [putting it into the JSX](/learn/javascript-in-jsx-with-curly-braces).

</AnatomyStep>

```js [[1, 4, "const [count, setCount] = useState(0);"], [2, 7, "setCount(count + 1);"], [3, 12, "count"]]
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</APIAnatomy>

[State is a component's memory](/learn/state-a-components-memory). A state variable lets you hold some information that **changes over time and is specific to your component**. Here, `count` holds the number of clicks. However, you can keep any JavaScript value in state--for example, the current input text, the selected gallery image, or the contents of a shopping cart.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<br />

## Declaring a state variable {/*declaring-a-state-variable*/}

You can declare multiple state variables in a component. You must declare them **at the top level of your component,** outside of any conditions or loops. This component declares state variables called `name` and `age`:

<APIAnatomy>

<AnatomyStep title="Current state">

You get the latest state value for your JSX.

</AnatomyStep>

<AnatomyStep title="State setter">

You get the function that lets you update the state.

</AnatomyStep>

<AnatomyStep title="Initial state">

You pass the value you want the state to be initially.

</AnatomyStep>

```js [[1, 4, "name"], [2, 4, "setName"], [3, 4, "'Taylor'"], [1, 6, "age"], [2, 6, "setAge"], [3, 6, "28"]]
import { useState } from 'react';

function Form() {
  const [name, setName] = useState('Taylor');

  const [age, setAge] = useState(28);

  // ...
```

</APIAnatomy>

This allows your component to "remember" multiple independent things--for example, different form fields.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(28);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Happy birthday!
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

</Sandpack>

The `[` and `]` syntax here is called [array destructuring](/learn/a-javascript-refresher#array-destructuring) and it lets you read values from an array. The array returned by `useState` always has exactly two items--it's a pair. By convention, name them like `[thing, setThing]`.

<Gotcha>

Calling `setState` [only affects the next render](/learn/state-as-a-snapshot) and **does not change state in the already running code:**

```js {4}
function handleClick() {
  console.log(count);  // 0
  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!
}
```

</Gotcha>

<br />

## When not to use it {/*when-not-to-use-it*/}

* Don't use state when a regular variable works. State is only used to [persist information between re-renders](/learn/state-a-components-memory).
* Don't add [redundant state](/learn/choosing-the-state-structure#avoid-redundant-state). If you can calculate something during render, you don't need state for it.

<br />

## Updating objects and arrays in state {/*updating-objects-and-arrays-in-state*/}

You can hold objects and arrays in state, too. However, you should always *replace* objects in state rather than modify the existing ones. [Updating objects](/learn/updating-objects-in-state) and [updating arrays](/learn/updating-arrays-in-state) describe common patterns that help avoid bugs.

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<br />

<Recipes>

### Image gallery {/*image-gallery*/}

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  let hasPrev = index > 0;
  let hasNext = index < sculptureList.length - 1;

  function handlePrevClick() {
    if (hasPrev) {
      setIndex(index - 1);
    }
  }

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button
        onClick={handlePrevClick}
        disabled={!hasPrev}
      >
        Previous
      </button>
      <button
        onClick={handleNextClick}
        disabled={!hasNext}
      >
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js data.js hidden
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

<Solution />

### Form with multiple fields {/*form-with-multiple-fields*/}

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

### Todo list {/*todo-list*/}

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskBoard() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

### Multiple selection {/*multiple-selection*/}

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [
    selectedIds,
    setSelectedIds
  ] = useState(new Set());

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Create a copy (to avoid mutation).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <ul>
      {letters.map(letter => (
        <Letter
          key={letter.id}
          letter={letter}
          isSelected={
            selectedIds.has(letter.id)
          }
          onToggle={handleToggle}
        />
      ))}
      <hr />
      <p>
        <b>
          You selected {selectedCount} letters
        </b>
      </p>
    </ul>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'How are you?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Your taxes are due',
  isStarred: false,
}, {
  id: 2,
  subject: 'Reminder: dentist',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

<Solution />

</Recipes>

## Special cases {/*special-cases*/}

### Passing the same value to `setState` {/*passing-the-same-value-to-setstate*/}

If you pass the current state to `setState`, React **will skip re-rendering the component**:

```js
setCount(count); // Won't trigger a re-render
```

This is a performance optimization. React uses the [`Object.is()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) algorithm to compare the values.

<br />

### Passing an updater function to `setState` {/*passing-an-updater-function-to-setstate*/}

Instead of passing the next state itself, **you may pass a function to `setState`.** Such a function, like `c => c + 1` in this example, is called an "updater". React will call your updater during the next render to calculate the final state.

<APIAnatomy>

<AnatomyStep title="Setting state with next value">

Usually, when you set state, you replace it.

</AnatomyStep>

<AnatomyStep title="Setting state with an updater">

But you can pass an updater function to transform it.

</AnatomyStep>

```js [[1, 2, "123"], [2, 4, "c => c + 1"]]
function handleClick() {
  setCount(123);

  setCount(c => c + 1); // Result: 124
}
```

</APIAnatomy>

Your updater function will receive the pending state and should return the next state.

<APIAnatomy>

<AnatomyStep title="Pending state">

You get the latest state with the previously queued updates applied to it. For example, if `count` was `0` and you call `setCount(c => c + 1)` three times in a row, then the pending `c` state will be `0` in the first updater, `1` in the second one, and `2` in the third one, and `3` is the final state.

</AnatomyStep>

<AnatomyStep title="Next state">

You return the next state you want to see on the screen.

</AnatomyStep>

```js [[1, 3, "c", 0], [2, 3, "c + 1"], [1, 6, "c", 0], [2, 6, "c + 1"], [1, 9, "c", 0], [2, 9, "c + 1"]]
function handleClick() {
  // 0 => 1
  setCount(c => c + 1);

  // 1 => 2
  setCount(c => c + 1);

  // 2 => 3
  setCount(c => c + 1);
}
```

</APIAnatomy>

Updaters are a bit verbose but sometimes they come in handy. They let you access the pending state rather than the last rendered state. This is helpful if you want to [queue multiple updates](/learn/queueing-a-series-of-state-updates) on top of each other.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(c => c + 1);
    setCount(c => c + 1);
    setCount(c => c + 1);
  }

  return (
    <>
      <h1>{count}</h1>
      <button onClick={handleClick}>
        Add 3
      </button>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
h1 { display: inline-block; margin: 10px; width: 30px; text-align: center; }
```

</Sandpack>

Updater functions run during rendering. This is why [they should be pure functions](/learn/keeping-components-pure). In other words, your **updater functions should only calculate and return the next state**. They should not try to "do" things or set state.

If you don't have a particular reason to use an updater, you can stick with passing the next state directly.

<Gotcha>

You need to be careful when returning an object from an arrow function. This doesn't work:

```js
setForm(f => {
  name: f.name.toUpperCase()
});
```

This code doesn't work because JavaScript considers `=> {` to be a function body rather than a returned object. Since it is a function body, you have to write an explicit `return` statement:

```js
setForm(f => {
  return {
    name: f.name.toUpperCase()
  };
});
```

Alternatively, you have to add parentheses around your object:

```js
setForm(f => ({
  name: f.name.toUpperCase()
}));
```

This is an unfortunate language quirk of JavaScript, and is not specific to React.

</Gotcha>

<Gotcha>

Because `setState()` with a function argument has this special meaning, you can't put a function in state like this:

```js
setState(myFunction);
```

If you really need to put a function in state (which is rare), you can do this instead:

```js
setState(() => myFunction);
```

</Gotcha>

<br />

### Passing an initializer function to `useState` {/*passing-an-initializer-function-to-usestate*/}

The initial state that you pass to `useState` as an argument is only used for the initial render. For next renders, this argument is ignored. If creating the initial state is expensive, it is wasteful to create and throw it away many times. **You can pass a function to `useState` to calculate the initial state.** React will only run it during the initialization.


<APIAnatomy>

<AnatomyStep title="Initializing state with a value">

Most often, you will provide the initial state during render.

</AnatomyStep>

<AnatomyStep title="Initializing state with a function">

But you can also give React a function that calculates the initial state instead. React will only call that function when initializing the component, and won't call it again.

</AnatomyStep>

```js [[1, 2, "''"], [2, 5, "() => createInitialTodos()"]]
function TodoList() {
  const [text, setText] = useState('');

  const [todos, setTodos] = useState(
    () => createInitialTodos()
  );

  // ...
```

</APIAnatomy>

This is a performance optimization. You can use it to avoid creating large objects or arrays on re-renders.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item #' + i
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(
    () => createInitialTodos()
  );

  return (
    <ul>
      {todos.map(item => (
        <li key={item.id}>
          {item.text}
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Initializer functions run during rendering. This is why [they should be pure functions](/learn/keeping-components-pure). In other words, your **initializer functions should only calculate and return the initial state**. They should not try to "do" things or set state.

If you don't have a particular reason to use an initializer, you can stick with passing the initial state directly.
