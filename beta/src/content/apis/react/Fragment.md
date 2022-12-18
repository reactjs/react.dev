---
title: <Fragment> (<>...</>)
---

<Intro>

`<Fragment>`, often used via `<>...</>` syntax, lets you group elements without a wrapper node.

```js
<>
  <OneChild />
  <AnotherChild />
</>
```

</Intro>

<InlineToc />

---

## Usage {/*usage*/}

### Returning multiple elements {/*returning-multiple-elements*/}

Use `Fragment`, or the equivalent `<>...</>` syntax, to group multiple elements together. You can use it to put multiple elements in any place where a single element can go. For example, a component can only return one element, but by using a Fragment you can group multiple elements together and then return them as a group:

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

Fragments are useful because grouping elements with a Fragment has no effect on layout or styles, unlike if you wrapped the elements in some other container such as a DOM element. If you inspect this example with the browser tools, you'll see that all `<h1>` and `<p>` DOM nodes appear as siblings without wrappers around them:

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

#### How to write a Fragment without the special syntax? {/*how-to-write-a-fragment-without-the-special-syntax*/}

The example above is equivalent to importing `Fragment` from React:

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

</DeepDive>

---

### Assigning multiple elements to a variable {/*assigning-multiple-elements-to-a-variable*/}

Like any other element, you can assign Fragment elements to variables, pass them as props, and so on:

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

### Grouping elements with text {/*grouping-elements-with-text*/}

You can use `Fragment` to group text together with components:

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

### Rendering a list of Fragments {/*rendering-a-list-of-fragments*/}

Here's a situation where you need to write `Fragment` explicitly instead of using the `<></>` syntax. When you [render multiple elements in a loop](/learn/rendering-lists), you need to assign a `key` to each element. If the elements within the loop are Fragments, you need to use the normal JSX element syntax in order to provide the `key` attribute:

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

---

## Reference {/*reference*/}

### `<Fragment>` {/*fragment*/}

Wrap elements in `<Fragment>` to group them together in situations where you need a single element. Grouping elements in `Fragment` has no effect on the resulting DOM; it is the same as if the elements were not grouped. The empty JSX tag `<></>` is shorthand for `<Fragment></Fragment>` in most cases.

#### Props {/*props*/}

- **optional** `key`: Fragments declared with the explicit `<Fragment>` syntax may have [keys.](https://beta.reactjs.org/learn/rendering-lists#keeping-list-items-in-order-with-key)

#### Caveats {/*caveats*/}

- If you want to pass `key` to a Fragment, you can't use the `<>...</>` syntax. You have to explicitly import `Fragment` from `'react'` and render `<Fragment key={yourKey}>...</Fragment>`.

- React does not [reset state](/learn/preserving-and-resetting-state) when you go from rendering `<><Child /></>` to `[<Child />]` or back, or when you go from rendering `<><Child /></>` to `<Child />` and back. This only works a single level deep: for example, going from `<><><Child /></></>` to `<Child />` resets the state. See the precise semantics [here.](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)


