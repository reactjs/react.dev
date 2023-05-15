---
title: createContext
translators: [류재준, 이나령]
---

<Intro>

`createContext` lets you create a [context](https://react.dev/learn/passing-data-deeply-with-context) that components can provide or read.
<Trans>`createContext`를 사용하면 컴포넌트가 제공하거나 읽을 수 있는 [컨텍스트](/learn/passing-data-deeply-with-context)를 만들 수 있습니다.</Trans>

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Call `createContext` outside of any components to create a context.
<Trans>컴포넌트 외부에서 `createContext`를 호출하여 컨텍스트를 생성하세요.</Trans>


```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예제를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `defaultValue`: The value that you want the context to have when there is no matching context provider in the tree above the component that reads context. If you don't have any meaningful default value, specify `null`. The default value is meant as a "last resort" fallback. It is static and never changes over time.
<Trans outdent>`defaultValue`: 컨텍스트를 읽는 컴포넌트 상위 트리에 일치하는 컨텍스트 provider가 없을 때 이 컨텍스트가 갖도록 할 값입니다. 의미 있는 기본값이 없다면 `null`을 지정하세요. 기본값은 "가장 마지막 수단"으로 사용됩니다. 기본값은 정적이며 시간이 지나도 절대 변경되지 않습니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`createContext` returns a context object.
<Trans>`createContext` 는 컨텍스트 객체를 반환합니다.</Trans>


**The context object itself does not hold any information.** It represents _which_ context other components can read or provide. Typically, you will use [`SomeContext.Provider`](#provider) in components above to specify the context value, and call [`useContext(SomeContext)`](/reference/react/useContext) in components below to read it. The context object has a few properties:
<Trans>**컨텍스트 객체 자체는 어떠한 정보도 보유하지 않습니다.** 다른 컴포넌트가 _읽거나 제공할 수 있는_ 컨텍스트를 나타냅니다. 일반적으로 상위 컴포넌트에서 [`SomeContext.Provider`](#provider)를 사용해 컨텍스트 값을 지정하고, 하위 컴포넌트에서 [`useContext(SomeContext)`](/reference/react/useContext)를 호출해 컨텍스트 값을 읽습니다. 컨텍스트 객체에는 몇 가지 속성이 있습니다:</Trans>

* `SomeContext.Provider` lets you provide the context value to components.
<Trans>`SomeContext.Provider`를 사용하면 컴포넌트에 컨텍스트 값을 제공할 수 있습니다.</Trans>

* `SomeContext.Consumer` is an alternative and rarely used way to read the context value.
<Trans>`SomeContext.Consumer` 는 컨텍스트 값을 읽는 또다른 방법이며 거의 사용되지 않습니다.</Trans>

---

### `SomeContext.Provider` {/*provider*/}

Wrap your components into a context provider to specify the value of this context for all components inside:
<Trans>컴포넌트를 컨텍스트 provider로 감싸 내부의 모든 컴포넌트에 대한 이 컨텍스트의 값을 지정하세요:</Trans>

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### Props {/*provider-props*/}

* `value`: The value that you want to pass to all the components reading this context inside this provider, no matter how deep. The context value can be of any type. A component calling [`useContext(SomeContext)`](/reference/react/useContext) inside of the provider receives the `value` of the innermost corresponding context provider above it.
<Trans outdent>`value` : 이 값은 해당 provider 내에서 이 컨텍스트를 읽는 모든 컴포넌트에 전달하려는 값으로, 깊이에 상관없이 전달할 수 있습니다. 컨텍스트 값은 모든 타입이 될 수 있습니다. provider 내부에서 [`useContext(SomeContext)`](/reference/react/useContext)를 호출하는 컴포넌트는 그 위에 있는 가장 안쪽에 해당하는 컨텍스트 provider의 `value`를 받습니다.</Trans>

---

### `SomeContext.Consumer` {/*consumer*/}

Before `useContext` existed, there was an older way to read context:
<Trans>`useContext` 이전에는 컨텍스트를 읽는 오래된 방법이 있었습니다:</Trans>

```js
function Button() {
  // 🟡 Legacy way (not recommended)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

Although this older way still works, but **newly written code should read context with [`useContext()`](/reference/react/useContext) instead:**
<Trans>이 오래된 방법은 여전히 동작하지만 **새로 작성된 코드는 대신 [`useContext()`](/reference/react/useContext)를 사용하여 컨텍스트를 읽어야 합니다:**</Trans>

```js
function Button() {
  // ✅ Recommended way
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`: A function. React will call the function you pass with the current context value determined by the same algorithm as [`useContext()`](/reference/react/useContext) does, and render the result you return from this function. React will also re-run this function and update the UI whenever the context from the parent components changes.
<Trans outdent>`자식요소` : 함수입니다. React는 [`useContext()`](/reference/react/useContext)와 동일한 알고리즘에 의해 결정된 현재 컨텍스트 값으로 전달한 함수를 호출하고, 이 함수에서 반환한 결과를 렌더링합니다. 또한 React는 부모 컴포넌트의 컨텍스트가 변경될 때마다 이 함수를 다시 실행하고 UI를 업데이트합니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Creating context<Trans>context 생성하기</Trans> {/*creating-context*/}

Context lets components [pass information deep down](/learn/passing-data-deeply-with-context) without explicitly passing props.
<Trans>컨텍스트는 컴포넌트가 프로퍼티를 명시적으로 전달하지 않고도 [정보를 깊숙이 전달할 수 있게](/learn/passing-data-deeply-with-context) 해줍니다.</Trans>

Call `createContext` outside any components to create one or more contexts.
<Trans>하나 이상의 컨텍스트를 생성하려면 컴포넌트 외부에서 createContext를 호출하세요.</Trans>

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` returns a <CodeStep step={1}>context object</CodeStep>. Components can read context by passing it to [`useContext()`](/reference/react/useContext):
<Trans>`createContext`는 <CodeStep step={1}>컨텍스트 객체</CodeStep>를 반환합니다. 컴포넌트는 컨텍스트를 [`useContext()`](/reference/react/useContext)에 전달하여 컨텍스트를 읽을 수 있습니다:</Trans>

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

By default, the values they receive will be the <CodeStep step={3}>default values</CodeStep> you have specified when creating the contexts. However, by itself this isn't useful because the default values never change.
<Trans>기본적으로 수신되는 값은 컨텍스트를 만들 때 지정한 <CodeStep step={3}>기본값</CodeStep>이 됩니다. 그러나 기본값은 절대 변경되지 않기 때문에 그 자체로는 유용하지 않습니다.</Trans>

Context is useful because you can **provide other, dynamic values from your components:**
<Trans>컨텍스트가 유용한 이유는 다음과 같이 **컴포넌트에 다른 동적 값을 제공할 수 있기 때문**입니다:</Trans>

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Now the `Page` component and any components inside it, no matter how deep, will "see" the passed context values. If the passed context values change, React will re-render the components reading the context as well.
<Trans>이제 `Page` 컴포넌트와 그 안에 있는 모든 컴포넌트는 아무리 깊숙이 들어가더라도 전달된 컨텍스트 값을 "바라보게" 됩니다. 만약 전달된 컨텍스트 값이 변경되면, React는 컨텍스트를 읽는 컴포넌트도 다시 렌더링합니다.</Trans>

[Read more about reading and providing context and see examples.](/reference/react/useContext)
<Trans>[컨텍스트 읽기 및 제공에 대한 자세한 내용과 예시를 참조하세요.](/reference/react/useContext)</Trans>

---

### Importing and exporting context from a file<Trans>파일에서 컨텍스트 import 및 export하기</Trans> {/*importing-and-exporting-context-from-a-file*/}

Often, components in different files will need access to the same context. This is why it's common to declare contexts in a separate file. Then you can use the [`export` statement](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) to make context available for other files:
<Trans>서로 다른 파일에 있는 컴포넌트가 동일한 컨텍스트에 액세스해야 하는 경우가 종종 있습니다. 그렇기 때문에 컨텍스트를 별도의 파일에 선언하는 것이 일반적입니다. 그런 다음 [`export` 구문](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export)을 사용하여 다른 파일에서 컨텍스트를 사용할 수 있도록 설정할 수 있습니다:</Trans>

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

Components declared in other files can then use the [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) statement to read or provide this context:
<Trans>다른 파일에서 선언된 컴포넌트는 [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) 구문을 사용하여 이 컨텍스트를 읽거나 제공할 수 있습니다:</Trans>

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

This works similar to [importing and exporting components.](/learn/importing-and-exporting-components)
<Trans>이는 [컴포넌트 import 및 export](/learn/importing-and-exporting-components)와 유사한 방식으로 작동합니다.</Trans>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### I can't find a way to change the context value<Trans>컨텍스트 값을 변경하는 방법을 찾을 수 없습니다</Trans> {/*i-cant-find-a-way-to-change-the-context-value*/}


Code like this specifies the *default* context value:
<Trans>다음과 같은 코드는 *기본* 컨텍스트 값을 지정합니다:</Trans>

```js
const ThemeContext = createContext('light');
```

This value never changes. React only uses this value as a fallback if it can't find a matching provider above.
<Trans>이 값은 절대 변하지 않습니다. React는 위에서 일치하는 provider를 찾을 수 없는 경우에만 이 값을 대체하여 사용합니다.</Trans>

To make context change over time, [add state and wrap components in a context provider.](/reference/react/useContext#updating-data-passed-via-context)
<Trans>시간이 지남에 따라 컨텍스트가 변경되도록 하려면 [컨텍스트 provider에 state를 추가](/reference/react/useContext#updating-data-passed-via-context)하고 컴포넌트를 감싸세요.</Trans>

