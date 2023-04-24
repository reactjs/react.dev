---
title: useImperativeHandle
translators: [강승훈, 고석영]
---

<Intro>

`useImperativeHandle` is a React Hook that lets you customize the handle exposed as a [ref.](/learn/manipulating-the-dom-with-refs)
<Trans>`useImperativeHandle`은 [ref](/learn/manipulating-the-dom-with-refs)로 노출되는 핸들을 사용자가 직접 정의할 수 있게 해주는 React 훅입니다.</Trans>

```js
useImperativeHandle(ref, createHandle, dependencies?)
```

</Intro>

<InlineToc />

---

## Reference<Trans>참조</Trans> {/*reference*/}

### `useImperativeHandle(ref, createHandle, dependencies?)` {/*useimperativehandle*/}

Call `useImperativeHandle` at the top level of your component to customize the ref handle it exposes:
<Trans>컴포넌트의 최상위 레벨에서 `useImperativeHandle`을 호출하여 노출할 ref 핸들을 사용자가 직접 정의할 수 있습니다:</Trans>

```js
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
      // ... 메서드는 여기에 작성합니다 ...
    };
  }, []);
  // ...
```

[See more examples below.](#usage)
<Trans>[아래에서 더 많은 예시를 확인하세요.](#usage)</Trans>

#### Parameters<Trans>매개변수</Trans> {/*parameters*/}

* `ref`: The `ref` you received as the second argument from the [`forwardRef` render function.](/reference/react/forwardRef#render-function)
<Trans>`ref`: [`forwardRef` 렌더 함수](/reference/react/forwardRef#render-function)에서 두 번째 인자로 받은 `ref`입니다.</Trans>

* `createHandle`: A function that takes no arguments and returns the ref handle you want to expose. That ref handle can have any type. Usually, you will return an object with the methods you want to expose.
<Trans>`createHandle`: 인자가 없고 노출하려는 ref 핸들을 반환하는 함수입니다. 해당 ref 핸들은 어떠한 유형이든 될 수 있습니다. 일반적으로 노출하려는 메서드가 있는 객체를 반환합니다.</Trans>

* **optional** `dependencies`: The list of all reactive values referenced inside of the `createHandle` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. If a re-render resulted in a change to some dependency, or if you omitted this argument, your `createHandle` function will re-execute, and the newly created handle will be assigned to the ref.
<Trans>**(선택적)** `dependencies`: `createHandle` 코드 내에서 참조하는 모든 반응형 값을 나열한 목록입니다. 반응형 값은 props, state 및 컴포넌트 내에서 직접 선언한 모든 변수와 함수를 포함합니다. [React에 대한 린터를 구성한 경우](/learn/editor-setup#linting) 모든 반응형 값이 올바르게 의존성으로 지정되었는지 확인합니다. 의존성 목록은 항상 일정한 수의 항목을 가지고 `[dep1, dep2, dep3]`와 같이 인라인으로 작성되어야 합니다. React는 각 의존성을 [`Object.is`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is) 비교를 사용하여 이전 값과 비교합니다. 리렌더링으로 인해 일부 의존성이 변경되거나 이 인수를 생략한 경우, `createHandle` 함수가 다시 실행되고 새로 생성된 핸들이 ref에 할당됩니다.</Trans>

#### Returns<Trans>반환값</Trans> {/*returns*/}

`useImperativeHandle` returns `undefined`.
<Trans>`useImperativeHandle은` `undefined`를 반환합니다.</Trans>

---

## Usage<Trans>사용법</Trans> {/*usage*/}

### Exposing a custom ref handle to the parent component <Trans>부모 컴포넌트에 커스텀 ref 핸들 노출</Trans> {/*exposing-a-custom-ref-handle-to-the-parent-component*/}

By default, components don't expose their DOM nodes to parent components. For example, if you want the parent component of `MyInput` to [have access](/learn/manipulating-the-dom-with-refs) to the `<input>` DOM node, you have to opt in with [`forwardRef`:](/reference/react/forwardRef)
<Trans>기본적으로 컴포넌트는 자식 컴포넌트의 DOM 노드를 부모 컴포넌트에 노출하지 않습니다. 예를 들어 `MyInput`의 부모 컴포넌트가 `<input>` DOM 노드에 [접근하려면](/learn/manipulating-the-dom-with-refs) [`forwardRef`](/reference/react/forwardRef)를 사용하여 선택적으로 참조에 포함해야 합니다:</Trans>

```js {4}
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input {...props} ref={ref} />;
});
```

With the code above, [a ref to `MyInput` will receive the `<input>` DOM node.](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component) However, you can expose a custom value instead. To customize the exposed handle, call `useImperativeHandle` at the top level of your component:
<Trans>위의 코드에서 [`MyInput`에 대한 ref는 `<input>` DOM 노드를 받게 됩니다.](/reference/react/forwardRef#exposing-a-dom-node-to-the-parent-component) 그러나 대신 사용자 지정 값을 노출할 수 있습니다. 노출된 핸들을 사용자 정의하려면 컴포넌트의 최상위 레벨에서 `useImperativeHandle`을 호출하세요.</Trans>

```js {4-8}
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
      // ... 메소드를 여기에 입력하세요 ...
    };
  }, []);

  return <input {...props} />;
});
```

Note that in the code above, the `ref` is no longer forwarded to the `<input>`.
<Trans>위의 코드에서 `<input>`에 대한 ref는 더 이상 전달되지 않습니다.</Trans>

For example, suppose you don't want to expose the entire `<input>` DOM node, but you want to expose two of its methods: `focus` and `scrollIntoView`. To do this, keep the real browser DOM in a separate ref. Then use `useImperativeHandle` to expose a handle with only the methods that you want the parent component to call:
<Trans>예를 들어 전체 `<input>` DOM 노드를 노출하지 않고 `focus`와 `scrollIntoView`의 두 메서드만을 노출하고 싶다고 가정해 봅시다. 그러기 위해서는 실제 브라우저 DOM을 별도의 ref에 유지해야 합니다. 그리고 `useImperativeHandle`을 사용하여 부모 컴포넌트에서 호출할 메서드만 있는 핸들을 노출합니다:</Trans>

```js {7-14}
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});
```

Now, if the parent component gets a ref to `MyInput`, it will be able to call the `focus` and `scrollIntoView` methods on it. However, it will not have full access to the underlying `<input>` DOM node.
<Trans>이제 부모 컴포넌트가 `MyInput`에 대한 ref를 가져오면 `focus` 및 `scrollIntoView` 메서드를 호출할 수 있습니다. 그러나 기본 `<input>` DOM 노드의 전체 액세스 권한은 없습니다.</Trans>

<Sandpack>

```js
import { useRef } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const ref = useRef(null);

  function handleClick() {
    ref.current.focus();
    // This won't work because the DOM node isn't exposed:
    // 이 작업은 DOM 노드가 노출되지 않으므로 작동하지 않습니다.
    // ref.current.style.opacity = 0.5;
  }

  return (
    <form>
      <MyInput label="Enter your name:" ref={ref} />
      <button type="button" onClick={handleClick}>
        Edit
      </button>
    </form>
  );
}
```

```js MyInput.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current.focus();
      },
      scrollIntoView() {
        inputRef.current.scrollIntoView();
      },
    };
  }, []);

  return <input {...props} ref={inputRef} />;
});

export default MyInput;
```

```css
input {
  margin: 5px;
}
```

</Sandpack>

---

### Exposing your own imperative methods <Trans>사용자 정의 명령 노출</Trans> {/*exposing-your-own-imperative-methods*/}

The methods you expose via an imperative handle don't have to match the DOM methods exactly. For example, this `Post` component exposes a `scrollAndFocusAddComment` method via an imperative handle. This lets the parent `Page` scroll the list of comments *and* focus the input field when you click the button:
<Trans>imperative handle을 통해 노출하는 메서드는 DOM 메서드와 정확하게 일치할 필요가 없습니다. 예를 들어 이 `Post` 컴포넌트는 명령 핸들을 통해 `ScrollAndFocusAddComment` 메서드를 표시합니다. 이렇게 하면 부모 `Page`에서 버튼을 클릭할 때 댓글 목록을 스크롤하고 입력 필드에 초점을 맞출 수 있습니다.</Trans>

<Sandpack>

```js
import { useRef } from 'react';
import Post from './Post.js';

export default function Page() {
  const postRef = useRef(null);

  function handleClick() {
    postRef.current.scrollAndFocusAddComment();
  }

  return (
    <>
      <button onClick={handleClick}>
        Write a comment
      </button>
      <Post ref={postRef} />
    </>
  );
}
```

```js Post.js
import { forwardRef, useRef, useImperativeHandle } from 'react';
import CommentList from './CommentList.js';
import AddComment from './AddComment.js';

const Post = forwardRef((props, ref) => {
  const commentsRef = useRef(null);
  const addCommentRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollAndFocusAddComment() {
        commentsRef.current.scrollToBottom();
        addCommentRef.current.focus();
      }
    };
  }, []);

  return (
    <>
      <article>
        <p>Welcome to my blog!</p>
      </article>
      <CommentList ref={commentsRef} />
      <AddComment ref={addCommentRef} />
    </>
  );
});

export default Post;
```


```js CommentList.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const CommentList = forwardRef(function CommentList(props, ref) {
  const divRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToBottom() {
        const node = divRef.current;
        node.scrollTop = node.scrollHeight;
      }
    };
  }, []);

  let comments = [];
  for (let i = 0; i < 50; i++) {
    comments.push(<p key={i}>Comment #{i}</p>);
  }

  return (
    <div className="CommentList" ref={divRef}>
      {comments}
    </div>
  );
});

export default CommentList;
```

```js AddComment.js
import { forwardRef, useRef, useImperativeHandle } from 'react';

const AddComment = forwardRef(function AddComment(props, ref) {
  return <input placeholder="Add comment..." ref={ref} />;
});

export default AddComment;
```

```css
.CommentList {
  height: 100px;
  overflow: scroll;
  border: 1px solid black;
  margin-top: 20px;
  margin-bottom: 20px;
}
```

</Sandpack>

<Pitfall>

**Do not overuse refs.** You should only use refs for *imperative* behaviors that you can't express as props: for example, scrolling to a node, focusing a node, triggering an animation, selecting text, and so on.
<Trans>**ref를 과도하게 사용하지 마세요.** ref는 props로 표현할 수 없는 필수적인 행동에만 사용해야 합니다. 예를 들어 특정 노드로 스크롤하기, 노드에 초점 맞추기, 애니메이션 촉발하기, 텍스트 선택하기 등이 있습니다.</Trans>

**If you can express something as a prop, you should not use a ref.** For example, instead of exposing an imperative handle like `{ open, close }` from a `Modal` component, it is better to take `isOpen` as a prop like `<Modal isOpen={isOpen} />`. [Effects](/learn/synchronizing-with-effects) can help you expose imperative behaviors via props.
<Trans>**prop으로 표현할 수 있는 것은 ref를 사용하지 마세요.** 예를 들어 `Modal` 컴포넌트에서 `{open, close}`와 같은 imperative handle을 노출하는 대신 `<Modal isOpen={isOpen} />`과 같은 `isOpen` prop을 사용하는 것이 더 좋습니다. [Effect](/learn/synchronizing-with-effects)를 사용하면 prop을 통해 명령형 동작(imperative behavior)을 노출할 수 있습니다.</Trans>

</Pitfall>
