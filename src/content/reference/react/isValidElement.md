---
title: isValidElement
translators: [서민택]
---

<Intro>

`isValidElement` checks whether a value is a React element.<Trans>`isValidElement`는 값이 React 엘리먼트인지 확인합니다.</Trans>

```js
const isElement = isValidElement(value)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `isValidElement(value)` {/*isvalidelement*/}

Call `isValidElement(value)` to check whether `value` is a React element.
<Trans>`isValidElement(value)`를 호출하여 `value`가 React 엘리먼트인지 확인합니다.</Trans>

```js
import { isValidElement, createElement } from 'react';

// ✅ React elements
console.log(isValidElement(<p />)); // true
console.log(isValidElement(createElement('p'))); // true

// ❌ Not React elements
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `value`: The `value` you want to check. It can be any a value of any type.
<Trans>`value`: 확인하려는 `value`입니다. 모든 유형의 값이 될 수 있습니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`isValidElement` returns `true` if the `value` is a React element. Otherwise, it returns `false`.
<Trans>`isValidElement`는 `value`가 React 엘리먼트인 경우 `true`를 반환합니다. 그렇지 않으면 `false`를 반환합니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* **Only [JSX tags](/learn/writing-markup-with-jsx) and objects returned by [`createElement`](/reference/react/createElement) are considered to be React elements.** For example, even though a number like `42` is a valid React *node* (and can be returned from a component), it is not a valid React element. Arrays and portals created with [`createPortal`](/reference/react-dom/createPortal) are also *not* considered to be React elements.
<Trans>**[JSX 태그](https://react.dev/learn/writing-markup-with-jsx) 및 [`createElement`](https://react.dev/reference/react/createElement)로부터 반환된 객체만이 React 엘리먼트로 간주됩니다.** 예를 들어 `42`와 같은 숫자는 유효한 React 노드이지만(또한 컴포넌트로부터 반환될 수도 있지만) 유효한 React 엘리먼트는 아닙니다. [`createPortal`](https://react.dev/reference/react-dom/createPortal)로 생성된 배열과 포털 역시 React 엘리먼트로 간주되지 않습니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Checking if something is a React element<Trans>**React 엘리먼트인지 확인하기**</Trans> {/*checking-if-something-is-a-react-element*/}

Call `isValidElement` to check if some value is a *React element.*
<Trans>어떤 값이 *React* 엘리먼트인지 확인하려면 `isValidElement`를 호출하세요.</Trans>

React elements are:
<Trans>React 엘리먼트는 다음과 같습니다:</Trans>

- Values produced by writing a [JSX tag](/learn/writing-markup-with-jsx)
- Values produced by calling [`createElement`](/reference/react/createElement)

<TransBlock>
- [JSX 태그](https://react.dev/learn/writing-markup-with-jsx)로 생성한 값
- [`createElement`](https://react.dev/reference/react/createElement)를 호출하여 생성한 값
</TransBlock>

For React elements, `isValidElement` returns `true`:
<Trans>React 엘리먼트의 경우 `isValidElement`는 `true`를 반환합니다:</Trans>

```js
import { isValidElement, createElement } from 'react';

// ✅ JSX tags are React elements
// ✅ JSX 태그는 React 엘리먼트입니다.
console.log(isValidElement(<p />)); // true
console.log(isValidElement(<MyComponent />)); // true

// ✅ Values returned by createElement are React elements
// ✅ createElement로부터 반환된 값은 React 엘리먼트입니다.
console.log(isValidElement(createElement('p'))); // true
console.log(isValidElement(createElement(MyComponent))); // true
```

Any other values, such as strings, numbers, or arbitrary objects and arrays, are not React elements.
<Trans>다른 값들, 예컨대 문자열, 숫자, 임의의 객체나 배열 등은 React 엘리먼트가 아닙니다.</Trans>

For them, `isValidElement` returns `false`:
<Trans>이들에 대해 `isValidElement`는 `false`를 반환합니다:</Trans>

```js
// ❌ These are *not* React elements
console.log(isValidElement(null)); // false
console.log(isValidElement(25)); // false
console.log(isValidElement('Hello')); // false
console.log(isValidElement({ age: 42 })); // false
console.log(isValidElement([<div />, <div />])); // false
console.log(isValidElement(MyComponent)); // false
```

It is very uncommon to need `isValidElement`. It's mostly useful if you're calling another API that *only* accepts elements (like [`cloneElement`](/reference/react/cloneElement) does) and you want to avoid an error when your argument is not a React element.
<Trans>`isValidElement`가 필요한 경우는 매우 드뭅니다. 주로 *오직* ([`cloneElement`](https://react.dev/reference/react/cloneElement)가 그런 것처럼) 엘리먼트만 허용하는 별도의 API에, React 엘리먼트가 아닌 다른 인수로 호출하면 발생하는 오류를 피하고자 할 때 유용합니다.</Trans>

Unless you have some very specific reason to add an `isValidElement` check, you probably don't need it.
<Trans>`isValidElement` 확인을 추가해야 할 특별한 이유가 없는 한, 이는 필요하지 않을 것입니다.</Trans>

<DeepDive>

#### React elements vs React nodes<Trans>React 엘리먼트 vs React 노드</Trans> {/*react-elements-vs-react-nodes*/}

When you write a component, you can return any kind of *React node* from it:
<Trans>컴포넌트를 작성할 때, 컴포넌트에서 모든 종류의 *React 노드*를 반환할 수 있습니다:</Trans>

```js
function MyComponent() {
  // ... you can return any React node ...
}
```

A React node can be:
<Trans>React 노드는 다음과 같습니다:</Trans>

- A React element created like `<div />` or `createElement('div')`
- A portal created with [`createPortal`](/reference/react-dom/createPortal)
- A string
- A number
- `true`, `false`, `null`, or `undefined` (which are not displayed)
- An array of other React nodes

<TransBlock>
- `<div />` 또는 `createElement('div')`로 생성된 React 엘리먼트
- [`createPortal`](https://react.dev/reference/react-dom/createPortal)로 생성한 포털
- 문자열
- 숫자
- `true`, `false`, `null`, `undefined` (화면에 표시되지 않음)
- 다른 React 노드로 구성된 배열
</TransBlock>

**Note `isValidElement` checks whether the argument is a *React element,* not whether it's a React node.** For example, `42` is not a valid React element. However, it is a perfectly valid React node:
<Trans>**`isValidElement`는 인수가 *React 엘리먼트*인지를 확인할 뿐, React 노드인지 여부를 확인하는 것은 아니라는 점에 주의하세요.** 예를 들어 `42`는 React 엘리먼트는 아니지만, 완전히 유효한 React 노드입니다:</Trans>

```js
function MyComponent() {
  return 42; // It's ok to return a number from component
}
```

This is why you shouldn't use `isValidElement` as a way to check whether something can be rendered.
<Trans>그렇기 때문에 렌더링할 수 있는지 여부를 확인하는 목적으로 `isValidElement`를 사용해서는 안 됩니다.</Trans>

</DeepDive>
