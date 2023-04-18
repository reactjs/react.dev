---
title: Managing State
translatedTitle: state 관리
translators: [송윤지, 정재남]
---

<Intro>

As your application grows, it helps to be more intentional about how your state is organized and how the data flows between your components. Redundant or duplicate state is a common source of bugs. In this chapter, you'll learn how to structure your state well, how to keep your state update logic maintainable, and how to share state between distant components.
<Trans>애플리케이션이 성장함에 따라 state를 구성하는 방법과 컴포넌트 간에 데이터가 흐르는 방식에 대해 보다 의도적인 태도를 취하는 것이 도움이 됩니다. 불필요하거나 중복된 state는 버그의 일반적인 원인입니다. 이 장에서는 state를 잘 구조화하는 방법, state 업데이트 로직을 유지 관리하는 방법, 멀리 떨어져 있는 컴포넌트 간에 state를 공유하는 방법에 대해 알아봅니다.</Trans>

</Intro>

<YouWillLearn isChapter={true}>

* [How to think about UI changes as state changes](/learn/reacting-to-input-with-state)
* [How to structure state well](/learn/choosing-the-state-structure)
* [How to "lift state up" to share it between components](/learn/sharing-state-between-components)
* [How to control whether the state gets preserved or reset](/learn/preserving-and-resetting-state)
* [How to consolidate complex state logic in a function](/learn/extracting-state-logic-into-a-reducer)
* [How to pass information without "prop drilling"](/learn/passing-data-deeply-with-context)
* [How to scale state management as your app grows](/learn/scaling-up-with-reducer-and-context)

<TransBlock>
  * [state 변화에 따른 UI 변화를 생각하는 방법](/learn/reacting-to-input-with-state)
  * [state를 잘 구조화하는 방법](/learn/choosing-the-state-structure)
  * [컴포넌트 간에 state를 공유할 수 있도록 "끌어올리는" 방법](/learn/sharing-state-between-components)
  * [state의 보존 또는 재설정 여부를 제어하는 방법](/learn/preserving-and-resetting-state)
  * [복잡한 state 로직을 함수에 통합하는 방법](/learn/extracting-state-logic-into-a-reducer)
  * ["prop 드릴링" 없이 정보를 전달하는 방법](/learn/passing-data-deeply-with-context)
  * [앱이 성장함에 따라 state 관리를 확장하는 방법](/learn/scaling-up-with-reducer-and-context)
</TransBlock>

</YouWillLearn>

## Reacting to input with state<Trans>state로 입력에 반응하기</Trans> {/*reacting-to-input-with-state*/}

With React, you won't modify the UI from code directly. For example, you won't write commands like "disable the button", "enable the button", "show the success message", etc. Instead, you will describe the UI you want to see for the different visual states of your component ("initial state", "typing state", "success state"), and then trigger the state changes in response to user input. This is similar to how designers think about UI.
<Trans>React를 사용하면 코드에서 UI를 직접 수정하지 않습니다. 예를 들어 "버튼 비활성화", "버튼 활성화", "성공 메시지 표시" 등과 같은 명령을 작성하지 않습니다. 대신 컴포넌트의 다양한 시각적 state('초기 state', '입력 state', '성공 state')별로 표시하려는 UI를 구현한 다음, 사용자 입력에 대한 응답으로 state 변경을 트리거합니다. 이는 디자이너가 UI에 대해 생각하는 방식과 유사합니다.</Trans>

Here is a quiz form built using React. Note how it uses the `status` state variable to determine whether to enable or disable the submit button, and whether to show the success message instead.
<Trans>다음은 React를 사용해 만든 퀴즈 폼입니다. `status` 변수를 사용하여 제출 버튼의 활성화 또는 비활성화 여부와 성공 메시지를 대신 표시할지 말지 여부를 결정하는 방법에 주목하세요.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

