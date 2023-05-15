---
title: "React DOM Components"
translators: [고석영, 정재남]
---

<Intro>

React supports all of the browser built-in [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) and [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Element) components.
<Trans>React는 모든 브라우저 빌트인 [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element) 및 [SVG](https://developer.mozilla.org/en-US/docs/Web/SVG/Element) 컴포넌트를 지원합니다.</Trans>


</Intro>

---

## Common components<Trans>기본 컴포넌트들</Trans> {/*common-components*/}

All of the built-in browser components support some props and events.
<Trans>모든 브라우저 빌트인 컴포넌트는 일부 props 및 이벤트를 지원합니다.</Trans>

* [Common components (e.g. `<div>`)](/reference/react-dom/components/common)

This includes React-specific props like `ref` and `dangerouslySetInnerHTML`.
<Trans>여기에는 `ref` 및 `dangerouslySetInnerHTML`과 같은 React 전용 props도 포함됩니다.</Trans>

---

## Form components<Trans>폼 컴포넌트들</Trans> {/*form-components*/}

These built-in browser components accept user input:
<Trans>다음 브라우저 빌트인 컴포넌트들은 사용자 입력을 허용합니다:</Trans>

* [`<input>`](/reference/react-dom/components/input)
* [`<select>`](/reference/react-dom/components/select)
* [`<textarea>`](/reference/react-dom/components/textarea)

They are special in React because passing the `value` prop to them makes them [*controlled.*](/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)
<Trans>이들은 `value` prop을 전달하면 [*제어 컴포넌트*](/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)가 된다는 점에서 특별합니다.</Trans>

---

## All HTML components<Trans>다른 모든 HTML 컴포넌트들</Trans> {/*all-html-components*/}

React supports all built-in browser HTML components. This includes:
<Trans>리액트는 모든 브라우저 빌트인 HTML 컴포넌트를 지원합니다. 여기에는 다음이 포함됩니다:</Trans>

* [`<aside>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside)
* [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)
* [`<b>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/b)
* [`<base>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/base)
* [`<bdi>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi)
* [`<bdo>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdo)
* [`<blockquote>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote)
* [`<body>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/body)
* [`<br>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br)
* [`<button>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
* [`<canvas>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas)
* [`<caption>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/caption)
* [`<cite>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/cite)
* [`<code>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code)
* [`<col>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/col)
* [`<colgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/colgroup)
* [`<data>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/data)
* [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist)
* [`<dd>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd)
* [`<del>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/del)
* [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
* [`<dfn>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dfn)
* [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
* [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)
* [`<dl>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl)
* [`<dt>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt)
* [`<em>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/em)
* [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed)
* [`<fieldset>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/fieldset)
* [`<figcaption>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption)
* [`<figure>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure)
* [`<footer>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/footer)
* [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
* [`<h1>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h1)
* [`<head>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head)
* [`<header>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/header)
* [`<hgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hgroup)
* [`<hr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr)
* [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html)
* [`<i>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/i)
* [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe)
* [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
* [`<input>`](/reference/react-dom/components/input)
* [`<ins>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ins)
* [`<kbd>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd)
* [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label)
* [`<legend>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/legend)
* [`<li>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/li)
* [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link)
* [`<main>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main)
* [`<map>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/map)
* [`<mark>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark)
* [`<menu>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu)
* [`<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta)
* [`<meter>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter)
* [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav)
* [`<noscript>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/noscript)
* [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object)
* [`<ol>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
* [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup)
* [`<option>`](/reference/react-dom/components/option)
* [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output)
* [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p)
* [`<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture)
* [`<pre>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre)
* [`<progress>`](/reference/react-dom/components/progress)
* [`<q>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/q)
* [`<rp>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rp)
* [`<rt>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/rt)
* [`<ruby>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ruby)
* [`<s>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/s)
* [`<samp>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/samp)
* [`<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script)
* [`<section>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section)
* [`<select>`](/reference/react-dom/components/select)
* [`<slot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot)
* [`<small>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/small)
* [`<source>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source)
* [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span)
* [`<strong>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/strong)
* [`<style>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style)
* [`<sub>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sub)
* [`<summary>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary)
* [`<sup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/sup)
* [`<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table)
* [`<tbody>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody)
* [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td)
* [`<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
* [`<textarea>`](/reference/react-dom/components/textarea)
* [`<tfoot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tfoot)
* [`<th>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th)
* [`<thead>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead)
* [`<time>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time)
* [`<title>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title)
* [`<tr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr)
* [`<track>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/track)
* [`<u>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/u)
* [`<ul>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul)
* [`<var>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/var)
* [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
* [`<wbr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr)

<Note>

Similar to the [DOM standard,](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) React uses a `camelCase` convention for prop names. For example, you'll write `tabIndex` instead of `tabindex`. You can convert existing HTML to JSX with an [online converter.](https://transform.tools/html-to-jsx)
<Trans>[DOM 표준](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)과 유사하게 React는 prop의 이름에 `camelCase` 규칙을 사용합니다. 예를 들어 `tabindex` 대신 `tabIndex`를 작성합니다. [온라인 변환기](https://transform.tools/html-to-jsx)를 사용하여 기존 HTML을 JSX로 변환할 수 있습니다.</Trans>

</Note>

---

### Custom HTML elements<Trans>사용자정의 HTML 엘리먼트</Trans> {/*custom-html-elements*/}

If you render a tag with a dash, like `<my-element>`, React will assume you want to render a [custom HTML element.](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) In React, rendering custom elements works differently from rendering built-in browser tags:
<Trans>`<my-element>` 처럼 대시(-)가 있는 태그를 렌더링하면 React는 [사용자정의 HTML 엘리먼트](https://developer.mozilla.org/ko/docs/Web/API/Web_components/Using_custom_elements)를 렌더링한다고 가정합니다. React에서 사용자정의 엘리먼트를 렌더링하는 것은 빌트인 브라우저 태그를 렌더링하는 것과는 다르게 작동합니다:</Trans>

- All custom element props are serialized to strings and are always set using attributes.
- Custom elements accept `class` rather than `className`, and `for` rather than `htmlFor`.
<TransBlock>
- 모든 사용자정의 엘리먼트의 props는 문자열로 직렬화되며, 항상 속성(attribute)을 통해 설정할 수 있습니다.
- 사용자정의 엘리먼트는 `className` 대신 `class`를, `htmlFor` 대신 `for`를 받습니다.
</TransBlock>

If you render a built-in browser HTML element with an [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is) attribute, it will also be treated as a custom element.
<Trans>브라우저 빌트인 HTML 엘리먼트를 [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is) 속성을 사용하여 렌더링하는 경우에도 커스텀 요소로 취급됩니다.</Trans>

<Note>

[A future version of React will include more comprehensive support for custom elements.](https://github.com/facebook/react/issues/11347#issuecomment-1122275286)
<Trans>[향후 React 버전에는 커스텀 요소에 대한 보다 포괄적인 지원이 포함될 예정입니다.](https://github.com/facebook/react/issues/11347#issuecomment-1122275286)</Trans>

You can try it by upgrading React packages to the most recent experimental version:
<Trans>React 패키지를 최신 실험 버전으로 업그레이드하여 사용해 볼 수 있습니다:</Trans>

- `react@experimental`
- `react-dom@experimental`

Experimental versions of React may contain bugs. Don't use them in production.
<Trans>실험 버전의 React에는 버그가 있을 수 있습니다. 상용 환경에서는 사용하지 마세요.</Trans>

</Note>
---

## All SVG components<Trans>모든 SVG 컴포넌트들</Trans> {/*all-svg-components*/}

React supports all built-in browser SVG components. This includes:
<Trans>React는 모든 브라우저 빌트인 SVG 컴포넌트를 지원합니다. 여기에는 다음이 포함됩니다:</Trans>

* [`<a>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/a)
* [`<animate>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animate)
* [`<animateMotion>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateMotion)
* [`<animateTransform>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateTransform)
* [`<circle>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/circle)
* [`<clipPath>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/clipPath)
* [`<defs>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs)
* [`<desc>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/desc)
* [`<discard>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/discard)
* [`<ellipse>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/ellipse)
* [`<feBlend>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feBlend)
* [`<feColorMatrix>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix)
* [`<feComponentTransfer>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feComponentTransfer)
* [`<feComposite>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feComposite)
* [`<feConvolveMatrix>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feConvolveMatrix)
* [`<feDiffuseLighting>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDiffuseLighting)
* [`<feDisplacementMap>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDisplacementMap)
* [`<feDistantLight>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDistantLight)
* [`<feDropShadow>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feDropShadow)
* [`<feFlood>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFlood)
* [`<feFuncA>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncA)
* [`<feFuncB>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncB)
* [`<feFuncG>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncG)
* [`<feFuncR>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feFuncR)
* [`<feGaussianBlur>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feGaussianBlur)
* [`<feImage>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feImage)
* [`<feMerge>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMerge)
* [`<feMergeNode>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMergeNode)
* [`<feMorphology>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feMorphology)
* [`<feOffset>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feOffset)
* [`<fePointLight>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/fePointLight)
* [`<feSpecularLighting>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feSpecularLighting)
* [`<feSpotLight>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feSpotLight)
* [`<feTile>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTile)
* [`<feTurbulence>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feTurbulence)
* [`<filter>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter)
* [`<foreignObject>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject)
* [`<g>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g)
* `<hatch>`
* `<hatchpath>`
* [`<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/image)
* [`<line>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/line)
* [`<linearGradient>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/linearGradient)
* [`<marker>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker)
* [`<mask>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/mask)
* [`<metadata>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/metadata)
* [`<mpath>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/mpath)
* [`<path>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/path)
* [`<pattern>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/pattern)
* [`<polygon>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polygon)
* [`<polyline>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/polyline)
* [`<radialGradient>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/radialGradient)
* [`<rect>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/rect)
* [`<script>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/script)
* [`<set>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/set)
* [`<stop>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/stop)
* [`<style>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/style)
* [`<svg>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg)
* [`<switch>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/switch)
* [`<symbol>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/symbol)
* [`<text>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/text)
* [`<textPath>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/textPath)
* [`<title>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title)
* [`<tspan>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/tspan)
* [`<use>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use)
* [`<view>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/view)

<Note>

Similar to the [DOM standard,](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) React uses a `camelCase` convention for prop names. For example, you'll write `tabIndex` instead of `tabindex`. You can convert existing SVG to JSX with an [online converter.](https://transform.tools/)
<Trans>[DOM 표준](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)과 유사하게, React는 prop 이름에 `camelCase` 규칙을 사용합니다. 예를 들어 `tabindex` 대신 `tabIndex`를 작성합니다. [온라인 변환기](https://transform.tools/)를 사용하여 기존 SVG를 JSX로 변환할 수 있습니다.</Trans>

Namespaced attributes also have to be written without the colon:
<Trans>네임스페이스 속성은 콜론(:) 없이 작성해야 합니다:</Trans>

* `xlink:actuate` becomes `xlinkActuate`.
<Trans>`xlink:actuate`는 `xlinkActuate`가 됩니다.</Trans>
* `xlink:arcrole` becomes `xlinkArcrole`.
<Trans>`xlink:arcrole`는 `xlinkArcrole`가 됩니다.</Trans>
* `xlink:href` becomes `xlinkHref`.
<Trans>`xlink:href`는 `xlinkHref`가 됩니다.</Trans>
* `xlink:role` becomes `xlinkRole`.
<Trans>`xlink:role`는 `xlinkRole`가 됩니다.</Trans>
* `xlink:show` becomes `xlinkShow`.
<Trans>`xlink:show`는 `xlinkShow`가 됩니다.</Trans>
* `xlink:title` becomes `xlinkTitle`.
<Trans>`xlink:title`는 `xlinkTitle`가 됩니다.</Trans>
* `xlink:type` becomes `xlinkType`.
<Trans>`xlink:type`는 `xlinkType`가 됩니다.</Trans>
* `xml:base` becomes `xmlBase`.
<Trans>`xml:base`는 `xmlBase`가 됩니다.</Trans>
* `xml:lang` becomes `xmlLang`.
<Trans>`xml:lang`는 `xmlLang`가 됩니다.</Trans>
* `xml:space` becomes `xmlSpace`.
<Trans>`xml:space`는 `xmlSpace`가 됩니다.</Trans>
* `xmlns:xlink` becomes `xmlnsXlink`.
<Trans>`xmlns:xlink`는 `xmlnsXlink`가 됩니다.</Trans>

</Note>
