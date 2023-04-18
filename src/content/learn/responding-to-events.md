---
title: Responding to Events
translatedTitle: 이벤트에 응답하기
translators: [최민정, 손한종, 정재남]
---

<Intro>

React lets you add *event handlers* to your JSX. Event handlers are your own functions that will be triggered in response to interactions like clicking, hovering, focusing form inputs, and so on.
<Trans>React를 사용하면 JSX에 이벤트 핸들러를 추가할 수 있습니다. 이벤트 핸들러는 click, hover, input의 focus 등과 같은 상호작용에 반응하여 발생하는 자체 함수입니다.</Trans>

</Intro>

<YouWillLearn>

* Different ways to write an event handler
* How to pass event handling logic from a parent component
* How events propagate and how to stop them

<TransBlock>
- 이벤트 핸들러를 작성하는 다양한 방법
- 부모 컴포넌트로부터 이벤트 핸들링 로직을 전달하는 방법
- 이벤트가 전파되는 방식과 중지하는 방법
</TransBlock>
</YouWillLearn>

## Adding event handlers<Trans>이벤트 핸들러 추가하기</Trans> {/*adding-event-handlers*/}

To add an event handler, you will first define a function and then [pass it as a prop](/learn/passing-props-to-a-component) to the appropriate JSX tag. For example, here is a button that doesn't do anything yet:
<Trans>이벤트 핸들러를 추가하려면 먼저 함수를 정의한 다음 이를 적절한 JSX 태그에 [prop으로 전달](/learn/passing-props-to-a-component)합니다. 예를 들어 아직 아무 작업도 수행하지 않는 버튼이 있습니다:</Trans>

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      I don't do anything
    </button>
  );
}
```

</Sandpack>

You can make it show a message when a user clicks by following these three steps:
<Trans>다음의 세 단계를 거쳐 사용자가 클릭할 때 메시지를 표시하도록 설정할 수 있습니다:</Trans>

1. Declare a function called `handleClick` *inside* your `Button` component.
2. Implement the logic inside that function (use `alert` to show the message).
3. Add `onClick={handleClick}` to the `<button>` JSX.

<TransBlock>
  1. `Button`컴포넌트 안에 `handleClick`이라는 함수를 선언합니다.
  2. 해당 함수 내부의 로직을 구현합니다(`alert`을 사용하여 메시지 표시).
  3. JSX의 `<button>`에 `onClick={handleClick}`를 추가합니다.
</TransBlock>

<Sandpack>

```js
export default function Button() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

You defined the `handleClick` function and then [passed it as a prop](/learn/passing-props-to-a-component) to `<button>`.  `handleClick` is an **event handler.** Event handler functions:
<Trans>`handleClick` 함수를 정의한 다음 이를 `<button>`에 [prop으로 전달](/learn/passing-props-to-a-component)했습니다. `handleClick`은 **이벤트 핸들러**입니다. 이벤트 핸들러 함수는:</Trans>

* Are usually defined *inside* your components.
* Have names that start with `handle`, followed by the name of the event.

<TransBlock>
  - 일반적으로 컴포넌트 안에 정의됩니다.
  - `handle`로 시작하는 이름 뒤에 이벤트 이름이 오도록 합니다.
</TransBlock>

By convention, it is common to name event handlers as `handle` followed by the event name. You'll often see `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`, and so on.
<Trans>관례상 이벤트 핸들러의 이름은 `handle` 뒤에 이벤트 이름을 붙이는 것이 일반적입니다. 흔히 `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`등을 볼 수 있습니다.</Trans>

Alternatively, you can define an event handler inline in the JSX:
<Trans>또는 JSX에서 인라인으로 이벤트 핸들러를 정의할 수도 있습니다:</Trans>

