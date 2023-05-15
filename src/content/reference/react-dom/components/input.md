---
title: "<input>"
translators: [류재준, 정재남, 고석영]
---

<Intro>

The [built-in browser `<input>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) lets you render different kinds of form inputs.
<Trans>[브라우저 빌트인 `<input>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)로 다양한 form input을 렌더링할 수 있습니다.</Trans>

```js
<input />
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `<input>` {/*input*/}

To display an input, render the [built-in browser `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) component.
<Trans>input을 표시하려면 [브라우저 빌트인 `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) 컴포넌트를 렌더링 하세요.</Trans>


```js
<input name="myInput" />
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Props {/*props*/}

`<input>` supports all [common element props.](/reference/react-dom/components/common#props)
<Trans>`<input>`은 모든 [공통 엘리먼트 prop](/reference/react-dom/components/common#props)을 지원합니다.</Trans>

You can [make an input controlled](#controlling-an-input-with-a-state-variable) by passing one of these props:
<Trans>다음 props 중 하나를 전달하여 [input을 제어](#controlling-an-input-with-a-state-variable)할 수 있습니다:</Trans>

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): A boolean. For a checkbox input or a radio button, controls whether it is selected.
<Trans>[`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): 불리언. 체크박스 input 또는 라디오 버튼의 선택 여부를 제어합니다.</Trans>

* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): A string. For a text input, controls its text. (For a radio button, specifies its form data.)
<Trans>[`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): 문자열. 텍스트 input의 텍스트를 제어합니다. (라디오 버튼의 경우 해당 form data를 지정합니다).</Trans>

When you pass either of them, you must also pass an `onChange` handler that updates the passed value.
<Trans>위 둘 중 하나를 전달할 때, 전달된 값을 업데이트하는 `onChange` 핸들러도 함께 전달해야 합니다.</Trans>

These `<input>` props are only relevant for uncontrolled inputs:
<Trans>다음 `<input>` props는 비제어 input에만 관련이 있습니다:</Trans>

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): A boolean. Specifies [the initial value](#providing-an-initial-value-for-an-input) for `type="checkbox"` and `type="radio"` inputs.
<Trans>[`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): 불리언. `type="checkbox"` 및 `type="radio"`의 [기본값](#providing-an-initial-value-for-an-input)을 특정합니다.</Trans>

* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): A string. Specifies [the initial value](#providing-an-initial-value-for-an-input) for a text input.
<Trans>[`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): 문자열. 텍스트 input의 [기본값](#providing-an-initial-value-for-an-input)을 특정합니다.</Trans>

These `<input>` props are relevant both for uncontrolled and controlled inputs:
<Trans>다음 `<input>` props는 비제어 및 제어 input 모두에 해당합니다:</Trans>

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): A string. Specifies which filetypes are accepted by a `type="file"` input.
<Trans>[`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): 문자열. `type="file"` input에 허용되는 파일 형식을 지정합니다.</Trans>

* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): A string. Specifies the alternative image text for a `type="image"` input.
<Trans>[`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): 문자열. `type="image"` input의 대체 이미지 텍스트를 지정합니다.</Trans>

* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): A string. Specifies the media (microphone, video, or camera) captured by a `type="file"` input.
<Trans>[`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): 문자열. `type="file"` input으로 캡쳐할 미디어(마이크, 비디오, 카메라)를 지정합니다.</Trans>

* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): A string. Specifies one of the possible [autocomplete behaviors.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
<Trans>[`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): 문자열. 가능한 [자동완성 동작](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)을 지정합니다.</Trans>

* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): A boolean. If `true`, React will focus the element on mount.
<Trans>[`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): 불리언. `true`이면 엘리먼트가 마운트될 때 초점을 맞춥니다.</Trans>

* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): A string. Specifies the form field name for the element's directionality.
<Trans>[`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): 문자열. 엘리먼트의 방향성에 대한 폼 필드 이름을 지정합니다.</Trans>

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): A boolean. If `true`, the input will not be interactive and will appear dimmed.
<Trans>[`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): 불리언. `true`이면 해당 input은 상호작용할 수 없으며 흐릿하게 보여집니다.</Trans>

* `children`: `<input>` does not accept children.
<Trans>`children`: `<input>`은 자식을 받지 않습니다.</Trans>

* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): A string. Specifies the `id` of the `<form>` this input belongs to. If omitted, it's the closest parent form.
<Trans>[`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): 문자열. 이 input이 속한 `<form>`의 `id`를 지정합니다. 이 prop이 없으면 상위의 가장 가까운 form이 됩니다.</Trans>

* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): A string. Overrides the parent `<form action>` for `type="submit"` and `type="image"`.
<Trans>[`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): 문자열. `type="submit"` 및 `type="image"`에 대해 상위 `<form action>`을 덮습니다.</Trans>

* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): A string. Overrides the parent `<form enctype>` for `type="submit"` and `type="image"`.
<Trans>[`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): 문자열. `type="submit"` 및 `type="image"`에 대해 상위 `<form enctype>`을 덮습니다.</Trans>

* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): A string. Overrides the parent `<form method>` for `type="submit"` and `type="image"`.
<Trans>[`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): 문자열. `type="submit"` 및 `type="image"`에 대해 상위 `<form method>`을 덮습니다.</Trans>

* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): A string. Overrides the parent `<form noValidate>` for `type="submit"` and `type="image"`.
<Trans>[`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): 문자열. `type="submit"` 및 `type="image"`에 대해 상위 `<form noValidate>`을 덮습니다.</Trans>

* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): A string. Overrides the parent `<form target>` for `type="submit"` and `type="image"`.
<Trans>[`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): 문자열. `type="submit"` 및 `type="image"`에 대해 상위 `<form target>`을 덮습니다.</Trans>

* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): A string. Specifies the image height for `type="image"`.
<Trans>[`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): 문자열. `type="image"`의 이미지 높이를 지정합니다.</Trans>

* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): A string. Specifies the `id` of the `<datalist>` with the autocomplete options.
<Trans>[`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): 문자열. autocomplete 옵션들과 함께 `<datalist>`의 `id`를 지정합니다.</Trans>

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): A number. Specifies the maximum value of numerical and datetime inputs.
<Trans>[`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): 숫자. 숫자타입 및 날짜시간 input의 최대값을 지정합니다.</Trans>

* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): A number. Specifies the maximum length of text and other inputs.
<Trans>[`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): 숫자. 텍스트 및 기타 input의 최대 길이를 지정합니다.</Trans>

* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): A number. Specifies the minimum value of numerical and datetime inputs.
<Trans>[`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): 숫자. 숫자타입 및 날짜시간 input의 최솟값을 지정합니다.</Trans>

* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): A number. Specifies the minimum length of text and other inputs.
<Trans>[`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): 숫자. 텍스트 및 기타 input의 최소 길이를 지정합니다.</Trans>

* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): A boolean. Specifies whether multiple values are allowed for `type="file"` and `type="email"`.
<Trans>[`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): 불리언. `type="file"` 및 `type="email"`에 대해 여러 값을 허용할지 여부를 지정합니다.</Trans>

* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): A string. Specifies the name for this input that's [submitted with the form.](#reading-the-input-values-when-submitting-a-form)
<Trans>[`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): 문자열. [폼에 제출되는](#reading-the-input-values-when-submitting-a-form) input의 이름을 지정합니다.</Trans>

* `onChange`: An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Required for [controlled inputs.](#controlling-an-input-with-a-state-variable) Fires immediately when the input's value is changed by the user (for example, it fires on every keystroke). Behaves like the browser [`input` event.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
<Trans>`onChange`: [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. [제어 input](#controlling-an-input-with-a-state-variable)에서 필수입니다. 사용자가 input의 값을 변경하면 즉시 호출됩니다(예: 키 입력시마다 발생). 브라우저 [`input` 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)처럼 동작합니다.</Trans>

* `onChangeCapture`: A version of `onChange` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onChangeCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onChange` 입니다.</Trans>

* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires immediately when the value is changed by the user. For historical reasons, in React it is idiomatic to use `onChange` instead which works similarly.
<Trans>[`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. 사용자가 값을 변경하면 즉시 호출됩니다. 역사적인 이유로 React에서는 비슷한 방시긍로 작동하는 `onChange`를 대신 사용하는 것이 일반적입니다.</Trans>

* `onInputCapture`: A version of `onInput` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onInputCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onInput` 입니다.</Trans>

* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires if an input fails validation on form submit. Unlike the built-in `invalid` event, the React `onInvalid` event bubbles.
<Trans>[`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. 폼 제출시 input이 유효성 검사에 실패하면 호출됩니다. 빌트인 `invalid` 이벤트와 달리, React의 `onInvalid` 이벤트는 버블을 발생시킵니다.</Trans>

* `onInvalidCapture`: A version of `onInvalid` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onInvalidCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onInvalid` 입니다.</Trans>

* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires after the selection inside the `<input>` changes. React extends the `onSelect` event to also fire for empty selection and on edits (which may affect the selection).
<Trans>[`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Event` 핸들러](/reference/react-dom/components/common#event-handler) 함수. `<input>` 내부의 선택이 변경되면 호출됩니다. React는 선택이 빈 경우와 (선택에 영향을 미칠 수 있는) 편집에 대해서도 `onSelect` 이벤트가 호출되도록 확장합니다.</Trans>

* `onSelectCapture`: A version of `onSelect` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onSelectCapture`:[캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onSelect` 입니다.</Trans>

* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): A string. Specifies the pattern that the `value` must match.
<Trans>[`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): 문자열. `value`가 일치해야 하는 패턴을 지정합니다.</Trans>

* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): A string. Displayed in a dimmed color when the input value is empty.
<Trans>[`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): 문자열. input 값이 비어있을 때 희미한 색상으로 표시되는 텍스트입니다.</Trans>

* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): A boolean. If `true`, the input is not editable by the user.
<Trans>[`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): 불리언. `true`이면 이 input은 사용자가 편집할 수 없습니다.</Trans>

* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): A boolean. If `true`, the value must be provided for the form to submit.
<Trans>[`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): 불리언. `true`이면 값을 입력해야만 폼을 제출할 수 있습니다.</Trans>

* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): A number. Similar to setting width, but the unit depends on the control.
<Trans>[`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): 숫자. 너비 설정과 유사하지만, 단위는 컨트롤에 따라 다릅니다.</Trans>

* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): A string. Specifies the image source for a `type="image"` input.
<Trans>[`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): 문자열. `type="image"` input의 이미지 소스를 지정합니다.</Trans>

* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): A positive number or an `'any'` string. Specifies the distance between valid values.
<Trans>[`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): 양수 또는 문자열 `'any'`. 유효한 값 사이의 거리를 지정합니다.</Trans>

* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): A string. One of the [input types.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
<Trans>[`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): 문자열. [input type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) 중 하나.</Trans>

* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width):  A string. Specifies the image width for a `type="image"` input.
<Trans>[`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width):  문자열. `type="image"` input의 이미지 너비를 지정합니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

- Checkboxes need `checked` (or `defaultChecked`), not `value` (or `defaultValue`).
<Trans>체크박스는 `value`(또는 `defaultValue`)가 아닌 `checked`(또는 `defaultChecked`)가 필요합니다.</Trans>

- If a text input receives a string `value` prop, it will be [treated as controlled.](#controlling-an-input-with-a-state-variable)
<Trans>텍스트 input이 문자열 `value` prop을 받으면 [제어된 것으로 처리됩니다.](#controlling-an-input-with-a-state-variable)</Trans>

- If a checkbox or a radio button receives a boolean `checked` prop, it will be [treated as controlled.](#controlling-an-input-with-a-state-variable)
<Trans>체크박스나 라디오 버튼이 불리언 `checked` prop을 받으면 [제어된 것으로 처리됩니다.](#controlling-an-input-with-a-state-variable)</Trans>

- An input can't be both controlled and uncontrolled at the same time.
<Trans>input은 동시에 제어되거나 제어되지 않을 수 없습니다.</Trans>

- An input cannot switch between being controlled or uncontrolled over its lifetime.
<Trans>input은 수명 동안 제어되거나 제어되지 않는 상태로 전환될 수 없습니다.</Trans>

- Every controlled input needs an `onChange` event handler that synchronously updates its backing value.
<Trans>제어되는 모든 입력에는 `onChange` 이벤트 핸들러가 필요하며, 이 핸들러는 지원 값을 동기적으로 업데이트합니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Displaying inputs of different types<Trans>다양한 유형의 input 표시하기</Trans> {/*displaying-inputs-of-different-types*/}

To display an input, render an `<input>` component. By default, it will be a text input. You can pass `type="checkbox"` for a checkbox, `type="radio"` for a radio button, [or one of the other input types.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)
<Trans>input을 표시하려면 `<input>` 컴포넌트를 렌더링합니다. 기본적으로 텍스트 input이 됩니다. 체크박스의 경우 `type="checkbox"`, 라디오 버튼의 경우 `type="radio"` [또는 다른 input 유형 중 하나를 전달할 수 있습니다.](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input#input_types)</Trans>

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Providing a label for an input <Trans>input에 대한 label 제공하기</Trans> {/*providing-a-label-for-an-input*/}

Typically, you will place every `<input>` inside a [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) tag. This tells the browser that this label is associated with that input. When the user clicks the label, the browser will automatically focus the input. It's also essential for accessibility: a screen reader will announce the label caption when the user focuses the associated input.
<Trans>일반적으로 모든 `<input>`은 [`<label>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/label) 태그 안에 배치됩니다. 이는 이 label이 해당 input과 연결되어 있음을 브라우저에 알려줍니다. 사용자가 label을 클릭하면 브라우저가 자동으로 input에 초점을 맞춥니다. 이는 접근성 측면에서도 필수적입니다: 사용자가 관련 input에 초점을 맞추면 스크린 리더가 label 캡션을 알립니다.</Trans>

If you can't nest `<input>` into a `<label>`, associate them by passing the same ID to `<input id>` and [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) To avoid conflicts between multiple instances of one component, generate such an ID with [`useId`.](/reference/react/useId)
<Trans>`<input>`을 `<label>`에 중첩할 수 없는 경우 동일한 ID를 `<input id>` 및 [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor)에 전달하여 연결합니다. 한 컴포넌트의 여러 인스턴스 간에 충돌을 피하려면 [`useId`](/reference/react/useId)를 사용하여 이러한 ID를 생성하십시오.</Trans>

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Providing an initial value for an input<Trans>input에 대한 초기값 제공하기</Trans> {/*providing-an-initial-value-for-an-input*/}

You can optionally specify the initial value for any input. Pass it as the `defaultValue` string for text inputs. Checkboxes and radio buttons should specify the initial value with the `defaultChecked` boolean instead.
<Trans>선택적으로 모든 input의 초기값을 지정할 수 있습니다. 텍스트 input의 경우 `defaultValue` 문자열로 전달합니다. 체크박스와 라디오 버튼은 불리언 타입인 `defaultChecked`으로 초기값을 대신 지정해야 합니다.</Trans>

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true} 
          />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Reading the input values when submitting a form<Trans>form 제출 시 input 값 읽기</Trans> {/*reading-the-input-values-when-submitting-a-form*/}

