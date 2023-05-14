---
title: useContext
translators: [서민택, 고석영, 이나령]
---

<Intro>

`useContext` is a React Hook that lets you read and subscribe to [context](/learn/passing-data-deeply-with-context) from your component.
<Trans>`useContext`는 컴포넌트에서 [context](/learn/passing-data-deeply-with-context)를 읽고 구독할 수 있게 해주는 React Hook입니다.</Trans>

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Call `useContext` at the top level of your component to read and subscribe to [context.](/learn/passing-data-deeply-with-context)
<Trans>컴포넌트의 최상위 레벨에서 `useContext`를 호출하여 [context](/learn/passing-data-deeply-with-context)를 읽고 구독합니다.</Trans>

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `SomeContext`: The context that you've previously created with [`createContext`](/reference/react/createContext). The context itself does not hold the information, it only represents the kind of information you can provide or read from components.
<Trans>`context`: 이전에 [`createContext`](/reference/react/createContext)로 생성한 context입니다. context 자체는 정보를 보유하지 않으며, 컴포넌트에서 제공하거나 읽을 수 있는 정보의 종류를 나타낼 뿐입니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`useContext` returns the context value for the calling component. It is determined as the `value` passed to the closest `SomeContext.Provider` above the calling component in the tree. If there is no such provider, then the returned value will be the `defaultValue` you have passed to [`createContext`](/reference/react/createContext) for that context. The returned value is always up-to-date. React automatically re-renders components that read some context if it changes.
<Trans>`useContext`는 호출하는 컴포넌트에 대한 context 값을 반환합니다. 이 값은 호출한 컴포넌트에서 트리상 위에 있는 가장 가까운 `SomeContext.Provider`에 전달된 `value`입니다. 이러한 provider가 없는 경우 반환되는 값은 해당 context에 대해 [`createContext`](/reference/react/createContext)에 전달한 `defaultValue`가 됩니다. 반환된 값은 항상 최신 값입니다. React는 context가 변경되면 context를 읽는 컴포넌트를 자동으로 리렌더링합니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* `useContext()` call in a component is not affected by providers returned from the *same* component. The corresponding `<Context.Provider>` **needs to be *above*** the component doing the `useContext()` call.
<Trans>컴포넌트의 `useContext()` 호출은 *동일한* 컴포넌트에서 반환된 provider의 영향을 받지 않습니다. 해당 `<Context.Provider>`는 반드시 `useContext()` 호출을 수행하는 **컴포넌트의 *위*에 있어야 합니다.**</Trans>

