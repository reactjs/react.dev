---
title: Sharing State Between Components
translatedTitle: 컴포넌트 간의 state 공유
translators: [송윤지, 김아영, 고석영]
---

<iframe 
  style={{aspectRatio: 1.7778, width: '100%'}} 
  src="https://www.youtube.com/embed/playlist?list=PLjQV3hketAJkh6BEl0n4PDS_2fBd0cS9v&index=25"
  title="YouTube video player" 
  frameBorder="0" 
/>

<Intro>

Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props. This is known as *lifting state up,* and it's one of the most common things you will do writing React code.
<Trans>때로는 두 컴포넌트의 state가 항상 함께 변경되기를 원할 때가 있습니다. 그렇게 하려면 두 컴포넌트에서 state를 제거하고 가장 가까운 공통 부모로 이동한 다음 props를 통해 전달하면 됩니다. 이를 state 끌어올리기라고 하며, React 코드를 작성할 때 가장 흔히 하는 작업 중 하나입니다.</Trans>

</Intro>

<YouWillLearn>

- How to share state between components by lifting it up
- What are controlled and uncontrolled components
<TransBlock>
- state를 부모 컴포넌트로 끌어올려 컴포넌트끼리 공유하는 방법
- 제어 컴포넌트와 비제어 컴포넌트
</TransBlock>

</YouWillLearn>

## Lifting state up by example<Trans>예제로 알아보는 state 끌어올리기</Trans> {/*lifting-state-up-by-example*/}

In this example, a parent `Accordion` component renders two separate `Panel`s:
<Trans>이 예제에서는 부모 컴포넌트인 `Accordion` 컴포넌트가 두 개의 `Panel` 컴포넌트를 렌더링합니다.</Trans>

* `Accordion`
  - `Panel`
  - `Panel`

Each `Panel` component has a boolean `isActive` state that determines whether its content is visible.
Press the Show button for both panels:
<Trans>각 `Panel` 컴포넌트는 콘텐츠 표시 여부를 결정하는 불리언 타입 `isActive` state를 가집니다. 각 패널의 Show 버튼을 눌러보세요.</Trans>

<Sandpack>