```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

Or, more concisely, using an arrow function:
<Trans>또는, 더 간결하게 화살표 함수를 사용할 수도 있습니다:</Trans>

```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```

All of these styles are equivalent. Inline event handlers are convenient for short functions.
<Trans>이 모든 스타일은 동일합니다. 인라인 이벤트 핸들러는 함수가 짧을 경우 편리합니다.</Trans>

<Pitfall>

Functions passed to event handlers must be passed, not called. For example:
<Trans>이벤트 핸들러에 전달되는 함수는 호출하는 게 아니라 전달되어야 합니다. 예를 들어:</Trans>

| passing a function (correct)<br/><Trans>함수 전달 (올바름)</Trans> | calling a function (incorrect)<br/><Trans>함수 호출 (잘못됨)</Trans> |
| :-------------------------------------------------------------- | :---------------------------------------------------------------- | 
| `<button onClick={handleClick}>`                                | `<button onClick={handleClick()}>`                                |

The difference is subtle. In the first example, the `handleClick` function is passed as an `onClick` event handler. This tells React to remember it and only call your function when the user clicks the button.
<Trans>차이점은 미묘합니다. 첫 번째 예시에서는 `handleClick` 함수가 `onClick` 이벤트 핸들러로 전달됩니다. 이렇게 하면 React가 이를 기억하고 사용자가 버튼을 클릭할 때만 함수를 호출하도록 지시합니다.</Trans>

In the second example, the `()` at the end of `handleClick()` fires the function *immediately* during [rendering](/learn/render-and-commit), without any clicks. This is because JavaScript inside the [JSX `{` and `}`](/learn/javascript-in-jsx-with-curly-braces) executes right away.
<Trans>두 번째 예시에서 `handleClick()`끝에 있는 `()`은 클릭 없이 [렌더링](/learn/render-and-commit) 중에 *즉시* 함수를 실행합니다. 이는 [JSX의 `{` 및 `}`](/learn/javascript-in-jsx-with-curly-braces) 내부의 JavaScript가 바로 실행되기 때문입니다.</Trans>

When you write code inline, the same pitfall presents itself in a different way:
<Trans>인라인으로 코드를 작성할 때는 동일한 함정이 다른 방식으로 나타납니다:</Trans>

| passing a function (correct)<br/><Trans>함수 전달 (올바름)</Trans>     | calling a function (incorrect)<br/><Trans>함수 호출 (잘못됨)</Trans>     |
| :-------------------------------------- | :-------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |

Passing inline code like this won't fire on click—it fires every time the component renders:
<Trans>이와 같은 인라인 코드를 전달하면 클릭시 실행되지 않고, 컴포넌트가 렌더링될 때마다 실행됩니다:</Trans>

```jsx
// This alert fires when the component renders, not when clicked!
<button onClick={alert('You clicked me!')}>
```

If you want to define your event handler inline, wrap it in an anonymous function like so:
<Trans>이벤트 핸들러를 인라인으로 정의하려면 다음과 같이 익명 함수로 감싸주세요:</Trans>

```jsx
<button onClick={() => alert('You clicked me!')}>
```

Rather than executing the code inside with every render, this creates a function to be called later.
<Trans>렌더링할 때마다 내부에서 코드를 실행하는 대신 나중에 호출할 함수를 생성합니다.</Trans>

In both cases, what you want to pass is a function:
<Trans>두 경우 모두 전달하려는 것은 함수입니다:</Trans>

* `<button onClick={handleClick}>` passes the `handleClick` function.
* `<button onClick={() => alert('...')}>` passes the `() => alert('...')` function.

<TransBlock>
- `<button onClick={handleClick}>`은 `handleClick`함수를 전달합니다
- `<button onClick={() => alert('...')}>`은 `() => alert('...')`함수를 전달합니다.
</TransBlock>

[Read more about arrow functions.](https://javascript.info/arrow-functions-basics)
<Trans>[화살표 함수에 대해 자세히 알아보세요.](https://ko.javascript.info/arrow-functions-basics)</Trans>

</Pitfall>

### Reading props in event handlers<Trans>이벤트 핸들러에서 props 읽기</Trans> {/*reading-props-in-event-handlers*/}

Because event handlers are declared inside of a component, they have access to the component's props. Here is a button that, when clicked, shows an alert with its `message` prop:
<Trans>이벤트 핸들러는 컴포넌트 내부에서 선언되기 때문에 컴포넌트의 props에 접근할 수 있습니다. 다음은 클릭하면 `message` prop과 함께 alert을 표시하는 버튼입니다:</Trans>

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Playing!">
        Play Movie
      </AlertButton>
      <AlertButton message="Uploading!">
        Upload Image
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

This lets these two buttons show different messages. Try changing the messages passed to them.
<Trans>이렇게 하면 이 두 버튼이 서로 다른 메시지를 표시할 수 있습니다. 전달되는 메시지를 변경해 보세요.</Trans>

### Passing event handlers as props<Trans>이벤트 핸들러를 props로 전달하기</Trans> {/*passing-event-handlers-as-props*/}

Often you'll want the parent component to specify a child's event handler. Consider buttons: depending on where you're using a `Button` component, you might want to execute a different function—perhaps one plays a movie and another uploads an image. 
<Trans>가끔 부모 컴포넌트가 자식의 이벤트 핸들러를 지정하고 싶을 때가 있습니다. `Button` 컴포넌트를 사용하는 위치에 따라 버튼은 동영상을 재생하고 다른 버튼은 이미지를 업로드하는 등 서로 다른 기능을 실행하고 싶을 수 있습니다.</Trans>

To do this, pass a prop the component receives from its parent as the event handler like so:
<Trans>이렇게 하기 위해서는, 컴포넌트가 부모로부터 받는 prop을 이벤트 핸들러로 다음과 같이 전달합니다:</Trans>

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Here, the `Toolbar` component renders a `PlayButton` and an `UploadButton`:
<Trans>여기서 `Toolbar` 컴포넌트는 `PlayButton`과 `UploadButton`을 렌더링합니다:</Trans>

- `PlayButton` passes `handlePlayClick` as the `onClick` prop to the `Button` inside.
- `UploadButton` passes `() => alert('Uploading!')` as the `onClick` prop to the `Button` inside.
 
<TransBlock>
  - `PlayButton`은 `handlePlayClick`을 `onClick` prop으로 내부의 `Button`에 전달합니다.
  - `UploadButton`은 `() => alert('Uploading!')`를 `onClick` prop으로 내부의 `Button`에 전달합니다.
</TransBlock>

Finally, your `Button` component accepts a prop called `onClick`. It passes that prop directly to the built-in browser `<button>` with `onClick={onClick}`. This tells React to call the passed function on click.
<Trans>마지막으로 `Button` 컴포넌트는 `onClick`이라는 prop을 받습니다. 해당 prop을 내장 브라우저의 `<button>`으로 직접 전달하며, `onClick={onClick}`을 사용합니다. 이는 클릭 시 전달된 함수를 호출하도록 React에 지시합니다.</Trans>

If you use a [design system](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969), it's common for components like buttons to contain styling but not specify behavior. Instead, components like `PlayButton` and `UploadButton` will pass event handlers down.
<Trans>[디자인 시스템](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)을 사용하는 경우, 버튼 같은 컴포넌트에 스타일링은 포함하지만 동작을 지정하지 않는 것이 일반적입니다. 대신 `PlayButton` 및 `UploadButton`과 같은 컴포넌트는 이벤트 핸들러를 전달합니다.</Trans>

### Naming event handler props<Trans>이벤트 핸들러 props 이름 정하기</Trans> {/*naming-event-handler-props*/}

Built-in components like `<button>` and `<div>` only support [browser event names](/reference/react-dom/components/common#common-props) like `onClick`. However, when you're building your own components, you can name their event handler props any way that you like.
<Trans>`<button>` 및 `<div>`와 같은 기본 제공 컴포넌트는 `onClick`과 같은 [브라우저 이벤트 이름](/reference/react-dom/components/common#common-props)만 지원합니다. 하지만 자체 컴포넌트를 빌드할 때는 이벤트 핸들러 prop의 이름을 원하는 방식으로 지정할 수 있습니다.</Trans>

By convention, event handler props should start with `on`, followed by a capital letter.
<Trans>관례상 이벤트 핸들러 props은 `on`으로 시작하고 그 뒤에 대문자가 와야 합니다.</Trans>

For example, the `Button` component's `onClick` prop could have been called `onSmash`:
<Trans>예를 들어 `Button` 컴포넌트의 `onClick` prop은 `onSmash`로 호출할 수 있습니다:</Trans>

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onSmash={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

In this example, `<button onClick={onSmash}>` shows that the browser `<button>` (lowercase) still needs a prop called `onClick`, but the prop name received by your custom `Button` component is up to you!
<Trans>이 예제에서 `<button onClick={onSmash}>`는 브라우저 `<button>`(소문자)에 여전히 `onClick`이라는 prop이 필요하지만 사용자 정의 `Button` 컴포넌트가 수신하는 prop 이름은 사용자가 지정할 수 있음을 보여줍니다!</Trans>

When your component supports multiple interactions, you might name event handler props for app-specific concepts. For example, this `Toolbar` component receives `onPlayMovie` and `onUploadImage` event handlers:
<Trans>컴포넌트가 여러 상호작용을 지원하는 경우, 앱별 개념에 따라 이벤트 핸들러 props의 이름을 지정할 수 있습니다. 예를 들어, 이 `Toolbar` 컴포넌트는 `onPlayMovie` 및 `onUploadImage` 이벤트 핸들러를 수신합니다:</Trans>

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Notice how the `App` component does not need to know *what* `Toolbar` will do with `onPlayMovie` or `onUploadImage`. That's an implementation detail of the `Toolbar`. Here, `Toolbar` passes them down as `onClick` handlers to its `Button`s, but it could later also trigger them on a keyboard shortcut. Naming props after app-specific interactions like `onPlayMovie` gives you the flexibility to change how they're used later.
<Trans>`App` 컴포넌트는 `Toolbar`가 `onPlayMovie` 또는 `onUploadImage`로 어떤 작업을 수행할지 알 필요가 없다는 점을 주목하세요. 이것이 `Toolbar`의 구현 세부 사항입니다. 여기서 `Toolbar`는 `Button`에 `onClick` 핸들러로 전달하지만 나중에 키보드 단축키에서 촉발시킬 수도 있습니다. props의 이름을 `onPlayMovie`와 같은, 앱별 상호작용의 이름을 따서 지정하면 나중에 사용 방식을 유연하게 변경할 수 있습니다.</Trans>

## Event propagation<Trans>이벤트 전파</Trans> {/*event-propagation*/}

Event handlers will also catch events from any children your component might have. We say that an event "bubbles" or "propagates" up the tree: it starts with where the event happened, and then goes up the tree.
<Trans>이벤트 핸들러는 컴포넌트에 있을 수 있는 모든 하위 컴포넌트의 이벤트도 포착합니다. 이벤트가 트리 위로 '버블' 또는 '전파'되는 것을 이벤트가 발생한 곳에서 시작하여 트리 위로 올라간다고 합니다.</Trans>

This `<div>` contains two buttons. Both the `<div>` *and* each button have their own `onClick` handlers. Which handlers do you think will fire when you click a button?
<Trans>이 `<div>`는 2개의 버튼을 포함합니다. `<div>`와 각 버튼에는 모두 고유한 `onClick`핸들러가 있습니다. 버튼을 클릭하면 어떤 핸들러가 실행될까요?</Trans>

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

If you click on either button, its `onClick` will run first, followed by the parent `<div>`'s `onClick`. So two messages will appear. If you click the toolbar itself, only the parent `<div>`'s `onClick` will run.
<Trans>두 버튼 중 하나를 클릭하면 해당 버튼의 `onClick`이 먼저 실행되고 그다음에 부모 `<div>`의 `onClick`이 실행됩니다. 따라서 두 개의 메시지가 나타납니다. 툴바 자체를 클릭하면 부모 `<div>`의 `onClick`만 실행됩니다.</Trans>

<Pitfall>

All events propagate in React except `onScroll`, which only works on the JSX tag you attach it to.
<Trans>첨부한 JSX 태그에서만 작동하는 `onScroll`을 제외한 모든 이벤트는 React에서 전파됩니다.</Trans>

</Pitfall>

### Stopping propagation<Trans>전파 중지하기</Trans> {/*stopping-propagation*/}

Event handlers receive an **event object** as their only argument. By convention, it's usually called `e`, which stands for "event". You can use this object to read information about the event.
<Trans>이벤트 핸들러는 **이벤트 객체**를 유일한 인수로 받습니다. 이것은 관례상 "event"를 의미하는 `e`라고 불립니다. 이 객체를 사용하여 이벤트에 대한 정보를 읽을 수 있습니다.</Trans>

That event object also lets you stop the propagation. If you want to prevent an event from reaching parent components, you need to call `e.stopPropagation()` like this `Button` component does:
<Trans>해당 이벤트 객체를 사용하면 전파를 중지할 수도 있습니다. 이벤트가 상위 컴포넌트에 도달하지 못하도록 하려면 아래 `Button` 컴포넌트처럼 `e.stopPropagation()`을 호출해야 합니다:</Trans>

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

When you click on a button:
<Trans>버튼을 클릭하면:</Trans>

1. React calls the `onClick` handler passed to `<button>`. 
2. That handler, defined in `Button`, does the following:
    * Calls `e.stopPropagation()`, preventing the event from bubbling further.
    * Calls the `onClick` function, which is a prop passed from the `Toolbar` component.
3. That function, defined in the `Toolbar` component, displays the button's own alert.
4. Since the propagation was stopped, the parent `<div>`'s `onClick` handler does *not* run.
 
<TransBlock>
1. React는 `<button>`에 전달된 `onClick` 핸들러를 호출합니다.
2. `Button`에 정의된 이 핸들러는 다음을 수행합니다:
    - 이벤트가 더 이상 버블링되지 않도록 `e.stopPropagation()`을 호출합니다.
    - `Toolbar` 컴포넌트에서 전달된 props인 `onClick`함수를 호출합니다.
3. `Toolbar` 컴포넌트에 정의된 이 함수는 버튼 자체의 경고를 표시합니다.
4. 전파가 중지되었으므로 부모 `<div>`의 `onClick` 핸들러가 실행되지 않습니다.
</TransBlock>

As a result of `e.stopPropagation()`, clicking on the buttons now only shows a single alert (from the `<button>`) rather than the two of them (from the `<button>` and the parent toolbar `<div>`). Clicking a button is not the same thing as clicking the surrounding toolbar, so stopping the propagation makes sense for this UI.
<Trans>`e.stopPropagation()` 덕분에 이제 버튼을 클릭하면 두 개의 알림(`<button>`과 부모 툴바 `<div>`)이 아닌 하나의 알림(`<button>`에서)만 표시됩니다. 버튼을 클릭하는 것과 주변 툴바를 클릭하는 것은 다르므로 이 UI에서는 전파를 중지하는 것이 적절합니다.</Trans>

<DeepDive>

#### Capture phase events<Trans>캡처 단계 이벤트</Trans> {/*capture-phase-events*/}

In rare cases, you might need to catch all events on child elements, *even if they stopped propagation*. For example, maybe you want to log every click to analytics, regardless of the propagation logic. You can do this by adding `Capture` at the end of the event name:
<Trans>드물지만 하위 요소에서 *전파가 중지된 경우에도* 하위 요소의 모든 이벤트를 포착해야 하는 경우가 있습니다. 예를 들어, 전파 로직에 관계없이 모든 클릭을 분석도구에 기록하고자 할 수 있습니다. 이벤트 이름 끝에 `Capture`를 추가하면 이 작업을 수행할 수 있습니다:</Trans>

```js
<div onClickCapture={() => { /* this runs first | 먼저 실행됨 */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Each event propagates in three phases: 
<Trans>각 이벤트는 세 단계로 전파됩니다:</Trans>

1. It travels down, calling all `onClickCapture` handlers.
2. It runs the clicked element's `onClick` handler. 
3. It travels upwards, calling all `onClick` handlers.

<TransBlock>
1. 아래로 이동하면서 모든 `onClickCapture` 핸들러를 호출합니다.
2. 클릭한 요소의 `onClick` 핸들러를 실행합니다.
3. 상위로 이동하면서 모든 `onClick` 핸들러를 호출합니다.
</TransBlock>

Capture events are useful for code like routers or analytics, but you probably won't use them in app code.
<Trans>캡처 이벤트는 라우터나 분석과 같은 코드에는 유용하지만, 앱 코드에는 잘 사용하지 않을 것입니다.</Trans>

</DeepDive>

### Passing handlers as alternative to propagation<Trans>전파의 대안으로 핸들러 전달하기</Trans> {/*passing-handlers-as-alternative-to-propagation*/}

Notice how this click handler runs a line of code _and then_ calls the `onClick` prop passed by the parent:
<Trans>이 클릭 핸들러가 코드 한 줄을 실행한 다음 부모가 전달한 `onClick` prop을 호출하는 방식을 주목하세요:</Trans>

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

You could add more code to this handler before calling the parent `onClick` event handler, too. This pattern provides an *alternative* to propagation. It lets the child component handle the event, while also letting the parent component specify some additional behavior. Unlike propagation, it's not automatic. But the benefit of this pattern is that you can clearly follow the whole chain of code that executes as a result of some event.
<Trans>부모 `onClick` 이벤트 핸들러를 호출하기 전에 이 핸들러에 코드를 더 추가할 수도 있습니다. 이 패턴은 전파에 대한 *대안*을 제공합니다. 자식 컴포넌트가 이벤트를 처리하는 동시에 부모 컴포넌트가 몇 가지 추가 동작을 지정할 수 있게 해줍니다. 프로퍼게이션과 달리 자동이 아닙니다. 하지만 이 패턴의 장점은 특정 이벤트의 결과로 실행되는 전체 체인 코드를 명확하게 따라갈 수 있다는 것입니다.</Trans>

If you rely on propagation and it's difficult to trace which handlers execute and why, try this approach instead.
<Trans>전파에 의존하고 있고 어떤 핸들러가 실행되고 왜 실행되는지 추적하기 어려운 경우 대신 이 접근 방식을 시도해 보세요.</Trans>

### Preventing default behavior<Trans>기본 동작 방지</Trans> {/*preventing-default-behavior*/}

Some browser events have default behavior associated with them. For example, a `<form>` submit event, which happens when a button inside of it is clicked, will reload the whole page by default:
<Trans>일부 브라우저 이벤트에는 연결된 기본 동작이 있습니다. 예를 들어, `<form>` submit 이벤트는 내부의 버튼을 클릭할 때 발생하며 기본적으로 전체 페이지를 다시 로드합니다:</Trans>

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

You can call `e.preventDefault()` on the event object to stop this from happening:
<Trans>이벤트 객체에서 `e.preventDefault()`를 호출하여 이런 일이 발생하지 않도록 할 수 있습니다:</Trans>

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Don't confuse `e.stopPropagation()` and `e.preventDefault()`. They are both useful, but are unrelated:
<Trans>`e.stopPropagation()`과 `e.preventDefault()`를 혼동하지 마세요. 둘 다 유용하지만 서로 관련이 없습니다: </Trans>

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation) stops the event handlers attached to the tags above from firing.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault) prevents the default browser behavior for the few events that have it.

