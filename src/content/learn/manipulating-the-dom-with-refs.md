---
title: Manipulating the DOM with Refs
translatedTitle: ref로 DOM 조작하기
---

<Intro>

React automatically updates the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) to match your render output, so your components won't often need to manipulate it. However, sometimes you might need access to the DOM elements managed by React--for example, to focus a node, scroll to it, or measure its size and position. There is no built-in way to do those things in React, so you will need a *ref* to the DOM node.
<Trans>React는 렌더링 출력과 일치하도록 [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)을 자동으로 업데이트하므로 컴포넌트가 자주 조작할 필요가 없습니다. 하지만 때로는 노드에 포커스를 맞추거나 스크롤하거나 크기와 위치를 측정하기 위해 React가 관리하는 DOM 요소에 접근해야 할 수도 있습니다. React에는 이러한 작업을 수행할 수 있는 내장된 방법이 없으므로 DOM 노드에 대한 *ref*가 필요합니다.</Trans>

</Intro>

<YouWillLearn>

- How to access a DOM node managed by React with the `ref` attribute
- How the `ref` JSX attribute relates to the `useRef` Hook
- How to access another component's DOM node
- In which cases it's safe to modify the DOM managed by React

<TransBlock>
  - `ref` 어트리뷰트로 React가 관리하는 DOM 노드에 접근하는 방법
  - `ref` JSX 속성이 `useRef` 훅과 관련되는 방법
  - 다른 컴포넌트의 DOM 노드에 접근하는 방법
  - 어떤 경우에 React가 관리하는 DOM을 수정해도 안전한지
</TransBlock>

</YouWillLearn>

## Getting a ref to the node<Trans>노드에 대한 ref 가져오기</Trans> {/*getting-a-ref-to-the-node*/}

To access a DOM node managed by React, first, import the `useRef` Hook:
<Trans>React가 관리하는 DOM 노드에 접근하려면, 먼저 `useRef` 훅을 불러옵니다:</Trans>

```js
import { useRef } from 'react';
```

Then, use it to declare a ref inside your component:
<Trans>그런 다음 컴포넌트 내부에서 ref를 선언합니다:</Trans>

```js
const myRef = useRef(null);
```

Finally, pass it to the DOM node as the `ref` attribute:
<Trans>마지막으로, DOM 노드에 `ref` 속성으로 전달합니다:</Trans>

```js
<div ref={myRef}>
```

