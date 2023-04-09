---
title: Extracting State Logic into a Reducer
translatedTitle: State로직을 Reducer로 추출하기
translators: [이승효, 고석영, 안예지]
---

<Intro>

Components with many state updates spread across many event handlers can get overwhelming. For these cases, you can consolidate all the state update logic outside your component in a single function, called a _reducer_.
<Trans>여러 개의 state 업데이트가 여러 이벤트 핸들러에 분산되어 있는 컴포넌트는 과부하가 걸릴 수 있습니다. 이러한 경우, _reducer_ 라고 하는 단일 함수를 통해 컴포넌트 외부의 모든 state 업데이트 로직을 통합할 수 있습니다.</Trans>

</Intro>

<YouWillLearn>

- What a reducer function is
- How to refactor `useState` to `useReducer`
- When to use a reducer
- How to write one well

<TransBlock>
- reducer 함수란 무엇인가
- `useState`를 `useReducer`로 리팩토링 하는 방법
- reducer를 사용해야 하는 경우
- reducer를 잘 작성하는 방법
</TransBlock>

</YouWillLearn>

## Consolidate state logic with a reducer<Trans>reducer로 state 로직 통합하기</Trans> {/*consolidate-state-logic-with-a-reducer*/}

As your components grow in complexity, it can get harder to see at a glance all the different ways in which a component's state gets updated. For example, the `TaskApp` component below holds an array of `tasks` in state and uses three different event handlers to add, remove, and edit tasks:
<Trans>컴포넌트가 복잡해지면 컴포넌트의 state가 업데이트되는 다양한 경우를 한눈에 파악하기 어려워질 수 있습니다. 예를 들어 아래의 `TaskApp` 컴포넌트는 state에 `tasks` 배열을 보유하고 있으며, 세 가지의 이벤트 핸들러를 사용하여 task를 추가, 제거 및 수정합니다:</Trans>

<Sandpack>

```js App.js
import {useState} from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Each of its event handlers calls `setTasks` in order to update the state. As this component grows, so does the amount of state logic sprinkled throughout it. To reduce this complexity and keep all your logic in one easy-to-access place, you can move that state logic into a single function outside your component, **called a "reducer".**
<Trans>각 이벤트 핸들러는 state를 업데이트하기 위해 `setTasks`를 호출합니다. 컴포넌트가 커질수록 여기저기 흩어져 있는 state 로직의 양도 늘어납니다. 복잡성을 줄이고 모든 로직을 접근하기 쉽게 한 곳에 모으려면, state 로직을 컴포넌트 외부의 **reducer라고 하는** 단일 함수로 옮길 수 있습니다.</Trans>

Reducers are a different way to handle state. You can migrate from `useState` to `useReducer` in three steps:
<Trans>Reducer는 state를 관리하는 다른 방법입니다. `useState`에서 `useReducer`로 마이그레이션하는 방법은 세 단계로 진행됩니다:</Trans>

1. **Move** from setting state to dispatching actions.
2. **Write** a reducer function.
3. **Use** the reducer from your component.

<TransBlock>
  1. state를 설정하는 것에서 action들을 전달하는 것으로 **변경**하기
  2. reducer 함수 **작성**하기
  3. 컴포넌트에서 reducer **사용**하기
</TransBlock>

### Step 1: Move from setting state to dispatching actions<Trans>state 설정을 action들의 전달로 바꾸기</Trans> {/*step-1-move-from-setting-state-to-dispatching-actions*/}

Your event handlers currently specify _what to do_ by setting state:
<Trans>현재 이벤트 핸들러는 state를 설정하여 _수행할 작업_ 을 지정하고 있습니다:</Trans>

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

Remove all the state setting logic. What you are left with are three event handlers:
<Trans>모든 state 설정 로직을 제거합니다. 이제 세 개의 이벤트 핸들러만 남았습니다:</Trans>

- `handleAddTask(text)` is called when the user presses "Add".
- `handleChangeTask(task)` is called when the user toggles a task or presses "Save".
- `handleDeleteTask(taskId)` is called when the user presses "Delete".

<TransBlock>
  - 사용자가 "Add"를 누르면 `handleAddTask(text)`가 호출됩니다.
  - 사용자가 task를 토글하거나 "Save"를 누르면 `handleChangeTask(task)`가 호출됩니다.
  - 사용자가 "Delete"를 누르면 `handleDeleteTask(taskId)`가 호출됩니다.
</TransBlock>

Managing state with reducers is slightly different from directly setting state. Instead of telling React "what to do" by setting state, you specify "what the user just did" by dispatching "actions" from your event handlers. (The state update logic will live elsewhere!) So instead of "setting `tasks`" via an event handler, you're dispatching an "added/changed/deleted a task" action. This is more descriptive of the user's intent.
<Trans>reducer를 사용한 state 관리는 state를 직접 설정하는 것과 약간 다릅니다. state를 설정하여 React에게 "무엇을 할 지"를 지시하는 대신, 이벤트 핸들러에서 "action"을 전달하여 "사용자가 방금 한 일"을 지정합니다. (state 업데이트 로직은 다른 곳에 있습니다!) 즉, 이벤트 핸들러를 통해 "`tasks`를 설정"하는 대신 "task를 추가/변경/삭제"하는 action을 전달하는 것입니다. 이러한 방식이 사용자의 의도를 더 명확하게 설명합니다.</Trans>

```js
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  });
}

