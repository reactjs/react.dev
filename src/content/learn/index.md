---
title: Quick Start
translatedTitle: 빠른 시작
---

<Intro>

Welcome to the React documentation! This page will give you an introduction to the 80% of React concepts that you will use on a daily basis.
<Trans>React 문서에 오신 것을 환영합니다! 이 페이지에서는 여러분이 매일 사용하게 될 React 개념의 80%에 대해 소개합니다.</Trans>

</Intro>

<YouWillLearn>

- How to create and nest components
- How to add markup and styles
- How to display data
- How to render conditions and lists
- How to respond to events and update the screen
- How to share data between components

<TransBlock>
- 컴포넌트를 만들고 중첩하는 방법
- 마크업 및 스타일을 추가하는 방법
- 데이터를 표시하는 방법
- 조건 및 목록을 렌더링하는 방법
- 이벤트에 응답하고 화면을 업데이트하는 방법
- 컴포넌트 간에 데이터를 공유하는 방법
</TransBlock>

</YouWillLearn>

## Creating and nesting components<br/><Trans>컴포넌트 생성 및 중첩하기</Trans> {/*components*/}

React apps are made out of *components*. A component is a piece of the UI (user interface) that has its own logic and appearance. A component can be as small as a button, or as large as an entire page.
<Trans>React 앱은 *컴포넌트*로 만들어집니다. 컴포넌트는 고유한 로직과 모양을 가진 UI(사용자 인터페이스)의 일부입니다. 컴포넌트는 버튼만큼 작을 수도 있고 전체 페이지만큼 클 수도 있습니다.</Trans>

React components are JavaScript functions that return markup:
<Trans>리액트 컴포넌트는 마크업을 반환하는 자바스크립트 함수입니다:</Trans>

```js
function MyButton() {
  return (
    <button>I'm a button</button>
  );
}
```

Now that you've declared `MyButton`, you can nest it into another component:
<Trans>이제 `MyButton`을 선언했으므로 다른 컴포넌트에 중첩할 수 있습니다:</Trans>

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

Notice that `<MyButton />` starts with a capital letter. That's how you know it's a React component. React component names must always start with a capital letter, while HTML tags must be lowercase.
<Trans>`<MyButton />`가 대문자로 시작하는 것에 주목하세요. 이것이 React 컴포넌트라는 것을 알 수 있는 방법입니다. React 컴포넌트 이름은 항상 대문자로 시작해야 하고 HTML 태그는 소문자로 시작해야 합니다.</Trans>

Have a look at the result:
<Trans>결과를 살펴보세요:</Trans>

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      I'm a button
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

<Extra>

#### 다양한 방법으로 컴포넌트 추가하기 - @이승효 {/*다양한-방법으로-컴포넌트-추가하기---이승효*/}

React 컴포넌트는 항상 대문자로 시작해야 하지만, 함수명이 대문자일 필요는 없습니다. **그러나 JSX 안에서 컴포넌트가 사용될 때에는 반드시 대문자로 시작해야 한다는 것에 유의하세요.** 

아래에서는 함수가 소문자로 시작할 경우에도 문제 없이 동작하도록 하는 여러 기법을 소개합니다.

- `default export`의 경우:
  - `import`시에 대문자로 시작하는 새로운 이름을 부여 (예: `DefaultProfile`)
- `named export`의 경우:
  - `import`시에 `as`로 대문자로 시작하는 새로운 이름을 부여 (예: `NamedTwo`)
  - 컴포넌트 **외부**에서 대문자로 시작하는 새로운 변수에 할당 (예: `NamedThree`)
  - 컴포넌트 **내부**에서 대문자로 시작하는 새로운 변수에 할당 (예: `NamedFour`)

<Sandpack>

```js App.js
import DefaultProfile from "./ExportedDefaultProfile";
import {
  NamedExportedProfileOne,
  namedExportProfileTwo as NamedTwo,
  namedExportProfileThree
} from "./Profiles";

const user = {
  imageUrl: "https://i.imgur.com/yXOvdOSs.jpg",
  imageSize: 90
};

const NamedThree = namedExportProfileThree;

export default function App() {
  const NamedFour = namedExportProfileThree;
  return (
    <>
      <DefaultProfile user={{ ...user, name: "DefaultProfile" }} />
      <NamedExportedProfileOne user={{ ...user, name: "NamedExported" }} />
      <NamedTwo user={{ ...user, name: "namedExported2" }} />
      <NamedThree user={{ ...user, name: "NamedThree" }} />
      <NamedFour user={{ ...user, name: "NamedFour" }} />
    </>
  );
}
```