The `useRef` Hook returns an object with a single property called `current`. Initially, `myRef.current` will be `null`. When React creates a DOM node for this `<div>`, React will put a reference to this node into `myRef.current`. You can then access this DOM node from your [event handlers](/learn/responding-to-events) and use the built-in [browser APIs](https://developer.mozilla.org/docs/Web/API/Element) defined on it.
<Trans>이 `useRef` 훅은 `current` 라고 하는 프로퍼티가 포함된 객체를 반환합니다. 처음에는 `myRef.current` 는 `null` 이 될 것입니다. React가 이 `<div>`에 대한 DOM 노드를 생성하면, React는 이 노드에 대한 참조를 `myRef.current`에 넣습니다. 그런 다음 [이벤트 핸들러](/learn/responding-to-events)에서 이 DOM 노드에 액세스하고 여기에 정의된 내장 [브라우저 API](https://developer.mozilla.org/docs/Web/API/Element)를 사용할 수 있습니다.</Trans>

```js
// You can use any browser APIs, for example:
// 모든 브라우저 API를 사용할 수 있습니다. 예를 들어:
myRef.current.scrollIntoView();
```

### Example: Focusing a text input<Trans>예: 텍스트 입력에 초점 맞추기</Trans> {/*example-focusing-a-text-input*/}

In this example, clicking the button will focus the input:
<Trans>이 예제에서는 버튼을 클릭하면 input에 초점이 맞춰집니다:</Trans>

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

To implement this:
<Trans>이를 구현하려면:</Trans>

1. Declare `inputRef` with the `useRef` Hook.
2. Pass it as `<input ref={inputRef}>`. This tells React to **put this `<input>`'s DOM node into `inputRef.current`.**
3. In the `handleClick` function, read the input DOM node from `inputRef.current` and call [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) on it with `inputRef.current.focus()`.
4. Pass the `handleClick` event handler to `<button>` with `onClick`.

<TransBlock>
1. `useRef` 훅으로 `inputRef`를 선언합니다.
2. 이를 `<input ref={inputRef}>`에 전달합니다. 이렇게 하면 React가 이 `<input>`의 DOM 노드를 `inputRef.current`에 넣을 것입니다.
3. `handleClick` 함수에서 `inputRef.current`로부터 input DOM 노드를 읽어와서 `inputRef.current.focus()`로 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)를 호출합니다.
4. `<button>`의 `onClick`에 `handleClick` 이벤트 핸들러를 전달합니다.
</TransBlock>

While DOM manipulation is the most common use case for refs, the `useRef` Hook can be used for storing other things outside React, like timer IDs. Similarly to state, refs remain between renders. Refs are like state variables that don't trigger re-renders when you set them. Read about refs in [Referencing Values with Refs.](/learn/referencing-values-with-refs)
<Trans>DOM 조작이 ref의 가장 일반적인 사용 사례이지만, `useRef` 훅은 timer ID와 같은 다른 것들을 React 외부에 저장하는 데 사용될 수 있습니다. state와 유사하게 ref는 렌더링 사이에 유지됩니다. ref는 state 변수와 비슷하지만 설정할 때 재렌더링을 트리거하지 않습니다. ref에 대한 자세한 내용은 [Refs로 값 참조하기](/learn/referencing-values-with-refs)에서 읽어보세요.</Trans>

### Example: Scrolling to an element<Trans>예: element로 스크롤하기</Trans> {/*example-scrolling-to-an-element*/}

You can have more than a single ref in a component. In this example, there is a carousel of three images. Each button centers an image by calling the browser [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) method on the corresponding DOM node:
<Trans>컴포넌트를 ref를 하나 이상 포함할 수도 있습니다. 이 예시에는 세 개의 이미지로 구성된 캐러셀이 있습니다. 각 버튼은 DOM 노드에서 브라우저 [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) 메서드를 호출하여 해당 이미지를 중앙에 배치합니다:</Trans>

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Tom
        </button>
        <button onClick={handleScrollToSecondCat}>
          Maru
        </button>
        <button onClick={handleScrollToThirdCat}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placekitten.com/g/200/200"
              alt="Tom"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/300/200"
              alt="Maru"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placekitten.com/g/250/200"
              alt="Jellylorum"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### How to manage a list of refs using a ref callback<Trans>ref 콜백을 사용하여 refs 목록을 관리하는 방법</Trans> {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

In the above examples, there is a predefined number of refs. However, sometimes you might need a ref to each item in the list, and you don't know how many you will have. Something like this **wouldn't work**:
<Trans>위의 예에서는 ref를 항목 수만큼 미리 정의해 두었습니다. 그러나 목록의 각 항목에 대해 얼마나 많은 ref가 필요할지 알 수 없는 경우도 있습니다. 이런 경우에는 제대로 **작동하지 않을 것입니다**:</Trans>

```js
<ul>
  {items.map((item) => {
    // Doesn't work! 작동하지 않습니다!
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

This is because **Hooks must only be called at the top-level of your component.** You can't call `useRef` in a loop, in a condition, or inside a `map()` call.
<Trans>이는 *훅은 컴포넌트의 최상위 레벨에서만 호출해야 하기 때문입니다.** 반복문 또는 `map()` 내부에서는 `useRef`를 호출할 수 없습니다.</Trans>

One possible way around this is to get a single ref to their parent element, and then use DOM manipulation methods like [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) to "find" the individual child nodes from it. However, this is brittle and can break if your DOM structure changes.
<Trans>이 문제를 해결할 수 있는 한 가지 방법은 부모 엘리먼트에 대한 단일 ref를 가져온 다음 [`querySelectorAll`](https://developer.mozilla.org/ko/docs/Web/API/Document/querySelectorAll)과 같은 DOM 조작 메서드를 사용하여 개별 하위 노드를 "찾는" 것입니다. 하지만 이 방법은 DOM 구조가 변경되면 깨질 수 있습니다.</Trans>

Another solution is to **pass a function to the `ref` attribute.** This is called a [`ref` callback.](/reference/react-dom/components/common#ref-callback) React will call your ref callback with the DOM node when it's time to set the ref, and with `null` when it's time to clear it. This lets you maintain your own array or a [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), and access any ref by its index or some kind of ID.
<Trans>또 다른 해결책은 **`ref` 속성에 함수를 전달**하는 것입니다. 이를 [`ref` 콜백](/reference/react-dom/components/common#ref-callback)이라고 합니다. React는 ref를 설정할 때가 되면 DOM 노드로, 지울 때가 되면 `null`로 ref 콜백을 호출할 것입니다. 이를 통해 자신만의 배열이나 [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)을 유지 관리하고, 인덱스나 일종의 ID로 모든 ref에 접근할 수 있습니다.</Trans>

This example shows how you can use this approach to scroll to an arbitrary node in a long list:
<Trans>다음 예제는 이러한 접근으로 긴 목록에서 임의 노드로 스크롤하는 방법을 보여 줍니다:</Trans>

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const itemsRef = useRef(null);

  function scrollToId(itemId) {
    const map = getMap();
    const node = map.get(itemId);
    node.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // Initialize the Map on first usage.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToId(0)}>
          Tom
        </button>
        <button onClick={() => scrollToId(5)}>
          Maru
        </button>
        <button onClick={() => scrollToId(9)}>
          Jellylorum
        </button>
      </nav>
      <div>
        <ul>
          {catList.map(cat => (
            <li
              key={cat.id}
              ref={(node) => {
                const map = getMap();
                if (node) {
                  map.set(cat.id, node);
                } else {
                  map.delete(cat.id);
                }
              }}
            >
              <img
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

In this example, `itemsRef` doesn't hold a single DOM node. Instead, it holds a [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) from item ID to a DOM node. ([Refs can hold any values!](/learn/referencing-values-with-refs)) The [`ref` callback](/reference/react-dom/components/common#ref-callback) on every list item takes care to update the Map:
<Trans>이 예제에서 `itemsRef`는 단일 DOM 노드를 보유하지 않습니다. 대신 항목 ID에서 DOM 노드로의 [Map](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Map)을 보유합니다. ([Ref는 모든 값을 보유할 수 있습니다!](/learn/referencing-values-with-refs)) 모든 목록 항목의 [`ref` 콜백](/reference/react-dom/components/common#ref-callback)은 맵을 업데이트합니다:</Trans>

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
    if (node) {
      // Add to the Map
      map.set(cat.id, node);
    } else {
      // Remove from the Map
      map.delete(cat.id);
    }
  }}
>
```

This lets you read individual DOM nodes from the Map later.
<Trans>이렇게 하면 나중에 Map에서 개별 DOM 노드를 읽을 수 있습니다.</Trans>

</DeepDive>

## Accessing another component's DOM nodes<Trans>다른 컴포넌트의 DOM 노드에 접근하기</Trans> {/*accessing-another-components-dom-nodes*/}

When you put a ref on a built-in component that outputs a browser element like `<input />`, React will set that ref's `current` property to the corresponding DOM node (such as the actual `<input />` in the browser).
<Trans>`<input />`과 같은 브라우저 엘리먼트를 출력하는 내장 컴포넌트에 ref를 넣으면, React는 해당 ref의 `current` 프로퍼티를 해당 DOM 노드(예: 브라우저의 실제 `<input />`)로 설정합니다.</Trans>

However, if you try to put a ref on **your own** component, like `<MyInput />`, by default you will get `null`. Here is an example demonstrating it. Notice how clicking the button **does not** focus the input:
<Trans>그러나 `<MyInput />`과 같은 **여러분이 만든** 컴포넌트에 ref를 넣으려고 하면 기본적으로 `null`이 반환됩니다. 다음은 이를 보여주는 예시입니다. 버튼을 클릭해도 입력에 초점이 맞춰지지 **않는** 것을 확인할 수 있습니다:</Trans>

<Sandpack>

```js
import { useRef } from 'react';

function MyInput(props) {
  return <input {...props} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

To help you notice the issue, React also prints an error to the console:
<Trans>문제를 알아차리는 데 도움이 되도록 React는 콘솔에 오류를 출력하기도 합니다:</Trans>

<ConsoleBlock level="error">

Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?<br/>
// 경고: 함수 컴포넌트에는 refs를 지정할 수 없습니다. 이 ref에 접근하려는 시도는 실패합니다. React.forwardRef()를 사용하려고 하셨나요?
</ConsoleBlock>

This happens because by default React does not let a component access the DOM nodes of other components. Not even for its own children! This is intentional. Refs are an escape hatch that should be used sparingly. Manually manipulating _another_ component's DOM nodes makes your code even more fragile.
<Trans>이는 기본적으로 React가 컴포넌트가 다른 컴포넌트의 DOM 노드에 접근하는 것을 허용하지 않기 때문입니다. 심지어 자신의 자식에게도요! 이것은 의도적인 것입니다. ref는 탈출구이기 때문에 아껴서 사용해야 합니다. _다른_ 컴포넌트의 DOM 노드를 수동으로 조작하면 코드가 훨씬 더 취약해집니다.</Trans>

Instead, components that _want_ to expose their DOM nodes have to **opt in** to that behavior. A component can specify that it "forwards" its ref to one of its children. Here's how `MyInput` can use the `forwardRef` API:
<Trans>대신, DOM 노드를 노출하길 _원하는_ 컴포넌트에 해당 동작을 **설정**해야 합니다. 컴포넌트는 자신의 ref를 자식 중 하나에 "전달"하도록 지정할 수 있습니다. `MyInput`이 `forwardRef` API를 사용하는 방법은 다음과 같습니다:</Trans>

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

This is how it works:
<Trans>작동 방식은 다음과 같습니다:</Trans>

1. `<MyInput ref={inputRef} />` tells React to put the corresponding DOM node into `inputRef.current`. However, it's up to the `MyInput` component to opt into that--by default, it doesn't.
2. The `MyInput` component is declared using `forwardRef`. **This opts it into receiving the `inputRef` from above as the second `ref` argument** which is declared after `props`.
3. `MyInput` itself passes the `ref` it received to the `<input>` inside of it.

<TransBlock>
1. `<MyInput ref={inputRef} />`는 React에게 해당 DOM 노드를 `inputRef.current`에 넣으라고 지시합니다. 그러나 이를 선택할지는 `MyInput` 컴포넌트에 달려 있으며, 기본적으로 그렇지 않습니다.
2. `MyInput` 컴포넌트를 `forwardRef`를 사용하여 선언하면, `props` 다음의 **두 번째 `ref` 인수**에 위의 `inputRef`를 받도록 설정됩니다.
3. `MyInput`은 수신한 `ref`를 내부의 `<input>`으로 전달합니다.
</TransBlock>

Now clicking the button to focus the input works:
<Trans>이제 버튼을 클릭하면 input에 초점이 맞춰집니다:</Trans>

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

In design systems, it is a common pattern for low-level components like buttons, inputs, and so on, to forward their refs to their DOM nodes. On the other hand, high-level components like forms, lists, or page sections usually won't expose their DOM nodes to avoid accidental dependencies on the DOM structure.
<Trans>디자인 시스템에서 버튼, 입력 등과 같은 저수준 컴포넌트는 해당 ref를 DOM 노드로 전달하는 것이 일반적인 패턴입니다. 반면 양식, 목록 또는 페이지 섹션과 같은 상위 수준 컴포넌트는 일반적으로 DOM 구조에 대한 우발적 종속성을 피하기 위해 해당 DOM 노드를 노출하지 않습니다.</Trans>

<DeepDive>

#### Exposing a subset of the API with an imperative handle<Trans>명령형 핸들로 API의 하위 집합 노출하기</Trans> {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

In the above example, `MyInput` exposes the original DOM input element. This lets the parent component call `focus()` on it. However, this also lets the parent component do something else--for example, change its CSS styles. In uncommon cases, you may want to restrict the exposed functionality. You can do that with `useImperativeHandle`:
<Trans>위의 예시에서 `MyInput`은 원본 DOM input 엘리먼트를 노출합니다. 이를 통해 부모 컴포넌트가 이 요소에 `focus()`를 호출할 수 있습니다. 그런데 이렇게 하면 부모 컴포넌트가 다른 작업(예: CSS 스타일 변경)을 할 수도 있습니다. 드문 경우지만 노출되는 기능을 제한하고 싶을 수도 있을 것입니다. 그럴 땐 `useImperativeHandle`을 사용하면 됩니다:</Trans>

<Sandpack>

```js
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Here, `realInputRef` inside `MyInput` holds the actual input DOM node. However, `useImperativeHandle` instructs React to provide your own special object as the value of a ref to the parent component. So `inputRef.current` inside the `Form` component will only have the `focus` method. In this case, the ref "handle" is not the DOM node, but the custom object you create inside `useImperativeHandle` call.
<Trans>여기서 `MyInput` 내부의 `realInputRef`는 실제 input DOM 노드를 보유합니다. 하지만 `useImperativeHandle`은 부모 컴포넌트에 대한 ref 값으로 고유한 특수 객체를 제공하도록 React에 지시합니다. 따라서 `Form` 컴포넌트 내부의 `inputRef.current`에는 `focus` 메서드만 있게 됩니다. 이 경우 ref "핸들"은 DOM 노드가 아니라 `useImperativeHandle()` 내부에서 생성한 사용자 정의 객체입니다.</Trans>

</DeepDive>

## When React attaches the refs<Trans>React가 ref를 첨부할 때</Trans> {/*when-react-attaches-the-refs*/}

In React, every update is split in [two phases](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):
<Trans>React에서 모든 업데이트는 [두 단계](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom)로 나뉩니다:</Trans>

* During **render,** React calls your components to figure out what should be on the screen.
* During **commit,** React applies changes to the DOM.

<TransBlock>
- **렌더링** 하는 동안 React는 컴포넌트를 호출하여 화면에 무엇이 표시되어야 하는지 파악합니다.
- **커밋(commit)** 하는 동안 React는 DOM에 변경 사항을 적용합니다.
</TransBlock>

In general, you [don't want](/learn/referencing-values-with-refs#best-practices-for-refs) to access refs during rendering. That goes for refs holding DOM nodes as well. During the first render, the DOM nodes have not yet been created, so `ref.current` will be `null`. And during the rendering of updates, the DOM nodes haven't been updated yet. So it's too early to read them.
<Trans>일반적으로 렌더링 중에는 ref에 액세스하는 것을 [원하지 않을 것입니다](/learn/referencing-values-with-refs#best-practices-for-refs). DOM 노드를 보유하는 ref도 마찬가지입니다. 첫 번째 렌더링 중에는 DOM 노드가 아직 생성되지 않았으므로 `ref.current`는 `null`이 됩니다. 그리고 업데이트를 렌더링하는 동안에는 DOM 노드가 아직 업데이트되지 않았습니다. 따라서 이를 읽기에는 너무 이르죠.</Trans>

React sets `ref.current` during the commit. Before updating the DOM, React sets the affected `ref.current` values to `null`. After updating the DOM, React immediately sets them to the corresponding DOM nodes.
<Trans>React는 커밋하는 동안에 `ref.current`를 설정합니다. React는 DOM이 업데이트 되기 전에는 `ref.current`의 값을 `null`로 설정하였다가, DOM이 업데이트된 직후 해당 DOM 노드로 다시 설정합니다.</Trans>

**Usually, you will access refs from event handlers.** If you want to do something with a ref, but there is no particular event to do it in, you might need an Effect. We will discuss effects on the next pages.
<Trans>**일반적으로 이벤트 핸들러에서 ref에 접근합니다.** ref로 무언가를 하고 싶지만 그 작업을 수행할 특정 이벤트가 없다면, Effect가 필요할 수 있습니다. Effect에 대해서는 다음 페이지에서 설명하겠습니다.</Trans>

<DeepDive>

#### Flushing state updates synchronously with flushSync<Trans>플러싱 state는 flushSync와 동기식으로 업데이트됩니다.</Trans> {/*flushing-state-updates-synchronously-with-flush-sync*/}

Consider code like this, which adds a new todo and scrolls the screen down to the last child of the list. Notice how, for some reason, it always scrolls to the todo that was *just before* the last added one:
<Trans>다음과 같이 새 할 일을 추가하고 목록의 마지막 하위 항목까지 화면을 아래로 스크롤하는 코드를 고려해 보세요. 어떤 이유에서인지 항상 마지막으로 추가한 할 일의 *바로 앞*에 있던 할 일로 스크롤되는 것을 볼 수 있습니다:</Trans>

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

The issue is with these two lines:
<Trans>문제는 바로 다음 두 줄입니다:</Trans>

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

In React, [state updates are queued.](/learn/queueing-a-series-of-state-updates) Usually, this is what you want. However, here it causes a problem because `setTodos` does not immediately update the DOM. So the time you scroll the list to its last element, the todo has not yet been added. This is why scrolling always "lags behind" by one item.
<Trans>React에서는 [state 업데이트가 큐에 등록됩니다.](/learn/queueing-a-series-of-state-updates) 일반적으로 이것은 사용자가 원하는 것입니다. 그러나 여기서는 `setTodos`가 DOM을 즉시 업데이트하지 않기 때문에 문제가 발생합니다. 따라서 목록을 마지막 요소로 스크롤할 때 할 일이 아직 추가되지 않은 상태입니다. 이것이 스크롤이 항상 한 항목씩 "뒤처지는" 이유입니다.</Trans>

To fix this issue, you can force React to update ("flush") the DOM synchronously. To do this, import `flushSync` from `react-dom` and **wrap the state update** into a `flushSync` call:
<Trans>이 문제를 해결하기 위해 React가 DOM을 동기적으로 업데이트("플러시")하도록 강제할 수 있습니다. 이렇게 하려면 `react-dom`에서 `flushSync`를 import하고 **state 업데이트를** `flushSync` 호출로 **감싸면** 됩니다:</Trans>

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

This will instruct React to update the DOM synchronously right after the code wrapped in `flushSync` executes. As a result, the last todo will already be in the DOM by the time you try to scroll to it:
<Trans>이렇게 하면 `flushSync`로 감싸진 코드가 실행된 직후 React가 DOM을 동기적으로 업데이트하도록 지시합니다. 그 결과 스크롤을 시도할 때 DOM에 이미 마지막 할 일이 있을 것입니다:</Trans>

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);      
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Best practices for DOM manipulation with refs<Trans>ref를 이용한 DOM 조작 모범 사례</Trans> {/*best-practices-for-dom-manipulation-with-refs*/}

Refs are an escape hatch. You should only use them when you have to "step outside React". Common examples of this include managing focus, scroll position, or calling browser APIs that React does not expose.
<Trans>Ref는 탈출구입니다. "React 외부로 나가야" 할 때만 사용해야 합니다. 일반적인 예로는 포커스, 스크롤 위치를 관리하거나 React가 노출하지 않는 브라우저 API를 호출하는 것이 있습니다.</Trans>

If you stick to non-destructive actions like focusing and scrolling, you shouldn't encounter any problems. However, if you try to **modify** the DOM manually, you can risk conflicting with the changes React is making.
<Trans>포커스나 스크롤 같은 비파괴적 동작을 고수한다면 문제가 발생하지 않을 것입니다. 그러나 DOM을 수동으로 **수정**하려고 하면 React가 수행하는 변경 사항과 충돌할 위험이 있습니다.</Trans>

To illustrate this problem, this example includes a welcome message and two buttons. The first button toggles its presence using [conditional rendering](/learn/conditional-rendering) and [state](/learn/state-a-components-memory), as you would usually do in React. The second button uses the [`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) to forcefully remove it from the DOM outside of React's control.
<Trans>다음 예시에는 이 문제를 설명하기 위해 환영 메시지와 두 개의 버튼이 포함되어 있습니다. 첫 번째 버튼은 React에서 일반적으로 사용하는 것처럼 [조건부 렌더링](/learn/conditional-rendering)과 [state](/learn/state-a-components-memory)를 사용하여 그 존재 여부를 전환합니다. 두 번째 버튼은 [`remove()` DOM API](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove)를 사용하여 React가 제어할 수 없는 DOM에서 강제로 제거합니다.</Trans>

Try pressing "Toggle with setState" a few times. The message should disappear and appear again. Then press "Remove from the DOM". This will forcefully remove it. Finally, press "Toggle with setState":
<Trans>"Toggle with setState"를 몇 번 눌러보세요. 메시지가 사라졌다가 다시 나타날 것입니다. 그런 다음 "Remove from the DOM"을 누르세요. 그러면 강제로 제거될 것입니다. 마지막으로 "Toggle with setState"를 눌러보세요:</Trans>

<Sandpack>

```js
import {useState, useRef} from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

After you've manually removed the DOM element, trying to use `setState` to show it again will lead to a crash. This is because you've changed the DOM, and React doesn't know how to continue managing it correctly.
<Trans>DOM 엘리먼트를 수동으로 제거한 후 `setState`를 사용하여 다시 표시하려고 하면 충돌이 발생합니다. 이는 사용자가 DOM을 변경했고 React가 이를 계속 올바르게 관리하는 방법을 모르기 때문입니다.</Trans>

**Avoid changing DOM nodes managed by React.** Modifying, adding children to, or removing children from elements that are managed by React can lead to inconsistent visual results or crashes like above.
<Trans>**React가 관리하는 DOM 노드를 변경하지 마세요.** React가 관리하는 요소를 수정하거나, 자식을 추가하거나 제거하면, 위와 같이 일관성 없는 시각적 결과나 충돌이 발생할 수 있습니다.</Trans>

However, this doesn't mean that you can't do it at all. It requires caution. **You can safely modify parts of the DOM that React has _no reason_ to update.** For example, if some `<div>` is always empty in the JSX, React won't have a reason to touch its children list. Therefore, it is safe to manually add or remove elements there.
<Trans>그렇다고 전혀 할 수 없다는 건 아니고, 주의가 필요하다는 의미입니다. **React가 업데이트할 _이유가 없는_ DOM의 일부는 안전하게 수정할 수 있습니다.** 예를 들어 JSX에서 일부 `<div>`가 항상 비어 있는 경우, React는 그 자식 목록을 건드릴 이유가 없습니다. 따라서 수동으로 요소를 추가하거나 제거하더라도 안전합니다.</Trans>

<Recap>

- Refs are a generic concept, but most often you'll use them to hold DOM elements.
- You instruct React to put a DOM node into `myRef.current` by passing `<div ref={myRef}>`.
- Usually, you will use refs for non-destructive actions like focusing, scrolling, or measuring DOM elements.
- A component doesn't expose its DOM nodes by default. You can opt into exposing a DOM node by using `forwardRef` and passing the second `ref` argument down to a specific node.
- Avoid changing DOM nodes managed by React.
- If you do modify DOM nodes managed by React, modify parts that React has no reason to update.

<TransBlock>
- Ref는 일반적인 개념이긴 하지만, 대부분 DOM 엘리먼트를 보관할 때 사용합니다.
- `<div ref={myRef}>`를 전달해 DOM 노드를 `myRef.current`에 넣으라고 React에 지시합니다.
- 보통은 포커스, 스크롤, DOM 엘리먼트 측정과 같은 비파괴적인 동작에 ref를 사용합니다.
- 컴포넌트는 기본적으로 DOM 노드를 노출하지 않습니다. `forwardRef`를 사용하고 두 번째 `ref` 인수를 특정 노드에 전달하여 DOM 노드를 노출하도록 설정할 수 있습니다.
- React가 관리하는 DOM 노드를 변경하지 마세요.
- React가 관리하는 DOM 노드를 수정해야 한다면 React가 업데이트할 이유가 없는 부분을 수정하세요.
</TransBlock>
</Recap>

<Challenges>

#### Play and pause the video<Trans>동영상 재생 및 일시 정지하기</Trans> {/*play-and-pause-the-video*/}

In this example, the button toggles a state variable to switch between a playing and a paused state. However, in order to actually play or pause the video, toggling state is not enough. You also need to call [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) and [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) on the DOM element for the `<video>`. Add a ref to it, and make the button work.
<Trans>이 예시에서는 버튼을 토글하면 state 변수가 재생 및 일시정지 사이를 전환합니다. 하지만 실제로 동영상을 재생하거나 일시 정지하려면 state 토글만으로는 충분하지 않습니다. 추가로 `<video>`에 대한 DOM 요소에서 [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)와 [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause)를 호출해야만 합니다. 여기에 ref를 추가하고 버튼이 작동하도록 하세요.</Trans>

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

For an extra challenge, keep the "Play" button in sync with whether the video is playing even if the user right-clicks the video and plays it using the built-in browser media controls. You might want to listen to `onPlay` and `onPause` on the video to do that.
<Trans>추가 과제를 수행하려면, 사용자가 동영상을 마우스 오른쪽 버튼으로 클릭하여 브라우저의 내장 미디어 컨트롤로 재생하더라도 동영상이 재생중인지 여부와 '재생' 버튼이 동기화되도록 유지하세요. 이를 위해 동영상에서 `onPlay` 및 `onPause` 기능을 사용하는게 좋을 것입니다.</Trans>

<Solution>

Declare a ref and put it on the `<video>` element. Then call `ref.current.play()` and `ref.current.pause()` in the event handler depending on the next state.
<Trans>ref를 선언하고 `<video>` 요소에 넣으세요. 그런 다음 다음 state에 따라 이벤트 핸들러에서 `ref.current.play()`와 `ref.current.pause()`를 호출하세요.</Trans>

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

In order to handle the built-in browser controls, you can add `onPlay` and `onPause` handlers to the `<video>` element and call `setIsPlaying` from them. This way, if the user plays the video using the browser controls, the state will adjust accordingly.
<Trans>브라우저 내장 컨트롤을 처리하기 위해 `<video>` 요소에 `onPlay` 및 `onPause` 핸들러를 추가하고, 이 핸들러에서 `setIsPlaying`을 호출하면 됩니다. 이렇게 하면 사용자가 브라우저 컨트롤을 사용하여 동영상을 재생하면 그에 따라 state가 조정됩니다.</Trans>

</Solution>

#### Focus the search field<Trans>검색 필드에 초점 맞추기</Trans> {/*focus-the-search-field*/}

Make it so that clicking the "Search" button puts focus into the field.
<Trans>"Search" 버튼을 클릭하면 필드에 초점이 맞춰지도록 설정하세요.</Trans>

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Add a ref to the input, and call `focus()` on the DOM node to focus it:
<Trans>input에 ref를 추가하고 DOM 노드에서 `focus()`를 호출하여 포커스를 지정하세요:</Trans>

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Scrolling an image carousel<Trans>이미지 캐러셀 스크롤하기</Trans> {/*scrolling-an-image-carousel*/}

This image carousel has a "Next" button that switches the active image. Make the gallery scroll horizontally to the active image on click. You will want to call [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) on the DOM node of the active image:
<Trans>이 이미지 캐러셀에는 활성 이미지를 전환하는 "Next" 버튼이 있습니다. 클릭시 갤러리가 활성 이미지의 위치로 가로 스크롤 되도록 하세요. 활성 이미지의 DOM 노드에서 [`scrollIntoView()`](https://developer.mozilla.org/ko/docs/Web/API/Element/scrollIntoView)를 호출해야 합니다:</Trans>

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

You don't need to have a ref to every image for this exercise. It should be enough to have a ref to the currently active image, or to the list itself. Use `flushSync` to ensure the DOM is updated *before* you scroll.
<Trans>모든 이미지에 대한 ref를 가질 필요는 없습니다. 현재 활성화된 이미지 또는 목록 자체에 대한 ref가 있으면 충분합니다. `flushSync`를 사용하여 스크롤하기 전에 DOM이 업데이트 되도록 하세요.</Trans>

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

You can declare a `selectedRef`, and then pass it conditionally only to the current image:
<Trans>`selectedRef`를 선언한 다음 조건부로 현재 이미지에만 전달할 수 있습니다:</Trans>

```js
<li ref={index === i ? selectedRef : null}>
```

When `index === i`, meaning that the image is the selected one, the `<li>` will receive the `selectedRef`. React will make sure that `selectedRef.current` always points at the correct DOM node.
<Trans>`index === i`일 때, 즉 선택된 이미지일 때, `<li>`는 `selectedRef`를 받습니다. React는 `selectedRef.current`가 항상 올바른 DOM 노드를 가리키도록 할 것입니다.</Trans>

Note that the `flushSync` call is necessary to force React to update the DOM before the scroll. Otherwise, `selectedRef.current` would always point at the previously selected item.
<Trans>`flushSync` 호출은 스크롤 전에 React가 DOM을 업데이트하도록 강제하는 데에 필요하다는 점에 유의하세요. 그렇지 않으면 `selectedRef.current`가 항상 이전에 선택된 항목을 가리키게 될 것입니다.</Trans>

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });            
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://placekitten.com/250/200?image=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### Focus the search field with separate components<Trans>별도의 컴포넌트로 검색 필드에 초점 맞추기</Trans> {/*focus-the-search-field-with-separate-components*/}

Make it so that clicking the "Search" button puts focus into the field. Note that each component is defined in a separate file and shouldn't be moved out of it. How do you connect them together?
<Trans>"Search" 버튼을 클릭하면 필드에 초점이 맞춰지도록 만드세요. 각 컴포넌트는 별도의 파일에 정의되어 있으며, 파일 밖으로 이동해서는 안 됩니다. 어떻게 서로 연결할 수 있을까요?</Trans>
<Hint>

You'll need `forwardRef` to opt into exposing a DOM node from your own component like `SearchInput`.
<Trans>`SearchInput`과 같은 자체 컴포넌트에서 DOM 노드를 노출하도록 선택하려면 `forwardRef`가 필요할 것입니다.</Trans>

</Hint>

<Sandpack>

```js App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

You'll need to add an `onClick` prop to the `SearchButton`, and make the `SearchButton` pass it down to the browser `<button>`. You'll also pass a ref down to `<SearchInput>`, which will forward it to the real `<input>` and populate it. Finally, in the click handler, you'll call `focus` on the DOM node stored inside that ref.
<Trans>`SearchButton`에 `onClick` prop을 추가하고, `SearchButton`이 이 onClick prop을 브라우저의 `<button>`으로 전달하도록 해야 합니다. 또한 `SearchInput`에 ref를 전달하면 실제 `input`으로 전달되어 채워질 것입니다. 마지막으로 click 핸들러에서 해당 ref 안에 저장된 DOM 노드에서 `focus`를 호출합니다.</Trans>

<Sandpack>

```js App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js SearchInput.js
import { forwardRef } from 'react';

export default forwardRef(
  function SearchInput(props, ref) {
    return (
      <input
        ref={ref}
        placeholder="Looking for something?"
      />
    );
  }
);
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
