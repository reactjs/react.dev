---
title: Writing Markup with JSX
translatedTitle: JSX로 마크업 작성하기
---

<Intro>

*JSX* is a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file. Although there are other ways to write components, most React developers prefer the conciseness of JSX, and most codebases use it.
<Trans>*JSX*는 JavaScript를 확장한 문법으로, JavaScript 파일 안에 HTML과 유사한 마크업을 작성할 수 있도록 해줍니다. 컴포넌트를 작성하는 다른 방법도 있지만, 대부분의 React개발자는 JSX의 간결함을 선호하며 대부분의 코드베이스에서 JSX를 사용합니다.</Trans>

</Intro>

<YouWillLearn>

* Why React mixes markup with rendering logic
* How JSX is different from HTML
* How to display information with JSX

<TransBlock>
- React가 마크업과 렌더링 로직을 같이 사용하는 이유
- JSX와 HTML의 차이점
- JSX로 정보를 보여주는 방법
</TransBlock>

</YouWillLearn>

## JSX: Putting markup into JavaScript<Trans>JSX: JavaScript에 마크업 넣기</Trans> {/*jsx-putting-markup-into-javascript*/}

The Web has been built on HTML, CSS, and JavaScript. For many years, web developers kept content in HTML, design in CSS, and logic in JavaScript—often in separate files! Content was marked up inside HTML while the page's logic lived separately in JavaScript:
<Trans>웹은 HTML, CSS, JavaScript를 기반으로 만들어져왔습니다. 수년 동안 웹 개발자들은 HTML로 컨텐츠를, CSS로 디자인을, 로직은 JavaScript로 작성해왔습니다. 보통은 각각 분리된 파일로 관리를 합니다! 페이지의 로직이 JavaScript안에서 분리되어 동작하는 동안, HTML 안에서는 컨텐츠가 마크업 되었습니다.</Trans>

<DiagramGroup>

<Diagram name="writing_jsx_html" height={237} width={325} alt="HTML markup with purple background and a div with two child tags: p and form. ">

HTML

</Diagram>

<Diagram name="writing_jsx_js" height={237} width={325} alt="Three JavaScript handlers with yellow background: onSubmit, onLogin, and onClick.">

JavaScript

</Diagram>

</DiagramGroup>

But as the Web became more interactive, logic increasingly determined content. JavaScript was in charge of the HTML! This is why **in React, rendering logic and markup live together in the same place—components.**
<Trans>하지만 웹이 더욱 인터랙티브해지면서 로직이 컨텐츠를 결정하는 경우가 많아졌습니다. 그래서 JavaScript가 HTML을 담당하게 되었죠! **이것이 바로 React에서 렌더링 로직과 마크업이 같은 위치의 컴포넌트에 함께 있는 이유입니다.**</Trans>

<DiagramGroup>

<Diagram name="writing_jsx_sidebar" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Sidebar which calls the function isLoggedIn, highlighted in yellow. Nested inside the function highlighted in purple is the p tag from before, and a Form tag referencing the component shown in the next diagram.">

`Sidebar.js` React component

</Diagram>

<Diagram name="writing_jsx_form" height={330} width={325} alt="React component with HTML and JavaScript from previous examples mixed. Function name is Form containing two handlers onClick and onSubmit highlighted in yellow. Following the handlers is HTML highlighted in purple. The HTML contains a form element with a nested input element, each with an onClick prop.">

`Form.js` React component

</Diagram>

</DiagramGroup>

Keeping a button's rendering logic and markup together ensures that they stay in sync with each other on every edit. Conversely, details that are unrelated, such as the button's markup and a sidebar's markup, are isolated from each other, making it safer to change either of them on their own.
<Trans>버튼의 렌더링 로직과 마크업이 함께 존재한다면 모든 편집에서 서로 동기화 상태를 유지할 수 있습니다. 반대로 버튼의 마크업과 사이드바의 마크업처럼 서로 관련이 없는 항목들은 서로 분리되어 있으므로 각각 개별적으로 변경하는 것이 더 안전합니다.</Trans>

Each React component is a JavaScript function that may contain some markup that React renders into the browser. React components use a syntax extension called JSX to represent that markup. JSX looks a lot like HTML, but it is a bit stricter and can display dynamic information. The best way to understand this is to convert some HTML markup to JSX markup.
<Trans>각 React 컴포넌트는 React가 브라우저에 마크업을 렌더링할 수 있는 JavaScript 함수입니다. React 컴포넌트는 JSX라는 구문 확장자를 사용하여 해당되는 마크업을 표현합니다. JSX는 HTML과 비슷해보이지만 조금 더 엄격하며 동적으로 정보를 표시할 수 있습니다. JSX를 이해하는 가장 좋은 방법은 일부의 HTML마크업을 JSX마크업으로 변환해보는 것입니다.</Trans>

