---
title: Passing Data Deeply with Context
translatedTitle: Context로 데이터 깊게 전달하기
translators: [이승효, 서민택, 이도원]
---

<Intro>

Usually, you will pass information from a parent component to a child component via props. But passing props can become verbose and inconvenient if you have to pass them through many components in the middle, or if many components in your app need the same information. *Context* lets the parent component make some information available to any component in the tree below it—no matter how deep—without passing it explicitly through props.
<Trans>일반적으로 부모 컴포넌트에서 자식 컴포넌트로 props를 통해 정보를 전달합니다. 하지만 중간에 여러 컴포넌트를 거쳐야 하거나 앱의 여러 컴포넌트가 동일한 정보를 필요로 하는 경우 props를 전달하면 장황하고 불편해질 수 있습니다. *Context*를 사용하면 부모 컴포넌트가 props를 통해 명시적으로 전달하지 않고도 깊이 여부와 무관하게 그 아래 트리의 모든 컴포넌트에서 일부 정보를 사용할 수 있습니다.</Trans>

</Intro>

<YouWillLearn>

- What "prop drilling" is
- How to replace repetitive prop passing with context
- Common use cases for context
- Common alternatives to context 

<TransBlock>
- "Prop drilling"이란 무엇인가
- 반복적인 prop 전달을 Context로 대체하는 방법
- Context의 일반적인 사용 사례
- Context에 대한 일반적인 대안
</TransBlock>

</YouWillLearn>

## The problem with passing props <Trans>props 전달의 문제</Trans> {/*the-problem-with-passing-props*/}

[Passing props](/learn/passing-props-to-a-component) is a great way to explicitly pipe data through your UI tree to the components that use it.
<Trans>[props 전달](/learn/passing-props-to-a-component)은 UI 트리를 통해 데이터를 사용하는 컴포넌트로 명시적으로 연결할 수 있는 좋은 방법입니다.</Trans>

But passing props can become verbose and inconvenient when you need to pass some prop deeply through the tree, or if many components need the same prop. The nearest common ancestor could be far removed from the components that need data, and [lifting state up](/learn/sharing-state-between-components) that high can lead to a situation called "prop drilling".
<Trans>그러나 트리 깊숙이 prop을 전달해야 하거나 많은 컴포넌트에 동일한 prop이 필요한 경우 prop 전달이 장황하고 불편해질 수 있습니다. 가장 가까운 공통 조상이 데이터가 필요한 컴포넌트에서 멀리 떨어져 있을 수 있으며, [state를 그렇게 높이 끌어올리면](/learn/sharing-state-between-components) "prop drilling" 이라고 불리는 상황이 발생할 수 있습니다.</Trans>

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in purple. The value flows down to each of the two children, both highlighted in purple." >

Lifting state up
<Trans>state 끌어올리기</Trans>

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} alt="Diagram with a tree of ten nodes, each node with two children or less. The root node contains a bubble representing a value highlighted in purple. The value flows down through the two children, each of which pass the value but do not contain it. The left child passes the value down to two children which are both highlighted purple. The right child of the root passes the value through to one of its two children - the right one, which is highlighted purple. That child passed the value through its single child, which passes it down to both of its two children, which are highlighted purple.">

Prop drilling
<Trans>prop 드릴링</Trans>

</Diagram>

</DiagramGroup>

Wouldn't it be great if there were a way to "teleport" data to the components in the tree that need it without passing props? With React's context feature, there is!
<Trans>props를 전달하지 않고도 트리에서 데이터를 필요한 컴포넌트로 "텔레포트"할 수 있는 방법이 있다면 좋지 않을까요? React의 context 기능을 사용하면 가능합니다!</Trans>

## Context: an alternative to passing props<Trans>Context: props 전달의 대안</Trans> {/*context-an-alternative-to-passing-props*/}

