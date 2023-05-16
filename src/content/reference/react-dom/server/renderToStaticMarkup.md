---
title: renderToStaticMarkup
translators: [조성민, 이승효]
---

<Intro>

`renderToStaticMarkup` renders a non-interactive React tree to an HTML string.
<Trans>서버에서 `renderToStaticMarkup`을 호출하면 비대화형 React 트리를 HTML 문자열로 렌더링합니다.</Trans>

```js
const html = renderToStaticMarkup(reactNode)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `renderToStaticMarkup(reactNode)` {/*rendertostaticmarkup*/}

On the server, call `renderToStaticMarkup` to render your app to HTML.
<Trans>서버에서 `renderToStaticMarkup`을 호출하여 앱을 HTML로 렌더링합니다.</Trans>

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

It will produce non-interactive HTML output of your React components.
<Trans>이는 React 컴포넌트에 대한 비대화형 HTML 출력물을 생성합니다.</Trans>

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `reactNode`: A React node you want to render to HTML. For example, a JSX node like `<Page />`.
<Trans outdent>`reactNode`: HTML로 렌더링하려는 React 노드입니다. 예: `<Page />`와 같은 JSX 노드</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

An HTML string.
<Trans>HTML 문자열</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

* `renderToStaticMarkup` output cannot be hydrated.
<Trans>`renderToStaticMarkup` 의 출력은 hydrate될 수 없습니다.</Trans>

* `renderToStaticMarkup` has limited Suspense support. If a component suspends, `renderToStaticMarkup` immediately sends its fallback as HTML.
<Trans>`renderToStaticMarkup` 는 Suspense를 제한적으로 지원합니다. 컴포넌트가 일시 중단되면 `renderToStaticMarkup`는 즉시 폴백을 HTML로 전송합니다.</Trans>

* `renderToStaticMarkup` works in the browser, but using it in the client code is not recommended. If you need to render a component to HTML in the browser, [get the HTML by rendering it into a DOM node.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)
<Trans>`renderToStaticMarkup`는 브라우저에서 작동은 하지만 클라이언트 코드에서 사용하는 것은 권장하지 않습니다. 브라우저에서 컴포넌트를 HTML로 렌더링해야 하는 경우 [DOM 노드 안에 렌더링함으로써 HTML을 가져오세요.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Rendering a non-interactive React tree as HTML to a string<Trans>비대화형 React 트리를 HTML 문자열로 렌더링하기</Trans> {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

Call `renderToStaticMarkup` to render your app to an HTML string which you can send with your server response:
<Trans>`renderToStaticMarkup`을 호출하면 앱을 서버 응답과 함께 보낼 수 있는 HTML 문자열로 렌더링합니다:</Trans>

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// The route handler syntax depends on your backend framework
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

This will produce the initial non-interactive HTML output of your React components.
<Trans>이렇게 하면 React 컴포넌트의 초기 비대화형 HTML 출력이 생성됩니다.</Trans>

<Pitfall>

This method renders **non-interactive HTML that cannot be hydrated.**  This is useful if you want to use React as a simple static page generator, or if you're rendering completely static content like emails.
<Trans>이 메서드는 **hydrate할 수 없는 비대화형 HTML을 렌더링합니다.** 이 메서드는 React를 간단한 정적 페이지 생성기로 사용하거나 이메일과 같이 완전히 정적인 콘텐츠를 렌더링할 때 유용합니다.</Trans>

Interactive apps should use [`renderToString`](/reference/react-dom/server/renderToString) on the server and [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) on the client.
<Trans>인터랙티브 앱은 서버에서는 [`renderToString`](/reference/react-dom/server/renderToString)을, 클라이언트에서는 [`hydrateRoot`](/reference/react-dom/client/hydrateRoot)를 사용해야 합니다.</Trans>

</Pitfall>