<Note>

JSX and React are two separate things. They're often used together, but you *can* [use them independently](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) of each other. JSX is a syntax extension, while React is a JavaScript library.
<Trans>JSX와 React는 서로 다른 별개의 개념입니다. 종종 함께 사용되기도 하지만 [독립적으로](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) 사용할 수도 있습니다. JSX는 구문 확장이고, React는 자바스크립트 라이브러리입니다.</Trans>

</Note>

## Converting HTML to JSX<Trans>HTML을 JSX로 변환하기</Trans> {/*converting-html-to-jsx*/}

Suppose that you have some (perfectly valid) HTML:
<Trans>다음과 같은 (완벽하게 유효한) HTML이 있다고 가정해봅시다:</Trans>

```html
<h1>Hedy Lamarr's Todos</h1>
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  class="photo"
>
<ul>
    <li>Invent new traffic lights
    <li>Rehearse a movie scene
    <li>Improve the spectrum technology
</ul>
```

And you want to put it into your component:
<Trans>이제 이것을 컴포넌트로 만들어볼 것입니다:</Trans>

```js
export default function TodoList() {
  return (
    // ???
  )
}
```

If you copy and paste it as is, it will not work:
<Trans>이 코드를 그대로 복사하여 붙여넣는다면 동작하지 않을 것입니다:</Trans>

<Sandpack>

```js
export default function TodoList() {
  return (
    // This doesn't quite work!
    <h1>Hedy Lamarr's Todos</h1>
    <img 
      src="https://i.imgur.com/yXOvdOSs.jpg" 
      alt="Hedy Lamarr" 
      class="photo"
    >
    <ul>
      <li>Invent new traffic lights
      <li>Rehearse a movie scene
      <li>Improve the spectrum technology
    </ul>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

This is because JSX is stricter and has a few more rules than HTML! If you read the error messages above, they'll guide you to fix the markup, or you can follow the guide below.
<Trans>왜냐하면 JSX는 HTML보다 더 엄격하며 몇 가지 규칙이 더 있기 때문입니다! 위의 오류메세지를 읽으면 마크업을 수정하도록 안내하거나 아래의 가이드를 따를 수 있습니다.</Trans>

<Note>

Most of the times, React's on-screen error messages will help you find where the problem is. Give them a read if you get stuck!
<Trans>대부분의 경우 React의 화면 오류 메세지는 문제가 있는 곳을 찾는 데 도움이 됩니다. 막혔을 때 읽어주세요!</Trans>

</Note>

## The Rules of JSX<Trans>JSX 규칙</Trans> {/*the-rules-of-jsx*/}

### 1. Return a single root element<Trans>단일 루트 엘리먼트를 반환하세요</Trans> {/*1-return-a-single-root-element*/}

To return multiple elements from a component, **wrap them with a single parent tag.**
<Trans>컴포넌트에서 여러 엘리먼트를 반환하려면, **하나의 부모 태그로 감싸주세요.**</Trans>

For example, you can use a `<div>`:
<Trans>예를 들면 `<div>`를 사용할 수 있습니다:</Trans>

```js {1,11}
<div>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</div>
```


If you don't want to add an extra `<div>` to your markup, you can write `<>` and `</>` instead:
<Trans>마크업에 `<div>`를 추가하고 싶지 않다면 `<>`와 `</>`를 사용하면 됩니다:</Trans>

```js {1,11}
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```

This empty tag is called a [*Fragment*](/reference/react/Fragment). Fragments let you group things without leaving any trace in the browser HTML tree.
<Trans>이런 빈 태그를 [*Fragment*](/reference/react/Fragment)라고 합니다. Fragment는 브라우저상의 HTML 트리 구조에서 흔적을 남기지 않고 그룹화해줍니다.</Trans>

<DeepDive>

#### Why do multiple JSX tags need to be wrapped?<Trans>왜 여러 JSX태그를 하나로 감싸줘야 할까요?</Trans> {/*why-do-multiple-jsx-tags-need-to-be-wrapped*/}

JSX looks like HTML, but under the hood it is transformed into plain JavaScript objects. You can't return two objects from a function without wrapping them into an array. This explains why you also can't return two JSX tags without wrapping them into another tag or a Fragment.
<Trans>JSX는 HTML처럼 보이지만 내부적으로는 JavaScript 객체로 변환됩니다. 하나의 배열로 감싸지 않은 하나의 함수에서는 두 개의 객체를 반환할 수 없습니다. 따라서 또 다른 태그나 Fragment로 감싸지 않으면 두 개의 JSX태그를 반환할 수 없습니다.</Trans>

</DeepDive>

### 2. Close all the tags<Trans>모든 태그를 닫으세요</Trans> {/*2-close-all-the-tags*/}

JSX requires tags to be explicitly closed: self-closing tags like `<img>` must become `<img />`, and wrapping tags like `<li>oranges` must be written as `<li>oranges</li>`.
<Trans>JSX에서는 태그를 명시적으로 닫아야 합니다. `<img>`태그처럼 자체적으로 닫는 태그도 반드시 `<img />`로 작성해야하며, `<li>`oranges와 같은 래핑 태그 역시 `<li>oranges</li>`형태로 작성해야 합니다.</Trans>

This is how Hedy Lamarr's image and list items look closed:
<Trans>다음과 같이 Hedy Lamarr의 이미지와 리스트의 항목들을 닫아줍니다:</Trans>

```js {2-6,8-10}
<>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
   />
  <ul>
    <li>Invent new traffic lights</li>
    <li>Rehearse a movie scene</li>
    <li>Improve the spectrum technology</li>
  </ul>
