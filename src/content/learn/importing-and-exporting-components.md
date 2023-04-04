---
title: Importing and Exporting Components
translatedTitle: 컴포넌트 import 및 export
---

<Intro>

The magic of components lies in their reusability: you can create components that are composed of other components. But as you nest more and more components, it often makes sense to start splitting them into different files. This lets you keep your files easy to scan and reuse components in more places.
<Trans>컴포넌트의 가장 큰 장점은 재사용성으로 컴포넌트를 조합해 또 다른 컴포넌트를 만들 수 있습니다. 컴포넌트를 여러 번 중첩하게 되면 다른 파일로 분리해야 하는 시점이 생깁니다. 이렇게 분리하면 나중에 파일을 찾기 더 쉽고 재사용하기 편리해집니다.</Trans>

</Intro>

<YouWillLearn>

* What a root component file is
* How to import and export a component
* When to use default and named imports and exports
* How to import and export multiple components from one file
* How to split components into multiple files
<TransBlock>
  - 루트 컴포넌트란 무엇인지
  - 컴포넌트를 import하고 export하는 방법
  - default 및 이름 있는 import / export 를 사용해야 하는 경우
  - 하나의 파일에서 여러 컴포넌트를 import / export 하는 방법
  - 컴포넌트를 여러 파일로 분할하는 방법
</TransBlock>
</YouWillLearn>

## The root component file<Trans>루트 컴포넌트 파일</Trans> {/*the-root-component-file*/}

In [Your First Component](/learn/your-first-component), you made a `Profile` component and a `Gallery` component that renders it:
<Trans>[첫번째 컴포넌트](/learn/your-first-component)에서 만든 `Profile` 컴포넌트와 `Gallery` 컴포넌트는 아래와 같이 렌더링 됩니다:</Trans>

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

