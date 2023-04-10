---
title: Reacting to Input with State
translatedTitle: state로 입력에 반응하기
translators: [유한나라, 정재남]
---

<Intro>

React uses a declarative way to manipulate the UI. Instead of manipulating individual pieces of the UI directly, you describe the different states that your component can be in, and switch between them in response to the user input. This is similar to how designers think about the UI.
<Trans>React는 선언적인 방식으로 UI를 조작합니다. 개별적인 UI를 직접 조작하는 것 대신에 컴포넌트 내부에 여러 state를 묘사하고 사용자의 입력에 따라 state를 변경합니다. 이는 디자이너가 UI를 바라보는 방식과 비슷합니다.</Trans>

</Intro>

<YouWillLearn>

* How declarative UI programming differs from imperative UI programming
* How to enumerate the different visual states your component can be in
* How to trigger the changes between the different visual states from code

<TransBlock>
* 선언형 UI 프로그래밍과 명령형 UI 프로그래밍의 차이점
* 컴포넌트가 있을 수 있는 다양한 시각적 state를 열거하는 방법
* 코드에서 다른 시각적 state 간의 변경을 촉발하는 방법
</TransBlock>

</YouWillLearn>

## How declarative UI compares to imperative<Trans>선언형 UI와 명령형 UI의 차이점</Trans> {/*how-declarative-ui-compares-to-imperative*/}

When you design UI interactions, you probably think about how the UI *changes* in response to user actions. Consider a form that lets the user submit an answer:
<Trans>UI인터렉션을 디자인할 때 사용자의 행동에 따라 UI가 어떻게 변하는지에 대해서 생각해 보셨을 것입니다. 사용자가 답변을 제출할 수 있는 양식을 생각해 봅시다.</Trans>

* When you type something into a form, the "Submit" button **becomes enabled.**
* When you press "Submit", both form and the button **become disabled,** and a spinner **appears.**
* If the network request succeeds, the form **gets hidden,** and the "Thank you" message **appears.**
* If the network request fails, an error message **appears,** and the form **becomes enabled** again.

<TransBlock>
* 폼에 무언가를 입력하면 “Submit” 버튼이 **활성화될** 것입니다.
* “제출” 버튼을 누르면 폼과 버튼이 **비활성화** 되고 **스피너가 나타날** 것입니다.
* 네트워크 요청이 성공한다면 form은 **숨겨질** 것이고 “Thank you”메세지가 **나타날** 것입니다.
* 네트워크 요청이 실패한다면 오류 메세지가 **보일** 것이고 form은 다시 **활성화** 될 것입니다.
</TransBlock>

In **imperative programming,** the above corresponds directly to how you implement interaction. You have to write the exact instructions to manipulate the UI depending on what just happened. Here's another way to think about this: imagine riding next to someone in a car and telling them turn by turn where to go.
<Trans>**명령형 프로그래밍에서** 위의 내용은 인터랙션을 구현하는 방법에 직접적으로 해당합니다. 방금 일어난 일에 따라 UI를 조작하기 위한 정확한 지침을 작성해야합니다. 다른 방식으로 생각해봅시다: 자동차를 타고 가는 사람 옆에서 어디로 가야하는지 차례대로 알려주는 상상을 해봅시다.</Trans>

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="In a car driven by an anxious-looking person representing JavaScript, a passenger orders the driver to execute a sequence of complicated turn by turn navigations." />

They don't know where you want to go, they just follow your commands. (And if you get the directions wrong, you end up in the wrong place!) It's called *imperative* because you have to "command" each element, from the spinner to the button, telling the computer *how* to update the UI.
<Trans>운전자는 사용자가 어디로 가고 싶은지 모른 채 명령만 따를 뿐입니다. (지시를 잘못 내리면 엉뚱한 곳에 가게 됩니다!) 컴퓨터에게 스피너부터 버튼까지 각 요소에 “명령”을 내려 컴퓨터에 *어떻게* UI를 업데이트할 내용을 지시해야 하므로, 이를 *명령형*이라고 부릅니다.</Trans>

In this example of imperative UI programming, the form is built *without* React. It only uses the browser [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model):
<Trans>다음 명령형 UI 프로그래밍 예시에서 form은 React를 사용하지 않고 작성되었습니다. 대신 내장된 브라우저의 [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)을 사용합니다:</Trans>


