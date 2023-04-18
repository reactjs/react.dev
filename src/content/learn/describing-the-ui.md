---
title: Describing the UI
translatedTitle: UI 구성하기
translators: [박문하, 안예지, 정재남]
---

<Intro>

React is a JavaScript library for rendering user interfaces (UI). UI is built from small units like buttons, text, and images. React lets you combine them into reusable, nestable *components.* From web sites to phone apps, everything on the screen can be broken down into components. In this chapter, you'll learn to create, customize, and conditionally display React components.
<Trans>React는 사용자 인터페이스(UI)를 렌더링하기 위한 JavaScript 라이브러리입니다. UI는 버튼, 텍스트, 이미지와 같은 작은 단위로 구성됩니다. React를 사용하면 재사용 가능하고 중첩 가능한 컴포넌트로 결합할 수 있습니다. 웹 사이트부터 휴대폰 앱까지 화면의 모든 것을 컴포넌트로 분류할 수 있습니다. 이 장에서는 React 컴포넌트를 만들고, 사용자 정의하고, 조건부로 표시하는 방법을 배웁니다.</Trans>
</Intro>

<YouWillLearn isChapter={true}>

* [How to write your first React component](/learn/your-first-component)
* [When and how to create multi-component files](/learn/importing-and-exporting-components)
* [How to add markup to JavaScript with JSX](/learn/writing-markup-with-jsx)
* [How to use curly braces with JSX to access JavaScript functionality from your components](/learn/javascript-in-jsx-with-curly-braces)
* [How to configure components with props](/learn/passing-props-to-a-component)
* [How to conditionally render components](/learn/conditional-rendering)
* [How to render multiple components at a time](/learn/rendering-lists)
* [How to avoid confusing bugs by keeping components pure](/learn/keeping-components-pure)

<TransBlock>
- [첫 번째 React 컴포넌트를 작성하는 방법](/learn/your-first-component)
- [멀티 컴포넌트 파일을 생성하는 시기와 방법](/learn/importing-and-exporting-components)
- [JSX로 JavaScript에 마크업을 추가하는 방법](/learn/writing-markup-with-jsx)
- [JSX와 함께 중괄호를 사용해 컴포넌트에서 JavaScript 기능에 액세스하는 방법](/learn/javascript-in-jsx-with-curly-braces)
- [prop으로 컴포넌트를 구성하는 방법](/learn/passing-props-to-a-component)
- [컴포넌트를 조건부로 렌더링하는 방법](/learn/conditional-rendering)
- [한 번에 여러 컴포넌트를 렌더링하는 방법](/learn/rendering-lists)
- [컴포넌트를 순수하게 유지하여 혼란스러운 버그를 피하는 방법](/learn/keeping-components-pure)
</TransBlock>
</YouWillLearn>

## Your first component<Trans>첫 번째 컴포넌트</Trans> {/*your-first-component*/}

React applications are built from isolated pieces of UI called *components*. A React component is a JavaScript function that you can sprinkle with markup. Components can be as small as a button, or as large as an entire page. Here is a `Gallery` component rendering three `Profile` components:
<Trans>React 애플리케이션은 *컴포넌트*라고 불리는 분리된 UI 조각으로 구축됩니다. React 컴포넌트는 마크업으로 뿌릴 수 있는 JavaScript 함수입니다. 컴포넌트는 버튼처럼 작을 수도 있고 전체 페이지처럼 클 수도 있습니다. 다음은 세 개의 Profile 컴포넌트를 렌더링하는 `Gallery` 컴포넌트입니다:</Trans>
<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/your-first-component">

Read [**Your First Component**](/learn/your-first-component) to learn how to declare and use React components.
<Trans>React 컴포넌트를 선언하고 사용하는 방법을 알아보려면 [**첫 번째 컴포넌트**](/learn/your-first-component)를 읽어보세요.</Trans>
</LearnMore>

## Importing and exporting components <Trans>컴포넌트 import 및 export</Trans> {/*importing-and-exporting-components*/}

You can declare many components in one file, but large files can get difficult to navigate. To solve this, you can *export* a component into its own file, and then *import* that component from another file:
<Trans>하나의 파일에 여러 컴포넌트를 선언할 수 있지만 파일이 크면 탐색하기 어려울 수 있습니다. 이 문제를 해결하려면 컴포넌트를 자체 파일로 export(내보내기)한 다음 다른 파일에서 해당 컴포넌트를 import(가져오기)하면 됩니다:</Trans>

<Sandpack>

