---
title: Keeping Components Pure
translatedTitle: 컴포넌트 순수성 유지
translators: [정현수, 정재남, 고석영]
---

<Intro>

Some JavaScript functions are *pure.* Pure functions only perform a calculation and nothing more. By strictly only writing your components as pure functions, you can avoid an entire class of baffling bugs and unpredictable behavior as your codebase grows. To get these benefits, though, there are a few rules you must follow.
<Trans>일부 JavaScript 함수는 *순수*합니다. 순수 함수는 계산만 수행하고 그 이상은 수행하지 않습니다. 컴포넌트를 엄격하게 순수 함수로만 작성하면 코드베이스가 커짐에 따라 당황스러운 버그와 예측할 수 없는 동작을 피할 수 있습니다. 하지만 이러한 이점을 얻으려면 몇 가지 규칙을 준수해야 합니다.</Trans>

</Intro>

<YouWillLearn>

* What purity is and how it helps you avoid bugs
* How to keep components pure by keeping changes out of the render phase
* How to use Strict Mode to find mistakes in your compo
<TransBlock>
  - 순수성이 무엇이고 그것이 버그를 방지하는 데에 어떻게 도움이 되는지
  - 렌더링 단계에서 변경 사항을 제외함으로써 컴포넌트를 순수하게 유지하는 방법
  - 컴포넌트에서 실수를 찾기 위해 StrictMode를 사용하는 방법
</TransBlock>

</YouWillLearn>

## Purity: Components as formulas <Trans>순수성: 수식으로서의 컴포넌트</Trans> {/*purity-components-as-formulas*/}