Read [**Reacting to Input with State**](/learn/reacting-to-input-with-state) to learn how to approach interactions with a state-driven mindset.
<Trans>state 기반 사고방식으로 상호작용에 접근하는 방법을 알아보려면 [**state로 입력에 반응하기**](/learn/reacting-to-input-with-state)를 읽어보세요.</Trans>

</LearnMore>

## Choosing the state structure<Trans>state 구조 선택</Trans> {/*choosing-the-state-structure*/}

Structuring state well can make a difference between a component that is pleasant to modify and debug, and one that is a constant source of bugs. The most important principle is that state shouldn't contain redundant or duplicated information. If there's unnecessary state, it's easy to forget to update it, and introduce bugs!
<Trans>state를 잘 구조화하면 수정과 디버깅이 편한 컴포넌트와 버그가 끊임없이 발생하는 컴포넌트의 차이를 만들 수 있습니다. 가장 중요한 원칙은 state에 불필요하거나 중복된 정보를 포함하지 않아야 한다는 것입니다. 쓸데없는 state가 있으면 업데이트하는 것을 잊어버려 버그를 유발하기 쉽습니다!</Trans>

For example, this form has a **redundant** `fullName` state variable:
<Trans>예를 들어, 이 양식에는 불필요한 `fullName` state 변수가 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

You can remove it and simplify the code by calculating `fullName` while the component is rendering:
<Trans>컴포넌트가 렌더링되는 동안 `fullName`을 계산하여 이를 제거하고 코드를 단순화할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

This might seem like a small change, but many bugs in React apps are fixed this way.
<Trans>사소한 변화처럼 보일 수 있지만, React 앱의 많은 버그가 이런 방식으로 수정됩니다.</Trans>

<LearnMore path="/learn/choosing-the-state-structure">

Read [**Choosing the State Structure**](/learn/choosing-the-state-structure) to learn how to design the state shape to avoid bugs.
<Trans>버그를 피하기 위해 state 모양을 디자인하는 방법을 알아보려면 [**state 구조 선택하기**](/learn/choosing-the-state-structure)를 읽어보세요.</Trans>

</LearnMore>

## Sharing state between components<Trans>컴포넌트 간의 state 공유</Trans> {/*sharing-state-between-components*/}

Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props. This is known as "lifting state up", and it's one of the most common things you will do writing React code.
<Trans>때로는 두 컴포넌트의 state가 항상 함께 변경되기를 원할 때가 있습니다. 이렇게 하려면 두 컴포넌트에서 state를 제거하고 가장 가까운 공통 부모로 이동한 다음 프로퍼티를 통해 전달하면 됩니다. 이를 "state 올리기"라고 하며, React 코드를 작성할 때 가장 흔히 하는 작업 중 하나입니다.</Trans>

In this example, only one panel should be active at a time. To achieve this, instead of keeping the active state inside each individual panel, the parent component holds the state and specifies the props for its children.
<Trans>이 예제에서는 한 번에 하나의 패널만 활성화해야 합니다. 이를 위해 각 개별 패널 내부에 활성 state를 갖는 대신 부모 컴포넌트가 state를 갖고 자식에 대한 props를 지정합니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Show
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

Read [**Sharing State Between Components**](/learn/sharing-state-between-components) to learn how to lift state up and keep components in sync.
<Trans>[**컴포넌트 간의 state 공유**](/learn/sharing-state-between-components)를 읽고 state를 올리고 컴포넌트의 동기화를 유지하는 방법을 알아보세요.</Trans>

</LearnMore>

## Preserving and resetting state<Trans>state 보존 및 재설정</Trans> {/*preserving-and-resetting-state*/}

When you re-render a component, React needs to decide which parts of the tree to keep (and update), and which parts to discard or re-create from scratch. In most cases, React's automatic behavior works well enough. By default, React preserves the parts of the tree that "match up" with the previously rendered component tree.
<Trans>컴포넌트를 다시 렌더링할 때 React는 트리의 어떤 부분을 유지하고 업데이트할지, 어떤 부분을 버리거나 처음부터 다시 생성할지 결정해야 합니다. 대부분의 경우 React의 자동 동작은 충분히 잘 작동합니다. 기본적으로 React는 이전에 렌더링된 컴포넌트 트리와 "일치"하는 트리의 부분을 보존합니다.</Trans>

