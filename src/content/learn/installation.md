---
title: Installation
translatedTitle: 설치하기
translators: [정재남]
---

<iframe 
  style={{aspectRatio: 1.7778, width: '100%'}} 
  src="https://www.youtube.com/embed/playlist?list=PLjQV3hketAJkh6BEl0n4PDS_2fBd0cS9v&index=1"
  title="YouTube video player" 
  frameBorder="0" 
/>

<Intro>

React has been designed from the start for gradual adoption. You can use as little or as much React as you need. Whether you want to get a taste of React, add some interactivity to an HTML page, or start a complex React-powered app, this section will help you get started.
<Trans>React는 처음부터 점진적으로 도입할 수 있도록 설계되었습니다. 필요한 만큼의 React를 사용할 수 있습니다. 이 섹션은 React를 맛보고 싶거나, HTML 페이지에 약간의 상호작용을 추가하거나, 복잡한 React 기반 앱을 시작하려는 경우 시작하는 데 도움이 될 것입니다.</Trans>

</Intro>

<YouWillLearn isChapter={true}>

* [How to start a new React project](/learn/start-a-new-react-project)
* [How to add React to an existing project](/learn/add-react-to-an-existing-project)
* [How to set up your editor](/learn/editor-setup)
* [How to install React Developer Tools](/learn/react-developer-tools)

<TransBlock>
  * [새 React 프로젝트를 시작하는 방법](/learn/start-a-new-react-project)
  * [기존 프로젝트에 React를 추가하는 방법](/learn/add-react-to-an-existing-project)
  * [편집기를 설정하는 방법](/learn/editor-setup)
  * [React 개발자 도구 설치 방법](/learn/react-developer-tools)
</TransBlock>

</YouWillLearn>

## Try React<Trans>React 사용해보기</Trans> {/*try-react*/}

You don't need to install anything to play with React. Try editing this sandbox!
<Trans>React를 사용하기 위해 아무것도 설치할 필요가 없습니다. 이 샌드박스를 편집해 보세요!</Trans>

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}</h1>;
}

export default function App() {
  return <Greeting name="world" />
}
```

</Sandpack>

You can edit it directly or open it in a new tab by pressing the "Fork" button in the upper right corner.
<Trans>직접 편집하거나 오른쪽 상단 모서리에 있는 "포크" 버튼을 눌러 새 탭에서 열 수 있습니다.</Trans>

Most pages in the React documentation contain sandboxes like this. Outside of the React documentation, there are many online sandboxes that support React: for example, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), or [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb)
<Trans>React 문서의 대부분의 페이지에는 이와 같은 샌드박스가 포함되어 있습니다. React 문서 외에도 React를 지원하는 온라인 샌드박스가 많이 있습니다. 예를 들어, [CodeSandbox](https://codesandbox.io/s/new), [StackBlitz](https://stackblitz.com/fork/react), [CodePen.](https://codepen.io/pen?&editors=0010&layout=left&prefill_data_id=3f4569d1-1b11-4bce-bd46-89090eed5ddb) 등이 있습니다.</Trans>

### Try React locally<Trans>로컬로 React 사용해보기</Trans> {/*try-react-locally*/}

To try React locally on your computer, [download this HTML page.](https://gist.githubusercontent.com/gaearon/0275b1e1518599bbeafcde4722e79ed1/raw/db72dcbf3384ee1708c4a07d3be79860db04bff0/example.html) Open it in your editor and in your browser!
<Trans>컴퓨터에서 로컬로 React를 사용해 보려면 이 [HTML 페이지를 다운로드](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html) 하세요. 에디터와 브라우저에서 열어보세요!</Trans>

## Start a new React project<Trans>새 프로젝트 시작하기</Trans> {/*start-a-new-react-project*/}

If you want to build an app or a website fully with React, [start a new React project.](/learn/start-a-new-react-project)
<Trans>React로 앱이나 웹사이트를 완전히 구축하려면 [새 React 프로젝트를 시작하세요.](/learn/start-a-new-react-project)</Trans>

## Add React to an existing project<Trans>기존 프로젝트에 React 추가하기</Trans> {/*add-react-to-an-existing-project*/}

If want to try using React in your existing app or a website, [add React to an existing project.](/learn/add-react-to-an-existing-project)
<Trans>기존 앱이나 웹사이트에서 React를 사용해보고 싶다면 [기존 프로젝트에 React를 추가하세요.](/learn/add-react-to-an-existing-project)</Trans>

## Next steps<Trans>다음 단계</Trans> {/*next-steps*/}

Head to the [Quick Start](/learn) guide for a tour of the most important React concepts you will encounter every day.
<Trans>[빠른 시작](/learn) 가이드를 통해 매일 접하게 될 가장 중요한 React 개념을 살펴보세요.</Trans>