Context lets a parent component provide data to the entire tree below it. There are many uses for context. Here is one example. Consider this `Heading` component that accepts a `level` for its size:
<Trans>Context를 사용하면 상위 컴포넌트가 그 아래 전체 트리에 데이터를 제공할 수 있습니다. context는 다양한 용도로 사용됩니다. 다음은 한 가지 예시입니다. 크기에 대한 `level`을 받아들이는 `Heading`컴포넌트를 생각해 봅시다:</Trans>

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Heading level={2}>Heading</Heading>
      <Heading level={3}>Sub-heading</Heading>
      <Heading level={4}>Sub-sub-heading</Heading>
      <Heading level={5}>Sub-sub-sub-heading</Heading>
      <Heading level={6}>Sub-sub-sub-sub-heading</Heading>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
export default function Heading({ level, children }) {
  switch (level) {
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

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Let's say you want multiple headings within the same `Section` to always have the same size:
<Trans>동일한 `Section` 내의 여러 제목이 항상 같은 크기를 갖도록 하려고 한다고 가정해 보겠습니다:</Trans>

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
export default function Heading({ level, children }) {
  switch (level) {
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

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Currently, you pass the `level` prop to each `<Heading>` separately:
<Trans>현재 `level` prop을 각 `<Heading>`에 개별적으로 전달합니다:</Trans>

```js
<Section>
  <Heading level={3}>About</Heading>
  <Heading level={3}>Photos</Heading>
  <Heading level={3}>Videos</Heading>
</Section>
```

It would be nice if you could pass the `level` prop to the `<Section>` component instead and remove it from the `<Heading>`. This way you could enforce that all headings in the same section have the same size:
<Trans>대신 `level` prop을 `<Section>`컴포넌트로 전달하고 `<Heading>`에서 제거할 수 있다면 좋을 것입니다. 이렇게 하면 같은 section의 모든 제목이 같은 크기를 갖도록 강제할 수 있습니다:</Trans>

```js
<Section level={3}>
  <Heading>About</Heading>
  <Heading>Photos</Heading>
  <Heading>Videos</Heading>
</Section>
```

But how can the `<Heading>` component know the level of its closest `<Section>`? **That would require some way for a child to "ask" for data from somewhere above in the tree.**
<Trans>하지만 `<Heading>`컴포넌트가 가장 가까운 `<Section>`의 level을 어떻게 알 수 있을까요? **그러기 위해서는 자식이 트리 위 어딘가에서 데이터를 "요청"할 수 있는 방법이 필요합니다.**</Trans>

You can't do it with props alone. This is where context comes into play. You will do it in three steps:
<Trans>props 만으로는 부족합니다. 이때 context가 중요한 역할을 합니다. 세 단계로 진행합니다:</Trans>

1. **Create** a context. (You can call it `LevelContext`, since it's for the heading level.)
2. **Use** that context from the component that needs the data. (`Heading` will use `LevelContext`.)
3. **Provide** that context from the component that specifies the data. (`Section` will provide `LevelContext`.)

<TransBlock>
1. context를 **생성**합니다. (제목 level을 위한 것이므로 `LevelContext`라고 부를 수 있습니다)
2. 데이터가 필요한 컴포넌트에서 해당 context를 **사용**합니다. (`Heading`은 `LevelContext`를 사용합니다.)
3. 데이터를 지정하는 컴포넌트에서 해당 context를 **제공**합니다. (`Section`은 `LevelContext`를 제공합니다).
</TransBlock>

Context lets a parent--even a distant one!--provide some data to the entire tree inside of it.
<Trans>context는 멀리 떨어져 있는 상위 트리라도 그 안에 있는 전체 트리에 일부 데이터를 제공할 수 있게 해줍니다.</Trans>

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} alt="Diagram with a tree of three components. The parent contains a bubble representing a value highlighted in orange which projects down to the two children, each highlighted in orange." >

Using context in close children
<Trans>가까운 자식에서 context 사용</Trans>

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} alt="Diagram with a tree of ten nodes, each node with two children or less. The root parent node contains a bubble representing a value highlighted in orange. The value projects down directly to four leaves and one intermediate component in the tree, which are all highlighted in orange. None of the other intermediate components are highlighted.">

Using context in distant children
<Trans>먼 자식에서 context 사용</Trans>
</Diagram>

</DiagramGroup>

### Step 1: Create the context<Trans>Step1: Context 만들기</Trans> {/*step-1-create-the-context*/}

First, you need to create the context. You'll need to **export it from a file** so that your components can use it:
<Trans>먼저 context를 만들어야 합니다. 컴포넌트에서 사용할 수 있도록 **파일에서 내보내기**를해야 합니다:</Trans>

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Title</Heading>
      <Section>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Heading level={2}>Heading</Heading>
        <Section>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Heading level={3}>Sub-heading</Heading>
          <Section>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
            <Heading level={4}>Sub-sub-heading</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
export default function Heading({ level, children }) {
  switch (level) {
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

```js LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
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

The only argument to `createContext` is the _default_ value. Here, `1` refers to the biggest heading level, but you could pass any kind of value (even an object). You will see the significance of the default value in the next step.
<Trans>`createContext`의 유일한 인수는 _기본값_ 입니다. 여기서 `1`은 가장 큰 제목 수준을 의미하지만 모든 종류의 값(객체 포함)을 전달할 수 있습니다. 기본값의 중요성은 다음 단계에서 확인할 수 있습니다.</Trans>

### Step 2: Use the context<Trans>Step 2: context 사용하기</Trans> {/*step-2-use-the-context*/}

Import the `useContext` Hook from React and your context:
<Trans>React와 context에서 `useContext` Hook을 가져옵니다:</Trans>

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Currently, the `Heading` component reads `level` from props:
<Trans>현재 `Heading` 컴포넌트는 props 에서 `level`을 읽습니다:</Trans>

```js
export default function Heading({ level, children }) {
  // ...
}
```

Instead, remove the `level` prop and read the value from the context you just imported, `LevelContext`:
<Trans>대신 `level` prop을 제거하고 방금 import한 context인 `LevelContext`에서 값을 읽습니다:</Trans>

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` is a Hook. Just like `useState` and `useReducer`, you can only call a Hook immediately inside a React component (not inside loops or conditions). **`useContext` tells React that the `Heading` component wants to read the `LevelContext`.**
<Trans>`useContext`는 Hook입니다. `useState` 및 `useReducer`와 마찬가지로, React 컴포넌트의 최상단에서만 Hook을 호출할 수 있습니다. **`useContext`는 React에게 `Heading` 컴포넌트가 `LevelContext`를 읽기를 원한다고 알려줍니다.**</Trans>

Now that the `Heading` component doesn't have a `level` prop, you don't need to pass the level prop to `Heading` in your JSX like this anymore:
<Trans>이제 `Heading` 컴포넌트에는 `level` prop 이 없으므로 더 이상 JSX에서 이런 식으로 `Heading`에 level prop 을 전달할 필요가 없습니다:</Trans>

```js
<Section>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
  <Heading level={4}>Sub-sub-heading</Heading>
</Section>
```

Update the JSX so that it's the `Section` that receives it instead:
<Trans>대신 `Section`이 level을 받도록 JSX를 수정합니다:</Trans>

```jsx
<Section level={4}>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
  <Heading>Sub-sub-heading</Heading>
</Section>
```

As a reminder, this is the markup that you were trying to get working:
<Trans>다시 한 번 말씀드리지만, 이 마크업이 우리가 작동하도록 만들고자 했던 그 마크업입니다:</Trans>

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
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
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
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

export const LevelContext = createContext(1);
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

Notice this example doesn't quite work, yet! All the headings have the same size because **even though you're *using* the context, you have not *provided* it yet.** React doesn't know where to get it!
<Trans>이 예제는 아직 제대로 작동하지 않습니다! **context를 *사용*하고 있지만 아직 context를 *제공*하지 않았기 때문에** 모든 제목의 크기가 동일합니다. React는 어디서 그것을 가져와야 할지 모릅니다!</Trans>

If you don't provide the context, React will use the default value you've specified in the previous step. In this example, you specified `1` as the argument to `createContext`, so `useContext(LevelContext)` returns `1`, setting all those headings to `<h1>`. Let's fix this problem by having each `Section` provide its own context.
<Trans>context를 제공하지 않으면 React는 이전 단계에서 지정한 기본값을 사용합니다. 이 예제에서는 `createContext`의 인수로 `1`을 지정했기 때문에, `useContext(LevelContext)`는 `1`을 반환하고 모든 제목을 `<h1>`으로 설정합니다. 각 `Section`이 자체 context를 제공하도록 하여 이 문제를 해결해 보겠습니다.</Trans>

### Step 3: Provide the context<Trans>Step 3: context 제공하기</Trans> {/*step-3-provide-the-context*/}

The `Section` component currently renders its children:
<Trans>`Section` 컴포넌트는 현재 children을 렌더링합니다:</Trans>

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Wrap them with a context provider** to provide the `LevelContext` to them:
<Trans>**context provider로 래핑**하여 `LevelContext`를 제공하세요:</Trans>

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

This tells React: "if any component inside this `<Section>` asks for `LevelContext`, give them this `level`." The component will use the value of the nearest `<LevelContext.Provider>` in the UI tree above it.
<Trans>이는 React에게 "이 `<Section>` 안에 있는 컴포넌트가 `LevelContext`를 요청하면 이 `level`을 제공하라."고 지시합니다. 컴포넌트는 그 위에 있는 UI 트리에서 가장 가까운 `<LevelContext.Provider>`의 값을 사용합니다.</Trans>

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section level={3}>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section level={4}>
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
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
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

export const LevelContext = createContext(1);
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

It's the same result as the original code, but you did not need to pass the `level` prop to each `Heading` component! Instead, it "figures out" its heading level by asking the closest `Section` above:
<Trans>원래 코드와 동일한 결과이지만, 각 `Heading` 컴포넌트에 `level` prop을 전달할 필요가 없습니다! 대신, 위의 가장 가까운 `Section`에 요청하여 제목 level을 "파악"합니다:</Trans>

1. You pass a `level` prop to the `<Section>`.
2. `Section` wraps its children into `<LevelContext.Provider value={level}>`.
3. `Heading` asks the closest value of `LevelContext` above with `useContext(LevelContext)`.

<TransBlock>
1. `level` prop을 `<Section>`에 전달합니다.
2. `Section`은 section의 children을 `<LevelContext.Provider value={level}>`로 래핑합니다.
3. `Heading`은 `useContext(LevelContext)`를 사용하여 위의 `LevelContext`값에 가장 가까운 값을 요청합니다.
</TransBlock>

## Using and providing context from the same component<Trans>동일한 컴포넌트에서 context 사용 및 제공</Trans> {/*using-and-providing-context-from-the-same-component*/}

Currently, you still have to specify each section's `level` manually:
<Trans>현재는 여전히 각 section의 `level`을 수동으로 지정해야 합니다:</Trans>

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

Since context lets you read information from a component above, each `Section` could read the `level` from the `Section` above, and pass `level + 1` down automatically. Here is how you could do it:
<Trans>context를 사용하면 위의 컴포넌트에서 정보를 읽을 수 있으므로 각 `Section`은 위의 `Section`에서 `level`을 읽고 `level + 1`을 자동으로 아래로 전달할 수 있습니다. 방법은 다음과 같습니다:</Trans>

```js Section.js {5,8}
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

With this change, you don't need to pass the `level` prop *either* to the `<Section>` or to the `<Heading>`:
<Trans>이렇게 변경하면 `level` prop을 `<Section>`이나 `<Heading>`*모두*에 전달할 필요가 없습니다:</Trans>

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

Now both `Heading` and `Section` read the `LevelContext` to figure out how "deep" they are. And the `Section` wraps its children into the `LevelContext` to specify that anything inside of it is at a "deeper" level.
<Trans>이제 `Heading`과 `Section`은 모두 `LevelContext`를 읽어 얼마나 "깊은" 수준인지 파악합니다. 그리고 `Section`은 그 children을 `LevelContext`로 래핑하여 그 안에 있는 모든 것이 "더 깊은" level에 있음을 지정합니다.</Trans>

<Note>

This example uses heading levels because they show visually how nested components can override context. But context is useful for many other use cases too. You can pass down any information needed by the entire subtree: the current color theme, the currently logged in user, and so on.
<Trans>이 예제에서는 중첩된 컴포넌트가 context를 재정의하는 방법을 시각적으로 보여주기 위해 제목 level을 사용합니다. 하지만 context는 다른 많은 사용 사례에도 유용합니다. context를 사용하여 현재 색상 테마, 현재 로그인한 사용자 등 전체 하위 트리에 필요한 모든 정보를 전달할 수 있습니다.</Trans>

</Note>

## Context passes through intermediate components<Trans>Context는 중간 컴포넌트들을 통과합니다</Trans> {/*context-passes-through-intermediate-components*/}

You can insert as many components as you like between the component that provides context and the one that uses it. This includes both built-in components like `<div>` and components you might build yourself.
<Trans>context를 제공하는 컴포넌트와 context를 사용하는 컴포넌트 사이에 원하는 만큼의 컴포넌트를 삽입할 수 있습니다. 여기에는 `<div>`와 같은 기본 제공 컴포넌트와 사용자가 직접 빌드할 수 있는 컴포넌트가 모두 포함됩니다.</Trans>

In this example, the same `Post` component (with a dashed border) is rendered at two different nesting levels. Notice that the `<Heading>` inside of it gets its level automatically from the closest `<Section>`:
<Trans>이 예시에서는 동일한 `Post` 컴포넌트(점선 테두리 포함)가 두 개의 서로 다른 중첩 단계에서 렌더링됩니다. 그 안의 `<Heading>`이 가장 가까운 `<Section>`에서 자동으로 level을 가져오는 것을 볼 수 있습니다:</Trans>

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Hello traveller!"
        body="Read about my adventures."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Flavors of Lisbon"
        body="...those pastéis de nata!"
      />
      <Post
        title="Buenos Aires in the rhythm of tango"
        body="I loved it!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
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

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

You didn't do anything special for this to work. A `Section` specifies the context for the tree inside it, so you can insert a `<Heading>` anywhere, and it will have the correct size. Try it in the sandbox above!
<Trans>이 기능이 작동하기 위해 특별한 작업을 수행하지 않았습니다. `Section`은 그 안에 있는 트리의 context를 지정하므로 아무 곳에나 `<Heading>`을 삽입할 수 있으며 올바른 크기를 갖습니다. 위의 샌드박스에서 사용해 보세요!</Trans>

**Context lets you write components that "adapt to their surroundings" and display themselves differently depending on _where_ (or, in other words, _in which context_) they are being rendered.**
<Trans>**Context를 사용하면 "주변 환경에 적응"하고 렌더링되는 _위치_ (_context_)에 따라 다르게 표시되는 컴포넌트를 작성할 수 있습니다.**</Trans>

How context works might remind you of [CSS property inheritance.](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) In CSS, you can specify `color: blue` for a `<div>`, and any DOM node inside of it, no matter how deep, will inherit that color unless some other DOM node in the middle overrides it with `color: green`. Similarly, in React, the only way to override some context coming from above is to wrap children into a context provider with a different value.
<Trans>context가 작동하는 방식은 [CSS 속성 상속](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance)을 떠올리게 할 수 있습니다. CSS에서는 `<div>`에 `color: blue`을 지정할 수 있으며, 중간에 다른 DOM 노드가 `color: green`으로 재정의하지 않는 한 그 안에 있는 모든 DOM 노드는 아무리 깊어도 그 색을 상속받습니다. 마찬가지로 React에서 위에서 오는 context를 재정의하는 유일한 방법은 children을 다른 값으로 context provider로 감싸는 것입니다.</Trans>

In CSS, different properties like `color` and `background-color` don't override each other. You can set all  `<div>`'s `color` to red without impacting `background-color`. Similarly, **different React contexts don't override each other.** Each context that you make with `createContext()` is completely separate from other ones, and ties together components using and providing *that particular* context. One component may use or provide many different contexts without a problem.
<Trans>CSS에서는 `color` 및 `background-color`와 같은 서로 다른 속성이 서로 재정의되지 않습니다. `background-color`에 영향을 주지 않고 모든 `<div>`의 `color`를 빨간색으로 설정할 수 있습니다. 마찬가지로 서로 다른 React context도 서로 재정의하지 않습니다. `createContext()`로 만드는 각 context는 다른 context와 완전히 분리되어 있으며, *특정* context를 사용하거나 제공하는 컴포넌트를 함께 묶습니다. 하나의 컴포넌트가 문제없이 다양한 context를 사용하거나 제공할 수 있습니다.</Trans>

## Before you use context<Trans>context를 사용하기 전에</Trans> {/*before-you-use-context*/}

Context is very tempting to use! However, this also means it's too easy to overuse it. **Just because you need to pass some props several levels deep doesn't mean you should put that information into context.**
<Trans>context는 사용하기 매우 유혹적입니다! 그러나 이는 또한 너무 쉽게 남용될 수 있다는 의미이기도 합니다. **props를 몇 단계 깊이 전달해야 한다고 해서 해당 정보를 context에 넣어야 한다는 의미는 아닙니다.**</Trans>

Here's a few alternatives you should consider before using context:
<Trans>다음은 context를 사용하기 전에 고려해야 할 몇 가지 대안입니다:</Trans>

1. **Start by [passing props.](/learn/passing-props-to-a-component)** If your components are not trivial, it's not unusual to pass a dozen props down through a dozen components. It may feel like a slog, but it makes it very clear which components use which data! The person maintaining your code will be glad you've made the data flow explicit with props.
<Trans>**[props 전달](/learn/passing-props-to-a-component)로 시작하세요.** 컴포넌트가 사소하지 않다면, 수십 개의 props를 수십 개의 컴포넌트에 전달해야 하는 경우가 드물지 않습니다. 지루하게 느껴질 수도 있지만, 어떤 컴포넌트가 어떤 데이터를 사용하는지 매우 명확해집니다! 코드를 유지 관리하는 사람은 props를 사용하여 데이터 흐름을 명확하게 만든 것에 만족할 것입니다.</Trans>
2. **Extract components and [pass JSX as `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) to them.** If you pass some data through many layers of intermediate components that don't use that data (and only pass it further down), this often means that you forgot to extract some components along the way. For example, maybe you pass data props like `posts` to visual components that don't use them directly, like `<Layout posts={posts} />`. Instead, make `Layout` take `children` as a prop, and render `<Layout><Posts posts={posts} /></Layout>`. This reduces the number of layers between the component specifying the data and the one that needs it.
<Trans>컴포넌트를 추출하고 [JSX를 `children`](/learn/passing-props-to-a-component#passing-jsx-as-children)으로 전달하세요. 일부 데이터를 해당 데이터를 사용하지 않는 중간 컴포넌트의 여러 레이어를 거쳐 전달한다면(그리고 더 아래로만 전달한다면), 이는 종종 그 과정에서 일부 컴포넌트를 추출하는 것을 잊었다는 것을 의미합니다. 예를 들어, `posts`과 같은 데이터 props를 직접 사용하지 않는 시각적 컴포넌트에 `<Layout posts={posts} />` 와 같은 방법 대신, Layout이 children을 prop으로 사용하도록 만들고 `<Layout><Posts posts={posts} /></Layout>`를 렌더링합니다. 이렇게 하면 데이터를 지정하는 컴포넌트와 데이터를 필요로 하는 컴포넌트 사이의 레이어 수가 줄어듭니다.</Trans>

If neither of these approaches works well for you, consider context.
<Trans>이 두 가지 접근 방식이 모두 적합하지 않은 경우 context를 고려하세요.</Trans>

## Use cases for context<Trans>context 사용 사례</Trans> {/*use-cases-for-context*/}

* **Theming:** If your app lets the user change its appearance (e.g. dark mode), you can put a context provider at the top of your app, and use that context in components that need to adjust their visual look.
<Trans>**테마:** 앱에서 사용자가 앱의 모양을 변경할 수 있는 경우(예: 다크 모드), 앱 상단에 context provider를 배치하고 시각적 모양을 조정해야 하는 컴포넌트에서 해당 context를 사용할 수 있습니다.</Trans>
* **Current account:** Many components might need to know the currently logged in user. Putting it in context makes it convenient to read it anywhere in the tree. Some apps also let you operate multiple accounts at the same time (e.g. to leave a comment as a different user). In those cases, it can be convenient to wrap a part of the UI into a nested provider with a different current account value.
<Trans>**현재 계정:** 많은 컴포넌트에서 현재 로그인한 사용자를 알아야 할 수 있습니다. 이 정보를 context에 넣으면 트리의 어느 곳에서나 편리하게 읽을 수 있습니다. 또한 일부 앱에서는 여러 계정을 동시에 조작할 수 있습니다(예: 다른 사용자로 댓글을 남기는 경우). 이러한 경우 UI의 일부를 다른 현재 계정 값으로 중첩된 provider로 감싸는 것이 편리할 수 있습니다.</Trans>
* **Routing:** Most routing solutions use context internally to hold the current route. This is how every link "knows" whether it's active or not. If you build your own router, you might want to do it too.
<Trans>**라우팅:** 대부분의 라우팅 솔루션은 내부적으로 context를 사용하여 현재 경로를 유지합니다. 이것이 모든 링크가 활성 상태인지 아닌지를 "아는" 방식입니다. 자체 라우터를 구축하는 경우에도 이러한 방식을 사용할 수 있습니다.</Trans>
* **Managing state:** As your app grows, you might end up with a lot of state closer to the top of your app. Many distant components below may want to change it. It is common to [use a reducer together with context](/learn/scaling-up-with-reducer-and-context) to manage complex state and pass it down to distant components without too much hassle.
<Trans>**state 관리**: 앱이 성장함에 따라 앱 상단에 많은 state가 가까워질 수 있습니다. 아래에 있는 많은 멀리 떨어진 컴포넌트에서 이를 변경하고 싶을 수 있습니다. [context와 함께 reducer를 사용](/learn/scaling-up-with-reducer-and-context)하여 복잡한 state를 관리하고 번거로움 없이 멀리 떨어진 컴포넌트에 전달하는 것이 일반적입니다.</Trans>
  
Context is not limited to static values. If you pass a different value on the next render, React will update all the components reading it below! This is why context is often used in combination with state.
<Trans>Context는 정적 값에만 국한되지 않습니다. 다음 렌더링에서 다른 값을 전달하면 React는 아래에서 이를 읽는 모든 컴포넌트를 업데이트합니다! 이것이 context가 state와 함께 자주 사용되는 이유입니다.</Trans>

In general, if some information is needed by distant components in different parts of the tree, it's a good indication that context will help you.
<Trans>일반적으로 트리의 다른 부분에 있는 멀리 떨어진 컴포넌트에서 일부 정보가 필요한 경우 context가 도움이 될 수 있다는 좋은 신호입니다.</Trans>

<Recap>
* Context lets a component provide some information to the entire tree below it.
* To pass context:
  1. Create and export it with `export const MyContext = createContext(defaultValue)`.
  2. Pass it to the `useContext(MyContext)` Hook to read it in any child component, no matter how deep.
  3. Wrap children into `<MyContext.Provider value={...}>` to provide it from a parent.
* Context passes through any components in the middle.
* Context lets you write components that "adapt to their surroundings".
* Before you use context, try passing props or passing JSX as `children`.

<TransBlock>
* Context는 컴포넌트가 그 아래 전체 트리에 일부 정보를 제공할 수 있도록 합니다.
* context를 전달하려면:
  1. `export const MyContext = createContext(defaultValue)`를 사용하여 context를 생성하고 내보냅니다.
  2. `useContext(MyContext)` 훅에 전달하여 깊이에 상관없이 모든 하위 컴포넌트에서 읽을 수 있도록 합니다.
  3. 자식 컴포넌트를 `<MyContext.Provider value={...}>`로 감싸서 부모로부터 제공받습니다.
* Context는 중간에 있는 모든 컴포넌트를 통과합니다.
* Context를 사용하면 "주변 환경에 적응"하는 컴포넌트를 작성할 수 있습니다.
* context를 사용하기 전에 props를 전달하거나 JSX를 `children`으로 전달해 보세요.
</TransBlock>
</Recap>

<Challenges>

#### Replace prop drilling with context<Trans>context로 prop drilling 바꾸기</Trans> {/*replace-prop-drilling-with-context*/}

In this example, toggling the checkbox changes the `imageSize` prop passed to each `<PlaceImage>`. The checkbox state is held in the top-level `App` component, but each `<PlaceImage>` needs to be aware of it.
<Trans>이 예제에서 체크박스를 토글하면 각 `<PlaceImage>`에 전달된 `imageSize` prop이 변경됩니다. 체크박스 state는 최상위 App 컴포넌트에 유지되지만, 각 `<PlaceImage>`는 이를 인식해야 합니다.</Trans>

Currently, `App` passes `imageSize` to `List`, which passes it to each `Place`, which passes it to the `PlaceImage`. Remove the `imageSize` prop, and instead pass it from the `App` component directly to `PlaceImage`.
<Trans>현재 `App`은 `imageSize`를 `List`에 전달하고, `List`는 이를 각 `Place`에 전달하며, 각 `Place`는 이를 `PlaceImage`에 전달합니다. `imageSize` prop을 제거하고 대신 App 컴포넌트에서 `PlaceImage`로 직접 전달하도록 변경해보세요.</Trans>

You can declare context in `Context.js`.
<Trans>context는 `Context.js`에서 선언할 수 있습니다.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js Context.js

```

```js data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people."',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repells mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
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
```

</Sandpack>

<Solution>

Remove `imageSize` prop from all the components.
<Trans>모든 컴포넌트에서 `imageSize` props을 제거합니다.</Trans>

Create and export `ImageSizeContext` from `Context.js`. Then wrap the List into `<ImageSizeContext.Provider value={imageSize}>` to pass the value down, and `useContext(ImageSizeContext)` to read it in the `PlaceImage`:
<Trans>`Context.js`에서 `ImageSizeContext`를 생성하고 내보냅니다. 그런 다음 List 컴포넌트를 `<ImageSizeContext.Provider value={imageSize}>`로 감싸서 값을 전달하고 `useContext(ImageSizeContext)`를 `PlaceImage`에서 읽어오도록 합니다:</Trans>

<Sandpack>

```js App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext.Provider
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext.Provider>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js data.js
export const places = [{
  id: 0,
  name: 'Bo-Kaap in Cape Town, South Africa',
  description: 'The tradition of choosing bright colors for houses began in the late 20th century.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Rainbow Village in Taichung, Taiwan',
  description: 'To save the houses from demolition, Huang Yung-Fu, a local resident, painted all 1,200 of them in 1924.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Macromural de Pachuca, Mexico',
  description: 'One of the largest murals in the world covering homes in a hillside neighborhood.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Selarón Staircase in Rio de Janeiro, Brazil',
  description: 'This landmark was created by Jorge Selarón, a Chilean-born artist, as a "tribute to the Brazilian people".',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, Italy',
  description: 'The houses are painted following a specific color system dating back to 16th century.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Marocco',
  description: 'There are a few theories on why the houses are painted blue, including that the color repells mosquitos or that it symbolizes sky and heaven.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Gamcheon Culture Village in Busan, South Korea',
  description: 'In 2009, the village was converted into a cultural hub by painting the houses and featuring exhibitions and art installations.',
  imageId: 'ZfQOOzf'
}];
```

```js utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
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
```

</Sandpack>

Note how components in the middle don't need to pass `imageSize` anymore.
<Trans>중간에 있는 컴포넌트에는 더이상 `imageSize`를 전달할 필요가 없다는점에 유의하세요.</Trans>

</Solution>

</Challenges>