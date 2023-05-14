---
title: Conditional Rendering
translatedTitle: 조건부 렌더링
translators: [안예지, 이나령, 정재남]
---

<iframe 
  style={{aspectRatio: 1.7778, width: '100%'}} 
  src="https://www.youtube.com/embed/playlist?list=PLjQV3hketAJkh6BEl0n4PDS_2fBd0cS9v&index=12"
  title="YouTube video player" 
  frameBorder="0" 
/>

<Intro>

Your components will often need to display different things depending on different conditions. In React, you can conditionally render JSX using JavaScript syntax like `if` statements, `&&`, and `? :` operators.
<Trans>컴포넌트는 서로 다른 조건에 따라 다른 것을 보여줘야 하는 경우가 자주 발생합니다. React에서는 `if` 문, `&&`, `? :` 연산자 같은 JavaScript 문법을 사용해 조건부로 JSX를 렌더링할 수 있습니다.</Trans>

</Intro>

<YouWillLearn>

* How to return different JSX depending on a condition
* How to conditionally include or exclude a piece of JSX
* Common conditional syntax shortcuts you’ll encounter in React codebases

<TransBlock>
  - 조건에 따라 다른 JSX를 반환하는 방법
  - 일부 JSX를 조건부로 포함하거나 제외하는 방법
  - React 코드베이스에서 흔히 접할 수 있는 조건부 구문 단축 표현
</TransBlock>
</YouWillLearn>

## Conditionally returning JSX<Trans>조건부로 반환하는 JSX</Trans> {/*conditionally-returning-jsx*/}

Let’s say you have a `PackingList` component rendering several `Item`s, which can be marked as packed or not:
<Trans>상품이 포장되었는지 여부를 표시할 수 있는 여러 개의 `Item`을 렌더링하는 `PackingList` 컴포넌트가 있다고 가정해봅시다:</Trans>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
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

Notice that some of the `Item` components have their `isPacked` prop set to `true` instead of `false`. You want to add a checkmark (✔) to packed items if `isPacked={true}`.
<Trans>일부 `Item` 컴포넌트의 `isPacked` prop이 `false`가 아닌 `true`로 설정되어 있는 것을 확인할 수 있습니다. `isPacked={true}`인 경우, 패킹된 아이템에 체크 표시(✔)를 추가하고 싶을 것입니다.</Trans>

You can write this as an [`if`/`else` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) like so:
<Trans>이를 다음과 같이 [`if`/`else` 문](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)으로 작성할 수 있습니다:</Trans>

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

If the `isPacked` prop is `true`, this code **returns a different JSX tree.** With this change, some of the items get a checkmark at the end:
<Trans>`isPacked` prop이 `true`이면 이 코드는 **다른 JSX 트리를 반환**합니다. 이렇게 변경하면 일부 항목의 마지막에 체크 표시가 나타납니다:</Trans>

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
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

Try editing what gets returned in either case, and see how the result changes!
<Trans>두 경우 모두 반환되는 내용을 편집해보고 결과가 어떻게 달라지는지 확인해 보세요!</Trans>

Notice how you're creating branching logic with JavaScript's `if` and `return` statements. In React, control flow (like conditions) is handled by JavaScript.
<Trans>JavaScript의 `if`와 `return` 문으로 분기 로직을 어떻게 생성하는지 주목하세요. React에서 조건과 같은 제어 흐름은 JavaScript로 처리됩니다.</Trans>

### Conditionally returning nothing with `null`<Trans>`null`을 사용해 조건부로 아무것도 반환하지 않기</Trans> {/*conditionally-returning-nothing-with-null*/}

In some situations, you won't want to render anything at all. For example, say you don't want to show packed items at all. A component must return something. In this case, you can return `null`:
<Trans>어떤 상황에서는 아무것도 렌더링하고 싶지 않을 수도 있습니다. 예를 들어 포장된 아이템을 전혀 표시하고 싶지 않다고 가정해 보겠습니다. 컴포넌트는 무언가를 반환해야 합니다. 이 경우 `null`을 반환하면 됩니다:</Trans>

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

