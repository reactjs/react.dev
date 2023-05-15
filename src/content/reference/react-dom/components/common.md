---
title: "Common components (e.g. <div>)"
translatedTitle: "기본 컴포넌트 (예: <div>)"
translators: [고석영, 정재남]
---

<Intro>

All built-in browser components, such as [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), support some common props and events.
<Trans>[`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)와 같은 모든 브라우저 빌트인 컴포넌트는 몇 가지 일반적인 props와 이벤트를 지원합니다.</Trans>
</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### Common components (e.g. `<div>`) <Trans>기본 컴포넌트 (예: `<div>`)</Trans> {/*common*/}

```js
<div className="wrapper">Some content</div>
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Props {/*common-props*/}

These special React props are supported for all built-in components:
<Trans>아래의 특별한 React props는 모든 빌트인 컴포넌트에서 지원됩니다:</Trans>

* `children`: A React node (an element, a string, a number, [a portal,](/reference/react-dom/createPortal) an empty node like `null`, `undefined` and booleans, or an array of other React nodes). Specifies the content inside the component. When you use JSX, you will usually specify the `children` prop implicitly by nesting tags like `<div><span /></div>`.
<Trans>`children`: React 노드(엘리먼트, 문자열, 숫자, portal, null, undefined 및 boolean과 같은 빈 노드 또는 기타 React 노드의 배열). 컴포넌트 내부의 콘텐츠를 지정합니다. JSX를 사용할 때 일반적으로 `<div><span /></div>`와 같은 태그를 중첩하여 암묵적으로 `children` prop을 지정합니다.</Trans>

* `dangerouslySetInnerHTML`: An object of the form `{ __html: '<p>some html</p>' }` with a raw HTML string inside. Overrides the [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) property of the DOM node and displays the passed HTML inside. This should be used with extreme caution! If the HTML inside isn't trusted (for example, if it's based on user data), you risk introducing an [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) vulnerability. [Read more about using `dangerouslySetInnerHTML`.](#dangerously-setting-the-inner-html)
<Trans>`dangerouslySetInnerHTML`: 내부에 원시 HTML 문자열이 있는 `{ __html: '<p>일부 html</p>' }` 형식의 객체로, 내부에 원시 HTML 문자열이 있습니다. DOM 노드의 [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) 속성을 재정의하고 전달된 HTML을 내부에 표시합니다. 이 함수는 매우 주의해서 사용해야 합니다! 내부 HTML을 신뢰할 수 없는 경우(예: 사용자 데이터를 기반으로 하는 경우) [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) 취약점이 발생할 위험이 있습니다. [`dangerouslySetInnerHTML` 사용에 대해 자세히 알아보세요.](/reference/react-dom/components/common#dangerously-setting-the-inner-html)</Trans>

* `ref`: A ref object from [`useRef`](/reference/react/useRef) or [`createRef`](/reference/react/createRef), or a [`ref` callback function,](#ref-callback) or a string for [legacy refs.](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) Your ref will be filled with the DOM element for this node. [Read more about manipulating the DOM with Refs.](#manipulating-a-dom-node-with-a-ref)
<Trans>`ref`: [`useRef`](/reference/react/useRef) 또는 [`createRef`](/reference/react/createRef)의 참조 객체, [`ref` 콜백 함수](#ref-callback), 또는 [레거시 ref](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs)에 대한 문자열. ref는 이 노드의 DOM 엘리먼트로 채워집니다. [ref로 DOM을 조작하는 방법에 대해 자세히 알아보세요.](/reference/react-dom/components/common#manipulating-a-dom-node-with-a-ref)</Trans>

* `suppressContentEditableWarning`: A boolean. If `true`, suppresses the warning that React shows for elements that both have `children` and `contentEditable={true}` (which normally do not work together). Use this if you're building a text input library that manages the `contentEditable` content manually.
<Trans>`suppressContentEditableWarning`: 불리언. `true`이면, 일반적으로 함께 작동하지 않는 (일반적으로 함께 작동하지 않는) `children`과 `contentEditable={true}`가 모두 있는 엘리먼트에 대해 React가 표시하는 경고를 억제합니다. 이 값을 사용하면 `contentEditable` 콘텐츠를 수동으로 관리하는 텍스트 입력 라이브러리를 빌드할 때 사용합니다.</Trans>

* `suppressHydrationWarning`: A boolean. If you use [server rendering,](/reference/react-dom/server) normally there is a warning when the server and the client render different content. In some rare cases (like timestamps), it is very hard or impossible to guarantee an exact match. If you set `suppressHydrationWarning` to `true`, React will not warn you about mismatches in the attributes and the content of that element. It only works one level deep, and is intended to be used as an escape hatch. Don't overuse it. [Read about suppressing hydration errors.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)
<Trans>`suppressHydrationWarning`: 불리언입니다. [서버 렌더링](/reference/react-dom/server)을 사용하는 경우 일반적으로 서버와 클라이언트가 서로 다른 콘텐츠를 렌더링할 때 경고가 표시됩니다. 타임스탬프와 같은 일부 드문 경우에서는 정확한 일치를 보장하기가 매우 어렵거나 불가능합니다. `suppressHydrationWarning`을 `true`로 설정하면 React는 해당 엘리먼트의 속성과 콘텐츠가 일치하지 않을 때 경고하지 않습니다. 이는 한 단계 깊이에서만 작동하며, 탈출구로 사용하기 위한 것입니다. 과도하게 사용하지 마세요. [hydration 오류 억제에 대해 자세히 알아보세요.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)</Trans>

* `style`: An object with CSS styles, for example `{ fontWeight: 'bold', margin: 20 }`. Similarly to the DOM [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) property, the CSS property names need to be written as `camelCase`, for example `fontWeight` instead of `font-weight`. You can pass strings or numbers as values. If you pass a number, like `width: 100`, React will automatically append `px` ("pixels") to the value unless it's a [unitless property.](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) We recommend using `style` only for dynamic styles where you don't know the style values ahead of time. In other cases, applying plain CSS classes with `className` is more efficient. [Read more about `className` and `style`.](#applying-css-styles)
<Trans>`style`: CSS 스타일이 있는 객체(예: `{ fontWeight: 'bold', margin: 20 }`). DOM [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) 프로퍼티와 마찬가지로 CSS 프로퍼티 이름도`font-weight` 대신 `fontWeight`와 같이 `camelCase`로 작성해야 합니다. 문자열이나 숫자를 값으로 전달할 수 있습니다. `width: 100`과 같이 숫자를 전달하면 React는 [단위가 없는 프로퍼티](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57)가 아니라면 값에 자동으로 `px`("픽셀")를 추가합니다. 스타일 값을 미리 알 수 없는 동적 스타일에만 `style`을 사용하는 것을 권장합니다. 그 외의 경우에는 `className`과 함께 일반 CSS 클래스를 적용하는 것이 더 효율적입니다. [`className`과 `style`로 CSS를 적용하는 방법에 대해 자세히 알아보세요.](#applying-css-styles)</Trans>

These standard DOM props are also supported for all built-in components:
<Trans>아래의 표준 DOM props는 모든 빌트인 컴포넌트에서도 지원됩니다:</Trans>

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): A string. Specifies a keyboard shortcut for the element. [Not generally recommended.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
<Trans>[`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): 문자열. 엘리먼트의 키보드 단축키를 지정합니다. [일반적으로 권장하지 않습니다.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)</Trans>

* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): ARIA attributes let you specify the accessibility tree information for this element. See [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) for a complete reference. In React, all ARIA attribute names are exactly the same as in HTML.
<Trans>[`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): ARIA 속성을 사용하면 이 엘리먼트에 대한 접근성 트리 정보를 지정할 수 있습니다. 전체 참조는 [ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes)를 참조하세요. React에서 모든 ARIA 어트리뷰트 이름은 HTML에서와 완전히 동일합니다.</Trans>

* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): A string. Specifies whether and how the user input should be capitalized.
<Trans>[`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): 문자열. 사용자 입력을 대문자로 표시할지 여부와 방법을 지정합니다.</Trans>

* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): A string. Specifies the element's CSS class name. [Read more about applying CSS styles.](#applying-css-styles)
<Trans>[`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): 문자열. 엘리먼트의 CSS 클래스 이름을 지정합니다. [CSS 스타일 적용에 대해 자세히 알아보세요.](/reference/react-dom/components/common#applying-css-styles)</Trans>

* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): A boolean. If `true`, the browser lets the user edit the rendered element directly. This is used to implement rich text input libraries like [Lexical.](https://lexical.dev/) React warns if you try to pass React children to an element with `contentEditable={true}` because React will not be able to update its content after user edits.
<Trans>[`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): 불리언. `true`이면 브라우저는 사용자가 렌더링된 엘리먼트를 직접 편집할 수 있도록 허용합니다. 이것은 [Lexical](<https://lexical.dev/>)과 같은 리치 텍스트 입력 라이브러리를 구현하는 데 사용됩니다. React는 사용자가 편집한 후에 React가 그 내용을 업데이트할 수 없기 때문에 `contentEditable={true}`가 있는 엘리먼트에 React 자식을 전달하려고 하면 경고를 표시합니다.</Trans>

* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): Data attributes let you attach some string data to the element, for example `data-fruit="banana"`. In React, they are not commonly used because you would usually read data from props or state instead.
<Trans>[`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): 데이터 속성을 사용하면 엘리먼트에 일부 문자열 데이터를 첨부할 수 있습니다(예: `data-fruit="banana"`). React에서는 일반적으로 프로퍼티나 state에서 데이터를 읽어오기 때문에 일반적으로 사용되지는 않습니다.</Trans>

* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): Either `'ltr'` or `'rtl'`. Specifies the text direction of the element.
<Trans>[`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): `'ltr'` 또는 `'rtl'`. 엘리먼트의 텍스트 방향을 지정합니다.</Trans>

* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): A boolean. Specifies whether the element is draggable. Part of [HTML Drag and Drop API.](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
<Trans>[`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): 불리언. 엘리먼트를 드래그할 수 있는지 여부를 지정합니다. [HTML 드래그 앤 드롭 API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)의 일부입니다.</Trans>

* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): A string. Specifies which action to present for the enter key on virtual keyboards.
<Trans>[`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): 문자열. 가상 키보드의 엔터 키에 표시할 동작을 지정합니다.</Trans>

* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): A string. For [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) and [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output), lets you [associate the label with some control.](/reference/react-dom/components/input#providing-a-label-for-an-input) Same as [`for` HTML attribute.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for) React uses the standard DOM property names (`htmlFor`) instead of HTML attribute names.
<Trans>[`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): 문자열. [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) 및 [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output)의 경우, [레이블을 일부 컨트롤과 연결할 수 있습니다.](/reference/react-dom/components/input#providing-a-label-for-an-input) [`for` HTML 속성](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for)과 동일합니다. React는 HTML 속성의 이름 대신 표준 DOM 프로퍼티 이름(`htmlFor`)을 사용합니다.</Trans>

* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): A boolean or a string. Specifies whether the element should be hidden.
<Trans>[`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): 불리언 또는 문자열. 엘리먼트의 숨김 여부를 지정합니다.</Trans>

* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): A string. Specifies a unique identifier for this element, which can be used to find it later or connect it with other elements. Generate it with [`useId`](/reference/react/useId) to avoid clashes between multiple instances of the same component.
<Trans>[`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): 문자열. 나중에 찾거나 다른 엘리먼트와 연결하는 데 사용할 수 있는 이 엘리먼트의 고유 식별자를 지정합니다. 동일한 컴포넌트의 여러 인스턴스 간의 충돌을 방지하려면 [`useId`](/reference/react/useId)로 생성합니다.</Trans>

* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): A string. If specified, the component will behave like a [custom element.](/reference/react-dom/components#custom-html-elements)
<Trans>[`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): 문자열. 지정하면 컴포넌트가 [커스텀 엘리먼트](/reference/react-dom/components#custom-html-elements)처럼 작동합니다.</Trans>

* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): A string. Specifies what kind of keyboard to display (for example, text, number or telephone).
<Trans>[`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): 문자열. 표시할 키보드의 종류(예: 텍스트, 숫자 또는 전화)를 지정합니다.</Trans>

* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): A string. Specifies which property the element represents for structured data crawlers.
<Trans>[`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): 문자열입니다. 구조화된 데이터 크롤러에 대해 엘리먼트가 나타내는 속성을 지정합니다.</Trans>

* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): A string. Specifies the language of the element.
<Trans>[`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): 문자열입니다. 엘리먼트의 언어를 지정합니다.</Trans>

* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): An [`AnimationEvent` handler](#animationevent-handler) function. Fires when a CSS animation completes.
<Trans>[`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): [`AnimationEvent` 핸들러](#animationevent-handler) 함수. CSS 애니메이션 종료시 호출됩니다.</Trans>

* `onAnimationEndCapture`: A version of `onAnimationEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onAnimationEndCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onAnimationEnd`입니다.</Trans>

* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): An [`AnimationEvent` handler](#animationevent-handler) function. Fires when an iteration of a CSS animation ends, and another one begins.
<Trans>[`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): [`AnimationEvent` 핸들러](#animationevent-handler) 함수. CSS 애니메이션의 이터레이션 종료시 및 다른 이터레이션 시작시 호출됩니다.</Trans>

* `onAnimationIterationCapture`: A version of `onAnimationIteration` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onAnimationIterationCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onAnimationIteration`입니다.</Trans>

* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): An [`AnimationEvent` handler](#animationevent-handler) function. Fires when a CSS animation starts.
<Trans>[`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): [`AnimationEvent` 핸들러](#animationevent-handler) 함수. CSS 애니메이션 시작시 호출됩니다.</Trans>

* `onAnimationStartCapture`: `onAnimationStart`, but fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onAnimationStartCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onAnimationStart`입니다.</Trans>

* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when a non-primary pointer button was clicked.
<Trans>[`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 비주요 버튼 클릭시 호출됩니다.</Trans>

* `onAuxClickCapture`: A version of `onAuxClick` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onAuxClickCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onAuxClick`입니다.</Trans>

* `onBeforeInput`: An [`InputEvent` handler](#inputevent-handler) function. Fires before the value of an editable element is modified. React does *not* yet use the native [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) event, and instead attempts to polyfill it using other events.
<Trans>`onBeforeInput`: [`InputEvent` 핸들러](#inputevent-handler) 함수. 편집 가능한 엘리먼트가 수정되기 전에 호출됩니다. React는 아직 native [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) 이벤트를 사용하지 않으며, 대신 다른 이벤트를 폴리필하여 구현하고 있습니다.</Trans>

* `onBeforeInputCapture`: A version of `onBeforeInput` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onBeforeInputCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onBeforeInput`입니다.</Trans>

* `onBlur`: A [`FocusEvent` handler](#focusevent-handler) function. Fires when an element lost focus. Unlike the built-in browser [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) event, in React the `onBlur` event bubbles.
<Trans>`onBlur`: A [`FocusEvent` 핸들러](#focusevent-handler) 함수. 엘리먼트가 초점을 잃을 때 호출됩니다. 브라우저 빌트인 [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) 이벤트와 달리, React의 `onBlur` 이벤트는 버블이 발생합니다.</Trans>

* `onBlurCapture`: A version of `onBlur` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onBlurCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onBlur`입니다.</Trans>

* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the primary button was clicked on the pointing device.
<Trans>[`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인팅 다비아스에서 주요 버튼 클릭시 호출됩니다.</Trans>

* `onClickCapture`: A version of `onClick` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onClickCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onClick` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)</Trans>

* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): A [`CompositionEvent` handler](#compositionevent-handler) function. Fires when an [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) starts a new composition session.
<Trans>[`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): [`CompositionEvent` 핸들러](#compositionevent-handler) 함수. [input method editor(IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)가 새 조합 세션을 시작할 때 호출됩니다.</Trans>

* `onCompositionStartCapture`: A version of `onCompositionStart` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onCompositionStartCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onCompositionStart`입니다.</Trans>

* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): A [`CompositionEvent` handler](#compositionevent-handler) function. Fires when an [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) completes or cancels a composition session.
<Trans>[`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): [`CompositionEvent` 핸들러](#compositionevent-handler) 함수. [IME](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)가 세션을 종료 또는 취소할 때 호출됩니다.</Trans>

* `onCompositionEndCapture`: A version of `onCompositionEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onCompositionEndCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onCompositionEnd`입니다.</Trans>

* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): A [`CompositionEvent` handler](#compositionevent-handler) function. Fires when an [input method editor](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) receives a new character.
<Trans>[`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): A [`CompositionEvent` 핸들러](#compositionevent-handler) 함수. [IME](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor)가 새 문자를 수신할 때 호출됩니다.</Trans>

* `onCompositionUpdateCapture`: A version of `onCompositionUpdate` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onCompositionUpdateCapture`:[캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onCompositionUpdate` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)</Trans>

* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the user tries to open a context menu.
<Trans>[`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 사용자가 컨텍스트 메뉴를 열고자 할 때 호출됩니다.</Trans>

* `onContextMenuCapture`: A version of `onContextMenu` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onContextMenuCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onContextMenu` 입니다.</Trans>

* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): A [`ClipboardEvent` handler](#clipboardevent-handler) function. Fires when the user tries to copy something into the clipboard.
<Trans>[`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): A [`ClipboardEvent` 핸들러](#clipboardevent-handler) 함수. 사용자가 무언가를 클립보드로 복사하려고 할 때 호출됩니다.</Trans>

* `onCopyCapture`: A version of `onCopy` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onCopyCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onCopy` 입니다.</Trans>

* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): A [`ClipboardEvent` handler](#clipboardevent-handler) function. Fires when the user tries to cut something into the clipboard.
<Trans>[`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): [`ClipboardEvent` 핸들러](#clipboardevent-handler) 함수. 사용자가 클립보드에서 무언가를 잘라내고자 할 때 호출됩니다.</Trans>

* `onCutCapture`: A version of `onCut` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onCutCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onCut` 입니다.</Trans>

* `onDoubleClick`: A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the user clicks twice. Corresponds to the browser [`dblclick` event.](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)
<Trans>`onDoubleClick`: [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 사용자가 두 번 클릭할 때 호출됩니다. 브라우저의 [`dblclick` event](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event)에 해당합니다.</Trans>

* `onDoubleClickCapture`: A version of `onDoubleClick` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onDoubleClickCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onDoubleClick` 입니다.</Trans>

* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): A [`DragEvent` handler](#dragevent-handler) function. Fires while the user is dragging something. 
<Trans>[`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): [`DragEvent` 핸들러](#dragevent-handler) 함수. 사용자가 무언가를 드래그하는 동안 호출됩니다.</Trans>

* `onDragCapture`: A version of `onDrag` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onDragCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onDrag` 입니다.</Trans>

* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): A [`DragEvent` handler](#dragevent-handler) function. Fires when the user stops dragging something. 
<Trans>[`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): [`DragEvent` 핸들러](#dragevent-handler) 함수. 사용자가 드래그를 멈출 때 호춣됩니다.</Trans>

* `onDragEndCapture`: A version of `onDragEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onDragEndCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onDragEnd` 입니다.</Trans>

* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): A [`DragEvent` handler](#dragevent-handler) function. Fires when the dragged content enters a valid drop target. 
<Trans>[`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): A [`DragEvent` 핸들러](#dragevent-handler) 함수. 드래그중인 컨텐트가 유효한 드롭 대상에 진입시 호출됩니다.</Trans>

* `onDragEnterCapture`: A version of `onDragEnter` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onDragEnterCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onDragEnter` 입니다.</Trans>

* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): A [`DragEvent` handler](#dragevent-handler) function. Fires on a valid drop target while the dragged content is dragged over it. You must call `e.preventDefault()` here to allow dropping.
<Trans>[`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): [`DragEvent` 핸들러](#dragevent-handler) 함수. 컨텐트가 유효한 드롭 대상 위에서 드래그중인 동안 호출됩니다. 드롭을 허용하려면 `e.preventDefault()`를 호출해야 합니다.</Trans>

* `onDragOverCapture`: A version of `onDragOver` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onDragOverCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onDragOver` 입니다.</Trans>

* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): A [`DragEvent` handler](#dragevent-handler) function. Fires when the user starts dragging an element.
<Trans>[`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): [`DragEvent` 핸들러](#dragevent-handler) 함수. 사용자가 엘리먼트를 드래그하기 시작할 때 호출됩니다.</Trans>

* `onDragStartCapture`: A version of `onDragStart` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onDragStartCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onDragStart` 입니다.</Trans>

* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): A [`DragEvent` handler](#dragevent-handler) function. Fires when something is dropped on a valid drop target.
<Trans>[`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): [`DragEvent` 핸들러](#dragevent-handler) 함수. 유효한 드롭 대상에 드롭할 때 호출됩니다.</Trans>

* `onDropCapture`: A version of `onDrop` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onDropCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onDrop` 입니다.</Trans>

* `onFocus`: A [`FocusEvent` handler](#focusevent-handler) function. Fires when an element lost focus. Unlike the built-in browser [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) event, in React the `onFocus` event bubbles.
<Trans>`onFocus`: [`FocusEvent` 핸들러](#focusevent-handler) 함수. 엘리먼트가 초점을 잃을 때 호출됩니다. 브라우저 빌트인 [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event)와 달리, 리액트의 `onFocus` 이벤트는 버블이 발생합니다.</Trans>

* `onFocusCapture`: A version of `onFocus` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onFocusCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onFocus` 입니다.</Trans>

* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when an element programmatically captures a pointer.
<Trans>[`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 엘리먼트가 프로그램적으로 포인터를 캡쳐할 때 호출됩니다.</Trans>

* `onGotPointerCaptureCapture`: A version of `onGotPointerCapture` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onGotPointerCaptureCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onGotPointerCapture` 입니다.</Trans>

* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): A [`KeyboardEvent` handler](#pointerevent-handler) function. Fires when a key is pressed.
<Trans>[`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): [`KeyboardEvent` 핸들러](#pointerevent-handler) 함수. 키가 눌릴 때 호출됩니다.</Trans>

* `onKeyDownCapture`: A version of `onKeyDown` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onKeyDownCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onKeyDown` 입니다.</Trans>

* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): A [`KeyboardEvent` handler](#pointerevent-handler) function. Deprecated. Use `onKeyDown` or `onBeforeInput` instead.
<Trans>[`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): [`KeyboardEvent` 핸들러](#pointerevent-handler) 함수. 지원중단되었습니다. `onKeyDown` 또는 `onBeforeInput`를 대신 사용하세요.</Trans>

* `onKeyPressCapture`: A version of `onKeyPress` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onKeyPressCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onKeyPress` 입니다.</Trans>

* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): A [`KeyboardEvent` handler](#pointerevent-handler) function. Fires when a key is released.
<Trans>[`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): [`KeyboardEvent` 핸들러](#pointerevent-handler) 함수. 키를 놓을 때 호출됩니다.</Trans>

* `onKeyUpCapture`: A version of `onKeyUp` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onKeyUpCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onKeyUp` 입니다.</Trans>

* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when an element stops capturing a pointer.
<Trans>[`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 엘리먼트가 포인터 캡쳐를 중지할 때 호출됩니다.</Trans>

* `onLostPointerCaptureCapture`: A version of `onLostPointerCapture` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onLostPointerCaptureCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onLostPointerCapture` 입니다.</Trans>

* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the pointer is pressed down.
<Trans>[`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터를 누를 때 호출됩니다.</Trans>

* `onMouseDownCapture`: A version of `onMouseDown` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onMouseDownCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onMouseDown` 입니다.</Trans>

* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the pointer moves inside an element. Does not have a capture phase. Instead, `onMouseLeave` and `onMouseEnter` propagate from the element being left to the one being entered.
<Trans>[`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터가 엘리먼트 내부로 이동할 때 호출됩니다. 캡쳐 단계가 없습니다. 대신 `onMouseLeave`와 `onMouseEnter`는 떠나는 엘리먼트에서 들어가는 이벤트로 전파됩니다.</Trans>

* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the pointer moves outside an element. Does not have a capture phase. Instead, `onMouseLeave` and `onMouseEnter` propagate from the element being left to the one being entered.
<Trans>[`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터가 엘리먼트 외부로 이동할 때 호출됩니다. 캡쳐 단계가 없습니다. 대신 `onMouseLeave` 및 `onMouseEnter`는 떠나는 엘리먼트에서 들어가는 엘리먼트로 전파됩니다.</Trans>

* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the pointer changes coordinates.
<Trans>[`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터 좌표가 변경될 때 호출됩니다.</Trans>

* `onMouseMoveCapture`: A version of `onMouseMove` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onMouseMoveCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onMouseMove` 입니다.</Trans>

* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the pointer moves outside an element, or if it moves into a child element.
<Trans>[`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터가 엘리먼트 바깥으로 또는 자식 엘리먼트로 이동할 때 호출됩니다.</Trans>

* `onMouseOutCapture`: A version of `onMouseOut` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onMouseOutCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onMouseOut` 입니다.</Trans>

* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): A [`MouseEvent` handler](#mouseevent-handler) function. Fires when the pointer is released.
<Trans>[`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): [`MouseEvent` 핸들러](#mouseevent-handler) 함수. 포인터를 놓을 때 호출됩니다.</Trans>

* `onMouseUpCapture`: A version of `onMouseUp` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onMouseUpCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onMouseUp` 입니다.</Trans>

* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when the browser cancels a pointer interaction.
<Trans>[`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 브라우저가 포인터 상호작용을 취소할 때 호출됩니다.</Trans>

* `onPointerCancelCapture`: A version of `onPointerCancel` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onPointerCancelCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onPointerCancel` 입니다.</Trans>

* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when a pointer becomes active.
<Trans>[`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 포인터가 활성화될 때 호출됩니다.</Trans>

* `onPointerDownCapture`: A version of `onPointerDown` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onPointerDownCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onPointerDown` 입니다.</Trans>

* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when a pointer moves inside an element. Does not have a capture phase. Instead, `onPointerLeave` and `onPointerEnter` propagate from the element being left to the one being entered.
<Trans>[`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 포인터가 내부 엘리먼트로 이동할 때 호출됩니다. 캡쳐 단계가 없습니다. 대신 `onPointerLeave` 및 `onPointerEnter`는 떠나는 엘리먼트에서 들어가는 엘리먼트로 전파됩니다.</Trans>

* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when a pointer moves outside an element. Does not have a capture phase. Instead, `onPointerLeave` and `onPointerEnter` propagate from the element being left to the one being entered.
<Trans>[`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 포인터가 엘리먼트 외부로 이동할 때 호출됩니다. 캡쳐 단계가 없습니다. 대신 `onPointerLeave` 및 `onPointerEnter`는 떠나는 엘리먼트에서 들어가는 엘리먼트로 전파됩니다.</Trans>

* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when a pointer changes coordinates.
<Trans>[`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 포인터 좌표가 변경될 때 호출됩니다.</Trans>

* `onPointerMoveCapture`: A version of `onPointerMove` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onPointerMoveCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onPointerMove` 입니다.</Trans>

* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when a pointer moves outside an element, if the pointer interaction is cancelled, and [a few other reasons.](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)
<Trans>[`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 포인터가 엘리먼트 외부로 이동하거나, 포인터 상호작용이 취소되거나, 기타 [몇몇 다른 이유들](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event)로 호출됩니다.</Trans>

* `onPointerOutCapture`: A version of `onPointerOut` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onPointerOutCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onPointerOut` 입니다.</Trans>

* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): A [`PointerEvent` handler](#pointerevent-handler) function. Fires when a pointer is no longer active.
<Trans>[`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): [`PointerEvent` 핸들러](#pointerevent-handler) 함수. 포인터가 비활성화될 때 호출됩니다.</Trans>

* `onPointerUpCapture`: A version of `onPointerUp` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onPointerUpCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onPointerUp` 입니다.</Trans>

* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): A [`ClipboardEvent` handler](#clipboardevent-handler) function. Fires when the user tries to paste something from the clipboard.
<Trans>[`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): [`ClipboardEvent` 핸들러](#clipboardevent-handler) 함수. 사용자가 클립보드로부터 무언가를 붙여넣고자 할 때 호출됩니다.</Trans>

* `onPasteCapture`: A version of `onPaste` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onPasteCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onPaste` 입니다.</Trans>

* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): An [`Event` handler](#event-handler) function. Fires when an element has been scrolled. This event does not bubble.
<Trans>[`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): [`Event` 핸들러](#event-handler) 함수. 엘리먼트가 스크롤될 때 호출됩니다. 이 이벤트는 버블이 발생하지 않습니다.</Trans>

* `onScrollCapture`: A version of `onScroll` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onScrollCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onScroll` 입니다.</Trans>

* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): An [`Event` handler](#event-handler) function. Fires after the selection inside an editable element like an input changes. React extends the `onSelect` event to work for `contentEditable={true}` elements as well. In addition, React extends it to fire for empty selection and on edits (which may affect the selection).
<Trans>[`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Event` 핸들러](#event-handler) 함수. </Trans>
input과 같은 편집 가능한 엘리먼트 내부의 선택영역이 변경될 때 호출됩니다. React는 `onSelect` 이벤트를 `contentEditable={true}` 엘리먼트에서도 작동하도록 확장합니다. 또한 선택 영역이 빈 경우 및 선택에 영향을 줄 수 있는 편집 시에도 발동되도록 확장합니다.

* `onSelectCapture`: A version of `onSelect` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onSelectCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onSelect` 입니다.</Trans>

* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): A [`TouchEvent` handler](#touchevent-handler) function. Fires when the browser cancels a touch interaction.
<Trans>[`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): [`TouchEvent` 핸들러](#touchevent-handler) 함수. 브라우저가 터치 상호작용을 취소할 때 호출됩니다.</Trans>

* `onTouchCancelCapture`: A version of `onTouchCancel` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onTouchCancelCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onTouchCancel` 입니다.</Trans>

* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): A [`TouchEvent` handler](#touchevent-handler) function. Fires when one or more touch points are removed.
<Trans>[`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): [`TouchEvent` 핸들러](#touchevent-handler) 함수. 하나 이상의 터치 포인트가 제거될 때 호출됩니다.</Trans>

* `onTouchEndCapture`: A version of `onTouchEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onTouchEndCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onTouchEnd` 입니다.</Trans>

* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): A [`TouchEvent` handler](#touchevent-handler) function. Fires one or more touch points are moved.
<Trans>[`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): [`TouchEvent` 핸들러](#touchevent-handler) 함수. 하나 이상의 터치 포인트가 이동할 때 호출됩니다.</Trans>

* `onTouchMoveCapture`: A version of `onTouchMove` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onTouchMoveCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onTouchMove` 입니다.</Trans>

* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): A [`TouchEvent` handler](#touchevent-handler) function. Fires when one or more touch points are placed.
<Trans>[`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): [`TouchEvent` 핸들러](#touchevent-handler) 함수. 하나 이상의 터치 포인트가 배치될 때 호출됩니다.</Trans>

* `onTouchStartCapture`: A version of `onTouchStart` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onTouchStartCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onTouchStart` 입니다.</Trans>

* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): A [`TransitionEvent` handler](#transitionevent-handler) function. Fires when a CSS transition completes.
<Trans>[`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): [`TransitionEvent` 핸들러](#transitionevent-handler) 함수. CSS 트랜지션 종료시 호출됩니다.</Trans>

* `onTransitionEndCapture`: A version of `onTransitionEnd` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onTransitionEndCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onTransitionEnd` 입니다.</Trans>

* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): A [`WheelEvent` handler](#wheelevent-handler) function. Fires when the user rotates a wheel button.
<Trans>[`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): [`WheelEvent` 핸들러](#wheelevent-handler) 함수. 사용자가 휠 버튼을 돌릴 때 호출됩니다.</Trans>

* `onWheelCapture`: A version of `onWheel` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onWheelCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onWheel` 입니다.</Trans>

* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): A string. Specifies the element role explicitly for assistive technologies. nt.
<Trans>[`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): 문자열. 보조기술에 대한 엘리먼트의 역할을 명시적으로 지정합니다.</Trans>

* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): A string. Specifies the slot name when using shadow DOM. In React, an equivalent pattern is typically achieved by passing JSX as props, for example `<Layout left={<Sidebar />} right={<Content />} />`.
<Trans>[`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): 문자열. 새도우 DOM을 사용할 때 슬롯의 이름을 지정합니다. React에서는 일반적으로 JSX를 props로 전달함으로써 동등한 패턴을 얻을 수 있습니다 (예: `<Layout left={<Sidebar />} right={<Content />} />`).</Trans>

* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): A boolean or null. If explicitly set to `true` or `false`, enables or disables spellchecking.
<Trans>[`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): 불리언 또는 null. 명시적으로 `true` 또는 `false`로 설정된 경우 맞춤법 검사를 활성화 또는 비활성화합니다.</Trans>

* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): A number. Overrides the default Tab button behavior. [Avoid using values other than `-1` and `0`.](https://www.tpgi.com/using-the-tabindex-attribute/)
<Trans>[`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): 숫자. 기본 탭버튼 동작을 재정의합니다. [`-1` 및 `0` 이외의 값을 사용하지 마세요.](https://www.tpgi.com/using-the-tabindex-attribute/)</Trans>

* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): A string. Specifies the tooltip text for the element.
<Trans>[`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): 문자열. 엘리먼트의 툴팁 텍스트를 지정합니다.</Trans>

* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): Either `'yes'` or `'no'`. Passing `'no'` excludes the element content from being translated.
<Trans>[`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): `'yes'` 또는 `'no'` 중 하나입니다. `'no'`를 전달하면 엘리먼트의 콘텐츠가 번역에서 제외됩니다.</Trans>

You can also pass custom attributes as props, for example `mycustomprop="someValue".` This can be useful when integrating with third-party libraries. The custom attribute name must be lowercase and must not start with `on`. The value will be converted to a string. If you pass `null` or `undefined`, the custom attribute will be removed.
<Trans>사용자 정의 속성을 프로퍼티로 전달할 수도 있습니다(예: `mycustomprop="someValue"`). 이는 타사 라이브러리와 통합할 때 유용할 수 있습니다. 사용자 정의 속성 이름은 소문자여야 하며 `on`으로 시작하지 않아야 합니다. 값은 문자열로 변환됩니다. `null` 또는 `undefined`를 전달하면 사용자 정의 속성이 제거됩니다.</Trans>

These events fire only for the [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) elements:
<Trans>다음 이벤트들은 [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) 엘리먼트에 대해서만 호출됩니다:</Trans>

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): An [`Event` handler](#event-handler) function. Fires when a form gets reset.
<Trans>[`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): [`Event` 핸들러](#event-handler) 함수. 폼을 리셋할 때 호출됩니다.</Trans>

* `onResetCapture`: A version of `onReset` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onResetCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onReset` 입니다.</Trans>

* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): An [`Event` handler](#event-handler) function. Fires when a form gets submitted.
<Trans>[`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): [`Event` 핸들러](#event-handler) 함수. 폼을 제출할 때 호출됩니다.</Trans>

* `onSubmitCapture`: A version of `onSubmit` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onSubmitCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onSubmit` 입니다.</Trans>

These events fire only for the [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) elements. Unlike browser events, they bubble in React:
<Trans>다음 이벤트들은 [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) 엘리먼트에 대해서만 호출됩니다. 브라우저 이벤트와 달리, React에서는 버블이 발생합니다:</Trans>

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): An [`Event` handler](#event-handler) function. Fires when the user tries to dismiss the dialog.
<Trans>[`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): [`Event` 핸들러](#event-handler) 함수. 사용자가 dialog를 닫으려 할 때 호출됩니다.</Trans>

* `onCancelCapture`: A version of `onCancel` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onCancelCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onCancel` 입니다.</Trans>

* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): An [`Event` handler](#event-handler) function. Fires when a dialog has been closed.
<Trans>[`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): [`Event` 핸들러](#event-handler) 함수. dialog가 닫혔을 때 호출됩니다.</Trans>

* `onCloseCapture`: A version of `onClose` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onCloseCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onClose` 입니다.</Trans>

These events fire only for the [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) elements. Unlike browser events, they bubble in React:
<Trans>다음 이벤트들은 [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) 엘리먼트에 대해서만 호출됩니다. 브라우저 이벤트와 달리, React에서는 버블이 발생합니다:</Trans>

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): An [`Event` handler](#event-handler) function. Fires when the user toggles the details.
<Trans>[`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): [`Event` 핸들러](#event-handler) 함수. 사용자가 details를 토글할 때 호출됩니다.</Trans>

* `onToggleCapture`: A version of `onToggle` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onToggleCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onToggle` 입니다.</Trans>

These events fire for [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), and [SVG `<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag) elements. Unlike browser events, they bubble in React:
<Trans>다음 이벤트들은  [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), [SVG `<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag) 엘리먼트에 대해서만 호출됩니다. 브라우저 이벤트와 달리, React에서는 버블이 발생합니다:</Trans>

* `onLoad`: An [`Event` handler](#event-handler) function. Fires when the resource has loaded.
<Trans>`onLoad`: [`Event` 핸들러](#event-handler) 함수. 리소스가 로드되면 호출됩니다.</Trans>

* `onLoadCapture`: A version of `onLoad` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onLoadCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onLoad` 입니다.</Trans>

* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): An [`Event` handler](#event-handler) function. Fires when the resource could not be loaded.
<Trans>[`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): [`Event` 핸들러](#event-handler) 함수. 리소스를 로드할 수 없을 때 호출됩니다.</Trans>

* `onErrorCapture`: A version of `onError` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onErrorCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onError` 입니다.</Trans>

These events fire for resources like [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) and [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video). Unlike browser events, they bubble in React:
<Trans>다음 이벤트들은 [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)나 [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) 같은 리소스에 대해서만 호출됩니다. 브라우저 이벤트와 달리, React에서는 버블이 발생합니다:</Trans>

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): An [`Event` handler](#event-handler) function. Fires when the resource has not fully loaded, but not due to an error.
<Trans>[`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): [`Event` 핸들러](#event-handler) 함수. 리소스가 완전히 로드되지 않았지만 오류로 인한 것이 아닌 경우 호출됩니다.</Trans>

* `onAbortCapture`: A version of `onAbort` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onAbortCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onAbort` 입니다.</Trans>

* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): An [`Event` handler](#event-handler) function. Fires when there's enough data to start playing, but not enough to play to the end without buffering.
<Trans>[`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): [`Event` 핸들러](#event-handler) 함수. 재생하기에 충분한 데이터가 있지만 버퍼링 없이 끝까지 재생할 수는 없을 때 호출됩니다.</Trans>

* `onCanPlayCapture`: A version of `onCanPlay` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onCanPlayCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onCanPlay` 입니다.</Trans>

* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): An [`Event` handler](#event-handler) function. Fires when there's enough data that it's likely possible to start playing without buffering until the end.
<Trans>[`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): [`Event` 핸들러](#event-handler) 함수. 데이터가 충분하여 끝까지 버퍼링 없이 재생할 수 있을 때 호출됩니다.</Trans>

* `onCanPlayThroughCapture`: A version of `onCanPlayThrough` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onCanPlayThroughCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onCanPlayThrough` 입니다.</Trans>

* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): An [`Event` handler](#event-handler) function. Fires when the media duration has updated.
<Trans>[`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): [`Event` 핸들러](#event-handler) 함수. 미디어 지속시간이 업데이트될 때 호출됩니다.</Trans>

* `onDurationChangeCapture`: A version of `onDurationChange` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onDurationChangeCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onDurationChange` 입니다.</Trans>

* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): An [`Event` handler](#event-handler) function. Fires when the media has become empty.
<Trans>[`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): [`Event` 핸들러](#event-handler) 함수. 미디어가 비었을 때 호출됩니다.</Trans>

* `onEmptiedCapture`: A version of `onEmptied` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onEmptiedCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onEmptied` 입니다.</Trans>

* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): An [`Event` handler](#event-handler) function. Fires when the browser encounters encrypted media.
<Trans>[`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): [`Event` 핸들러](#event-handler) 함수. 브라우저에서 암호화된 미디어를 발견하면 호출됩니다.</Trans>

* `onEncryptedCapture`: A version of `onEncrypted` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onEncryptedCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onEncrypted` 입니다.</Trans>

* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): An [`Event` handler](#event-handler) function. Fires when the playback stops because there's nothing left to play.
<Trans>[`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): [`Event` 핸들러](#event-handler) 함수. 재생할 콘텐츠가 남아 있지 않아 재생이 중지될 때 호출됩니다.</Trans>

* `onEndedCapture`: A version of `onEnded` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onEndedCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onEnded` 입니다.</Trans>

* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): An [`Event` handler](#event-handler) function. Fires when the resource could not be loaded.
<Trans>[`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): [`Event` 핸들러](#event-handler) 함수. 리소스를 로드할 수 없을 때 호출됩니다.</Trans>

* `onErrorCapture`: A version of `onError` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onErrorCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onError` 입니다.</Trans>

* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): An [`Event` handler](#event-handler) function. Fires when the current playback frame has loaded.
<Trans>[`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): [`Event` 핸들러](#event-handler) 함수. 현재 재생 프레임이 로드되면 호출됩니다.</Trans>

* `onLoadedDataCapture`: A version of `onLoadedData` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onLoadedDataCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onLoadedData` 입니다.</Trans>

* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): An [`Event` handler](#event-handler) function. Fires when metadata has loaded.
<Trans>[`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): [`Event` 핸들러](#event-handler) 함수. 메타데이터가 로드되면 호출됩니다.</Trans>

* `onLoadedMetadataCapture`: A version of `onLoadedMetadata` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onLoadedMetadataCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onLoadedMetadata` 입니다.</Trans>

* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): An [`Event` handler](#event-handler) function. Fires when the browser started loading the resource.
<Trans>[`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): [`Event` 핸들러](#event-handler) 함수. 브라우저가 리소스 로드를 시작했을 때 호출됩니다.</Trans>

* `onLoadStartCapture`: A version of `onLoadStart` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onLoadStartCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onLoadStart` 입니다.</Trans>

* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): An [`Event` handler](#event-handler) function. Fires when the media was paused.
<Trans>[`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): [`Event` 핸들러](#event-handler) 함수. 미디어가 일시정지되었을 때 호출됩니다.</Trans>

* `onPauseCapture`: A version of `onPause` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onPauseCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onPause` 입니다.</Trans>

* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): An [`Event` handler](#event-handler) function. Fires when the media is no longer paused.
<Trans>[`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): [`Event` 핸들러](#event-handler) 함수. 미디어가 더이상 일시정지되지 않을 때 호출됩니다.</Trans>

* `onPlayCapture`: A version of `onPlay` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onPlayCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onPlay` 입니다.</Trans>

* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): An [`Event` handler](#event-handler) function. Fires when the media starts or restarts playing.
<Trans>[`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): [`Event` 핸들러](#event-handler) 함수. 미디어가 재생을 시작하거나 재시작할 때 호출됩니다.</Trans>

* `onPlayingCapture`: A version of `onPlaying` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onPlayingCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onPlaying` 입니다.</Trans>

* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): An [`Event` handler](#event-handler) function. Fires periodically while the resource is loading.
<Trans>[`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): [`Event` 핸들러](#event-handler) 함수. 리소스가 로드되는 동안 주기적으로 실행됩니다.</Trans>

* `onProgressCapture`: A version of `onProgress` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onProgressCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onProgress` 입니다.</Trans>

* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): An [`Event` handler](#event-handler) function. Fires when playback rate changes.
<Trans>[`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): [`Event` 핸들러](#event-handler) 함수. 재생 속도가 변경되면 호출됩니다.</Trans>

* `onRateChangeCapture`: A version of `onRateChange` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onRateChangeCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onRateChange` 입니다.</Trans>

* `onResize`: An [`Event` handler](#event-handler) function. Fires when video changes size.
<Trans>`onResize`: [`Event` 핸들러](#event-handler) 함수. 동영상 크기가 변경될 때 호출됩니다.</Trans>

* `onResizeCapture`: A version of `onResize` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onResizeCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onResize` 입니다.</Trans>

* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): An [`Event` handler](#event-handler) function. Fires when a seek operation completes.
<Trans>[`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): [`Event` 핸들러](#event-handler) 함수. 탐색 작업이 완료되면 호출됩니다.</Trans>

* `onSeekedCapture`: A version of `onSeeked` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onSeekedCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onSeeked` 입니다.</Trans>

* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): An [`Event` handler](#event-handler) function. Fires when a seek operation starts.
<Trans>[`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): [`Event` 핸들러](#event-handler) 함수. 탐색 작업 시작시 호출됩니다.</Trans>

* `onSeekingCapture`: A version of `onSeeking` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onSeekingCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onSeeking` 입니다.</Trans>

* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): An [`Event` handler](#event-handler) function. Fires when the browser is waiting for data but it keeps not loading.
<Trans>[`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): [`Event` 핸들러](#event-handler) 함수. 브라우저가 데이터를 대기 중이지만 계속 로드되지 않을 때 호출됩니다.</Trans>

* `onStalledCapture`: A version of `onStalled` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onStalledCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onStalled` 입니다.</Trans>

* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): An [`Event` handler](#event-handler) function. Fires when loading the resource was suspended.
<Trans>[`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): [`Event` 핸들러](#event-handler) 함수. 리소스 로딩이 일시 중단되었을 때 호출됩니다.</Trans>

* `onSuspendCapture`: A version of `onSuspend` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onSuspendCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onSuspend` 입니다.</Trans>

* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): An [`Event` handler](#event-handler) function. Fires when the current playback time updates.
<Trans>[`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): [`Event` 핸들러](#event-handler) 함수. 현재 재생 시간이 업데이트될 때 호출됩니다.</Trans>

* `onTimeUpdateCapture`: A version of `onTimeUpdate` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onTimeUpdateCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onTimeUpdate` 입니다.</Trans>

* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): An [`Event` handler](#event-handler) function. Fires when the volume has changed.
<Trans>[`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): [`Event` 핸들러](#event-handler) 함수. 볼륨이 변경되었을 때 호출됩니다.</Trans>

* `onVolumeChangeCapture`: A version of `onVolumeChange` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onVolumeChangeCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onVolumeChange` 입니다.</Trans>

* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): An [`Event` handler](#event-handler) function. Fires when the playback stopped due to temporary lack of data.
<Trans>[`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): [`Event` 핸들러](#event-handler) 함수. 일시적인 데이터 부족으로 재생이 중지된 경우 호출됩니다.</Trans>

* `onWaitingCapture`: A version of `onWaiting` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
<Trans>`onWaitingCapture`: [캡쳐 단계](/learn/responding-to-events#capture-phase-events)에서 실행되는 버전의 `onWaiting` 입니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*common-caveats*/}

- You cannot pass both `children` and `dangerouslySetInnerHTML` at the same time.
<Trans>`children`과 `dangerouslySetInnerHTML`을 동시에 전달할 수 없습니다.</Trans>

- Some events (like `onAbort` and `onLoad`) don't bubble in the browser, but bubble in React.
<Trans>일부 이벤트(예: `onAbort` 및 `onLoad`)는 브라우저에서는 버블링되지 않지만 React에서는 버블링됩니다.</Trans>

---

### `ref` callback function <Trans>`ref` 콜백 함수</Trans> {/*ref-callback*/}

Instead of a ref object (like the one returned by [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)), you may pass a function to the `ref` attribute.
<Trans>ref 객체(예: [`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref)에서 반환하는 객체) 대신 `ref` 속성에 함수를 전달할 수 있습니다.</Trans>

```js
<div ref={(node) => console.log(node)} />
```

[See an example of using the `ref` callback.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)
<Trans>[`ref` 콜백 사용 예시를 확인하세요.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)</Trans>

When the `<div>` DOM node is added to the screen, React will call your `ref` callback with the DOM `node` as the argument. When that `<div>` DOM node is removed, React will call your `ref` callback with `null`.
<Trans>`<div>` DOM 노드가 화면에 추가되면 React는 DOM `node`를 인수로 사용하여 `ref` 콜백을 호출합니다. 해당 `<div>` DOM 노드가 제거되면 React는 `null`로 `ref` 콜백을 호출합니다.</Trans>

React will also call your `ref` callback whenever you pass a *different* `ref` callback. In the above example, `(node) => { ... }` is a different function on every render. When your component re-renders, the *previous* function will be called with `null` as the argument, and the *next* function will be called with the DOM node.
<Trans>React는 또한 *다른* `ref` 콜백을 전달할 때마다 `ref` 콜백을 호출합니다. 위의 예에서 `(node) => { ... }`는 렌더링할 때마다 다른 기능입니다. 이것이 컴포넌트가 다시 렌더링될 때 `null`을 인자로 사용하여 *previous* 함수가 호출되고 DOM 노드로 *next* 함수가 호출되는 이유입니다.</Trans>
#### Parameters<Trans>매개변수</Trans> {/*ref-callback-parameters*/}

* `node`: A DOM node or `null`. React will pass you the DOM node when the ref gets attached, and `null` when the ref gets detached. Unless you pass the same function reference for the `ref` callback on every render, the callback will get temporarily detached and re-attached during ever re-render of the component.
<Trans outdent>`node`: DOM 노드 또는 `null`. React는 ref가 연결될 때 DOM 노드를 전달하고, ref가 분리될 때 `null`을 전달합니다. 모든 렌더링에서 `ref` 콜백에 대해 동일한 함수 참조를 전달하지 않는 한, 컴포넌트를 다시 렌더링할 때마다 콜백이 일시적으로 분리되었다가 다시 연결됩니다.</Trans>
#### Returns<Trans>반환값</Trans> {/*returns*/}

Do not return anything from the `ref` callback.
<Trans>`ref` 콜백에서 아무것도 반환하지 않습니다.</Trans>

---

### React event object <Trans>React 이벤트 객체</Trans> {/*react-event-object*/}

Your event handlers will receive a *React event object.* It is also sometimes known as a "synthetic event".
<Trans>이벤트 핸들러는 *React 이벤트 객체*를 받게 되며, "합성 이벤트"라고도 합니다.</Trans>

```js
<button onClick={e => {
  console.log(e); // React event object
                  // React 이벤트 객체
}} />
```

It conforms to the same standard as the underlying DOM events, but fixes some browser inconsistencies.
<Trans>기본 DOM 이벤트와 동일한 표준을 준수하지만 일부 브라우저 불일치를 수정합니다.</Trans>

Some React events do not map directly to the browser's native events. For example in `onMouseLeave`, `e.nativeEvent` will point to a `mouseout` event. The specific mapping is not part of the public API and may change in the future. If you need the underlying browser event for some reason, read it from `e.nativeEvent`.
<Trans>일부 React 이벤트는 브라우저의 네이티브 이벤트에 직접 매핑되지 않습니다. 예를 들어 `onMouseLeave`에서 `e.nativeEvent`는 `mouseout` 이벤트를 가리킵니다. 특정 매핑은 공개 API의 일부가 아니며 향후 변경될 수 있습니다. 어떤 이유로 기본 브라우저 이벤트가 필요한 경우 `e.nativeEvent`에서 읽어오세요.</Trans>

#### Properties <Trans>프로퍼티</Trans> {/*react-event-object-properties*/}

React event objects implement some of the standard [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) properties:
<Trans>React 이벤트 객체는 표준 [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) 프로퍼티 중 일부를 구현합니다:</Trans>

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): A boolean. Returns whether the event bubbles through the DOM. 
<Trans>[`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles) : 불리언. 이벤트가 DOM을 통해 버블을 발생시킬지 여부를 반환합니다.</Trans>

* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): A boolean. Returns whether the event can be canceled.
<Trans>[`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): 불리언. 이벤트를 취소할 수 있는지 여부를 반환합니다.</Trans>

* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): A DOM node. Returns the node to which the current handler is attached in the React tree.
<Trans>[`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): DOM 노드. React 트리에서 현재 핸들러가 연결된 노드를 반환합니다.</Trans>

* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): A boolean. Returns whether `preventDefault` was called.
<Trans>[`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): 불리언. preventDefault`가 호출되었는지 여부를 반환합니다.</Trans>

* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): A number. Returns which phase the event is currently in.
<Trans>[`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): 숫자. 이벤트가 현재 어떤 단계에 있는지 반환합니다.</Trans>

* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): A boolean. Returns whether the event was initiated by user.
<Trans>[`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): 불리언. 이벤트가 사용자에 의해 시작되었는지 여부를 반환합니다.</Trans>

* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): A DOM node. Returns the node on which the event has occurred (which could be a distant child).
<Trans>[`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): DOM 노드. 이벤트가 발생한 노드(먼 자식일 수 있음)를 반환합니다.</Trans>

* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): A number. Returns the time when the event occurred.
<Trans>[`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): 숫자. 이벤트가 발생한 시간을 반환합니다.</Trans>

Additionally, React event objects provide these properties:
<Trans>또한 React 이벤트 객체는 이러한 프로퍼티를 제공합니다:</Trans>

* `nativeEvent`: A DOM [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). The original browser event object.
<Trans outdent>`nativeEvent`: DOM [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event). 원본 브라우저 이벤트 객체입니다.</Trans>
 
#### Methods <Trans>메소드</Trans> {/*react-event-object-methods*/}

React event objects implement some of the standard [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) methods:
<Trans>React 이벤트 객체는 표준 [`Event`](https://developer.mozilla.org/ko/docs/Web/API/Event) 메서드 중 일부를 구현합니다:</Trans>

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): Prevents the default browser action for the event.
<Trans>[`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): 이벤트에 대한 기본 브라우저 액션을 방지합니다.</Trans>

* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): Stops the event propagation through the React tree.
<Trans>[`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): React 트리를 통한 이벤트 전파를 중지합니다.</Trans>

Additionally, React event objects provide these methods:
<Trans>또한 React 이벤트 객체는 이러한 메서드를 제공합니다:</Trans>

* `isDefaultPrevented()`: Returns a boolean value indicating whether `preventDefault` was called.
<Trans>`isDefaultPrevented()`: `preventDefault`가 호출되었는지 여부를 나타내는 부울 값을 반환합니다.</Trans>

* `isPropagationStopped()`: Returns a boolean value indicating whether `stopPropagation` was called.
<Trans>`isPropagationStopped()`: `stopPropagation`가 호출되었는지 여부를 나타내는 부울 값을 반환합니다.</Trans>

* `persist()`: Not used with React DOM. With React Native, call this to read event's properties after the event.
<Trans>`persist()`: React DOM에서는 사용되지 않습니다. React Native에서는 이벤트 이후 이벤트의 프로퍼티를 읽으려면 이 함수를 호출합니다.</Trans>

* `isPersistent()`: Not used with React DOM. With React Native, returns whether `persist` has been called.
<Trans>`isPersistent()`: React DOM에서는 사용되지 않습니다. React Native에서는 `persist`가 호출되었는지 여부를 반환합니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*react-event-object-caveats*/}

* The values of `currentTarget`, `eventPhase`, `target`, and `type` reflect the values your React code expects. Under the hood, React attaches event handlers at the root, but this is not reflected in React event objects. For example, `e.currentTarget` may not be the same as the underlying `e.nativeEvent.currentTarget`. For polyfilled events, `e.type` (React event type) may differ from `e.nativeEvent.type` (underlying type).
<Trans outdent>`currentTarget`, `eventPhase`, `target`, `type`의 값은 React 코드가 기대하는 값을 반영합니다. 내부적으로 React는 이벤트 핸들러를 루트에 첨부하지만, 이는 React 이벤트 객체에는 반영되지 않습니다. 예를 들어, `e.currentTarget`은 기본 `e.nativeEvent.currentTarget`과 같지 않을 수 있습니다. 폴리필 이벤트의 경우, `e.type`(React 이벤트 타입)이 `e.nativeEvent.type`(기본 타입)과 다를 수 있습니다.</Trans>

---

### `AnimationEvent` handler function <Trans>`AnimationEvent` 핸들러 함수</Trans> {/*animationevent-handler*/}

An event handler type for the [CSS animation](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) events.
<Trans>[CSS 애니메이션](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Animations/Using_CSS_animations) 이벤트에 대한 이벤트 핸들러 유형입니다.</Trans>

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Parameters<Trans>매개변수</Trans> {/*animationevent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent) properties:
<Trans outdent>`e`: 추가 [`AnimationEvent`](https://developer.mozilla.org/ko/docs/Web/API/AnimationEvent) 속성을 가진 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent)

---

### `ClipboardEvent` handler function <Trans>`ClipboardEvent` 핸들러 함수</Trans> {/*clipboadevent-handler*/}

An event handler type for the [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) events.
<Trans>[Clipboard API](https://developer.mozilla.org/ko/docs/Web/API/Clipboard_API) 이벤트에 대한 이벤트 핸들러 유형입니다.</Trans>

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Parameters<Trans>매개변수</Trans> {/*clipboadevent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent) properties:
<Trans outdent>`e`: 추가 [`ClipboardEvent`](https://developer.mozilla.org/ko/docs/Web/API/ClipboardEvent) 속성을 가진 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### `CompositionEvent` handler function <Trans>`CompositionEvent` 핸들러 함수</Trans> {/*compositionevent-handler*/}

An event handler type for the [input method editor (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) events.
<Trans>[input method editor (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) 이벤트에 대한 이벤트 핸들러 유형입니다.</Trans>

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Parameters<Trans>매개변수</Trans> {/*compositionevent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent) properties:
<Trans outdent>`e`: 추가 [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent) 속성을 가진 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### `DragEvent` handler function <Trans>`DragEvent` 핸들러 함수</Trans> {/*dragevent-handler*/}

An event handler type for the [HTML Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) events.
<Trans>[HTML Drag and Drop API](https://developer.mozilla.org/ko/docs/Web/API/HTML_Drag_and_Drop_API) 이벤트에 대한 이벤트 핸들러 유형입니다.</Trans>

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Drag source
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Drop target
  </div>
</>
```

#### Parameters<Trans>매개변수</Trans> {/*dragevent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent) properties:
<Trans outdent>`e`: 추가 [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent) 속성을 가진 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  It also includes the inherited [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) properties:
  <Trans>상속된 [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) 속성도 포함됩니다:</Trans>

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  It also includes the inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties:
  <Trans>상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성도 포함됩니다:</Trans>

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `FocusEvent` handler function <Trans>`FocusEvent` 핸들러 함수</Trans> {/*focusevent-handler*/}

An event handler type for the focus events.
<Trans>포커스 이벤트에 대한 이벤트 핸들러 유형입니다.</Trans>

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[See an example.](#handling-focus-events)
<Trans>[예시를 확인하세요.](#handling-focus-events)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*focusevent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) properties:
<Trans outdent>`e`: 추가 [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) 속성을 가진 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  It also includes the inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties:
  <Trans>상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성도 포함됩니다:</Trans>

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `Event` handler function <Trans>`Event` 핸들러 함수</Trans> {/*event-handler*/}

An event handler type for generic events.
<Trans>일반 이벤트를 위한 이벤트 핸들러 유형입니다.</Trans>

#### Parameters<Trans>매개변수</Trans> {/*event-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with no additional properties.  
<Trans outdent>`e`: 추가 프로퍼티가 없는 [React 이벤트 객체](#react-event-object)입니다.</Trans>

---

### `InputEvent` handler function <Trans>`InputEvent` 핸들러 함수</Trans> {/*inputevent-handler*/}

An event handler type for the `onBeforeInput` event.
<Trans>`onBeforeInput` 이벤트에 대한 이벤트 핸들러 유형입니다.</Trans>

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Parameters<Trans>매개변수</Trans> {/*inputevent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent) properties:
<Trans outdent>`e`: 추가 [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent) 프로퍼티가 있는 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### `KeyboardEvent` handler function <Trans>`KeyboardEvent` 핸들러 함수</Trans> {/*keyboardevent-handler*/}

An event handler type for keyboard events.
<Trans>키보드 이벤트를 위한 이벤트 핸들러 유형입니다.</Trans>

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[See an example.](#handling-keyboard-events)
<Trans>[예시를 확인하세요.](#handling-keyboard-events)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*keyboardevent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) properties:
<Trans outdent>`e`: 추가 [`KeyboardEvent`](https://developer.mozilla.org/ko/docs/Web/API/KeyboardEvent) 속성을 가진 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  It also includes the inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties:
  <Trans>상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성도 포함됩니다:</Trans>

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `MouseEvent` handler function <Trans>`MouseEvent` 핸들러 함수</Trans> {/*mouseevent-handler*/}

An event handler type for mouse events.
<Trans>마우스 이벤트에 대한 이벤트 핸들러 유형입니다.</Trans>

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[See an example.](#handling-mouse-events)
<Trans>[예시를 확인하세요.](#handling-mouse-events)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*mouseevent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) properties:
<Trans outdent>`e`: 추가 [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) 속성을 가진 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  It also includes the inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties:
  <Trans>상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성도 포함됩니다:</Trans>

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `PointerEvent` handler function <Trans>`PointerEvent` 핸들러 함수</Trans> {/*pointerevent-handler*/}

An event handler type for [pointer events.](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)
<Trans>[포인터 이벤트](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events)에 대한 이벤트 핸들러 유형입니다.</Trans>

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[See an example.](#handling-pointer-events)
<Trans>[예시를 확인하세요.](#handling-pointer-events)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*pointerevent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) properties:
<Trans outdent>`e`: 추가 [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) 속성을 가진 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  It also includes the inherited [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) properties:
  <Trans>상속된 [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) 속성도 포함됩니다:</Trans>

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  It also includes the inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties:
  <Trans>상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성도 포함됩니다:</Trans>

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TouchEvent` handler function <Trans>`TouchEvent` 핸들러 함수</Trans> {/*touchevent-handler*/}

An event handler type for [touch events.](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
<Trans>[터치 이벤트](https://developer.mozilla.org/ko/docs/Web/API/Touch_events)에 대한 이벤트 핸들러 유형입니다.</Trans>

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### Parameters<Trans>매개변수</Trans> {/*touchevent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) properties:
<Trans outdent>`e`: 추가 [`TouchEvent`](https://developer.mozilla.org/ko/docs/Web/API/TouchEvent) 속성을 가진 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  It also includes the inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties:
  <Trans>상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성도 포함됩니다:</Trans>

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TransitionEvent` handler function <Trans>`TransitionEvent` 핸들러 함수</Trans> {/*transitionevent-handler*/}

An event handler type for the CSS transition events.
<Trans>CSS 트랜지션 이벤트에 대한 이벤트 핸들러 유형입니다.</Trans>

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Parameters<Trans>매개변수</Trans> {/*transitionevent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent) properties:
<Trans outdent>`e`: 추가 [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent) 속성을 가진 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### `UIEvent` handler function <Trans>`UIEvent` 핸들러 함수</Trans> {/*uievent-handler*/}

An event handler type for generic UI events.
<Trans>일반 UI 이벤트를 위한 이벤트 핸들러 유형입니다.</Trans>

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Parameters<Trans>매개변수</Trans> {/*uievent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties:
<Trans outdent>`e`: 추가 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성을 가진 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `WheelEvent` handler function <Trans>`WheelEvent` 핸들러 함수</Trans> {/*wheelevent-handler*/}

An event handler type for the `onWheel` event.
<Trans>`onWheel` 이벤트에 대한 이벤트 핸들러 유형입니다.</Trans>

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Parameters<Trans>매개변수</Trans> {/*wheelevent-handler-parameters*/}

* `e`: A [React event object](#react-event-object) with these extra [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent) properties:
<Trans outdent>`e`: 추가 [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent) 속성을 가진 [React 이벤트 객체](#react-event-object)입니다:</Trans>

  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  It also includes the inherited [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) properties:
  <Trans>상속된 [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) 속성도 포함됩니다:</Trans>

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  It also includes the inherited [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) properties:
  <Trans>상속된 [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) 속성도 포함됩니다:</Trans>

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Applying CSS styles <Trans>CSS 스타일 적용하기</Trans> {/*applying-css-styles*/}

In React, you specify a CSS class with [`className`.](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) It works like the `class` attribute in HTML:
<Trans>React에서는 [`className`](https://developer.mozilla.org/ko/docs/Web/API/Element/className)으로 CSS 클래스를 지정합니다. HTML의 `class` 속성처럼 작동합니다:</Trans>

```js
<img className="avatar" />
```

Then you write the CSS rules for it in a separate CSS file:
<Trans>그런 다음 별도의 CSS 파일에 해당 CSS 규칙을 작성합니다:</Trans>

```css
/* In your CSS */
.avatar {
  border-radius: 50%;
}
```

React does not prescribe how you add CSS files. In the simplest case, you'll add a [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) tag to your HTML. If you use a build tool or a framework, consult its documentation to learn how to add a CSS file to your project.
<Trans>React는 CSS 파일을 추가하는 방법을 규정하지 않습니다. 가장 간단한 경우 HTML에 [`<link>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/link) 태그를 추가하면 됩니다. 빌드 도구나 프레임워크를 사용하는 경우 해당 문서를 참조하여 프로젝트에 CSS 파일을 추가하는 방법을 알아보세요.</Trans>

Sometimes, the style values depend on data. Use the `style` attribute to pass some styles dynamically:
<Trans>때때로 스타일 값은 데이터에 따라 달라집니다. `style` 속성을 사용하여 일부 스타일을 동적으로 전달할 수 있습니다:</Trans>

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


In the above example, `style={{}}` is not a special syntax, but a regular `{}` object inside the `style={ }` [JSX curly braces.](/learn/javascript-in-jsx-with-curly-braces) We recommend only using the `style` attribute when your styles depend on JavaScript variables.
<Trans>위 예시에서 `style={{}}`은 특별한 구문이 아니라 `style={ }` [JSX 중괄호](/learn/javascript-in-jsx-with-curly-braces) 안에 있는 일반 `{}` 객체입니다. 스타일이 자바스크립트 변수에 의존하는 경우에만 `style` 속성을 사용하는 것이 좋습니다.</Trans>

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={'Photo of ' + user.name}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### How to apply multiple CSS classes conditionally? <Trans>여러 CSS 클래스를 조건부로 적용하는 방법은 무엇인가요?</Trans> {/*how-to-apply-multiple-css-classes-conditionally*/}

To apply CSS classes conditionally, you need to produce the `className` string yourself using JavaScript.
<Trans>조건부로 CSS 클래스를 적용하려면 JavaScript를 사용하여 `className` 문자열을 직접 생성해야 합니다.</Trans>

For example, `className={'row ' + (isSelected ? 'selected': '')}` will produce either `className="row"` or `className="row selected"` depending on whether `isSelected` is `true`.
<Trans>예를 들어, `className={'row ' + (isSelected ? 'selected': '')}`는 `isSelected`가 `true`인지 여부에 따라 `className="row"` 또는 `className="row selected"`를 생성합니다.</Trans>

To make this more readable, you can use a tiny helper library like [`classnames`:](https://github.com/JedWatson/classnames)
<Trans>이를 더 읽기 쉽게 만들려면 [`classnames`](https://github.com/JedWatson/classnames)와 같은 작은 헬퍼 라이브러리를 사용할 수 있습니다:</Trans>

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

It is especially convenient if you have multiple conditional classes:
<Trans>조건부 클래스가 여러 개 있는 경우 특히 편리합니다:</Trans>

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### Manipulating a DOM node with a ref <Trans>ref로 DOM 노드 조작하기</Trans> {/*manipulating-a-dom-node-with-a-ref*/}

Sometimes, you'll need to get the browser DOM node associated with a tag in JSX. For example, if you want to focus an `<input>` when a button is clicked, you need to call [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) on the browser `<input>` DOM node.
<Trans>때로는 JSX에서 태그와 연결된 브라우저 DOM 노드를 가져와야 할 수도 있습니다. 예를 들어 버튼이 클릭될 때 `<input>`에 포커스를 맞추려면 브라우저 `<input>` DOM 노드에서 [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)를 호출해야 합니다.</Trans>

To obtain the browser DOM node for a tag, [declare a ref](/reference/react/useRef) and pass it as the `ref` attribute to that tag:
<Trans>태그에 대한 브라우저 DOM 노드를 가져오려면 [ref 선언하기](/reference/react/useRef)를 통해 해당 태그에 `ref` 속성으로 전달합니다:</Trans>

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React will put the DOM node into `inputRef.current` after it's been rendered to the screen.
<Trans>React는 DOM 노드가 화면에 렌더링된 후 `inputRef.current`에 넣습니다.</Trans>

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Read more about [manipulating DOM with refs](/learn/manipulating-the-dom-with-refs) and [check out more examples.](/reference/react/useRef#examples-dom)
<Trans>[ref로 DOM 조작하기](/learn/manipulating-the-dom-with-refs)와 [더 많은 예시](/reference/react/useRef#examples-dom)를 확인해보세요.</Trans>

For more advanced use cases, the `ref` attribute also accepts a [callback function.](#ref-callback)
<Trans>고급 사용 사례의 경우, `ref` 속성은 [콜백 함수](#ref-callback)도 허용합니다.</Trans>

---

### Dangerously setting the inner HTML <Trans>내부 HTML을 위험하게 설정하는 경우</Trans> {/*dangerously-setting-the-inner-html*/}

You can pass a raw HTML string to an element like so:
<Trans>다음과 같이 원본 HTML 문자열을 요소에 전달할 수 있습니다:</Trans>

```js
const markup = { __html: '<p>some raw html</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**This is dangerous. As with the underlying DOM [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) property, you must exercise extreme caution! Unless the markup is coming from a completely trusted source, it is trivial to introduce an [XSS](https://en.wikipedia.org/wiki/Cross-site_scripting) vulnerability this way.**
<Trans>**이렇게 작성하는 것은 위험합니다. 기본 DOM [`innerHTML`](https://developer.mozilla.org/ko/docs/Web/API/Element/innerHTML) 속성과 마찬가지로 극도의 주의를 기울여야 합니다! 마크업이 완전히 신뢰할 수 있는 출처에서 제공되지 않는 한, 이런 식으로 [XSS](https://ko.wikipedia.org/wiki/Cross-site_scripting) 취약점을 도입하는 것은 위험한 일입니다.**</Trans>

For example, if you use a Markdown library that converts Markdown to HTML, you trust that its parser doesn't contain bugs, and the user only sees their own input, you can display the resulting HTML like this:
<Trans>예를 들어, 마크다운을 HTML로 변환하는 마크다운 라이브러리를 사용하는 경우 해당 파서에 버그가 없고 사용자가 자신의 입력만 볼 수 있다고 믿는다면 다음과 같이 결과 HTML을 표시할 수 있습니다:</Trans>

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

```js MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // This is ONLY safe because the output HTML
  // is shown to the same user, and because you
  // trust this Markdown parser to not have bugs.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
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

To see why rendering arbitrary HTML is dangerous, replace the code above with this:
<Trans>임의의 HTML을 렌더링하는 것이 왜 위험한지 알아보려면 위의 코드를 다음과 같이 바꾸세요:</Trans>

```js {1-5,8-10}
const post = {
  // Imagine this content is stored in the database.
  // 이 콘텐츠가 데이터베이스에 저장되어 있다고 가정해 보겠습니다.
  content: `<img src="" onerror='alert("you were hacked")'>`
};

export default function MarkdownPreview() {
  // 🔴 SECURITY HOLE: passing untrusted input to dangerouslySetInnerHTML
  // 🔴 보안 허점: 신뢰할 수 없는 input을 위험하게 dangerouslySetInnerHTML로 전달합니다.
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

The code embedded in the HTML will run. A hacker could use this security hole to steal user information or to perform actions on their behalf. **Only use `dangerouslySetInnerHTML` with trusted and sanitized data.**
<Trans>HTML에 포함된 코드가 실행됩니다. 해커는 이 보안 허점을 이용해 사용자 정보를 훔치거나 사용자 대신 작업을 수행할 수 있습니다. **신뢰할 수 있는 위생 처리된 데이터에 대해서만 `dangerouslySetInnerHTML`를 사용하세요.**</Trans>

---

### Handling mouse events <Trans>마우스 이벤트 처리하기</Trans> {/*handling-mouse-events*/}

This example shows some common [mouse events](#mouseevent-handler) and when they fire.
<Trans>이 예시는 몇 가지 일반적인 [마우스 이벤트](#mouseevent-handler)와 이벤트 발생 시점을 보여줍니다.</Trans>

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (parent)')}
      onMouseLeave={e => console.log('onMouseLeave (parent)')}
    >
      <button
        onClick={e => console.log('onClick (first button)')}
        onMouseDown={e => console.log('onMouseDown (first button)')}
        onMouseEnter={e => console.log('onMouseEnter (first button)')}
        onMouseLeave={e => console.log('onMouseLeave (first button)')}
        onMouseOver={e => console.log('onMouseOver (first button)')}
        onMouseUp={e => console.log('onMouseUp (first button)')}
      >
        First button
      </button>
      <button
        onClick={e => console.log('onClick (second button)')}
        onMouseDown={e => console.log('onMouseDown (second button)')}
        onMouseEnter={e => console.log('onMouseEnter (second button)')}
        onMouseLeave={e => console.log('onMouseLeave (second button)')}
        onMouseOver={e => console.log('onMouseOver (second button)')}
        onMouseUp={e => console.log('onMouseUp (second button)')}
      >
        Second button
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Handling pointer events <Trans>포인터 이벤트 처리하기</Trans> {/*handling-pointer-events*/}

This example shows some common [pointer events](#pointerevent-handler) and when they fire.
<Trans>이 예시는 몇 가지 일반적인 [포인터 이벤트](#pointerevent-handler)와 이벤트 발생 시점을 보여줍니다.</Trans>

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (parent)')}
      onPointerLeave={e => console.log('onPointerLeave (parent)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (first child)')}
        onPointerEnter={e => console.log('onPointerEnter (first child)')}
        onPointerLeave={e => console.log('onPointerLeave (first child)')}
        onPointerMove={e => console.log('onPointerMove (first child)')}
        onPointerUp={e => console.log('onPointerUp (first child)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        First child
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (second child)')}
        onPointerEnter={e => console.log('onPointerEnter (second child)')}
        onPointerLeave={e => console.log('onPointerLeave (second child)')}
        onPointerMove={e => console.log('onPointerMove (second child)')}
        onPointerUp={e => console.log('onPointerUp (second child)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        Second child
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Handling focus events <Trans>포커스 이벤트 처리하기</Trans> {/*handling-focus-events*/}

In React, [focus events](#focusevent-handler) bubble. You can use the `currentTarget` and `relatedTarget` to differentiate if the focusing or blurring events originated from outside of the parent element. The example shows how to detect focusing a child, focusing the parent element, and how to detect focus entering or leaving the whole subtree.
<Trans>React에는 [포커스 이벤트](#focusevent-handler) 버블이 있습니다. `currentTarget` 와 `relatedTarget`을 사용하여 포커싱 또는 블러링 이벤트가 부모 엘리먼트 외부에서 발생했는지 구분할 수 있습니다. 이 예는 자식 요소 포커싱, 부모 요소 포커싱, 전체 하위 트리에 들어오고 나가는 포커스를 감지하는 방법을 보여줍니다.</Trans>

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused parent');
        } else {
          console.log('focused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          // 자식 간에 포커스를 바꿀 때는 트리거되지 않습니다.
          console.log('focus entered parent');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused parent');
        } else {
          console.log('unfocused child', e.target.name);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          // 자식 간에 포커스를 바꿀 때는 트리거되지 않습니다.
          console.log('focus left parent');
        }
      }}
    >
      <label>
        First name:
        <input name="firstName" />
      </label>
      <label>
        Last name:
        <input name="lastName" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Handling keyboard events <Trans>키보드 이벤트 처리하기</Trans> {/*handling-keyboard-events*/}

This example shows some common [keyboard events](#keyboardevent-handler) and when they fire.
<Trans>이 예는 몇 가지 일반적인 [키보드 이벤트](#keyboardevent-handler)와 이벤트 발생 시점을 보여줍니다.</Trans>

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      First name:
      <input
        name="firstName"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
