---
title: React Developer Tools
translatedTitle: React 개발자 도구
translators: [정재남]
---

<Intro>

Use React Developer Tools to inspect React [components](/learn/your-first-component), edit [props](/learn/passing-props-to-a-component) and [state](/learn/state-a-components-memory), and identify performance problems.
<Trans>React 개발자 도구를 사용하여 React [컴포넌트](/learn/your-first-component)를 검사하고, [props](/learn/passing-props-to-a-component) 및 [state](/learn/state-a-components-memory)를 편집하고, 성능 문제를 식별할 수 있습니다.</Trans>
</Intro>

<YouWillLearn>

* How to install React Developer Tools

<TransBlock>
- React 개발자 도구 설치 방법
</TransBlock>
</YouWillLearn>

## Browser extension<Trans>브라우저 확장 프로그램</Trans> {/*browser-extension*/}

The easiest way to debug websites built with React is to install the React Developer Tools browser extension. It is available for several popular browsers:
<Trans>React로 빌드된 웹사이트를 디버깅하는 가장 쉬운 방법은 React 개발자 도구 브라우저 확장 프로그램을 설치하는 것입니다. 여러 인기 브라우저에서 사용할 수 있습니다:</Trans>

* [Install for **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Install for **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Install for **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Now, if you visit a website **built with React,** you will see the _Components_ and _Profiler_ panels.
<Trans>이제 **React로 구축된** 웹사이트를 방문하면 *컴포넌트*와 *프로파일러* 패널을 볼 수 있습니다.</Trans>

![React Developer Tools extension](/images/docs/react-devtools-extension.png)

### Safari and other browsers<Trans>Safari 및 다른 브라우저</Trans> {/*safari-and-other-browsers*/}

For other browsers (for example, Safari), install the [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm package:
<Trans>다른 브라우저(예: Safari)의 경우, [`react-devtools`](https://www.npmjs.com/package/react-devtools) npm 패키지를 설치합니다:</Trans>

```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Next open the developer tools from the terminal:
<Trans>그런 다음 터미널에서 개발자 도구를 엽니다:</Trans>

```bash
react-devtools
```

Then connect your website by adding the following `<script>` tag to the beginning of your website's `<head>`:
<Trans>다음으로 웹사이트의 `<head>` 시작 부분에 다음 `<script>` 태그를 추가하여 웹사이트를 연결합니다:</Trans>

```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Reload your website in the browser now to view it in developer tools.
<Trans>이제 브라우저에서 웹사이트를 새로고침하면 개발자 도구에서 볼 수 있습니다.</Trans>

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## Mobile (React Native) {/*mobile-react-native*/}
React Developer Tools can be used to inspect apps built with [React Native](https://reactnative.dev/) as well.
<Trans>React 개발자 도구는 [React Native](https://reactnative.dev/)로 빌드된 앱을 검사하는 데에도 사용할 수 있습니다.</Trans>

The easiest way to use React Developer Tools is to install it globally:
<Trans>React 개발자 도구를 사용하는 가장 쉬운 방법은 전역에 설치하는 것입니다:</Trans>

```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Next open the developer tools from the terminal.
<Trans>다음으로 터미널에서 개발자 도구를 엽니다.</Trans>

```bash
react-devtools
```

It should connect to any local React Native app that's running.
<Trans>실행 중인 로컬 React Native 앱에 연결해야 합니다.</Trans>


> Try reloading the app if developer tools doesn't connect after a few seconds.
<Trans>개발자 도구가 몇 초 후에도 연결되지 않으면 앱을 다시 로드해 보세요.</Trans>

[Learn more about debugging React Native.](https://reactnative.dev/docs/debugging)
<Trans>[React Native 디버깅에 대해 자세히 알아보세요.](https://reactnative.dev/docs/debugging)</Trans>