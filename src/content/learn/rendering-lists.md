---
title: Rendering Lists
translatedTitle: 목록 렌더링
translators: [최민정, 강승훈, 이도원, 정재남]
---

<Intro>

You will often want to display multiple similar components from a collection of data. You can use the [JavaScript array methods](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) to manipulate an array of data. On this page, you'll use [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) and [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) with React to filter and transform your array of data into an array of components.
<Trans>데이터 모음에서 유사한 컴포넌트를 여러 개 표시하고 싶을 때가 많습니다. [JavaScript 배열 메서드]((https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#))를 사용해 데이터 배열을 조작할 수 있습니다. 이 페이지에서는 React에서 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)와 [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map)을 사용해 데이터 배열을 필터링하고 컴포넌트 배열로 변환하겠습니다.</Trans>
</Intro>

<YouWillLearn>

* How to render components from an array using JavaScript's `map()`
* How to render only specific components using JavaScript's `filter()`
* When and why to use React keys

<TransBlock> 
- JavaScript의 `map()`을 사용하여 배열에서 컴포넌트를 렌더링하는 방법
- JavaScript의 `filter()`를 사용해 특정 컴포넌트만 렌더링하는 방법
- React에서 key를 사용하는 경우와 그 이유
</TransBlock>

</YouWillLearn>

## Rendering data from arrays <Trans>배열에서 데이터 렌더링하기</Trans> {/*rendering-data-from-arrays*/}

Say that you have a list of content.
<Trans>다음과 같은 콘텐츠 목록이 있다고 가정해 보겠습니다.</Trans>
```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

The only difference among those list items is their contents, their data. You will often need to show several instances of the same component using different data when building interfaces: from lists of comments to galleries of profile images. In these situations, you can store that data in JavaScript objects and arrays and use methods like [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) and [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) to render lists of components from them.
<Trans>이러한 목록 항목의 유일한 차이점은 콘텐츠, 즉 데이터입니다. 댓글 목록에서 프로필 이미지 갤러리에 이르기까지 인터페이스를 구축할 때 서로 다른 데이터를 사용하여 동일한 컴포넌트의 여러 인스턴스를 표시해야 하는 경우가 종종 있습니다. 이러한 상황에서는 해당 데이터를 JavaScript 객체와 배열에 저장하고 [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 및 [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)와 같은 메서드를 사용하여 컴포넌트 목록을 렌더링할 수 있습니다.</Trans>

Here’s a short example of how to generate a list of items from an array:
<Trans>다음은 배열에서 항목 목록을 생성하는 방법에 대한 간단한 예시입니다: </Trans>

1. **Move** the data into an array: <br/>
<Trans>데이터를 배열로 **이동**합니다:</Trans>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. **Map** the `people` members into a new array of JSX nodes, `listItems`:
<Trans>`people` 멤버를 새로운 JSX 노드 배열인 `listItems`에 **매핑**합니다:</Trans>

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **Return** `listItems` from your component wrapped in a `<ul>`:
<Trans>컴포넌트에서 `<ul>`로 감싼 `listItems`를 **반환**합니다: </Trans>

```js
return <ul>{listItems}</ul>;
```

Here is the result:
<Trans>결과는 다음과 같습니다:</Trans>

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

Notice the sandbox above displays a console error:
<Trans>위의 샌드박스에 콘솔 오류가 표시되는 것을 확인할 수 있습니다:</Trans>

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.
<Trans>경고: 목록의 각 자식에는 고유한 "key" prop이 있어야 합니다.</Trans>

</ConsoleBlock>

You'll learn how to fix this error later on this page. Before we get to that, let's add some structure to your data.
<Trans>이 오류를 수정하는 방법은 이 페이지의 뒷부분에서 알아보겠습니다. 그 전에 데이터에 몇 가지 구조를 추가해 보겠습니다.</Trans>

## Filtering arrays of items<Trans>항목 배열 필터링하기</Trans> {/*filtering-arrays-of-items*/}

This data can be structured even more.
<Trans>이 데이터는 훨씬 더 구조화할 수 있습니다.</Trans>

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

Let's say you want a way to only show people whose profession is `'chemist'`. You can use JavaScript's `filter()` method to return just those people. This method takes an array of items, passes them through a “test” (a function that returns `true` or `false`), and returns a new array of only those items that passed the test (returned `true`).
<Trans>profession이 `'chemist'`인 사람만 표시하는 방법을 원한다고 가정해 봅시다. JavaScript의 filter() 메서드를 사용하여 해당 사람들만 반환할 수 있습니다. 이 메서드는 항목 배열을 받아 "테스트"(`true` 또는 `false`를 반환하는 함수)를 통과한 후, 테스트를 통과한 항목만 포함된 새 배열을 반환합니다(`true` 반환).</Trans>

You only want the items where `profession` is `'chemist'`. The "test" function for this looks like `(person) => person.profession === 'chemist'`. Here's how to put it together:
<Trans>`profession`이 `'chemist'`인 항목만 원합니다. 이를 위한 "test" 함수는 `(person) => person.profession === 'chemist'`와 같습니다. 이를 조합하는 방법은 다음과 같습니다:</Trans>

1. **Create** a new array of just “chemist” people, `chemists`, by calling `filter()` on the `people` filtering by `person.profession === 'chemist'`:  
<Trans> `people`에서 `person.profession === 'chemist'` 조건으로 `filter()`를 호출하여, “chemist”만 있는 새로운 배열인 `chemists`를 생성합니다:</Trans>

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. Now **map** over `chemists`:  
<Trans>이제 `chemists` 위에 매핑합니다:</Trans>

```js {1,13}
const listItems = chemists.map(person =>
  <li>
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
```

3. Lastly, **return** the `listItems` from your component:  
<Trans>마지막으로 컴포넌트에서 `listItems`를 **반환**합니다:</Trans>

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
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
  return <ul>{listItems}</ul>;
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

Arrow functions implicitly return the expression right after `=>`, so you didn't need a `return` statement:
<Trans> 화살표 함수는 `=>` 바로 뒤에 표현식을 암시적으로 반환하므로 `return` 문이 필요하지 않습니다:</Trans>

```js
const listItems = chemists.map(person =>
  <li>...</li> // Implicit return!
);
```

However, **you must write `return` explicitly if your `=>` is followed by a `{` curly brace!**
<Trans>그러나 `=>` 뒤에 `{` 중괄호가 오는 경우 `return`을 명시적으로 작성해야 합니다.</Trans>

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

Arrow functions containing `=> {` are said to have a ["block body".](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) They let you write more than a single line of code, but you *have to* write a `return` statement yourself. If you forget it, nothing gets returned!
<Trans> `=> {`가 포함된 화살표 함수는 ["블록 본문"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)을 가져야 합니다. 이 경우 한 줄 이상의 코드를 작성할 수 있지만, *반드시* 직접 `return` 문을 작성해야 합니다. `return`을 잊으면 아무것도 반환되지 않습니다!</Trans>

</Pitfall>

## Keeping list items in order with `key`<Trans>`key`로 목록의 항목 순서 유지하기</Trans> {/*keeping-list-items-in-order-with-key*/}

Notice that all the sandboxes above show an error in the console:
<Trans>위의 모든 예제 샌드박스에서 콘솔에 오류가 표시되는 것에 주목해 봅시다:</Trans>

<ConsoleBlock level="error">

Warning: Each child in a list should have a unique "key" prop.
<Trans>경고: 목록의 각 자식에는 고유한 "key" prop이 있어야 합니다.</Trans>

</ConsoleBlock>

You need to give each array item a `key` -- a string or a number that uniquely identifies it among other items in that array:
<Trans> 각 배열 항목에는 해당 배열의 항목들 사이에서 고유하게 식별할 수 있는 문자열 또는 숫자인 `key`를 부여해야 합니다:</Trans>

```js
<li key={person.id}>...</li>
```

<Note>

JSX elements directly inside a `map()` call always need keys!
<Trans>`map()` 호출 내부의 JSX 요소에는 항상 key가 필요합니다!</Trans>

</Note>

Keys tell React which array item each component corresponds to, so that it can match them up later. This becomes important if your array items can move (e.g. due to sorting), get inserted, or get deleted. A well-chosen `key` helps React infer what exactly has happened, and make the correct updates to the DOM tree.
<Trans> `key`는 각 컴포넌트가 어떤 배열 항목에 해당하는지 React에 알려주어 나중에 매칭할 수 있도록 합니다. 이는 배열 항목이 (정렬 등으로 인해) 이동하거나, 삽입되거나, 삭제될 수 있는 경우 중요해집니다. 잘 만들어진 `key`는 React가 정확히 무슨 일이 일어났는지 추론하고 DOM 트리를 올바르게 업데이트하는 데 도움이 됩니다.</Trans>

Rather than generating keys on the fly, you should include them in your data:
<Trans>즉석에서 key를 생성하는 대신 데이터에 포함시켜야 합니다:</Trans>

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
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js data.js active
export const people = [{
  id: 0, // Used in JSX as a key
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // Used in JSX as a key
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // Used in JSX as a key
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // Used in JSX as a key
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // Used in JSX as a key
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### Displaying several DOM nodes for each list item <Trans>목록의 각 항목에 여러 개의 DOM 노드 표시하기</Trans> {/*displaying-several-dom-nodes-for-each-list-item*/}

What do you do when each item needs to render not one, but several DOM nodes?
<Trans>각 항목이 하나가 아니라 여러 개의 DOM 노드를 렌더링해야 할 때는 어떻게 해야 할까요?</Trans>

The short [`<>...</>` Fragment](/reference/react/Fragment) syntax won't let you pass a key, so you need to either group them into a single `<div>`, or use the slightly longer and [more explicit `<Fragment>` syntax:](/reference/react/Fragment#rendering-a-list-of-fragments)
<Trans> 짧은 [`<>...</>` Fragment](/reference/react/Fragment) 구문으로는 key를 전달할 수 없으므로 단일 `<div>`로 그룹화하거나, 약간 더 길고 [더 명시적인 `<Fragment>` 구문](/reference/react/Fragment#rendering-a-list-of-fragments)을 사용해야 합니다:</Trans>

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Fragments disappear from the DOM, so this will produce a flat list of `<h1>`, `<p>`, `<h1>`, `<p>`, and so on.
<Trans>Fragment는 DOM에서 사라지므로, 이렇게 하면 `<h1>`, `<p>`, `<h1>`, `<p>` 등의 1차원 목록이 생성됩니다.</Trans>

</DeepDive>

### Where to get your `key`<Trans>`key`를 얻을 수 있는 곳</Trans> {/*where-to-get-your-key*/}

Different sources of data provide different sources of keys:
<Trans>데이터 소스에 따라 서로 다른 key 소스를 제공합니다:</Trans>

* **Data from a database:** If your data is coming from a database, you can use the database keys/IDs, which are unique by nature.
* **Locally generated data:** If your data is generated and persisted locally (e.g. notes in a note-taking app), use an incrementing counter, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) or a package like [`uuid`](https://www.npmjs.com/package/uuid) when creating items.

<TransBlock>
- **데이터베이스의 데이터:** 데이터베이스에서 데이터를 가져오는 경우, 고유한 데이터베이스 key/ID를 사용할 수 있습니다.
- **로컬에서 생성된 데이터:** 데이터가 로컬에서 생성되고 유지되는 경우(예: 메모 작성 앱의 메모), 항목을 만들 때 증분 카운터, [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) 또는 [`uuid`](https://www.npmjs.com/package/uuid)와 같은 패키지를 사용하세요.
</TransBlock>

### Rules of keys  <Trans>Key 규칙</Trans> {/*rules-of-keys*/}

* **Keys must be unique among siblings.** However, it’s okay to use the same keys for JSX nodes in _different_ arrays.
* **Keys must not change** or that defeats their purpose! Don't generate them while rendering.

<TransBlock>
- **key는 형제간에 고유해야 합니다.** *다른* 배열의 JSX 노드에는 동일한 key를 사용해도 괜찮습니다.
- **key가 변경되지 않아야 합니다.** 그렇지 않으면 목적에 어긋나게 됩니다! 렌더링 중에는 생성하지 마세요.
</TransBlock>

### Why does React need keys? <Trans>React에 key가 필요한 이유는 무엇일까요?</Trans> {/*why-does-react-need-keys*/}

Imagine that files on your desktop didn't have names. Instead, you'd refer to them by their order -- the first file, the second file, and so on. You could get used to it, but once you delete a file, it would get confusing. The second file would become the first file, the third file would be the second file, and so on.
<Trans>데스크톱의 파일에 이름이 없다고 상상해 봅시다. 파일 이름 대신 첫 번째 파일, 두 번째 파일 등의 순서로 파일을 참조할 것입니다. 물론 익숙해질 수도 있지만, 파일을 삭제하면 혼란스러워질 수도 있습니다. 두 번째 파일이 첫 번째 파일이 되고, 세 번째 파일이 두 번째 파일이 되는 식으로 말이죠.</Trans>

File names in a folder and JSX keys in an array serve a similar purpose. They let us uniquely identify an item between its siblings. A well-chosen key provides more information than the position within the array. Even if the _position_ changes due to reordering, the `key` lets React identify the item throughout its lifetime.
<Trans>폴더의 파일 이름과 배열의 JSX key는 비슷한 역할을 합니다. key를 사용하면 형제 항목 사이에서 특정 항목을 고유하게 식별할 수 있습니다. 잘 선택한 key는 배열 내 위치보다 더 많은 정보를 제공합니다. 만약 재정렬로 인해 어떤 항목의 *위치*가 변경되더라도, 해당 항목이 사라지지 않는 한, React는 `key`를 통해 그 항목을 식별할 수 있습니다.</Trans>

<Pitfall>

You might be tempted to use an item's index in the array as its key. In fact, that's what React will use if you don't specify a `key` at all. But the order in which you render items will change over time if an item is inserted, deleted, or if the array gets reordered. Index as a key often leads to subtle and confusing bugs.
<Trans>배열에서 항목의 인덱스를 key로 사용하고 싶을 수도 있습니다. 사실 여러분이 `key`를 지정하지 않으면, React는 인덱스를 key로 사용합니다. 그러나 여러분이 렌더링한 항목의 순서는 새 항목이 삽입되거나, 삭제되거나, 배열의 순서가 바뀌는 등에 따라 변경될 수 있습니다. 인덱스를 key로 사용하면 종종 미묘하고 혼란스러운 버그가 발생합니다.</Trans>

Similarly, do not generate keys on the fly, e.g. with `key={Math.random()}`. This will cause keys to never match up between renders, leading to all your components and DOM being recreated every time. Not only is this slow, but it will also lose any user input inside the list items. Instead, use a stable ID based on the data.
<Trans>마찬가지로 `key={Math.random()}`과 같이 즉석에서 key를 생성하지 마세요. 이렇게 하면 렌더링될 때마다 key가 일치하지 않아 매번 모든 컴포넌트와 DOM이 다시 생성됩니다. 속도가 느려질 뿐만 아니라 목록 항목 내부의 사용자 입력도 손실됩니다. 대신 데이터에 기반한 안정적인 ID를 사용하세요.</Trans>

Note that your components won't receive `key` as a prop. It's only used as a hint by React itself. If your component needs an ID, you have to pass it as a separate prop: `<Profile key={id} userId={id} />`.
<Trans>컴포넌트는 `key`를 prop으로 받지 않는다는 점에 유의하세요. React 자체에서 힌트로만 사용됩니다. 컴포넌트에 ID가 필요한 경우 별도의 프로퍼티로 전달해야 합니다: `<Profile key={id} userId={id} />`.</Trans>

</Pitfall>

<Recap>

On this page you learned:
<Trans>이 페이지에서는 이런걸 학습했습니다:</Trans>

* How to move data out of components and into data structures like arrays and objects.
* How to generate sets of similar components with JavaScript's `map()`.
* How to create arrays of filtered items with JavaScript's `filter()`.
* Why and how to set `key` on each component in a collection so React can keep track of each of them even if their position or data changes.

<TransBlock>
- 데이터를 컴포넌트에서 배열이나 객체와 같은 데이터 구조로 이동하는 방법.
- JavaScript의 `map()`을 사용하여 비슷한 컴포넌트 집합을 생성하는 방법.
- JavaScript의 `filter()`를 사용하여 필터링된 항목의 배열을 만드는 방법.
- 컬렉션의 각 컴포넌트에 `key`를 설정해 위치나 데이터가 변경되더라도 React가 각 컴포넌트를 추적할 수 있도록 하는 이유와 방법.
</TransBlock>

</Recap>



<Challenges>

#### Splitting a list in two <Trans>목록을 둘로 나누세요</Trans> {/*splitting-a-list-in-two*/}

This example shows a list of all people.
<Trans>이 예제는 모든 사람의 목록을 보여주고 있습니다.</Trans>

Change it to show two separate lists one after another: **Chemists** and **Everyone Else.** Like previously, you can determine whether a person is a chemist by checking if `person.profession === 'chemist'`.
<Trans>이를 **Chemists** 목록과 **그밖의 모든 사람** 목록으로 나누어 순서대로 표시하도록 변경하세요. 이전과 마찬가지로 `person.profession === 'chemist'`인지 확인함으로써 어떤 사람이 `chemist`인지 여부를 결정할 수 있을 것입니다.</Trans>

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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

You could use `filter()` twice, creating two separate arrays, and then `map` over both of them:
<Trans>`filter()`를 두 번 사용하여 두 개의 개별 배열을 만든 다음, 두 배열에 모두 `매핑`할 수 있습니다:</Trans>

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
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
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
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
        )}
      </ul>
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

In this solution, the `map` calls are placed directly inline into the parent `<ul>` elements, but you could introduce variables for them if you find that more readable.
<Trans>이 솔루션에서는 `map` 호출이 상위 `<ul>` 요소에 직접 인라인으로 배치되지만, 가독성이 더 좋다고 판단되면 변수를 도입할 수 있습니다.</Trans>

There is still a bit duplication between the rendered lists. You can go further and extract the repetitive parts into a `<ListSection>` component:
<Trans>렌더링된 목록 사이에는 여전히 약간의 중복이 있습니다. 더 나아가 반복되는 부분을 `<ListSection>` 컴포넌트로 추출할 수 있습니다:</Trans>

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

A very attentive reader might notice that with two `filter` calls, we check each person's profession twice. Checking a property is very fast, so in this example it's fine. If your logic was more expensive than that, you could replace the `filter` calls with a loop that manually constructs the arrays and checks each person once.
<Trans>세심한 독자라면 두 번의 `filter` 호출을 통해 각 사람의 직업을 두 번 확인한다는 사실을 알아차릴 수 있습니다. 프로퍼티 확인은 매우 빠르기 때문에 이 예제에서는 괜찮습니다. 로직이 이보다 더 비싸다면 `filter` 호출을 수동으로 배열을 구성하고 각 사람을 한 번씩 확인하는 루프로 대체할 수 있습니다.</Trans>

In fact, if `people` never change, you could move this code out of your component. From React's perspective, all that matters is that you give it an array of JSX nodes in the end. It doesn't care how you produce that array:
<Trans>사실, `people`이 절대 변하지 않는다면 이 코드를 컴포넌트 밖으로 옮길 수 있습니다. React의 관점에서, 중요한 것은 결국 JSX 노드 배열을 제공한다는 것입니다. 그 배열을 어떻게 생성하는지는 중요하지 않습니다:</Trans>

<Sandpack>

```js App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
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
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
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
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Nested lists in one component <Trans>중첩 목록</Trans> {/*nested-lists-in-one-component*/}

Make a list of recipes from this array! For each recipe in the array, display its name as an `<h2>` and list its ingredients in a `<ul>`.
<Trans>이 배열에서 레시피 목록을 만드세요! 배열의 각 레시피에 대해 이름을 `<h2>`로 표시하고, `<ul>`에 재료를 나열하세요.</Trans>

<Hint>
This will require nesting two different `map` calls.
<Trans>이렇게 하려면 서로 다른 두 개의 `map` 호출을 중첩해야 합니다.</Trans>
</Hint>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Here is one way you could go about it:
<Trans>한 가지 방법은 다음과 같습니다:</Trans>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Each of the `recipes` already includes an `id` field, so that's what the outer loop uses for its `key`. There is no ID you could use to loop over ingredients. However, it's reasonable to assume that the same ingredient won't be listed twice within the same recipe, so its name can serve as a `key`. Alternatively, you could change the data structure to add IDs, or use index as a `key` (with the caveat that you can't safely reorder ingredients).
<Trans>각 `recipes`에는 이미 `id` 필드가 포함되어 있으므로, 외부 루프가 `key`로 사용하는 것이 바로 이 필드입니다. 재료를 반복하는 데 사용할 수 있는 ID는 없습니다. 그러나 같은 재료가 같은 레시피에 두 번 나열되지 않는다고 가정하면 그 이름을 `key`로 사용할 수 있습니다. 또는 데이터 구조를 변경하여 ID를 추가하거나 인덱스를 `key`로 사용할 수 있습니다(단, 재료 순서를 안전하게 바꿀 수 없다는 점에 유의하세요).</Trans>

</Solution>

#### Extracting a list item component <Trans>목록 항목 컴포넌트 추출하기</Trans> {/*extracting-a-list-item-component*/}

This `RecipeList` component contains two nested `map` calls. To simplify it, extract a `Recipe` component from it which will accept `id`, `name`, and `ingredients` props. Where do you place the outer `key` and why?
<Trans>이 `RecipeList` 컴포넌트에는 두 개의 중첩된 `map` 호출이 포함되어 있습니다. 이를 단순화하기 위해 `id`, `name`, `ingredients` props를 허용하는 `Recipe` 컴포넌트를 추출하세요. 외부 `key`를 어디에 배치할 것이며 그 이유는 무엇인가요?</Trans>

<Sandpack>

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

You can copy-paste the JSX from the outer `map` into a new `Recipe` component and return that JSX. Then you can change `recipe.name` to `name`, `recipe.id` to `id`, and so on, and pass them as props to the `Recipe`:
<Trans>외부 `map`의 JSX를 새 `Recipe` 컴포넌트에 복사하여 붙여넣고 해당 JSX를 반환할 수 있습니다. 그런 다음 `recipe.name`을 `name`으로, `recipe.id`를 `id`로 변경하는 등의 작업을 수행하여 `Recipe`에 props로 전달할 수 있습니다:</Trans>

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Here, `<Recipe {...recipe} key={recipe.id} />` is a syntax shortcut saying "pass all properties of the `recipe` object as props to the `Recipe` component". You could also write each prop explicitly: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.
<Trans>여기서 `<Recipe {...recipe} key={recipe.id} />`는 " `recipe` 객체의 모든 속성을 `Recipe` 컴포넌트에 props로 전달 " 하는 구문 바로 가기입니다. 각 prop을 명시적으로 작성할 수도 있습니다:  `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.</Trans>

**Note that the `key` is specified on the `<Recipe>` itself rather than on the root `<div>` returned from `Recipe`.** This is because this `key` is needed directly within the context of the surrounding array. Previously, you had an array of `<div>`s so each of them needed a `key`, but now you have an array of `<Recipe>`s. In other words, when you extract a component, don't forget to leave the `key` outside the JSX you copy and paste.
<Trans>**`key`는 `Recipe`에서 반환된 루트 `<div>`가 아닌 `<Recipe>` 자체에 지정된다는 점에 유의하세요.** 이것은 이 `key`가 주변 배열의 문맥에서 직접 필요하기 때문입니다. 이전에는 `<div>`의 배열이 있었으므로 각각에 `key`가 필요했지만 이제 `<Recipe>`의 배열이 있습니다. 다시 말해, component를 추출할 때, 복사하여 붙여 넣은 JSX 외부에 `key`를 두지 않도록 주의하세요.</Trans>

</Solution>

#### List with a separator <Trans>구분자가 있는 목록</Trans> {/*list-with-a-separator*/}

This example renders a famous haiku by Katsushika Hokusai, with each line wrapped in a `<p>` tag. Your job is to insert an `<hr />` separator between each paragraph. Your resulting structure should look like this:
<Trans>이 예제는 Katsushika Hokusai의 유명한 하이쿠를 렌더링하며, 각 줄은 `<p>`태그로 감싸져 있습니다. 각 단락 사이에 `<hr />` 구분자를 삽입하세요. 결과 구조는 다음과 같아야 합니다:</Trans>

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

A haiku only contains three lines, but your solution should work with any number of lines. Note that `<hr />` elements only appear *between* the `<p>` elements, not in the beginning or the end!
<Trans>원래 하이쿠는 세 줄로만 구성되어 있지만, 여러분의 답안에는 몇 줄이 되든 상관 없습니다. `<hr />` 요소는 각 `<p>` 요소 사이에만 표시되며, 시작과 끝에는 표시되지 않는다는 점에 유의하세요!</Trans>

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(This is a rare case where index as a key is acceptable because a poem's lines will never reorder.)
<Trans> (이 예제는 드문 케이스로, 시의 행은 절대 순서가 바뀌지 않을 것이기 때문에 인덱스를 key로 사용해도 괜찮습니다.)</Trans>

<Hint>
You'll either need to convert `map` to a manual loop, or use a fragment.
<Trans>`map`을 수동 루프로 변환하거나 fragment를 사용해야 합니다.</Trans>
</Hint>

<Solution>

You can write a manual loop, inserting `<hr />` and `<p>...</p>` into the output array as you go:
<Trans>`<hr />` 및 `<p>...</p>`를 출력 배열에 삽입하여 수동 루프를 작성할 수 있습니다:</Trans>

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Fill the output array
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // Remove the first <hr />
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Using the original line index as a `key` doesn't work anymore because each separator and paragraph are now in the same array. However, you can give each of them a distinct key using a suffix, e.g. `key={i + '-text'}`.
<Trans>각 구분 기호와 단락이 이제 동일한 배열에 있기 때문에 원래 줄 인덱스를 `key`로 사용하는 것은 더 이상 작동하지 않습니다. 그러나 접미사를 사용(예를 들어, `key={i + '-text'}`) 하여 각각 고유한 key를 부여할 수 있습니다. .</Trans>

Alternatively, you could render a collection of fragments which contain `<hr />` and `<p>...</p>`. However, the `<>...</>` shorthand syntax doesn't support passing keys, so you'd have to write `<Fragment>` explicitly:
<Trans>또는 `<hr />` 및 `<p>...</p>`를 포함하는 fragments 컬렉션을 렌더링할 수 있습니다. 그러나 `<>...</>` 단축 구문은 key 전달을 지원하지 않으므로 `<Fragment>`를 명시적으로 작성해야 합니다.</Trans>

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Remember, fragments (often written as `<> </>`) let you group JSX nodes without adding extra `<div>`s!
<Trans>기억하세요, fragments (종종 `<> </>`로 작성됨)를 사용하면 추가 `<div>`를 추가하지 않고도 JSX 노드를 그룹화할 수 있습니다!</Trans>

</Solution>

</Challenges>
