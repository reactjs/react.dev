---
title: PureComponent
translators: [서민택]
---

<Pitfall>

We recommend defining components as functions instead of classes. [See how to migrate.](#alternatives)
<Trans>컴포넌트를 클래스 대신 함수로 정의하는 것이 좋습니다. [마이그레이션 방법을 확인하세요.](#alternatives)</Trans>

</Pitfall>

<Intro>

`PureComponent` is similar to [`Component`](/reference/react/Component) but it skips re-renders for same props and state. Class components are still supported by React, but we don't recommend using them in new code.
<Trans>`PureComponent`는 [`컴포넌트`](/reference/react/Component)와 비슷하지만 동일한 props 및 state에 대해 리렌더링을 건너뜁니다. React는 여전히 클래스 컴포넌트를 지원하고는 있지만, 새로운 코드에서 사용하는 것은 권장하지 않습니다.</Trans>

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `PureComponent` {/*purecomponent*/}

To skip re-rendering a class component for same props and state, extend `PureComponent` instead of [`Component`:](/reference/react/Component)
<Trans>동일한 props 및 state에 대한 클래스 컴포넌트 리렌더링을 건너뛰려면 [`Component`](/reference/react/Component) 대신 `PureComponent`를 extend 하세요.</Trans>

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent` is a subclass of `Component` and supports [all the `Component` APIs.](/reference/react/Component#reference) Extending `PureComponent` is equivalent to defining a custom [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) method that shallowly compares props and state.
<Trans>`PureComponent`는 `Component`의 서브 클래스로서, [모든 `Component` API들](/reference/react/Component#reference)을 지원합니다. `PureComponent`를 extend하는 것은 props 및 state를 얕게 비교(shallow compare)하는 사용자 정의 [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) 메서드를 정의하는 것과 동일합니다.</Trans>

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Skipping unnecessary re-renders for class components <Trans>클래스 컴포넌트에 대한 불필요한 리렌더링 건너뛰기</Trans> {/*skipping-unnecessary-re-renders-for-class-components*/}

React normally re-renders a component whenever its parent re-renders. As an optimization, you can create a component that React will not re-render when its parent re-renders so long as its new props and state are the same as the old props and state. [Class components](/reference/react/Component) can opt into this behavior by extending `PureComponent`:
<Trans>React는 일반적으로 부모가 리렌더링할 때마다 컴포넌트를 리렌더링합니다. 최적화를 위해, 새로운 props 및 state가 이전 props 및 state와 동일하다면 부모가 리렌더링하더라도 자식은 리렌더링하지 않는 컴포넌트를 만들 수 있습니다. [클래스 컴포넌트](/reference/react/Component)는 `PureComponent`를 extend하여 이 동작을 선택할 수 있습니다:</Trans>

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

A React component should always have [pure rendering logic.](/learn/keeping-components-pure) This means that it must return the same output if its props, state, and context haven't changed. By using `PureComponent`, you are telling React that your component complies with this requirement, so React doesn't need to re-render as long as its props and state haven't changed. However, your component will still re-render if a context that it's using changes.
<Trans>React 컴포넌트는 항상 [순수한 렌더링 로직](/learn/keeping-components-pure)을 가져야 합니다. 즉, props, state 및 context가 변경되지 않은 경우 동일한 출력을 반환해야 합니다. `PureComponent`를 사용하면 React에 컴포넌트가 이러한 요구사항을 준수한다고 알리는 것이므로, React는 props 및 state가 변경되지 않는 한 해당 컴포넌트를 리렌더링할 필요가 없습니다. 하지만 컴포넌트가 사용 중인 context가 변경되면 컴포넌트는 여전히 리렌더링 됩니다.</Trans>

In this example, notice that the `Greeting` component re-renders whenever `name` is changed (because that's one of its props), but not when `address` is changed (because it's not passed to `Greeting` as a prop):
<Trans>다음 예제에서는 `name`이 변경될 때마다 `Greeting` 컴포넌트가 리렌더링되지만, `address`가 변경될 때에는 (`Greeting`에 props로 전달되지 않기 때문에) 렌더링되지 않는 것을 알 수 있습니다:</Trans>

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

We recommend defining components as functions instead of classes. [See how to migrate.](#alternatives)
<Trans>컴포넌트를 클래스 대신 함수로 정의하는 것을 권장합니다. [마이그레이션 방법을 참조하세요.](#alternatives)</Trans>

</Pitfall>

---

## Alternatives<Trans>대안</Trans> {/*alternatives*/}

### Migrating from a `PureComponent` class component to a function<Trans>`PureComponent` 클래스 컴포넌트에서 함수로 마이그레이션하기 </Trans> {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

We recommend using function components instead of [class components](/reference/react/Component) in new code. If you have some existing class components using `PureComponent`, here is how you can convert them. This is the original code:
<Trans>새 코드에서는 [클래스 컴포넌트](/reference/react/Component) 대신 함수 컴포넌트를 사용하는 것을 권장합니다. 기존 클래스 컴포넌트가 `PureComponent`를 사용하는 경우 변환하는 방법은 다음과 같습니다. 다음은 원본 코드입니다:</Trans>

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

When you [convert this component from a class to a function,](/reference/react/Component#alternatives) wrap it in [`memo`:](/reference/react/memo)
<Trans>[이 컴포넌트를 클래스에서 함수로 변환](/reference/react/Component#alternatives)하려면 [`memo`](/reference/react/memo)로 감싸세요:</Trans>

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

Unlike `PureComponent`, [`memo`](/reference/react/memo) does not compare the new and the old state. In function components, calling the [`set` function](/reference/react/useState#setstate) with the same state [already prevents re-renders by default,](/reference/react/memo#updating-a-memoized-component-using-state) even without `memo`.
<Trans>`PureComponent`와 달리 [`memo`](/reference/react/memo)는 새 state와 이전 state를 비교하지 않습니다. 함수 컴포넌트에서 동일한 state로 [`set` 함수](/reference/react/useState#setstate)를 호출하면 `memo`가 없어도 [기본적으로 리렌더링이 방지](/reference/react/memo#updating-a-memoized-component-using-state)됩니다.</Trans>

</Note>
