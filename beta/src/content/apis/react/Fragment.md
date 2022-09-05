---
title: React.Fragment
---

<Intro>

The `React.Fragment` component, which can be used with a special `<></>` syntax, lets you use multiple elements in place of one, without wrapping them in any other container element:

```
function Component() {
  return (
    <>
      <OneChild />
      <AnotherChild />
    </>
  );
}
```

`Fragment` is useful because grouping elements with `Fragment` has no effect on layout or styles, unlike if you wrapped the elements in some other container such as a DOM element.

</Intro>

- [Usage](#usage)
  - [Returning multiple elements](#returning-multiple-elements)
  - [Assigning multiple elements to a variable](#assigning-multiple-elements-to-a-variable)
  - [Grouping elements with text](#grouping-elements-with-text)
  - [Rendering a list of Fragments](#rendering-a-list-of-fragments)
- [Reference](#reference)
  - [React.Fragment](#react-fragment) 

---

## Usage {/*usage*/}

### Returning multiple elements {/*returning-multiple-elements*/}

Use `Fragment` to group multiple elements together. You can use it to put multiple elements in any place where a single element can go. For example, a component can only return one element, but by using `Fragment` you can group multiple elements together and then return them as a group:

```
function Notification() {
  return (
    <>
      <NotificationTitle />
      <NotificationBody />
    </>
  );
}
```

You usually use `Fragment` with a special syntax, the empty JSX tag `<></>`, that is equivalent to writing `<React.Fragment></React.Fragment>`.

### Assigning multiple elements to a variable {/*assigning-multiple-elements-to-a-variable*/}

Like any other element, you can assign `Fragment` elements to variables, pass them as props, and so on:

```
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

### Grouping elements with text {/*grouping-elements-with-text*/}

You can use `Fragment` to group text together with components:

```
function DateRangePicker({start, end}) {
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

### Rendering a list of Fragments {/*rendering-a-list-of-fragments*/}

Here's a situation where you need to write `React.Fragment` explicitly instead of using the `<></>` syntax: When you [render multiple elements in a loop](/learn/rendering-lists), you need to assign a `key` to each element. If the elements within the loop are Fragments, you need to use the normal JSX element syntax in order to provide the `key` attribute:

```
function BlogPosts(posts) {
  return posts.map(() =>
    <React.Fragment key={post.id}>
      <Heading>{post.title}</Heading>
      <BlogPostBody post={post} />
    </React.Fragment>
  );
}
```

## Reference {/*reference*/}

### `React.Fragment` {/*react-fragment*/}

Wrap elements in `<React.Fragment>` to group them together in situations where you need a single element. Grouping elements in `Fragment` has no effect on the resulting DOM; it is the same as if the elements were not grouped. The empty JSX tag `<></>` is shorthand for `<React.Fragment></React.Fragment>` in most cases.

#### Props {/*reference-props*/}

- **optional** `key`: Fragments declared with the explicit `<React.Fragment>` syntax may have [keys](https://beta.reactjs.org/learn/rendering-lists#keeping-list-items-in-order-with-key).