</>
```

### 3. camelCase <s>all</s> most of the things!<Trans><s>거의</s> 대부분이 캐멀 케이스입니다!</Trans> {/*3-camelcase-salls-most-of-the-things*/}

JSX turns into JavaScript and attributes written in JSX become keys of JavaScript objects. In your own components, you will often want to read those attributes into variables. But JavaScript has limitations on variable names. For example, their names can't contain dashes or be reserved words like `class`.
<Trans>JSX는 JavaScript로 바뀌고 JSX로 작성된 어트리뷰트는 JavaScript 객체의 키가 됩니다. 종종 컴포넌트 안에서 어트리뷰트를 변수로 읽고 싶은 경우가 있을 것입니다. 하지만 JavaScript에는 변수명에 제한이 있습니다. 예를 들어 변수명에는 대시를 포함하거나 `class`처럼 예약어를 사용할 수 없습니다.</Trans>

This is why, in React, many HTML and SVG attributes are written in camelCase. For example, instead of `stroke-width` you use `strokeWidth`. Since `class` is a reserved word, in React you write `className` instead, named after the [corresponding DOM property](https://developer.mozilla.org/en-US/docs/Web/API/Element/className):
<Trans>이것이 React에서 많은 HTML과 SVG 어트리뷰트가 캐멀 케이스로 작성되는 이유입니다. 예를 들어 `stroke-width` 대신 `strokeWidth`을 사용합니다. `class`는 예약어이므로, React에서는 대신 해당 [DOM 속성](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)의 이름을 따서 `className`을 씁니다:</Trans>

```js {4}
<img 
  src="https://i.imgur.com/yXOvdOSs.jpg" 
  alt="Hedy Lamarr" 
  className="photo"
