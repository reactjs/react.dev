---
title: "<progress>"
translators: [이나령, 고석영]
---

<Intro>

The [built-in browser `<progress>` component](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) lets you render a progress indicator.
<Trans>[브라우저 빌트인 `<progress>` 컴포넌트](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress)를 사용하면 진행률 표시기를 렌더링할 수 있습니다.</Trans>


```js
<progress value={0.5} />
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `<progress>` {/*progress*/}

To display a progress indicator, render the [built-in browser `<progress>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) component.
<Trans>진행률 표시기를 렌더링하려면 [브라우저 빌트인 `<progress>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) 컴포넌트를 렌더링합니다.</Trans>


```js
<progress value={0.5} />
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Props {/*props*/}

`<progress>` supports all [common element props.](/reference/react-dom/components/common#props)
<Trans>`<progress>`는 모든 [일반적인 요소의 props](/reference/react-dom/components/common#props)를 지원합니다.</Trans>


Additionally, `<progress>` supports these props:
<Trans>또한 `<progress>`는 다음 props를 지원합니다:</Trans>

* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-max): A number. Specifies the maximum `value`. Defaults to `1`.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-value): A number between `0` and `max`, or `null` for intermedinate progress. Specifies how much was done.

<TransBlock>
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-max): 숫자. 최대값을 지정합니다. 기본값은 `1`입니다.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress#attr-value): `0`에서 `max` 사이의 숫자이거나 중간 진행률의 경우 `null`입니다. 수행한 작업의 양을 지정합니다.
</TransBlock>


---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Controlling a progress indicator<Trans>진행률 표시기 제어</Trans> {/*controlling-a-progress-indicator*/}

To display a progress indicator, render a `<progress>` component. You can pass a number `value` between `0` and the `max` value you specify. If you don't pass a `max` value, it will assumed to be `1` by default.
<Trans>진행률 표시기를 표시하려면 `<progress>` 컴포넌트를 렌더링합니다. `0`과 `max` 사이의 숫자 `value`를 전달할 수 있습니다. `max` 값을 전달하지 않으면 기본적으로 `1`로 간주됩니다.</Trans>


If the operation is not ongoing, pass `value={null}` to put the progress indicator into an indeterminate state.
<Trans>작업 진행 중이 아닌 경우, 진행률 표시기를 불확정 상태로 설정하려면 `value={null}`을 전달합니다.</Trans>


<Sandpack>

```js
export default function App() {
  return (
    <>
      <progress value={0} />
      <progress value={0.5} />
      <progress value={0.7} />
      <progress value={75} max={100} />
      <progress value={1} />
      <progress value={null} />
    </>
  );
}
```

```css
progress { display: block; }
```

</Sandpack>
