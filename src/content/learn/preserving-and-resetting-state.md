---
title: Preserving and Resetting State
translatedTitle: state 보존 및 재설정
---

<Intro>

State is isolated between components. React keeps track of which state belongs to which component based on their place in the UI tree. You can control when to preserve state and when to reset it between re-renders.

<Trans>state는 컴포넌트 간에 격리됩니다. React는 UI 트리에서 어떤 컴포넌트가 어떤 state에 속하는지를 추적합니다. state를 언제 보존하고 언제 초기화할지를 제어할 수 있습니다.</Trans>

</Intro>

<YouWillLearn>

* How React "sees" component structures
* When React chooses to preserve or reset the state
* How to force React to reset component's state
* How keys and types affect whether the state is preserved

<TransBlock>
- React가 컴포넌트 구조를 "보는" 방법
- React가 state를 유지하거나 재설정하도록 선택할 때
- React가 컴포넌트의 state를 재설정하도록 강제하는 방법
- key와 type이 state 보존 여부에 영향을 미치는 방법
</TransBlock>

</YouWillLearn>

## The UI tree<br/><Trans>UI 트리</Trans> {/*the-ui-tree*/}

Browsers use many tree structures to model UI. The [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) represents HTML elements, the [CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model) does the same for CSS. There's even an [Accessibility tree](https://developer.mozilla.org/docs/Glossary/Accessibility_tree)!
<Trans>브라우저는 UI를 모델링하기 위해 많은 트리 구조를 사용합니다. [DOM](https://developer.mozilla.org/ko/docs/Web/API/Document_Object_Model/Introduction)은 HTML 요소를 나타내고, [CSSOM](https://developer.mozilla.org/ko/docs/Web/API/CSS_Object_Model)은 CSS에 대해 동일한 역할을 합니다. 심지어 [접근성 트리](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree)도 있습니다!</Trans>

React also uses tree structures to manage and model the UI you make. React makes **UI trees** from your JSX. Then React DOM updates the browser DOM elements to match that UI tree. (React Native translates these trees into elements specific to mobile platforms.)
<Trans>React 또한 트리 구조를 사용하여 사용자가 만든 UI를 관리하고 모델링합니다. React는 JSX로부터 UI 트리를 만듭니다. 그런 다음 React DOM은 해당 UI 트리와 일치하도록 브라우저 DOM 엘리먼트를 업데이트합니다. (React Native는 이러한 트리를 모바일 플랫폼에 맞는 엘리먼트로 변환합니다.)</Trans>

<DiagramGroup>

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Diagram with three sections arranged horizontally. In the first section, there are three rectangles stacked vertically, with labels 'Component A', 'Component B', and 'Component C'. Transitioning to the next pane is an arrow with the React logo on top labeled 'React'. The middle section contains a tree of components, with the root labeled 'A' and two children labeled 'B' and 'C'. The next section is again transitioned using an arrow with the React logo on top labeled 'React'. The third and final section is a wireframe of a browser, containing a tree of 8 nodes, which has only a subset highlighted (indicating the subtree from the middle section).">

From components, React creates a UI tree which React DOM uses to render the DOM
<Trans>컴포넌트에서 React는 UI 트리를 생성하고, 이 트리는 React DOM이 DOM을 렌더링하는 데 사용됩니다.</Trans>
</Diagram>

</DiagramGroup>

## State is tied to a position in the tree<br/><Trans>state는 트리의 한 위치에 묶입니다</Trans> {/*state-is-tied-to-a-position-in-the-tree*/}

When you give a component state, you might think the state "lives" inside the component. But the state is actually held inside React. React associates each piece of state it's holding with the correct component by where that component sits in the UI tree.
<Trans>컴포넌트에 state를 부여할 때, state가 컴포넌트 내부에 "존재"한다고 생각할 수 있습니다. 하지만 state는 실제로 React 내부에서 유지됩니다. React는 UI 트리에서 해당 컴포넌트가 어디에 위치하는지에 따라 보유하고 있는 각 state를 올바른 컴포넌트와 연결합니다.</Trans>


Here, there is only one `<Counter />` JSX tag, but it's rendered at two different positions:
<Trans>여기에는 `<Counter />` JSX 태그가 하나만 있지만 두 개의 다른 위치에서 렌더링됩니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const counter = <Counter />;
  return (
    <div>
      {counter}
      {counter}
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Here's how these look as a tree:
<Trans>트리로 표시되는 모습은 다음과 같습니다:</Trans>

<DiagramGroup>

<Diagram name="preserving_state_tree" height={248} width={395} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. Each of the children are labeled 'Counter' and both contain a state bubble labeled 'count' with value 0.">

React tree
</Diagram>

</DiagramGroup>

**These are two separate counters because each is rendered at its own position in the tree.** You don't usually have to think about these positions to use React, but it can be useful to understand how it works.
<Trans>**이 카운터는 각 트리에서 고유한 위치에 렌더링되기 때문에 두 개의 개별 카운터입니다.** 일반적으로 React를 사용하기 위해 이러한 위치에 대해 생각할 필요는 없지만, 작동 방식을 이해하는 것이 유용할 수 있습니다.</Trans>

In React, each component on the screen has fully isolated state. For example, if you render two `Counter` components side by side, each of them will get its own, independent, `score` and `hover` states.
<Trans>React에서 화면의 각 컴포넌트는 완전히 분리된 상태를 갖습니다. 예를 들어 두 개의 `Counter` 컴포넌트를 나란히 렌더링하면 각각 독립적인 `score` 및 `hover` 상태를 갖게 됩니다.</Trans>

Try clicking both counters and notice they don't affect each other:
<Trans>두 counter를 모두 클릭해 보면 서로 영향을 미치지 않는 것을 확인할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  return (
    <div>
      <Counter />
      <Counter />
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

As you can see, when one counter is updated, only the state for that component is updated:
<Trans>보시다시피 counter 하나가 업데이트되면 해당 컴포넌트에 대한 상태만 업데이트됩니다:</Trans>

<DiagramGroup>

<Diagram name="preserving_state_increment" height={248} width={441} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 1. The state bubble of the right child is highlighted in yellow to indicate its value has updated.">

Updating state

</Diagram>

</DiagramGroup>


React will keep the state around for as long as you render the same component at the same position. To see this, increment both counters, then remove the second component by unchecking "Render the second counter" checkbox, and then add it back by ticking it again:
<Trans>React는 같은 컴포넌트를 같은 위치에 렌더링하는 한 그 state를 유지합니다. 이를 확인하려면 두 카운터를 모두 증가시킨 다음 "두 번째 counter 렌더링" 체크박스를 선택 해제하여 두 번째 컴포넌트를 제거한 다음 다시 선택하여 다시 추가합니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [showB, setShowB] = useState(true);
  return (
    <div>
      <Counter />
      {showB && <Counter />} 
      <label>
        <input
          type="checkbox"
          checked={showB}
          onChange={e => {
            setShowB(e.target.checked)
          }}
        />
        Render the second counter
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Notice how the moment you stop rendering the second counter, its state disappears completely. That's because when React removes a component, it destroys its state.
<Trans>두 번째 counter 렌더링을 중지하는 순간 state가 완전히 사라지는 것에 주목하세요. React가 컴포넌트를 제거하면 그 state가 사라지기 때문입니다.</Trans>

<DiagramGroup>

<Diagram name="preserving_state_remove_component" height={253} width={422} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is missing, and in its place is a yellow 'poof' image, highlighting the component being deleted from the tree.">

Deleting a component

</Diagram>

</DiagramGroup>

When you tick "Render the second counter", a second `Counter` and its state are initialized from scratch (`score = 0`) and added to the DOM.
<Trans>"두 번째 counter 렌더링"을 선택하면 두 번째 `Counter`와 그 state가 처음부터 초기화되고(`score = 0`) DOM에 추가됩니다.</Trans>

<DiagramGroup>

<Diagram name="preserving_state_add_component" height={258} width={500} alt="Diagram of a tree of React components. The root node is labeled 'div' and has two children. The left child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The entire right child node is highlighted in yellow, indicating that it was just added to the tree.">

Adding a component

</Diagram>

</DiagramGroup>

**React preserves a component's state for as long as it's being rendered at its position in the UI tree.** If it gets removed, or a different component gets rendered at the same position, React discards its state.
<Trans>React는 컴포넌트가 UI 트리의 해당 위치에서 렌더링되는 동안 컴포넌트의 state를 유지합니다. 컴포넌트가 제거되거나 같은 위치에 다른 컴포넌트가 렌더링되면 React는 해당 컴포넌트의 state를 삭제합니다.</Trans>

## Same component at the same position preserves state<br/><Trans>동일한 위치의 동일한 컴포넌트는 state를 유지합니다</Trans> {/*same-component-at-the-same-position-preserves-state*/}

In this example, there are two different `<Counter />` tags:
<Trans>다음 예제에는 두 개의 서로 다른 `<Counter />` 태그가 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <Counter isFancy={true} /> 
      ) : (
        <Counter isFancy={false} /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

When you tick or clear the checkbox, the counter state does not get reset. Whether `isFancy` is `true` or `false`, you always have a `<Counter />` as the first child of the `div` returned from the root `App` component:
<Trans>체크박스를 선택하거나 선택 취소해도 카운터 state는 재설정되지 않습니다. `isFancy`가 `true`이든 `false`이든, 루트 `App` 컴포넌트에서 반환된 `div`의 첫 번째 자식에는 항상 `<Counter />`가 있습니다:</Trans>

<DiagramGroup>

<Diagram name="preserving_state_same_component" height={461} width={600} alt="Diagram with two sections separated by an arrow transitioning between them. Each section contains a layout of components with a parent labeled 'App' containing a state bubble labeled isFancy. This component has one child labeled 'div', which leads to a prop bubble containing isFancy (highlighted in purple) passed down to the only child. The last child is labeled 'Counter' and contains a state bubble with label 'count' and value 3 in both diagrams. In the left section of the diagram, nothing is highlighted and the isFancy parent state value is false. In the right section of the diagram, the isFancy parent state value has changed to true and it is highlighted in yellow, and so is the props bubble below, which has also changed its isFancy value to true.">

Updating the `App` state does not reset the `Counter` because `Counter` stays in the same position
<Trans>`Counter`가 동일 위치에 있으므로 `App`의 state를 업데이트해도 `Counter`는 재설정되지 않음</Trans>

</Diagram>

</DiagramGroup>

It's the same component at the same position, so from React's perspective, it's the same counter.
<Trans>같은 위치에 있는 같은 컴포넌트이므로 React의 관점에서 보면 같은 카운터입니다.</Trans>

<Pitfall>

Remember that **it's the position in the UI tree--not in the JSX markup--that matters to React!** This component has two `return` clauses with different `<Counter />` JSX tags inside and outside the `if`:
<Trans>**React에서 중요한 것은 JSX 마크업이 아니라 UI 트리에서의 위치라는 것을 기억하세요!** 이 컴포넌트에는 `if` 내부와 외부에 서로 다른 `<Counter />` JSX 태그가 있는 두 개의 `return`절이 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  if (isFancy) {
    return (
      <div>
        <Counter isFancy={true} />
        <label>
          <input
            type="checkbox"
            checked={isFancy}
            onChange={e => {
              setIsFancy(e.target.checked)
            }}
          />
          Use fancy styling
        </label>
      </div>
    );
  }
  return (
    <div>
      <Counter isFancy={false} />
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

You might expect the state to reset when you tick checkbox, but it doesn't! This is because **both of these `<Counter />` tags are rendered at the same position.** React doesn't know where you place the conditions in your function. All it "sees" is the tree you return.
<Trans>checkbox를 선택하면 state가 재설정될 것으로 예상할 수 있지만 그렇지 않습니다! 이 **두 `<Counter />` 태그가 모두 같은 위치에 렌더링되기 때문입니다.** React는 함수에서 조건을 어디에 배치했는지 알지 못합니다. 단지 여러분이 반환하는 트리만 볼 수 있을 뿐입니다. 두 경우 모두 `App` 컴포넌트는 `<Counter />`를 첫 번째 자식으로 가진 `<div>`를 반환합니다. 이것이 React가 이들을 동일한 `<Counter />`로 간주하는 이유입니다.</Trans>

In both cases, the `App` component returns a `<div>` with `<Counter />` as a first child. To React, these two counters have the same "address": the first child of the first child of the root. This is how React matches them up between the previous and next renders, regardless of how you structure your logic.
<Trans>루트의 첫 번째 자식의 첫 번째 자식이라는 동일한 "주소"를 가진 것으로 생각할 수 있습니다. 이것이 로직을 어떻게 구성하든 상관없이 이전 렌더링과 다음 렌더링 사이에서 React가 이들을 일치시키는 방식입니다.</Trans>

</Pitfall>

## Different components at the same position reset state<br/><Trans>동일한 위치의 다른 컴포넌트는 state를 초기화합니다</Trans> {/*different-components-at-the-same-position-reset-state*/}

In this example, ticking the checkbox will replace `<Counter>` with a `<p>`:
<Trans>아래 예제에서 확인란을 선택하면 `<Counter/>`가 `<p>`로 바뀝니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isPaused, setIsPaused] = useState(false);
  return (
    <div>
      {isPaused ? (
        <p>See you later!</p> 
      ) : (
        <Counter /> 
      )}
      <label>
        <input
          type="checkbox"
          checked={isPaused}
          onChange={e => {
            setIsPaused(e.target.checked)
          }}
        />
        Take a break
      </label>
    </div>
  );
}

function Counter() {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Here, you switch between _different_ component types at the same position. Initially, the first child of the `<div>` contained a `Counter`. But when you swapped in a `p`, React removed the `Counter` from the UI tree and destroyed its state.
<Trans>여기서는 같은 위치에서 서로 다른 컴포넌트 유형 사이를 전환합니다. 처음에 `<div>`의 첫 번째 자식에는 `Counter`가 있었습니다. 하지만 `p`를 넣었을 때 React는 UI 트리에서 `Counter`를 제거하고 그 상태를 소멸시켰습니다.</Trans>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt1" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'p', highlighted in yellow.">

When `Counter` changes to `p`, the `Counter` is deleted and the `p` is added
<Trans>`Counter`가 `p`로 변경되면 `Counter`가 삭제되고 `p`가 추가됨</Trans>
</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_pt2" height={290} width={753} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'p'. The middle section has the same 'div' parent, but the child component has now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, highlighted in yellow.">

When switching back, the `p` is deleted and the `Counter` is added
<Trans>다시 전환하면 `p`가 삭제되고 `Counter`가 추가됨</Trans>
</Diagram>

</DiagramGroup>

Also, **when you render a different component in the same position, it resets the state of its entire subtree.** To see how this works, increment the counter and then tick the checkbox:
<Trans>또한 **같은 위치에 다른 컴포넌트를 렌더링하면 전체 하위 트리의 state가 재설정됩니다.** 어떻게 작동하는지 확인하려면 카운터를 증가시킨 다음 확인란을 선택합니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function App() {
  const [isFancy, setIsFancy] = useState(false);
  return (
    <div>
      {isFancy ? (
        <div>
          <Counter isFancy={true} /> 
        </div>
      ) : (
        <section>
          <Counter isFancy={false} />
        </section>
      )}
      <label>
        <input
          type="checkbox"
          checked={isFancy}
          onChange={e => {
            setIsFancy(e.target.checked)
          }}
        />
        Use fancy styling
      </label>
    </div>
  );
}

function Counter({ isFancy }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }
  if (isFancy) {
    className += ' fancy';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
label {
  display: block;
  clear: both;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
  float: left;
}

.fancy {
  border: 5px solid gold;
  color: #ff6767;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

The counter state gets reset when you click the checkbox. Although you render a `Counter`, the first child of the `div` changes from a `div` to a `section`. When the child `div` was removed from the DOM, the whole tree below it (including the `Counter` and its state) was destroyed as well.
<Trans>확인란을 클릭하면 counter state가 재설정됩니다. `Counter`를 렌더링하더라도 `div`의 첫 번째 자식은 `div`에서 `section`으로 변경됩니다. 자식 `div`가 DOM에서 제거되면 그 아래의 전체 트리(카운터 및 해당 상태 포함)도 함께 제거됩니다.</Trans>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt1" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'section', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 3. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'div', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

When `section` changes to `div`, the `section` is deleted and the new `div` is added
<Trans>`section`이 `div`로 변경되면 `section`이 삭제되고 새 `div`가 추가됨</Trans>
</Diagram>

</DiagramGroup>

<DiagramGroup>

<Diagram name="preserving_state_diff_same_pt2" height={350} width={794} alt="Diagram with three sections, with an arrow transitioning each section in between. The first section contains a React component labeled 'div' with a single child labeled 'div', which has a single child labeled 'Counter' containing a state bubble labeled 'count' with value 0. The middle section has the same 'div' parent, but the child components have now been deleted, indicated by a yellow 'proof' image. The third section has the same 'div' parent again, now with a new child labeled 'section', highlighted in yellow, also with a new child labeled 'Counter' containing a state bubble labeled 'count' with value 0, all highlighted in yellow.">

When switching back, the `div` is deleted and the new `section` is added
<Trans>다시 전환하면 `div`가 삭제되고 새 `section`이 추가됨</Trans>
</Diagram>

</DiagramGroup>

As a rule of thumb, **if you want to preserve the state between re-renders, the structure of your tree needs to "match up"** from one render to another. If the structure is different, the state gets destroyed because React destroys state when it removes a component from the tree.
<Trans>경험칙상 **재랜더링 사이에 state를 유지하려면 트리의 구조가 "일치"해야 합니다**. 구조가 다르면 React는 트리에서 컴포넌트를 제거할 때 state를 파괴하기 때문입니다.</Trans>

<Pitfall>

This is why you should not nest component function definitions.
<Trans>그렇기 때문에 컴포넌트 함수 정의를 중첩해서는 안 됩니다.</Trans>

Here, the `MyTextField` component function is defined *inside* `MyComponent`:
<Trans>여기서는 `MyTextField` 컴포넌트 함수가 `MyComponent` 안에 정의되어 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>Clicked {counter} times</button>
    </>
  );
}
```

</Sandpack>


Every time you click the button, the input state disappears! This is because a *different* `MyTextField` function is created for every render of `MyComponent`. You're rendering a *different* component in the same position, so React resets all state below. This leads to bugs and performance problems. To avoid this problem, **always declare component functions at the top level, and don't nest their definitions.**

<Trans>버튼을 클릭할 때마다 입력 state가 사라집니다! 이는 `MyComponent`를 렌더링할 때마다 다른 `MyTextField` 함수가 생성되기 때문입니다. 같은 위치에 다른 컴포넌트를 렌더링하기 때문에 React는 아래의 모든 state를 초기화합니다. 이로 인해 버그와 성능 문제가 발생합니다. 이 **문제를 방지하려면 항상 컴포넌트 함수를 최상위 수준에서 선언하고 정의를 중첩하지 마세요.**</Trans>

</Pitfall>

## Resetting state at the same position<br/><Trans>동일한 위치에서 state 재설정하기</Trans> {/*resetting-state-at-the-same-position*/}

By default, React preserves state of a component while it stays at the same position. Usually, this is exactly what you want, so it makes sense as the default behavior. But sometimes, you may want to reset a component's state. Consider this app that lets two players keep track of their scores during each turn:
<Trans>기본적으로 React는 컴포넌트가 같은 위치에 있는 동안 컴포넌트의 state를 보존합니다. 일반적으로 이것은 사용자가 원하는 것이므로 기본 동작으로 적합합니다. 하지만 때로는 컴포넌트의 state를 리셋하고 싶을 때가 있습니다. 두 명의 플레이어가 각 턴 동안 점수를 추적할 수 있는 이 앱을 예로 들어보겠습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter person="Taylor" />
      ) : (
        <Counter person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Currently, when you change the player, the score is preserved. The two `Counter`s appear in the same position, so React sees them as *the same* `Counter` whose `person` prop has changed.
<Trans>현재 플레이어를 변경하면 점수가 보존됩니다. 두 `Counter`는 같은 위치에 표시되므로 React는 `person` prop이 변경된 동일한 `Counter`로 간주합니다.</Trans>

But conceptually, in this app they should be two separate counters. They might appear in the same place in the UI, but one is a counter for Taylor, and another is a counter for Sarah.
<Trans>하지만 개념적으로 이 앱에서는 두 개의 별도 카운터가 있어야 합니다. UI에서 같은 위치에 표시될 수도 있지만 하나는 Taylor의 카운터이고 다른 하나는 Sarah의 카운터입니다.</Trans>

There are two ways to reset state when switching between them:
<Trans>전환할 때 상태를 재설정하는 방법에는 두 가지가 있습니다:</Trans>

1. Render components in different positions
2. Give each component an explicit identity with `key`

<TransBlock>
  1. 컴포넌트를 다른 위치에 렌더링하기
  2. 각 컴포넌트에 `key`로 명시적인 아이덴티티를 부여합니다.
</TransBlock>

### Option 1: Rendering a component in different positions<br/><Trans>컴포넌트를 다른 위치에 렌더링하기</Trans> {/*option-1-rendering-a-component-in-different-positions*/}

If you want these two `Counter`s to be independent, you can render them in two different positions:
<Trans>이 두 `Counter`를 독립적으로 만들려면 두 개의 다른 위치에 렌더링하면 됩니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA &&
        <Counter person="Taylor" />
      }
      {!isPlayerA &&
        <Counter person="Sarah" />
      }
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

* Initially, `isPlayerA` is `true`. So the first position contains `Counter` state, and the second one is empty.
* When you click the "Next player" button the first position clears but the second one now contains a `Counter`.

<TransBlock>
- 처음에는 `isPlayerA`가 `true`입니다. 따라서 첫 번째 위치에는 `Counter` 상태가 포함되고 두 번째 위치는 비어 있습니다.
- "Next player" 버튼을 클릭하면 첫 번째 위치는 지워지지만 두 번째 위치에는 이제 `Counter`가 포함됩니다.
</TransBlock>

<DiagramGroup>

<Diagram name="preserving_state_diff_position_p1" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The only child, arranged to the left, is labeled Counter with a state bubble labeled 'count' and value 0. All of the left child is highlighted in yellow, indicating it was added.">

Initial state

</Diagram>

<Diagram name="preserving_state_diff_position_p2" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'false'. The state bubble is highlighted in yellow, indicating that it has changed. The left child is replaced with a yellow 'poof' image indicating that it has been deleted and there is a new child on the right, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0.">

Clicking "next"

</Diagram>

<Diagram name="preserving_state_diff_position_p3" height={375} width={504} alt="Diagram with a tree of React components. The parent is labeled 'Scoreboard' with a state bubble labeled isPlayerA with value 'true'. The state bubble is highlighted in yellow, indicating that it has changed. There is a new child on the left, highlighted in yellow indicating that it was added. The new child is labeled 'Counter' and contains a state bubble labeled 'count' with value 0. The right child is replaced with a yellow 'poof' image indicating that it has been deleted.">

Clicking "next" again

</Diagram>

</DiagramGroup>

Each `Counter`'s state gets destroyed each time its removed from the DOM. This is why they reset every time you click the button.
<Trans>각 `Counter`의 state는 DOM에서 제거될 때마다 소멸됩니다. 그렇기 때문에 버튼을 클릭할 때마다 초기화됩니다.</Trans>

This solution is convenient when you only have a few independent components rendered in the same place. In this example, you only have two, so it's not a hassle to render both separately in the JSX.
<Trans>이 솔루션은 같은 위치에 몇 개의 독립적인 컴포넌트만 렌더링할 때 편리합니다. 이 예시에서는 두 개만 있으므로 JSX에서 두 컴포넌트를 별도로 렌더링하는 것이 번거롭지 않습니다.</Trans>

### Option 2: Resetting state with a key<br/><Trans>key로 state 재설정하기</Trans> {/*option-2-resetting-state-with-a-key*/}

There is also another, more generic, way to reset a component's state.
<Trans>컴포넌트의 state를 재설정하는 더 일반적인 방법도 있습니다.</Trans>

You might have seen `key`s when [rendering lists.](/learn/rendering-lists#keeping-list-items-in-order-with-key) Keys aren't just for lists! You can use keys to make React distinguish between any components. By default, React uses order within the parent ("first counter", "second counter") to discern between components. But keys let you tell React that this is not just a *first* counter, or a *second* counter, but a specific counter--for example, *Taylor's* counter. This way, React will know *Taylor's* counter wherever it appears in the tree!
<Trans>[목록을 렌더링](https://www.notion.so/1-7-Rendering-Lists-25246ef00d14407fb113ea66961946b3)할 때 `key`를 본 적이 있을 것입니다. key는 목록에만 사용되는 것이 아닙니다! key를 사용해 React가 모든 컴포넌트를 구분하도록 할 수 있습니다. 기본적으로 React는 부모 내의 순서("첫 번째 counter", "두 번째 counter")를 사용해 컴포넌트를 구분합니다. 하지만 key를 사용하면 이것이 첫 번째 counter나 두 번째 counter가 아니라 특정 counter(예: Taylor의 counter)임을 React에 알릴 수 있습니다. 이렇게 하면 React는 테일러의 counter가 트리에 어디에 나타나든 알 수 있습니다!</Trans>

In this example, the two `<Counter />`s don't share state even though they appear in the same place in JSX:
<Trans>다음 예제에서는 두 `<Counter />`가 JSX에서 같은 위치에 표시되지만 state를 공유하지 않습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [isPlayerA, setIsPlayerA] = useState(true);
  return (
    <div>
      {isPlayerA ? (
        <Counter key="Taylor" person="Taylor" />
      ) : (
        <Counter key="Sarah" person="Sarah" />
      )}
      <button onClick={() => {
        setIsPlayerA(!isPlayerA);
      }}>
        Next player!
      </button>
    </div>
  );
}

function Counter({ person }) {
  const [score, setScore] = useState(0);
  const [hover, setHover] = useState(false);

  let className = 'counter';
  if (hover) {
    className += ' hover';
  }

  return (
    <div
      className={className}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      <h1>{person}'s score: {score}</h1>
      <button onClick={() => setScore(score + 1)}>
        Add one
      </button>
    </div>
  );
}
```

```css
h1 {
  font-size: 18px;
}

.counter {
  width: 100px;
  text-align: center;
  border: 1px solid gray;
  border-radius: 4px;
  padding: 20px;
  margin: 0 20px 20px 0;
}

.hover {
  background: #ffffd8;
}
```

</Sandpack>

Switching between Taylor and Sarah does not preserve the state. This is because **you gave them different `key`s:**
<Trans>테일러와 사라 사이를 전환해도 state가 유지되지 않습니다. **서로 다른 `key`를 부여했기 때문입니다:**</Trans>

```js
{isPlayerA ? (
  <Counter key="Taylor" person="Taylor" />
) : (
  <Counter key="Sarah" person="Sarah" />
)}
```

Specifying a `key` tells React to use the `key` itself as part of the position, instead of their order within the parent. This is why, even though you render them in the same place in JSX, React sees them as two different counters, and so they will never share state. Every time a counter appears on the screen, its state is created. Every time it is removed, its state is destroyed. Toggling between them resets their state over and over.
<Trans>`key`를 지정하면 React가 부모 내 순서가 아닌 `key` 자체를 위치의 일부로 사용하도록 지시합니다. 그렇기 때문에 JSX에서 같은 위치에 렌더링하더라도 React의 관점에서 보면 두 카운터는 서로 다른 카운터입니다. 결과적으로 state를 공유하지 않습니다. 카운터가 화면에 나타날 때마다 그 상태가 생성됩니다. 카운터가 제거될 때마다 그 state는 소멸됩니다. 두 카운터 사이를 토글하면 state가 계속 초기화됩니다.</Trans>

<Note>

Remember that keys are not globally unique. They only specify the position *within the parent*.
<Trans>키는 전역으로 고유하지는 않다는 점을 기억하세요. 키는 *부모 내에서의* 위치만 지정합니다.</Trans>

</Note>

### Resetting a form with a key<br/><Trans>키로 form 재설정하기</Trans> {/*resetting-a-form-with-a-key*/}

Resetting state with a key is particularly useful when dealing with forms.
<Trans>키로 state를 재설정하는 것은 form을 다룰 때 특히 유용합니다</Trans>

In this chat app, the `<Chat>` component contains the text input state:
<Trans>이 채팅 앱에서 `<Chat>` 컴포넌트는 텍스트 입력 상태를 포함합니다:</Trans>

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
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
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
          <li key={contact.id}>
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

Try entering something into the input, and then press "Alice" or "Bob" to choose a different recipient. You will notice that the input state is preserved because the `<Chat>` is rendered at the same position in the tree.
<Trans>입력란에 무언가를 입력한 다음 "앨리스" 또는 "밥"을 눌러 다른 수신자를 선택하세요. `<Chat>`이 트리의 동일한 위치에 렌더링되므로 입력 state가 유지되는 것을 알 수 있습니다.</Trans>

**In many apps, this may be the desired behavior, but not in a chat app!** You don't want to let the user send a message they already typed to a wrong person due to an accidental click. To fix it, add a `key`:
<Trans>**많은 앱에서 이러한 동작이 바람직할 수 있지만, 채팅 앱에서는 그렇지 않습니다!** 사용자가 실수로 클릭해서 이미 입력한 메시지를 엉뚱한 사람에게 보내는 것을 원치 않을 것입니다. 이 문제를 해결하려면 `key`를 추가하세요:</Trans>

```js
<Chat key={to.id} contact={to} />
```

This ensures that when you select a different recipient, the `Chat` component will be recreated from scratch, including any state in the tree below it. React will also re-create the DOM elements instead of reusing them.
<Trans>이렇게 하면 다른 수신자를 선택하면 `Chat` 컴포넌트가 그 아래 트리의 모든 state를 포함하여 처음부터 다시 생성됩니다. 또한 React는 DOM 엘리먼트를 재사용하는 대신 다시 생성합니다.</Trans>

Now switching the recipient always clears the text field:
<Trans>이제 수신자를 전환하면 항상 텍스트 필드가 지워집니다:</Trans>

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
      <Chat key={to.id} contact={to} />
    </div>
  )
}

const contacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
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
          <li key={contact.id}>
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

<DeepDive>

#### Preserving state for removed components<br/><Trans>제거된 컴포넌트에 대한 state 보존</Trans> {/*preserving-state-for-removed-components*/}

In a real chat app, you'd probably want to recover the input state when the user selects the previous recipient again. There are a few ways to keep the state "alive" for a component that's no longer visible:
<Trans>실제 채팅 앱에서는 사용자가 이전 수신자를 다시 선택할 때 입력 state를 복구하고 싶을 것입니다. 더 이상 표시되지 않는 컴포넌트의 state를 '살아있게' 유지하는 몇 가지 방법이 있습니다:</Trans>

- You could render _all_ chats instead of just the current one, but hide all the others with CSS. The chats would not get removed from the tree, so their local state would be preserved. This solution works great for simple UIs. But it can get very slow if the hidden trees are large and contain a lot of DOM nodes.
- You could [lift the state up](/learn/sharing-state-between-components) and hold the pending message for each recipient in the parent component. This way, when the child components get removed, it doesn't matter, because it's the parent that keeps the important information. This is the most common solution.
- You might also use a different source in addition to React state. For example, you probably want a message draft to persist even if the user accidentally closes the page. To implement this, you could have the `Chat` component initialize its state by reading from the [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), and save the drafts there too.


<TransBlock>
- 현재 채팅만 렌더링하는 것이 아니라 모든 채팅을 렌더링하되 다른 모든 채팅은 CSS로 숨길 수 있습니다. 채팅은 트리에서 제거되지 않으므로 로컬 state가 유지됩니다. 이 솔루션은 간단한 UI에 적합합니다. 하지만 숨겨진 트리가 크고 많은 DOM 노드를 포함하는 경우 속도가 매우 느려질 수 있습니다.
- 부모 컴포넌트에서 각 수신자에 대한 보류 중인 메시지를 [state를 끌어올려서](https://www.notion.so/3-3-state-Sharing-State-Between-Components-84873ee0bb1a4a92bdc4c355d12d765c) 보관할 수 있습니다. 이렇게 하면 자식 컴포넌트가 제거되더라도 중요한 정보를 보관하는 것은 부모 컴포넌트이므로 문제가 되지 않습니다. 이것이 가장 일반적인 해결책입니다.
- React state 외에 다른 소스를 사용할 수도 있습니다. 예를 들어 사용자가 실수로 페이지를 닫아도 메시지 초안이 유지되기를 원할 수 있습니다. 이를 구현하기 위해 `Chat` 컴포넌트가 `localStorage`에서 읽어서 state를 초기화하고 초안도 저장하도록 할 수 있습니다.
</TransBlock>

No matter which strategy you pick, a chat _with Alice_ is conceptually distinct from a chat _with Bob_, so it makes sense to give a `key` to the `<Chat>` tree based on the current recipient.
<Trans>어떤 전략을 선택하든 앨리스와의 채팅은 밥과의 채팅과 개념적으로 구별되므로 현재 수신자를 기준으로 `<Chat>` 트리에 `key`를 부여하는 것이 합리적입니다.</Trans>

</DeepDive>

<Recap>

- React keeps state for as long as the same component is rendered at the same position.
- State is not kept in JSX tags. It's associated with the tree position in which you put that JSX.
- You can force a subtree to reset its state by giving it a different key.
- Don't nest component definitions, or you'll reset state by accident.

<TransBlock>
  - React는 동일한 컴포넌트가 동일한 위치에서 렌더링되는 한 state를 유지합니다.
  - state는 JSX 태그에 보관되지 않습니다. JSX를 넣은 트리 위치와 연관되어 있습니다.
  - 하위 트리에 다른 key를 지정하여 강제로 state를 재설정할 수 있습니다.
  - 컴포넌트 정의를 중첩하지 마세요. 실수로 state가 초기화될 수 있습니다.
</TransBlock>

</Recap>



<Challenges>

#### Fix disappearing input text<br/><Trans>사라지는 입력 텍스트 수정하기</Trans> {/*fix-disappearing-input-text*/}

This example shows a message when you press the button. However, pressing the button also accidentally resets the input. Why does this happen? Fix it so that pressing the button does not reset the input text.
<Trans>이 예는 버튼을 누르면 메시지가 표시되는 것을 보여줍니다. 그러나 버튼을 누르면 실수로 입력이 재설정됩니다. 왜 이런 일이 발생하나요? 버튼을 눌러도 입력 텍스트가 재설정되지 않도록 수정하세요.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

The problem is that `Form` is rendered in different positions. In the `if` branch, it is the second child of the `<div>`, but in the `else` branch, it is the first child. Therefore, the component type in each position changes. The first position changes between holding a `p` and a `Form`, while the second position changes between holding a `Form` and a `button`. React resets the state every time the component type changes.
<Trans>문제는 `Form`이 다른 위치에서 렌더링된다는 것입니다. `if` 브랜치에서는 `<div>`의 두 번째 자식이지만 `else` 브랜치에서는 첫 번째 자식입니다. 따라서 각 위치의 컴포넌트 유형이 변경됩니다. 첫 번째 위치는 `p`와 `Form`이 있을 때 바뀌고, 두 번째 위치는 `Form`과 `button`이 있을 때 바뀝니다. React는 컴포넌트 타입이 변경될 때마다 상태를 초기화합니다.</Trans>

The easiest solution is to unify the branches so that `Form` always renders in the same position:
<Trans>가장 쉬운 해결책은 `Form`이 항상 같은 위치에서 렌더링되도록 브랜치를 통합하는 것입니다:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  return (
    <div>
      {showHint &&
        <p><i>Hint: Your favorite city?</i></p>
      }
      <Form />
      {showHint ? (
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      ) : (
        <button onClick={() => {
          setShowHint(true);
        }}>Show hint</button>
      )}
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>


Technically, you could also add `null` before `<Form />` in the `else` branch to match the `if` branch structure:
<Trans>엄밀히 말하면, `else` 브랜치에서 `<Form />` 앞에 `null`을 추가하여 `if` 브랜치 구조와 일치시킬 수도 있습니다:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [showHint, setShowHint] = useState(false);
  if (showHint) {
    return (
      <div>
        <p><i>Hint: Your favorite city?</i></p>
        <Form />
        <button onClick={() => {
          setShowHint(false);
        }}>Hide hint</button>
      </div>
    );
  }
  return (
    <div>
      {null}
      <Form />
      <button onClick={() => {
        setShowHint(true);
      }}>Show hint</button>
    </div>
  );
}

function Form() {
  const [text, setText] = useState('');
  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

```css
textarea { display: block; margin: 10px 0; }
```

</Sandpack>

This way, `Form` is always the second child, so it stays in the same position and keeps its state. But this approach is much less obvious and introduces a risk that someone else will remove that `null`.
<Trans>이렇게 하면 `Form`은 항상 두 번째 자식이므로 같은 위치에 머물며 상태를 유지합니다. 하지만 이 접근 방식은 훨씬 덜 명확하고 다른 사람이 `null`을 제거할 위험이 있습니다.</Trans>

</Solution>

#### Swap two form fields<br/><Trans>두 form 필드 교체하기</Trans> {/*swap-two-form-fields*/}

This form lets you enter first and last name. It also has a checkbox controlling which field goes first. When you tick the checkbox, the "Last name" field will appear before the "First name" field.
<Trans>이 양식에서는 이름과 성을 입력할 수 있습니다. 또한 어떤 필드가 먼저 표시되는지 제어하는 확인란도 있습니다. 확인란을 선택하면 '성' 필드가 '이름' 필드 앞에 표시됩니다.</Trans>

It almost works, but there is a bug. If you fill in the "First name" input and tick the checkbox, the text will stay in the first input (which is now "Last name"). Fix it so that the input text *also* moves when you reverse the order.
<Trans>거의 작동하지만 버그가 있습니다. "이름" 입력란을 채우고 checkbox를 클릭하면 텍스트가 첫 번째 입력란(현재는 "성")에 그대로 유지됩니다. 순서를 바꿀 때 입력 텍스트도 이동하도록 수정하세요.</Trans>

<Hint>

It seems like for these fields, their position within the parent is not enough. Is there some way to tell React how to match up the state between re-renders?
<Trans>이러한 필드의 경우 부모 내에서의 위치만으로는 충분하지 않은 것 같습니다. 리랜더링 간에 상태를 일치시키는 방법을 React에 알려줄 방법이 있을까요?</Trans>
</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field label="Last name" /> 
        <Field label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field label="First name" /> 
        <Field label="Last name" />
        {checkbox}
      </>
    );
      }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

<Solution>

Give a `key` to both `<Field>` components in both `if` and `else` branches. This tells React how to "match up" the correct state for either `<Field>` even if their order within the parent changes:
<Trans>`if`와 `else` 브랜치 모두에 있는 두 `<Field>` 컴포넌트에 `key`를 부여하세요. 이렇게 하면 부모 내 순서가 변경되더라도 두 `<Field>`의 올바른 상태를 "일치"시키는 방법을 React에 알려줍니다:</Trans>
<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [reverse, setReverse] = useState(false);
  let checkbox = (
    <label>
      <input
        type="checkbox"
        checked={reverse}
        onChange={e => setReverse(e.target.checked)}
      />
      Reverse order
    </label>
  );
  if (reverse) {
    return (
      <>
        <Field key="lastName" label="Last name" /> 
        <Field key="firstName" label="First name" />
        {checkbox}
      </>
    );
  } else {
    return (
      <>
        <Field key="firstName" label="First name" /> 
        <Field key="lastName" label="Last name" />
        {checkbox}
      </>
    );
      }
}

function Field({ label }) {
  const [text, setText] = useState('');
  return (
    <label>
      {label}:{' '}
      <input
        type="text"
        value={text}
        placeholder={label}
        onChange={e => setText(e.target.value)}
      />
    </label>
  );
}
```

```css
label { display: block; margin: 10px 0; }
```

</Sandpack>

</Solution>

#### Reset a detail form<br/><Trans>상세 form 재설정하기</Trans> {/*reset-a-detail-form*/}

This is an editable contact list. You can edit the selected contact's details and then either press "Save" to update it, or "Reset" to undo your changes.
<Trans>수정 가능한 연락처 목록입니다. 선택한 연락처의 세부 정보를 수정한 다음 'Save'을 눌러 업데이트하거나 'Reset'을 눌러 변경 내용을 취소할 수 있습니다.</Trans>

When you select a different contact (for example, Alice), the state updates but the form keeps showing the previous contact's details. Fix it so that the form gets reset when the selected contact changes.
<Trans>다른 연락처(예: Alice)를 선택하면 state는 업데이트되지만 양식에 이전 연락처의 세부 정보가 계속 표시됩니다. 선택한 연락처가 변경되면 양식이 재설정되도록 수정하세요.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

Give `key={selectedId}` to the `EditContact` component. This way, switching between different contacts will reset the form:
<Trans>`EditContact` 컴포넌트에 `key={selectedId}`를 지정합니다. 이렇게 하면 다른 연락처 사이를 전환할 때 form이 재설정됩니다:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        key={selectedId}
        initialData={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js EditContact.js
import { useState } from 'react';

export default function EditContact({ initialData, onSave }) {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: initialData.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(initialData.name);
        setEmail(initialData.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Clear an image while it's loading<br/><Trans>이미지 로딩중에 기존 이미지 지우기</Trans> {/*clear-an-image-while-its-loading*/}

When you press "Next", the browser starts loading the next image. However, because it's displayed in the same `<img>` tag, by default you would still see the previous image until the next one loads. This may be undesirable if it's important for the text to always match the image. Change it so that the moment you press "Next", the previous image immediately clears.
<Trans>"Next"을 누르면 브라우저에서 다음 이미지 로딩이 시작됩니다. 그러나 동일한 `<img>` 태그에 표시되기 때문에 기본적으로 다음 이미지가 로드될 때까지 이전 이미지가 계속 표시됩니다. 텍스트가 항상 이미지와 일치하는 것이 중요한 경우 이는 바람직하지 않을 수 있습니다. '다음'을 누르는 순간 이전 이미지가 즉시 지워지도록 변경하세요.</Trans>

<Hint>

Is there a way to tell React to re-create the DOM instead of reusing it?
<Trans>React가 DOM을 재사용하는 대신 다시 생성하도록 지시하는 방법이 있을까요?</Trans>
</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

<Solution>

You can provide a `key` to the `<img>` tag. When that `key` changes, React will re-create the `<img>` DOM node from scratch. This causes a brief flash when each image loads, so it's not something you'd want to do for every image in your app. But it makes sense if you want to ensure the image always matches the text.
<Trans>`<img>` 태그에 `key`를 제공할 수 있습니다. 이 `key`가 변경되면 React는 `<img>` DOM 노드를 처음부터 다시 생성합니다. 이렇게 하면 각 이미지가 로드될 때 짧은 플래시가 발생하므로 앱의 모든 이미지에 대해 이 작업을 수행하는 것은 바람직하지 않습니다. 하지만 이미지가 항상 텍스트와 일치하도록 하려는 경우에는 의미가 있습니다.</Trans>
<Sandpack>

```js
import { useState } from 'react';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const hasNext = index < images.length - 1;

  function handleClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  let image = images[index];
  return (
    <>
      <button onClick={handleClick}>
        Next
      </button>
      <h3>
        Image {index + 1} of {images.length}
      </h3>
      <img key={image.src} src={image.src} />
      <p>
        {image.place}
      </p>
    </>
  );
}

