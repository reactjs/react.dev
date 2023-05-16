---
title: useReducer
translators: [손한종, 정재남]
---

<Intro>

`useReducer` is a React Hook that lets you add a [reducer](/learn/extracting-state-logic-into-a-reducer) to your component.
<Trans>`useReducer` 는 컴포넌트에  [reducer](/learn/extracting-state-logic-into-a-reducer)를 추가할 수 있는 React입니다.</Trans>

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

Call `useReducer` at the top level of your component to manage its state with a [reducer.](/learn/extracting-state-logic-into-a-reducer)
<Trans>컴포넌트의 최상위 레벨에서 `useReducer`를 호출하여 [reducer](/learn/extracting-state-logic-into-a-reducer)를 통해 state를 관리하세요.</Trans>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `reducer`: The reducer function that specifies how the state gets updated. It must be pure, should take the state and action as arguments, and should return the next state. State and action can be of any types. 
* `initialArg`: The value from which the initial state is calculated. It can be a value of any type. How the initial state is calculated from it depends on the next `init` argument.
* **optional** `init`: The initializer function that should return the initial state. If it's not specified, the initial state is set to `initialArg`. Otherwise, the initial state is set to the result of calling `init(initialArg)`.

<TransBlock>
- `reducer`: state가 업데이트되는 방식을 지정하는 reducer 함수입니다. 순수 함수여야 하며, state와 액션을 인자로 받아야 하고, 다음 state를 반환해야 합니다. state와 액션은 어떤 유형이든 가능합니다.
- `initialArg`: 초기 state가 계산되는 값입니다. 모든 유형의 값일 수 있습니다. 이 값에서 초기 state를 계산하는 방법은 다음 `init` 인자에 따라 달라집니다.
- **선택적** `init`: 초기 state 계산 방법을 지정하는 초기화 함수입니다. 이것을 지정하지 않으면 초기 state는 `initialArg`로 설정됩니다. 그렇지 않으면 초기 state는 `init(initialArg)`를 호출한 결과로 설정됩니다.
</TransBlock>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`useReducer` returns an array with exactly two values:
<Trans>`useReducer` 는 정확히 두 개의 값을 가진 배열을 반환합니다:</Trans>