```js App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Read **[Importing and Exporting Components](/learn/importing-and-exporting-components)** to learn how to split components into their own files.
<Trans>컴포넌트를 자체 파일로 분할하는 방법을 알아보려면 [**컴포넌트 import 및 export**](/learn/importing-and-exporting-components)를 읽어보세요.</Trans>
</LearnMore>

## Writing markup with JSX<Trans>JSX로 마크업 작성하기</Trans> {/*writing-markup-with-jsx*/}

Each React component is a JavaScript function that may contain some markup that React renders into the browser. React components use a syntax extension called JSX to represent that markup. JSX looks a lot like HTML, but it is a bit stricter and can display dynamic information.
<Trans>각 React 컴포넌트는 React가 브라우저에 렌더링하는 일부 마크업을 포함할 수 있는 JavaScript 함수입니다. React 컴포넌트는 JSX라는 구문 확장자를 사용해 해당 마크업을 표현합니다. JSX는 HTML과 매우 비슷해 보이지만 조금 더 엄격하고 동적 정보를 표시할 수 있습니다.</Trans>

If we paste existing HTML markup into a React component, it won't always work:
<Trans>기존 HTML 마크업을 React 컴포넌트에 붙여넣으면 항상 작동하는 것은 아닙니다:</Trans>
<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

If you have existing HTML like this, you can fix it using a [converter](https://transform.tools/html-to-jsx):
<Trans>이와 같은 기존 HTML이 있다면 [converter](https://transform.tools/html-to-jsx)를 사용하여 수정할 수 있습니다:</Trans>
<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

Read **[Writing Markup with JSX](/learn/writing-markup-with-jsx)** to learn how to write valid JSX.
<Trans>유효한 JSX를 작성하는 방법을 알아보려면 [**JSX로 마크업 작성하기**](/learn/writing-markup-with-jsx)를 참조하세요.</Trans>
</LearnMore>

## JavaScript in JSX with curly braces<Trans>JSX에서 JavaScript 사용하기</Trans> {/*javascript-in-jsx-with-curly-braces*/}

JSX lets you write HTML-like markup inside a JavaScript file, keeping rendering logic and content in the same place. Sometimes you will want to add a little JavaScript logic or reference a dynamic property inside that markup. In this situation, you can use curly braces in your JSX to "open a window" to JavaScript:
<Trans>JSX를 사용하면 JavaScript 파일 내에 HTML과 유사한 마크업을 작성하여 렌더링 로직과 콘텐츠를 같은 위치에 유지할 수 있습니다. 때로는 마크업 안에 약간의 JavaScript 로직을 추가하거나 동적 프로퍼티를 참조하고 싶을 때가 있습니다. 이 경우 JSX에서 중괄호를 사용하여 JavaScript로의 '창을 열' 수 있습니다:</Trans>
<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

Read **[JavaScript in JSX with Curly Braces](/learn/javascript-in-jsx-with-curly-braces)** to learn how to access JavaScript data from JSX.
<Trans>[**JSX에서 JavaScript 사용하기**](/learn/javascript-in-jsx-with-curly-braces)를 읽고 JSX에서 JavaScript 데이터에 액세스하는 방법을 알아보세요.</Trans>
</LearnMore>

## Passing props to a component<Trans>컴포넌트에 props 전달하기</Trans> {/*passing-props-to-a-component*/}

React components use *props* to communicate with each other. Every parent component can pass some information to its child components by giving them props. Props might remind you of HTML attributes, but you can pass any JavaScript value through them, including objects, arrays, functions, and even JSX!
<Trans>React 컴포넌트는 서로 통신하기 위해 props를 사용합니다. 모든 부모 컴포넌트는 자식 컴포넌트에 props를 전달하여 일부 정보를 전달할 수 있습니다. props라고 하면 HTML 어트리뷰트를 떠올릴 수 있지만 객체, 배열, 함수, 심지어 JSX를 포함한 모든 JavaScript 값을 전달할 수 있습니다!</Trans>
<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js utils.js
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

Read **[Passing Props to a Component](/learn/passing-props-to-a-component)** to learn how to pass and read props.
<Trans>[**컴포넌트에 props 전달하기**](/learn/passing-props-to-a-component)를 읽고 props를 전달하고 읽는 방법을 알아보세요.</Trans>
</LearnMore>

## Conditional rendering<Trans>조건부 렌더링</Trans> {/*conditional-rendering*/}

Your components will often need to display different things depending on different conditions. In React, you can conditionally render JSX using JavaScript syntax like `if` statements, `&&`, and `? :` operators.
<Trans>컴포넌트는 여러 조건에 따라 다른 것을 표시해야 하는 경우가 많습니다. React에서는 `if` 문, `&&`, `? :` 연산자 같은 JavaScript 구문을 사용해 조건부로 JSX를 렌더링할 수 있습니다.</Trans>
In this example, the JavaScript `&&` operator is used to conditionally render a checkmark:
<Trans>이 예제에서는 JavaScript `&&` 연산자를 사용하여 체크 표시를 조건부로 렌더링합니다:</Trans>
<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item
          isPacked={true}
          name="Space suit"
        />
        <Item
          isPacked={true}
          name="Helmet with a golden leaf"
        />
        <Item
          isPacked={false}
          name="Photo of Tam"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

Read **[Conditional Rendering](/learn/conditional-rendering)** to learn the different ways to render content conditionally.
<Trans>[**조건부 렌더링**](/learn/conditional-rendering)을 읽고 콘텐츠를 조건부로 렌더링하는 다양한 방법을 알아보세요.</Trans>
</LearnMore>

## Rendering lists <Trans>목록 렌더링</Trans> {/*rendering-lists*/}

You will often want to display multiple similar components from a collection of data. You can use JavaScript's `filter()` and `map()` with React to filter and transform your array of data into an array of components.
<Trans>데이터 모음에서 유사한 컴포넌트를 여러 개 표시하고 싶을 때가 많습니다. React에서 JavaScript의 `filter()`와 `map()`을 사용해 데이터 배열을 필터링하고 컴포넌트 배열로 변환할 수 있습니다.</Trans>

For each array item, you will need to specify a `key`. Usually, you will want to use an ID from the database as a `key`. Keys let React keep track of each item's place in the list even if the list changes.
<Trans>각 배열 항목마다 `key`를 지정해야 합니다. 보통 데이터베이스의 ID를 `key`로 사용하는 것이 좋습니다. 키를 사용하면 목록이 변경되더라도 React가 목록에서 각 항목의 위치를 추적할 수 있습니다.</Trans>
<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

Read **[Rendering Lists](/learn/rendering-lists)** to learn how to render a list of components, and how to choose a key.
<Trans>컴포넌트 목록을 렌더링하는 방법과 키를 선택하는 방법을 알아보려면 [**목록 렌더링**](/learn/rendering-lists)을 읽어보세요.</Trans>
</LearnMore>

## Keeping components pure<Trans>컴포넌트 순수성 유지</Trans> {/*keeping-components-pure*/}

Some JavaScript functions are *pure.* A pure function:
<Trans>일부 JavaScript 함수는 *순수* 함수입니다. 순수함수는:</Trans>

* **Minds its own business.** It does not change any objects or variables that existed before it was called.
* **Same inputs, same output.** Given the same inputs, a pure function should always return the same result.

<TransBlock>
- **자신의 일만 처리합니다.** 호출되기 전에 존재했던 객체나 변수를 변경하지 않습니다.
- **동일 입력, 동일 출력.** 순수 함수는 동일한 입력이 주어지면 항상 동일한 결과를 반환해야 합니다.
</TransBlock>

By strictly only writing your components as pure functions, you can avoid an entire class of baffling bugs and unpredictable behavior as your codebase grows. Here is an example of an impure component:
<Trans>컴포넌트를 순수 함수로만 엄격하게 작성하면 코드베이스가 커짐에 따라 당황스러운 버그와 예측할 수 없는 동작이 발생하는 것을 방지할 수 있습니다. 다음은 불순한 컴포넌트의 예시입니다:</Trans>

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

You can make this component pure by passing a prop instead of modifying a preexisting variable:
<Trans>기존 변수를 수정하는 대신 prop을 전달하여 이 컴포넌트를 순수하게 만들 수 있습니다:</Trans>
<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/keeping-components-pure">

Read **[Keeping Components Pure](/learn/keeping-components-pure)** to learn how to write components as pure, predictable functions.
<Trans>컴포넌트를 순수하고 예측 가능한 함수로 작성하는 방법을 알아보려면 [**컴포넌트 순수성 유지**](/learn/keeping-components-pure)를 읽어보세요.</Trans>
</LearnMore>

## What's next?<Trans>다음 단계</Trans> {/*whats-next*/}

Head over to [Your First Component](/learn/your-first-component) to start reading this chapter page by page!
<Trans>[첫 번째 컴포넌트](/learn/your-first-component)로 이동하여 이 챕터를 한 페이지씩 읽어보세요!</Trans>

Or, if you're already familiar with these topics, why not read about [Adding Interactivity](/learn/adding-interactivity)?
<Trans>또는 이러한 주제에 이미 익숙하다면 [상호작용 추가하기](/learn/adding-interactivity)를 읽어보는 것은 어떨까요?</Trans>