let images = [{
  place: 'Penang, Malaysia',
  src: 'https://i.imgur.com/FJeJR8M.jpg'
}, {
  place: 'Lisbon, Portugal',
  src: 'https://i.imgur.com/dB2LRbj.jpg'
}, {
  place: 'Bilbao, Spain',
  src: 'https://i.imgur.com/z08o2TS.jpg'
}, {
  place: 'Valparaíso, Chile',
  src: 'https://i.imgur.com/Y3utgTi.jpg'
}, {
  place: 'Schwyz, Switzerland',
  src: 'https://i.imgur.com/JBbMpWY.jpg'
}, {
  place: 'Prague, Czechia',
  src: 'https://i.imgur.com/QwUKKmF.jpg'
}, {
  place: 'Ljubljana, Slovenia',
  src: 'https://i.imgur.com/3aIiwfm.jpg'
}];
```

```css
img { width: 150px; height: 150px; }
```

</Sandpack>

</Solution>

#### Fix misplaced state in the list<br/><Trans>목록에서 잘못 배치된 상태 수정하기</Trans> {/*fix-misplaced-state-in-the-list*/}

In this list, each `Contact` has state that determines whether "Show email" has been pressed for it. Press "Show email" for Alice, and then tick the "Show in reverse order" checkbox. You will notice that it's _Taylor's_ email that is expanded now, but Alice's--which has moved to the bottom--appears collapsed.
<Trans>이 목록에서 각 `Contact`에는 "Show email"를 눌렀는지 여부를 결정하는 상태가 있습니다. Alice에 대해 'Show email'를 누른 다음 'Show in reverse order' 확인란을 선택합니다. 이제 Taylor의 이메일은 확장되어 있지만 하단으로 이동한 Alice의 이메일은 접혀 있는 것을 볼 수 있습니다.</Trans>

Fix it so that the expanded state is associated with each contact, regardless of the chosen ordering.
<Trans>선택한 순서에 관계없이 expanded state가 각 연락처와 연결되도록 수정하세요.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map((contact, i) =>
          <li key={i}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Solution>

The problem is that this example was using index as a `key`:
<Trans>문제는 인덱스를 'key'로 사용하고 있다는 점입니다:</Trans>

```js
{displayedContacts.map((contact, i) =>
  <li key={i}>
```

However, you want the state to be associated with _each particular contact_.
<Trans>상태가 _각 특정 연락처_와 연결되기를 원합니다.</Trans>

Using the contact ID as a `key` instead fixes the issue:
<Trans>대신 연락처 ID를 `key`로 사용하면 문제가 해결됩니다:</Trans>
<Sandpack>

```js App.js
import { useState } from 'react';
import Contact from './Contact.js';

export default function ContactList() {
  const [reverse, setReverse] = useState(false);

  const displayedContacts = [...contacts];
  if (reverse) {
    displayedContacts.reverse();
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          value={reverse}
          onChange={e => {
            setReverse(e.target.checked)
          }}
        />{' '}
        Show in reverse order
      </label>
      <ul>
        {displayedContacts.map(contact =>
          <li key={contact.id}>
            <Contact contact={contact} />
          </li>
        )}
      </ul>
    </>
  );
}

const contacts = [
  { id: 0, name: 'Alice', email: 'alice@mail.com' },
  { id: 1, name: 'Bob', email: 'bob@mail.com' },
  { id: 2, name: 'Taylor', email: 'taylor@mail.com' }
];
```

```js Contact.js
import { useState } from 'react';

export default function Contact({ contact }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <p><b>{contact.name}</b></p>
      {expanded &&
        <p><i>{contact.email}</i></p>
      }
      <button onClick={() => {
        setExpanded(!expanded);
      }}>
        {expanded ? 'Hide' : 'Show'} email
      </button>
    </>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  margin-bottom: 20px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

State is associated with the tree position. A `key` lets you specify a named position instead of relying on order.
<Trans>상태는 트리 위치와 연관됩니다. `key`를 사용하면 순서에 의존하지 않고 명명된 위치를 지정할 수 있습니다.</Trans>
</Solution>

</Challenges>