```js ExportedDefaultProfile.js
export default function exportedDefault({ user }) {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={"Photo of " + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```js Profiles.js
export function NamedExportedProfileOne({ user }) {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={"Photo of " + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}

export function namedExportProfileTwo({ user }) {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={"Photo of " + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}

export function namedExportProfileThree({ user }) {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={"Photo of " + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

</Sandpack>

</Extra>

The `export default` keywords specify the main component in the file. If you're not familiar with some piece of JavaScript syntax, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) and [javascript.info](https://javascript.info/import-export) have great references.
<Trans>`export default` 키워드는 파일의 주요 컴포넌트를 지정합니다. 자바스크립트 구문에 익숙하지 않은 경우 [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) 및 [javascript.info](https://javascript.info/import-export)를 참조하세요.</Trans>


## Writing markup with JSX<br/><Trans>JSX로 마크업 작성하기</Trans> {/*writing-markup-with-jsx*/}

The markup syntax you've seen above is called *JSX*. It is optional, but most React projects use JSX for its convenience. All of the [tools we recommend for local development](/learn/installation) support JSX out of the box.
<Trans>위에서 본 마크업 구문을 *JSX*라고 합니다. 선택 사항이지만 대부분의 React 프로젝트는 편의성을 위해 JSX를 사용합니다. [로컬 개발을 위해 권장하는 모든 도구](/learn/installation)는 JSX를 기본적으로 지원합니다.</Trans>

JSX is stricter than HTML. You have to close tags like `<br />`. Your component also can't return multiple JSX tags. You have to wrap them into a shared parent, like a `<div>...</div>` or an empty `<>...</>` wrapper:
<Trans>JSX는 HTML보다 더 엄격합니다. `<br />`과 같은 태그를 닫아야 합니다. 또한 컴포넌트는 여러 개의 JSX 태그를 반환할 수 없습니다. `<div>...</div>` 또는 빈 `<>...</>` 래퍼와 같이 하나의 공유 부모로 감싸야 합니다:</Trans>

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>About</h1>
      <p>Hello there.<br />How do you do?</p>
    </>
  );
}
```

If you have a lot of HTML to port to JSX, you can use an [online converter.](https://transform.tools/html-to-jsx)
<Trans>JSX로 포팅할 HTML이 많은 경우 [온라인 변환기](https://transform.tools/html-to-jsx)를 사용할 수 있습니다.</Trans>

## Adding styles<br/><Trans>스타일 추가하기</Trans> {/*adding-styles*/}

In React, you specify a CSS class with `className`. It works the same way as the HTML [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) attribute:
<Trans>React에서는 `className`으로 CSS 클래스를 지정합니다. HTML [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) 어트리뷰트와 같은 방식으로 작동합니다:</Trans>

```js
<img className="avatar" />
```

Then you write the CSS rules for it in a separate CSS file:
<Trans>그런 다음 별도의 CSS 파일에 해당 CSS 규칙을 작성합니다:</Trans>

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React does not prescribe how you add CSS files. In the simplest case, you'll add a [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) tag to your HTML. If you use a build tool or a framework, consult its documentation to learn how to add a CSS file to your project.
<Trans>React는 CSS 파일을 추가하는 방법을 규정하지 않습니다. 가장 간단한 경우 HTML에 [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) 태그를 추가하면 됩니다. 빌드 도구나 프레임워크를 사용하는 경우 해당 문서를 참조하여 프로젝트에 CSS 파일을 추가하는 방법을 알아보세요.</Trans>

## Displaying data<br/><Trans>데이터 표시하기</Trans> {/*displaying-data*/}

JSX lets you put markup into JavaScript. Curly braces let you "escape back" into JavaScript so that you can embed some variable from your code and display it to the user. For example, this will display `user.name`:
<Trans>JSX를 사용하면 자바스크립트에 마크업을 넣을 수 있습니다. 중괄호를 사용하면 코드에서 일부 변수를 삽입하여 사용자에게 표시할 수 있도록 자바스크립트로 "이스케이프"할 수 있습니다. 예를 들어 `user.name`이 표시됩니다:</Trans>


```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

You can also "escape into JavaScript" from JSX attributes, but you have to use curly braces *instead of* quotes. For example, `className="avatar"` passes the `"avatar"` string as the CSS class, but `src={user.imageUrl}` reads the JavaScript `user.imageUrl` variable value, and then passes that value as the `src` attribute:
<Trans>JSX 속성에서 "자바스크립트로 이스케이프"할 수도 있지만 따옴표 *대신* 중괄호를 사용해야 합니다. 예를 들어 `className="avatar"`는 `"avatar"` 문자열을 CSS 클래스로 전달하지만 `src={user.imageUrl}`는 JavaScript `user.imageUrl` 변수 값을 읽은 다음 해당 값을 `src` 어트리뷰트로 전달합니다:</Trans>

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

You can put more complex expressions inside the JSX curly braces too, for example, [string concatenation](https://javascript.info/operators#string-concatenation-with-binary):
<Trans>JSX 중괄호 안에 [문자열 연결](https://javascript.info/operators#string-concatenation-with-binary)과 같이 더 복잡한 표현식을 넣을 수도 있습니다:</Trans>

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

In the above example, `style={{}}` is not a special syntax, but a regular `{}` object inside the `style={ }` JSX curly braces. You can use the `style` attribute when your styles depend on JavaScript variables.
<Trans>위의 예에서 `style={{}}`은 특별한 구문이 아니라 `style={ }` JSX 중괄호 안에 있는 일반 `{}` 객체입니다. 스타일이 자바스크립트 변수에 의존할 때 `style` 속성을 사용할 수 있습니다.</Trans>

## Conditional rendering<br/><Trans>조건부 렌더링</Trans> {/*conditional-rendering*/}

In React, there is no special syntax for writing conditions. Instead, you'll use the same techniques as you use when writing regular JavaScript code. For example, you can use an [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) statement to conditionally include JSX:
<Trans>React에서는 조건을 작성하기 위한 특별한 문법이 없습니다. 대신 일반 자바스크립트 코드를 작성할 때 사용하는 것과 동일한 기법을 사용하면 됩니다. 예를 들어, [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) 문을 사용하여 조건부로 JSX를 포함할 수 있습니다:</Trans>

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

If you prefer more compact code, you can use the [conditional `?` operator.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) Unlike `if`, it works inside JSX:
<Trans>보다 간결한 코드를 원한다면 [조건부 `?` 연산자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)를 사용할 수 있습니다. `if`와 달리 JSX 내부에서 작동합니다:</Trans>


```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

When you don't need the `else` branch, you can also use a shorter [logical `&&` syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):
<Trans>`else` 분기가 필요하지 않은 경우 더 짧은 [논리 `&&` 구문](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation)을 사용할 수도 있습니다:</Trans>


```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

All of these approaches also work for conditionally specifying attributes. If you're unfamiliar with some of this JavaScript syntax, you can start by always using `if...else`.
<Trans>이 모든 접근 방식은 조건부로 속성을 지정할 때도 작동합니다. 이러한 자바스크립트 구문에 익숙하지 않다면 항상 `if...else`를 사용하는 것으로 시작할 수 있습니다.</Trans>

<Extra>
#### 논리 연산자 `&&`를 이용한 조건부 렌더링 시 주의사항 - @이승효 {/*논리-연산자-를-이용한-조건부-렌더링-시-주의사항---이승효*/}

<Sandpack>

```js App.js
import Profile from './Profile.js';
const user = [
  {
    id: 0,
    name: "Hedy Lamarr",
    imageUrl: "https://i.imgur.com/yXOvdOSs.jpg",
    imageSize: 90
  },
  {
    id: "Hedy Lamarr1",
    name: "Hedy Lamarr",
    imageUrl: "https://i.imgur.com/yXOvdOSs.jpg",
    imageSize: 90
  }
];

export default function App() {
  return (
    <>
      {user.map(
        (userInfo) =>
          userInfo.id && <Profile user={userInfo} key={userInfo.id} />
      )}
    </>
  );
}
```

```js Profile.js hidden
export default function Profile({ user }) {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={"Photo of " + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

</Sandpack>

위의 예제는 user의 id의 존재 여부에 따라 논리 연산자 `&&` 를 사용해 조건부 렌더링을 구현한 예제입니다. JavaScript에서 0은 `falsy` 값이므로 아무것도 렌더링이 되지 않아야 합니다. 하지만 위의 예제에서는 0이 렌더링 되어 보여집니다.  왜 그럴까요? JavaScript에서 `&&` 연산자는 앞의 조건이 `falsy` 한 값이라면, 해당 객체를 반환하기 때문에 위의 예제에서는 0이 반환 되어 렌더링 되는 것입니다. [조건부 렌더링 - "&&의 왼쪽에 숫자를 넣지 마세요."](/learn/conditional-rendering)에서 다시 다룰 것입니다. [MDN - falsy](https://developer.mozilla.org/ko/docs/Glossary/Falsy#%EB%85%BC%EB%A6%AC_and_%EC%97%B0%EC%82%B0%EC%9E%90)도 참고하세요. 
</Extra>

## Rendering lists<br/><Trans>목록 렌더링</Trans> {/*rendering-lists*/}

You will rely on JavaScript features like [`for` loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) and the [array `map()` function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) to render lists of components.
<Trans>컴포넌트 목록을 렌더링하려면 [`for` loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) 및 [배열 `map()` 함수](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)와 같은 JavaScript 기능을 사용해야 합니다. </Trans>

For example, let's say you have an array of products:
<Trans>예를 들어 다음과 같은 상품 배열이 있다고 가정해 보겠습니다:</Trans>

```js
const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

Inside your component, use the `map()` function to transform an array of products into an array of `<li>` items:
<Trans>컴포넌트 내에서 `map()` 함수를 사용하여 상품 배열을 `<li>` 항목 배열로 변환합니다:</Trans>

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

Notice how `<li>` has a `key` attribute. For each item in a list, you should pass a string or a number that uniquely identifies that item among its siblings. Usually, a key should be coming from your data, such as a database ID. React uses your keys to know what happened if you later insert, delete, or reorder the items.
<Trans>`<li>`에 `key` 속성이 있는 것을 주목하세요. 목록의 각 항목에 대해, 형제 항목 중에서 해당 항목을 고유하게 식별하는 문자열 또는 숫자를 전달해야 합니다. 일반적으로 키는 데이터베이스 ID와 같은 데이터에서 가져와야 합니다. React는 나중에 항목을 삽입, 삭제 또는 재정렬할 때 어떤 일이 일어났는지 이해하기 위해 키를 사용합니다.</Trans>

<Sandpack>

```js
const products = [
  { title: 'Cabbage', isFruit: false, id: 1 },
  { title: 'Garlic', isFruit: false, id: 2 },
  { title: 'Apple', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Responding to events<br/><Trans>이벤트에 응답하기</Trans> {/*responding-to-events*/}

You can respond to events by declaring *event handler* functions inside your components:
<Trans>컴포넌트 내부에 *이벤트 핸들러* 함수를 선언하여 이벤트에 응답할 수 있습니다:</Trans>

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

Notice how `onClick={handleClick}` has no parentheses at the end! Do not _call_ the event handler function: you only need to *pass it down*. React will call your event handler when the user clicks the button.
<Trans>`onClick={handleClick}`의 끝에 괄호가 없는 것을 주목하세요! 이벤트 핸들러 함수를 *호출*하지 마세요. 단지 *전달*만 하면 됩니다. React는 사용자가 버튼을 클릭할 때 이벤트 핸들러를 호출합니다.</Trans>

<Extra>

#### `onClick={handleClick()}`으로 전달했을 때 alert이 두 번 뜨는 현상 - @정재남 {/*onclickhandleclick으로-전달했을-때-alert이-두-번-뜨는-현상---정재남*/}
    
이런 현상이 발생하는 이유는 `development 환경`에서  `<StrictMode>` 컴포넌트의 하위에 있는 컴포넌트가 처음 렌더될 때, React가 오류 검사 등을 위해 한 번 더 렌더링을 발동시키기 때문입니다. `production 환경`에서는 두 번 렌더링되는 현상은 발생하지 않을 것이니 안심하세요. 자세한 내용은 [`<StrictMode>`](/reference/react/StrictMode)에서 확인하세요.
</Extra>

## Updating the screen<br/><Trans>화면 업데이트하기</Trans> {/*updating-the-screen*/}

Often, you'll want your component to "remember" some information and display it. For example, maybe you want to count the number of times a button is clicked. To do this, add *state* to your component.
<Trans>컴포넌트가 특정 정보를 “기억”하여 표시하기를 원하는 경우가 종종 있습니다. 예를 들어 버튼이 클릭된 횟수를 카운트하고 싶을 수 있습니다. 이렇게 하려면 컴포넌트에 *state*를 추가하면 됩니다.</Trans>

First, import [`useState`](/reference/react/useState) from React:
<Trans>먼저 React에서 [`useState`](/reference/react/useState)를 가져옵니다:</Trans>

```js
import { useState } from 'react';
```

Now you can declare a *state variable* inside your component:
<Trans>이제 컴포넌트 내부에 *state 변수*를 선언할 수 있습니다:</Trans>

```js
function MyButton() {
  const [count, setCount] = useState(0);
```

You’ll get two things from `useState`: the current state (`count`), and the function that lets you update it (`setCount`). You can give them any names, but the convention is to write `[something, setSomething]`.
<Trans>`useState`에서 두 가지를 얻을 수 있습니다: 현재 state(`count`)와 이를 업데이트할 수 있는 함수(`setCount`). 어떤 이름을 붙일 수도 있지만 `[something, setSomething]`과 같이 호출하는 것이 일반적입니다.</Trans>

The first time the button is displayed, `count` will be `0` because you passed `0` to `useState()`. When you want to change state, call `setCount()` and pass the new value to it. Clicking this button will increment the counter:
<Trans>버튼이 처음 표시될 때는 `useState()`에 `0`을 전달했기 때문에 `count`가 `0`이 됩니다. state를 변경하려면 `setCount()`를 호출하고 새 값을 전달합니다. 이 버튼을 클릭하면 카운터가 증가합니다:</Trans>

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

React will call your component function again. This time, `count` will be `1`. Then it will be `2`. And so on.
<Trans>React가 컴포넌트 함수를 다시 호출합니다. 이번에는 `count`가 `1`이 될 것입니다. 그 다음에는 `2`가 될 것입니다. 이런 식으로 계속 이어집니다.</Trans>

If you render the same component multiple times, each will get its own state. Click each button separately:
<Trans>동일한 컴포넌트를 여러 번 렌더링하면 각각 고유한 state를 갖게 됩니다. 각 버튼을 개별적으로 클릭해 보세요:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Notice how each button "remembers" its own `count` state and doesn't affect other buttons.
<Trans>각 버튼이 고유한 `카운트` state를 "기억"하고 다른 버튼에 영향을 주지 않는 방식에 주목하세요.</Trans>

## Using Hooks<br/><Trans>훅 사용하기</Trans> {/*using-hooks*/}

Functions starting with `use` are called *Hooks*. `useState` is a built-in Hook provided by React. You can find other built-in Hooks in the [API reference.](/reference/react) You can also write your own Hooks by combining the existing ones.
<Trans>`use`로 시작하는 함수를 *훅(Hook)*이라고 합니다. `useState`는 React에서 제공하는 빌트인 훅입니다. 다른 내장 훅은 [React API reference](/reference/react)에서 찾을 수 있으며, 기존의 훅을 조합하여 자신만의 훅을 작성할 수도 있습니다.</Trans>

Hooks are more restrictive than other functions. You can only call Hooks *at the top* of your components (or other Hooks). If you want to use `useState` in a condition or a loop, extract a new component and put it there.
<Trans>훅은 일반 함수보다 더 제한적입니다. 컴포넌트(또는 다른 훅)의 *최상위 레벨*에서만 훅을 호출할 수 있습니다. 조건이나 루프에서 `useState`를 사용하려면 새 컴포넌트를 추출하여 거기에 넣어야 합니다.</Trans>

## Sharing data between components<br/><Trans>컴포넌트 간 데이터 공유하기</Trans> {/*sharing-data-between-components*/}

In the previous example, each `MyButton` had its own independent `count`, and when each button was clicked, only the `count` for the button clicked changed:
<Trans>이전 예제에서는 각각의 `MyButton`에 독립적인 `count`가 있었고, 각 버튼을 클릭하면 클릭한 버튼의 `count`만 변경되었습니다:</Trans>

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.">

Initially, each `MyButton`'s `count` state is `0`
<Trans>처음 각 `MyButton`의 카운트 state는 `0`</Trans>

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero." >

The first `MyButton` updates its `count` to `1`
<Trans>첫 번째 `MyButton`은 카운트를 `1`로 업데이트</Trans>

</Diagram>

</DiagramGroup>

However, often you'll need components to *share data and always update together*.
<Trans>하지만 *데이터를 공유하고 항상 함께 업데이트*하기 위한 컴포넌트가 필요한 경우가 많습니다.</Trans>

To make both `MyButton` components display the same `count` and update together, you need to move the state from the individual buttons "upwards" to the closest component containing all of them.
<Trans>두 `MyButton` 컴포넌트 모두 동일한 `count`를 표시하고 함께 업데이트하려면 개별 버튼에서 모든 버튼이 포함된 가장 가까운 컴포넌트로 state를 "위쪽"으로 이동해야 합니다.</Trans>

In this example, it is `MyApp`:
<Trans>이 예제에서는 `MyApp`입니다:</Trans>

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero." >

Initially, `MyApp`'s `count` state is `0` and is passed down to both children
<Trans>처음 `MyApp`의 `count` state는 `0`이며 두 자식에게 모두 전달됨</Trans>
</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down." >

On click, `MyApp` updates its `count` state to `1` and passes it down to both children
<Trans>클릭 시 `MyApp`은 `count` state를 `1`로 업데이트하고 두 자식에게 전달함</Trans>

</Diagram>

</DiagramGroup>

Now when you click either button, the `count` in `MyApp` will change, which will change both of the counts in `MyButton`. Here's how you can express this in code.
<Trans>이제 두 버튼 중 하나를 클릭하면 `MyApp`의 `count`가 변경되어 `MyButton`의 두 개수가 모두 변경됩니다. 이를 코드로 표현하는 방법은 다음과 같습니다.</Trans>

First, *move the state up* from `MyButton` into `MyApp`:
<Trans>먼저, `MyButton`에서 `MyApp`으로 state를 위로 이동합니다:</Trans>

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update separately</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... we're moving code from here ...
}

```

Then, *pass the state down* from `MyApp` to each `MyButton`, together with the shared click handler. You can pass information to `MyButton` using the JSX curly braces, just like you previously did with built-in tags like `<img>`:
<Trans>그런 다음 `MyApp`에서 각 `MyButton`으로 공유 클릭 핸들러와 함께 state를 *전달*합니다. 이전에 `img>`와 같은 내장 태그에서 했던 것처럼 JSX 중괄호를 사용하여 `MyButton`에 정보를 전달할 수 있습니다:</Trans>

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

The information you pass down like this is called _props_. Now the `MyApp` component contains the `count` state and the `handleClick` event handler, and *passes both of them down as props* to each of the buttons.
<Trans>이렇게 전달한 정보를 props라고 합니다. 이제 MyApp 컴포넌트에는 count state와 handleClick 이벤트 핸들러가 포함되어 있으며, 이 두 가지를 각 버튼에 props로 전달합니다.</Trans>

Finally, change `MyButton` to *read* the props you have passed from its parent component:
<Trans>마지막으로, 부모 컴포넌트에서 전달한 props를 *읽기* 위해 `MyButton`을 변경합니다:</Trans>

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

When you click the button, the `onClick` handler fires. Each button's `onClick` prop was set to the `handleClick` function inside `MyApp`, so the code inside of it runs. That code calls `setCount(count + 1)`, incrementing the `count` state variable. The new `count` value is passed as a prop to each button, so they all show the new value. This is called "lifting state up". By moving state up, you've shared it between components.
<Trans>버튼을 클릭하면 `onClick` 핸들러가 실행됩니다. 각 버튼의 `onClick` 프로퍼티는 `MyApp` 내부의 `handleClick` 함수로 설정되었으므로 그 안에 있는 코드가 실행됩니다. 이 코드는 `setCount(count + 1)`를 호출하여 `count` state 변수를 증가시킵니다. 새로운 `count` 값은 각 버튼에 프로퍼티로 전달되므로 모든 버튼에 새로운 값이 표시됩니다. 이를 " state 위로 올리기"라고 합니다. state를 위로 올리면 컴포넌트 간에 공유할 수 있습니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Clicked {count} times
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Next Steps<br/><Trans>다음 단계</Trans> {/*next-steps*/}

By now, you know the basics of how to write React code!
<Trans>이제 React 코드를 작성하는 방법에 대한 기본 사항을 알았습니다!</Trans>

Check out the [Tutorial](/learn/tutorial-tic-tac-toe) to put them into practice and build your first mini-app with React.
<Trans>[자습서](/learn/tutorial-tic-tac-toe)를 통해 실습을 해보고 React로 첫 번째 미니 앱을 만들어 보세요.</Trans>