However, sometimes this is not what you want. In this chat app, typing a message and then switching the recipient does not reset the input. This can make the user accidentally send a message to the wrong person:
<Trans>그러나 때로는 이것이 원하는 것이 아닐 수도 있습니다. 예를 들어, 이 앱에서는 메시지를 입력한 후 수신자를 전환해도 입력 내용이 초기화되지 않습니다. 이로 인해 사용자가 실수로 엉뚱한 사람에게 메시지를 보낼 수 있습니다:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

React lets you override the default behavior, and *force* a component to reset its state by passing it a different `key`, like `<Chat key={email} />`. This tells React that if the recipient is different, it should be considered a *different* `Chat` component that needs to be re-created from scratch with the new data (and UI like inputs). Now switching between the recipients resets the input field--even though you render the same component.
<Trans>React를 사용하면 기본 동작을 재정의하고 컴포넌트에 다른 `key`를 전달하여 state를 강제로 초기화할 수 있습니다(예: `<Chat key={email} />`). 이는 수신자가 다른 경우, 새 데이터(및 input 과 같은 UI)로 처음부터 다시 만들어야 하는 다른 `Chat` 컴포넌트로 간주해야 한다는 것을 React에 알려줍니다. 이제 수신자를 전환하면 동일한 컴포넌트를 렌더링하더라도 입력 필드가 항상 초기화됩니다.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Chat to ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

<LearnMore path="/learn/preserving-and-resetting-state">

Read [**Preserving and Resetting State**](/learn/preserving-and-resetting-state) to learn the lifetime of state and how to control it.
<Trans>[**state 보존 및 초기화**](/learn/preserving-and-resetting-state)를 읽고 state의 수명과 state를 제어하는 방법에 대해 알아보세요.</Trans>

</LearnMore>

## Extracting state logic into a reducer<Trans>state 로직을 reducer로 추출하기</Trans> {/*extracting-state-logic-into-a-reducer*/}

Components with many state updates spread across many event handlers can get overwhelming. For these cases, you can consolidate all the state update logic outside your component in a single function, called "reducer". Your event handlers become concise because they only specify the user "actions". At the bottom of the file, the reducer function specifies how the state should update in response to each action!
<Trans>많은 state 업데이트가 여러 이벤트 핸들러에 분산되어 있는 컴포넌트는 과부하가 걸릴 수 있습니다. 이러한 경우 컴포넌트 외부의 모든 state 업데이트 로직을 "reducer"라는 단일 함수로 통합할 수 있습니다. 이벤트 핸들러는 사용자 "액션"만 지정하기 때문에 간결해집니다. 파일 맨 아래에서 reducer 함수는 각 액션에 대한 응답으로 state가 어떻게 업데이트되어야 하는지 지정합니다!</Trans>

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

Read [**Extracting State Logic into a Reducer**](/learn/extracting-state-logic-into-a-reducer) to learn how to consolidate logic in the reducer function.
<Trans>[**state 로직을 reducer로 추출하기**](/learn/extracting-state-logic-into-a-reducer)를 읽고 reducer 함수에서 로직을 통합하는 방법을 알아보세요.</Trans>

</LearnMore>

## Passing data deeply with context<Trans>context로 데이터 깊숙이 전달하기</Trans> {/*passing-data-deeply-with-context*/}