These currently live in a **root component file,** named `App.js` in this example. In [Create React App](https://create-react-app.dev/), your app lives in `src/App.js`. Depending on your setup, your root component could be in another file, though. If you use a framework with file-based routing, such as Next.js, your root component will be different for every page.
<Trans>이 예제의 컴포넌트들은 모두 `App.js`라는 **root 컴포넌트 파일**에 존재합니다. [Create React App](https://create-react-app.dev/)에서는 앱 전체가 `src/App.js`에서 실행됩니다. 설정에 따라 root 컴포넌트가 다른 파일에 위치할 수도 있습니다. Next.js처럼 파일 기반으로 라우팅하는 프레임워크일 경우 페이지별로 root 컴포넌트가 다를 수 있습니다.</Trans>

## Exporting and importing a component<Trans>컴포넌트 import 및 export하기</Trans> {/*exporting-and-importing-a-component*/}

What if you want to change the landing screen in the future and put a list of science books there? Or place all the profiles somewhere else? It makes sense to move `Gallery` and `Profile` out of the root component file. This will make them more modular and reusable in other files. You can move a component in three steps:
<Trans>나중에 랜딩 화면을 변경하여 과학 도서 목록을 넣으려면 어떻게 해야 하나요? 아니면 모든 프로필을 다른 곳에 배치하고자 한다면? `Gallery`와 `Profile`을 root 컴포넌트 파일 밖으로 옮기는 것이 좋을 것 같습니다. 이렇게 하면 보다 모듈성이 강화되고 다른 파일에서 재사용할 수 있게 됩니다. 컴포넌트는 다음 세 단계로  이동할 수 있습니다.</Trans>

1. **Make** a new JS file to put the components in.
2. **Export** your function component from that file (using either [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) or [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) exports).
3. **Import** it in the file where you’ll use the component (using the corresponding technique for importing [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) or [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) exports).

<TransBlock>
  1. 컴포넌트를 넣을 JS 파일을 **생성**합니다.
  2. 새로 만든 파일에서 함수 컴포넌트를 **export** 합니다. ([default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) 또는 [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) export 방식을 사용합니다.)
  3. 컴포넌트를 사용할 파일에서 **import** 합니다. ([default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) 또는 [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) export에 대응하는 방식으로 import 합니다.)
</TransBlock>

Here both `Profile` and `Gallery` have been moved out of `App.js` into a new file called `Gallery.js`. Now you can change `App.js` to import `Gallery` from `Gallery.js`:
<Trans>여기서 `Profile`과 `Gallery`는 모두 `App.js`에서 `Gallery.js`라는 새 파일로 이동했습니다. 이제 `App.js`를 변경하여 `Gallery.js`에서 `Gallery`를 import할 수 있습니다:</Trans>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Notice how this example is broken down into two component files now:
<Trans>이제 이 예제에서는 컴포넌트들이 두 파일로 나뉘게 되었습니다:</Trans>

1. `Gallery.js`:
    - Defines the `Profile` component which is only used within the same file and is not exported.
    - Exports the `Gallery` component as a **default export.**
    <TransBlock>
    - 동일한 파일 내에서만 사용되며 export하지 않는 `Profile` 컴포넌트를 정의합니다.
    - `Gallery` 컴포넌트를 **default export** 방식으로 export 합니다.
    </TransBlock>
2. `App.js`:
    - Imports `Gallery` as a **default import** from `Gallery.js`.
    - Exports the root `App` component as a **default export.**
    <TransBlock>
    - `Gallery`를 `Gallery.js`로부터 **default import** 방식으로 import 합니다.
    - root `App` 컴포넌트를 **default export** 방식으로 **export** 합니다.
    </TransBlock>

<Note>

You may encounter files that leave off the `.js` file extension like so:
<Trans>가끔 `.js`와 같은 파일 확장자가 없는 때도 있습니다.</Trans>

```js 
import Gallery from './Gallery';
```

Either `'./Gallery.js'` or `'./Gallery'` will work with React, though the former is closer to how [native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) work.
<Trans>React에서는 `'./Gallery.js'` 또는 `'./Gallery'` 둘 다 사용할 수 있지만 전자의 경우가  [ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) 사용 방법에 더 가깝습니다.</Trans>

</Note>

<DeepDive>

#### Default vs named exports {/*default-vs-named-exports*/}

There are two primary ways to export values with JavaScript: default exports and named exports. So far, our examples have only used default exports. But you can use one or both of them in the same file. **A file can have no more than one _default_ export, but it can have as many _named_ exports as you like.**
<Trans>보통 JavaScript에서는 default export와 named export라는 두 가지 방법으로 값을 export 합니다. 지금까지의 예제에서는 default export만 사용했지만 두 방법 다 한 파일에서 사용할 수도 있습니다. **다만 한 파일에서는 하나의 *default* export만 존재할 수 있고 *named* export는 여러 개가 존재할 수 있습니다.**</Trans>

![Default and named exports](/images/docs/illustrations/i_import-export.svg)

How you export your component dictates how you must import it. You will get an error if you try to import a default export the same way you would a named export! This chart can help you keep track:
<Trans>Export 하는 방식에 따라 import 하는 방식이 정해집니다. Default export로 한 값을 named import로 가져오려고 하려면 에러가 발생합니다. 아래 표에는 각각의 경우의 문법이 정리되어 있습니다.</Trans>

| Syntax           | Export statement                           | Import statement                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './button.js';` |

When you write a _default_ import, you can put any name you want after `import`. For example, you could write `import Banana from './button.js'` instead and it would still provide you with the same default export. In contrast, with named imports, the name has to match on both sides. That's why they are called _named_ imports!
<Trans>*default* import를 사용하는 경우 원한다면 `import` 단어 후에 다른 이름으로 값을 가져올 수 있습니다. 예를 들어 `import Banana from './button.js'` 라고 쓰더라도 같은 default export 값을 가져오게 됩니다. 반대로 named import를 사용할 때는 양쪽 파일에서 사용하고자 하는 값의 이름이 같아야 해서 *named* import라고 불립니다.</Trans>

**People often use default exports if the file exports only one component, and use named exports if it exports multiple components and values.** Regardless of which coding style you prefer, always give meaningful names to your component functions and the files that contain them. Components without names, like `export default () => {}`, are discouraged because they make debugging harder.
<Trans>**보편적으로 한 파일에서 하나의 컴포넌트만 export 할 때 default export 방식을 사용하고 여러 컴포넌트를 export 할 경우엔 named export 방식을 사용합니다.** 어떤 방식을 사용하든 컴포넌트와 파일의 이름을 의미 있게 명명하는 것은 중요합니다. `export default () => {}` 처럼 이름 없는 컴포넌트는 나중에 디버깅하기 어렵기 때문에 권장하지 않습니다.</Trans>

</DeepDive>

## Exporting and importing multiple components from the same file<Trans>동일한 파일에서 여러 컴포넌트 import 및 export하기</Trans> {/*exporting-and-importing-multiple-components-from-the-same-file*/}

What if you want to show just one `Profile` instead of a gallery? You can export the `Profile` component, too. But `Gallery.js` already has a *default* export, and you can't have _two_ default exports. You could create a new file with a default export, or you could add a *named* export for `Profile`. **A file can only have one default export, but it can have numerous named exports!**
<Trans>갤러리 대신 하나의 `Profile`만 표시하고 싶다면 어떻게 해야 하나요? `Profile` 컴포넌트도 export 할 수 있습니다. 하지만 `Gallery.js`에는 이미 *default* export가 있으며, default export를 *두 개* 가질 수는 없습니다. 새 파일을 만들어 default export 하거나, 혹은`Profile`에서 *named* export를 추가할 수도도 있습니다. **한 파일은 default export를 하나만 가질 수 있지만, named export는 여러 개 가질 수 있습니다!**</Trans>

<Note>

To reduce the potential confusion between default and named exports, some teams choose to only stick to one style (default or named), or avoid mixing them in a single file. Do what works best for you!
<Trans>default export와 named export 사이의 잠재적인 혼동을 줄이기 위해 일부 팀에서는 한 가지 스타일(default 또는 named)만 고수하거나, 단일 파일 내에서 혼합하지 않도록 선택합니다. 자신에게 가장 적합한 방식을 선택하세요!</Trans>

</Note>

First, **export** `Profile` from `Gallery.js` using a named export (no `default` keyword):
<Trans>먼저 named export 방식을 사용해서 `Gallery.js`에서 `Profile`를 **export** 합니다. (`default` 키워드를 사용하지 않습니다):</Trans>

```js
export function Profile() {
  // ...
}
```

Then, **import** `Profile` from `Gallery.js` to `App.js` using a named import (with the curly braces):
<Trans>그 다음엔 named import 방식으로 `Gallery.js`에서 `Profile`를 `App.js` 파일로 **import** 합니다 (중괄호를 사용합니다):</Trans>

```js
import { Profile } from './Gallery.js';
```

Finally, **render** `<Profile />` from the `App` component:
<Trans>마지막으로 `<Profile />`을 `App` 컴포넌트에서 **렌더링**합니다:</Trans>

```js
export default function App() {
  return <Profile />;
}
```

Now `Gallery.js` contains two exports: a default `Gallery` export, and a named `Profile` export. `App.js` imports both of them. Try editing `<Profile />` to `<Gallery />` and back in this example:
<Trans>이제 `Gallery.js`에는 default `Gallery` export와 named `Profile` export라는 두 가지의 export가 존재합니다. `App.js`에서는 두 컴포넌트를 import 해서 사용합니다. 아래의 예제에서 `<Profile />`과 `<Gallery />`를 교차해서 사용해 보세요:</Trans>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Now you're using a mix of default and named exports:
<Trans>이제 default와 named export 방식 둘 다 사용할 수 있게 됐습니다:</Trans>

* `Gallery.js`:
  - Exports the `Profile` component as a **named export called `Profile`.**
  - Exports the `Gallery` component as a **default export.**
  <TransBlock>
    - `Profile` 컴포넌트를 `Profile`로 **named export** 합니다.
    - `Gallery` 컴포넌트를 **default export** 합니다.
  </TransBlock>
* `App.js`:
  - Imports `Profile` as a **named import called `Profile`** from `Gallery.js`.
  - Imports `Gallery` as a **default import** from `Gallery.js`.
  - Exports the root `App` component as a **default export.**
  <TransBlock>
    - `Gallery.js`에서 `Profile`를 `Profile`로 **named import** 합니다.
    - `Gallery.js`에서 `Gallery`를 **default import** 합니다.
    - root `App` 컴포넌트를 **default export** 합니다.
  </TransBlock>
    
<Recap>

On this page you learned:
<Trans>이 페이지에서 배우게 된 것들입니다:</Trans>

* What a root component file is
* How to import and export a component
* When and how to use default and named imports and exports
* How to export multiple components from the same file
 
<TransBlock>
  - Root 컴포넌트란 무엇인지
  - 컴포넌트를 import 하거나 export 하는 방법
  - 언제, 어떻게 default 및 named import, default 및 named export를 사용하는지
  - 한 파일에서 여러 컴포넌트를 export 하는 방법
</TransBlock>
</Recap>



<Challenges>

#### Split the components further<Trans>컴포넌트를 더 분리해 봅시다</Trans> {/*split-the-components-further*/}

Currently, `Gallery.js` exports both `Profile` and `Gallery`, which is a bit confusing.
<Trans>현재 `Gallery.js`는 `Profile`과 `Gallery`를 모두 export하고 있으므로 약간 혼란스러울 수 있습니다.</Trans>

Move the `Profile` component to its own `Profile.js`, and then change the `App` component to render both `<Profile />` and `<Gallery />` one after another.
<Trans>`Profile.js` 파일을 생성해서 `Profile` 컴포넌트를 해당 파일로 옮기고 `App` 컴포넌트에서는 `<Profile />`과 `<Gallery />`를 각각 렌더링하도록 변경하세요.</Trans>

You may use either a default or a named export for `Profile`, but make sure that you use the corresponding import syntax in both `App.js` and `Gallery.js`! You can refer to the table from the deep dive above:
<Trans>`Profile`에 default export 또는 named export를 사용할 수 있는데,  `App.js`와 `Gallery.js` 모두에서 그에 대응하는 import 구문을 사용해야 한다는 점을 주의하세요! Deep Dive의 표(아래)를 참고하세요:</Trans>

| Syntax           | Export statement                           | Import statement                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './button.js';` |

<Hint>

Don't forget to import your components where they are called. Doesn't `Gallery` use `Profile`, too?
<Trans>컴포넌트가 호출되는 곳에서 컴포넌트를 가져오는 것을 잊지 마세요. `Gallery`도 `Profile`을 사용하지 않나요?</Trans>

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// Move me to Profile.js!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

After you get it working with one kind of exports, make it work with the other kind.
<Trans>export 방식 중 하나로 동작하는 데에 성공했다면, 다른 방식으로도 바꿔보세요.</Trans>

<Solution>

This is the solution with named exports:
<Trans>named export를 사용한 풀이입니다:</Trans>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

This is the solution with default exports:
<Trans>default export를 사용한 풀이입니다:</Trans>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
