---
title: "<textarea>"
translators: [유은미, 고석영, 정재남]
---

<Intro>

The [built-in browser `<textarea>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) lets you render a multiline text input.
<Trans>[브라우저 빌트인 `<textarea>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)를 사용하면 여러줄의 텍스트 입력을 렌더링 할 수 있습니다.</Trans>


```js
<textarea />
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `<textarea>` {/*textarea*/}

To display a text area, render the [built-in browser `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) component.
<Trans>textarea을 표시하려면 [브라우저 빌트인 `<textarea>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea)를 렌더링 합니다.</Trans>

```js
<textarea name="postContent" />
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Props {/*props*/}

`<textarea>` supports all [common element props.](/reference/react-dom/components/common#props)
<Trans>`<textarea>`는 모든 [공통 엘리먼트의 props](/reference/react-dom/components/common#props)를 지원합니다.</Trans>

You can [make a text area controlled](#controlling-a-text-area-with-a-state-variable) by passing a `value` prop:
<Trans>`value` prop을 전달함으로써 [이를 제어 컴포넌트가 되게 할 수 있습니다](#controlling-a-text-area-with-a-state-variable):</Trans>

* `value`: A string. Controls the text inside the text area.  
<Trans outdent>`value`: 문자열 값. textarea 내부의 텍스트를 제어합니다.</Trans>

When you pass `value`, you must also pass an `onChange` handler that updates the passed value.
<Trans>`value`를 전달할 때는 전달된 value를 업데이트 하는 `onChange` 핸들러도 함께 전달해야 합니다. </Trans>

If your `<textarea>` is uncontrolled, you may pass the `defaultValue` prop instead:
<Trans>`<textarea>`가 비제어 컴포넌트인 경우에는, 대신 `defaultValue`를 전달할 수 있습니다:</Trans>

* `defaultValue`: A string. Specifies [the initial value](#providing-an-initial-value-for-a-text-area) for a text area.
<Trans outdent>`defaultValue`: 문자열 값. textarea의 [초기값](#providing-an-initial-value-for-a-text-area)을 지정합니다.</Trans>

These `<textarea>` props are relevant both for uncontrolled and controlled text areas:
<Trans>다음 `<textarea>` prop들은 비제어 및 제어 컴포넌트 모두에 영향을 미칩니다:</Trans>

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-autocomplete): Either `'on'` or `'off'`. Specifies the autocomplete behavior.
<Trans>[`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-autocomplete): `'on'` 혹은 `'off'`. 자동 완성 동작을 지정합니다.</Trans>

* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-autofocus): A boolean. If `true`, React will focus the element on mount.
<Trans>[`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-autofocus): 불리언. `true`일 경우 마운트시 엘리먼트에 초점이 맞춰집니다.</Trans>

* `children`: `<textarea>` does not accept children. To set the initial value, use `defaultValue`.
<Trans>`children`: `<textarea>`는 자식 요소를 받지 않습니다. 초기값을 지정하기 위해서는 `defaultValue`를 사용하세요.</Trans>

* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-cols): A number. Specifies the default width in average character widths. Defaults to `20`.
<Trans>[`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-cols): 숫자. 표준 문자 너비를 기준으로 기본 칸 수를 지정합니다. 기본 값은 `20`입니다.</Trans>

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-disabled): A boolean. If `true`, the input will not be interactive and will appear dimmed.
<Trans>[`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-disabled): 불리언. `true`일 경우, 입력이 비활성화되고 회색으로 표시됩니다.</Trans>

* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-form): A string. Specifies the `id` of the `<form>` this input belongs to. If omitted, it's the closest parent form.
<Trans>[`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-form): 문자열. 이 textarea가 속한 `<form>`의 `id`를 지정합니다. 생략하면 가장 가까운 상위 form이 됩니다.</Trans>

* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-maxlength): A number. Specifies the maximum length of text.
<Trans>[`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-maxlength): 숫자. 텍스트의 최대 길이를 지정합니다.</Trans>

* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-minlength): A number. Specifies the minimum length of text.
<Trans>[`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-minlength): 숫자. 텍스트의 최소 길이를 지정합니다.</Trans>

* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): A string. Specifies the name for this input that's [submitted with the form.](#reading-the-textarea-value-when-submitting-a-form)
<Trans>[`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): 문자열. [form 제출시](#reading-the-textarea-value-when-submitting-a-form) 해당 textarea의 이름을 지정합니다.</Trans>

* `onChange`: An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Required for [controlled text areas.](#controlling-a-text-area-with-a-state-variable) Fires immediately when the input's value is changed by the user (for example, it fires on every keystroke). Behaves like the browser [`input` event.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
<Trans>`onChange`:  [이벤트 핸들러](/reference/react-dom/components/common#event-handler). [제어 컴포넌트](#controlling-a-text-area-with-a-state-variable)로 사용할 때 필요합니다. 사용자에 의해 입력 값이 변경되는 즉시 실행됩니다. (예: 각 키 입력시 실행됨). 브라우저의 [`input` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)와 동일하게 동작합니다.</Trans>

* `onChangeCapture`: A version of `onChange` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onChangeCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에 실행되는 버전의 `onChange`입니다.</Trans>

* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. function. Fires immediately when the value is changed by the user. For historical reasons, in React it is idiomatic to use `onChange` instead which works similarly.
<Trans>[`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [이벤트 핸들러](/reference/react-dom/components/common#event-handler). 사용자에 의해 값이 변경될 때마다 즉시 실행됩니다. 역사적인 이유로, 리액트에서는 일반적으로 비슷하게 작동하는 `onChange`를 대신 사용합니다.</Trans>

* `onInputCapture`: A version of `onInput` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onInputCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에 실행되는 버전의 `onInput`입니다.</Trans>

* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires if an input fails validation on form submit. Unlike the built-in `invalid` event, the React `onInvalid` event bubbles.
<Trans>[`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [이벤트 핸들러](/reference/react-dom/components/common#event-handler). form 제출시 유효성 검사에 실패하면 발생합니다. 빌트인 `invalid` 이벤트와는 달리, 리액트 `onInvalid` 이벤트는 버블이 발생합니다.</Trans>

* `onInvalidCapture`: A version of `onInvalid` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onInvalidCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에 실행되는 버전의 `onInvalid`입니다.</Trans>

* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires after the selection inside the `<textarea>` changes. React extends the `onSelect` event to also fire for empty selection and on edits (which may affect the selection).
<Trans>[`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): [이벤트 핸들러](/reference/react-dom/components/common#event-handler). `<textarea>`의 내부 선택 영역이 변경되면 발생합니다. 리액트는 비어있는 선택과 (선택에 영향을 줄 수 있는) 편집에 대해서도  `onSelect` 이벤트가 발동되도록 확장했습니다.</Trans>

* `onSelectCapture`: A version of `onSelect` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onSelectCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에 실행되는 버전의 `onSelect`입니다.</Trans>

* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-placeholder): A string. Displayed in a dimmed color when the text area value is empty.
<Trans>[`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-placeholder): 문자열. 입력 값이 비어 있을 때 희미한 색상으로 표시됩니다.</Trans>

* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-readonly): A boolean. If `true`, the text area is not editable by the user.
<Trans>[`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-readonly): 불리언.  `true` 일 경우 유저는 textarea을 수정할 수 없습니다.</Trans>

* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-required): A boolean. If `true`, the value must be provided for the form to submit.
<Trans>[`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-required): 불리언. `true`일 경우 form 제출시 값이 있어야 합니다.</Trans>

* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-rows): A number. Specifies the default height in average character heights. Defaults to `2`.
<Trans>[`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-rows): 숫자. 표준 문자 높이를 기준으로 기본 줄 수를 지정합니다. 기본 값은 `2`입니다.</Trans>

* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-wrap): Either `'hard'`, `'soft'`, or `'off'`. Specifies how the text should be wrapped when submitting a form.
<Trans>[`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attr-wrap): `'hard'`, `'soft'`, 혹은`'off'`. form 제출시 텍스트를 어떻게 줄바꿈할지를 지정합니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

- Passing children like `<textarea>something</textarea>` is not allowed. [Use `defaultValue` for initial content.](#providing-an-initial-value-for-a-text-area)
- If a text area receives a string `value` prop, it will be [treated as controlled.](#controlling-a-text-area-with-a-state-variable)
- A text area can't be both controlled and uncontrolled at the same time.
- A text area cannot switch between being controlled or uncontrolled over its lifetime.
- Every controlled text area needs an `onChange` event handler that synchronously updates its backing value.

<TransBlock>
- `<textarea>something</textarea>`처럼 자식 요소를 전달하는 것은 허용되지 않습니다. [초기값은 `defaultValue`를 사용하세요.](#providing-an-initial-value-for-a-text-area)
- 문자열 `value` prop을 제공하면 [제어 컴포넌트로 취급됩니다.](#controlling-a-text-area-with-a-state-variable)
- textarea는 제어 컴포넌트이면서 동시에 비제어 컴포넌트일 수는 없습니다.
- textarea는 생명주기 동안 제어 컴포넌트와 비제어 컴포넌트 사이를 전환할 수 없습니다.
- 제어컴포넌트는 값을 동기적으로 업데이트 하는 `onChange` 이벤트 핸들러가 필요합니다.
</TransBlock>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Displaying a text area<Trans>textarea 표시하기</Trans> {/*displaying-a-text-area*/}

Render `<textarea>` to display a text area. You can specify its default size with the [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) and [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols) attributes, but by default the user will be able to resize it. To disable resizing, you can specify `resize: none` in the CSS.

<Trans>textarea를 표시하려면 `<textarea>`를 렌더하세요. [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) 및 [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols) 속성으로 기본 크기를 정할 수 있지만, 기본적으로는 사용자가 재조정할 수 있습니다. 재조정을 비활성화하려면 CSS에서`resize: none`을 지정하세요.</Trans>

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Write your post:
      <textarea name="postContent" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Providing a label for a text area <Trans>textarea에 label 제공하기</Trans> {/*providing-a-label-for-a-text-area*/}

Typically, you will place every `<textarea>` inside a [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) tag. This tells the browser that this label is associated with that text area. When the user clicks the label, the browser will focus the text area. It's also essential for accessibility: a screen reader will announce the label caption when the user focuses the text area.
<Trans>흔히 `<textarea>`를 `<label>` 태그 안에 위치시킵니다. 이렇게 하면 해당 label이 textarea와 연결되어 있음을 의미하게 됩니다. 사용자가 label을 클릭하면 브라우저가 textarea에 초점을 맞춥니다. 스크린 리더는 사용자가 textarea에 초점을 맞추면 label 캡션을 읽어주므로, 접근성을 위해서도 이렇게 하는 것이 필수적입니다.</Trans>

If you can't nest `<textarea>` into a `<label>`, associate them by passing the same ID to `<textarea id>` and [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) To avoid conflicts between instances of one component, generate such an ID with [`useId`.](/reference/react/useId)
<Trans>`<textarea>`를 `<label>`에 중첩시킬 수 없는 경우에는, `<textarea id>`와 [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor)에 동일한 ID를 전달하여 연결하세요. 한 컴포넌트에서 여러 인스턴스간의 충돌을 피하기 위해서는 다음과 같이 [`useId`](https://beta.reactjs.org/reference/react/useId)로 ID를 생성하세요.</Trans>


<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Write your post:
      </label>
      <textarea
        id={postTextAreaId}
        name="postContent"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Providing an initial value for a text area<Trans>textarea의 초기값 제공하기</Trans> {/*providing-an-initial-value-for-a-text-area*/}

You can optionally specify the initial value for the text area. Pass it as the `defaultValue` string.
<Trans>선택적으로 textarea의 초기값을 지정할 수 있습니다. `defaultValue`에 문자열을 전달하세요.</Trans>

<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

Unlike in HTML, passing initial text like `<textarea>Some content</textarea>` is not supported.
<Trans>HTML과 달리, 초기 텍스트를 `<textarea>Some content</textarea>`와 같이 자식 요소로 전달하는 것은 지원하지 않습니다.</Trans>

</Pitfall>

---

### Reading the text area value when submitting a form<Trans>form 제출시 textarea 값 읽기</Trans> {/*reading-the-text-area-value-when-submitting-a-form*/}

Add a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) around your textarea with a [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) inside. It will call your `<form onSubmit>` event handler. By default, the browser will send the form data to the current URL and refresh the page. You can override that behavior by calling `e.preventDefault()`. Read the form data with [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Trans>textarea 주위에 [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)을 추가하고, form 안에 [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)를 넣으세요. 그러면 `<form onSubmit>` 이벤트 핸들러가 호출됩니다. 기본적으로 브라우저는 form 데이터를 현재 URL로 전송하고 페이지를 새로고침 합니다. `e.preventDefault()`를 호출하여 이 동작을 재 정의할 수 있습니다. form 데이터를 읽으려면 [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)를 사용하세요.</Trans>

<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Post title: <input name="postTitle" defaultValue="Biking" />
      </label>
      <label>
        Edit your post:
        <textarea
          name="postContent"
          defaultValue="I really enjoyed biking yesterday!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Reset edits</button>
      <button type="submit">Save post</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Give a `name` to your `<textarea>`, for example `<textarea name="postContent" />`. The `name` you specified will be used as a key in the form data, for example `{ postContent: "Your post" }`.
<Trans>`<textarea name="postContent" />`와 같이 `<textarea>`에 `name`를 지정하세요. 이렇게 지정한 `name`은 `{ postContent: "Your post" }`와 같이 form 데이터의 키로 사용될 것입니다.</Trans>

</Note>

<Pitfall>

By default, *any* `<button>` inside a `<form>` will submit it. This can be surprising! If you have your own custom `Button` React component, consider returning [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) instead of `<button>`. Then, to be explicit, use `<button type="submit">` for buttons that *are* supposed to submit the form.
<Trans>기본적으로 `<form>` 안의 어떠한 `<button>`이든 클릭시 제출될 것입니다. 이러한 동작이 당황스러울 수 있습니다! 사용자정의 `Button` 리액트 컴포넌트를 사용하고 있다면 `<button>` 대신 [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button)로 작성하는 것을 고려하세요. 다음 form 제출 버튼에는 [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button)`을 명확하게 표시하세요.</Trans>

</Pitfall>

---

### Controlling a text area with a state variable <Trans>state 변수를 사용하여 textarea 제어하기</Trans> {/*controlling-a-text-area-with-a-state-variable*/}

A text area like `<textarea />` is *uncontrolled.* Even if you [pass an initial value](#providing-an-initial-value-for-a-text-area) like `<textarea defaultValue="Initial text" />`, your JSX only specifies the initial value, not the value right now.
<Trans>`<textarea />`는 기본적으로 비제어 컴포넌트입니다. `<textarea defaultValue="Initial text" />`와 같이 [초기값을 전달](#providing-an-initial-value-for-a-text-area)하더라도, JSX는 초기값만을 지정할 뿐, 현재값은 지정하지 않습니다.</Trans>

**To render a _controlled_ text area, pass the `value` prop to it.** React will force the text area to always have the `value` you passed. Typically, you will control a text area by declaring a [state variable:](/reference/react/useState)
<Trans>**_제어_ 컴포넌트로 렌더링하기 위해서는 `value` prop을 전달하세요.** 리액트는 textarea가 항상 전달한 `value`를 사용하도록 강제합니다. 일반적으로 [state 변수](https://beta.reactjs.org/reference/react/useState)로 textarea를 제어합니다.</Trans>

```js {2-3,7-10}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Declare a state variable...
                                                      // state 변수 정의...
  // ...
  return (
    <textarea
      value={postContent} // ...force the input's value to match the state variable...
                          // ...input값이 state 변수와 일치하도록 강제...
      onChange={e => setPostContent(e.target.value)} // ... and update the state variable on any edits!
                                                     // ... 그리고 수정할 때마다 state 변수를 업데이트하세요!
    />
  );
}
```

This is useful if you want to re-render some part of the UI in response to every keystroke.
<Trans>다음은 모든 키 입력에 응답하여 UI의 일부를 다시 렌더링 하려는 경우에 유용합니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Enter some markdown:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

**If you pass `value` without `onChange`, it will be impossible to type into the text area.** When you control an text area by passing some `value` to it, you *force* it to always have the value you passed. So if you pass a state variable as a `value` but forget to update that state variable synchronously during the `onChange` event handler, React will revert the text area after every keystroke back to the `value` that you specified.
<Trans>**`onChange` 없이 `value`만 전달하면 textarea에 입력할 수 없습니다.** textarea에 `value`를 전달하여 제어하면 항상 전달한 값을 갖도록 *강제*합니다. 따라서 state 변수를 `value`로 전달했지만 `onChange` 이벤트 핸들러에서 해당 상태 변수를 동기적으로 업데이트 하는 것을 잊어버리면, 리액트는 키 입력시마다 textarea를 지정한 `value`으로 되돌립니다.</Trans>

</Pitfall>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### My text area doesn't update when I type into it<Trans>textarea에 입력해도 업데이트 되지 않습니다</Trans> {/*my-text-area-doesnt-update-when-i-type-into-it*/}

If you render a text area with `value` but no `onChange`, you will see an error in the console:
`value`는 있지만 `onChange`는 없는 textarea를 렌더링하면 콘솔에 에러가 표시됩니다:

```js
// 🔴 Bug: controlled text area with no onChange handler
// 🔴 버그: 제어되는 textarea에 onChange 핸들러가 없습니다
<textarea value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
<Trans>form 필드에 `value` 프로퍼티만 제공하고 `onChange` 핸들러는 제공하지 않았습니다. 이런 경우 읽기전용 필드가 렌더링됩니다. 필드가 변경 가능해야 하는 경우 `defaultValue`를 사용하십시오. 그렇지 않으면 `onChange` 또는 `readOnly`를 설정하세요.</Trans>

</ConsoleBlock>

As the error message suggests, if you only wanted to [specify the *initial* value,](#providing-an-initial-value-for-a-text-area) pass `defaultValue` instead:
<Trans>오류메세지에서 제안하듯이, [초기값](#providing-an-initial-value-for-a-text-area)만 지정하고 싶다면 대신 `defaultValue`를 사용하세요:</Trans>

```js
// ✅ Good: uncontrolled text area with an initial value
// ✅ 좋음: 초기값을 제공한 비제어 textarea
<textarea defaultValue={something} />
```

If you want [to control this text area with a state variable,](#controlling-a-text-area-with-a-state-variable) specify an `onChange` handler:
<Trans>[textarea를 state 변수로 제어](#controlling-a-text-area-with-a-state-variable)하고 싶다면 `onChange` 핸들러를 지정하세요:</Trans>

```js
// ✅ Good: controlled text area with onChange
// ✅ 좋음: onChange를 제공하는 제어 textarea
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

If the value is intentionally read-only, add a `readOnly` prop to suppress the error:
<Trans>의도적으로 값을 읽기전용으로 하고자 하는 경우, `readOnly` prop을 추가하여 에러를 억제하세요:</Trans>

```js
// ✅ Good: readonly controlled text area without on change
// ✅ 좋음: onChange 없는 읽기전용 제어 textarea
<textarea value={something} readOnly={true} />
```

---

### My text area caret jumps to the beginning on every keystroke<Trans>키를 누를 때마다 커서가 처음으로 이동합니다</Trans> {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

If you [control a text area,](#controlling-a-text-area-with-a-state-variable) you must update its state variable to the text area's value from the DOM during `onChange`.
<Trans>[제어 textarea](#controlling-a-text-area-with-a-state-variable)의 경우 `onChange` 중에 state 변수를 DOM의 값으로 업데이트해야 합니다.</Trans>

You can't update it to something other than `e.target.value`:
<Trans>`e.target.value`가 아닌 다른 값으로 업데이트할 수 없습니다:</Trans>

```js
function handleChange(e) {
  // 🔴 Bug: updating an input to something other than e.target.value
  // 🔴 버그: e.target.value가 아닌 다른 값으로 업데이트 시도
  setFirstName(e.target.value.toUpperCase());
}
```

You also can't update it asynchronously:
<Trans>또한 비동기적으로 업데이트할 수 없습니다:</Trans>

```js
function handleChange(e) {
  // 🔴 Bug: updating an input asynchronously
  // 🔴 버그: 비동기적으로 업데이트 시도
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

To fix your code, update it synchronously to `e.target.value`:
<Trans>이를 수정하려면, `e.target.value`를 동기적으로 업데이트하세요:</Trans>

```js
function handleChange(e) {
  // ✅ Updating a controlled input to e.target.value synchronously
  // ✅ 제어 textarea를 e.target.value로부터 동기적으로 업데이트
  setFirstName(e.target.value);
}
```

If this doesn't fix the problem, it's possible that the text area gets removed and re-added from the DOM on every keystroke. This can happen if you're accidentally [resetting state](/learn/preserving-and-resetting-state) on every re-render. For example, this can happen if the text area or one of its parents always receives a different `key` attribute, or if you nest component definitions (which is not allowed in React and causes the "inner" component to remount on every render).
<Trans>이렇게 해도 문제가 해결되지 않는다면, 키 입력 시마다 textarea이 DOM에서 제거되었다가 다시 추가되는 상황일 수 있습니다. 렌더링할 때마다 실수로 state를 재설정하는 경우 이런 문제가 발생할 수 있습니다. 예를 들어 textarea 또는 그 부모 중 하나가 항상 다른 `key` 속성을 받거나, 컴포넌트 정의를 중첩하는 경우(React에서는 허용되지 않으며, 렌더링할 때마다 "내부" 컴포넌트가 다시 마운트됩니다), 이런 일이 발생할 수 있습니다.</Trans>


---

### I'm getting an error: "A component is changing an uncontrolled input to be controlled" <Trans>"컴포넌트가 비제어 입력을 제어하도록 변경하고 있습니다.” 라는 오류가 발생합니다</Trans> {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


If you provide a `value` to the component, it must remain a string throughout its lifetime.
<Trans>컴포넌트에 `value` 를 제공하는 경우, 그 값은 생명주기 동안 계속 문자열로 유지되어야 합니다.</Trans>

You cannot pass `value={undefined}` first and later pass `value="some string"` because React won't know whether you want the component to be uncontrolled or controlled. A controlled component should always receive a string `value`, not `null` or `undefined`.
<Trans>React는 컴포넌트를 비제어 상태로 둘지 제어 상태로 둘지 알 수 없기 때문에, `value={undefined}`를 먼저 전달하고 나중에 `value="some string"`을 전달할 수 없습니다. 제어 컴포넌트는 항상 `null`이나 `undefined`가 아닌 문자열 `value`를 받아야 합니다.</Trans>

If your `value` is coming from an API or a state variable, it might be initialized to `null` or `undefined`. In that case, either set it to an empty string (`''`) initially, or pass `value={someValue ?? ''}` to ensure `value` is a string.
<Trans>`value`를 API나 state 변수에서 가져오는 경우, `null` 또는 `undefined`으로 초기화될 수 있습니다. 이 경우 처음에 빈 문자열(`''`)로 설정하거나 `value={someValue ?? ''}`를 전달하여 `value`에 문자열이 오도록 보장하세요.</Trans>
