---
title: "<option>"
translators: [송한종, 이승효]
---

<Intro>

The [built-in browser `<option>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) lets you render an option inside a [`<select>`](/reference/react-dom/components/select) box.
<Trans>[브라우저 빌트인 `<option>` 컴포넌트](https://developer.mozilla.org/ko/docs/Web/HTML/Element/option)를 사용하면 [`<select>`](/reference/react-dom/components/select) 박스 안에 옵션을 렌더링할 수 있습니다.</Trans>

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `<option>` {/*option*/}

The [built-in browser `<option>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select) lets you render an option inside a [`<select>`](/reference/react-dom/components/select) box.
<Trans>[브라우저 빌트인 `<option>` 컴포넌트](https://developer.mozilla.org/ko/docs/Web/HTML/Element/option)를 사용하면 [`<select>`](/reference/react-dom/components/select) 박스 안에 옵션을 렌더링할 수 있습니다.</Trans>

```js
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Props {/*props*/}

`<option>` supports all [common element props.](/reference/react-dom/components/common#props)
<Trans>`<option>` 은 모든 [일반적인 엘리먼트 props](/reference/react-dom/components/common#props)를 지원합니다.</Trans>

Additionally, `<option>` supports these props:
<Trans>또한, `<option>`은 다음과 같은 props들을 지원합니다:</Trans>

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): A boolean. If `true`, the option will not be selectable and will appear dimmed.
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): A string. Specifies the meaning of the option. If not specified, the text inside the option is used.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): The value to be used [when submitting the parent `<select>` in a form](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) if this option is selected.
<TransBlock>
* [`disabled`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/option#disabled): boolean값. `true` 인 경우 옵션을 선택할 수 없으며 흐리게 보입니다.
* [`label`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/option#label): string값. 옵션의 의미를 지정합니다. 지정하지 않으면 옵션 내부의 텍스트가 사용됩니다.
* [`value`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/option#value): [폼에서 부모 요소인 `<select>`를 제출할 때](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form), 이 옵션이 선택된 경우에 사용됩니다.
</TransBlock>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* React does not support the `selected` attribute on `<option>`. Instead, pass this option's `value` to the parent [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) for an uncontrolled select box, or [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) for a controlled select.
<Trans>React는 `<option>`에서 `selected` 속성을 지원하지 않습니다. 대신 비제어 셀렉트 박스의 경우에는 [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option)로, 제어 셀렉트 박스의 경우에는 [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable)로, 이 옵션의 `value`를 부모에 전달하세요.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Displaying a select box with options<Trans>옵션이 있는 셀렉트 박스 표시하기</Trans> {/*displaying-a-select-box-with-options*/}

Render a `<select>` with a list of `<option>` components inside to display a select box. Give each `<option>` a `value` representing the data to be submitted with the form.
<Trans>`<option>` 컴포넌트 목록이 포함된 `<select>`을 렌더링하여 셀렉트 박스를 표시합니다. 각 `<option>`에 폼과 함께 제출할 데이터를 나타내는 `value`을 지정합니다.</Trans>

[Read more about displaying a `<select>` with a list of `<option>` components.](/reference/react-dom/components/select)
<Trans>[`<option>` 컴포넌트 목록과 함께 `<select>`표시하는 방법에 대해 자세히 알아보세요.](/reference/react-dom/components/select)</Trans>

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