<TransBlock>
- [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation)은 위 태그에 연결된 이벤트 핸들러의 실행을 중지합니다.
- [`e.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault)는 해당 이벤트가 있는 몇 가지 이벤트에 대해 기본 브라우저 동작을 방지합니다.
</TransBlock>

## Can event handlers have side effects?<Trans>이벤트 핸들러에 부작용이 생길 수 있나요?</Trans> {/*can-event-handlers-have-side-effects*/}

Absolutely! Event handlers are the best place for side effects.
<Trans>물론입니다! 이벤트 핸들러는 부작용이 가장 많이 발생하는 곳입니다.</Trans>

Unlike rendering functions, event handlers don't need to be [pure](/learn/keeping-components-pure), so it's a great place to *change* something—for example, change an input's value in response to typing, or change a list in response to a button press. However, in order to change some information, you first need some way to store it. In React, this is done by using [state, a component's memory.](/learn/state-a-components-memory) You will learn all about it on the next page.
<Trans>렌더링 함수와 달리 이벤트 핸들러는 [순수](/learn/keeping-components-pure)할 필요가 없으므로 입력에 대한 응답으로 입력 값을 변경하거나 버튼 누름에 대한 응답으로 목록을 변경하는 등 무언가를 변경하기에 좋은 곳입니다. 하지만 일부 정보를 변경하려면 먼저 정보를 저장할 방법이 필요합니다. React에서는 [컴포넌트의 메모리인 state](/learn/state-a-components-memory)를 사용해 이 작업을 수행합니다. 다음 페이지에서 이에 대한 모든 것을 배우게 될 것입니다.</Trans>

<Recap>

* You can handle events by passing a function as a prop to an element like `<button>`.
* Event handlers must be passed, **not called!** `onClick={handleClick}`, not `onClick={handleClick()}`.
* You can define an event handler function separately or inline.
* Event handlers are defined inside a component, so they can access props.
* You can declare an event handler in a parent and pass it as a prop to a child.
* You can define your own event handler props with application-specific names.
* Events propagate upwards. Call `e.stopPropagation()` on the first argument to prevent that.
* Events may have unwanted default browser behavior. Call `e.preventDefault()` to prevent that.
* Explicitly calling an event handler prop from a child handler is a good alternative to propagation.

<TransBlock>
- `<button>`과 같은 요소에 함수를 prop으로 전달하여 이벤트를 처리할 수 있습니다.
- 이벤트 핸들러는 **호출이 아니라** 전달해야 합니다! `onClick={handleClick()}`이 아니라 `onClick={handleClick}`입니다.
- 이벤트 핸들러 함수를 개별적으로 또는 인라인으로 정의할 수 있습니다.
- 이벤트 핸들러는 컴포넌트 내부에 정의되므로 props에 액세스할 수 있습니다.
- 부모에서 이벤트 핸들러를 선언하고 이를 자식에게 prop으로 전달할 수 있습니다.
- 이름을 지정하여 이벤트 핸들러 prop을 직접 정의할 수 있습니다.
- 이벤트는 위쪽으로 전파됩니다. 이를 방지하려면 첫 번째 인수에 `e.stopPropagation()`을 호출하세요.
- 이벤트에 원치 않는 기본 브라우저 동작이 있을 수 있습니다. 이를 방지하려면 `e.preventDefault()`를 호출하세요.
- 자식 핸들러에서 이벤트 핸들러 prop을 명시적으로 호출하는 것은 전파에 대한 좋은 대안입니다.
</TransBlock>

</Recap>

<Challenges>

#### Fix an event handler<Trans>이벤트 핸들러 수정하기</Trans> {/*fix-an-event-handler*/}

Clicking this button is supposed to switch the page background between white and black. However, nothing happens when you click it. Fix the problem. (Don't worry about the logic inside `handleClick`—that part is fine.)
<Trans>이 버튼을 클릭하면 페이지 배경이 흰색과 검은색으로 전환되어야 합니다. 하지만 이 버튼을 클릭해도 아무 일도 일어나지 않습니다. 문제를 해결하세요. (`handleClick` 내부의 로직은 걱정하지 마세요. 그 부분은 괜찮습니다.)</Trans>

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

<Solution>

The problem is that `<button onClick={handleClick()}>` _calls_ the `handleClick` function while rendering instead of _passing_ it. Removing the `()` call so that it's `<button onClick={handleClick}>` fixes the issue:
<Trans>문제는 `<button onClick={handleClick()}>`이 렌더링하는 동안 `handleClick` 함수를 *전달*하지 않고 *호출*한다는 것입니다. `()` 호출을 제거하여 `<button onClick={handleClick}>`이 되도록 하면 문제가 해결됩니다:</Trans>

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

Alternatively, you could wrap the call into another function, like `<button onClick={() => handleClick()}>`:
<Trans>또는 `<button onClick={() => handleClick()}>`와 같이 호출을 다른 함수로 감쌀 수도 있습니다:</Trans>

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Toggle the lights
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Wire up the events<Trans>이벤트 연결하기</Trans> {/*wire-up-the-events*/}

This `ColorSwitch` component renders a button. It's supposed to change the page color. Wire it up to the `onChangeColor` event handler prop it receives from the parent so that clicking the button changes the color.
<Trans>이 `ColorSwitch` 컴포넌트는 버튼을 렌더링합니다. 페이지 색상을 변경해야 합니다. 버튼을 클릭하면 색상이 변경되도록, 부모로부터 수신하는 `onChangeColor` 이벤트 핸들러 prop에 연결합시다.</Trans>

After you do this, notice that clicking the button also increments the page click counter. Your colleague who wrote the parent component insists that `onChangeColor` does not increment any counters. What else might be happening? Fix it so that clicking the button *only* changes the color, and does _not_ increment the counter.
<Trans>이 작업을 수행한 후 버튼을 클릭하면 페이지 클릭 카운터도 증가하는 것을 확인할 수 있습니다. 부모 컴포넌트를 작성한 동료는 `onChangeColor`가 카운터를 증가시키지 않는다고 주장합니다. 또 어떤 일이 벌어지고 있을까요? 버튼을 클릭하면 *색상만* 변경되고 카운터가 증가하지 않도록 수정하세요.</Trans>

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Change color
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

First, you need to add the event handler, like `<button onClick={onChangeColor}>`.
<Trans>먼저 `<button onClick={onChangeColor}>`와 같은 이벤트 핸들러를 추가해야 합니다.</Trans>

However, this introduces the problem of the incrementing counter. If `onChangeColor` does not do this, as your colleague insists, then the problem is that this event propagates up, and some handler above does it. To solve this problem, you need to stop the propagation. But don't forget that you should still call `onChangeColor`.
<Trans>그러나 이렇게 하면 카운터가 증가하는 문제가 발생합니다. 동료가 주장한 것처럼 `onChangeColor`가 이 작업을 수행하지 않는다면, 이 이벤트가 상위로 전파되어 위의 일부 핸들러가 이를 수행하는게 문제일 것입니다. 이 문제를 해결하려면 전파를 중지해야 합니다. 하지만 여전히 `onChangeColor`를 호출해야 한다는 것을 잊지 마세요.</Trans>

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Change color
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Clicks on the page: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