If `isPacked` is true, the component will return nothing, `null`. Otherwise, it will return JSX to render.
<Trans>`isPacked`가 참이면 컴포넌트는 아무것도 반환하지 않고 `null`을 반환합니다. 그렇지 않으면 렌더링할 JSX를 반환합니다.</Trans>

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
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

In practice, returning `null` from a component isn't common because it might surprise a developer trying to render it. More often, you would conditionally include or exclude the component in the parent component's JSX. Here's how to do that!
<Trans>실제로 컴포넌트에서 `null`을 반환하는 것은 렌더링하려는 개발자를 놀라게 할 수 있기 때문에 일반적이지 않습니다. 부모 컴포넌트의 JSX에 컴포넌트를 조건부로 포함하거나 제외하는 경우가 더 많습니다. 이를 수행하는 방법은 다음과 같습니다!</Trans>

## Conditionally including JSX <Trans>조건을  포함한 JSX</Trans> {/*conditionally-including-jsx*/}

In the previous example, you controlled which (if any!) JSX tree would be returned by the component. You may already have noticed some duplication in the render output:
<Trans>이전 예제에서는 컴포넌트가 반환할 JSX 트리(있는 경우!)를 제어했습니다. 렌더링 출력에서 이미 일부 중복을 발견했을 수 있습니다:</Trans>

```js
<li className="item">{name} ✔</li>
```

is very similar to
<Trans>이는 아래와 매우 유사합니다.</Trans>

```js
<li className="item">{name}</li>
```

Both of the conditional branches return `<li className="item">...</li>`:
<Trans>두 조건부 브랜치 모두 `<li className="item">...</li>`를 반환합니다:</Trans>

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