1. The current state. During the first render, it's set to `init(initialArg)` or `initialArg` (if there's no `init`).
2. The [`dispatch` function](#dispatch) that lets you update the state to a different value and trigger a re-render.

<TransBlock>
  1. 현재 state. 첫 번째 렌더링 중에는 `init(initialArg)` 또는 (`init`이 없는 경우) `initialArg`로 설정됩니다.
  2. state를 다른 값으로 업데이트하고 리렌더링을 촉발할 수 있는 [`dispatch` function](#dispatch).
</TransBlock>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* `useReducer` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
* In Strict Mode, React will **call your reducer and initializer twice** in order to [help you find accidental impurities.](#my-reducer-or-initializer-function-runs-twice) This is development-only behavior and does not affect production. If your reducer and initializer are pure (as they should be), this should not affect your logic. The result from one of the calls is ignored.

<TransBlock>
- `useReducer` 는 훅이므로 **구성 요소의 최상위 레벨** 또는 자체 훅에서만 호출할 수 있습니다. 반복문이나 조건문 내부에서는 호출할 수 없습니다. 필요하다면 새 컴포넌트를 추출하고 state를 그 안으로 옮기세요.
- Strict Mode에서 React는 [의도치 않은 불순물을 찾기 위해](#my-reducer-or-initializer-function-runs-twice) **reducer와 초기화 함수를 두 번 호출**합니다. 이는 개발 전용 동작이며 상용 환경에서는 영향을 미치지 않습니다. reducer와 초기화 함수가 순수하다면(그래야 합니다) 컴포넌트의 로직에 영향을 미치지 않습니다. 호출 중 하나의 결과는 무시됩니다.
</TransBlock>

---

### `dispatch` function {/*dispatch*/}

The `dispatch` function returned by `useReducer` lets you update the state to a different value and trigger a re-render. You need to pass the action as the only argument to the `dispatch` function:
<Trans>`useReducer` 가 반환하는 `dispatch` 함수를 사용하면 state를 다른 값으로 업데이트하고 다시 렌더링을 촉발할 수 있습니다. `dispatch` 함수에 유일한 인수로 액션을 전달해야 합니다:</Trans>

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React will set the next state to the result of calling the `reducer` function you've provided with the current `state` and the action you've passed to `dispatch`.
<Trans>React는 `reducer` 함수에 현재 `state`와 `dispatch`한 액션을 전달하고, 그 결과를 다음 state로 설정합니다.</Trans>

#### Parameters<Trans>매개변수</Trans> {/*dispatch-parameters*/}

* `action`: The action performed by the user. It can be a value of any type. By convention, an action is usually an object with a `type` property identifying it and, optionally, other properties with additional information.
<Trans>`action`: 사용자가 수행한 작업입니다. 어떤 데이터 유형이든 올 수 있습니다. 관용적으로 액션은 보통 이를 식별하는 type 속성이 있는 객체이며, 선택적으로 추가 정보가 있는 다른 속성을 포함할 수 있습니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*dispatch-returns*/}

`dispatch` functions do not have a return value.
<Trans>`dispatch` 함수에는 반환값이 없습니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*setstate-caveats*/}

* The `dispatch` function **only updates the state variable for the *next* render**. If you read the state variable after calling the `dispatch` function, [you will still get the old value](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value) that was on the screen before your call.
<Trans>`dispatch`함수는 **다음 렌더링에 대한 state 변수만 업데이트합니다.** 만약 `dispatch`함수를 호출한 후 state 변수를 읽으면, 호출 전 화면에 있던 [이전 값이 계속 표시됩니다.](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value)</Trans>

* If the new value you provide is identical to the current `state`, as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison, React will **skip re-rendering the component and its children.** This is an optimization. React may still need to call your component before ignoring the result, but it shouldn't affect your code.
<Trans>만약 여러분이 제공한 새 값이 [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)로 비교했을 때 현재 `state`와 동일하다면, React는 **컴포넌트와 그 자식들을 다시 렌더링하는 것을 건너뜁니다.** 이것은 최적화입니다. React는 결과를 무시하기 전에 여전히 컴포넌트를 호출하게 될 수도 있지만, 코드에 영향을 미치지는 않습니다.</Trans>

* React [batches state updates.](/learn/queueing-a-series-of-state-updates) It updates the screen **after all the event handlers have run** and have called their `set` functions. This prevents multiple re-renders during a single event. In the rare case that you need to force React to update the screen earlier, for example to access the DOM, you can use [`flushSync`.](/reference/react-dom/flushSync)
<Trans>React는 [state 업데이트를 일괄 처리합니다.](/learn/queueing-a-series-of-state-updates) **모든 이벤트 핸들러가 실행되고** `set` 함수를 호출한 후에 화면을 업데이트합니다. 이렇게 하면 단일 이벤트 중에 여러 번 다시 렌더링되는 것을 방지할 수 있습니다. 드물지만 DOM에 접근하기 위해 React가 화면을 더 일찍 업데이트하도록 강제해야 하는 경우, [`flushSync`](/reference/react-dom/flushSync)를 사용할 수 있습니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Adding a reducer to a component<Trans>컴포넌트에 reducer 추가하기</Trans> {/*adding-a-reducer-to-a-component*/}

Call `useReducer` at the top level of your component to manage state with a [reducer.](/learn/extracting-state-logic-into-a-reducer)

<Trans>컴포넌트의 최상위 레벨에서 `useReducer` 를 호출하여  [reducer](/learn/extracting-state-logic-into-a-reducer)로 state를 관리하세요.</Trans>

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer` returns an array with exactly two items:
<Trans>`useReducer` 는 정확히 두 개의 항목이 있는 배열을 반환합니다:</Trans>

1. The <CodeStep step={1}>current state</CodeStep> of this state variable, initially set to the <CodeStep step={3}>initial state</CodeStep> you provided.
2. The <CodeStep step={2}>`dispatch` function</CodeStep> that lets you change it in response to interaction.

<TransBlock>
1. 이 state 변수의 <CodeStep step={1}>현재 state</CodeStep>. 처음에 제공한 <CodeStep step={3}>초기 state</CodeStep>로 설정됨.
2. 상호작용에 반응하여 이를 변경할 수 있는 <CodeStep step={2}>`dispatch`</CodeStep> 함수.
</TransBlock>

To update what's on the screen, call <CodeStep step={2}>`dispatch`</CodeStep> with an object representing what the user did, called an *action*:
<Trans>화면에 표시되는 내용을 업데이트하려면 사용자가 수행한 작업을 나타내는 객체, 즉 *액션*을 사용하여 <CodeStep step={2}>`dispatch`</CodeStep>를 호출합니다:</Trans>

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React will pass the current state and the action to your <CodeStep step={4}>reducer function</CodeStep>. Your reducer will calculate and return the next state. React will store that next state, render your component with it, and update the UI.
<Trans>React는 현재 state와 액션을 <CodeStep step={4}>reducer 함수</CodeStep>에 전달합니다. Reducer는 다음 state를 계산하고 반환합니다. React는 다음 state를 저장하고, 컴포넌트를 렌더링하고, UI를 업데이트합니다.</Trans>

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Unknown action.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Increment age
      </button>
      <p>Hello! You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` is very similar to [`useState`](/reference/react/useState), but it lets you move the state update logic from event handlers into a single function outside of your component. Read more about [choosing between `useState` and `useReducer`.](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)
<Trans>`useReducer` 는 [`useState`](/reference/react/useState)와 매우 유사하지만 이벤트 핸들러의 state 업데이트 로직을 컴포넌트 외부의 단일 함수로 옮길 수 있습니다. 더 자세한 내용은 [`useState`와 `useReducer` 중 하나를 선택하는 방법](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)에서 확인하세요.</Trans>

---

### Writing the reducer function<Trans>reducer 함수 작성하기</Trans> {/*writing-the-reducer-function*/}

A reducer function is declared like this:
<Trans>Reducer 함수는 다음과 같이 선언됩니다:</Trans>

```js
function reducer(state, action) {
  // ...
}
```

Then you need to fill in the code that will calculate and return the next state. By convention, it is common to write it as a [`switch` statement.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) For each `case` in the `switch`, calculate and return some next state.
<Trans>그런 다음 다음 state를 계산하고 반환할 코드를 입력해야 합니다. 관례상 [`switch` 문](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)으로 작성하는 것이 일반적입니다. `switch`의 각 `case` 에 대해 다음 state를 계산하고 반환해야 합니다.</Trans>

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

Actions can have any shape. By convention, it's common to pass objects with a `type` property identifying the action. It should include the minimal necessary information that the reducer needs to compute the next state.
<Trans>액션은 어떤 형태든 가질 수 있습니다. 관례상 액션을 식별하는 `type` 프로퍼티가 있는 객체를 전달하는 것이 일반적입니다. 여기에는 reducer가 다음 state를 계산하는 데 필요한 최소한의 필수 정보가 포함되어야 합니다.</Trans>

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });
  
  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