Usually, you will pass information from a parent component to a child component via props. But passing props can become inconvenient if you need to pass some prop through many components, or if many components need the same information. Context lets the parent component make some information available to any component in the tree below it—no matter how deep it is—without passing it explicitly through props.
<Trans>일반적으로 부모 컴포넌트에서 자식 컴포넌트로 정보를 전달할 때는 props를 통해 전달합니다. 하지만 일부 prop을 여러 컴포넌트에 전달해야 하거나 여러 컴포넌트에 동일한 정보가 필요한 경우 props 전달이 불편해질 수 있습니다. context를 사용하면 부모 컴포넌트가 prop을 통해 명시적으로 전달하지 않고도 그 아래 트리의 모든 컴포넌트에서 일부 정보를 사용할 수 있습니다(아무리 깊어도).</Trans>

Here, the `Heading` component determines its heading level by "asking" the closest `Section` for its level. Each `Section` tracks its own level by asking the parent `Section` and adding one to it. Every `Section` provides information to all components below it without passing props--it does that through context.
<Trans>여기서 `Heading` 컴포넌트는 가장 가까운 `Section`에 level을 '요청'하여 제목 level을 결정합니다. 각 `Section`은 부모 `Section`에 요청하고 여기에 1을 추가하여 자체 레벨을 추적합니다. 모든 `Section`은 prop을 전달하지 않고 context를 통해 그 아래의 모든 컴포넌트에 정보를 제공합니다.</Trans>

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/passing-data-deeply-with-context">

Read [**Passing Data Deeply with Context**](/learn/passing-data-deeply-with-context) to learn about using context as an alternative to passing props.
<Trans>[**context로 데이터 깊숙이 전달하기**](/learn/passing-data-deeply-with-context)를 읽고 prop을 전달하는 대신 context를 사용하는 방법에 대해 알아보세요.</Trans>

</LearnMore>

## Scaling up with reducer and context<Trans>Reducer와 Context로 확장하기</Trans> {/*scaling-up-with-reducer-and-context*/}

Reducers let you consolidate a component’s state update logic. Context lets you pass information deep down to other components. You can combine reducers and context together to manage state of a complex screen.
<Trans>reducer를 사용하면 컴포넌트의 state 업데이트 로직을 통합할 수 있습니다. context를 사용하면 다른 컴포넌트에 정보를 깊숙이 전달할 수 있습니다. reducer와 context를 함께 결합하여 복잡한 화면의 state를 관리할 수 있습니다.</Trans>

With this approach, a parent component with complex state manages it with a reducer. Other components anywhere deep in the tree can read its state via context. They can also dispatch actions to update that state.
<Trans>이 접근 방식을 사용하면 복잡한 state를 가진 상위 컴포넌트가 reducer로 이를 관리합니다. 트리의 깊은 곳에 있는 다른 컴포넌트는 context를 통해 해당 state를 읽을 수 있습니다. 또한 해당 state를 업데이트하기 위해 액션을 디스패치할 수도 있습니다.</Trans>

<Sandpack>

```js App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider
        value={dispatch}
      >
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

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

const initialTasks = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Add</button>
    </>
  );
}

let nextId = 3;
```

```js TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

Read [**Scaling Up with Reducer and Context**](/learn/scaling-up-with-reducer-and-context) to learn how state management scales in a growing app.
<Trans>성장하는 앱에서 state 관리가 어떻게 확장되는지 알아보려면 [**reducer 및 context를 통한 확장하기**](/learn/scaling-up-with-reducer-and-context)를 읽어보세요.</Trans>

</LearnMore>

## What's next?<Trans>다음 단계</Trans> {/*whats-next*/}

Head over to [Reacting to Input with State](/learn/reacting-to-input-with-state) to start reading this chapter page by page!
<Trans>이 챕터를 한 페이지씩 읽어보려면 [state로 입력에 반응하기](/learn/reacting-to-input-with-state)로 이동하세요!</Trans>

Or, if you're already familiar with these topics, why not read about [Escape Hatches](/learn/escape-hatches)?
<Trans>또는 이미 이러한 주제에 익숙하다면 [탈출구](/learn/escape-hatches)를 읽어보시는 건 어떨까요?</Trans>
