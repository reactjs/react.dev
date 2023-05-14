---
title: cloneElement
translators: [이승효]
---

<Pitfall>

Using `cloneElement` is uncommon and can lead to fragile code. [See common alternatives.](#alternatives)
<Trans>`cloneElement`를 사용하는 것은 일반적이지 않으며 취약한 코드를 초래할 수 있습니다. [일반적인 대안](#alternatives)을 살펴보세요.</Trans>

</Pitfall>

<Intro>

`cloneElement` lets you create a new React element using another element as a starting point.
<Trans>`cloneElement`를 사용하면 다른 엘리먼트를 시작점으로 사용하여 새로운 React 엘리먼트를 생성할 수 있습니다.</Trans>

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

Call `cloneElement` to create a React element based on the `element`, but with different `props` and `children`:
<Trans>`cloneElement`를 호출하면 `element`를 기반으로 별도의 `props` 및 `children`를 갖는 React 엘리먼트를 생성합니다:</Trans>

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage">Goodbye</Row>
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `element`: The `element` argument must be a valid React element. For example, it could be a JSX node like `<Something />`, the result of calling [`createElement`](/reference/react/createElement), or the result of another `cloneElement` call.
<Trans>`element`: `element` 인수는 유효한 React 엘리먼트여야 합니다. 예를 들어 `<Something />`과 같은 JSX 노드, [`createElement`](/reference/react/createElement)를 호출한 결과, 또는 다른 `cloneElement` 호출의 결과일 수 있습니다.</Trans>

* `props`: The `props` argument must either be an object or `null`. If you pass `null`, the cloned element will retain all of the original `element.props`. Otherwise, for every prop in the `props` object, the returned element will "prefer" the value from `props` over the value from `element.props`. The rest of the props will be filled from the original `element.props`. If you pass `props.key` or `props.ref`, they will replace the original ones.
<Trans>`props`: props 인수는 객체이거나 `null`이어야 합니다. `null`을 전달하면 복제된 엘리먼트는 원본 `element.props`를 모두 유지합니다. 반대로 `null`이 아닐 경우에는, 반환된 엘리먼트는 `props`객체의 모든 prop에 대해 `element.props`의 값보다 `props`의 값을 "우선"합니다. 나머지 prop들은 원본 `element.props`에서 채워집니다. `props.key` 또는 `props.ref`를 전달하면 원래 값을 대체합니다.</Trans>

* **optional** `...children`: Zero or more child nodes. They can be any React nodes, including React elements, strings, numbers, [portals](/reference/react-dom/createPortal), empty nodes (`null`, `undefined`, `true`, and `false`), and arrays of React nodes. If you don't pass any `...children` arguments, the original `element.props.children` will be preserved.
<Trans>**선택적** `...children` : 0개 이상의 자식 노드. 자식 노드는 React 엘리먼트, 문자열, 숫자, [portals](/reference/react-dom/createPortal), 빈 노드(`null`, `undefined`, `true`, `false`), React 노드의 배열을 포함한 모든 React 노드가 될 수 있습니다. `...children` 인수를 전달하지 않으면 원래의 `element.props.children`이 보존됩니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`cloneElement` returns a React element object with a few properties:
<Trans>`cloneElement`는 몇 가지 속성을 가진 React 엘리먼트 객체를 반환합니다:</Trans>

* `type`: Same as `element.type`.
* `props`: The result of shallowly merging `element.props` with the overriding `props` you have passed.
* `ref`: The original `element.ref`, unless it was overridden by `props.ref`.
* `key`: The original `element.key`, unless it was overridden by `props.key`.

<TransBlock>
* `type`: `element.type`과 동일합니다.
* `props`: 재정의되어 전달된 `props`와 `element.props`를 얕게 병합한 결과입니다.
* `ref`: `props.ref`로 재정의되지 않은 경우 원본 `element.ref`
* `key`: `props.key`로 재정의되지 않은 경우 원본 `element.key`

</TransBlock>

Usually, you'll return the element from your component or make it a child of another element. Although you may read the element's properties, it's best to treat every element as opaque after it's created, and only render it.
<Trans>일반적으로 컴포넌트에서 엘리먼트를 반환하거나 다른 엘리먼트의 자식으로 만듭니다. 엘리먼트의 프로퍼티를 읽을 수는 있지만, 생성된 후에는 모든 엘리먼트를 불투명하게 처리하고 렌더링만 하는 것이 가장 좋습니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* Cloning an element **does not modify the original element.**
<Trans>엘리먼트를 복제해도 **원본 엘리먼트는 수정되지 않습니다.**</Trans>

* You should only **pass children as multiple arguments to `cloneElement` if they are all statically known,** like `cloneElement(element, null, child1, child2, child3)`. If your children are dynamic, pass the entire array as the third argument: `cloneElement(element, null, listItems)`. This ensures that React will [warn you about missing `key`s](/learn/rendering-lists#keeping-list-items-in-order-with-key) for any dynamic lists. For static lists this is not necessary because they never reorder.
<Trans>자식은 `cloneElement(element, null, child1, child2, child3)`와 같이 **모두 정적으로 알려진 경우에 한해서만 여러 개의 인수로 `cloneElement`에 전달**해야 합니다. 자식들이 동적인 경우, 다음과 같이 세 번째 인자로 전체 배열을 전달하세요: `cloneElement(element, null, listItems)`. 이렇게 하면 React는 동적 리스트를 상정하여 [누락된 `key`에 대해 경고](/learn/rendering-lists#keeping-list-items-in-order-with-key)합니다. 정적 리스트의 경우 순서가 바뀌지 않으므로 `key`는 필요하지 않습니다.</Trans>

* `cloneElement` makes it harder to trace the data flow, so **try the [alternatives](#alternatives) instead.**
<Trans>`cloneElement`를 사용하면 데이터 흐름을 추적하기가 더 어려워지므로 대신 **[다른 방법](#alternatives)을 사용해 보세요.**</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Overriding props of an element<Trans>엘리먼트의 props 재정의</Trans> {/*overriding-props-of-an-element*/}

To override the props of some <CodeStep step={1}>React element</CodeStep>, pass it to `cloneElement` with the <CodeStep step={2}>props you want to override</CodeStep>:
<Trans>일부 <CodeStep step={1}>React 엘리먼트</CodeStep>의 props를 재정의하려면, <CodeStep step={2}>재정의하려는 props와 함께</CodeStep> `cloneElement`에 <CodeStep step={2}>전달</CodeStep>하세요:</Trans>

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

Here, the resulting <CodeStep step={3}>cloned element</CodeStep> will be `<Row title="Cabbage" isHighlighted={true} />`.
<Trans>여기서 <CodeStep step={3}>복제된 엘리먼트</CodeStep>의 결과는 `<Row title="Cabbage" isHighlighted={true} />`입니다.</Trans>

**Let's walk through an example to see when it's useful.**
<Trans>**언제 이것이 유용한지 예제를 통해 살펴보겠습니다.**</Trans>

Imagine a `List` component that renders its [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children) as a list of selectable rows with a "Next" button that changes which row is selected. The `List` component needs to render the selected `Row` differently, so it clones every `<Row>` child that it has received, and adds an extra `isHighlighted: true` or `isHighlighted: false` prop:
<Trans>선택된 행을 변경하는 "Next" 버튼이 있는 행의 목록을 자식으로 렌더링하는 `List` 컴포넌트를 상상해 보세요. `List` 컴포넌트는 선택된 `Row`를 다르게 렌더링해야 하므로 전달된 모든 `<Row>` 의 자식을 복제하고 `isHighlighted: true` 또는 `isHighlighted: false` prop을 추가합니다:</Trans>

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
```

Let's say the original JSX received by `List` looks like this:
<Trans>`List`가 전달받은 원본 JSX가 다음과 같다고 가정해 보겠습니다:</Trans>

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

By cloning its children, the `List` can pass extra information to every `Row` inside. The result looks like this:
<Trans>`List`는 자식을 복제하여 내부의 모든 `Row`에 추가 정보를 전달할 수 있습니다. 결과는 다음과 같습니다:</Trans>

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

Notice how pressing "Next" updates the state of the `List`, and highlights a different row:
<Trans>"다음"을 누르면 `List`의 state가 업데이트되고 다른 행이 강조 표시되는 것을 확인할 수 있습니다:</Trans>

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title} 
        />
      )}
    </List>
  );
}
```

```js List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

To summarize, the `List` cloned the `<Row />` elements it received and added an extra prop to them.
<Trans>요약하자면, `List`는 수신한 `<Row />` 엘리먼트를 복제하고 여기에 별도의 prop을 추가했습니다.</Trans>

<Pitfall>

Cloning children makes it hard to tell how the data flows through your app. Try one of the [alternatives.](#alternatives)
<Trans>자식을 복제하면 앱에서 데이터가 어떻게 흘러가는지 알기 어렵습니다. [대안](#alternatives) 중 하나를 사용해 보세요.</Trans>

</Pitfall>

---

## Alternatives<Trans>대안</Trans> {/*alternatives*/}

### Passing data with a render prop<Trans>렌더링 props로 데이터 전달하기</Trans> {/*passing-data-with-a-render-prop*/}

Instead of using `cloneElement`, consider accepting a *render prop* like `renderItem`. Here, `List` receives `renderItem` as a prop. `List` calls `renderItem` for every item and passes `isHighlighted` as an argument: 
<Trans>`cloneElement`를 사용하는 대신 `renderItem`과 같은 *렌더링 prop*를 받아들이는 것을 고려해 보세요. 여기서 `List`는 렌더링 prop로 `renderItem`을 받습니다. `List`는 모든 항목에 대해 `renderItem`을 호출하고 `isHighlighted`를 인수로 전달합니다:</Trans>

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

The `renderItem` prop is called a "render prop" because it's a prop that specifies how to render something. For example, you can pass a `renderItem` implementation that renders a `<Row>` with the given `isHighlighted` value:
<Trans>`renderItem` prop은 렌더링 방법을 지정하는 prop이기 때문에 "render prop"라고 부릅니다. 예를 들어, 주어진 `isHighlighted` 값으로 `<Row>`를 렌더링하는 `renderItem` 구현을 전달할 수 있습니다:</Trans>

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

The end result is the same as with `cloneElement`:
<Trans>최종 결과는 `cloneElement`와 동일합니다:</Trans>

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

However, you can clearly trace where the `isHighlighted` value is coming from.
<Trans>하지만, `cloneElement`와 달리 `isHighlighted` 값의 출처를 명확하게 추적할 수 있습니다.</Trans>

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

This pattern is preferred to `cloneElement` because it is more explicit.
<Trans>이 패턴은 더 명시적이므로 `cloneElement`보다 선호됩니다.</Trans>

---

### Passing data through context<Trans>Context를 통해 데이터 전달하기</Trans> {/*passing-data-through-context*/}

Another alternative to `cloneElement` is to [pass data through context.](/learn/passing-data-deeply-with-context)
<Trans>`cloneElement`의 또 다른 대안은 [context를 통해 데이터를 전달하는 것입니다.](/learn/passing-data-deeply-with-context)</Trans>

For example, you can call [`createContext`](/reference/react/createContext) to define a `HighlightContext`:
<Trans>예를 들어, [`createContext`](/reference/react/createContext)를 호출하여 `HighlightContext`를 정의할 수 있습니다:</Trans>

```js
export const HighlightContext = createContext(false);
```

Your `List` component can wrap every item it renders into a `HighlightContext` provider:
<Trans>`List` 컴포넌트는 렌더링하는 모든 항목을 `HighlightContext` provider로 감쌀 수 있습니다:</Trans>

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
```

With this approach, `Row` does not need to receive an `isHighlighted` prop at all. Instead, it reads the context:
<Trans>이 방법을 사용하면 `Row`는 `isHighlighted` prop를 전혀 전달받을 필요가 없습니다. 대신 context를 읽습니다:</Trans>

```js Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

This allows the calling component to not know or worry about passing `isHighlighted` to `<Row>`:
<Trans>이렇게 하면 호출 컴포넌트가 `<Row>`에 `isHighlighted`를 전달하는 것에 대해 알 필요도 없고, 걱정하지 않아도 됩니다:</Trans>

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

Instead, `List` and `Row` coordinate the highlighting logic through context.
<Trans>대신 `List`와 `Row`는 context를 통해 강조 표시 로직을 조정합니다.</Trans>

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[Learn more about passing data through context.](/reference/react/useContext#passing-data-deeply-into-the-tree)
<Trans>[context를 통한 데이터 전달에 대해 자세히 알아보세요.](/reference/react/useContext#passing-data-deeply-into-the-tree)</Trans>

---

### Extracting logic into a custom Hook<Trans>로직을 커스텀 훅으로 추출하기</Trans> {/*extracting-logic-into-a-custom-hook*/}

Another approach you can try is to extract the "non-visual" logic into your own Hook, and use the information returned by your Hook to decide what to render. For example, you could write a `useList` custom Hook like this:
<Trans>시도해 볼 수 있는 또 다른 접근 방식은 "비시각적" 로직을 자신만의 Hook으로 추출하고, Hook에서 반환된 정보를 사용하여 렌더링할 내용을 결정하는 것입니다. 예를 들어, 다음과 같이 커스텀 훅 `useList`를 작성할 수 있습니다:</Trans>

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

Then you could use it like this:
<Trans>그러면 다음과 같이 사용할 수 있습니다:</Trans>

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

The data flow is explicit, but the state is inside the `useList` custom Hook that you can use from any component:
<Trans>데이터 흐름은 명시적이지만 state는 모든 컴포넌트에서 사용할 수 있는 커스텀 훅 `useList` 안에 있습니다:</Trans>

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

This approach is particularly useful if you want to reuse this logic between different components.
<Trans>이 접근 방식은 다른 컴포넌트 간에 이 로직을 재사용하려는 경우에 특히 유용합니다.</Trans>