The action type names are local to your component. [Each action describes a single interaction, even if that leads to multiple changes in data.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) The shape of the state is arbitrary, but usually it'll be an object or an array.
<Trans>액션 유형 이름은 컴포넌트에 로컬로 지정됩니다. [각 액션은 아무리 많은 데이터를 변경하게 되더라도 오직 하나의 상호작용만을 기술합니다.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) state의 모양은 임의적이지만 일반적으로 객체나 배열이 될 것입니다.</Trans>

Read [extracting state logic into a reducer](/learn/extracting-state-logic-into-a-reducer) to learn more.
<Trans>자세한 내용은 [state 로직을 reducer로 추출하기](/learn/extracting-state-logic-into-a-reducer)를 읽어보세요.</Trans>

<Pitfall>

State is read-only. Don't modify any objects or arrays in state:
<Trans>state는 읽기 전용입니다. state의 객체나 배열을 수정하지 마세요:</Trans>

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Don't mutate an object in state like this:
      state.age = state.age + 1;
      return state;
    }
```

Instead, always return new objects from your reducer:
<Trans>대신, reducer로부터 새로운 객체를 반환하세요:</Trans>

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Instead, return a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
```

Read [updating objects in state](/learn/updating-objects-in-state) and [updating arrays in state](/learn/updating-arrays-in-state) to learn more.
<Trans>자세한 내용은 [state 객체 업데이트하기](/learn/updating-objects-in-state) 및 [state배열 업데이트하기](/learn/updating-arrays-in-state)를 참고하세요.</Trans>