<Sandpack>

```js index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() == 'istanbul') {
        resolve();
      } else {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>City quiz</h2>
  <p>
    What city is located on two continents?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Submit</button>
  <p id="loading" style="display: none">Loading...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">That's right!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

Manipulating the UI imperatively works well enough for isolated examples, but it gets exponentially more difficult to manage in more complex systems. Imagine updating a page full of different forms like this one. Adding a new UI element or a new interaction would require carefully checking all existing code to make sure you haven't introduced a bug (for example, forgetting to show or hide something).
<Trans>UI를 조작하는 것은 위와 같이 단순 고립된 예제에서는 충분히 잘 동작하지만, 더 복잡한 시스템에서는 관리하기가 기하급수적으로 어려워집니다. 다양한 form 양식으로 가득 찬 페이지를 업데이트 해야 한다고 생각해봅시다. 새로운 UI 요소나 새로운 인터랙션을 추가하려면 기존의 모든 코드를 주의 깊게 살펴 버그의 발생 여부(예를 들어 무언가를 표시하거나 숨기는 것을 잊는 등)를 확인해야 합니다.</Trans>

React was built to solve this problem.
<Trans>React는 이런 문제를 해결하기 위해 만들어졌습니다.</Trans>

In React, you don't directly manipulate the UI--meaning you don't enable, disable, show, or hide components directly. Instead, you **declare what you want to show,** and React figures out how to update the UI. Think of getting into a taxi and telling the driver where you want to go instead of telling them exactly where to turn. It's the driver's job to get you there, and they might even know some shortcuts you haven't considered!
<Trans>React에서는 직접 UI를 조작하지 않습니다. 즉, 컴포넌트를 직접 활성화하거나 비활성화 하지도, 보여주거나 숨기지도 않습니다. 대신 **표시할 내용을 선언하면** React가 UI를 업데이트할 방법을 알아냅니다. 택시를 타고 기사에게 정확히 어디서 꺾어야 할지를 알려주는 대신 어디로 가고 싶은지만 말한다고 생각해 보세요. 목적지까지 데려다주는 것은 택시기사의 몫이며, 기사는 여러분이 미처 생각하지 못한 지름길을 알고 있을 수도 있습니다!</Trans>

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="In a car driven by React, a passenger asks to be taken to a specific place on the map. React figures out how to do that." />

## Thinking about UI declaratively<Trans>UI를 선언적인 방식으로 생각하기</Trans> {/*thinking-about-ui-declaratively*/}

You've seen how to implement a form imperatively above. To better understand how to think in React, you'll walk through reimplementing this UI in React below:
<Trans>위에서 form을 명령형으로 구현하는 방법을 살펴보았습니다. 아래에서는 React로 사고하는 방법을 더 잘 이해하기 위해 이 UI를 React로 다시 구현하는 과정을 살펴봅시다:</Trans>

1. **Identify** your component's different visual states
2. **Determine** what triggers those state changes
3. **Represent** the state in memory using `useState`
4. **Remove** any non-essential state variables
5. **Connect** the event handlers to set the state

<TransBlock>
1. 컴포넌트의 다양한 시각적 상태를 **식별**합니다.
2. 상태 변화를 촉발하는 요소를 **파악**합니다.
3. `useState`를 사용하여 메모리의 상태를 **표현**합니다.
4. 비필수적인 state 변수를 **제거**합니다.
5. 이벤트 핸들러를 **연결**하여 state를 설정합니다.
</TransBlock>

### Step 1: Identify your component's different visual states<Trans>Step 1: 컴포넌트의 다양한 시각적 상태 식별하기</Trans> {/*step-1-identify-your-components-different-visual-states*/}

In computer science, you may hear about a ["state machine"](https://en.wikipedia.org/wiki/Finite-state_machine) being in one of several “states”. If you work with a designer, you may have seen mockups for different "visual states". React stands at the intersection of design and computer science, so both of these ideas are sources of inspiration.
<Trans>컴퓨터 과학에서 ["상태 머신"](https://en.wikipedia.org/wiki/Finite-state_machine) 이란 여러가지 “상태”들 중 하나라는 말을 들어보셨을 것입니다. 디자이너와 함께 일한다면 다양한 “시각적인 상태”에 대한 목업을 보셨을 것입니다. React는 디자인과 컴퓨터 과학의 교차점에 서있기 때문에 이 두 아이디어 모두 영감의 원천이 됩니다.</Trans>

First, you need to visualize all the different "states" of the UI the user might see:
<Trans>먼저 사용자에게 표시될 수 있는 UI의 다양한 “상태”를 모두 시각화해야 합니다:</Trans>

* **Empty**: Form has a disabled "Submit" button.
* **Typing**: Form has an enabled "Submit" button.
* **Submitting**: Form is completely disabled. Spinner is shown.
* **Success**: "Thank you" message is shown instead of a form.
* **Error**: Same as Typing state, but with an extra error message.

<TransBlock>
* **비어있음**: form의 “Submit”버튼은 비활성화되어 있습니다.
* **입력중**: form의 “Submit”버튼이 활성화되어 있습니다.
* **제출중**: form은 완전히 비활성화되어있고 Spinner가 표시됩니다.
* **성공시**: form 대신 “Thank you”메세지가 표시됩니다.
* **실패시**: ‘입력중’ 상태와 동일하지만 추가로 오류 메세지가 표시됩니다.
</TransBlock>

Just like a designer, you'll want to "mock up" or create "mocks" for the different states before you add logic. For example, here is a mock for just the visual part of the form. This mock is controlled by a prop called `status` with a default value of `'empty'`:
<Trans>디자이너와 마찬가지로 로직을 추가하기 전에 다양한 상태에 대한 “목업”을 만들고 싶을 것입니다. 예를 들어 다음은 form의 시각적 부분만을 위한 목업입니다. 이 목업은 기본값이 `'empty'`인 `status`라는 prop으로 제어됩니다:</Trans>

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Submit
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

You could call that prop anything you like, the naming is not important. Try editing `status = 'empty'` to `status = 'success'` to see the success message appear. Mocking lets you quickly iterate on the UI before you wire up any logic. Here is a more fleshed out prototype of the same component, still "controlled" by the `status` prop:
<Trans>prop의 이름은 원하는 것으로 정해도 되며, 중요하지 않습니다. `status = 'empty'`를 `status = 'success'` 로 편집하여 성공 메세지가 표시되는지 확인해 보세요. 목업을 사용하면 로직을 연결하기 전에 UI를 빠르게 반복해볼 수 있습니다. 다음은 동일한 컴포넌트의 좀 더 구체화된 프로토타입으로, 여전히 `status` prop에 의해 “제어”됩니다:</Trans>

<Sandpack>

```js
export default function Form({
  // Try 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Submit
        </button>
        {status === 'error' &&
          <p className="Error">
            Good guess but a wrong answer. Try again!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### Displaying many visual states at once<Trans>한 번에 여러 시각적 상태 표시하기</Trans> {/*displaying-many-visual-states-at-once*/}

If a component has a lot of visual states, it can be convenient to show them all on one page:
<Trans>컴포넌트에 시각적 상태가 많은 경우 한 페이지에 모두 표시하는 것이 편리할 수 있습니다:</Trans>

<Sandpack>

```js App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>That's right!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Submit
      </button>
      {status === 'error' &&
        <p className="Error">
          Good guess but a wrong answer. Try again!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Pages like this are often called "living styleguides" or "storybooks".
<Trans>이런 페이지를 보통 “living styleguide”또는 “storybook”이라 부릅니다.</Trans>

</DeepDive>

### Step 2: Determine what triggers those state changes<Trans>상태 변경을 촉발하는 요인 파악하기</Trans> {/*step-2-determine-what-triggers-those-state-changes*/}

You can trigger state updates in response to two kinds of inputs:
<Trans>두 종류의 입력에 대한 응답으로 상태 변경을 촉발할 수 있습니다:</Trans>

* **Human inputs,** like clicking a button, typing in a field, navigating a link.
* **Computer inputs,** like a network response arriving, a timeout completing, an image loading.

<TransBlock>
* **사람의 입력** : 버튼 클릭, 필드 입력, 링크 이동 등
* **컴퓨터의 입력** : 네트워크에서 응답 도착, 시간 초과, 이미지 로딩 등
</TransBlock>

<IllustrationBlock>
  <Illustration caption="Human inputs" alt="A finger." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Computer inputs" alt="Ones and zeroes." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

In both cases, **you must set [state variables](/learn/state-a-components-memory#anatomy-of-usestate) to update the UI.** For the form you're developing, you will need to change state in response to a few different inputs:
<Trans>두 경우 모두 **[state 변수](/learn/state-a-components-memory#anatomy-of-usestate)를 설정해야 UI를 업데이트할 수 있습니다.** 개발중인 form의 경우 몇 가지 다른 입력에 따라 state를 변경해야합니다:</Trans>

* **Changing the text input** (human) should switch it from the *Empty* state to the *Typing* state or back, depending on whether the text box is empty or not.
* **Clicking the Submit button** (human) should switch it to the *Submitting* state.
* **Successful network response** (computer) should switch it to the *Success* state.
* **Failed network response** (computer) should switch it to the *Error* state with the matching error message.

<TransBlock>
* **text 입력을 변경**(사람)하면 text box가 비어있는지 여부에 따라 *비어있음* state에서 입력중 state로, 또는 그 반대로 전환해야합니다.
* **제출 버튼을 클릭**(사람)하면 *제출중* state로 전환해야합니다.
* 네트워크 응답 성공(컴퓨터)시 *성공* state로 전환해야 합니다.
* 네트워크 요청 실패(컴퓨터)시 일치하는 오류 메세지와 함께 *오류* state로 전환해야 합니다.
</TransBlock>

<Note>

Notice that human inputs often require [event handlers](/learn/responding-to-events)!
<Trans>사람의 입력에는 종종 [이벤트 핸들러](/learn/responding-to-events)가 필요합니다!</Trans>

</Note>

To help visualize this flow, try drawing each state on paper as a labeled circle, and each change between two states as an arrow. You can sketch out many flows this way and sort out bugs long before implementation.
<Trans>이 흐름을 시각화하는 데 도움이 되도록 종이에 각 상태가 적힌 원을 그리고 각 상태 사이의 변경 사항을 화살표로 그려 보세요. 이 방식으로 흐름을 파악할 수 있을 뿐 아니라 구현하기 훨씬 전에 버그를 분류할 수 있습니다.</Trans>

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Flow chart moving left to right with 5 nodes. The first node labeled 'empty' has one edge labeled 'start typing' connected to a node labeled 'typing'. That node has one edge labeled 'press submit' connected to a node labeled 'submitting', which has two edges. The left edge is labeled 'network error' connecting to a node labeled 'error'. The right edge is labeled 'network success' connecting to a node labeled 'success'.">

Form states

</Diagram>

</DiagramGroup>

### Step 3: Represent the state in memory with `useState`<Trans>메모리의 상태를 `useState` 로 표현하기</Trans> {/*step-3-represent-the-state-in-memory-with-usestate*/}

Next you'll need to represent the visual states of your component in memory with [`useState`.](/reference/react/useState) Simplicity is key: each piece of state is a "moving piece", and **you want as few "moving pieces" as possible.** More complexity leads to more bugs!
<Trans>다음으로 메모리에서 컴포넌트의 시각적 상태를 [`useState`](/reference/react/useState)로 표현해야합니다. 이 과정은 단순함이 핵심입니다. 각 상태 조각은 “움직이는 조각”이며, **가능한 적은 수의 “움직이는 조각”을 원합니다.** 복잡할수록 버그가 더 많이 발생합니다!</Trans>

Start with the state that *absolutely must* be there. For example, you'll need to store the `answer` for the input, and the `error` (if it exists) to store the last error:
<Trans>*반드시* 필요한 state부터 시작하세요. 예를 들어 입력에 대한 `answer`를 저장하고, 가장 마지막에 발생한 `error`(존재한다면)도 저장해야 합니다.</Trans>

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Then, you'll need a state variable representing which one of the visual states that you want to display. There's usually more than a single way to represent that in memory, so you'll need to experiment with it.
<Trans>그런 다음 앞서 설명한 시각적 상태 중 어떤 상태를 표시할지를 나타내는 state 변수가 필요합니다. 일반적으로 메모리에서 이를 표현하는 방법은 여러가지가 있으므로 실험해봐야 합니다.</Trans>

If you struggle to think of the best way immediately, start by adding enough state that you're *definitely* sure that all the possible visual states are covered:
<Trans>가장 좋은 방법을 즉시 생각하기 어렵다면 가능한 모든 시각적 상태를 *확실하게* 다룰 수 있을 만큼 충분한 state를 추가하는 것부터 시작하세요.</Trans>

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

Your first idea likely won't be the best, but that's ok--refactoring state is a part of the process!
<Trans>처음 떠올린 생각이 최선이 아닐 수도 있지만 괜찮습니다. state를 리팩토링 하는 것도 과정의 일부이니까요!</Trans>

### Step 4: Remove any non-essential state variables<Trans>비필수적인 state 변수 제거하기</Trans> {/*step-4-remove-any-non-essential-state-variables*/}

You want to avoid duplication in the state content so you're only tracking what is essential. Spending a little time on refactoring your state structure will make your components easier to understand, reduce duplication, and avoid unintended meanings. Your goal is to **prevent the cases where the state in memory doesn't represent any valid UI that you'd want a user to see.** (For example, you never want to show an error message and disable the input at the same time, or the user won't be able to correct the error!)
<Trans>state 콘텐츠의 중복을 피해 필수적인 것만 추적하고 싶을 것입니다. state 구조를 리팩토링하는 데 약간의 시간을 투자하면 컴포넌트를 더 쉽게 이해하고, 중복을 줄이며, 의도하지 않은 경우를 피할 수 있습니다. 목표는 **state가 사용자에게 보여주기를 원하는 유효한 UI를 나타내지 않는 경우를 방지**하는 것입니다. (예를 들어 오류 메세지를 표시하면서 동시에 입력을 비활성화하면 사용자는 오류를 수정할 수 없게 됩니다!)</Trans>

Here are some questions you can ask about your state variables:
<Trans>다음은 state 변수에 대해 물어볼 수 있는 몇가지 질문입니다:</Trans>

* **Does this state cause a paradox?** For example, `isTyping` and `isSubmitting` can't both be `true`. A paradox usually means that the state is not constrained enough. There are four possible combinations of two booleans, but only three correspond to valid states. To remove the "impossible" state, you can combine these into a `status` that must be one of three values: `'typing'`, `'submitting'`, or `'success'`.
* **Is the same information available in another state variable already?** Another paradox: `isEmpty` and `isTyping` can't be `true` at the same time. By making them separate state variables, you risk them going out of sync and causing bugs. Fortunately, you can remove `isEmpty` and instead check `answer.length === 0`.
* **Can you get the same information from the inverse of another state variable?** `isError` is not needed because you can check `error !== null` instead.

<TransBlock>
* **state가 모순을 야기하나요?** 예를 들어 `isTyping` 과 `isSubmitting`은 동시에 `true`일 수 없습니다. 이러한 모순은 일반적으로 state가 충분히 제약되지 않았음을 의미합니다. 두 boolean의 조합은 네 가지가 가능하지만 유효한 state는 세 가지뿐입니다. “불가능한” state를 제거하려면 세 가지 값을 하나의 status로 결합하면 됩니다: `'typing'`, `'submitting'`, `'success'`.
* **다른 state 변수에 이미 같은 정보가 있나요?** `isEmpty`와 `isTyping`은 동시에 `true`가 될 수 없습니다. 이를 각 state 변수로 분리하면 동기화되지 않아 버그가 발생할 위험이 있습니다. 다행히 `isEmpty`를 제거하고 대신 `answer.length === 0`으로 확인할 수 있습니다.
* **다른 state 변수를 뒤집으면 동일한 정보를 얻을 수 있나요?** `isError`는 `error !== null`을 대신 확인할 수 있기 때문에 필요하지 않습니다.
</TransBlock>

After this clean-up, you're left with 3 (down from 7!) *essential* state variables:
<Trans>이렇게 정리하고 나면 3개(7개가 줄어든!)의 *필수* state 변수만 남습니다:</Trans>

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', or 'success'
```

You know they are essential, because you can't remove any of them without breaking the functionality.
<Trans>이들은 기능을 망가뜨리지 않고는 어느 하나도 제거할 수 없으므로 필수 요소임을 알 수 있습니다.</Trans>

<DeepDive>

#### Eliminating “impossible” states with a reducer<Trans>reducer로 “불가능한” state 제거하기</Trans> {/*eliminating-impossible-states-with-a-reducer*/}

These three variables are a good enough representation of this form's state. However, there are still some intermediate states that don't fully make sense. For example, a non-null `error` doesn't make sense when `status` is `'success'`. To model the state more precisely, you can [extract it into a reducer.](/learn/extracting-state-logic-into-a-reducer) Reducers let you unify multiple state variables into a single object and consolidate all the related logic!
<Trans>이 세 state 변수는 이 form의 상태를 충분히 잘 표현합니다. 그러나 여전히 완전히 설명되지 않는 중간 상태가 몇 가지 있습니다. 예를 들어 null이 아닌 `error는` `status`가 `'success'`일 때는 의미가 없습니다. state를 조금 더 정확하게 모델링하려면 [reducer로 분리](/learn/extracting-state-logic-into-a-reducer)하면 됩니다. reducer를 사용하면 여러 state 변수를 하나의 객체로 통합하고 관련된 모든 로직도 합칠 수 있습니다!</Trans>

</DeepDive>

### Step 5: Connect the event handlers to set state<Trans>이벤트 핸들러를 연결하여 state 설정하기</Trans> {/*step-5-connect-the-event-handlers-to-set-state*/}

Lastly, create event handlers that update the state. Below is the final form, with all event handlers wired up:
<Trans>마지막으로 state 변수를 설정하는 이벤트 핸들러를 생성합니다. 아래는 모든 이벤트 핸들러가 연결된 최종 form입니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>That's right!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>City quiz</h2>
      <p>
        In which city is there a billboard that turns air into drinkable water?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Good guess but a wrong answer. Try again!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

Although this code is longer than the original imperative example, it is much less fragile. Expressing all interactions as state changes lets you later introduce new visual states without breaking existing ones. It also lets you change what should be displayed in each state without changing the logic of the interaction itself.
<Trans>이 코드는 원래의 명령형 예제보다 길지만 훨씬 덜 취약합니다. 모든 상호작용을 state 변화로 표현하면 나중에 기존 상태를 깨지 않고도 새로운 시각적 상태를 도입할 수 있습니다. 또한 인터랙션 자체의 로직을 변경하지 않고도 각 state에 표시되어야 하는 항목을 변경할 수 있습니다.</Trans>

<Recap>

* Declarative programming means describing the UI for each visual state rather than micromanaging the UI (imperative).
* When developing a component:
  1. Identify all its visual states.
  2. Determine the human and computer triggers for state changes.
  3. Model the state with `useState`.
  4. Remove non-essential state to avoid bugs and paradoxes.
  5. Connect the event handlers to set state.

<TransBlock>
* 선언형 프로그래밍은 UI를 세밀하게 관리(명령형)하지 않고 각 시각적 상태에 대해 UI를 기술하는 것을 의미합니다.
* 컴포넌트를 개발할 때
  1. 모든 시각적 상태를 식별하세요.
  2. 사람 및 컴퓨터가 상태 변화를 촉발하는 요인을 결정하세요.
  3. `useState`로 상태를 모델링하세요.
  4. 버그와 모순을 피하려면 비필수적인 state를 제거하세요.
  5. 이벤트 핸들러를 연결하여 state를 설정하세요
</TransBlock>

</Recap>


<Challenges>

#### Add and remove a CSS class<Trans>CSS 클래스 추가/삭제</Trans> {/*add-and-remove-a-css-class*/}

Make it so that clicking on the picture *removes* the `background--active` CSS class from the outer `<div>`, but *adds* the `picture--active` class to the `<img>`. Clicking the background again should restore the original CSS classes.
<Trans>그림을 클릭하면 외부 `<div>`의 background--active CSS 클래스가 제거되고 `<img>`에 `picture--active` 클래스가 추가되도록 하세요. 배경을 다시 클릭하면 원래 CSS 클래스가 복원되어야 합니다.</Trans>

Visually, you should expect that clicking on the picture removes the purple background and highlights the picture border. Clicking outside the picture highlights the background, but removes the picture border highlight.
<Trans>화면상에서는 그림을 클릭하면 보라색 배경이 제거되고 그림 테두리는 강조 표시됩니다. 그림 바깥쪽을 클릭하면 배경은 강조 표시되고 사진의 테두리 강조 표시는 제거됩니다.</Trans>

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

This component has two visual states: when the image is active, and when the image is inactive:
<Trans>이 컴포넌트에는 이미지가 활성화된 경우와 비활성화된 경우의 두 가지 시각적 상태가 있습니다:</Trans>

* When the image is active, the CSS classes are `background` and `picture picture--active`.
* When the image is inactive, the CSS classes are `background background--active` and `picture`.

<TransBlock>
* 이미지가 활성화된 경우 CSS 클래스는 `background` 및 `picture picture--active`입니다.
* 이미지가 비활성 상태일 때 CSS 클래스는 `background background--active` 및 `picture`입니다.
</TransBlock>

A single boolean state variable is enough to remember whether the image is active. The original task was to remove or add CSS classes. However, in React you need to *describe* what you want to see rather than *manipulate* the UI elements. So you need to calculate both CSS classes based on the current state. You also need to [stop the propagation](/learn/responding-to-events#stopping-propagation) so that clicking the image doesn't register as a click on the background.
<Trans>하나의 boolean state 변수로 이미지가 활성화되어 있는지 여부를 기억할 수 있습니다. 원래 작업은 CSS classes를 제거하거나 추가하는 것이었습니다. 하지만 React에서는 UI요소를 **조작**하는 것이 아니라 보고 싶은 것을 **설명**해야 합니다. 따라서 현재 상태를 기준으로 두 CSS classes를 모두 계산해야 합니다. 또한 이미지를 클릭해도 배경 클릭이 되지 않도록 [전파를 중지](/learn/responding-to-events#stopping-propagation)해야 합니다.</Trans>

Verify that this version works by clicking the image and then outside of it:
<Trans>이미지를 클릭한 다음 이미지 바깥쪽을 클릭하여 이 버전이 작동하는지 확인합니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Alternatively, you could return two separate chunks of JSX:
<Trans>또는 두 개의 개별 JSX 청크를 반환할 수도 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Keep in mind that if two different JSX chunks describe the same tree, their nesting (first `<div>` → first `<img>`) has to line up. Otherwise, toggling `isActive` would recreate the whole tree below and [reset its state.](/learn/preserving-and-resetting-state) This is why, if a similar JSX tree gets returned in both cases, it is better to write them as a single piece of JSX.
<Trans>두 개의 서로 다른 JSX 청크가 동일한 트리를 설명하는 경우 중첩(첫 번째 `<div>` -> 첫 번째 `<img>`)이 정렬되어야 한다는 점에 유의하세요.
그렇지 않으면 `isActive`를 토글하면 아래 전체 트리가 다시 생성되고 [state가 재설정됩니다](/learn/preserving-and-resetting-state) 따라서 두 경우 모두에서 유사한 JSX트리가 반환되는 경우, 하나의 JSX로 작성하는 것이 좋습니다.</Trans>

</Solution>

#### Profile editor<Trans>프로필 편집기</Trans> {/*profile-editor*/}

Here is a small form implemented with plain JavaScript and DOM. Play with it to understand its behavior:
<Trans>다음은 일반 JavaScript와 DOM으로 구현된 작은 form입니다. 직접 플레이해보고 동작을 이해해 보세요:</Trans>

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

This form switches between two modes: in the editing mode, you see the inputs, and in the viewing mode, you only see the result. The button label changes between "Edit" and "Save" depending on the mode you're in. When you change the inputs, the welcome message at the bottom updates in real time.
<Trans>이 form은 두 가지 모드로 전환됩니다. 편집 모드에서는 입력 내용을 볼 수 있고, 보기 모드에서는 결과만 볼 수 있습니다. 현재 모드에 따라 버튼 레이블이 “Edit”과 “Save” 사이에서 변경됩니다. 입력을 변경하면 하단의 환영 메시지가 실시간으로 업데이트됩니다.</Trans>

Your task is to reimplement it in React in the sandbox below. For your convenience, the markup was already converted to JSX, but you'll need to make it show and hide the inputs like the original does.
<Trans>여러분의 임무는 아래 샌드박스에서 React로 다시 구현하는 것입니다. 편의를 위해 마크업은 이미 JSX로 변환되었지만, 원본처럼 입력을 표시하고 숨기도록 만들어야 합니다.</Trans>

Make sure that it updates the text at the bottom, too!
<Trans>하단의 텍스트도 업데이트되는지 확인하세요!</Trans>

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        First name:{' '}
        <b>Jane</b>
        <input />
      </label>
      <label>
        Last name:{' '}
        <b>Jacobs</b>
        <input />
      </label>
      <button type="submit">
        Edit Profile
      </button>
      <p><i>Hello, Jane Jacobs!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

You will need two state variables to hold the input values: `firstName` and `lastName`. You're also going to need an `isEditing` state variable that holds whether to display the inputs or not. You should _not_ need a `fullName` variable because the full name can always be calculated from the `firstName` and the `lastName`.
<Trans>입력 값을 저장할 두 개의 state 변수가 필요합니다. : `firstName`과 `lastName`입니다. 또한 입력을 표시하는 것을 저장하는 `isEditing` state 변수도 필요합니다. 전체 이름은 항상 `fullName`과 `lastName`에서 계산할 수 있으므로 `fullName` 변수가 필요하지 않습니다.</Trans>

Finally, you should use [conditional rendering](/learn/conditional-rendering) to show or hide the inputs depending on `isEditing`.
<Trans>마지막으로 [조건부 렌더링](/learn/conditional-rendering)을 사용하여 `isEditing`에 따라 입력을 표시하거나 숨겨야 합니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Compare this solution to the original imperative code. How are they different?
<Trans>이 해설을 명령형 코드와 비교해 보세요. 어떤것이 다를까요?</Trans>

</Solution>

#### Refactor the imperative solution without React<Trans>React 없이 명령형 솔루션 리팩터링하기</Trans> {/*refactor-the-imperative-solution-without-react*/}

Here is the original sandbox from the previous challenge, written imperatively without React:
<Trans>다음은 이전 챌린지의 원본 샌드박스로, React 없이 명령형으로 작성되었습니다:</Trans>

<Sandpack>

```js index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Edit Profile') {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Hello ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Imagine React didn't exist. Can you refactor this code in a way that makes the logic less fragile and more similar to the React version? What would it look like if the state was explicit, like in React?
<Trans>React가 존재하지 않는다고 상상해 보세요. 이 코드를 리팩터링하여 로직이 덜 취약하고 React 버전과 더 유사하게 만들 수 있을까요? React에서처럼 상태가 명시적이라면 어떤 모습일까요?</Trans>

If you're struggling to think where to start, the stub below already has most of the structure in place. If you start here, fill in the missing logic in the `updateDOM` function. (Refer to the original code where needed.)
<Trans>어디서부터 시작해야 할지 고민 중이라면, 아래 샌드박스에 이미 대부분의 구조가 마련되어 있습니다. 여기서는 `updateDOM`함수에서 누락된 로직을 채우면 됩니다. (필요한 경우 원본 코드를 참조하세요.)</Trans>

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    // TODO: show inputs, hide content
  } else {
    editButton.textContent = 'Edit Profile';
    // TODO: hide inputs, show content
  }
  // TODO: update text labels
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

The missing logic included toggling the display of inputs and content, and updating the labels:
<Trans>누락된 로직에는 입력 및 컨텐츠 표시 토글과 레이블 업데이트가 포함되어 있습니다:</Trans>

<Sandpack>

```js index.js active
let firstName = 'Jane';
let lastName = 'Jacobs';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Save Profile';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Edit Profile';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    First name:
    <b id="firstNameText">Jane</b>
    <input
      id="firstNameInput"
      value="Jane"
      style="display: none">
  </label>
  <label>
    Last name:
    <b id="lastNameText">Jacobs</b>
    <input
      id="lastNameInput"
      value="Jacobs"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Edit Profile</button>
  <p><i id="helloText">Hello, Jane Jacobs!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

The `updateDOM` function you wrote shows what React does under the hood when you set the state. (However, React also avoids touching the DOM for properties that have not changed since the last time they were set.)
<Trans>여러분이 작성한 `updateDOM` 함수는 state를 설정할 때 React가 내부적으로 어떤 작업을 수행하는지 보여줍니다.(하지만 React는 마지막으로 설정한 이후 변경되지 않은 프로퍼티에 대해서는 DOM을 건드리지 않습니다.)</Trans>

</Solution>

</Challenges>