function handleChangeTask(task) {
  dispatch({
    type: 'changed',
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

The object you pass to `dispatch` is called an "action":
<Trans>`dispatch` 함수에 넣어준 객체를 "action" 이라고 합니다:</Trans>

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // "action" object:
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

It is a regular JavaScript object. You decide what to put in it, but generally it should contain the minimal information about _what happened_. (You will add the `dispatch` function itself in a later step.)
<Trans>이 객체는 일반적인 JavaScript 객체입니다. 여기에 무엇을 넣을지는 여러분이 결정하지만, 일반적으로 _무슨 일이 일어났는지_ 에 대한 최소한의 정보를 포함해야 합니다. (`dispatch` 함수 자체는 이후 단계에서 추가할 것입니다.)</Trans>

<Note>

An action object can have any shape.
<Trans>action 객체는 어떤 형태든 될 수 있습니다.</Trans>

By convention, it is common to give it a string `type` that describes what happened, and pass any additional information in other fields. The `type` is specific to a component, so in this example either `'added'` or `'added_task'` would be fine. Choose a name that says what happened!
<Trans>그렇지만 무슨 일이 일어나는지 설명하는 문자열 타입의 `type`을 지정하고 추가적인 정보는 다른 필드를 통해 전달하도록 작성하는게 일반적입니다. `type`은 컴포넌트에 따라 다르므로 이 예에서는 `'added'` 또는 `'added_task'`를 사용하면 됩니다. 무슨 일이 일어나는지를 설명하는 이름을 선택하세요!</Trans>

```js
dispatch({
  // specific to component
  type: 'what_happened',
  // other fields go here
});
```

</Note>

### Step 2: Write a reducer function<Trans>reducer 함수 작성하기</Trans> {/*step-2-write-a-reducer-function*/}

A reducer function is where you will put your state logic. It takes two arguments, the current state and the action object, and it returns the next state:
<Trans>reducer 함수에 state 로직을 둘 수 있습니다. 이 함수는 두 개의 매개변수를 가지는데, 하나는 현재 state이고 하나는 action 객체입니다. 그리고 이 함수가 다음 state를 반환합니다:</Trans>

```js
function yourReducer(state, action) {
  // return next state for React to set
}
```

React will set the state to what you return from the reducer.
<Trans>React는 reducer로부터 반환된 것을 state로 설정할 것입니다.</Trans>

To move your state setting logic from your event handlers to a reducer function in this example, you will:
<Trans>state를 설정하는 로직을 이벤트 핸들러에서 reducer 함수로 옮기기 위해서 다음과 같이 진행해 보세요:</Trans>

1. Declare the current state (`tasks`) as the first argument.
2. Declare the `action` object as the second argument.
3. Return the _next_ state from the reducer (which React will set the state to).

<TransBlock>
  1. 현재의 state(`tasks`)를 첫 번째 매개변수로 선언하세요.
  2. `action` 객체를 두 번째 매개변수로 선언하세요.
  3. _다음_ state를 reducer 함수에서 반환하세요. (React가 state로 설정할 것입니다.)
</TransBlock>

Here is all the state setting logic migrated to a reducer function:
<Trans>아래는 모든 state 설정 로직을 reducer 함수로 옮긴 내용입니다:</Trans>

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```

Because the reducer function takes state (`tasks`) as an argument, you can **declare it outside of your component.** This decreases the indentation level and can make your code easier to read.
<Trans>reducer 함수는 state(`tasks`)를 매개변수로 갖기 때문에, **컴포넌트 밖에서 reducer 함수를 선언**할 수 있습니다. 이렇게 하면 들여쓰기 단계도 줄이고 코드를 읽기 쉽게 만들 수 있습니다.</Trans>

<Note>

The code above uses if/else statements, but it's a convention to use [switch statements](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) inside reducers. The result is the same, but it can be easier to read switch statements at a glance.
<Trans>위에 있던 코드는 if/else 구문을 사용합니다. 그러나 reducer 안에서는 [switch 구문](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch)을 사용하는 게 일반적입니다. 결과는 똑같지만 switch 구문이 한눈에 봐도 읽기 더 편합니다.</Trans>

We'll be using them throughout the rest of this documentation like so:
<Trans>우리는 이 문서의 나머지 부분에서 다음과 같이 reducer 함수를 작성할 것입니다:</Trans>

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

We recommend wrapping each `case` block into the `{` and `}` curly braces so that variables declared inside of different `case`s don't clash with each other. Also, a `case` should usually end with a `return`. If you forget to `return`, the code will "fall through" to the next `case`, which can lead to mistakes!
<Trans>case 블럭을 모두 중괄호 `{` 와 `}`로 감싸는 걸 추천합니다. 이렇게 하면 다양한 `case`들 안에서 선언된 변수들이 서로 충돌하지 않습니다. 또한, 하나의 `case`는 보통 `return`으로 끝나야합니다. 만약 `return`을 잊는다면 이 코드는 다음 `case`에 빠지게 될 것이고, 이는 실수로 이어질 수 있습니다. </Trans>

If you're not yet comfortable with switch statements, using if/else is completely fine.
<Trans>아직 switch 구문에 익숙하지 않다면, if/else를 사용하는 것도 전혀 지장이 없습니다.</Trans>

</Note>

<DeepDive>

#### Why are reducers called this way?<Trans>왜 reducer라고 부를까요?</Trans> {/*why-are-reducers-called-this-way*/}

Although reducers can "reduce" the amount of code inside your component, they are actually named after the [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) operation that you can perform on arrays.
<Trans>reducer들이 비록 컴포넌트 안에 있는 코드의 양을 “줄여주긴” 하지만, 이건 사실 배열에서 사용하는 [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) 연산을 따서 지은 이름입니다.</Trans>

The `reduce()` operation lets you take an array and "accumulate" a single value out of many:
<Trans>`reduce()` 연산은 배열을 가지고 많은 값들을 하나의 값으로 "누적"할 수 있습니다.</Trans>

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

The function you pass to `reduce` is known as a "reducer". It takes the _result so far_ and the _current item,_ then it returns the _next result._ React reducers are an example of the same idea: they take the _state so far_ and the _action_, and return the _next state._ In this way, they accumulate actions over time into state.
<Trans>`reduce`로 넘기는 함수가 “reducer”로 알려져 있습니다. _지금까지의 결과_ 와 _현재의 아이템_ 을 가지고, _다음 결과_ 를 반환합니다. React reducer는 이 아이디어와 똑같은 예시입니다. React reducer도 _지금까지의 state_ 와 _action_ 을 가지고 _다음 state_ 를 반환합니다. 이런 방식으로 시간이 지나면서 action들을 state로 모으게 됩니다.</Trans>

You could even use the `reduce()` method with an `initialState` and an array of `actions` to calculate the final state by passing your reducer function to it:
<Trans>심지어 `reduce()` 메서드를 `initialState`와 `actions` 배열을 사용해서 reducer로 최종 state를 계산할 수도 있습니다: </Trans>

<Sandpack>

```js index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

You probably won't need to do this yourself, but this is similar to what React does!
<Trans>이 작업을 직접 할 필요는 없겠지만, 이것은 React가 하는 것과 비슷합니다!</Trans>

</DeepDive>

### Step 3: Use the reducer from your component<Trans>컴포넌트에서 reducer 사용하기</Trans> {/*step-3-use-the-reducer-from-your-component*/}

Finally, you need to hook up the `tasksReducer` to your component. Import the `useReducer` Hook from React:
<Trans>마지막으로, 컴포넌트에 `tasksReducer`를 연결해야 합니다. React에서 `useReducer` Hook을 import하세요:</Trans>

```js
import {useReducer} from 'react';
```

Then you can replace `useState`:
<Trans>그런 다음, `useState` 대신:</Trans>

```js
const [tasks, setTasks] = useState(initialTasks);
```

with `useReducer` like so:
<Trans>`useReducer`로 바꿔주세요:</Trans>

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

The `useReducer` Hook is similar to `useState`—you must pass it an initial state and it returns a stateful value and a way to set state (in this case, the dispatch function). But it's a little different.
<Trans>`useReducer` Hook은 `useState`와 비슷합니다. 초기 state 값을 전달해야 하며, 그 결과로 state 값과 state 설정자 함수(useReducer의 경우 dispatch 함수)를 반환합니다. 하지만 조금 다른 점이 있습니다.</Trans>

The `useReducer` Hook takes two arguments:
<Trans>`useReducer` Hook은 두 개의 인자를 받습니다:</Trans>

1. A reducer function
2. An initial state

<TransBlock>
  1. reducer 함수
  2. 초기 state
</TransBlock>

And it returns:
<Trans>그리고 아래 내용을 반환합니다:</Trans>

1. A stateful value
2. A dispatch function (to "dispatch" user actions to the reducer)

<TransBlock>
  1. state값
  2. dispatch 함수 (사용자의 action을 reducer에 “전달”해주는 함수)
</TransBlock>

Now it's fully wired up! Here, the reducer is declared at the bottom of the component file:
<Trans>이제 완전히 연결되었습니다! 이제 reducer는 컴포넌트 파일 하단에 선언되어 있습니다: </Trans>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

If you want, you can even move the reducer to a different file:
<Trans>원한다면, reducer를 다른 파일로 분리하는 것도 가능합니다:</Trans>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Component logic can be easier to read when you separate concerns like this. Now the event handlers only specify _what happened_ by dispatching actions, and the reducer function determines _how the state updates_ in response to them.
<Trans>이렇게 관심사를 분리하면 컴포넌트 로직을 더 쉽게 읽을 수 있습니다. 이제 이벤트 핸들러는 action을 전달하여 _무슨 일이 일어났는지_ 만 지정하고, reducer 함수는 action에 대한 응답으로 _state가 어떻게 변경되는지_ 를 결정합니다.</Trans>

## Comparing `useState` and `useReducer`<Trans>`useState`와 `useReducer` 비교하기</Trans> {/*comparing-usestate-and-usereducer*/}

Reducers are not without downsides! Here's a few ways you can compare them:
<Trans>Reducer도 좋은 점만 있는 것은 아닙니다! 다음은 useState 와 useReducer 를 비교할 수 있는 몇 가지 방법입니다:</Trans>

- **Code size:** Generally, with `useState` you have to write less code upfront. With `useReducer`, you have to write both a reducer function _and_ dispatch actions. However, `useReducer` can help cut down on the code if many event handlers modify state in a similar way.
<Trans>**코드 크기:** 일반적으로 `useState`를 사용하면 미리 작성해야 하는 코드가 줄어듭니다. `useReducer`를 사용하면 reducer 함수 _와_ action을 전달하는 부분 모두 작성해야 합니다. 하지만 많은 이벤트 핸들러가 비슷한 방식으로 state를 업데이트하는 경우 `useReducer`를 사용하면 코드를 줄이는 데 도움이 될 수 있습니다.</Trans>
- **Readability:** `useState` is very easy to read when the state updates are simple. When they get more complex, they can bloat your component's code and make it difficult to scan. In this case, `useReducer` lets you cleanly separate the _how_ of update logic from the _what happened_ of event handlers.
<Trans>**가독성:** `useState`로 간단한 state를 업데이트 하는 경우 가독성이 좋습니다. 그렇지만 state의 구조가 더욱 복잡해지면, 컴포넌트의 코드의 양이 부풀어 오르고 한눈에 읽기 어려워질 수 있습니다. 이 경우 `useReducer`를 사용하면 업데이트 로직이 _어떻게 동작_ 하는지와 이벤트 핸들러를 통해 _무엇이 일어났는지_ 를 깔끔하게 분리할 수 있습니다.</Trans>
- **Debugging:** When you have a bug with `useState`, it can be difficult to tell _where_ the state was set incorrectly, and _why_. With `useReducer`, you can add a console log into your reducer to see every state update, and _why_ it happened (due to which `action`). If each `action` is correct, you'll know that the mistake is in the reducer logic itself. However, you have to step through more code than with `useState`.
<Trans>**디버깅:** `useState`에 버그가 있는 경우, state가 _어디서_ 잘못 설정되었는지, 그리고 _왜 그런지_ 알기 어려울 수 있습니다. `useReducer`를 사용하면, reducer에 콘솔 로그를 추가하여 모든 state 업데이트와 _왜_ (어떤 action으로 인해) 버그가 발생했는지 확인할 수 있습니다. 각 `action`이 정확하다면, 버그가 reducer 로직 자체에 있다는 것을 알 수 있습니다. 하지만 `useState`를 사용할 때보다 더 많은 코드를 살펴봐야 합니다.</Trans>
- **Testing:** A reducer is a pure function that doesn't depend on your component. This means that you can export and test it separately in isolation. While generally it's best to test components in a more realistic environment, for complex state update logic it can be useful to assert that your reducer returns a particular state for a particular initial state and action.
<Trans>**테스팅:** reducer는 컴포넌트에 의존하지 않는 순수한 함수입니다. 즉, 별도로 분리해서 내보내거나 테스트할 수 있습니다. 일반적으로 보다 현실적인 환경에서 컴포넌트를 테스트하는 것이 가장 좋지만, 복잡한 state 업데이트 로직의 경우 reducer가 특정 초기 state와 action에 대해 특정 state를 반환한다고 단언하는 것이 유용할 수 있습니다.</Trans>
- **Personal preference:** Some people like reducers, others don't. That's okay. It's a matter of preference. You can always convert between `useState` and `useReducer` back and forth: they are equivalent!
<Trans>**개인 취향:** 어떤 사람은 reducer를 좋아하고 어떤 사람은 싫어합니다. 괜찮습니다. 취향의 문제니까요. `useState` 와 `useReducer`는 언제든지 앞뒤로 변환할 수 있으며, 서로 동등합니다!</Trans>

We recommend using a reducer if you often encounter bugs due to incorrect state updates in some component, and want to introduce more structure to its code. You don't have to use reducers for everything: feel free to mix and match! You can even `useState` and `useReducer` in the same component.
<Trans>일부 컴포넌트에서 잘못된 state 업데이트로 인해 버그가 자주 발생하고 코드에 더 많은 구조를 도입하려는 경우 reducer를 사용하는 것이 좋습니다. 모든 컴포넌트에 reducer를 사용할 필요는 없으니 자유롭게 섞어서 사용하세요! 심지어 같은 컴포넌트에서 `useState`와 `useReducer`를 함께 사용할 수도 있습니다.</Trans>

## Writing reducers well<Trans>reducer 잘 작성하기</Trans> {/*writing-reducers-well*/}

Keep these two tips in mind when writing reducers:
<Trans>reducer를 작성할 때 다음 두 개의 팁을 기억하세요:</Trans>

- **Reducers must be pure.** Similar to [state updater functions](/learn/queueing-a-series-of-state-updates), reducers run during rendering! (Actions are queued until the next render.) This means that reducers [must be pure](/learn/keeping-components-pure)—same inputs always result in the same output. They should not send requests, schedule timeouts, or perform any side effects (operations that impact things outside the component). They should update [objects](/learn/updating-objects-in-state) and [arrays](/learn/updating-arrays-in-state) without mutations.
<Trans>**reducer는 반드시 순수해야 합니다.** [state 설정 함수](/learn/queueing-a-series-of-state-updates)와 비슷하게, reducer는 렌더링 중에 실행됩니다! (action은 다음 렌더링까지 대기합니다.) 즉, reducer는 [반드시 순수](/learn/keeping-components-pure)해야 합니다. 즉, 입력 값이 같다면 결과 값도 항상 같아야 합니다. 요청을 보내거나 timeout을 스케쥴링하거나 사이드 이펙트(컴포넌트 외부에 영향을 미치는 작업)을 수행해서는 안 됩니다. reducer는 [객체](/learn/updating-objects-in-state) 및 [배열](/learn/updating-arrays-in-state)을 변이 없이 업데이트해야 합니다.</Trans>

- **Each action describes a single user interaction, even if that leads to multiple changes in the data.** For example, if a user presses "Reset" on a form with five fields managed by a reducer, it makes more sense to dispatch one `reset_form` action rather than five separate `set_field` actions. If you log every action in a reducer, that log should be clear enough for you to reconstruct what interactions or responses happened in what order. This helps with debugging!
<Trans>**각 action은 여러 데이터가 변경되더라도, 하나의 사용자 상호작용을 설명해야 합니다.** 예를 들어 사용자가 reducer가 관리하는 5개의 필드가 있는 양식에서 '재설정'을 누른 경우, 5개의 개별 `set_field action`보다는 하나의 `reset_form action`을 전송하는 것이 더 합리적입니다. 모든 action을 reducer에 기록하면 어떤 상호작용이나 응답이 어떤 순서로 일어났는지 재구성할 수 있을 만큼 로그가 명확해야 합니다. 이는 디버깅에 도움이 됩니다!</Trans>

## Writing concise reducers with Immer<Trans>Immer를 사용하여 간결한 reducer 작성하기</Trans> {/*writing-concise-reducers-with-immer*/}

Just like with [updating objects](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) and [arrays](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) in regular state, you can use the Immer library to make reducers more concise. Here, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) lets you mutate the state with `push` or `arr[i] =` assignment:
<Trans>일반 state의 [객체](/learn/updating-objects-in-state#write-concise-update-logic-with-immer)와 [배열을 변경](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer)할 때와 마찬가지로 Immer 라이브러리를 사용해 reducer를 더 간결하게 만들 수 있습니다. 여기서 `useImmerReducer`를 사용하면 `push` 또는 `arr[i] =` 할당으로 state를 변이할 수 있습니다:</Trans>

<Sandpack>

```js App.js
import {useImmerReducer} from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import {useState} from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import {useState} from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Reducers must be pure, so they shouldn't mutate state. But Immer provides you with a special `draft` object which is safe to mutate. Under the hood, Immer will create a copy of your state with the changes you made to the `draft`. This is why reducers managed by `useImmerReducer` can mutate their first argument and don't need to return state.
<Trans>reducer는 순수해야 하므로 state를 변이하지 않아야 합니다. 하지만 Immer는 안전하게 변이할 수 있는 특별한 `draft` 객체를 제공합니다. 내부적으로 Immer는 사용자가 변경한 `draft`로 state의 복사본을 생성합니다. 이 방식을 통해 `useImmerReducer`로 관리되는 reducer는 첫 번째 인수를 변경할 수 있고, state를 반환할 필요가 없습니다.</Trans>

<Recap>

- To convert from `useState` to `useReducer`:
  1. Dispatch actions from event handlers.
  2. Write a reducer function that returns the next state for a given state and action.
  3. Replace `useState` with `useReducer`.
- Reducers require you to write a bit more code, but they help with debugging and testing.
- Reducers must be pure.
- Each action describes a single user interaction.
- Use Immer if you want to write reducers in a mutating style.

<TransBlock>
- `useSate`에서 `useReducer`로 변환하려면:
  1. 이벤트 핸들러에서 action을 전달합니다.
  2. 주어진 state와 action에 대해 다음 state를 반환하는 reducer 함수를 작성합니다.
  3. `useState`를 `useReducer`로 바꿉니다.
- reducer를 사용하면 코드를 조금 더 작성해야 하지만 디버깅과 테스트에 도움이 됩니다.
- reducer는 반드시 순수해야 합니다.
- 각 action은 단일 사용자 상호작용을 설명해야 합니다.
- 변이 스타일로 reducer를 작성하려면 Immer를 사용하세요.
</TransBlock>

</Recap>

<Challenges>

#### Dispatch actions from event handlers<Trans>이벤트 핸들러에서 action을 dispatch하기</Trans> {/*dispatch-actions-from-event-handlers*/}

Currently, the event handlers in `ContactList.js` and `Chat.js` have `// TODO` comments. This is why typing into the input doesn't work, and clicking on the buttons doesn't change the selected recipient.
<Trans>현재 `ContactList.js`와 `Chat.js`의 이벤트 핸들러에는 `// TODO` 주석이 있습니다. 이 때문에 입력을 입력해도 작동하지 않고 버튼을 클릭해도 선택한 수신자가 변경되지 않습니다.</Trans>

Replace these two `// TODO`s with the code to `dispatch` the corresponding actions. To see the expected shape and the type of the actions, check the reducer in `messengerReducer.js`. The reducer is already written so you won't need to change it. You only need to dispatch the actions in `ContactList.js` and `Chat.js`.
<Trans>두 개의 `// TODO`를 해당 작업을 `dispatch`하는 코드로 바꾸세요. 예상되는 모양과 action의 유형을 확인하려면 messengerReducer.js에서 reducer를 확인하세요. reducer는 이미 작성되어 있으므로 변경할 필요가 없습니다. `ContactList.js`와 `Chat.js`에서 action을 전달하기만 하면 됩니다.</Trans>

<Hint>

The `dispatch` function is already available in both of these components because it was passed as a prop. So you need to call `dispatch` with the corresponding action object.
<Trans>`dispatch` 함수는 prop으로 전달되었기 때문에 이 두 컴포넌트에서 이미 사용할 수 있습니다. 따라서 해당 action 객체에 상응하는 `dispatch`를 호출해야 합니다.</Trans>

To check the action object shape, you can look at the reducer and see which `action` fields it expects to see. For example, the `changed_selection` case in the reducer looks like this:
<Trans>action 객체 형태를 확인하려면 reducer를 살펴보고 어떤 `action` 필드가 표시될 것으로 예상되는지 확인할 수 있습니다. 예를 들어, reducer의 `changed_selection` 케이스는 다음과 같습니다:</Trans>

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```

This means that your action object should have a `type: 'changed_selection'`. You also see the `action.contactId` being used, so you need to include a `contactId` property into your action.
<Trans>즉, action 객체에 `type: 'changed_selection'`이 있어야 합니다. 또한 `action.contactId`가 사용되는 것을 볼 수 있으므로 `contactId` 속성을 action에 포함시켜야 합니다.</Trans>

</Hint>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

From the reducer code, you can infer that actions need to look like this:
<Trans>reducer 코드에서 action이 다음과 같이 표시되어야 한다는 것을 유추할 수 있습니다:</Trans>

```js
// When the user presses "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// When user types "Hello!"
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```

Here is the example updated to dispatch the corresponding messages:
<Trans>다음은 해당 메시지를 전달하도록 수정된 예제입니다:</Trans>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### Clear the input on sending a message<Trans>메세지 전송 시 입력창 지우기</Trans> {/*clear-the-input-on-sending-a-message*/}

Currently, pressing "Send" doesn't do anything. Add an event handler to the "Send" button that will:
<Trans>지금은 "Send"를 눌러도 아무 일도 일어나지 않습니다. "Send" 버튼에 이벤트 핸들러를 추가해 주세요:</Trans>

1. Show an `alert` with the recipient's email and the message.
2. Clear the message input.

<TransBlock>
1. 수신자의 이메일과 메시지가 포함된 `alert`를 표시하세요.
2. 메시지 입력창을 지우세요.
</TransBlock>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

There are a couple of ways you could do it in the "Send" button event handler. One approach is to show an alert and then dispatch an `edited_message` action with an empty `message`:
<Trans>"보내기" 버튼 이벤트 핸들러에서 이 작업을 수행할 수 있는 몇 가지 방법이 있습니다. 한 가지 방법은 경고를 표시한 다음 빈 `message`와 함께 `edited_message` action을 전달하는 것입니다:</Trans>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

This works and clears the input when you hit "Send".
<Trans>이 코드는 동작하고, '보내기'를 누르면 입력 내용이 지워집니다.</Trans>

However, _from the user's perspective_, sending a message is a different action than editing the field. To reflect that, you could instead create a _new_ action called `sent_message`, and handle it separately in the reducer:
<Trans>그러나 _사용자 관점에서_ 메시지를 보내는 것은 필드를 편집하는 것과는 다른 작업입니다. 이를 반영하기 위해 대신 `sent_message`라는 _새로운_ action을 생성하고 reducer에서 별도로 처리할 수 있습니다:</Trans>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

The resulting behavior is the same. But keep in mind that action types should ideally describe "what the user did" rather than "how you want the state to change". This makes it easier to later add more features.
<Trans>결과 동작은 동일합니다. 하지만 action type은 'state가 어떻게 변경되기를 원하는지'가 아니라 '사용자가 무엇을 했는지'를 설명하는 것이 이상적이라는 점을 명심하세요. 이렇게 하면 나중에 더 많은 기능을 추가하기가 더 쉬워집니다.</Trans>

With either solution, it's important that you **don't** place the `alert` inside a reducer. The reducer should be a pure function--it should only calculate the next state. It should not "do" anything, including displaying messages to the user. That should happen in the event handler. (To help catch mistakes like this, React will call your reducers multiple times in Strict Mode. This is why, if you put an alert in a reducer, it fires twice.)
<Trans>어떤 솔루션을 사용하든 reducer 안에 `alert`를 배치하지 **않는 것**이 중요합니다. reducer는 다음 state만 계산하는 순수한 함수여야 합니다. 사용자에게 메시지를 표시하는 등 어떤 '작업'도 해서는 안 됩니다. 이는 이벤트 핸들러에서 발생해야 합니다. (이와 같은 실수를 잡기 위해 React는 Strict Mode에서 reducer를 여러 번 호출합니다. 이것이 바로 reducer에 `alert`를 넣으면 두 번 실행되는 이유입니다).</Trans>

</Solution>

#### Restore input values when switching between tabs<Trans>탭 전환 시 입력값 복구하기</Trans> {/*restore-input-values-when-switching-between-tabs*/}

In this example, switching between different recipients always clears the text input:
<Trans>이 예제에서, 수신자를 전환하면 항상 텍스트 입력이 지워집니다:</Trans>

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Clears the input
  };
```

This is because you don't want to share a single message draft between several recipients. But it would be better if your app "remembered" a draft for each contact separately, restoring them when you switch contacts.
<Trans>이는 여러 수신자 간에 하나의 메시지 초안을 공유하고 싶지 않기 때문입니다. 하지만 앱에서 각 연락처에 대한 초안을 개별적으로 "기억"하여 연락처를 전환할 때 복원하는 것이 더 좋을 것 같습니다.</Trans>

Your task is to change the way the state is structured so that you remember a separate message draft _per contact_. You would need to make a few changes to the reducer, the initial state, and the components.
<Trans>해야 할 일은 *연락처별*로 별도의 메시지 초안을 기억하도록 state의 구조 방식을 변경하는 것입니다. reducer, 초기 state 및 컴포넌트를 몇 가지 변경해야 하세요.</Trans>

<Hint>

You can structure your state like this:
<Trans>다음과 같이 state를 구성할 수 있습니다:</Trans>

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // Draft for contactId = 0
    1: 'Hello, Alice', // Draft for contactId = 1
  },
};
```

The `[key]: value` [computed property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) syntax can help you update the `messages` object:
<Trans>`[key]: value`의 [계산된 속성](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) 구문을 사용하면 `messages` 객체를 업데이트하는 데 도움이 될 수 있습니다:</Trans>

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

You'll need to update the reducer to store and update a separate message draft per contact:
<Trans>연락처별로 별도의 메시지 초안을 저장하고 변경하려면 reducer를 변경해야 합니다:</Trans>

```js
// When the input is edited
case 'edited_message': {
  return {
    // Keep other state like selection
    ...state,
    messages: {
      // Keep messages for other contacts
      ...state.messages,
      // But change the selected contact's message
      [state.selectedId]: action.message
    }
  };
}
```

You would also update the `Messenger` component to read the message for the currently selected contact:
<Trans>또한 현재 선택한 연락처의 메시지를 읽도록 `Messenger` 컴포넌트를 업데이트할 수도 있습니다:</Trans>

```js
const message = state.messages[state.selectedId];
```

Here is the complete solution:
<Trans>전체 솔루션은 다음과 같습니다:</Trans>

<Sandpack>

```js App.js
import {useReducer} from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Notably, you didn't need to change any of the event handlers to implement this different behavior. Without a reducer, you would have to change every event handler that updates the state.
<Trans>특히, 이러한 다른 동작을 구현하기 위해 이벤트 핸들러를 변경할 필요가 없었습니다. reducer가 없다면 state를 업데이트하는 모든 이벤트 핸들러를 변경해야 합니다.</Trans>

</Solution>

#### Implement `useReducer` from scratch<Trans>`useReducer`를 처음부터 구현하기</Trans> {/*implement-usereducer-from-scratch*/}

In the earlier examples, you imported the `useReducer` Hook from React. This time, you will implement _the `useReducer` Hook itself!_ Here is a stub to get you started. It shouldn't take more than 10 lines of code.
<Trans>앞선 예제에서는 React에서 `useReducer` Hook을 import 했습니다. 이번에는 _`useReducer` Hook 자체를 구현_ 해 보세요! 다음은 시작을 위한 초안입니다. 코드는 10줄을 넘지 않아야 합니다.</Trans>

To test your changes, try typing into the input or select a contact.
<Trans>변경 사항을 테스트하려면 입력값을 입력하거나 연락처를 선택해 보세요.</Trans>

<Hint>

Here is a more detailed sketch of the implementation:
<Trans>다음은 구현에 대한 자세한 스케치입니다:</Trans>

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

Recall that a reducer function takes two arguments--the current state and the action object--and it returns the next state. What should your `dispatch` implementation do with it?
<Trans>reducer 함수는 현재 state와 action 객체라는 두 개의 인수를 받아 다음 state를 반환한다는 것을 기억하세요. 여러분의 `dispatch` 구현을 위해 이 함수로 무엇을 해야 할까요?</Trans>

</Hint>

<Sandpack>

```js App.js
import {useReducer} from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import {useState} from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Dispatching an action calls a reducer with the current state and the action, and stores the result as the next state. This is what it looks like in code:
<Trans>action을 전달하면 현재 state와 action이 있는 reducer를 호출하고 결과를 다음 state로 저장합니다. 이것이 코드에서 보이는 모습입니다:</Trans>

<Sandpack>

```js App.js
import {useReducer} from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import {initialState, messengerReducer} from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import {useState} from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import {useState} from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Though it doesn't matter in most cases, a slightly more accurate implementation looks like this:
<Trans>대부분의 경우 중요하지 않지만 조금 더 정확한 구현은 다음과 같습니다:</Trans>

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

This is because the dispatched actions are queued until the next render, [similar to the updater functions.](/learn/queueing-a-series-of-state-updates)
<Trans>이는 [변경 함수와 유사](/learn/queueing-a-series-of-state-updates)하게 다음 렌더링까지 전달된 action이 대기열에 대기하기 때문입니다.</Trans>

</Solution>

</Challenges>