```js
import { useState } from 'react';

function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
          Show
        </button>
      )}
    </section>
  );
}

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About">
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology">
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
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

Notice how pressing one panel's button does not affect the other panel--they are independent.
<Trans>한 패널의 버튼을 눌러도 다른 패널에 영향을 주지 않고 독립적으로 동작합니다.</Trans>

<DiagramGroup>

<Diagram name="sharing_state_child" height={367} width={477} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Both Panel components contain isActive with value false.">

Initially, each `Panel`'s `isActive` state is `false`, so they both appear collapsed
<Trans>처음에는 각 `Panel`의 `isActive` state가 `false` 이므로 둘 다 닫힌 상태로 표시됩니다.</Trans>

</Diagram>

<Diagram name="sharing_state_child_clicked" height={367} width={480} alt="The same diagram as the previous, with the isActive of the first child Panel component highlighted indicating a click with the isActive value set to true. The second Panel component still contains value false." >

Clicking either `Panel`'s button will only update that `Panel`'s `isActive` state alone
<Trans>각각의 `Panel`의 버튼을 클릭하면 해당 `Panel`의 `isActive` state만 업데이트 됩니다.</Trans>

</Diagram>

</DiagramGroup>

**But now let's say you want to change it so that only one panel is expanded at any given time.** With that design, expanding the second panel should collapse the first one. How would you do that?
<Trans>**그러나 이제 한 번에 하나의 패널만 열리도록 변경하려고 합니다.** 설계에 따르면, 두 번째 패널을 열기 위해선 첫 번째 패널을 닫아야 합니다. 어떻게 해야 할까요?</Trans>

To coordinate these two panels, you need to "lift their state up" to a parent component in three steps:
<Trans>이 두 패널을 조정하려면 세 단계에 걸쳐 부모 컴포넌트로 “state를 끌어올려야” 합니다:</Trans>

1. **Remove** state from the child components.
2. **Pass** hardcoded data from the common parent.
3. **Add** state to the common parent and pass it down together with the event handlers.

<TransBlock>
1. 자식 컴포넌트에서 state를 **제거**합니다.
2. 공통 부모 컴포넌트에 하드 코딩된 데이터를 **전달**합니다.
3. 공통 부모 컴포넌트에 state를 **추가**하고 이벤트 핸들러와 함께 전달합니다.
</TransBlock>

This will allow the `Accordion` component to coordinate both `Panel`s and only expand one at a time.
<Trans>이렇게 하면 `Accordion` 컴포넌트가 두 `Panel` 컴포넌트를 조정하고 한 번에 하나씩만 열리도록 할 수 있습니다.</Trans>

### Step 1: Remove state from the child components<Trans>자식 컴포넌트에서 state 제거</Trans> {/*step-1-remove-state-from-the-child-components*/}

You will give control of the `Panel`'s `isActive` to its parent component. This means that the parent component will pass `isActive` to `Panel` as a prop instead. Start by **removing this line** from the `Panel` component:
<Trans>부모 컴포넌트에 `Panel`의 `isActive`를 제어할 수 있는 권한을 부여합니다. 즉, 부모 컴포넌트가 `isActive`를 `Panel`에 prop으로 대신 전달하게 됩니다. 먼저 `Panel` 컴포넌트에서 **다음 줄을 제거하세요:**</Trans>

```js
const [isActive, setIsActive] = useState(false);
```

And instead, add `isActive` to the `Panel`'s list of props:
<Trans>대신 `Panel`의 props 목록에 `isActive`를 추가하세요:</Trans>

```js
function Panel({ title, children, isActive }) {
```

Now the `Panel`'s parent component can *control* `isActive` by [passing it down as a prop.](/learn/passing-props-to-a-component) Conversely, the `Panel` component now has *no control* over the value of `isActive`--it's now up to the parent component!
<Trans>이제 `Panel`의 부모 컴포넌트는 `isActive`를 [prop으로 전달](/learn/passing-props-to-a-component)하여 *제어할 수 있습니다.* 반대로, 이제 `Panel` 컴포넌트는 `isActive` 값을 *제어할 수 없습니다.* 이는 이제부터 부모 컴포넌트에 달려 있습니다!</Trans>

### Step 2: Pass hardcoded data from the common parent<Trans>공통 부모에 하드 코딩된 데이터 전달하기</Trans> {/*step-2-pass-hardcoded-data-from-the-common-parent*/}

To lift state up, you must locate the closest common parent component of *both* of the child components that you want to coordinate:
<Trans>state를 끌어올리려면 조정하려는 *두* 자식 컴포넌트의 가장 가까운 공통 부모 컴포넌트를 찾아야 합니다:</Trans>

* `Accordion` *(closest common parent)* <Trans>*(가장 가까운 공통 부모)*</Trans>
  - `Panel`
  - `Panel`

In this example, it's the `Accordion` component. Since it's above both panels and can control their props, it will become the "source of truth" for which panel is currently active. Make the `Accordion` component pass a hardcoded value of `isActive` (for example, `true`) to both panels:
<Trans>예제에서 가장 가까운 공통 부모는 `Accordion` 컴포넌트입니다. 두 패널 위에 있고 props를 제어할 수 있으므로 현재 어떤 패널이 활성화되어 있는지에 대한 “진실 공급원(source of truth)”이 됩니다. `Accordion` 컴포넌트가 두 패널 모두에 하드 코딩된 `isActive` 값(예: `true`)을 전달하도록 합니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel title="About" isActive={true}>
        With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
      </Panel>
      <Panel title="Etymology" isActive={true}>
        The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
      </Panel>
    </>
  );
}

function Panel({ title, children, isActive }) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={() => setIsActive(true)}>
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

Try editing the hardcoded `isActive` values in the `Accordion` component and see the result on the screen.
<Trans>`Accordion` 컴포넌트에서 하드코딩된 `isActive` 값을 편집하고 화면에서 결과를 확인해보세요.</Trans>

### Step 3: Add state to the common parent<Trans>공통 부모에 state 추가</Trans> {/*step-3-add-state-to-the-common-parent*/}

Lifting state up often changes the nature of what you're storing as state.
<Trans>state를 끌어올리면 state로 저장하는 항목의 특성이 변경되는 경우가 많습니다.</Trans>

In this case, only one panel should be active at a time. This means that the `Accordion` common parent component needs to keep track of *which* panel is the active one. Instead of a `boolean` value, it could use a number as the index of the active `Panel` for the state variable:
<Trans>이 경우 한 번에 하나의 패널만 활성화되어야 합니다. 즉, 공통 부모 컴포넌트인 `Accordion`는 어떤 패널이 활성화된 패널인지 추적해야 합니다. `boolean` 값 대신, 활성화된 `Panel` 의 인덱스를 나타내는 숫자를 state 변수로 사용할 수 있습니다:</Trans>

```js
const [activeIndex, setActiveIndex] = useState(0);
```

When the `activeIndex` is `0`, the first panel is active, and when it's `1`, it's the second one.
<Trans>`activeIndex`가 `0` 이면 첫번째 패널이 활성화된 것이고, `1` 이면 두 번째 패널이 활성화된 것입니다.</Trans>

Clicking the "Show" button in either `Panel` needs to change the active index in `Accordion`. A `Panel` can't set the `activeIndex` state directly because it's defined inside the `Accordion`. The `Accordion` component needs to *explicitly allow* the `Panel` component to change its state by [passing an event handler down as a prop](/learn/responding-to-events#passing-event-handlers-as-props):
<Trans>각 `Panel`에서 “Show" 버튼을 클릭하면 `Accordian`의 활성화된 인덱스를 변경해야 합니다. `activeIndex` state가 `Accordian` 내부에 정의되어 있기 때문에 `Panel`은 값을 직접 설정할 수 없습니다. `Accordion` 컴포넌트는 [이벤트 핸들러를 prop으로 전달](/learn/responding-to-events#passing-event-handlers-as-props)하여 `Panel` 컴포넌트가 state를 변경할 수 있도록 명시적으로 허용해야 합니다.</Trans>

```js
<>
  <Panel
    isActive={activeIndex === 0}
    onShow={() => setActiveIndex(0)}
  >
    ...
  </Panel>
  <Panel
    isActive={activeIndex === 1}
    onShow={() => setActiveIndex(1)}
  >
    ...
  </Panel>
</>
```

The `<button>` inside the `Panel` will now use the `onShow` prop as its click event handler:
<Trans>이제 `Panel` 안에 있는 `<button>`은 클릭 이벤트 핸들러로 `onShow` prop을 사용할 수 있습니다:</Trans>

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

This completes lifting state up! Moving state into the common parent component allowed you to coordinate the two panels. Using the active index instead of two "is shown" flags ensured that only one panel is active at a given time. And passing down the event handler to the child allowed the child to change the parent's state.
<Trans>이렇게 state 끌어올리기가 완성되었습니다! state를 공통 부모 컴포넌트로 옮기면 두 패널을 조정할 수 있게 됩니다. 두 개의 “is shown” 플래그 대신 활성화된 인덱스를 사용하면 한번에 하나의 패널만 활성화되게 할 수 있었습니다. 그리고 이벤트 핸들러를 자식에게 전달하면 자식이 부모의 state를 변경할 수 있었습니다.</Trans>

<DiagramGroup>

<Diagram name="sharing_state_parent" height={385} width={487} alt="Diagram showing a tree of three components, one parent labeled Accordion and two children labeled Panel. Accordion contains an activeIndex value of zero which turns into isActive value of true passed to the first Panel, and isActive value of false passed to the second Panel." >

Initially, `Accordion`'s `activeIndex` is `0`, so the first `Panel` receives `isActive = true`
<Trans>처음에는 `Accordion`의 `activeIndex`는 `0`이므로, 첫 번째 패널이 `isActive = true` 값을 전달 받습니다.</Trans>

</Diagram>

<Diagram name="sharing_state_parent_clicked" height={385} width={521} alt="The same diagram as the previous, with the activeIndex value of the parent Accordion component highlighted indicating a click with the value changed to one. The flow to both of the children Panel components is also highlighted, and the isActive value passed to each child is set to the opposite: false for the first Panel and true for the second one." >

When `Accordion`'s `activeIndex` state changes to `1`, the second `Panel` receives `isActive = true` instead
<Trans>`Accordion`의 `activeIndex` state가 `1`로 변경되면, 두 번째 패널이 `isActive = true` 값을 전달 받습니다.</Trans>

</Diagram>

</DiagramGroup>

<DeepDive>

#### Controlled and uncontrolled components<Trans>제어 및 비제어 컴포넌트</Trans> {/*controlled-and-uncontrolled-components*/}

It is common to call a component with some local state "uncontrolled". For example, the original `Panel` component with an `isActive` state variable is uncontrolled because its parent cannot influence whether the panel is active or not.
<Trans>일반적으로 일부 로컬 state를 가진 컴포넌트를 "비제어 컴포넌트"라고 부릅니다. 예를 들어, `isActive` state 변수가 있는 원래 `Panel` 컴포넌트는 부모가 패널의 활성화 여부에 영향을 줄 수 없기 때문에 제어되지 않습니다.</Trans>

In contrast, you might say a component is "controlled" when the important information in it is driven by props rather than its own local state. This lets the parent component fully specify its behavior. The final `Panel` component with the `isActive` prop is controlled by the `Accordion` component.
<Trans>반대로 컴포넌트의 중요한 정보가 자체 로컬 state가 아닌 props에 의해 구동되는 경우 컴포넌트가 "제어"된다고 말할 수 있습니다. 이렇게 하면 부모 컴포넌트가 그 동작을 완전히 지정할 수 있습니다. 최종 `Panel` 컴포넌트에는 `isActive` props가 있으며, `Accordion` 컴포넌트에 의해 제어됩니다.</Trans>

Uncontrolled components are easier to use within their parents because they require less configuration. But they're less flexible when you want to coordinate them together. Controlled components are maximally flexible, but they require the parent components to fully configure them with props.
<Trans>비제어 컴포넌트는 구성이 덜 필요하기 때문에 상위 컴포넌트 내에서 사용하기가 더 쉽습니다. 하지만 함께 통합하려는 경우 유연성이 떨어집니다. 제어 컴포넌트는 최대한의 유연성을 제공하지만 부모 컴포넌트가 props를 사용하여 완전히 구성해야 합니다.</Trans>

In practice, "controlled" and "uncontrolled" aren't strict technical terms--each component usually has some mix of both local state and props. However, this is a useful way to talk about how components are designed and what capabilities they offer.
<Trans>실제로 "제어"와 "비제어"는 엄격한 기술 용어가 아니며, 각 컴포넌트에는 일반적으로 로컬 state와 props가 혼합되어 있습니다. 하지만 컴포넌트가 어떻게 설계되고 어떤 기능을 제공하는지에 대해 이야기할 때 유용한 용어입니다.</Trans>

When writing a component, consider which information in it should be controlled (via props), and which information should be uncontrolled (via state). But you can always change your mind and refactor later.
<Trans>컴포넌트를 작성할 때는 (props를 통해) 컴포넌트에서 어떤 정보를 제어해야 하는지, (state를 통해) 어떤 정보를 제어하지 않아야 하는지 고려하세요. 하지만 나중에 언제든지 마음을 바꾸고 리팩토링할 수 있습니다.</Trans>

</DeepDive>

## A single source of truth for each state<Trans>각 state의 단일 진실 공급원(SSOT)</Trans> {/*a-single-source-of-truth-for-each-state*/}

In a React application, many components will have their own state. Some state may "live" close to the leaf components (components at the bottom of the tree) like inputs. Other state may "live" closer to the top of the app. For example, even client-side routing libraries are usually implemented by storing the current route in the React state, and passing it down by props!
<Trans>React 애플리케이션(이하 앱)에서 많은 컴포넌트는 고유한 state를 가지고 있습니다. 일부 state는 입력값과 같이 [leaf 컴포넌트](https://stackoverflow.com/questions/65278395/what-do-you-mean-by-leaf-components-in-react)(트리의 맨 아래에 있는 컴포넌트)에 가깝게 "위치" 할 수 있습니다. 다른 state는 앱의 상단에 더 가깝게 “위치" 할 수 있습니다. 예를 들어, 클라이언트 측 라우팅 라이브러리도 일반적으로 현재 경로를 React state에 저장하고 props를 통해 전달하는 방식으로 구현됩니다!</Trans>

**For each unique piece of state, you will choose the component that "owns" it.** This principle is also known as having a ["single source of truth".](https://en.wikipedia.org/wiki/Single_source_of_truth) It doesn't mean that all state lives in one place--but that for _each_ piece of state, there is a _specific_ component that holds that piece of information. Instead of duplicating shared state between components, *lift it up* to their common shared parent, and *pass it down* to the children that need it.
<Trans>**각 고유한 state들에 대해 해당 state를 "소유"하는 컴포넌트를 선택하게 됩니다.** 이 원칙은 "[단일 진실 공급원](https://en.wikipedia.org/wiki/Single_source_of_truth)"이라고도 합니다. 이는 모든 state가 한 곳에 있다는 뜻이 아니라, 각 state마다 해당 정보를 소유하는 특정 컴포넌트가 있다는 뜻입니다. 컴포넌트 간에 공유하는 state를 복제하는 대신 공통으로 공유하는 부모로 *끌어올려서* 필요한 자식에게 전달합니다.</Trans>

Your app will change as you work on it. It is common that you will move state down or back up while you're still figuring out where each piece of the state "lives". This is all part of the process!
<Trans>앱은 작업하면서 계속 변경됩니다. 각 state의 “위치”를 파악하는 동안 state를 아래로 이동하거나 백업하는 것이 일반적입니다. 이 모든 것이 과정의 일부입니다!</Trans>

To see what this feels like in practice with a few more components, read [Thinking in React.](/learn/thinking-in-react)
<Trans>몇 가지 컴포넌트를 사용해 실제로 어떤 느낌인지 알아보려면 [React로 사고하기](/learn/thinking-in-react)를 읽어보세요.</Trans>

<Recap>

* When you want to coordinate two components, move their state to their common parent.
* Then pass the information down through props from their common parent.
* Finally, pass the event handlers down so that the children can change the parent's state.
* It's useful to consider components as "controlled" (driven by props) or "uncontrolled" (driven by state).
<TransBlock>
* 두 컴포넌트를 조정하려면 해당 컴포넌트의 state를 공통 부모로 이동합니다.
* 그런 다음 공통 부모로부터 props를 통해 정보를 전달합니다.
* 마지막으로 이벤트 핸들러를 전달하여 자식이 부모의 state를 변경할 수 있도록 합니다.
* 컴포넌트를 (props에 의해) "제어"할 지 (state에 의해) "비제어"할지 고려해보는 것은 유용합니다.
</TransBlock>

</Recap>

<Challenges>

#### Synced inputs<Trans>동기화된 입력</Trans> {/*synced-inputs*/}

These two inputs are independent. Make them stay in sync: editing one input should update the other input with the same text, and vice versa. 
<Trans>이 두 입력창은 독립적입니다. 두 입력창을 동기화하세요. 하나의 입력창을 편집하면 다른 입력창도 동일한 텍스트로 업데이트되어야 하며, 그 반대의 경우도 마찬가지입니다.</Trans>

<Hint>

You'll need to lift their state up into the parent component.
<Trans>해당 컴포넌트의 state를 부모 컴포넌트로 끌어올려야 합니다.</Trans>

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  return (
    <>
      <Input label="First input" />
      <Input label="Second input" />
    </>
  );
}

function Input({ label }) {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <label>
      {label}
      {' '}
      <input
        value={text}
        onChange={handleChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

<Solution>

Move the `text` state variable into the parent component along with the `handleChange` handler. Then pass them down as props to both of the `Input` components. This will keep them in sync.
<Trans>`text` state 변수를 `handleChange` 핸들러와 함께 부모 컴포넌트로 이동합니다. 그런 다음 두 `Input` 컴포넌트에 프로퍼티로 전달합니다. 이렇게 하면 동기화 상태를 유지할 수 있습니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function SyncedInputs() {
  const [text, setText] = useState('');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <Input
        label="First input"
        value={text}
        onChange={handleChange}
      />
      <Input
        label="Second input"
        value={text}
        onChange={handleChange}
      />
    </>
  );
}

function Input({ label, value, onChange }) {
  return (
    <label>
      {label}
      {' '}
      <input
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
```

```css
input { margin: 5px; }
label { display: block; }
```

</Sandpack>

</Solution>

#### Filtering a list<Trans>목록 필터링하기</Trans> {/*filtering-a-list*/}

In this example, the `SearchBar` has its own `query` state that controls the text input. Its parent `FilterableList` component displays a `List` of items, but it doesn't take the search query into account.
<Trans>예제에서 `SearchBar`에는 텍스트 입력창을 제어하는 자체 `query` state가 있습니다. 부모인 `FilterableList` 컴포넌트는 항목의 `List`를 표시하지만 검색 쿼리는 고려하지 않습니다.</Trans>

Use the `filterItems(foods, query)` function to filter the list according to the search query. To test your changes, verify that typing "s" into the input filters down the list to "Sushi", "Shish kebab", and "Dim sum".
<Trans>검색 쿼리에 따라 목록을 필터링하려면 `filterItems(foods, query)` 함수를 사용합니다. 변경 사항을 테스트하려면, input에 "s"를 입력하면 목록이 “Sushi”, “Shish kebab”, “Dim sum”으로 필터링되는지 확인합니다.</Trans>

Note that `filterItems` is already implemented and imported so you don't need to write it yourself!
<Trans>`filterItems`는 이미 구현되어 import 되어 있으므로 직접 작성할 필요가 없습니다!</Trans>

<Hint>

You will want to remove the `query` state and the `handleChange` handler from the `SearchBar`, and move them to the `FilterableList`. Then pass them down to `SearchBar` as `query` and `onChange` props.
<Trans>`SearchBar`에서 `query` state와 `handleChange` 핸들러를 제거하고 이를 `FilterableList`로 이동시켜야 합니다. 그런 다음 `query`와 `onChange`를 props로 `SearchBar`에 전달합니다.</Trans>

</Hint>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  return (
    <>
      <SearchBar />
      <hr />
      <List items={foods} />
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={handleChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody>
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

<Solution>

Lift the `query` state up into the `FilterableList` component. Call `filterItems(foods, query)` to get the filtered list and pass it down to the `List`. Now changing the query input is reflected in the list:
<Trans>`query` state를 `FilterableList` 컴포넌트로 끌어올립니다. 필터링된 목록을 가져와서 `List`로 전달하기 위해 `filterItems(foods, query)`를 호출합니다. 이제 쿼리 입력을 변경하면 목록에 반영됩니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';
import { foods, filterItems } from './data.js';

export default function FilterableList() {
  const [query, setQuery] = useState('');
  const results = filterItems(foods, query);

  function handleChange(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      <SearchBar
        query={query}
        onChange={handleChange}
      />
      <hr />
      <List items={results} />
    </>
  );
}

function SearchBar({ query, onChange }) {
  return (
    <label>
      Search:{' '}
      <input
        value={query}
        onChange={onChange}
      />
    </label>
  );
}

function List({ items }) {
  return (
    <table>
      <tbody> 
        {items.map(food => (
          <tr key={food.id}>
            <td>{food.name}</td>
            <td>{food.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

```js data.js
export function filterItems(items, query) {
  query = query.toLowerCase();
  return items.filter(item =>
    item.name.split(' ').some(word =>
      word.toLowerCase().startsWith(query)
    )
  );
}

export const foods = [{
  id: 0,
  name: 'Sushi',
  description: 'Sushi is a traditional Japanese dish of prepared vinegared rice'
}, {
  id: 1,
  name: 'Dal',
  description: 'The most common way of preparing dal is in the form of a soup to which onions, tomatoes and various spices may be added'
}, {
  id: 2,
  name: 'Pierogi',
  description: 'Pierogi are filled dumplings made by wrapping unleavened dough around a savoury or sweet filling and cooking in boiling water'
}, {
  id: 3,
  name: 'Shish kebab',
  description: 'Shish kebab is a popular meal of skewered and grilled cubes of meat.'
}, {
  id: 4,
  name: 'Dim sum',
  description: 'Dim sum is a large range of small dishes that Cantonese people traditionally enjoy in restaurants for breakfast and lunch'
}];
```

</Sandpack>

</Solution>

</Challenges>
