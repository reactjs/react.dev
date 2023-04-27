---
title: Updating Arrays in State
translatedTitle: 배열 state 업데이트
translators: [고석영, 전시윤, 김아영, 이승효, 이나령, 정재남]
---

<iframe 
  style={{aspectRatio: 1.7778, width: '100%'}} 
  src="https://www.youtube.com/embed/playlist?list=PLjQV3hketAJkh6BEl0n4PDS_2fBd0cS9v&index=21"
  title="YouTube video player" 
  frameborder="0" 
/>

<Intro>

Arrays are mutable in JavaScript, but you should treat them as immutable when you store them in state. Just like with objects, when you want to update an array stored in state, you need to create a new one (or make a copy of an existing one), and then set state to use the new array.
<Trans>JavaScript에서 배열은 변경 가능하지만 state에 저장할 때는 변경이 불가능한 것으로 취급해야합니다. 객체와 마찬가지로, state에 저장된 배열을 업데이트하려면, 새로운 배열을 만들고(또는 기존 배열을 복사본을 만듦) 새 배열을 사용하도록 state를 설정해야합니다.</Trans>

</Intro>

<YouWillLearn>

- How to add, remove, or change items in an array in React state
- How to update an object inside of an array
- How to make array copying less repetitive with Immer

<TransBlock>
  - React state 안의 배열 항목을 추가, 제거 또는 변경하는 방법
  - 배열 내부의 객체를 업데이트 하는 방법
  - Immer로 덜 반복적으로 배열을 복사하는 방법
</TransBlock>
</YouWillLearn>

## Updating arrays without mutation<Trans>변이 없이 배열 업데이트하기</Trans> {/*updating-arrays-without-mutation*/}

In JavaScript, arrays are just another kind of object. [Like with objects](/learn/updating-objects-in-state), **you should treat arrays in React state as read-only.** This means that you shouldn't reassign items inside an array like `arr[0] = 'bird'`, and you also shouldn't use methods that mutate the array, such as `push()` and `pop()`.
<Trans>JavaScript에서 배열은 객체의 또 다른 종류일 뿐입니다. [객체와 마찬가지로](/learn/updating-objects-in-state), **React state의 배열은 읽기 전용으로 취급해야 합니다.** 즉, `arr[0] = 'bird'`와 같이 배열 내부의 항목을 재할당해서는 안 되며, `push()` 및 `pop()`과 같이 배열을 변이하는 메서드도 사용해서는 안 됩니다.</Trans>

Instead, every time you want to update an array, you'll want to pass a *new* array to your state setting function. To do that, you can create a new array from the original array in your state by calling its non-mutating methods like `filter()` and `map()`. Then you can set your state to the resulting new array.
<Trans>대신 배열을 업데이트할 때마다 state 설정 함수에 새 배열을 전달하고 싶을 것입니다. 그렇게 하려면 state의 원래 배열에서 `filter()` 및 `map()`과 같은 비변이 메서드를 호출하여 새 배열을 만들면 됩니다. 그렇게 만들어진 새 배열을 state로 설정할 수 있습니다.</Trans>

Here is a reference table of common array operations. When dealing with arrays inside React state, you will need to avoid the methods in the left column, and instead prefer the methods in the right column:
<Trans>다음은 일반적인 배열 연산에 대한 참조 표입니다. React state 내에서 배열을 다룰 때는 왼쪽 열의 메서드를 피하고 대신 오른쪽 열의 메서드를 선호해야 합니다:</Trans>