While this duplication isn't harmful, it could make your code harder to maintain. What if you want to change the `className`? You'd have to do it in two places in your code! In such a situation, you could conditionally include a little JSX to make your code more [DRY.](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
<Trans>이러한 중복은 해롭지는 않지만 코드를 유지 관리하기 어렵게 만들 수 있습니다. `className`을 변경하려면 어떻게 해야 할까요? 코드의 두 곳에서 변경해야 할 것입니다! 이런 상황에서는 조건부로 약간의 JSX를 포함시켜 코드를 더 [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)하게(덜 반복적이게) 만들 수 있습니다.</Trans>

### Conditional (ternary) operator (`? :`)<Trans>조건(삼항) 연산자(`? :`)</Trans> {/*conditional-ternary-operator--*/}

JavaScript has a compact syntax for writing a conditional expression -- the [conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) or "ternary operator".
<Trans>JavaScript에는 [조건 연산자](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) 또는 "삼항 연산자"라는 조건식 작성을 위한 간결한 구문이 있습니다.</Trans>

Instead of this:
<Trans>아래 대신에:</Trans>

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

You can write this:
<Trans>이렇게 쓸 수 있습니다:</Trans>

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

You can read it as *"if `isPacked` is true, then (`?`) render `name + ' ✔'`, otherwise (`:`) render `name`"*.
<Trans>*"`isPacked`가 참이면 (`?`) `name + ' ✔'`를 렌더링하고, 그렇지 않으면 (`:`) `name`을 렌더링하라”* 라고 읽을 수 있습니다.</Trans>

<DeepDive>

#### Are these two examples fully equivalent?<Trans>이 두 예제는 완전히 동일할까요?</Trans> {/*are-these-two-examples-fully-equivalent*/}

If you're coming from an object-oriented programming background, you might assume that the two examples above are subtly different because one of them may create two different "instances" of `<li>`. But JSX elements aren't "instances" because they don't hold any internal state and aren't real DOM nodes. They're lightweight descriptions, like blueprints. So these two examples, in fact, *are* completely equivalent. [Preserving and Resetting State](/learn/preserving-and-resetting-state) goes into detail about how this works.
<Trans>객체 지향 프로그래밍에 익숙하다면, 위의 두 예제 중 하나가 `<li>`의 서로 다른 두 "인스턴스"를 생성할 수 있기 때문에 미묘하게 다르다고 생각할 수 있습니다. 하지만 JSX 요소는 내부 state를 보유하지 않고 실제 DOM 노드가 아니기 때문에 "인스턴스"가 아닙니다. 이는 청사진과 같은 가벼운 설명입니다. 이 두 예제는 사실 완전히 동등합니다. [state 보존 및 재설정](/learn/preserving-and-resetting-state)에서 작동 방식에 대해 자세히 설명합니다.</Trans>

</DeepDive>

Now let's say you want to wrap the completed item's text into another HTML tag, like `<del>` to strike it out. You can add even more newlines and parentheses so that it's easier to nest more JSX in each of the cases:
<Trans>이제 완성된 항목의 텍스트를 `<del>`과 같은 다른 HTML 태그로 감싸서 줄을 긋고 싶다고 가정해 봅시다. 더 많은 개행과 괄호를 추가하여 각 대소문자를 더 쉽게 중첩할 수 있습니다:</Trans>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
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

This style works well for simple conditions, but use it in moderation. If your components get messy with too much nested conditional markup, consider extracting child components to clean things up. In React, markup is a part of your code, so you can use tools like variables and functions to tidy up complex expressions.
<Trans>이 스타일은 간단한 조건에 적합하지만 적당히 사용하세요. 중첩된 조건 마크업이 너무 많아 컴포넌트가 지저분해지면 자식 컴포넌트를 추출하여 정리하는 것을 고려하세요. React에서 마크업은 코드의 일부이므로 변수나 함수와 같은 도구를 사용해 복잡한 표현식을 정리할 수 있습니다.</Trans>

### Logical AND operator (`&&`)<Trans>논리 AND 연산자(`&&`)</Trans> {/*logical-and-operator-*/}

Another common shortcut you'll encounter is the [JavaScript logical AND (`&&`) operator.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.) Inside React components, it often comes up when you want to render some JSX when the condition is true, **or render nothing otherwise.** With `&&`, you could conditionally render the checkmark only if `isPacked` is `true`:
<Trans>또 다른 일반적인 단축표현으로 [JavaScript AND(`&&`) 논리 연산자](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)가 있습니다. React 컴포넌트 내에서 조건이 참일 때 일부 JSX를 렌더링하거나 **그렇지 않으면 아무것도 렌더링하지 않으려** 할 때 자주 사용됩니다. `&&`를 사용하면 `isPacked`가 `true`일 때만 조건부로 체크 표시를 렌더링할 수 있습니다:</Trans>

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

You can read this as *"if `isPacked`, then (`&&`) render the checkmark, otherwise, render nothing"*.
<Trans>이는 _"만약 `isPacked`이면 (`&&`) 체크 표시를 렌더링하고, 그렇지 않으면 아무것도 렌더링하지 않습니다"_ 로 읽을 수 있습니다.</Trans>

Here it is in action:
<Trans>아래는 실제로 작동하는 모습입니다:</Trans>

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

A [JavaScript && expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) returns the value of its right side (in our case, the checkmark) if the left side (our condition) is `true`. But if the condition is `false`, the whole expression becomes `false`. React considers `false` as a "hole" in the JSX tree, just like `null` or `undefined`, and doesn't render anything in its place.
<Trans>[JavaScript && 표현식](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)은 왼쪽(조건)이 `true`이면 오른쪽(이 경우 체크 표시)의 값을 반환합니다. 하지만 조건이 `false`이면 표현식 전체가 `false`가 됩니다. React는 `false`를 `null`이나 `undefined`와 마찬가지로 JSX 트리상의 "구멍"으로 간주하고, 그 자리에 아무것도 렌더링하지 않습니다.</Trans>

<Pitfall>

**Don't put numbers on the left side of `&&`.**
<Trans>**`&&`의 왼쪽에 숫자를 넣지 마세요.**</Trans>

To test the condition, JavaScript converts the left side to a boolean automatically. However, if the left side is `0`, then the whole expression gets that value (`0`), and React will happily render `0` rather than nothing.
<Trans>조건을 테스트하기 위해, JavaScript는 왼쪽을 자동으로 불리언으로 변환합니다. 그러나 왼쪽이 `0`이면 전체 표현식이 해당 값(`0`)을 가져오고, React는 기꺼이 빈 값 대신 `0`을 렌더링합니다.</Trans>

For example, a common mistake is to write code like `messageCount && <p>New messages</p>`. It's easy to assume that it renders nothing when `messageCount` is `0`, but it really renders the `0` itself!
<Trans>예를 들어 흔히 하는 실수 중 하나는 `messageCount && <p>New messages</p>`와 같은 코드를 작성하는 것입니다. `messageCount`가 `0`일 때 아무것도 렌더링하지 않는다고 생각하기 쉽지만, 실제로는 `0` 자체를 렌더링합니다!</Trans>

To fix it, make the left side a boolean: `messageCount > 0 && <p>New messages</p>`.
<Trans>이 문제를 해결하려면 왼쪽을 불리언으로 만들면 됩니다: `messageCount > 0 && <p>New messages</p>`</Trans>

<Extra>
#### `!!messageCount && <p>New messages</p>`도 됩니다. - @정재남 {/*double-not-operator*/}

어떤 변수 앞의 [NOT 논리 연산자 `!`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT)는 바로 뒤따르는 변수가 `true`로 변환할 수 있는 값인 경우([`truthy`](https://developer.mozilla.org/en-US/docs/Glossary/Truthy))에는 `false`를, `false`로 변환할 수 있는 값인 경우([`falsy`](https://developer.mozilla.org/en-US/docs/Glossary/Falsy))에는 `true`를  반환합니다.

NOT 논리 연산자 `!`를 두 번 연속으로 작성하면(Double NOT `!!`) 이중부정이 되어, `truthy` 값은 `true`를, `falsy` 값은 `false`를 반환합니다.

val         | 판정   | `!val` | `!!val` |   | val               | 판정   | `!val`  | `!!val`
:-:         | :-:    | :-:    | :-:    |:-:| :-:               | :-:    | :-:     | :-:
`0`         | falsy  | true   | false  |   | `0` 이외의 모든 숫자 | truthy | false   | true
빈 문자열`""` | falsy  | true  | false  |    | 비어있지 않은 문자열 | truthy | false   | true
`null`      | falsy  | true   | false  |    | `Symbol()`       | truthy | false   | true
`undefined` | falsy  | true   | false  |    | 모든 참조형        | truthy | false   | true

따라서 숫자형인 `messageCount`가 `0`이 아닌 경우 `!!messageCount`는 `true`가 되어 뒤의 `<p>New messages</p>`를 렌더링하고, 반대로 `0`인 경우에는 `!!messageCount`는 `false`가 되므로 아무것도 렌더링하지 않습니다.

</Extra>

</Pitfall>

### Conditionally assigning JSX to a variable<Trans>변수에 조건부로 JSX 할당하기</Trans> {/*conditionally-assigning-jsx-to-a-variable*/}

When the shortcuts get in the way of writing plain code, try using an `if` statement and a variable. You can reassign variables defined with [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), so start by providing the default content you want to display, the name:
<Trans>단축키가 일반 코드를 작성하는 데 방해가 된다면 `if` 문과 변수를 사용해 보세요. [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)으로 정의된 변수는 재할당할 수 있으므로, 표시할 기본 콘텐츠인 이름을 지정하는 것부터 시작하세요:</Trans>

```js
let itemContent = name;
```

Use an `if` statement to reassign a JSX expression to `itemContent` if `isPacked` is `true`:
<Trans>`if` 문을 사용하여 `isPacked`가 `true`면 JSX 표현식을 `itemContent`에 재할당합니다:</Trans>

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[Curly braces open the "window into JavaScript".](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Embed the variable with curly braces in the returned JSX tree, nesting the previously calculated expression inside of JSX:
<Trans>[중괄호는 "JavaScript로의 창"을 엽니다](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world). 중괄호로 변수를 반환된 JSX 트리에 삽입하여 이전에 계산된 표현식을 JSX 안에 중첩시킵니다:</Trans>

```js
<li className="item">
  {itemContent}
</li>
```

This style is the most verbose, but it's also the most flexible. Here it is in action:
<Trans>이 스타일은 가장 장황하지만 가장 유연하기도 합니다. 실제로 사용해보겠습니다:</Trans>

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
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

Like before, this works not only for text, but for arbitrary JSX too:
<Trans>이전과 마찬가지로 텍스트뿐만 아니라 임의의 JSX에서도 작동합니다:</Trans>

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
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

If you're not familiar with JavaScript, this variety of styles might seem overwhelming at first. However, learning them will help you read and write any JavaScript code -- and not just React components! Pick the one you prefer for a start, and then consult this reference again if you forget how the other ones work.
<Trans>JavaScript에 익숙하지 않다면 처음에는 이 다양한 스타일이 압도적으로 보일 수 있습니다. 하지만 이 스타일들을 익히면 React 컴포넌트뿐 아니라 모든 JavaScript 코드를 읽고 작성하는 데 도움이 됩니다! 우선 선호하는 스타일을 선택한 다음, 다른 스타일이 어떻게 작동하는지 잊어버렸다면 이 레퍼런스를 다시 참조하세요.</Trans>

<Recap>

* In React, you control branching logic with JavaScript.
* You can return a JSX expression conditionally with an `if` statement.
* You can conditionally save some JSX to a variable and then include it inside other JSX by using the curly braces.
* In JSX, `{cond ? <A /> : <B />}` means *"if `cond`, render `<A />`, otherwise `<B />`"*.
* In JSX, `{cond && <A />}` means *"if `cond`, render `<A />`, otherwise nothing"*.
* The shortcuts are common, but you don't have to use them if you prefer plain `if`.

<TransBlock>
  - React에서는 JavaScript로 분기 로직을 제어합니다.
  - `if`문으로 조건부로 JSX 표현식을 반환할 수 있습니다.
  - 중괄호를 사용하여 일부 JSX를 변수에 조건부로 저장한 다음 다른 JSX 안에 포함할 수 있습니다.
  - JSX에서 `{cond ? <A /> : <B />}`는 *“`cond`가 있으면 `<A />`를 렌더링하고, 그렇지 않으면 `<B />`를 렌더링하라”*를 의미합니다.
  - JSX에서 `{cond && <A />}`는 *"`cond`가 있으면 `<A />`를 렌더링하고, 그렇지 않으면 아무것도 렌더링하지 말라"를* 의미합니다.
  - 이 단축용법은 흔히 쓰이지만, 만약 `if`를 선호한다면 굳이 사용하지 않아도 됩니다.
</TransBlock>

</Recap>

<Challenges>

#### Show an icon for incomplete items with `? :`<Trans>`? :`로 미완료 항목 아이콘 표시하기</Trans> {/*show-an-icon-for-incomplete-items-with--*/}

Use the conditional operator (`cond ? a : b`) to render a ❌ if `isPacked` isn’t `true`.
<Trans>조건 연산자(`cond ? a : b`)를 사용하여 `isPacked`가 `true`가 아닌 경우 ❌를 렌더링하세요.</Trans>

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

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
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

</Solution>

#### Show the item importance with `&&`<Trans>`&&`로 항목의 중요도 표시하기</Trans> {/*show-the-item-importance-with-*/}

In this example, each `Item` receives a numerical `importance` prop. Use the `&&` operator to render "_(Importance: X)_" in italics, but only for items that have non-zero importance. Your item list should end up looking like this:
<Trans>이 예제에서 각 `Item`은 숫자형의 `importance` prop을 받습니다. 연산자 `&&`를 사용하여 "*(importance: X)*"를 이탤릭체로 렌더링하되, 중요도가 0이 아닌 항목에 대해서만 렌더링 하세요. 항목 목록은 다음과 같은 모양이 됩니다:</Trans>

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

Don't forget to add a space between the two labels!
<Trans>두 레이블 사이에 공백을 추가하는 것을 잊지 마세요!</Trans>

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

This should do the trick:
<Trans>이 정도면 충분할 것입니다:</Trans>

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Note that you must write `importance > 0 && ...` rather than `importance && ...` so that if the `importance` is `0`, `0` isn't rendered as the result!
<Trans>`importance`가 `0`인 경우 `0`이 결과로 렌더링되지 않도록, `importance && ...`가 아닌 `importance > 0 && ...`를 작성해야 한다는 점에 유의하세요!</Trans>

In this solution, two separate conditions are used to insert a space between the name and the importance label. Alternatively, you could use a fragment with a leading space: `importance > 0 && <> <i>...</i></>` or add a space immediately inside the `<i>`:  `importance > 0 && <i> ...</i>`.
<Trans>이 솔루션에서는 이름과 importance 레이블 사이에 공백을 삽입하기 위해 별개의 두 조건을 사용합니다. 또는 선행 공백이 있는 조각을 사용할 수도 있습니다: `importance > 0 && <><i>...</i></>`도 좋고, 또는 `<i>` 안에 곧바로 공백을 추가할 수도 있습니다: `importance > 0 && <i> ...</i>`.</Trans>

</Solution>

#### Refactor a series of `? :` to `if` and variables<Trans>일련의 `? :` 를 `if` 및 변수로 리팩터링하세요</Trans> {/*refactor-a-series-of---to-if-and-variables*/}

This `Drink` component uses a series of `? :` conditions to show different information depending on whether the `name` prop is `"tea"` or `"coffee"`. The problem is that the information about each drink is spread across multiple conditions. Refactor this code to use a single `if` statement instead of three `? :` conditions.
<Trans>이 `Drink` 컴포넌트는 일련의 `? :` 조건을 사용하여 `name` prop이 `"tea"` 또는 `"coffee"`인지 여부에 따라 다른 정보를 표시합니다. 문제는 각 음료에 대한 정보가 여러 조건에 분산되어 있다는 것입니다. 이 코드를 리팩터링하여 세 개의 `? :` 조건 대신 하나의 `if` 문을 사용하세요.</Trans>

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Once you've refactored the code to use `if`, do you have further ideas on how to simplify it?
<Trans>`if`를 사용하도록 코드를 리팩토링한 후에, 이를 더 단순화할 수 있는 아이디어가 있나요?</Trans>

<Solution>

There are multiple ways you could go about this, but here is one starting point:
<Trans>이 작업을 수행하는 방법은 여러 가지가 있지만, 여기서는 그 중 한 가지 방법을 소개합니다:</Trans>

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Here the information about each drink is grouped together instead of being spread across multiple conditions. This makes it easier to add more drinks in the future.
<Trans>여기에서는 각 음료에 대한 정보가 여러 조건에 분산되어 있지 않고 함께 그룹화되어 있습니다. 이렇게 하면 나중에 더 많은 음료를 추가하기가 더 쉬워집니다.</Trans>

Another solution would be to remove the condition altogether by moving the information into objects:
<Trans>또 다른 해결책은 정보를 객체로 이동하여 조건을 완전히 제거하는 것입니다:</Trans>

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