</Pitfall>

<Recipes titleText="Basic useReducer examples" titleId="examples-basic" translatedTitle="useReducer 기본 예시">

#### Form (object)<Trans>입력양식 (객체)</Trans> {/*form-object*/}

In this example, the reducer manages a state object with two fields: `name` and `age`.
<Trans>이 예제에서 reducer는 `name` 과 `age` 라는 두 개의 필드가 있는 state 객체를 관리합니다.</Trans>

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Unknown action: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    }); 
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Increment age
      </button>
      <p>Hello, {state.name}. You are {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### Todo list (array)<Trans>할일 목록 (배열)</Trans> {/*todo-list-array*/}

In this example, the reducer manages an array of tasks. The array needs to be updated [without mutation.](/learn/updating-arrays-in-state)
<Trans>이 예제에서 reducer는 작업 배열을 관리합니다. 배열은 [변이 없이](/learn/updating-arrays-in-state) 업데이트되어야 합니다.</Trans>

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

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
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
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
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false }
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

#### Writing concise update logic with Immer<Trans>Immer로 간결한 업데이트 로직 작성하기</Trans> {/*writing-concise-update-logic-with-immer*/}

If updating arrays and objects without mutation feels tedious, you can use a library like [Immer](https://github.com/immerjs/use-immer#useimmerreducer) to reduce repetitive code. Immer lets you write concise code as if you were mutating objects, but under the hood it performs immutable updates:
<Trans>변이 없이 배열과 객체를 업데이트하는 것이 지루하게 느껴진다면 [Immer](https://github.com/immerjs/use-immer#useimmerreducer)와 같은 라이브러리를 사용하여 반복적인 코드를 줄일 수 있습니다. Immer를 사용하면 객체를 변경하는 것처럼 간결한 코드를 작성할 수 있지만, 내부적으로는 변경 불가능한 업데이트를 수행합니다:</Trans>

<Sandpack>

```js App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

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
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
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
  { id: 0, text: 'Visit Kafka Museum', done: true },
  { id: 1, text: 'Watch a puppet show', done: false },
  { id: 2, text: 'Lennon Wall pic', done: false },
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
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

<Solution />

</Recipes>

---

### Avoiding recreating the initial state<Trans>초기 state 재생성 방지하기</Trans> {/*avoiding-recreating-the-initial-state*/}

React saves the initial state once and ignores it on the next renders.
<Trans>React는 초기 state를 한 번 저장하고 다음 렌더링에서 이를 무시합니다.</Trans>

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

Although the result of `createInitialState(username)` is only used for the initial render, you're still calling this function on every render. This can be wasteful if it's creating large arrays or performing expensive calculations.
<Trans>`createInitialState(username)`의 결과는 초기 렌더링에만 사용되지만, 이후의 모든 렌더링에서도 여전히 이 함수를 호출하게 됩니다. 이는 큰 배열을 만들거나 값비싼 계산을 수행하는 경우 낭비가 될 수 있습니다.</Trans>

To solve this, you may **pass it as an _initializer_ function** to `useReducer` as the third argument instead:
<Trans>이 문제를 해결하려면 `useReducer` 세번 째 인수에 **초기화 함수를 전달**할 수 있습니다.</Trans>

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

Notice that you’re passing `createInitialState`, which is the *function itself*, and not `createInitialState()`, which is the result of calling it. This way, the initial state does not get re-created after initialization.
<Trans>함수를 호출한 결과인 `createInitialState()`가 아니라 함수 자체인 `createInitialState`를 전달하고 있다는 점에 유의하세요. 이렇게 하면 초기화 후에는 초기 state가 다시 생성되지 않습니다.</Trans>

In the above example, `createInitialState` takes a `username` argument. If your initializer doesn't need any information to compute the initial state, you may pass `null` as the second argument to `useReducer`.
<Trans>위의 예에서 `createInitialState` 는 `username`  인수를 받습니다. 초기화 함수가 초기 state를 계산하는 데 아무런 정보가 필요하지 않은 경우, `useReducer`의 두 번째 인수로 `null` 을 전달할 수 있습니다.</Trans>

<Recipes titleText="The difference between passing an initializer and passing the initial state directly" titleId="examples-initializer" translatedTitle="초기화 함수를 전달하는 것과 초기 state를 직접 전달하는 것의 차이점">

#### Passing the initializer function<Trans>초기화 함수 전달하기</Trans> {/*passing-the-initializer-function*/}

This example passes the initializer function, so the `createInitialState` function only runs during initialization. It does not run when component re-renders, such as when you type into the input.
<Trans>이 예제에서는 초기화 함수를 전달하므로 `createInitialState` 함수는 초기화 중에만 실행됩니다. input에 타이핑할 때와 같이 컴포넌트가 다시 렌더링될 때는 실행되지 않습니다.</Trans>

<Sandpack>

```js App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Passing the initial state directly<Trans>초기 state 직접 전달하기</Trans> {/*passing-the-initial-state-directly*/}

This example **does not** pass the initializer function, so the `createInitialState` function runs on every render, such as when you type into the input. There is no observable difference in behavior, but this code is less efficient.
<Trans>이 예제에서는 초기화 함수를 전달하지 **않으므로** input에 타이핑할 때와 같이 모든 렌더링에서 `createInitialState` 함수가 실행됩니다. 보기에는 큰 차이가 없어 보이지만 이 코드는 효율성이 떨어집니다.</Trans>

<Sandpack>

```js App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Unknown action: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Add</button>
      <ul>
        {state.todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### I've dispatched an action, but logging gives me the old state value<Trans>action을 dispatch했지만 로깅하면 이전 state값이 표시됩니다</Trans> {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

Calling the `dispatch` function **does not change state in the running code**:
<Trans>`dispatch` 함수를 호출해도 **실행 중인 코드의 state는 변경되지 않습니다:**</Trans>

```js {4,5,8}
function handleClick() {
  console.log(state.age);  // 42

  dispatch({ type: 'incremented_age' }); // Request a re-render with 43
  console.log(state.age);  // Still 42!

  setTimeout(() => {
    console.log(state.age); // Also 42!
  }, 5000);
}
```

This is because [states behaves like a snapshot.](/learn/state-as-a-snapshot) Updating state requests another render with the new state value, but does not affect the `state` JavaScript variable in your already-running event handler.
<Trans>[state는 스냅샷처럼 동작](/learn/state-as-a-snapshot)하기 때문입니다. state를 업데이트하면 새 state 값으로 다른 렌더링을 요청하지만 이미 실행 중인 이벤트 핸들러의 `state` JavaScript 변수에는 영향을 미치지 않습니다.</Trans>

If you need to guess the next state value, you can calculate it manually by calling the reducer yourself:
<Trans>다음 state 값을 추측해야 하는 경우 reducer를 직접 호출하여 수동으로 계산할 수 있습니다:</Trans>

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### I've dispatched an action, but the screen doesn't update<Trans>action을 dispatch 했지만 화면은 업데이트 되지 않습니다</Trans> {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

React will **ignore your update if the next state is equal to the previous state,** as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. This usually happens when you change an object or an array in state directly:
<Trans>[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교 결과 다음 state가 이전 state와 같다면 React는 업데이트를 무시합니다. 이는 보통 객체나 배열 state를 직접 변경(변이)할 때 발생합니다:</Trans>

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Wrong: mutating existing object
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Wrong: mutating existing object
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

You mutated an existing `state` object and returned it, so React ignored the update. To fix this, you need to ensure that you're always [updating objects in state](/learn/updating-objects-in-state) and [updating arrays in state](/learn/updating-arrays-in-state) instead of mutating them:
<Trans>기존 `state` 객체를 변경하고 반환했기 때문에 React가 업데이트를 무시했습니다. 이 문제를 해결하려면 변이를 시키는것이 아닌, 항상 [객체 state 업데이트](/learn/updating-objects-in-state) 및 [배열 state 업데이트](/learn/updating-arrays-in-state)를 해야 합니다.</Trans>

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Correct: creating a new object
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### A part of my reducer state becomes undefined after dispatching<Trans>dispatch하면 reducer state의 일부분이 undefined가 됩니다</Trans> {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

Make sure that every `case` branch **copies all of the existing fields** when returning the new state:
<Trans>새 state를 반환할 때 모든 `case` 브랜치가 **기존 필드를 모두 복사하는지** 확인하세요:</Trans>

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Don't forget this!
        age: state.age + 1
      };
    }
    // ...
```

Without `...state` above, the returned next state would only contain the `age` field and nothing else.
<Trans>위의`...state`가 없으면 반환된 다음 state에는 `age` 필드만 포함되고 다른 항목은 포함되지 않습니다.</Trans>

---

### My entire reducer state becomes undefined after dispatching<Trans>dispatch하면 모든 reducer state가 undefined가 됩니다</Trans> {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

If your state unexpectedly becomes `undefined`, you're likely forgetting to `return` state in one of the cases, or your action type doesn't match any of the `case` statements. To find why, throw an error outside the `switch`:
<Trans>state가 예기치 않게 `undefined` 가 된 경우, 케이스 중 하나에서 state를 반환하는 것을 잊었거나 액션 유형이 `case` 문 중 어느 것과도 일치하지 않을 수 있습니다. 이유를 찾으려면 `switch`외부에서 오류를 발생시키세요:</Trans>

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Unknown action: ' + action.type);
}
```

You can also use a static type checker like TypeScript to catch such mistakes.
<Trans>TypeScript와 같은 정적 유형 검사기를 사용하여 이러한 실수를 포착할 수도 있습니다.</Trans>

---

### I'm getting an error: "Too many re-renders"<Trans>"리렌더링이 너무 많습니다" 라는 오류가 발생합니다</Trans> {/*im-getting-an-error-too-many-re-renders*/}

You might get an error that says: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Typically, this means that you're unconditionally dispatching an action *during render*, so your component enters a loop: render, dispatch (which causes a render), render, dispatch (which causes a render), and so on. Very often, this is caused by a mistake in specifying an event handler:
<Trans>다음과 같은 오류가 발생할 수 있습니다: `리렌더링이 너무 많습니다. 무한 루프를 방지하기 위해  React가 렌더링 횟수를 제한합니다.` 일반적으로 이는 *매 렌더링시* 무조건적으로 액션을 디스패치하고 있음을 의미하는데, 따라서 컴포넌트는 렌더링, 디스패치(렌더링을 유발), 렌더링, 디스패치(렌더링을 유발) 등의 루프에 진입하게 되는 것입니다. 이벤트 핸들러를 지정하는 과정에서 실수로 인해 발생하는 경우가 많습니다:</Trans>

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

If you can't find the cause of this error, click on the arrow next to the error in the console and look through the JavaScript stack to find the specific `dispatch` function call responsible for the error.
<Trans>이 오류의 원인을 찾을 수 없는 경우, 콘솔에서 오류 옆에 있는 화살표를 클릭하여 자바스크립트 스택을 살펴보고, 오류의 원인이 되는 특정 `dispatch` 함수 호출을 찾아보세요.</Trans>

---

### My reducer or initializer function runs twice<Trans>reducer 또는 초기화 함수가 두 번 실행됩니다</Trans> {/*my-reducer-or-initializer-function-runs-twice*/}

In [Strict Mode](/reference/react/StrictMode), React will call your reducer and initializer functions twice. This shouldn't break your code.
<Trans>[Strict Mode](/reference/react/StrictMode)에서 React는 reducer 및 초기화 함수 함수를 두 번 호출합니다. 이로 인해 코드가 깨지지 않아야 합니다.</Trans>

This **development-only** behavior helps you [keep components pure.](/learn/keeping-components-pure) React uses the result of one of the calls, and ignores the result of the other call. As long as your component, initializer, and reducer functions are pure, this shouldn't affect your logic. However, if they are accidentally impure, this helps you notice the mistakes.
<Trans>이 **개발 전용** 동작은 [컴포넌트를 순수하게 유지하는](/learn/keeping-components-pure) 데 도움이 됩니다. React는 두 호출 중 하나의 결과만 사용하고 다른 호출 결과는 무시합니다. 컴포넌트, 초기화 함수, reducer함수가 모두 순수하다면 로직에 영향을 미치지 않습니다. 의도치 않게 이 중 일부가 불순한 경우 해당 실수를 알아내어 수정하는 데 도움이 될 것입니다.</Trans>

For example, this impure reducer function mutates an array in state:
<Trans>예를 들어 다음의 불순한 reducer 함수는 state의 배열을 변이합니다:</Trans>

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Mistake: mutating state
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

Because React calls your reducer function twice, you'll see the todo was added twice, so you'll know that there is a mistake. In this example, you can fix the mistake by [replacing the array instead of mutating it](/learn/updating-arrays-in-state#adding-to-an-array):
<Trans>React는 ruducer 함수를 두 번 호출하기 때문에 할 일이 두 번 추가되었으며, 이로부터 실수가 있음을 파악할 수 있습니다. 이 예제에서는 [배열을 변이하는 대신 교체하여](/learn/updating-arrays-in-state#adding-to-an-array) 실수를 수정할 수 있습니다:</Trans>

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Correct: replacing with new state
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

Now that this reducer function is pure, calling it an extra time doesn't make a difference in behavior. This is why React calling it twice helps you find mistakes. **Only component, initializer, and reducer functions need to be pure.** Event handlers don't need to be pure, so React will never call your event handlers twice.
<Trans>이제 이 reducer 함수는 순수 함수이므로 한 번 더 호출해도 동작에 차이가 없습니다. 그렇기 때문에 React가 두 번 호출하면 실수를 찾는 데 도움이 됩니다. **컴포넌트, 초기화 함수, 리듀서 함수는 반드시 순수해야 합니다.** 이벤트 핸들러는 순수할 필요가 없으며, React는 이벤트 핸들러를 두 번 호출하지 않습니다.</Trans>

Read [keeping components pure](/learn/keeping-components-pure) to learn more.
<Trans>더 자세한 내용은 [컴포넌트 순수성 유지](/learn/keeping-components-pure)에서 확인하세요.</Trans>
