---
title: Editor Setup
translatedTitle: 편집기 설정
translators: [정재남, 김혜원]
---

<Intro>

A properly configured editor can make code clearer to read and faster to write. It can even help you catch bugs as you write them! If this is your first time setting up an editor or you're looking to tune up your current editor, we have a few recommendations.
<Trans>잘 설정된 편집기를 사용하면 코드를 더 명확하게 읽고 더 빠르게 작성할 수 있습니다. 심지어 코드를 작성하면서 버그를 발견하는 데에도 도움이 될 수 있습니다! 편집기를 처음 설정하거나 현재 편집기를 조정하려는 경우 몇 가지 권장 사항이 있습니다.</Trans>
</Intro>

<YouWillLearn>

* What the most popular editors are
* How to format your code automatically

<TransBlock>
- 가장 인기 있는 편집기는 무엇이 있는지
- 코드 서식을 자동으로 지정하는 방법
</TransBlock>
</YouWillLearn>

## Your editor {/*your-editor*/}

[VS Code](https://code.visualstudio.com/) is one of the most popular editors in use today. It has a large marketplace of extensions and integrates well with popular services like GitHub. Most of the features listed below can be added to VS Code as extensions as well, making it highly configurable!
<Trans>[VS Code](https://code.visualstudio.com/)는 현재 가장 많이 사용되는 편집기 중 하나입니다. 확장 기능의 대규모 마켓플레이스가 있으며 GitHub와 같은 인기 서비스와 잘 통합됩니다. 아래 나열된 대부분의 기능은 확장 기능으로 VS Code에 추가할 수 있으므로 구성이 매우 쉽습니다!</Trans>

Other popular text editors used in the React community include:
<Trans>React 커뮤니티에서 사용되는 다른 인기 텍스트 편집기는 다음과 같습니다:</Trans>

* [WebStorm](https://www.jetbrains.com/webstorm/) is an integrated development environment designed specifically for JavaScript.
* [Sublime Text](https://www.sublimetext.com/) has support for JSX and TypeScript, [syntax highlighting](https://stackoverflow.com/a/70960574/458193) and autocomplete built in.
* [Vim](https://www.vim.org/) is a highly configurable text editor built to make creating and changing any kind of text very efficient. It is included as "vi" with most UNIX systems and with Apple OS X.

<TransBlock>
  - [웹스톰](https://www.jetbrains.com/webstorm/)은 JavaScript를 위해 특별히 설계된 통합 개발 환경입니다.
  - [Sublime Text](https://www.sublimetext.com/)는 JSX와 TypeScript를 지원하며, [구문 강조](https://stackoverflow.com/a/70960574/458193) 및 자동완성 기능이 빌트인되어 있습니다.
  - [Vim](https://www.vim.org/)은 모든 종류의 텍스트를 매우 효율적으로 생성하고 변경할 수 있도록 고도로 구성 가능한 텍스트 편집기입니다. 대부분의 UNIX 시스템과 Apple OS X에 "vi"로 포함되어 있습니다.
</TransBlock>

## Recommended text editor features<Trans>권장 텍스트 편집기 기능</Trans> {/*recommended-text-editor-features*/}

Some editors come with these features built in, but others might require adding an extension. Check to see what support your editor of choice provides to be sure!
<Trans>일부 편집기에는 이러한 기능이 기본으로 제공되지만, 확장 기능을 추가해야 하는 편집기도 있습니다. 선택한 편집기가 어떤 지원을 제공하는지 확인해보세요!</Trans>

### Linting {/*linting*/}

Code linters find problems in your code as you write, helping you fix them early. [ESLint](https://eslint.org/) is a popular, open source linter for JavaScript. 
<Trans>코드 린트는 코드를 작성할 때 코드의 문제를 찾아내어 조기에 수정할 수 있도록 도와줍니다. [ESLint](https://eslint.org/)는 널리 사용되는 JavaScript용 오픈 소스 린터입니다.</Trans>

* [Install ESLint with the recommended configuration for React](https://www.npmjs.com/package/eslint-config-react-app) (be sure you have [Node installed!](https://nodejs.org/en/download/current/))
* [Integrate ESLint in VSCode with the official extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

**Make sure that you've enabled all the [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) rules for your project.** They are essential and catch the most severe bugs early. The recommended [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) preset already includes them.

<TransBlock>
- React에 권장되는 구성으로 [ESLint 설치](https://www.npmjs.com/package/eslint-config-react-app) (반드시 [Node가 설치되어 있는지 확인!](https://nodejs.org/en/download/current/))
- 공식 확장을 사용하여 [VSCode에 ESLint 통합](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
</TransBlock>

### Formatting<Trans>서식 지정</Trans> {/*formatting*/}

The last thing you want to do when sharing your code with another contributor is get into an discussion about [tabs vs spaces](https://www.google.com/search?q=tabs+vs+spaces)! Fortunately, [Prettier](https://prettier.io/) will clean up your code by reformatting it to conform to preset, configurable rules. Run Prettier, and all your tabs will be converted to spaces—and your indentation, quotes, etc will also all be changed to conform to the configuration. In the ideal setup, Prettier will run when you save your file, quickly making these edits for you.
<Trans>다른 기여자와 코드를 공유할 때 가장 피하고 싶은 일은 [탭과 공백](https://www.google.com/search?q=tabs+vs+spaces)에 대해 토론하는 것입니다! 다행히도 [Prettier](https://prettier.io/)는 미리 설정된 구성 가능한 규칙에 맞게 코드를 다시 포맷하여 코드를 정리해줍니다. Prettier를 실행하면 모든 탭이 공백으로 변환되고 들여쓰기, 따옴표 등도 모두 구성에 맞게 변경됩니다. 이상적인 설정에서는 파일을 저장할 때 Prettier가 실행되어 이러한 편집을 빠르게 수행합니다.</Trans>

You can install the [Prettier extension in VSCode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) by following these steps:
<Trans>다음 단계에 따라 [VSCode의 Prettier 확장 프로그램](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)을 설치할 수 있습니다:</Trans>

1. Launch VS Code
2. Use Quick Open (press Ctrl/Cmd+P)
3. Paste in `ext install esbenp.prettier-vscode`
4. Press Enter

<TransBlock>
1. VS Code를 실행하세요.
2. 빠른 실행을 여세요 (Windows: Ctrl + P / Mac: Cmd + P 를 누르세요)
3. `ext install esbenp.prettier-vscode`를 입력하세요.
4. Enter를 누르세요.
</TransBlock>

#### Formatting on save<Trans>저장시 서식 지정하기</Trans> {/*formatting-on-save*/}

Ideally, you should format your code on every save. VS Code has settings for this!
<Trans>이상적으로는 저장할 때마다 코드 서식을 지정해야 합니다. VS Code에는 이를 위한 설정이 있습니다!</Trans>

1. In VS Code, press `CTRL/CMD + SHIFT + P`.
2. Type "settings"
3. Hit Enter
4. In the search bar, type "format on save"
5. Be sure the "format on save" option is ticked!

<TransBlock>
1. VS Code에서, Windows: `CTRL + SHIFT + P` / Mac: `CMD + SHIFT + P`를 누르세요.
2. "settings"라고 입력하세요. 
3. "show Settings" 항목으로 이동 후 Enter를 누르세요.
4. 검색창에서 "format on save"를 입력하세요.
5. "format on save" 옵션이 선택되어 있어야 합니다!
</TransBlock>

> If your ESLint preset has formatting rules, they may conflict with Prettier. We recommend disabling all formatting rules in your ESLint preset using [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) so that ESLint is *only* used for catching logical mistakes. If you want to enforce that files are formatted before a pull request is merged, use [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) for your continuous integration.
<Trans>ESLint 프리셋에 서식 지정 규칙이 있는 경우 Prettier와 충돌할 수 있습니다. ESLint가 논리적 실수를 잡는 데만 사용되도록 [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier)를 사용하여 ESLint 프리셋의 모든 서식 지정 규칙을 비활성화하는 것이 좋습니다. 풀 리퀘스트가 병합되기 전에 파일 형식이 지정되도록 하려면 지속적 통합을 위해 [`prettier --check`](https://prettier.io/docs/en/cli.html#--check)를 사용하세요.</Trans>