In computer science (and especially the world of functional programming), [a pure function](https://wikipedia.org/wiki/Pure_function) is a function with the following characteristics:
<Trans>컴퓨터 과학(특히 함수형 프로그래밍의 세계)에서 [순수 함수](https://wikipedia.org/wiki/Pure_function)는 다음과 같은 특징을 가진 함수입니다:</Trans>

* **It minds its own business.** It does not change any objects or variables that existed before it was called.
* **Same inputs, same output.** Given the same inputs, a pure function should always return the same result.
<TransBlock>
- **자신의 일에만 신경씁니다.** 호출되기 전에 존재했던 객체나 변수를 변경하지 않습니다.
- **동일 입력, 동일 출력.** 동일한 입력이 주어지면 항상 동일한 결과를 반환해야 합니다.
</TransBlock>

You might already be familiar with one example of pure functions: formulas in math.
<Trans>순수 함수의 한 가지 예로 수학의 공식을 이미 잘 알고 계실 것입니다.</Trans>

Consider this math formula: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.
<Trans>다음 수학 공식을 생각해 보세요: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.</Trans>

If <Math><MathI>x</MathI> = 2</Math> then <Math><MathI>y</MathI> = 4</Math>. Always. 
<Trans><Math><MathI>x</MathI> = 2</Math>이면 <Math><MathI>y</MathI> = 4</Math>입니다. 항상 그렇습니다.</Trans>

If <Math><MathI>x</MathI> = 3</Math> then <Math><MathI>y</MathI> = 6</Math>. Always. 
<Trans><Math><MathI>x</MathI> = 3</Math>이면 <Math><MathI>y</MathI> = 6</Math>입니다. 항상 그렇습니다.</Trans>

If <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> won't sometimes be <Math>9</Math> or <Math>–1</Math> or <Math>2.5</Math> depending on the time of day or the state of the stock market. 
<Trans><Math><MathI>x</MathI> = 3</Math>이면, <MathI>y</MathI> 는 결코 시간이나 주식 시장 상태에 따라 <Math>9</Math>, <Math>–1</Math>,  <Math>2.5</Math>가 되지 않습니다.</Trans>

If <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> and <Math><MathI>x</MathI> = 3</Math>, <MathI>y</MathI> will _always_ be <Math>6</Math>. 
<Trans><Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>이고 <Math><MathI>x</MathI> = 3</Math>이면 <MathI>y</MathI>는 항상 <Math>6</Math>이 됩니다.</Trans>

If we made this into a JavaScript function, it would look like this:
<Trans>이를 JavaScript 함수로 만들면 다음과 같이 보일 것입니다:</Trans>

```js
function double(number) {
  return 2 * number;
}
```

In the above example, `double` is a **pure function.** If you pass it `3`, it will return `6`. Always.
<Trans>위의 예에서 `double`은 **순수 함수입니다.** `3`을 전달하면 `6`을 반환합니다. 언제나요.</Trans>

React is designed around this concept. **React assumes that every component you write is a pure function.** This means that React components you write must always return the same JSX given the same inputs:
<Trans>React는 이 개념을 중심으로 설계되었습니다. **React는 여러분이 작성하는 모든 컴포넌트가 순수 함수라고 가정합니다.** 즉, 여러분이 작성하는 React 컴포넌트는 동일한 입력이 주어졌을 때 항상 동일한 JSX를 반환해야 합니다:</Trans>

<Sandpack>

```js App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Boil {drinkers} cups of water.</li>
      <li>Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.</li>
      <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Spiced Chai Recipe</h1>
      <h2>For two</h2>
      <Recipe drinkers={2} />
      <h2>For a gathering</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

When you pass `drinkers={2}` to `Recipe`, it will return JSX containing `2 cups of water`. Always. 
<Trans>`drinkers={2}`를 `Recipe`에 전달하면 언제나 `2 cups of water`이 포함된 JSX를 반환합니다.</Trans>

If you pass `drinkers={4}`, it will return JSX containing `4 cups of water`. Always.
<Trans>만약 `drinkers={4}`를 전달하면 항상 `4 cups of water`이 포함된 JSX를 반환합니다.</Trans>

Just like a math formula.
<Trans>수학 공식과 같습니다.</Trans>

You could think of your components as recipes: if you follow them and don't introduce new ingredients during the cooking process, you will get the same dish every time. That "dish" is the JSX that the component serves to React to [render.](/learn/render-and-commit)
<Trans>컴포넌트를 레시피라고 생각할 수 있습니다. 레시피를 따르고 요리 과정에서 새로운 재료를 넣지 않으면 매번 같은 요리를 얻을 수 있습니다. 그 "요리"는 컴포넌트가 [렌더링](/learn/render-and-commit)에 반응하기 위해 제공하는 JSX입니다.</Trans>

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="A tea recipe for x people: take x cups of water, add x spoons of tea and 0.5x spoons of spices, and 0.5x cups of milk" />

## Side Effects: (un)intended consequences <Trans>사이드 이펙트: 의도하지 (않은) 결과</Trans> {/*side-effects-unintended-consequences*/}

React's rendering process must always be pure. Components should only *return* their JSX, and not *change* any objects or variables that existed before rendering—that would make them impure!
<Trans>React의 렌더링 프로세스는 항상 순수해야 합니다. 컴포넌트는 오직 JSX만을 반환해야 하며, 렌더링 전에 존재했던 객체나 변수를 *변경*해서는 안 됩니다. 이는 컴포넌트를 불순하게 만들 수 있습니다!</Trans>

Here is a component that breaks this rule:
<Trans>다음은 이 규칙을 어기는 컴포넌트입니다:</Trans>

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  // 나쁨: 기존 변수를 변경합니다!
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

This component is reading and writing a `guest` variable declared outside of it. This means that **calling this component multiple times will produce different JSX!** And what's more, if _other_ components read `guest`, they will produce different JSX, too, depending on when they were rendered! That's not predictable.
<Trans>이 컴포넌트는 외부에서 선언된 `guest` 변수를 읽고 쓰고 있습니다. 즉 **이 컴포넌트는 호출할 때마다 다른 JSX가 생성된다는 뜻입니다!** 게다가 다른 컴포넌트가 `guest`를 읽으면 렌더링된 시점에 따라 JSX도 다르게 생성됩니다! 예측할 수 없는 일입니다.</Trans>

Going back to our formula <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>, now even if <Math><MathI>x</MathI> = 2</Math>, we cannot trust that <Math><MathI>y</MathI> = 4</Math>. Our tests could fail, our users would be baffled, planes would fall out of the sky—you can see how this would lead to confusing bugs!
<Trans>다시 <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> 공식으로 돌아가보면, 이제 <Math><MathI>x</MathI> = 2</Math>라고 해도 <Math><MathI>y</MathI> = 4</Math>라고 믿을 수 없습니다. 테스트는 실패할 것이고, 사용자는 당황할 것이며, 비행기는 하늘에서 떨어질 수 있습니다. 이것이 어떻게 혼란스러운 버그로 이어지는지 알 수 있을 것입니다!</Trans>

You can fix this component by [passing `guest` as a prop instead](/learn/passing-props-to-a-component):
<Trans>[`guest`를 prop으로 전달](/learn/passing-props-to-a-component)함으로써 이 컴포넌트를 고칠 수 있습니다:</Trans>

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

Now your component is pure, as the JSX it returns only depends on the `guest` prop.
<Trans>이제 컴포넌트가 반환하는 JSX는 `guest` prop에만 의존하므로 순수합니다.</Trans>

In general, you should not expect your components to be rendered in any particular order. It doesn't matter if you call <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> before or after <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>: both formulas will resolve independently of each other. In the same way, each component should only "think for itself", and not attempt to coordinate with or depend upon others during rendering. Rendering is like a school exam: each component should calculate JSX on their own!
<Trans>일반적으로 컴포넌트가 특정 순서로 렌더링될 것이라고 기대해서는 안 됩니다. <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>를 <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math> 앞에 호출하든 뒤에 호출하든 상관없습니다. 두 수식은 서로 독립적으로 해결됩니다. 마찬가지로 각 컴포넌트는 렌더링 중에 다른 컴포넌트와 조율하거나 의존하지 말고 "스스로 생각"하게 해야 합니다. 렌더링은 학교 시험처럼 각 컴포넌트가 스스로 JSX를 계산해야 합니다!</Trans>

<DeepDive>

#### Detecting impure calculations with StrictMode <Trans>StrictMode로 순수하지 않은 계산 감지하기</Trans> {/*detecting-impure-calculations-with-strict-mode*/}

Although you might not have used them all yet, in React there are three kinds of inputs that you can read while rendering: [props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), and [context.](/learn/passing-data-deeply-with-context) You should always treat these inputs as read-only.
<Trans>React에서는 렌더링하는 동안 읽을 수 있는 입력이 세 가지 있습니다: [props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), [context](/learn/passing-data-deeply-with-context). 이러한 입력은 항상 읽기 전용으로 취급해야 합니다.</Trans>

When you want to *change* something in response to user input, you should [set state](/learn/state-a-components-memory) instead of writing to a variable. You should never change preexisting variables or objects while your component is rendering.
<Trans>사용자 입력에 대한 응답으로 무언가를 *변경*하려면 변수에 쓰는 대신 [state](/learn/state-a-components-memory)를 설정해야 합니다. 컴포넌트가 렌더링되는 동안에는 기존 변수나 객체를 절대 변경해서는 안 됩니다.</Trans>

React offers a "Strict Mode" in which it calls each component's function twice during development. **By calling the component functions twice, Strict Mode helps find components that break these rules.**
<Trans>React는 개발 환경에서 각 컴포넌트의 함수를 두 번 호출하는 "Strict Mode"를 제공합니다. Strict Mode는 컴포넌트 함수를 두 번 호출함으로써 이러한 규칙을 위반하는 컴포넌트를 찾아내는 데 도움이 됩니다.</Trans>

Notice how the original example displayed "Guest #2", "Guest #4", and "Guest #6" instead of "Guest #1", "Guest #2", and "Guest #3". The original function was impure, so calling it twice broke it. But the fixed pure version works even if the function is called twice every time. **Pure functions only calculate, so calling them twice won't change anything**--just like calling `double(2)` twice doesn't change what's returned, and solving <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> twice doesn't change what <MathI>y</MathI> is. Same inputs, same outputs. Always.
<Trans>원래 예제에서 "Guest #1", "Guest #2", "Guest #3" 대신 "Guest #2", "Guest #4", "Guest #6"이 어떻게 표시되었는지 보셨을 것입니다. 원래 함수는 불완전했기 때문에 두 번 호출하면 함수가 손상되었습니다. 하지만 수정된 순수한 버전은 함수를 매번 두 번씩 호출해도 잘 동작합니다. **순수 함수는 계산만 하므로 두 번 호출해도 아무 것도 바뀌지 않습니다** - `double(2)`를 두 번 호출해도 반환되는 값이 바뀌지 않고, <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>를 두 번 풀어도 <MathI>y</MathI>가 바뀌지 않는 것처럼 말이죠. 언제나 같은 입력, 같은 출력.</Trans>

Strict Mode has no effect in production, so it won't slow down the app for your users. To opt into Strict Mode, you can wrap your root component into `<React.StrictMode>`. Some frameworks do this by default.
<Trans>Strict Mode는 상용 환경에서는 아무런 영향을 미치지 않으므로 사용자의 앱 속도가 느려지지 않습니다. Strict Mode를 선택하려면 루트 컴포넌트를 `<React.StrictMode>`로 감싸면 됩니다. 일부 프레임워크는 기본적으로 이 작업을 수행합니다.</Trans>

</DeepDive>

### Local mutation: Your component's little secret <Trans>지역 변이: 컴포넌트의 작은 비밀</Trans> {/*local-mutation-your-components-little-secret*/}

In the above example, the problem was that the component changed a *preexisting* variable while rendering. This is often called a **"mutation"** to make it sound a bit scarier. Pure functions don't mutate variables outside of the function's scope or objects that were created before the call—that makes them impure!
<Trans>위의 예시에서는 컴포넌트가 렌더링하는 동안 *기존* 변수를 변경하는 것이 문제였습니다. 이를 좀 더 무섭게 들리게 하기 위해 <strong>"변이"</strong>라고 부르기도 합니다. 순수 함수는 함수의 범위를 벗어난 변수나 호출 전에 생성된 객체를 변이하지 않습니다. 그러면 순수하지 않으니까요!</Trans>

However, **it's completely fine to change variables and objects that you've *just* created while rendering.** In this example, you create an `[]` array, assign it to a `cups` variable, and then `push` a dozen cups into it:
<Trans>하지만 **렌더링하는 동안 '방금' 생성한 변수와 객체를 변경하는 것은 완전히 괜찮습니다**. 이 예제에서는 `[]` 배열을 생성하고 이를 `cups` 변수에 할당한 다음 컵 12개를 그 안에 `push`합니다:</Trans>

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

If the `cups` variable or the `[]` array were created outside the `TeaGathering` function, this would be a huge problem! You would be changing a *preexisting* object by pushing items into that array.
<Trans>`cups` 변수나 `[]` 배열이 `TeaGathering` 함수 외부에서 생성되었다면 이는 큰 문제가 될 것입니다! 해당 배열에 항목을 밀어 넣음으로써 *기존* 객체를 변경하게 될 것이기 때문입니다.</Trans>

However, it's fine because you've created them *during the same render*, inside `TeaGathering`. No code outside of `TeaGathering` will ever know that this happened. This is called **"local mutation"**—it's like your component's little secret.
<Trans>하지만 `TeaGathering` 내부에서 동일한 렌더링 중에 생성했기 때문에 괜찮습니다. `TeaGathering` 외부의 어떤 코드도 이런 일이 일어났다는 것을 알 수 없습니다. 이를 <strong>"지역 변이"</strong>라고 하며, 컴포넌트의 작은 비밀과 같습니다.</Trans>

## Where you _can_ cause side effects <Trans>사이드 이펙트를 일으킬 수 있는 곳</Trans> {/*where-you-_can_-cause-side-effects*/}

While functional programming relies heavily on purity, at some point, somewhere, _something_ has to change. That's kind of the point of programming! These changes—updating the screen, starting an animation, changing the data—are called **side effects.** They're things that happen _"on the side"_, not during rendering.
<Trans>함수형 프로그래밍은 순수성에 크게 의존하지만, 언젠가는 어딘가에서 *무언가*는 바뀌어야 합니다. 이것이 바로 프로그래밍의 핵심입니다! 화면 업데이트, 애니메이션 시작, 데이터 변경과 같은 이러한 변경을 **사이드 이펙트**라고 하며, 렌더링 중에 일어나는 것이 아니라 *"부수적으로"* 일어나는 일입니다.</Trans>

In React, **side effects usually belong inside [event handlers.](/learn/responding-to-events)** Event handlers are functions that React runs when you perform some action—for example, when you click a button. Even though event handlers are defined *inside* your component, they don't run *during* rendering! **So event handlers don't need to be pure.**
<Trans>React에서 **사이드 이펙트는 보통 [이벤트 핸들러](/learn/responding-to-events)에 속합니다**. 이벤트 핸들러는 사용자가 어떤 동작을 수행할 때(예를 들어 버튼을 클릭할 때) React가 실행하는 함수입니다. 이벤트 핸들러가 컴포넌트 *내부에* 정의되어 있긴 하지만 렌더링 중에는 실행되지 않습니다! **따라서 이벤트 핸들러는 순수할 필요가 없습니다.**</Trans>

If you've exhausted all other options and can't find the right event handler for your side effect, you can still attach it to your returned JSX with a [`useEffect`](/reference/react/useEffect) call in your component. This tells React to execute it later, after rendering, when side effects are allowed. **However, this approach should be your last resort.**
<Trans>다른 모든 옵션을 다 사용했는데도 사이드 이펙트에 적합한 이벤트 핸들러를 찾을 수 없다면, 컴포넌트에서 [`useEffect`](/reference/react/useEffect) 호출을 통해 반환된 JSX에 이벤트 핸들러를 첨부할 수 있습니다. 이렇게 하면 나중에 렌더링 후 사이드 이펙트가 허용될 때 React가 이를 실행하도록 지시합니다. **하지만 이 방법은 최후의 수단으로 사용해야 합니다.**</Trans>

When possible, try to express your logic with rendering alone. You'll be surprised how far this can take you!
<Trans>가능하면 렌더링만으로 로직을 표현하고자 노력해 보세요. 이렇게 하면 얼마나 많은 것을 얻을 수 있는지 놀라실 겁니다!</Trans>

<DeepDive>

#### Why does React care about purity? <Trans>왜 React는 순수성을 중요시할까요?</Trans> {/*why-does-react-care-about-purity*/}

Writing pure functions takes some habit and discipline. But it also unlocks marvelous opportunities:
<Trans>순수 함수를 작성하려면 약간의 습관과 훈련이 필요합니다. 그러나 그것은 또한 놀라운 기회를 열어줍니다:</Trans>

* Your components could run in a different environment—for example, on the server! Since they return the same result for the same inputs, one component can serve many user requests.
<Trans>컴포넌트를 다른 환경(예: 서버)에서 실행할 수 있습니다! 동일한 입력에 대해 동일한 결과를 반환하기 때문에 하나의 컴포넌트가 많은 사용자 요청을 처리할 수 있습니다.</Trans>

* You can improve performance by [skipping rendering](/reference/react/memo) components whose inputs have not changed. This is safe because pure functions always return the same results, so they are safe to cache.
<Trans>입력이 변경되지 않은 컴포넌트는 [렌더링 건너뛰기](/reference/react/memo)를 통해 성능을 향상시킬 수 있습니다. 순수 함수는 항상 동일한 결과를 반환하므로 캐싱해도 안전합니다.</Trans>

* If some data changes in the middle of rendering a deep component tree, React can restart rendering without wasting time to finish the outdated render. Purity makes it safe to stop calculating at any time.
<Trans>깊은 컴포넌트 트리를 렌더링하는 도중에 일부 데이터가 변경되면 React는 오래된 렌더링을 완료하기 위해 시간을 낭비하지 않고 렌더링을 다시 시작할 수 있습니다. 순수성 덕분에 언제든지 계산을 중단해도 안전합니다.</Trans>

Every new React feature we're building takes advantage of purity. From data fetching to animations to performance, keeping components pure unlocks the power of the React paradigm.
<Trans>우리가 구축하는 모든 새로운 React 기능은 순수성의 이점을 활용합니다. 데이터 불러오기부터 애니메이션, 성능에 이르기까지, 컴포넌트를 순수하게 유지하면 React 패러다임의 힘을 발휘할 수 있습니다.</Trans>

</DeepDive>

<Recap>

* A component must be pure, meaning:
  * **It minds its own business.** It should not change any objects or variables that existed before rendering.
  * **Same inputs, same output.** Given the same inputs, a component should always return the same JSX. 
* Rendering can happen at any time, so components should not depend on each others' rendering sequence.
* You should not mutate any of the inputs that your components use for rendering. That includes props, state, and context. To update the screen, ["set" state](/learn/state-a-components-memory) instead of mutating preexisting objects.
* Strive to express your component's logic in the JSX you return. When you need to "change things", you'll usually want to do it in an event handler. As a last resort, you can `useEffect`.
* Writing pure functions takes a bit of practice, but it unlocks the power of React's paradigm.
<TransBlock>
- 컴포넌트는 순수해야 합니다:
    - **자신의 일에만 신경씁니다.** 렌더링 전에 존재했던 객체나 변수를 변경하지 않아야 합니다.
    - **동일한 입력, 동일한 출력.** 동일한 입력이 주어지면 컴포넌트는 항상 동일한 JSX를 반환해야 합니다.
- 렌더링은 언제든지 발생할 수 있으므로, 컴포넌트는 서로의 렌더링 순서에 의존해서는 안 됩니다.
- 컴포넌트가 렌더링에 사용하는 어떠한 입력값도 변이해서는 안 됩니다. 여기에는 props, state 및 context가 포함됩니다. 화면을 업데이트하려면 기존 객체를 변이하는 대신 ["set" state](/learn/state-a-components-memory)를 사용하세요.
- 컴포넌트의 로직을 반환하는 JSX 안에 표현하기 위해 노력하세요. "무언가를 변경"해야 할 때는 보통 이벤트 핸들러에서 이 작업을 수행하고자 할 것입니다. 최후의 수단으로 `useEffect`를 사용할 수도 있습니다.
- 순수 함수를 작성하는 데는 약간의 연습이 필요하지만, React 패러다임의 힘을 발휘할 수 있습니다.
</TransBlock>

</Recap>


  
<Challenges>

#### Fix a broken clock <Trans>고장난 시계 고치기</Trans> {/*fix-a-broken-clock*/}

This component tries to set the `<h1>`'s CSS class to `"night"` during the time from midnight to six hours in the morning, and `"day"` at all other times. However, it doesn't work. Can you fix this component?
<Trans>이 컴포넌트는 `<h1>`의 CSS 클래스를 자정부터 아침 6시간까지는 `"night"`로, 그 외 시간에는 `"day"`로 설정하고자 합니다. 하지만 작동하지 않습니다. 이 컴포넌트를 고칠 수 있나요?</Trans>

You can verify whether your solution works by temporarily changing the computer's timezone. When the current time is between midnight and six in the morning, the clock should have inverted colors!
<Trans>컴퓨터의 시간대를 일시적으로 변경하여 솔루션이 작동하는지 확인할 수 있습니다. 현재 시간이 자정에서 아침 6시 사이인 경우 시계의 색상이 반전되어야 합니다!</Trans>

<Hint>

Rendering is a *calculation*, it shouldn't try to "do" things. Can you express the same idea differently?
<Trans>렌더링은 *계산*을 하는 것이지, 무언가를 "해내려고" 해서는 안 됩니다. 같은 아이디어를 다르게 표현할 수 있나요?</Trans>

</Hint>

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

You can fix this component by calculating the `className` and including it in the render output:
<Trans>`className`을 계산하여 렌더링 출력에 포함시켜 이 컴포넌트를 수정할 수 있습니다:</Trans>

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

In this example, the side effect (modifying the DOM) was not necessary at all. You only needed to return JSX.
<Trans>이 예제에서는 사이드 이펙트(DOM 수정)가 전혀 필요하지 않았습니다. JSX를 반환하기만 하면 됩니다.</Trans>

</Solution>

#### Fix a broken profile <Trans>깨진 프로필을 고치세요</Trans> {/*fix-a-broken-profile*/}

Two `Profile` components are rendered side by side with different data. Press "Collapse" on the first profile, and then "Expand" it. You'll notice that both profiles now show the same person. This is a bug.
<Trans>두 개의 `Profile` 컴포넌트가 서로 다른 데이터로 나란히 렌더링됩니다. 첫 번째 프로필에서 'Collapse(접기)'를 누른 다음 'Expand(펼치기)'를 누릅니다. 이제 두 프로필에 모두 같은 사람이 표시되는 것을 확인할 수 있습니다. 이것은 버그입니다.</Trans>

Find the cause of the bug and fix it.
<Trans>버그의 원인을 찾아서 수정하세요.</Trans>

<Hint>

The buggy code is in `Profile.js`. Make sure you read it all from top to bottom!
<Trans>버그 코드는 `Profile.js`에 있습니다. 처음부터 끝까지 모두 읽어보세요!</Trans>

</Hint>

<Sandpack>

```js Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js utils.js hidden
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
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

The problem is that the `Profile` component writes to a preexisting variable called `currentPerson`, and the `Header` and `Avatar` components read from it. This makes *all three of them* impure and difficult to predict.
<Trans>문제는 `Profile` 컴포넌트가 `currentPerson`이라는 기존 변수에 쓰고, `Header` 및 `Avatar` 컴포넌트가 이 변수에서 읽는다는 점입니다. 이로 인해 *세 가지 모두* 순수하지 않고 예측하기 어렵습니다.</Trans>


To fix the bug, remove the `currentPerson` variable. Instead, pass all information from `Profile` to `Header` and `Avatar` via props. You'll need to add a `person` prop to both components and pass it all the way down.
<Trans>이 버그를 수정하려면 `currentPerson` 변수를 제거하세요. 대신 `Profile`의 모든 정보를 props를 통해 `Header`와 `Avatar`로 전달하세요. 두 컴포넌트 모두에 `person` prop을 추가하고 끝까지 전달해야 합니다.</Trans>

<Sandpack>

```js Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js utils.js hidden
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
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

Remember that React does not guarantee that component functions will execute in any particular order, so you can't communicate between them by setting variables. All communication must happen through props.
<Trans>React는 컴포넌트 함수가 특정 순서로 실행된다는 것을 보장하지 않으므로 변수를 설정하여 컴포넌트 간에 통신할 수 없다는 점을 기억하세요. 모든 통신은 props를 통해 이루어져야 합니다.</Trans>

</Solution>

#### Fix a broken story tray <Trans>깨진 스토리 트레이를 고치세요</Trans> {/*fix-a-broken-story-tray*/}

The CEO of your company is asking you to add "stories" to your online clock app, and you can't say no. You've written a `StoryTray` component that accepts a list of `stories`, followed by a "Create Story" placeholder.
<Trans>회사 CEO가 온라인 시계 앱에 '스토리'를 추가해 달라고 요청하는데 거절할 수 없습니다. `stories` 목록을 받아들이는 `StoryTray` 컴포넌트를 작성했고, 그 뒤에 "Create Story" 플레이스홀더를 추가했습니다.</Trans>

You implemented the "Create Story" placeholder by pushing one more fake story at the end of the `stories` array that you receive as a prop. But for some reason, "Create Story" appears more than once. Fix the issue.
<Trans>prop으로 받은 `stories` 배열의 끝에 가짜 스토리를 하나 더 밀어넣어 "Create Story" 플레이스홀더를 구현했습니다. 하지만 어떤 이유에서인지 "Create Story"가 두 번 이상 나타납니다. 문제를 해결하세요.</Trans>

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

Notice how whenever the clock updates, "Create Story" is added *twice*. This serves as a hint that we have a mutation during rendering--Strict Mode calls components twice to make these issues more noticeable.
<Trans>시계가 업데이트될 때마다 "스토리 만들기"가 *두 번* 추가되는 것을 주목하세요. 이는 렌더링 중에 변이가 발생했음을 알려주는 힌트로, Strict Mode에서는 컴포넌트를 두 번 호출하여 이러한 문제를 더욱 눈에 띄게 만듭니다.</Trans>

`StoryTray` function is not pure. By calling `push` on the received `stories` array (a prop!), it is mutating an object that was created *before* `StoryTray` started rendering. This makes it buggy and very difficult to predict.
<Trans>`StoryTray` 함수는 순수하지 않습니다. 수신된 `stories` 배열(prop!)에 대해 `push`를 호출함으로써 `StoryTray`가 렌더링을 시작하기 *전에* 생성된 객체를 변이시킵니다. 이 때문에 버그가 발생하고 예측하기가 매우 어렵습니다.</Trans>

The simplest fix is to not touch the array at all, and render "Create Story" separately:
<Trans>가장 간단한 해결 방법은 배열을 전혀 건드리지 않고 "Create Story"를 별도로 렌더링하는 것입니다:</Trans>

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // We're breaking our own rules here.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Alternatively, you could create a _new_ array (by copying the existing one) before you push an item into it:
<Trans>또는 항목을 푸시하기 전에 기존 배열을 복사하여 _new_ 배열을 만들 수도 있습니다:</Trans>

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  // Copy the array!
  // 배열을 복사합니다!
  let storiesToDisplay = stories.slice();

  // Does not affect the original array:
  // 기존 배열에는 영향을 주지 않습니다: 
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // HACK: Prevent the memory from growing forever while you read docs.
  // HACK: 문서를 읽는 동안 메모리가 계속해서 증가하는 것을 방지하세요.
  // We're breaking our own rules here.
  // 여기서 우리가 세운 규칙을 빠져나갑니다.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

This keeps your mutation local and your rendering function pure. However, you still need to be careful: for example, if you tried to change any of the array's existing items, you'd have to clone those items too.
<Trans>이렇게 하면 변이가 로컬로 유지되고 렌더링 함수가 순수해집니다. 하지만 여전히 주의해야 합니다. 예를 들어 배열의 기존 항목을 변경하려고 하면 해당 항목도 복제해야 합니다.</Trans>


It is useful to remember which operations on arrays mutate them, and which don't. For example, `push`, `pop`, `reverse`, and `sort` will mutate the original array, but `slice`, `filter`, and `map` will create a new one.
<Trans>배열에서 어떤 연산이 배열을 변경하고 어떤 연산이 변경되지 않는지 기억해두는 것이 유용합니다. 예를 들어 `push`, `pop`, `reverse`, `sort`는 원래 배열을 변경하지만 `slice`, `filter`, `map`은 새 배열을 만듭니다.</Trans>

</Solution>

</Challenges>