|           | avoid (mutates the array)<br/><Trans>비추천 (배열 직접 변이)</Trans> | prefer (returns a new array)<br/><Trans>추천 (새 배열 반환)</Trans> |
| :-------- | :---------------------------------- | :------------------------------------------------------------------ |
| adding <br/><Trans>추가</Trans>    | `push`, `unshift`                   | `concat`, `[...arr]` spread syntax ([example](#adding-to-an-array)) |
| removing <br/><Trans>삭제</Trans>  | `pop`, `shift`, `splice`            | `filter`, `slice` ([example](#removing-from-an-array))              |
| replacing <br/><Trans>교체</Trans> | `splice`, `arr[i] = ...` assignment | `map` ([example](#replacing-items-in-an-array))                     |
| sorting <br/><Trans>정렬</Trans>   | `reverse`, `sort`                   | copy the array first ([example](#making-other-changes-to-an-array))<br/><Trans>배열을 복사한 다음 처리</Trans> |

Alternatively, you can [use Immer](#write-concise-update-logic-with-immer) which lets you use methods from both columns.
<Trans>또는 두 열의 메서드를 모두 사용할 수 있는 [Immer를 사용](#write-concise-update-logic-with-immer)할 수도 있습니다.</Trans>

<Pitfall>

Unfortunately, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) and [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) are named similarly but are very different:
<Trans>안타깝게도 [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)와 [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)는 이름이 비슷하지만 매우 다릅니다:</Trans>

* `slice` lets you copy an array or a part of it.
* `splice` **mutates** the array (to insert or delete items).

<TransBlock>
- `slice`는 배열 또는 배열의 일부를 복사할 수 있습니다.
- `splice`는 배열을 항목을 삽입하거나 삭제하기 위해 **변이** 합니다.
</TransBlock>

In React, you will be using `slice` (no `p`!) a lot more often because you don't want to mutate objects or arrays in state. [Updating Objects](/learn/updating-objects-in-state) explains what mutation is and why it's not recommended for state.
<Trans>React에서는 state의 객체나 배열을 변이하고 싶지 않기 때문에 `slice`(`p` 없음!)를 훨씬 더 자주 사용하게 될 것입니다. [객체 state 업데이트](/learn/updating-objects-in-state)에서 변이가 무엇이고 왜 state에 권장되지 않는지에 대해 설명합니다.</Trans>

</Pitfall>

### Adding to an array<Trans>배열에 추가하기</Trans> {/*adding-to-an-array*/}

`push()` will mutate an array, which you don't want:
<Trans>`push()`는 배열을 변이합니다 (원하지 않는 방식):</Trans>

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Instead, create a *new* array which contains the existing items *and* a new item at the end. There are multiple ways to do this, but the easiest one is to use the `...` [array spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals) syntax:
<Trans>대신 기존 항목과 끝에 새 항목을 포함하는 *새 배열*을 만드세요 이 작업을 수행하는 방법은 여러 가지가 있지만 가장 쉬운 방법은 `...` [배열 전개 구문](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax)을 사용하는 것입니다:</Trans>

```js
setArtists( // Replace the state
  [ // with a new array
    ...artists, // that contains all the old items
    { id: nextId++, name: name } // and one new item at the end
  ]
);
```

Now it works correctly:
<Trans>이제 올바르게 작동합니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Add</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

The array spread syntax also lets you prepend an item by placing it *before* the original `...artists`:
<Trans>배열 전개 구문을 사용하면 항목을 원본 배열 `...artists` *앞*에 배치하여 항목을 추가할 수도 있습니다:</Trans>

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Put old items at the end
]);
```

In this way, spread can do the job of both `push()` by adding to the end of an array and `unshift()` by adding to the beginning of an array. Try it in the sandbox above!
<Trans>이런 식으로 전개 구문은 배열의 끝에 추가하는 `push()`와 배열의 시작 부분에 추가하는 `unshift()`의 기능을 모두 수행할 수 있습니다. 위의 샌드박스에서 사용해 보세요!</Trans>

### Removing from an array<Trans>배열에서 제거하기</Trans> {/*removing-from-an-array*/}

The easiest way to remove an item from an array is to *filter it out*. In other words, you will produce a new array that will not contain that item. To do this, use the `filter` method, for example:
<Trans>배열에서 항목을 제거하는 가장 쉬운 방법은 *필터링*하는 것입니다. 즉, 해당 항목을 포함하지 않는 새 배열을 생성합니다. 이렇게 하려면 예를 들어 `filter` 메서드를 사용할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Click the "Delete" button a few times, and look at its click handler.
<Trans>'삭제' 버튼을 몇 번 클릭한 뒤, 클릭 핸들러를 확인합니다.</Trans>

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Here, `artists.filter(a => a.id !== artist.id)` means "create an array that consists of those `artists` whose IDs are different from `artist.id`". In other words, each artist's "Delete" button will filter _that_ artist out of the array, and then request a re-render with the resulting array. Note that `filter` does not modify the original array.
<Trans>여기서 `artists.filter(a => a.id !== artist.id)`구문은 `artist.id`와 다른 ID를 가진 `artists`로 구성된 배열을 생성한다"는 의미입니다. 즉, 각 아티스트의 '삭제' 버튼은 배열에서 해당 아티스트를 *필터링*한 다음 결과 배열로 다시 렌더링하도록 요청합니다. `filter`는 원래 배열을 수정하지 않는다는 점에 유의하세요.</Trans>

### Transforming an array<Trans>배열 변경하기</Trans> {/*transforming-an-array*/}

If you want to change some or all items of the array, you can use `map()` to create a **new** array. The function you will pass to `map` can decide what to do with each item, based on its data or its index (or both).
<Trans>배열의 일부 또는 모든 항목을 변경하려면 `map()`을 사용하여 **새로운** 배열을 만들 수 있습니다. `map`에 전달할 함수는 데이터 또는 인덱스(또는 둘 다)에 따라 각 항목에 대해 수행할 작업을 결정할 수 있습니다.</Trans>

In this example, an array holds coordinates of two circles and a square. When you press the button, it moves only the circles down by 50 pixels. It does this by producing a new array of data using `map()`:
<Trans>이 예제에서 배열은 두 개의 원과 하나의 정사각형 좌표를 포함합니다. 버튼을 누르면 원만 50픽셀 아래로 이동합니다. 이 과은 `map()`을 사용하여 새로운 데이터 배열을 생성하여 수행됩니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // No change
        return shape;
      } else {
        // Return a new circle 50px below
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Re-render with the new array
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Move circles down!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Replacing items in an array<Trans>배열에서 항목 교체하기</Trans> {/*replacing-items-in-an-array*/}

It is particularly common to want to replace one or more items in an array. Assignments like `arr[0] = 'bird'` are mutating the original array, so instead you'll want to use `map` for this as well.
<Trans>배열에서 하나 이상의 항목을 바꾸고 싶은 경우가 특히 흔합니다. `ar[0] = 'bird'`와 같은 할당은 원래 배열을 변이하는 것이므로 이 경우에도 `map`을 사용하는 것이 좋습니다.</Trans>

To replace an item, create a new array with `map`. Inside your `map` call, you will receive the item index as the second argument. Use it to decide whether to return the original item (the first argument) or something else:
<Trans>항목을 바꾸려면 `map`으로 새 배열을 만듭니다. `map` 호출 내에서 두 번째 인수로 항목의 인덱스를 받게 됩니다. 이를 사용하여 원래 항목(첫 번째 인수)을 반환할지 아니면 다른 것을 반환할지 결정할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Increment the clicked counter
        return c + 1;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Inserting into an array<Trans>배열에 삽입하기</Trans> {/*inserting-into-an-array*/}

Sometimes, you may want to insert an item at a particular position that's neither at the beginning nor at the end. To do this, you can use the `...` array spread syntax together with the `slice()` method. The `slice()` method lets you cut a "slice" of the array. To insert an item, you will create an array that spreads the slice _before_ the insertion point, then the new item, and then the rest of the original array.
<Trans>때로는 시작도 끝도 아닌 특정 위치에 항목을 삽입하고 싶을 때가 있습니다. 이를 위해 `...` 배열 전개 구문과 `slice()` 메서드를 함께 사용할 수 있습니다. `slice()` 메서드를 사용하면 배열의 "조각"을 잘라낼 수 있습니다. 항목을 삽입하려면 삽입 지점 *앞에* slice를 spread한 다음 새 항목과 나머지 원래 배열을 펼치는 배열을 만듭니다.</Trans>

In this example, the Insert button always inserts at the index `1`:
<Trans>이 예에서 삽입 버튼은 항상 인덱스 `1`에 삽입됩니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Could be any index
    const nextArtists = [
      // Items before the insertion point:
      ...artists.slice(0, insertAt),
      // New item:
      { id: nextId++, name: name },
      // Items after the insertion point:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>Inspiring sculptors:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Insert
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Making other changes to an array<Trans>배열에 다른 변경 사항 적용하기 </Trans> {/*making-other-changes-to-an-array*/}

There are some things you can't do with the spread syntax and non-mutating methods like `map()` and `filter()` alone. For example, you may want to reverse or sort an array. The JavaScript `reverse()` and `sort()` methods are mutating the original array, so you can't use them directly.
<Trans>전개 구문과 `map()` 및 `filter()`와 같은 비변이 메서드만으로는 할 수 없는 일이 몇 가지 있습니다. 예를 들어 배열을 반전시키거나 정렬하고 싶을 수 있습니다. JavaScript `reverse()` 및 `sort()` 메서드는 원래 배열을 변이하므로 직접 사용할 수 없습니다.</Trans>

**However, you can copy the array first, and then make changes to it.**
<Trans>대신, **배열을 먼저 복사한 다음 변이하면 됩니다.**</Trans>

For example:
<Trans>예를 들어:</Trans>

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Here, you use the `[...list]` spread syntax to create a copy of the original array first. Now that you have a copy, you can use mutating methods like `nextList.reverse()` or `nextList.sort()`, or even assign individual items with `nextList[0] = "something"`.
<Trans>여기서는 `[...list]` 전개 구문을 사용하여 먼저 원본 배열의 복사본을 만듭니다. 이제 복사본이 생겼으므로 `nextList.reverse()` 또는 `nextList.sort()`와 같은 변이 메서드를 사용하거나 `nextList[0] = "something"`으로 개별 항목을 할당할 수도 있습니다.</Trans>

However, **even if you copy an array, you can't mutate existing items _inside_ of it directly.** This is because copying is shallow--the new array will contain the same items as the original one. So if you modify an object inside the copied array, you are mutating the existing state. For example, code like this is a problem.
<Trans>그러나 **배열을 복사하더라도 배열 내부의 기존 항목을 직접 변이할 수는 없습니다.** 이는 얕은 복사가 이루어져 새 배열에는 원래 배열과 동일한 항목이 포함되기 때문입니다. 따라서 복사된 배열 내부의 객체를 수정하면 기존 state를 변이하는 것입니다. 예를 들어 다음과 같은 코드가 문제가 됩니다.</Trans>

```js
const nextList = [...list];
nextList[0].seen = true; // Problem: mutates list[0]
setList(nextList);
```

Although `nextList` and `list` are two different arrays, **`nextList[0]` and `list[0]` point to the same object.** So by changing `nextList[0].seen`, you are also changing `list[0].seen`. This is a state mutation, which you should avoid! You can solve this issue in a similar way to [updating nested JavaScript objects](/learn/updating-objects-in-state#updating-a-nested-object)--by copying individual items you want to change instead of mutating them. Here's how.
<Trans>`nextList` 와 `list`는 서로 다른 배열이지만, `**nextList[0]**`과 `**list[0]**`은 같은 객체를 가리킵니다. 따라서 `nextList[0].seen`을 변경하면 `list[0].seen`도 변경하는 것입니다. 이것은 state를 변이하므로 피해야 합니다! [중첩된 JavaScript 객체 업데이트](/learn/updating-objects-in-state#updating-a-nested-object)와 비슷한 방법으로 이 문제를 해결할 수 있는데, 변경하려는 개별 항목을 변이하는 대신 복사하는 것입니다. 방법은 다음과 같습니다.</Trans>

## Updating objects inside arrays<Trans>배열 내부의 객체 업데이트하기</Trans> {/*updating-objects-inside-arrays*/}

Objects are not _really_ located "inside" arrays. They might appear to be "inside" in code, but each object in an array is a separate value, to which the array "points". This is why you need to be careful when changing nested fields like `list[0]`. Another person's artwork list may point to the same element of the array!
<Trans>객체는 *실제로* 배열 “내부”에 위치하지 않습니다. 코드에서는 "내부"에 있는 것처럼 보일 수 있지만 배열의 각 객체는 배열이 "가리키는" 별도의 값입니다. 그렇기 때문에 `list[0]`과 같이 중첩된 필드를 변경할 때 주의해야 합니다. 다른 사람의 작품 목록이 배열의 동일한 요소를 가리킬 수 있습니다!</Trans>

**When updating nested state, you need to create copies from the point where you want to update, and all the way up to the top level.** Let's see how this works.
<Trans>**중첩된 state를 업데이트할 때는 업데이트하려는 지점부터 최상위 수준까지 복사본을 만들어야 합니다.** 어떻게 작동하는지 살펴보겠습니다.</Trans>

In this example, two separate artwork lists have the same initial state. They are supposed to be isolated, but because of a mutation, their state is accidentally shared, and checking a box in one list affects the other list:
<Trans>다음 예에서는 두 개의 개별 작품 목록의 초기 state가 동일합니다. 두 목록은 분리되어야 하지만 변이로 인해 state가 실수로 공유되어 한 목록의 체크박스를 선택하면 다른 목록에 영향을 미칩니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

The problem is in code like this:
<Trans>문제는 다음 코드에 있습니다:</Trans>

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Problem: mutates an existing item
setMyList(myNextList);
```

Although the `myNextList` array itself is new, the *items themselves* are the same as in the original `myList` array. So changing `artwork.seen` changes the *original* artwork item. That artwork item is also in `yourList`, which causes the bug. Bugs like this can be difficult to think about, but thankfully they disappear if you avoid mutating state.
<Trans>`myNextList` 배열 자체는 새 배열이지만, *항목 자체*는 원래의`myList` 배열과 동일합니다. 따라서`artwork.seen`을 변경하면 *원본* 작품 항목이 변경됩니다. 해당 작품 항목도 `yourArtworks`에 있으므로 버그가 발생합니다. 이와 같은 버그는 생각하기 어려울 수 있지만 다행히도 state를 변이하지 않으면 사라집니다.</Trans>

**You can use `map` to substitute an old item with its updated version without mutation.**
<Trans>**`map`을 사용하여 이전 항목에 대한 변이 없이 업데이트된 버전으로 대체할 수 있습니다.**</Trans>

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Create a *new* object with changes
    return { ...artwork, seen: nextSeen };
  } else {
    // No changes
    return artwork;
  }
}));
```

Here, `...` is the object spread syntax used to [create a copy of an object.](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)
<Trans>여기서 `...`는 [객체의 복사본을 만드는 데 사용](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax)되는 객체 전개 구문입니다.</Trans>

With this approach, none of the existing state items are being mutated, and the bug is fixed:
<Trans>이 접근 방식을 사용하면 기존 state 항목이 변이되지 않으며 버그가 수정됩니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Create a *new* object with changes
        return { ...artwork, seen: nextSeen };
      } else {
        // No changes
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

In general, **you should only mutate objects that you have just created.** If you were inserting a *new* artwork, you could mutate it, but if you're dealing with something that's already in state, you need to make a copy.
<Trans>일반적으로 **방금 만든 객체만 변이해야 합니다.** *새로운* artwork을 삽입하는 경우에는 변이해도 되지만, 이미 있는 state의 artwork을 다루는 경우에는 복사본을 만들어야 할 겁니다.</Trans>

### Write concise update logic with Immer<Trans>Immer로 간결한 업데이트 로직 작성하기</Trans> {/*write-concise-update-logic-with-immer*/}

Updating nested arrays without mutation can get a little bit repetitive. [Just as with objects](/learn/updating-objects-in-state#write-concise-update-logic-with-immer):
<Trans>중첩 배열을 변이 없이 업데이트하는 작업은 [객체를 다룰 때와 같이](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) 약간 반복적일 수 있습니다:</Trans>

- Generally, you shouldn't need to update state more than a couple of levels deep. If your state objects are very deep, you might want to [restructure them differently](/learn/choosing-the-state-structure#avoid-deeply-nested-state) so that they are flat.
- If you don't want to change your state structure, you might prefer to use [Immer](https://github.com/immerjs/use-immer), which lets you write using the convenient but mutating syntax and takes care of producing the copies for you.

<TransBlock>
- 일반적으로 state를 몇 레벨 이상 깊이 업데이트할 필요는 없습니다. state 객체가 매우 깊다면 [다르게 재구성](/learn/choosing-the-state-structure#avoid-deeply-nested-state)하여 평평하게 만드는 것이 좋습니다.
- state 구조를 변경하고 싶지 않다면, [Immer](https://github.com/immerjs/use-immer)를 사용해보세요. Immer는 변이 구문을 사용하여 작성하더라도 자동으로 사본 생성을 처리해 주어 편리합니다.
</TransBlock>

Here is the Art Bucket List example rewritten with Immer:
<Trans>다음은 Immer로 재작성한 아트 버킷 리스트 예시입니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Your list of art to see:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

Note how with Immer, **mutation like `artwork.seen = nextSeen` is now okay:**
<Trans>Immer를 사용하면 이제 `artwork.seen = nextSeen`과 같은 변이도 괜찮습니다:</Trans>

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

This is because you're not mutating the _original_ state, but you're mutating a special `draft` object provided by Immer. Similarly, you can apply mutating methods like `push()` and `pop()` to the content of the `draft`.
<Trans>이는 *원본* state를 변이하는 것이 아니라 Immer가 제공하는 특별한 `draft`객체를 변이하기 때문입니다. 마찬가지로 `push()` 및 `pop()`과 같은 변이 메서드를 `draft`의 콘텐츠에 적용할 수 있습니다.</Trans>

Behind the scenes, Immer always constructs the next state from scratch according to the changes that you've done to the `draft`. This keeps your event handlers very concise without ever mutating state.
<Trans>백그라운드에서 Immer는 항상 사용자가 `draft`에 적용한 변경 사항에 따라 다음 state를 처음부터 다시 구성합니다. 이렇게 하면 이벤트 핸들러가 state를 변이하지 않고도 매우 간결하게 유지됩니다.</Trans>

<Recap>

- You can put arrays into state, but you can't change them.
- Instead of mutating an array, create a *new* version of it, and update the state to it.
- You can use the `[...arr, newItem]` array spread syntax to create arrays with new items.
- You can use `filter()` and `map()` to create new arrays with filtered or transformed items.
- You can use Immer to keep your code concise.

<TransBlock>
- 배열을 state에 넣을 수는 있지만 변경할 수는 없습니다.
- 배열을 변이하는 대신 배열의 *새로운* 버전을 생성하고 state를 업데이트하세요.
- 배열 전개 구문 `[...arr, newItem]`을 사용하여 새 항목으로 배열을 만들 수 있습니다.
- `filter()` 및 `map()`을 사용하여 필터링되거나 변형된 항목으로 새 배열을 만들 수 있습니다.
- Immer를 사용하면 코드를 간결하게 유지할 수 있습니다.
</TransBlock>
</Recap>

<Challenges>

#### Update an item in the shopping cart<Trans>장바구니 품목 업데이트하기</Trans> {/*update-an-item-in-the-shopping-cart*/}

Fill in the `handleIncreaseClick` logic so that pressing "+" increases the corresponding number:
<Trans>"+"를 누르면 해당 숫자가 증가하도록 `handleIncreaseClick` 로직을 채우세요:</Trans>

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

You can use the `map` function to create a new array, and then use the `...` object spread syntax to create a copy of the changed object for the new array:
<Trans>`map` 함수를 사용하여 새 배열을 만든 다음 `...` 객체 전개 구문을 사용하여 새 배열에 대한 변경된 객체의 복사본을 만들 수 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Remove an item from the shopping cart<Trans>장바구니 품목 제거하기</Trans> {/*remove-an-item-from-the-shopping-cart*/}

This shopping cart has a working "+" button, but the "–" button doesn't do anything. You need to add an event handler to it so that pressing it decreases the `count` of the corresponding product. If you press "–" when the count is 1, the product should automatically get removed from the cart. Make sure it never shows 0.
<Trans>이 장바구니에는 작동하는 "+" 버튼이 있지만 "-" 버튼은 아무 작업도 수행하지 않습니다. 이 버튼을 누르면 해당 제품의 `count`가 감소하도록 이벤트 핸들러를 추가해야 합니다. count가 1일 때 "-"를 누르면 제품이 장바구니에서 자동으로 제거되어야 합니다. 0이 표시되지 않도록 하세요.</Trans>

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

You can first use `map` to produce a new array, and then `filter` to remove products with a `count` set to `0`:
<Trans>먼저 `map`을 사용하여 새 배열을 생성한 다음 `filter`를 사용하여 `count`가 `0`으로 설정된 제품을 제거할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Fix the mutations using non-mutative methods<Trans>비변이 메서드를 사용하도록 수정하기</Trans> {/*fix-the-mutations-using-non-mutative-methods*/}

In this example, all of the event handlers in `App.js` use mutation. As a result, editing and deleting todos doesn't work. Rewrite `handleAddTodo`, `handleChangeTodo`, and `handleDeleteTodo` to use the non-mutative methods:
<Trans>이 예제에서는 `App.js`의 모든 이벤트 핸들러가 변이 메서드를 사용합니다. 따라서 할 일 편집 및 삭제가 작동하지 않습니다. 비변이 메서드를 사용하도록 `handleAddTodo`, `handleChangeTodo`, `handleDeleteTodo`를 재작성하세요:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

In `handleAddTodo`, you can use the array spread syntax. In `handleChangeTodo`, you can create a new array with `map`. In `handleDeleteTodo`, you can create a new array with `filter`. Now the list works correctly:
<Trans>`handleAddTodo`에서는 배열 전개 구문을 사용할 수 있습니다. `handleChangeTodo`에서는 `map`으로 새 배열을 만들 수 있습니다. `handleDeleteTodo`에서는 `filter`로 새 배열을 만들 수 있습니다. 이제 목록이 올바르게 작동합니다:</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Fix the mutations using Immer<Trans>Immer를 사용하여 변이 수정하기</Trans> {/*fix-the-mutations-using-immer*/}

This is the same example as in the previous challenge. This time, fix the mutations by using Immer. For your convenience, `useImmer` is already imported, so you need to change the `todos` state variable to use it.
<Trans>이전 챌린지와 동일한 예제입니다. 이번에는 Immer를 사용하여 변이를 수정합니다. 편의를 위해 `useImmer`는 이미 임포트되어 있으므로 `todos` state 변수를 바꾸기만 하면 됩니다.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution>

With Immer, you can write code in the mutative fashion, as long as you're only mutating parts of the `draft` that Immer gives you. Here, all mutations are performed on the `draft` so the code works:
<Trans>Immer를 사용하면 Immer가 제공하는 `draft`의 일부만 변경하는 한 돌연변이 방식으로 코드를 작성할 수 있습니다. 여기서는 모든 변이가 `draft`에서 수행되므로 코드가 작동합니다:</Trans>
<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

You can also mix and match the mutative and non-mutative approaches with Immer.
<Trans>또한 Immer를 사용하여 변이 방식과 비변이 방식을 혼합하여 사용할 수도 있습니다.</Trans>

For example, in this version `handleAddTodo` is implemented by mutating the Immer `draft`, while `handleChangeTodo` and `handleDeleteTodo` use the non-mutative `map` and `filter` methods:
<Trans>예를 들어, 이 버전에서 `handleAddTodo`는 Immer `draft`를 변이하여 구현하고, `handleChangeTodo`와 `handleDeleteTodo`는 비변이 메서드인 `map`과 `filter`를 사용합니다:</Trans>
<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

With Immer, you can pick the style that feels the most natural for each separate case.
<Trans>Immer를 사용하면 각각의 케이스에 가장 자연스럽게 느껴지는 스타일을 선택할 수 있습니다.</Trans>

</Solution>

</Challenges>