/>
```

You can [find all these attributes in the list of DOM component props.](/reference/react-dom/components/common) If you get one wrong, don't worry—React will print a message with a possible correction to the [browser console.](https://developer.mozilla.org/docs/Tools/Browser_Console)
<Trans>이런 [모든 어트리뷰트는 React DOM엘리먼트에서](/reference/react-dom/components/common) 찾을 수 있습니다. 틀려도 걱정하지 마세요. React는 [브라우저 콘솔](https://developer.mozilla.org/docs/Tools/Browser_Console)에서 수정 가능한 부분을 메세지로 알려줍니다.</Trans>

<Pitfall>

For historical reasons, [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) and [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes) attributes are written as in HTML with dashes.
<Trans>역사적인 이유로 [`aria-*`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA) 과 [`data-*`](https://developer.mozilla.org/docs/Learn/HTML/Howto/Use_data_attributes)의 어트리뷰트는 HTML에서와 동일하게 대시를 사용하여 작성합니다.</Trans>

<Extra>
#### 역사적인 이유? -@정재남 {/*역사적인-이유--정재남*/}

https://stackoverflow.com/a/52489695

Speculation: Perhaps this has something to do with a change which took place between React versions 15 and 16. The blog post ["DOM Attributes in React 16"](https://reactjs.org/blog/2017/09/08/dom-attributes-in-react-16.html) explains that custom attributes are now allowed in React 16, which were previously stripped out. It describes some concerns that an internal whitelist of attributes had become a maintenance burden, which needed to be simplified. Now arbitrary attributes can be included in JSX. I don't know how this works internally, but I suppose the `aria-*` attributes play some part in the story of the internal whitelist. For instance, WAI-ARIA 1.1 recently introduced several new `aria-*` attributes, and the WAI [Personalization Semantics Content Module](https://www.w3.org/TR/personalization-semantics-content-1.0/) working draft introduces a lot of `aui-*` attributes. Both of these would have needed to be whitelisted.
<Trans>추측: 아마도 이것은 React 버전 15와 16 사이에 일어난 변경과 관련이 있을 것입니다. 블로그 포스트 ["React 16의 DOM 어트리뷰트"](https://reactjs.org/blog/2017/09/08/dom-attributes-in-react-16.html) 에서는 이전에는 제거되었던 사용자 정의 어트리뷰트가 이제 React 16에서 허용된다고 설명합니다. 이 글에서는 어트리뷰트의 내부 화이트리스트가 유지보수 부담이 되어 단순화할 필요가 있다는 우려를 표합니다. 이제 임의의 어트리뷰트를 JSX에 포함할 수 있습니다. 내부적으로 어떻게 작동하는지는 모르겠지만, 내부 화이트리스트의 이야기에서 `aria-*` 속성이 어느 정도 역할을 하는 것으로 생각됩니다. 예를 들어, WAI-ARIA 1.1은 최근 몇 가지 새로운 `aria-*` 어트리뷰트를 도입했고, WAI [개인화 시맨틱 콘텐츠 모듈](https://www.w3.org/TR/personalization-semantics-content-1.0/) 작업 초안에는 `aui-*` 어트리뷰트가 많이 도입되었습니다. 이 두 가지 모두 화이트리스트에 추가해야 했습니다.</Trans>

</Extra>

</Pitfall>

### Pro-tip: Use a JSX Converter<Trans>전문가 팁: JSX 변환기 사용</Trans> {/*pro-tip-use-a-jsx-converter*/}

Converting all these attributes in existing markup can be tedious! We recommend using a [converter](https://transform.tools/html-to-jsx) to translate your existing HTML and SVG to JSX. Converters are very useful in practice, but it's still worth understanding what is going on so that you can comfortably write JSX on your own.
<Trans>
기존 마크업에서 모든 어트리뷰트를 변환하는 것은 지루할 수 있습니다.  [변환기](https://transform.tools/html-to-jsx)를 사용하여 기존 HTML과 SVG를 JSX로 변환하는 것을 추천합니다. 변환기는 매우 유용하지만 그래도 JSX를 편안하게 작성할 수 있도록 어트리뷰트를 어떻게 쓰는지 이해하는 것도 중요합니다.
</Trans>

Here is your final result:
<Trans>최종 결과는 다음과 같습니다:</Trans>

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr's Todos</h1>
      <img 
        src="https://i.imgur.com/yXOvdOSs.jpg" 
        alt="Hedy Lamarr" 
        className="photo" 
      />
      <ul>
        <li>Invent new traffic lights</li>
        <li>Rehearse a movie scene</li>
        <li>Improve the spectrum technology</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px }
```

</Sandpack>

<Recap>
Now you know why JSX exists and how to use it in components:

* React components group rendering logic together with markup because they are related.
* JSX is similar to HTML, with a few differences. You can use a [converter](https://transform.tools/html-to-jsx) if you need to.
* Error messages will often point you in the right direction to fixing your markup.

<TransBlock>
지금까지 JSX가 존재하는 이유와 컴포넌트에서 JSX를 쓰는 방법에 대해 알아보았습니다.
* React 컴포넌트는 서로 관련이 있는 마크업과 렌더링 로직을 함께 그룹화합니다.
* JSX는 HTML과 비슷하지만 몇 가지 차이점이 있습니다. 필요한 경우 [변환기](https://transform.tools/html-to-jsx)를 사용할 수 있습니다.
* 오류 메세지는 종종 마크업을 수정할 수 있도록 올바른 방향을 알려줍니다.

</TransBlock>

</Recap>



<Challenges>

#### Convert some HTML to JSX<Trans>HTML을 JSX로 변환해 보세요.</Trans> {/*convert-some-html-to-jsx*/}

This HTML was pasted into a component, but it's not valid JSX. Fix it:
<Trans>컴포넌트에 HTML을 붙여넣었지만 올바른 JSX가 아닙니다. 수정해보세요:</Trans>

<Sandpack>

```js
export default function Bio() {
  return (
    <div class="intro">
      <h1>Welcome to my website!</h1>
    </div>
    <p class="summary">
      You can find my thoughts here.
      <br><br>
      <b>And <i>pictures</b></i> of scientists!
    </p>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

Whether to do it by hand or using the converter is up to you!
<Trans>직접 수정할지 변환기를 사용할지는 여러분에게 달려있습니다!</Trans>

<Solution>

<Sandpack>

```js
export default function Bio() {
  return (
    <div>
      <div className="intro">
        <h1>Welcome to my website!</h1>
      </div>
      <p className="summary">
        You can find my thoughts here.
        <br /><br />
        <b>And <i>pictures</i></b> of scientists!
      </p>
    </div>
  );
}
```

```css
.intro {
  background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.summary {
  padding: 20px;
  border: 10px solid gold;
}
```

</Sandpack>

</Solution>

</Challenges>
