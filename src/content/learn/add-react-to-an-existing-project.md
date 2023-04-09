---
title: Add React to an Existing Project
translatedTitle: 기존 프로젝트에 React 추가하기
translators: [정재남, 이나령, 이상희, 강승훈, 유한나라]
---

<Intro>

If you want to add some interactivity to your existing project, you don't have to rewrite it in React. Add React to your existing stack, and render interactive React components anywhere.
<Trans>기존 프로젝트에 인터랙션을 추가하고 싶다면 React에서 다시 작성할 필요가 없습니다. 기존 스택에 React를 추가하고 어디서나 대화형 React 컴포넌트를 렌더링하세요.</Trans>

</Intro>

<Note>

**You need to install [Node.js](https://nodejs.org/en/) for local development.** Although you can [try React](/learn/installation#try-react) online or with a simple HTML page, realistically most JavaScript tooling you'll want to use for development requires Node.js.
<Trans>**로컬 개발을 위해서는 [Node.js](https://nodejs.org/en/)를 설치해야 합니다.** 온라인이나 간단한 HTML 페이지에서 [React를 사용](/learn/installation#try-react)해 볼 수는 있지만, 현실적으로 개발에 사용할 대부분의 JavaScript 도구에는 Node.js가 필요합니다.</Trans>

</Note>

## Using React for an entire subroute of your existing website<Trans>기존 웹사이트의 전체 하위 경로에 React 사용하기</Trans> {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Let's say you have an existing web app at `example.com` built with another server technology (like Rails), and you want to implement all routes starting with `example.com/some-app/` fully with React.
<Trans>다른 서버 기술(예: Rails)로 구축된 `example.com`의 기존 웹 앱이 있고, `example.com/some-app/`로 시작하는 모든 경로를 React로 완전히 구현하고 싶다고 가정해 봅시다.</Trans>

Here's how we recommend to set it up:
<Trans>설정 방법은 다음과 같습니다:</Trans>

1. **Build the React part of your app** using one of the [React-based frameworks](/learn/start-a-new-react-project).
2. **Specify `/some-app` as the *base path*** in your framework's configuration (here's how: [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Configure your server or a proxy** so that all requests under `/some-app/` are handled by your React app.

<TransBlock>
  1. [React 기반 프레임워크](/learn/start-a-new-react-project) 중 하나를 사용하여 **앱의 React 부분을 빌드**합니다.
  2. 프레임워크의 설정에서 `/some-app`을 **기본 경로**로 지정합니다(방법은 다음과 같습니다: [Next.js](https://nextjs.org/docs/api-reference/next.config.js/basepath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
  3. 서버 또는 프록시를 **구성**하여 `/some-app/` 아래의 모든 요청이 React 앱에서 처리되도록 합니다.
</TransBlock>

This ensures the React part of your app can [benefit from the best practices](/learn/start-a-new-react-project#can-i-use-react-without-a-framework) baked into those frameworks.
<Trans>이렇게 하면 앱의 React 부분이 해당 프레임워크에 구현된 [모범 사례의 이점](/learn/start-a-new-react-project#can-i-use-react-without-a-framework)을 누릴 수 있습니다.</Trans>

Many React-based frameworks are full-stack and let your React app take advantage of the server. However, you can use the same approach even if you can't or don't want to run JavaScript on the server. In that case, serve the HTML/CSS/JS export ([`next export` output](https://nextjs.org/docs/advanced-features/static-html-export) for Next.js, default for Gatsby) at `/some-app/` instead.
<Trans>많은 React 기반 프레임워크는 풀 스택이며 React 앱이 서버를 활용할 수 있도록 합니다. 그러나 서버에서 JavaScript를 실행할 수 없거나 실행하고 싶지 않은 경우에도 동일한 접근 방식을 사용할 수 있습니다. 이 경우 `/some-app/`에서 HTML/CSS/JS 내보내기(Next.js의 경우 [`next export` output](https://nextjs.org/docs/advanced-features/static-html-export), 개츠비의 경우 기본값)를 대신 제공하면 됩니다.</Trans>

## Using React for a part of your existing page<Trans>기존 페이지의 일부에 React 사용하기</Trans> {/*using-react-for-a-part-of-your-existing-page*/}

Let's say you have an existing page built with another technology (either a server one like Rails, or a client one like Backbone), and you want to render interactive React components somewhere on that page. That's a common way to integrate React--in fact, it's how most React usage looked at Meta for many years!
<Trans>다른 기술(Rails와 같은 서버 기술이나 Backbone과 같은 클라이언트 기술)로 구축된 기존 페이지가 있고, 그 페이지의 어딘가에 대화형 React 컴포넌트를 렌더링하고 싶다고 가정해 봅시다. 이는 React를 통합하는 일반적인 방법이며, 실제로 수년 동안 메타에서 대부분의 React를 사용하는 방식입니다!</Trans>

You can do this in two steps:
<Trans>이 작업은 두 단계로 수행할 수 있습니다:</Trans>

1. **Set up a JavaScript environment** that lets you use the [JSX syntax](/learn/writing-markup-with-jsx), split your code into modules with the [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) syntax, and use packages (for example, React) from the [npm](https://www.npmjs.com/) package registry.
2. **Render your React components** where you want to see them on the page.

<TransBlock>
1. **[JSX 구문](/learn/writing-markup-with-jsx)을 사용할 수 있는 JavaScript 환경**을 설정하고, [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 구문을 사용하여 코드를 모듈로 분할한 다음, [npm](https://www.npmjs.com/) 패키지 레지스트리에서 패키지(예: React)를 사용하세요.
2. 페이지에서 보고 싶은 위치에 React 컴포넌트를 **렌더링**합니다.
</TransBlock>

The exact approach depends on your existing page setup, so let's walk through some details.
<Trans>정확한 접근 방식은 기존 페이지 설정에 따라 다르므로 몇 가지 세부 사항을 살펴봅시다.</Trans>

### Step 1: Set up a modular JavaScript environment<Trans>모듈형 JavaScript 환경 설정</Trans> {/*step-1-set-up-a-modular-javascript-environment*/}

A modular JavaScript environment lets you write your React components in individual files, as opposed to writing all of your code in a single file. It also lets you use all the wonderful packages published by other developers on the [npm](https://www.npmjs.com/) registry--including React itself! How you do this depends on your existing setup:
<Trans>모듈형 JavaScript 환경에서는 모든 코드를 하나의 파일에 작성하는 대신 개별 파일에 React 컴포넌트를 작성할 수 있습니다. 또한 React 자체를 포함해 다른 개발자가 [npm](https://www.npmjs.com/) 레지스트리에 게시한 모든 멋진 패키지를 사용할 수 있습니다. 이 작업을 수행하는 방법은 기존 설정에 따라 다릅니다:</Trans>

* **If your app is already split into files that use `import` statements,** try to use the setup you already have. Check whether writing `<div />` in your JS code causes a syntax error. If it causes a syntax error, you might need to [transform your JavaScript code with Babel](https://babeljs.io/setup), and enable the [Babel React preset](https://babeljs.io/docs/babel-preset-react) to use JSX.
<Trans>**앱이 이미 `import` 문을 사용하는 파일로 분할되어 있는 경우,** 이미 가지고 있는 설정을 사용해보세요. JS 코드에 `<div />`를 작성하면 구문 오류가 발생하는지 확인하세요. 구문 오류가 발생하면 [Babel로 JavaScript 코드 변환](https://babeljs.io/setup)을 하고 [Babel React 프리셋](https://babeljs.io/docs/babel-preset-react)을 활성화하여 JSX를 사용해야 할 수 있습니다.</Trans>

* **If your app doesn't have an existing setup for compiling JavaScript modules,** set it up with [Vite](https://vitejs.dev/). The Vite community maintains [many integrations with backend frameworks](https://github.com/vitejs/awesome-vite#integrations-with-backends), including Rails, Django, and Laravel. If your backend framework is not listed, [follow this guide](https://vitejs.dev/guide/backend-integration.html) to manually integrate Vite builds with your backend.
<Trans>**앱에 JavaScript 모듈 컴파일을 위한 기존 설정이 없는 경우** [Vite](https://vitejs.dev/)로 설정하세요. Vite 커뮤니티는 Rails, Django, Laravel을 포함한 [백엔드 프레임워크와의 다양한 통합](https://github.com/vitejs/awesome-vite#integrations-with-backends)을 유지 관리합니다. 사용 중인 백엔드 프레임워크가 목록에 없는 경우, [이 가이드](https://vitejs.dev/guide/backend-integration.html)를 따라 Vite 빌드를 백엔드와 수동으로 통합하세요.</Trans>


To check whether your setup works, run this command in your project folder:
<Trans>설정이 작동하는지 확인하려면 프로젝트 폴더에서 이 명령을 실행하세요:</Trans>

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Then add these lines of code at the top of your main JavaScript file (it might be called `index.js` or `main.js`):
<Trans>그런 다음 메인 JavaScript 파일(`index.js` 또는 `main.js`라고 할 수 있음) 상단에 다음 코드 줄을 추가합니다:</Trans>

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Your existing page content (in this example, it gets replaced) -->
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

If the entire content of your page was replaced by a "Hello, world!", everything worked! Keep reading.
<Trans>페이지의 전체 콘텐츠가 "Hello, world!"으로 바뀌면 모든 것이 작동하는 것입니다! 계속 읽어보세요.</Trans>

<Note>

Integrating a modular JavaScript environment into an existing project for the first time can feel intimidating, but it's worth it! If you get stuck, try our [community resources](/community) or the [Vite Chat](https://chat.vitejs.dev/).
<Trans>모듈형 JavaScript 환경을 기존 프로젝트에 처음 통합하는 것은 어렵게 느껴질 수 있지만 그만한 가치가 있습니다! 막히는 부분이 있으면 [커뮤니티 리소스](/community) 또는 [Vite 채팅](https://chat.vitejs.dev/)을 사용해 보세요.</Trans>

</Note>

### Step 2: Render React components anywhere on the page<Trans>페이지 어디서든 React 컴포넌트 렌더링</Trans> {/*step-2-render-react-components-anywhere-on-the-page*/}

In the previous step, you put this code at the top of your main file:
<Trans>이전 단계에서는 이 코드를 메인 파일 상단에 넣었습니다:</Trans>

```js
import { createRoot } from 'react-dom/client';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Of course, you don't actually want to clear the existing HTML content!
<Trans>물론 실제로 기존 HTML 콘텐츠를 지우고 싶지는 않을 것입니다!</Trans>

Delete this code.
<Trans>이 코드를 지우세요.</Trans>

Instead, you probably want to render your React components in specific places in your HTML. Open your HTML page (or the server templates that generate it) and add a unique [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) attribute to any tag, for example:
<Trans>대신 HTML의 특정 위치에 React 컴포넌트를 렌더링하고 싶을 것입니다. HTML 페이지(또는 이를 생성하는 서버 템플릿)를 열고 태그에 고유한 [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) 속성을 추가합니다:</Trans>

```html
<!-- ... somewhere in your html ... -->
<nav id="navigation"></nav>
<!-- ... more html ... -->
```

This lets you find that HTML element with [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) and pass it to [`createRoot`](/reference/react-dom/client/createRoot) so that you can render your own React component inside:
<Trans>이렇게 하면 [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById)로 해당 HTML 엘리먼트를 찾아서 [`createRoot`](/reference/react-dom/client/createRoot)에 전달하여 내부에서 자체 React 컴포넌트를 렌더링할 수 있습니다:</Trans>

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Actually implement a navigation bar
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Notice how the original HTML content from `index.html` is preserved, but your own `NavigationBar` React component now appears inside the `<nav id="navigation">` from your HTML. Read the [`createRoot` usage documentation](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) to learn more about rendering React components inside an existing HTML page.
<Trans>`index.html`의 원본 HTML 콘텐츠는 그대로 유지되지만, 이제 HTML의 `<nav id="navigation">` 안에 나만의 `NavigationBar` React 컴포넌트가 나타납니다. 기존 HTML 페이지 내에서 React 컴포넌트를 렌더링하는 방법에 대해 자세히 알아보려면 [`createRoot` 사용 설명서](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react)를 읽어보시기 바랍니다.</Trans>

## Using React Native in an existing native mobile app<Trans>기존 네이티브 모바일 앱에서 React Native 사용하기</Trans> {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) can also be integrated into existing native apps incrementally. If you have an existing native app for Android (Java or Kotlin) or iOS (Objective-C or Swift), [follow this guide](https://reactnative.dev/docs/integration-with-existing-apps) to add a React Native screen to it.
<Trans>[React Native](https://reactnative.dev/)는 기존 네이티브 앱에 점진적으로 통합할 수도 있습니다. Android(Java 또는 Kotlin) 또는 iOS(Objective-C 또는 Swift)용 기존 네이티브 앱이 있는 경우, [이 가이드](https://reactnative.dev/docs/integration-with-existing-apps)를 따라 React Native 화면을 추가하세요.</Trans>