Add a [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) around your inputs with a [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) inside. It will call your `<form onSubmit>` event handler. By default, the browser will send the form data to the current URL and refresh the page. You can override that behavior by calling `e.preventDefault()`. Read the form data with [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData).
<Trans>input 주위에 [`<form>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/form)을 추가하고 그 안에 [`<button type="submit">`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/button)을 추가합니다. 그러면 `<form onSubmit>` 이벤트 핸들러가 호출됩니다. 기본적으로 브라우저는 form 데이터를 현재 URL로 전송하고 페이지를 새로 고칩니다. `e.preventDefault()`를 호출하여 이 동작을 재정의할 수 있습니다. [`new FormData(e.target)`](https://developer.mozilla.org/ko/docs/Web/API/FormData)로 form 데이터를 읽습니다.</Trans>

<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    // 브라우저에서 페이지 리로드 방지
    e.preventDefault();

    // Read the form data
    // form 데이터 읽기
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    // formData를 페치 본문으로 직접 전달할 수 있습니다:
    fetch('/some-api', { method: form.method, body: formData });

    // Or you can work with it as a plain object:
    // 또는 일반 객체로 작업할 수도 있습니다:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label><input type="radio" name="myRadio" value="option1" /> Option 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Option 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Option 3</label>
      </p>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
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

Give a `name` to every `<input>`, for example `<input name="firstName" defaultValue="Taylor" />`. The `name` you specified will be used as a key in the form data, for example `{ firstName: "Taylor" }`.
<Trans>모든 `<input>`에 `name`을 지정하세요(예: `<input name="firstName" defaultValue="Taylor" />`). 지정한 `name`은 form 데이터에서 키로 사용됩니다(예: `{ firstName: "Taylor" }`).</Trans>

</Note>

<Pitfall>

By default, *any* `<button>` inside a `<form>` will submit it. This can be surprising! If you have your own custom `Button` React component, consider returning [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) instead of `<button>`. Then, to be explicit, use `<button type="submit">` for buttons that *are* supposed to submit the form.
<Trans>기본적으로 `<form>`안에 있는 *모든* `<button>`은 제출됩니다. 의외일 수 있습니다! 커스텀 `Button` React 컴포넌트가 있는 경우 `<button>` 대신 [`<button type="button">`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/input/button)을 반환하는 것을 고려하세요. 그런 다음 form을 제출해야 *하는* 버튼에 `<button type="submit">`을 사용하세요.</Trans>

</Pitfall>

---

### Controlling an input with a state variable<Trans>state 변수로 input 제어하기</Trans> {/*controlling-an-input-with-a-state-variable*/}

An input like `<input />` is *uncontrolled.* Even if you [pass an initial value](#providing-an-initial-value-for-an-input) like `<input defaultValue="Initial text" />`, your JSX only specifies the initial value. It does not control what the value should be right now.
<Trans>`<input />`과 같은 input은 *제어되지 않습니다.* `<input defaultValue="Initial text" />`와 같이 [초기값을 전달](#providing-an-initial-value-for-an-input)하더라도 JSX는 초기값만 지정합니다. 현재 값이 무엇이어야 하는지는 제어하지 않습니다.</Trans>

**To render a _controlled_ input, pass the `value` prop to it (or `checked` for checkboxes and radios).** React will force the input to always have the `value` you passed. Usually, you would do this by declaring a [state variable:](/reference/react/useState)
<Trans>**_제어된_ input을 렌더링하려면 `value` prop을 전달하세요(체크박스와 라디오의 경우 `checked`).** React는 입력이 항상 전달한 `value`를 갖도록 강제합니다. 보통은 [state 변수](/reference/react/useState)를 선언하여 이를 수행합니다.</Trans>

```js {2-3,7-10}
function Form() {
  const [firstName, setFirstName] = useState(''); // Declare a state variable...
                                                  // state 변수 정의...
  // ...
  return (
    <input
      value={firstName} // ...force the input's value to match the state variable...
                        // ...input값이 state 변수와 일치하도록 강제...
      onChange={e => setFirstName(e.target.value)} // ... and update the state variable on any edits!
                                                   // ... 그리고 수정할 때마다 state 변수를 업데이트하세요!
    />
  );
}
```

A controlled input makes sense if you needed state anyway--for example, to re-render your UI on every edit:
<Trans>어차피 state가 필요한 경우(예: 편집할 때마다 UI를 다시 렌더링해야 하는 경우) 제어 input이 적합합니다:</Trans>

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Your name is {firstName}.</p>}
      ...
```

It's also useful if you want to offer multiple ways to adjust the input state (for example, by clicking a button):
<Trans>다양한 방법으로 input state를 조정하는 기능을 제공하려는 경우(예: 버튼을 클릭하는 등)에도 유용합니다:</Trans>

```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
```

The `value` you pass to controlled components should not be `undefined` or `null`. If you need the initial value to be empty (such as with the `firstName` field below), initialize your state variable to an empty string (`''`).
<Trans>제어 컴포넌트에 전달하는 `value`는 `undefined` 또는 `null`이어서는 안됩니다. 초기값을 비워야 하는 경우(아래의 `firstName` 필드와 같이) state 변수를 빈 문자열(`''`)로 초기화하세요.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        First name:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Age:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          Add 10 years
        </button>
      </label>
      {firstName !== '' &&
        <p>Your name is {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Your age is {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**If you pass `value` without `onChange`, it will be impossible to type into the input.** When you control an input by passing some `value` to it, you *force* it to always have the value you passed. So if you pass a state variable as a `value` but forget to update that state variable synchronously during the `onChange` event handler, React will revert the input after every keystroke back to the `value` that you specified.
<Trans>**`onChange` 없이 `value`를 전달하면 input에 입력이 불가능합니다.** 어떤 `value`를 전달해서 input을 제어하면 항상 전달한 값을 갖도록 *강제*하게 됩니다. 따라서 state 변수를 `value`로 전달했지만 `onChange` 이벤트 핸들러에서 해당 state 변수를 동기적으로 업데이트하는 것을 잊어버린 경우, React는 모든 키 입력 후 input을 사용자가 지정한 `value`로 되돌립니다.</Trans>

</Pitfall>

---

### Optimizing re-rendering on every keystroke<Trans>모든 키 입력 리렌더링 최적화하기</Trans> {/*optimizing-re-rendering-on-every-keystroke*/}

When you use a controlled input, you set the state on every keystroke. If the component containing your state re-renders a large tree, this can get slow. There's a few ways you can optimize re-rendering performance.
<Trans>제어 input을 사용할 때는 모든 키 입력에 state를 설정합니다. state가 포함된 컴포넌트가 큰 트리를 다시 렌더링하면 속도가 느려질 수 있습니다. 리렌더링 성능을 최적화할 수 있는 몇 가지 방법이 있습니다.</Trans>

For example, suppose you start with a form that re-renders all page content on every keystroke:
<Trans>예를 들어 모든 키 입력 시 모든 페이지 콘텐츠를 다시 렌더링하는 form으로 시작한다고 가정해 보겠습니다:</Trans>

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

Since `<PageContent />` doesn't rely on the input state, you can move the input state into its own component:
<Trans>`PageContent />`는 input state에 의존하지 않으므로 input state를 자체 컴포넌트로 이동할 수 있습니다:</Trans>

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

This significantly improves performance because now only `SignupForm` re-renders on every keystroke.
<Trans>이제 모든 키 입력에 대해 `SignupForm`만 리렌더링하므로 성능이 크게 향상됩니다.</Trans>

If there is no way to avoid re-rendering (for example, if `PageContent` depends on the search input's value), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) lets you keep the controlled input responsive even in the middle of a large re-render.
<Trans>리렌더링을 피할 방법이 없는 경우(예: `PageContent`가 검색 input 값에 의존하는 경우), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui)를 사용하면 대규모 리렌더링 중에도 제어된 input의 반응성을 유지할 수 있습니다.</Trans>

---

## Troubleshooting<Trans>문제 해결</Trans> {/*troubleshooting*/}

### My text input doesn't update when I type into it<Trans>텍스트 input에 타이핑해도 업데이트되지 않습니다</Trans> {/*my-text-input-doesnt-update-when-i-type-into-it*/}

If you render an input with `value` but no `onChange`, you will see an error in the console:
<Trans>input에 `onChange` 없이 `value`만 지정하여 렌더링하면 콘솔에 에러가 표시됩니다:</Trans>

```js
// 🔴 Bug: controlled text input with no onChange handler
// 🔴 버그: 제어 텍스트 input에 onChange 핸들러가 없습니다
<input value={something} />
```

<ConsoleBlock level="error">

You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
<Trans outdent>폼 필드에 `onChange` 핸들러가 없이 `value` prop만 제공했습니다. 이러면 읽기 전용 필드가 렌더링됩니다. 필드가 변경되어야 하는 경우 `defaultValue`를 사용하세요. 그렇지 않으면 `onChange` 또는 `readOnly`를 설정하세요.</Trans>

</ConsoleBlock>

As the error message suggests, if you only wanted to [specify the *initial* value,](#providing-an-initial-value-for-an-input) pass `defaultValue` instead:
<Trans>오류메시지에서 알 수 있듯이, [*초기값*만 지정](#providing-an-initial-value-for-an-input)하려면 대신 `defaultValue`를 전달하세요:</Trans>
```js
// ✅ Good: uncontrolled input with an initial value
// ✅ 좋음: 초기값을 제공한 비제어 input
<input defaultValue={something} />
```

If you want [to control this input with a state variable,](#controlling-an-input-with-a-state-variable) specify an `onChange` handler:
<Trans>[이 input을 state 변수로 제어](#controlling-an-input-with-a-state-variable)하고 싶다면 `onChange` 핸들러를 지정하세요:</Trans>

```js
// ✅ Good: controlled input with onChange
// ✅ 좋음: onChange가 있는 제어 input
<input value={something} onChange={e => setSomething(e.target.value)} />
```

If the value is intentionally read-only, add a `readOnly` prop to suppress the error:
<Trans>의도적으로 값을 읽기전용으로 하려는 경우, `readOnly` prop을 추가하여 오류를 억제하세요:</Trans>

```js
// ✅ Good: readonly controlled input without onChange
// ✅ 좋음: onChange가 없는 읽기 전용 제어 input
<input value={something} readOnly={true} />
```

---

### My checkbox doesn't update when I click on it<Trans>체크박스를 클릭해도 업데이트되지 않습니다</Trans> {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

If you render a checkbox with `checked` but no `onChange`, you will see an error in the console:
<Trans>체크박스에 `onChange` 없이 `checked`만 지정하여 렌더링하면 콘솔에 에러가 표시됩니다:</Trans>

```js
// 🔴 Bug: controlled checkbox with no onChange handler
// 🔴 버그: 제어 체크박스에 onChange 핸들러가 없습니다
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.
<Trans outdent>폼 필드에 `onChange` 핸들러가 없이 `checked` prop만 제공했습니다. 이러면 읽기 전용 필드가 렌더링됩니다. 필드가 변경되어야 하는 경우 `defaultChecked`를 사용하세요. 그렇지 않으면 `onChange` 또는 `readOnly`를 설정하세요.</Trans>

</ConsoleBlock>

As the error message suggests, if you only wanted to [specify the *initial* value,](#providing-an-initial-value-for-an-input) pass `defaultChecked` instead:
<Trans>오류메시지에서 알 수 있듯이, [*초기값*만 지정](#providing-an-initial-value-for-an-input)하려면 대신 `defaultChecked`를 전달하세요:</Trans>

```js
// ✅ Good: uncontrolled checkbox with an initial value
// ✅ 좋음: 초기값을 제공한 비제어 체크박스
<input type="checkbox" defaultChecked={something} />
```

If you want [to control this checkbox with a state variable,](#controlling-an-input-with-a-state-variable) specify an `onChange` handler:
<Trans>[이 체크박스를 state 변수로 제어](#controlling-an-input-with-a-state-variable)하고 싶다면 `onChange` 핸들러를 지정하세요:</Trans>

```js
// ✅ Good: controlled checkbox with onChange
// ✅ 좋음: onChange가 있는 제어 체크박스
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

You need to read `e.target.checked` rather than `e.target.value` for checkboxes.
<Trans>체크박스의 경우 `e.target.value`가 아닌 `e.target.checked`를 읽어야 합니다.</Trans>

</Pitfall>

If the checkbox is intentionally read-only, add a `readOnly` prop to suppress the error:
<Trans>의도적으로 값을 읽기전용으로 하려는 경우, `readOnly` prop을 추가하여 오류를 억제하세요:</Trans>

```js
// ✅ Good: readonly controlled checkbox without on change
// ✅ 좋음: onChange가 없는 읽기 전용 제어 체크박스
<input type="checkbox" checked={something} readOnly={true} />
```

---

### My input caret jumps to the beginning on every keystroke<Trans>키를 누를 때마다 커서가 처음으로 이동합니다</Trans> {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

If you [control an input,](#controlling-an-input-with-a-state-variable) you must update its state variable to the input's value from the DOM during `onChange`.
<Trans>[제어 input](#controlling-an-input-with-a-state-variable)의 경우 `onChange` 중에 state 변수를 DOM의 값으로 업데이트해야 합니다.</Trans>

You can't update it to something other than `e.target.value` (or `e.target.checked` for checkboxes):
<Trans>`e.target.value`(체크박스의 경우 `e.target.checked`)가 아닌 다른 값으로 업데이트할 수 없습니다:</Trans>

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
  // ✅ 제어 input을 e.target.value로부터 동기적으로 업데이트
  setFirstName(e.target.value);
}
```

If this doesn't fix the problem, it's possible that the input gets removed and re-added from the DOM on every keystroke. This can happen if you're accidentally [resetting state](/learn/preserving-and-resetting-state) on every re-render, for example if the input or one of its parents always receives a different `key` attribute, or if you nest component function definitions (which is not supported and causes the "inner" component to always be considered a different tree).
<Trans>이렇게 해도 문제가 해결되지 않는다면, 키 입력 시마다 input이 DOM에서 제거되었다가 다시 추가되는 상황일 수 있습니다. 렌더링할 때마다 실수로 [state를 재설정](/learn/preserving-and-resetting-state)하는 경우 이런 문제가 발생할 수 있습니다. 예를 들어 input 또는 그 부모 중 하나가 항상 다른 `key` 속성을 받거나, 컴포넌트 정의를 중첩하는 경우(React에서는 허용되지 않으며, 렌더링할 때마다 "내부" 컴포넌트가 다시 마운트됩니다), 이런 일이 발생할 수 있습니다.</Trans>

---

### I'm getting an error: "A component is changing an uncontrolled input to be controlled"<Trans>"컴포넌트가 비제어 입력을 제어하도록 변경하고 있습니다.” 라는 오류가 발생합니다</Trans> {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


If you provide a `value` to the component, it must remain a string throughout its lifetime.
<Trans>컴포넌트에 `value` 를 제공하는 경우, 그 값은 생명주기 동안 계속 문자열로 유지되어야 합니다.</Trans>

You cannot pass `value={undefined}` first and later pass `value="some string"` because React won't know whether you want the component to be uncontrolled or controlled. A controlled component should always receive a string `value`, not `null` or `undefined`.
<Trans>React는 컴포넌트를 비제어 상태로 둘지 제어 상태로 둘지 알 수 없기 때문에, `value={undefined}`를 먼저 전달하고 나중에 `value="some string"`을 전달할 수 없습니다. 제어 컴포넌트는 항상 `null`이나 `undefined`가 아닌 문자열 `value`를 받아야 합니다.</Trans>

If your `value` is coming from an API or a state variable, it might be initialized to `null` or `undefined`. In that case, either set it to an empty string (`''`) initially, or pass `value={someValue ?? ''}` to ensure `value` is a string.
<Trans>`value`를 API나 state 변수에서 가져오는 경우, `null` 또는 `undefined`으로 초기화될 수 있습니다. 이 경우 처음에 빈 문자열(`''`)로 설정하거나 `value={someValue ?? ''}`를 전달하여 `value`에 문자열이 오도록 보장하세요.</Trans>

Similarly, if you pass `checked` to a checkbox, ensure it's always a boolean.
<Trans>마찬가지로, 체크박스에 `checked`를 전달할 때는 항상 불리언인지를 확인하세요.</Trans>
