---
title: <Fragment> (<>...</>)
translators: []
---

<Intro>

`<Fragment>`, often used via `<>...</>` syntax, lets you group elements without a wrapper node.
<Trans>`<>…</>` 구문을 통해 자주 사용되는 `<Fragment>` 을 사용하면 감싸는 노드 없이 요소를 그룹화 할 수 있습니다.</Trans>

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `<Fragment>` {/*fragment*/}

Wrap elements in `<Fragment>` to group them together in situations where you need a single element. Grouping elements in `Fragment` has no effect on the resulting DOM; it is the same as if the elements were not grouped. The empty JSX tag `<></>` is shorthand for `<Fragment></Fragment>` in most cases.
<Trans>단일 요소가 필요한 상황에서 요소들을 함께 그룹화하기 위해 요소를 `<Fragment>`안에 요소를 감쌉니다. `<Fragment>` 안에 그룹화 된 요소는 결과 DOM에 영향을 주지 않습니다. 요소가 그룹화 되지 않은 경우와 동일합니다. 빈 JSX 태그 `<></>`는 대부분의 경우 `<Fragment>`의 약칭입니다.</Trans>

#### Props {/*props*/}

- **optional** `key`: Fragments declared with the explicit `<Fragment>` syntax may have [keys.](/learn/rendering-lists#keeping-list-items-in-order-with-key)
<Trans>선택적 `key`:  `<Fragment>` 구문으로 명시적으로 선언된 Fragment에는 [키](/learn/rendering-lists#keeping-list-items-in-order-with-key)가 있을 수 있습니다.</Trans>

#### Caveats<Trans>주의사항</Trans> {/*caveats*/}

- If you want to pass `key` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment key={yourKey}>...</Fragment>`.
<Trans>Fragment에 key를 전달하려는 경우 `<>…</>`구문을 사용할 수 없습니다. `'react'` 에서 `Fragment`를 명시적으로 불러오고 `<Fragment key={yourKey}>...</Fragment>`를 렌더링해야합니다.</Trans>

- React does not [reset state](/learn/preserving-and-resetting-state) when you go from rendering `<><Child /></>` to `[<Child />]` or back, or when you go from rendering `<><Child /></>` to `<Child />` and back. This only works a single level deep: for example, going from `<><><Child /></></>` to `<Child />` resets the state. See the precise semantics [here.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)
<Trans>React는 `<><Child /></>`에서 `[<Child />]` 로 왔다 갔다 할 때나 그 반대의 경우에도 [state를 재설정](/learn/preserving-and-resetting-state) 하지 않습니다. 이것은 단일 레벨 깊이에서만 동작합니다. 예를 들어 `<><><Child /></></>`에서 `[<Child />]` 로 갈 때는 state를 재설정합니다. [여기](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)에서 정확한 의미를 확인하세요.</Trans>


---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Returning multiple elements <Trans>여러 요소 반환하기</Trans> {/*returning-multiple-elements*/}

Use `Fragment`, or the equivalent `<>...</>` syntax, to group multiple elements together. You can use it to put multiple elements in any place where a single element can go. For example, a component can only return one element, but by using a Fragment you can group multiple elements together and then return them as a group:
<Trans>`Fragment`나 이와 동등한 구문 `<>…</>`를 사용하여 여러 요소를 그룹화 합니다. 단일 요소가 들어갈 수 있는 모든 위치에 여러 요소를 배치하는데 사용할 수 있습니다. 예를 들어 컴포넌트는 오직 하나의 요소를 반환할 수 있지만 Fragment를 사용해 여러 요소를 그룹화한 다음 그룹으로 반환할 수 있습니다.</Trans>

```js {3,6}
function Post() {
  return (
    <>
      <PostTitle />
      <PostBody />
    </>
  );
}
```

Fragments are useful because grouping elements with a Fragment has no effect on layout or styles, unlike if you wrapped the elements in another container like a DOM element. If you inspect this example with the browser tools, you'll see that all `<h1>` and `<p>` DOM nodes appear as siblings without wrappers around them:
<Trans>Fragment로 요소를 그룹화하는 것은 DOM 요소와 같은 다른 컨테이너에 요소를 감싸는 경우와 달리 레이아웃이나 스타일에 영향을 주지 않기 때문에 유용합니다. 브라우저 도구로 이 예시를 검사하면 모든 `<h1>`과 `<p>` DOM 노드가 감싸는 노드 없이 형제로 표시되는 것을 볼 수 있습니다.</Trans>

<Sandpack>

```js
export default function Blog() {
  return (
    <>
      <Post title="An update" body="It's been a while since I posted..." />
      <Post title="My new blog" body="I am starting a new blog!" />
    </>
  )
}

function Post({ title, body }) {
  return (
    <>
      <PostTitle title={title} />
      <PostBody body={body} />
    </>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>

<DeepDive>

#### How to write a Fragment without the special syntax? <Trans>특별한 구문 없이 Fragment를 작성하는 방법은 무엇입니까?</Trans> {/*how-to-write-a-fragment-without-the-special-syntax*/}

The example above is equivalent to importing `Fragment` from React:
<Trans>위의 예제는 `Fragment`를 React에서 가져오는 것과 동일합니다.</Trans>

```js {1,5,8}
import { Fragment } from 'react';

function Post() {
  return (
    <Fragment>
      <PostTitle />
      <PostBody />
    </Fragment>
  );
}
```

Usually you won't need this unless you need to [pass a `key` to your `Fragment`.](#rendering-a-list-of-fragments)
<Trans>[`Fragment`에 `key`를 전달해야하는 경우](#rendering-a-list-of-fragments)가 아니면 일반적으로 이것은 필요하지 않습니다.</Trans>

</DeepDive>

---

### Assigning multiple elements to a variable <Trans>변수에 여러 요소를 할당하기</Trans> {/*assigning-multiple-elements-to-a-variable*/}

Like any other element, you can assign Fragment elements to variables, pass them as props, and so on:
<Trans>다른 요소와 마찬가지로, Fragment요소를 변수에 할당하고 props로 전달하는 등의 작업을 수행합니다.</Trans>

```js
function CloseDialog() {
  const buttons = (
    <>
      <OKButton />
      <CancelButton />
    </>
  );
  return (
    <AlertDialog buttons={buttons}>
      Are you sure you want to leave this page?
    </AlertDialog>
  );
}
```

---

### Grouping elements with text <Trans>텍스트로 요소 그룹화하기</Trans> {/*grouping-elements-with-text*/}

You can use `Fragment` to group text together with components:
<Trans>`Fragment`를 컴포넌트와 함께 텍스트를 그룹화하는데 사용할 수 있습니다.</Trans>

```js
function DateRangePicker({ start, end }) {
  return (
    <>
      From
      <DatePicker date={start} />
      to
      <DatePicker date={end} />
    </>
  );
}
```

---

### Rendering a list of Fragments <Trans>Fragment 목록 렌더링하기</Trans> {/*rendering-a-list-of-fragments*/}

Here's a situation where you need to write `Fragment` explicitly instead of using the `<></>` syntax. When you [render multiple elements in a loop](/learn/rendering-lists), you need to assign a `key` to each element. If the elements within the loop are Fragments, you need to use the normal JSX element syntax in order to provide the `key` attribute:
<Trans>`<></>`구문을 이용하는 것 대신에 `Fragment`를 명시적으로 작성해야하는 상황입니다. [반복문에서 여러 요소를 렌더링](/learn/rendering-lists)하는 경우 각 요소에 `key`를 할당해야합니다. 반복문 안에 요소들이 Fragment라면 `key` 속성을 제공하기 위해 일반적인 JSX요소 구문을 사용해야합니다.</Trans>

```js {3,6}
function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}
```

You can inspect the DOM to verify that there are no wrapper elements around the Fragment children:
<Trans>DOM을 검사하여 Fragment 자식 주위에 감싸는 요소가 없는지 확인할 수 있습니다.</Trans>

<Sandpack>

```js
import { Fragment } from 'react';

const posts = [
  { id: 1, title: 'An update', body: "It's been a while since I posted..." },
  { id: 2, title: 'My new blog', body: 'I am starting a new blog!' }
];

export default function Blog() {
  return posts.map(post =>
    <Fragment key={post.id}>
      <PostTitle title={post.title} />
      <PostBody body={post.body} />
    </Fragment>
  );
}

function PostTitle({ title }) {
  return <h1>{title}</h1>
}

function PostBody({ body }) {
  return (
    <article>
      <p>{body}</p>
    </article>
  );
}
```

</Sandpack>
