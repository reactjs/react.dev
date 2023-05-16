# react-ko.dev | React 비공식 한글번역 사이트

[react.dev](https://react.dev/)를 fork하여 작성한 리파지토리입니다.  
스터디그룹에서 한글 번역을 진행하고 있고,  
유튜브 [FE재남](https://www.youtube.com/playlist?list=PLjQV3hketAJkh6BEl0n4PDS_2fBd0cS9v)에 스터디 영상을 공개하고 있습니다.

## PR 작성 규칙

1. `develop` 브랜치를 기준으로 로컬 브랜치를 만듭니다.  
   _[your-own-branch-name] 부분에 원하는 이름을 넣으세요. 대괄호(`[ ]`)는 없어야 합니다._

```bash
/develop/> git pull origin develop
/develop/> git switch -c "[your-own-branch-name]"
```

2. 작업을 마치면 해당 브랜치를 `push`합니다.

```bash
/[your-own-branch-name]/> git add .
/[your-own-branch-name]/> git commit -m "커밋메시지 자유롭게 작성"
/[your-own-branch-name]/> git push origin [your-own-branch-name]
```

3. 깃헙에서 `New Pull Request`를 하세요.

| 1. base repository:<br/> **"roy-jung/react.dev.ko"** 선택                                                                                | 2. 다시 base:<br/> **develop** 선택                                                                                                      | 3. compare:<br/> 작업한 브랜치를 선택                                                                                                    |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| <img width="75%" alt="image" src="https://user-images.githubusercontent.com/6881617/229475203-38e76220-9b5a-48a8-ae27-6820a5574b14.png"> | <img width="80%" alt="image" src="https://user-images.githubusercontent.com/6881617/229475456-7d7ef659-0800-420e-985c-4e16bb2e5592.png"> | <img width="80%" alt="image" src="https://user-images.githubusercontent.com/6881617/229475665-590316e2-fb93-4de3-88f0-b54c3a71934f.png"> |

## 번역 규칙

<blockquote>
<h3>TL;DR</h3>

1. 문서 제목: title 아래에 `translatedTitle: 번역제목`
2. 일반 번역: `<Trans>번역내용</Trans>`
3. 블록 단위 번역: `<TransBlock>번역내용</TransBlock>`
4. 소제목 번역: 원문과 {/...} 사이에 `<Trans>번역제목</Trans>`
5. 추가 코멘트: `<Extra>코멘트 내용</Extra>` : 첫줄은 `h4`타이틀을 위한 `####`로 시작.

</blockquote>

1. 각 문서의 title 아래에 `translatedTitle`을 추가합니다.

```markdown
---
title: Scaling Up with Reducer and Context
translatedTitle: Reducer와 Context로 확장하기
---
```

2. 각 **문단** 바로 다음줄에 `<Trans>번역내용</Trans>`과 같이 번역글을 작성합니다.

```markdown
Reducers let you consolidate a component's state update logic. Context lets you pass information deep down to other components. You can combine reducers and context together to manage state of a complex screen.
<Trans>Reducer를 사용하면 컴포넌트의 state 업데이트 로직을 통합할 수 있습니다. Context를 사용하면 다른 컴포넌트들에 정보를 전달할 수 있습니다. Reducer와 context를 함께 사용하여 복잡한 화면의 state를 관리할 수 있습니다.</Trans>
```

3. 목록 및 기타 블록 단위의 번역이 필요한 경우, `<TransBlock>번역내용</TransBlock>`와 같이 작성합니다.

```markdown
<YouWillLearn>

- How to combine a reducer with context
- How to avoid passing state and dispatch through props
- How to keep context and state logic in a separate file

<TransBlock>
* reducer와 context를 결합하는 방법
* state와 dispatch 함수를 prop으로 전달하지 않는 방법
* context와 state 로직을 별도의 파일에서 관리하는 방법
</TransBlock>

</YouWillLearn>
```

4. 각 소제목 뒤, hash표시 앞 부분에 번역제목을 추가합니다.

```markdown
<!-- from -->

### Step 1: Create the context {/_step-1-create-the-context_/}

<!-- to -->

### Step 1: Create the context<Trans>Context 생성하기</Trans> {/_step-1-create-the-context_/}
```

5. 목록 아이템의 글이 지나치게 길어 아이템별로 바로 이어서 번역글을 작성하는 것이 가독성 측면에서 더 나은 경우 등에는 각 목록 아이템 바로 밑에 번역글을 작성합니다.

```markdown
- **Code size:** Generally, with `useState` you have to write less code upfront. With `useReducer`, you have to write both a reducer function _and_ dispatch actions. However, `useReducer` can help cut down on the code if many event handlers modify state in a similar way.
  <Trans>**코드 크기:** 일반적으로 `useState`를 사용하면 미리 작성해야 하는 코드가 줄어듭니다. `useReducer`를 사용하면 reducer 함수 _와_ action을 전달하는 부분 모두 작성해야 합니다. 하지만 많은 이벤트 핸들러가 비슷한 방식으로 state를 업데이트하는 경우 `useReducer`를 사용하면 코드를 줄이는 데 도움이 될 수 있습니다.</Trans>

- **Readability:** `useState` is very easy to read when the state updates are simple. When they get more complex, they can bloat your component's code and make it difficult to scan. In this case, `useReducer` lets you cleanly separate the _how_ of update logic from the _what happened_ of event handlers.
  <Trans>**가독성:** `useState`로 간단한 state를 업데이트 하는 경우 가독성이 좋습니다. 그렇지만 state의 구조가 더욱 복잡해지면, 컴포넌트의 코드의 양이 부풀어 오르고 한눈에 읽기 어려워질 수 있습니다. 이 경우 `useReducer`를 사용하면 업데이트 로직이 _어떻게 동작_ 하는지와 이벤트 핸들러를 통해 _무엇이 일어났는지_ 를 깔끔하게 분리할 수 있습니다.</Trans>
```

5. 추가 코멘트(원문에 없는 내용)는 `<Extra>내용</Extra>`와 같이 작성합니다. 첫 줄에는 반드시 `#### [제목]`이 필요합니다.

```
<Extra>
#### 다양한 방법으로 컴포넌트 추가하기 -@이승효 {/*add_component_in_various_ways*/}

React 컴포넌트는 항상 대문자로 시작해야 하지만, 함수명이 대문자일 필요는 없습니다. **그러나 JSX 안에서 컴포넌트가 사용될 때에는 반드시 대문자로 시작해야 한다는 것에 유의하세요.**
</Extra>
```

## Getting started

### Prerequisites

1. Git
1. Node: any 12.x version starting with v12.0.0 or greater
1. Yarn: See [Yarn website for installation instructions](https://yarnpkg.com/lang/en/docs/install/)
1. A fork of the repo (for any contributions)
1. A clone of the [react.dev repo](https://github.com/reactjs/react.dev) on your local machine

### Installation

1. `cd react.dev` to go into the project root
2. `yarn` to install the website's npm dependencies

### Running locally

1. `yarn dev` to start the development server (powered by [Next.js](https://nextjs.org/))
1. `open http://localhost:3000` to open the site in your favorite browser

## Contributing

### Guidelines

The documentation is divided into several sections with a different tone and purpose. If you plan to write more than a few sentences, you might find it helpful to get familiar with the [contributing guidelines](https://github.com/reactjs/react.dev/blob/main/CONTRIBUTING.md#guidelines-for-text) for the appropriate sections.

### Create a branch

1. `git checkout main` from any folder in your local `react.dev` repository
1. `git pull origin main` to ensure you have the latest main code
1. `git checkout -b the-name-of-my-branch` (replacing `the-name-of-my-branch` with a suitable name) to create a branch

### Make the change

1. Follow the ["Running locally"](#running-locally) instructions
1. Save the files and check in the browser
1. Changes to React components in `src` will hot-reload
1. Changes to files in `content` will hot-reload
1. If working with plugins, you may need to remove the `.cache` directory and restart the server

### Test the change

1. If possible, test any visual changes in all latest versions of common browsers, on both desktop and mobile.
2. Run `yarn check-all`. (This will run Prettier, ESLint and validate types.)

### Push it

1. `git add -A && git commit -m "My message"` (replacing `My message` with a commit message, such as `Fix header logo on Android`) to stage and commit your changes
1. `git push my-fork-name the-name-of-my-branch`
1. Go to the [react.dev repo](https://github.com/reactjs/react.dev) and you should see recently pushed branches.
1. Follow GitHub's instructions.
1. If possible, include screenshots of visual changes. A preview build is triggered after your changes are pushed to GitHub.

## Translation

If you are interested in translating `react.dev`, please see the current translation efforts [here](https://github.com/reactjs/react.dev/issues/4135).

## License

Content submitted to [react.dev](https://react.dev/) is CC-BY-4.0 licensed, as found in the [LICENSE-DOCS.md](https://github.com/reactjs/react.dev/blob/main/LICENSE-DOCS.md) file.