* React **automatically re-renders** all the children that use a particular context starting from the provider that receives a different `value`. The previous and the next values are compared with the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. Skipping re-renders with [`memo`](/reference/react/memo) does not prevent the children receiving fresh context values.
<Trans>React는 변경된 `value`를 받는 provider부터 시작해서 해당 context를 사용하는 자식들에 대해서까지 전부 **자동으로 리렌더링**합니다. 이전 값과 다음 값은 [`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is)로 비교합니다. [`memo`](/reference/react/memo)로 리렌더링을 건너뛰어도 새로운 context 값을 수신하는 자식들을 막지는 못합니다.</Trans>

* If your build system produces duplicates modules in the output (which can happen with symlinks), this can break context. Passing something via context only works if `SomeContext` that you use to provide context and `SomeContext` that you use to read it are ***exactly* the same object**, as determined by a `===` comparison.
<Trans>빌드 시스템이 출력 결과에 중복 모듈을 생성하는 경우(심볼릭 링크를 사용하는 경우 발생할 수 있음) context가 손상될 수 있습니다. context를 통해 무언가를 전달하는 것은 `===` 비교에 의해 결정되는 것처럼 context를 제공하는 데 사용하는 `SomeContext`와 context를 읽는 데 사용하는 `SomeContext`가 ***정확하게* 동일한 객체**인 경우에만 작동합니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}


### Passing data deeply into the tree<Trans>트리 깊숙이 데이터 전달하기</Trans> {/*passing-data-deeply-into-the-tree*/}

Call `useContext` at the top level of your component to read and subscribe to [context.](/learn/passing-data-deeply-with-context)
<Trans>컴포넌트의 최상위 레벨에서 `useContext`를 호출하여 [context](/learn/passing-data-deeply-with-context)를 읽고 구독합니다.</Trans>

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext` returns the <CodeStep step={2}>context value</CodeStep> for the <CodeStep step={1}>context</CodeStep> you passed. To determine the context value, React searches the component tree and finds **the closest context provider above** for that particular context.
<Trans>`useContext`는 전달한<CodeStep step={1}>**context**</CodeStep>에 대한 <CodeStep step={2}>**context 값**</CodeStep>을 반환합니다. context 값을 결정하기 위해 React는 컴포넌트 트리를 검색하고 특정 context에 대해 **위에서 가장 가까운 context provider**를 찾습니다.</Trans>

To pass context to a `Button`, wrap it or one of its parent components into the corresponding context provider:
<Trans>context를 `Button`에 전달하려면 해당 버튼 또는 상위 컴포넌트 중 하나를 해당 context provider로 감쌉니다:</Trans>

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

It doesn't matter how many layers of components there are between the provider and the `Button`. When a `Button` *anywhere* inside of `Form` calls `useContext(ThemeContext)`, it will receive `"dark"` as the value.
<Trans>provider와 `Button` 사이에 얼마나 많은 컴포넌트 레이어가 있는지는 중요하지 않습니다. `Form`내부의`Button`이 `useContext(ThemeContext)`를 호출하면 `"dark"`를 값으로 받습니다.</Trans>

<Pitfall>

`useContext()` always looks for the closest provider *above* the component that calls it. It searches upwards and **does not** consider providers in the component from which you're calling `useContext()`.
<Trans>`useContext()`는 항상 그것을 호출하는 컴포넌트 *위*의 가장 가까운 provider를 찾습니다. `useContext()`를 호출하는 컴포넌트 내의 provider는 **고려하지 않습니다.**</Trans>

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Updating data passed via context<Trans>context를 통해 전달된 데이터 업데이트하기</Trans> {/*updating-data-passed-via-context*/}

Often, you'll want the context to change over time. To update context, combine it with [state.](/reference/react/useState) Declare a state variable in the parent component, and pass the current state down as the <CodeStep step={2}>context value</CodeStep> to the provider.
<Trans>시간이 지남에 따라 context가 변경되기를 원하는 경우가 종종 있습니다. context를 업데이트하려면 [state](/reference/react/useState)와 결합해야 합니다. 부모 컴포넌트에 state 변수를 선언하고 현재 state를 <CodeStep step={2}>context 값</CodeStep>으로 provider에 전달합니다.</Trans>

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext.Provider>
  );
}
```

Now any `Button` inside of the provider will receive the current `theme` value. If you call `setTheme` to update the `theme` value that you pass to the provider, all `Button` components will re-render with the new `'light'` value.
<Trans>이제 provider 내부의 모든 `Button`은 현재 `theme` 값을 받게 됩니다. provider에게 전달한 `theme` 값을 업데이트하기 위해 `setTheme`를 호출하면 모든 `Button` 컴포넌트가 새로운 `light` 값으로 리렌더링됩니다.</Trans>

<Recipes titleText="Examples of updating context" titleId="examples-basic" translatedTitle="context 업데이트 예시">

#### Updating a value via context<Trans>context를 통해 값 업데이트하기</Trans> {/*updating-a-value-via-context*/}

In this example, the `MyApp` component holds a state variable which is then passed to the `ThemeContext` provider. Checking the "Dark mode" checkbox updates the state. Changing the provided value re-renders all the components using that context.
<Trans>이 예제에서 `MyApp` 컴포넌트는 state 변수를 보유하고 있으며, 이 state 변수는 `ThemeContext` provider로 전달됩니다. "Dark mode" 체크박스를 선택하면 state가 업데이트됩니다. 제공된 값을 변경하면 해당 context를 사용하는 모든 컴포넌트가 리렌더링됩니다.</Trans>

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </ThemeContext.Provider>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Note that `value="dark"` passes the `"dark"` string, but `value={theme}` passes the value of the JavaScript `theme` variable with [JSX curly braces.](/learn/javascript-in-jsx-with-curly-braces) Curly braces also let you pass context values that aren't strings.
<Trans>`value="dark"`는 `"dark"`문자열을 전달하지만 `value={theme}`는 [JSX 중괄호](/learn/javascript-in-jsx-with-curly-braces)를 사용하여 JavaScript `theme` 변수 값을 전달합니다. 중괄호를 사용하면 문자열이 아닌 context 값도 전달할 수 있습니다.</Trans>

<Solution />

#### Updating an object via context<Trans>context를 통해 객체 업데이트</Trans> {/*updating-an-object-via-context*/}

In this example, there is a `currentUser` state variable which holds an object. You combine `{ currentUser, setCurrentUser }` into a single object and pass it down through the context inside the `value={}`. This lets any component below, such as `LoginButton`, read both `currentUser` and `setCurrentUser`, and then call `setCurrentUser` when needed.
<Trans>이번 예제에는 객체를 보관하는 `currentUser` state 변수가 있습니다. `{ currentUser, setCurrentUser }`를 하나의 객체로 결합하고 `value={}` 내부의 context를 통해 전달합니다. 이렇게 하면 `LoginButton`과 같은 자식으로 가지고 있는 모든 컴포넌트가 `currentUser`와 `setCurrentUser`를 모두 읽은 다음 필요할 때 `setCurrentUser`를 호출할 수 있습니다.</Trans>

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext.Provider>
  );
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>You logged in as {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Log in as Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### Multiple contexts<Trans>다중 context</Trans> {/*multiple-contexts*/}

In this example, there are two independent contexts. `ThemeContext` provides the current theme, which is a string, while `CurrentUserContext` holds the object representing the current user.
<Trans>이 예제에는 두 개의 독립적인 context가 있습니다. `ThemeContext`는 문자열인 현재 테마를 제공하고 `CurrentUserContext`는 현재 사용자를 나타내는 객체를 보유합니다.</Trans>

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Use dark mode
        </label>
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Extracting providers to a component<Trans>단일 컴포넌트로 providers 추출하기</Trans> {/*extracting-providers-to-a-component*/}

As your app grows, it is expected that you'll have a "pyramid" of contexts closer to the root of your app. There is nothing wrong with that. However, if you dislike the nesting aesthetically, you can extract the providers into a single component. In this example, `MyProviders` hides the "plumbing" and renders the children passed to it inside the necessary providers. Note that the `theme` and `setTheme` state is needed in `MyApp` itself, so `MyApp` still owns that piece of the state.
<Trans>앱이 커짐에 따라 루트에 더 가까운 context “피라미드”를 갖게 될 것으로 예상됩니다. 이는 잘못된 것이 아닙니다. 하지만 중첩이 미적으로 마음에 들지 않는다면 provider를 단일 컴포넌트로 추출할 수 있습니다. 이 예제에서 `MyProviders`는 "파이프라인"을 숨기고 필요한 provider 내부에 전달된 자식들을 렌더링합니다. `theme` 및 `setTheme` state는 `MyApp` 자체에 필요하므로 `MyApp`은 여전히 해당 state의 일부를 가지고 있다는 점에 유의하세요.</Trans>

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Scaling up with context and a reducer<Trans>context와 reducer를 통한 확장</Trans> {/*scaling-up-with-context-and-a-reducer*/}

In larger apps, it is common to combine context with a [reducer](/reference/react/useReducer) to extract the logic related to some state out of components. In this example, all the "wiring" is hidden in the `TasksContext.js`, which contains a reducer and two separate contexts.
<Trans>더 큰 앱에서는 context를 [reducer](/reference/react/useReducer)와 결합하여 컴포넌트에서 특정 state와 관련된 로직을 추출하는 것이 일반적입니다. 이 예제에서는 모든 "연결선"이 Reudcer와 두 개의 개별 context가 포함된 `TasksContext.js`에 숨겨져 있습니다.</Trans>

Read a [full walkthrough](/learn/scaling-up-with-reducer-and-context) of this example.
<Trans>이 예시에 대한 [전체 안내](/learn/scaling-up-with-reducer-and-context)를 읽어보세요.</Trans>

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
      <TasksDispatchContext.Provider value={dispatch}>
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

export default function AddTask() {
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

<Solution />

</Recipes>

---

### Specifying a fallback default value<Trans>fallback 기본값 지정하기</Trans> {/*specifying-a-fallback-default-value*/}

If React can't find any providers of that particular <CodeStep step={1}>context</CodeStep> in the parent tree, the context value returned by `useContext()` will be equal to the <CodeStep step={3}>default value</CodeStep> that you specified when you [created that context](/reference/react/createContext):
<Trans>React가 부모 트리에서 특정 <CodeStep step={1}>context</CodeStep>의 provider들을 찾을 수 없는 경우, `useContext()`가 반환하는 context 값은 [해당 context를 생성](/reference/react/createContext)할 때 지정한 <CodeStep step={3}>기본값</CodeStep>과 동일합니다:</Trans>

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

The default value **never changes**. If you want to update context, use it with state as [described above.](#updating-data-passed-via-context)
<Trans>기본값은 **절대 변경되지 않습니다**. context를 업데이트하려면 [앞서 설명된 대로](#updating-data-passed-via-context) state를 사용하세요.</Trans>

Often, instead of `null`, there is some more meaningful value you can use as a default, for example:
<Trans>`null` 대신 기본값으로 사용할 수 있는 더 의미 있는 값이 있는 경우가 많습니다, 예를 들어:</Trans>

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

This way, if you accidentally render some component without a corresponding provider, it won't break. This also helps your components work well in a test environment without setting up a lot of providers in the tests.
<Trans>이렇게 하면 실수로 해당 provider 없이 일부 컴포넌트를 렌더링해도 중단되지 않습니다. 또한 테스트 환경에서 많은 provider를 설정하지 않고도 컴포넌트가 테스트 환경에서 잘 작동하는 데 도움이 됩니다.</Trans>

In the example below, the "Toggle theme" button is always light because it's **outside any theme context provider** and the default context theme value is `'light'`. Try editing the default theme to be `'dark'`.
<Trans>아래 예시에서 '테마 전환' 버튼은 **테마 context provider 외부에 있고** 기본 context 테마 값이 `'light'`이므로 항상 밝게 표시됩니다. 기본 테마를 `'dark'`으로 편집해 보세요.</Trans>

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <Form />
      </ThemeContext.Provider>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Overriding context for a part of the tree<Trans>트리 일부에 대한 context 재정의하기</Trans> {/*overriding-context-for-a-part-of-the-tree*/}

You can override the context for a part of the tree by wrapping that part in a provider with a different value.
<Trans>트리의 일부분을 다른 값의 provider로 감싸 해당 부분에 대한 context를 재정의할 수 있습니다.</Trans>

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

You can nest and override providers as many times as you need.
<Trans>필요한 만큼 provider들을 중첩하고 재정의할 수 있습니다.</Trans>

<Recipes titleText="Examples of overriding context" translatedTitle="context 재정의 예시" >

#### Overriding a theme<Trans>테마 재정의하기</Trans> {/*overriding-a-theme*/}

Here, the button *inside* the `Footer` receives a different context value (`"light"`) than the buttons outside (`"dark"`).
<Trans>여기서 `Footer` *안쪽*의 버튼은 바깥쪽의 버튼(`”dark”`)과 다른 context 값(`”light”`)을 받습니다.</Trans>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext.Provider value="light">
        <Footer />
      </ThemeContext.Provider>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Automatically nested headings<Trans>자동으로 중첩되는 제목</Trans> {/*automatically-nested-headings*/}

You can "accumulate" information when you nest context providers. In this example, the `Section` component keeps track of the `LevelContext` which specifies the depth of the section nesting. It reads the `LevelContext` from the parent section, and provides the `LevelContext` number increased by one to its children. As a result, the `Heading` component can automatically decide which of the `<h1>`, `<h2>`, `<h3>`, ..., tags to use based on how many `Section` components it is nested inside of.
<Trans>context provider들을 중첩할 때 정보를 '누적'할 수 있습니다. 예시에서 `Section` 컴포넌트는 섹션 중첩의 깊이를 지정하는 `LevelContext`를 추적합니다. 이 컴포넌트는 부모 섹션에서 `LevelContext`를 읽고, 그 자식에게 1씩 증가한 `LevelContext` 숫자를 제공합니다. 그 결과, `Heading` 컴포넌트는 `<h1>`, `<h2>`, `<h3>`, ..., 태그 중 몇 개의 `Section` 컴포넌트 안에 중첩되어 있는지에 따라 어떤 태그를 사용할지 자동으로 결정할 수 있습니다.</Trans>

Read a [detailed walkthrough](/learn/passing-data-deeply-with-context) of this example.
<Trans>예시에 대한 [전체 안내](/learn/passing-data-deeply-with-context)를 읽어보세요.</Trans>

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

<Solution />

</Recipes>

---

### Optimizing re-renders when passing objects and functions<Trans>객체 및 함수 전달 시 리렌더링 최적화</Trans> {/*optimizing-re-renders-when-passing-objects-and-functions*/}

You can pass any values via context, including objects and functions.
<Trans>context를 통해 객체와 함수를 포함한 모든 값을 전달할 수 있습니다.</Trans>

```js [[2, 10, "{ currentUser, login }"]] 
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```

Here, the <CodeStep step={2}>context value</CodeStep> is a JavaScript object with two properties, one of which is a function. Whenever `MyApp` re-renders (for example, on a route update), this will be a *different* object pointing at a *different* function, so React will also have to re-render all components deep in the tree that call `useContext(AuthContext)`.
<Trans>여기서 <CodeStep step={2}>context 값</CodeStep>은 두 개의 프로퍼티를 가진 JavaScript 객체이며, 그 중 하나는 함수입니다. `MyApp`이 리렌더링할 때마다(예: 라우트 업데이트), 이것은 *다른* 함수를 가리키는 *다른* 객체가 될 것이므로 React는 `useContext(AuthContext)`를 호출하는 트리 깊숙한 곳의 모든 컴포넌트도  리렌더링해야 합니다.</Trans>

In smaller apps, this is not a problem. However, there is no need to re-render them if the underlying data, like `currentUser`, has not changed. To help React take advantage of that fact, you may wrap the `login` function with [`useCallback`](/reference/react/useCallback) and wrap the object creation into [`useMemo`](/reference/react/useMemo). This is a performance optimization:
<Trans>소규모 앱에서는 문제가 되지 않습니다. 그러나 `currentUser`와 같은 기초 데이터가 변경되지 않았다면 리렌더링할 필요가 없습니다. React가 이 사실을 활용할 수 있도록 `login` 함수를 [`useCallback`](/reference/react/useCallback)으로 감싸고 객체 생성은 [`useMemo`](/reference/react/useMemo)로 감싸면 됩니다. 이것은 성능 최적화를 위한 것입니다:</Trans>

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

As a result of this change, even if `MyApp` needs to re-render, the components calling `useContext(AuthContext)` won't need to re-render unless `currentUser` has changed.
<Trans>이 변경으로 인해 `MyApp`이 리렌더링해야 하는 경우에도 `currentUser`가 변경되지 않는 한 `useContext(AuthProvider)`를 호출하는 컴포넌트는 리렌더링할 필요가 없습니다. </Trans>

Read more about [`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) and [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)
<Trans>[`useMemo`](/reference/react/useMemo#skipping-re-rendering-of-components) 및 [`useCallbak`](/reference/react/useCallback#skipping-re-rendering-of-components)에 대해 더 읽어보세요.</Trans>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### My component doesn't see the value from my provider<Trans>컴포넌트가 provider의 값을 인식하지 못합니다</Trans> {/*my-component-doesnt-see-the-value-from-my-provider*/}
There are a few common ways that this can happen:
<Trans>이런 일이 발생하는 몇 가지 일반적인 경우가 있습니다:</Trans>

1. You're rendering `<SomeContext.Provider>` in the same component (or below) as where you're calling `useContext()`. Move `<SomeContext.Provider>` *above and outside* the component calling `useContext()`.
<Trans>`<SomeContext.Provider>`를 `useContext()`를 호출하는 컴포넌트 *위와 외부*로 이동합니다.</Trans>

2. You may have forgotten to wrap your component with `<SomeContext.Provider>`, or you might have put it in a different part of the tree than you thought. Check whether the hierarchy is right using [React DevTools.](/learn/react-developer-tools)
<Trans>컴포넌트를 `<SomeContext.Provider>`로 감싸는 것을 잊었거나 생각했던 것과 다른 트리 부분에 넣었을 수 있습니다. [React DevTools](/learn/react-developer-tools)를 사용하여 계층 구조가 올바른지 확인하세요.</Trans>

3. You might be running into some build issue with your tooling that causes `SomeContext` as seen from the providing component and `SomeContext` as seen by the reading component to be two different objects. This can happen if you use symlinks, for example. You can verify this by assigning them to globals like `window.SomeContext1` and `window.SomeContext2` and then checking whether `window.SomeContext1 === window.SomeContext2` in the console. If they're not the same, fix that issue on the build tool level.
<Trans>제공하는 컴포넌트에서 보는 `SomeContext` 와 읽는 컴포넌트에서 보는 `SomeContext`가 서로 다른 두 개의 객체가 되는 빌드 문제가 발생할 수 있습니다. 예를 들어 심볼릭 링크를 사용하는 경우 이런 문제가 발생할 수 있습니다. 이를 확인하려면 `window.SomeContext1` 및 `window.SomeContext2`와 같이 전역에 할당하고 콘솔에서 `window.SomeContext1 === window.SomeContext2`인지 확인하면 됩니다. 동일하지 않은 경우 빌드 도구 수준에서 해당 문제를 해결해야 합니다.</Trans>

### I am always getting `undefined` from my context although the default value is different<Trans>기본값이 다른데도 context에서 항상 `undefined`만 얻습니다</Trans> {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

You might have a provider without a `value` in the tree:
<Trans>트리에 `value`가 없는 provider가 있을 수 있습니다:</Trans>

```js {1,2}
// 🚩 Doesn't work: no value prop
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

If you forget to specify `value`, it's like passing `value={undefined}`.
<Trans>`value`를 지정하는 것을 잊어버리면 `value={undefined}`를 전달하는 것과 같습니다.</Trans>

You may have also mistakingly used a different prop name by mistake:
<Trans>실수로 다른 prop 명을 사용했을 수도 있습니다:</Trans>

```js {1,2}
// 🚩 Doesn't work: prop should be called "value"
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

In both of these cases you should see a warning from React in the console. To fix them, call the prop `value`:
<Trans>이 두 가지 경우 모두 콘솔에서 React 경고가 표시될 것입니다. 이를 수정하려면 `value` prop을 호출하세요:</Trans>

```js {1,2}
// ✅ Passing the value prop
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

Note that the [default value from your `createContext(defaultValue)` call](#specifying-a-fallback-default-value) is only used **if there is no matching provider above at all.** If there is a `<SomeContext.Provider value={undefined}>` component somewhere in the parent tree, the component calling `useContext(SomeContext)` *will* receive `undefined` as the context value.
<Trans>**[`createContext(defaultValue)` 호출의 기본값](#specifying-a-fallback-default-value)은 오직 위쪽에 일치하는 provider가 전혀 없는 경우**에만 적용된다는 점에 유의하세요. 부모 트리 어딘가에 `<SomeContext.Provider value={undefined}>` 컴포넌트가 있는 경우, `useContext(SomeContext)`를 호출하는 컴포넌트는 `undefined`를 context 값으로 *받습니다.*</Trans>