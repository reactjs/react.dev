---
title: Updating Objects in State
translatedTitle: 객체 state 업데이트
translators: [안예지, 원주혜, 고석영]
---

<iframe 
  style={{aspectRatio: 1.7778, width: '100%'}} 
  src="https://www.youtube.com/embed/playlist?list=PLjQV3hketAJkh6BEl0n4PDS_2fBd0cS9v&index=20"
  title="YouTube video player" 
  frameBorder="0" 
/>

<Intro>

State can hold any kind of JavaScript value, including objects. But you shouldn't change objects that you hold in the React state directly. Instead, when you want to update an object, you need to create a new one (or make a copy of an existing one), and then set the state to use that copy.
<Trans>state는 객체를 포함해서, 어떤 종류의 JavaScript 값이든 저장할 수 있습니다. 하지만 React state에 있는 객체를 직접 변이해서는 안 됩니다. 대신 객체를 업데이트하려면 새 객체를 생성하고(혹은 기존 객체의 복사본을 만들고), 해당 복사본을 사용하도록 state를 설정해야 합니다.</Trans>

</Intro>

<YouWillLearn>

- How to correctly update an object in React state
- How to update a nested object without mutating it
- What immutability is, and how not to break it
- How to make object copying less repetitive with Immer
<TransBlock>
  - React state에서 객체를 올바르게 업데이트하는 방법
  - 중첩된 객체를 변이하지 않고 업데이트하는 방법
  - 불변성이란 무엇이며, 불변성을 깨뜨리지 않는 방법
  - Immer로 객체 복사를 덜 반복적으로 만드는 방법
</TransBlock>

</YouWillLearn>

## What's a mutation? <Trans>변이란 무엇인가요?</Trans> {/*whats-a-mutation*/}

You can store any kind of JavaScript value in state.
<Trans>어떤 종류의 JavaScript 값이든 state에 저장할 수 있습니다.</Trans>

```js
const [x, setX] = useState(0);
```

So far you've been working with numbers, strings, and booleans. These kinds of JavaScript values are "immutable", meaning unchangeable or "read-only". You can trigger a re-render to _replace_ a value:
<Trans>지금까지 숫자, 문자열, 불리언값으로 작업해 보았습니다. 이러한 종류의 JavaScript 값은 "불변", 즉 변이할 수 없거나 "읽기 전용"입니다. 다시 렌더링을 촉발하여 값을 바꿀 수 있습니다:</Trans>

```js
setX(5);
```

The `x` state changed from `0` to `5`, but the _number `0` itself_ did not change. It's not possible to make any changes to the built-in primitive values like numbers, strings, and booleans in JavaScript.
<Trans>`x` state가 `0`에서 `5`로 변경 되었지만 숫자 `0` 자체는 변경되지 않았습니다. JavaScript에서는 숫자, 문자열, 불리언과 같은 빌트인 원시 자료형 값을 변경할 수 없습니다.</Trans>

Now consider an object in state:
<Trans>객체 state를 살펴봅시다:</Trans>

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Technically, it is possible to change the contents of _the object itself_. **This is called a mutation:**
<Trans>기술적으로 *객체 자체*의 내용을 변경하는 것은 가능합니다. **이를 변이(mutation)라고 합니다:**</Trans>

```js
position.x = 5;
```

However, although objects in React state are technically mutable, you should treat them **as if** they were immutable--like numbers, booleans, and strings. Instead of mutating them, you should always replace them.
<Trans>React state의 객체는 기술적으로는 변이할 수 있지만, 숫자, 불리언(boolean), 문자열과 같이 불변하는 **것처럼** 취급해야 합니다. 객체를 직접 변이하는 대신, 항상 교체해야 합니다.</Trans>

## Treat state as read-only <Trans>state를 읽기 전용으로 취급하세요</Trans> {/*treat-state-as-read-only*/}

In other words, you should **treat any JavaScript object that you put into state as read-only.**
<Trans>다시 말해 **state에 넣는 모든 JavaScript 객체를 읽기 전용으로 취급해야** 합니다.</Trans>

This example holds an object in state to represent the current pointer position. The red dot is supposed to move when you touch or move the cursor over the preview area. But the dot stays in the initial position:
<Trans>이 예제에서는 현재 포인터 위치를 나타내는 state 객체가 있습니다. 미리 보기 영역 위로 커서를 터치하거나 이동하면 빨간색 점이 움직여야 합니다. 그러나 점은 초기 위치에 유지되고 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX;
        position.y = e.clientY;
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

The problem is with this bit of code.
<Trans>문제는 아래 코드에 있습니다.</Trans>

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

This code modifies the object assigned to `position` from [the previous render.](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) But without using the state setting function, React has no idea that object has changed. So React does not do anything in response. It's like trying to change the order after you've already eaten the meal. While mutating state can work in some cases, we don't recommend it. You should treat the state value you have access to in a render as read-only.
<Trans>이 코드는 [이전 렌더링](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time)에서 `position`에 할당된 객체를 수정합니다. 하지만 state 설정자 함수를 사용하지 않으면 React는 객체가 변이되었다는 사실을 알지 못합니다. 그래서 React는 아무 반응도 하지 않습니다. 이미 음식을 다 먹은 후에 주문을 바꾸려고 하는 것과 같습니다. state 변이는 경우에 따라 작동할 수 있지만 권장하지 않습니다. 렌더링에서 접근할 수 있는 state 값은 읽기 전용으로 취급해야 합니다.</Trans>

To actually [trigger a re-render](/learn/state-as-a-snapshot#setting-state-triggers-renders) in this case, **create a *new* object and pass it to the state setting function:**
<Trans>이 경우 실제로 [리렌더링을 촉발](/learn/state-as-a-snapshot#setting-state-triggers-renders)하려면 **새 객체를 생성하고 state 설정자 함수에 전달**하세요:</Trans>

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

With `setPosition`, you're telling React:
<Trans>`setPosition`으로 React에 다음을 지시합니다:</Trans>

* Replace `position` with this new object
* And render this component again
<TransBlock>
- `position`을 이 새 객체로 바꿔라.
- 이 컴포넌트를 다시 렌더링 하라.
</TransBlock>

Notice how the red dot now follows your pointer when you touch or hover over the preview area:
<Trans>이제 미리보기 영역을 터치하거나 마우스를 가져가면 빨간색 점이 포인터를 따라다니는 것을 확인할 수 있습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';
export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### Local mutation is fine <Trans>지역 변이는 괜찮습니다</Trans> {/*local-mutation-is-fine*/}

Code like this is a problem because it modifies an *existing* object in state:
<Trans>이와 같은 코드는 *기존* 객체의 state를 수정하기 때문에 문제가 됩니다:</Trans>

```js
position.x = e.clientX;
position.y = e.clientY;
```

But code like this is **absolutely fine** because you're mutating a fresh object you have *just created*:
<Trans>그러나 이와 같은 코드는 *방금 생성한* 새로운 객체를 변이하는 것이기 때문에 **완전히 괜찮습니다**:</Trans>

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

In fact, it is completely equivalent to writing this:
<Trans>사실 이렇게 작성하는 것과 완전히 동일합니다:</Trans>

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Mutation is only a problem when you change *existing* objects that are already in state. Mutating an object you've just created is okay because *no other code references it yet.* Changing it isn't going to accidentally impact something that depends on it. This is called a "local mutation". You can even do local mutation [while rendering.](/learn/keeping-components-pure#local-mutation-your-components-little-secret) Very convenient and completely okay!
<Trans>변이는 이미 state가 있는 *기존* 객체를 변경할 때만 문제가 됩니다. 방금 생성한 객체를 변경해도 *다른 코드가 아직 참조하지 않으므로* 괜찮습니다. 객체를 변경해도 해당 객체에 의존하는 다른 객체에 실수로 영향을 미치지 않습니다. 이를 "지역 변이(local mutation)"라고 합니다. [렌더링하는 동안에도](/learn/keeping-components-pure#local-mutation-your-components-little-secret) 지역 변이를 수행할 수 있습니다. 매우 편리하고 완전 괜찮습니다!</Trans>

</DeepDive>  

## Copying objects with the spread syntax <Trans>전개 구문을 사용하여 객체 복사하기</Trans> {/*copying-objects-with-the-spread-syntax*/}

In the previous example, the `position` object is always created fresh from the current cursor position. But often, you will want to include *existing* data as a part of the new object you're creating. For example, you may want to update *only one* field in a form, but keep the previous values for all other fields.
<Trans>이전 예제에서 `position` 객체는 항상 현재 커서 위치에서 새로 만들어졌습니다. 그러나 종종 *기존* 데이터를 새로 만드는 객체의 일부로 포함시키고 싶을 때가 있습니다. 예를 들어 form에 있는 *하나의* 필드만 업데이트하고 다른 모든 필드는 이전 값을 유지하고 싶을 수 있습니다.</Trans>

These input fields don't work because the `onChange` handlers mutate the state:
<Trans>이러한 입력 필드는 `onChange` 핸들러가 state를 변이하기 때문에 작동하지 않습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

For example, this line mutates the state from a past render:
<Trans>예를 들어 이 줄은 이전 렌더링시의 state를 변이합니다:</Trans>

```js
person.firstName = e.target.value;
```

The reliable way to get the behavior you're looking for is to create a new object and pass it to `setPerson`. But here, you want to also **copy the existing data into it** because only one of the fields has changed:
<Trans>원하는 동작을 얻을 수 있는 가장 안정적인 방법은 새 객체를 생성하고 이를 `setPerson`에 전달하는 것입니다. 하지만 여기서는 필드 중 하나만 변경되었으므로 **기존 데이터도 복사**하고 싶습니다:</Trans>

```js
setPerson({
  firstName: e.target.value, // New first name from the input
                             // input에서 받아온 새로운 first name 
  lastName: person.lastName,
  email: person.email
});
```

You can use the `...` [object spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) syntax so that you don't need to copy every property separately.
<Trans>모든 속성을 개별적으로 복사할 필요가 없도록 [`...` 객체 전개 구문](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Spread_syntax)을 사용할 수 있습니다.</Trans>

```js
setPerson({
  ...person, // Copy the old fields
             // 이전 필드를 복사합니다.
  firstName: e.target.value // But override this one
                            // 단, first name만 덮어씌웁니다. 
});
```

Now the form works! 
<Trans>이제 폼이 동작합니다!</Trans>

Notice how you didn't declare a separate state variable for each input field. For large forms, keeping all data grouped in an object is very convenient--as long as you update it correctly!
<Trans>각 입력 필드에 대해 별도의 state 변수를 선언하지 않은 것을 주목하세요. 큰 양식의 경우 올바르게 업데이트하기만 하면 모든 데이터를 객체에 그룹화하여 보관하는 것이 매우 편리합니다!</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Note that the `...` spread syntax is "shallow"--it only copies things one level deep. This makes it fast, but it also means that if you want to update a nested property, you'll have to use it more than once. 
<Trans>`...` 전개 구문은 "얕은" 구문으로, 한 단계 깊이만 복사한다는 점에 유의하세요. 속도는 빠르지만 중첩된 프로퍼티를 업데이트하려면 두 번 이상 사용해야 한다는 뜻이기도 합니다.</Trans>

<DeepDive>

#### Using a single event handler for multiple fields <Trans>여러 필드에 단일 이벤트 핸들러 사용하기</Trans> {/*using-a-single-event-handler-for-multiple-fields*/}

You can also use the `[` and `]` braces inside your object definition to specify a property with dynamic name. Here is the same example, but with a single event handler instead of three different ones:
<Trans>객체 내에서 `[` 및 `]` 중괄호를 사용하여 [동적 이름을 가진 프로퍼티](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Object_initializer)를 지정할 수도 있습니다. 다음은 동일한 예시이지만 세 개의 다른 이벤트 핸들러 대신 단일 이벤트 핸들러를 사용한 예시입니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Here, `e.target.name` refers to the `name` property given to the `<input>` DOM element.
<Trans>여기서 `e.target.name`은 `<input>` DOM 요소에 지정된 `name` 속성을 참조합니다.</Trans>

</DeepDive>

## Updating a nested object <Trans>중첩된 객체 업데이트하기</Trans> {/*updating-a-nested-object*/}

Consider a nested object structure like this:
<Trans>다음과 같은 중첩된 객체 구조를 생각해 보세요</Trans>

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

If you wanted to update `person.artwork.city`, it's clear how to do it with mutation:
<Trans>`person.artwork.city`를 업데이트하려면 변이를 사용하여 업데이트하는 방법이 명확합니다:</Trans>

```js
person.artwork.city = 'New Delhi';
```

But in React, you treat state as immutable! In order to change `city`, you would first need to produce the new `artwork` object (pre-populated with data from the previous one), and then produce the new `person` object which points at the new `artwork`:
<Trans>하지만 React에서는 state를 불변으로 취급합니다! `city`를 변경하려면 먼저 새 `artwork` 객체(이전 artwork의 데이터로 미리 채워진)를 생성한 다음 새 `artwork`을 가리키는 새로운 사람 객체를 생성해야 합니다:</Trans>

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

Or, written as a single function call:
<Trans>또는 단일 함수 호출로 작성할 수도 있습니다:</Trans>

```js
setPerson({
  ...person, // Copy other fields
  artwork: { // but replace the artwork
             // 대체할 artwork를 제외한 다른 필드를 복사합니다.
    ...person.artwork, // with the same one
    city: 'New Delhi' // but in New Delhi!
                      // New Delhi'는 덮어씌운 채로 나머지 artwork 필드를 복사합니다!
  }
});
```

This gets a bit wordy, but it works fine for many cases:
<Trans>약간 장황해지긴 하지만 대부분의 경우 잘 작동합니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<DeepDive>

#### Objects are not really nested <Trans>객체는 실제로 중첩되지 않습니다</Trans> {/*objects-are-not-really-nested*/}

An object like this appears "nested" in code:
<Trans>이와 같은 객체는 코드에서 "중첩"되어 나타납니다:</Trans>

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

However, "nesting" is an inaccurate way to think about how objects behave. When the code executes, there is no such thing as a "nested" object. You are really looking at two different objects:
<Trans>그러나 "중첩"은 객체의 동작 방식을 고려해보자면 정확한 방식은 아닙니다. 코드가 실행될 때 "중첩된" 객체 같은 것은 존재하지 않습니다. 실제로는 서로 다른 두 개의 객체를 보고 있는 것입니다:</Trans>

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

The `obj1` object is not "inside" `obj2`. For example, `obj3` could "point" at `obj1` too:
<Trans>`obj1`은 `obj2`의 "내부"에 있지 않습니다. 예를 들어 `obj3`도 `obj1`을 "가리킬" 수 있습니다:</Trans>

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

If you were to mutate `obj3.artwork.city`, it would affect both `obj2.artwork.city` and `obj1.city`. This is because `obj3.artwork`, `obj2.artwork`, and `obj1` are the same object. This is difficult to see when you think of objects as "nested". Instead, they are separate objects "pointing" at each other with properties.
<Trans>`obj3.artwork.city`를 변이하면 `obj2.artwork.city`와 `obj1.city` 모두에 영향을 미칩니다. `obj3.artwork`, `obj2.artwork`, `obj1`이 동일한 객체이기 때문입니다. 객체를 "중첩된" 객체라고 생각하면 이 점을 이해하기 어렵습니다. 실은 프로퍼티를 사용하여 서로를 "가리키는" 별도의 객체입니다.</Trans>

</DeepDive>  

### Write concise update logic with Immer <Trans>Immer로 간결한 업데이트 로직 작성</Trans> {/*write-concise-update-logic-with-immer*/}

If your state is deeply nested, you might want to consider [flattening it.](/learn/choosing-the-state-structure#avoid-deeply-nested-state) But, if you don't want to change your state structure, you might prefer a shortcut to nested spreads. [Immer](https://github.com/immerjs/use-immer) is a popular library that lets you write using the convenient but mutating syntax and takes care of producing the copies for you. With Immer, the code you write looks like you are "breaking the rules" and mutating an object:
<Trans>state가 깊게 중첩된 경우 그것을 [평평하게 만드는 것](/learn/choosing-the-state-structure#avoid-deeply-nested-state)을 고려할 수 있습니다. 하지만 state 구조를 변경하고 싶지 않다면 중첩된 전개 구문보다 더 간편한 방법을 선호할 수 있습니다. [Immer](https://github.com/immerjs/use-immer)는 변이 구문을 사용하여 작성하더라도 자동으로 사본을 생성해주는 편리한 인기 라이브러리입니다. Immer를 사용하면 작성하는 코드가 "규칙을 깨고" 객체를 변이하는 것처럼 보입니다:</Trans>

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

But unlike a regular mutation, it doesn't overwrite the past state!
<Trans>하지만 일반 변이와 달리 이전 state를 덮어쓰지 않습니다!</Trans>

<DeepDive>

#### How does Immer work? <Trans>Immer는 어떻게 동작하나요?</Trans> {/*how-does-immer-work*/}

The `draft` provided by Immer is a special type of object, called a [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), that "records" what you do with it. This is why you can mutate it freely as much as you like! Under the hood, Immer figures out which parts of the `draft` have been changed, and produces a completely new object that contains your edits.

<Trans>Immer에서 제공하는 `draft`는 [프록시](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)라는 특수한 유형의 객체로, 사용자가 수행하는 작업을 "기록"합니다. 그렇기 때문에 원하는 만큼 자유롭게 수정할 수 있습니다! Immer는 내부적으로 `draft`의 어떤 부분이 변경되었는지 파악하고 편집 내용이 포함된 완전히 새로운 객체를 생성합니다.</Trans>
</DeepDive>

To try Immer:
<Trans>Immer를 사용해 보려면:</Trans>

1. Run `npm install use-immer` to add Immer as a dependency
2. Then replace `import { useState } from 'react'` with `import { useImmer } from 'use-immer'`

<TransBlock>
  1. `npm install use-immer`를 실행하여 Immer를 의존성으로 추가합니다.
  2. 그런 다음 `import { useState } from 'react'`를 `import { useImmer } from 'use-immer'`로 바꿉니다.
</TransBlock>

Here is the above example converted to Immer:
<Trans>다음은 위의 예제를 Immer로 변환한 것입니다:</Trans>

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
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

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Notice how much more concise the event handlers have become. You can mix and match `useState` and `useImmer` in a single component as much as you like. Immer is a great way to keep the update handlers concise, especially if there's nesting in your state, and copying objects leads to repetitive code.
<Trans>이벤트 핸들러가 얼마나 간결해졌는지 주목하세요. 단일 컴포넌트에서 `useState`와 `useImmer`를 원하는 만큼 맞춰 사용할 수 있습니다. 특히 state에 중첩이 있고 객체를 복사하면 코드가 반복되는 경우 업데이트 핸들러를 간결하게 유지하는 데 Immer는 좋은 방법입니다.</Trans>

<DeepDive>

#### Why is mutating state not recommended in React? <Trans>React에서 state 변이를 권장하지 않는 이유는 무엇인가요?</Trans> {/*why-is-mutating-state-not-recommended-in-react*/}

There are a few reasons:
<Trans>몇 가지 이유가 있습니다:</Trans>

* **Debugging:** If you use `console.log` and don't mutate state, your past logs won't get clobbered by the more recent state changes. So you can clearly see how state has changed between renders.
<Trans>**디버깅**: console.log를 사용하고 state를 변이하지 않으면, 과거의 기록이 최근 state 변이에 의해 지워지지 않습니다. 따라서 렌더링 사이에 state가 어떻게 변경되었는지 명확하게 확인할 수 있습니다.</Trans>

* **Optimizations:** Common React [optimization strategies](/reference/react/memo) rely on skipping work if previous props or state are the same as the next ones. If you never mutate state, it is very fast to check whether there were any changes. If `prevObj === obj`, you can be sure that nothing could have changed inside of it.
<Trans>**최적화**: 일반적인 React [최적화 전략](/reference/react/memo)은 이전 프로퍼티나 state가 다음 프로퍼티나 state와 동일한 경우 작업을 건너뛰는 것에 의존합니다. state를 변이하지 않는다면 변경이 있었는지 확인하는 것이 매우 빠릅니다. 만약 `prevObj === obj` 라면, 내부에 변경된 것이 없다는 것을 확신할 수 있습니다.</Trans>

* **New Features:** The new React features we're building rely on state being [treated like a snapshot.](/learn/state-as-a-snapshot) If you're mutating past versions of state, that may prevent you from using the new features.
<Trans>**새로운 기능**: 우리가 개발 중인 새로운 React 기능은 state가 [스냅샷처럼 취급](/learn/state-as-a-snapshot)되는 것에 의존합니다. 과거 버전의 state를 변이하는 경우 새로운 기능을 사용하지 못할 수 있습니다.</Trans>

* **Requirement Changes:** Some application features, like implementing Undo/Redo, showing a history of changes, or letting the user reset a form to earlier values, are easier to do when nothing is mutated. This is because you can keep past copies of state in memory, and reuse them when appropriate. If you start with a mutative approach, features like this can be difficult to add later on.
<Trans>**요구 사항 변경**: 실행 취소/다시 실행 구현, 변경 내역 표시, 사용자가 양식을 이전 값으로 재설정할 수 있도록 하는 것과 같은 일부 애플리케이션 기능은 아무것도 변이되지 않은  state에서 더 쉽게 수행할 수 있습니다. 과거의 state 복사본을 메모리에 보관하고 필요할 때 재사용할 수 있기 때문입니다. 변경 접근 방식으로 시작하면 나중에 이와 같은 기능을 추가하기 어려울 수 있습니다.</Trans>

* **Simpler Implementation:** Because React does not rely on mutation, it does not need to do anything special with your objects. It does not need to hijack their properties, always wrap them into Proxies, or do other work at initialization as many "reactive" solutions do. This is also why React lets you put any object into state--no matter how large--without additional performance or correctness pitfalls.
<Trans>더 간단한 구현: React는 변이에 의존하지 않기 때문에 객체에 특별한 작업을 할 필요가 없습니다. 많은 "반응형" 솔루션처럼 프로퍼티를 가로채거나, 항상 프록시로 감싸거나, 초기화할 때 다른 작업을 할 필요가 없습니다. 이것이 바로 React를 사용하면 추가 성능이나 정확성의 함정 없이 아무리 큰 객체라도 state에 넣을 수 있는 이유이기도 합니다.</Trans>

In practice, you can often "get away" with mutating state in React, but we strongly advise you not to do that so that you can use new React features developed with this approach in mind. Future contributors and perhaps even your future self will thank you!
<Trans>실제로는 React에서 state를 변이해서라도 잘 "빠져나갈" 수 있겠지만, state의 불변성을 유지하는 접근 방식을 염두에 두고 개발된 새로운 React 기능을 잘 사용할 수 있기 위해서, 그렇게 하지 말 것을 강력히 권장합니다. 미래의 기여자들과 여러분의 미래의 자신도 고마워할 것입니다!</Trans>

</DeepDive>

<Recap>

* Treat all state in React as immutable.
* When you store objects in state, mutating them will not trigger renders and will change the state in previous render "snapshots".
* Instead of mutating an object, create a *new* version of it, and trigger a re-render by setting state to it.
* You can use the `{...obj, something: 'newValue'}` object spread syntax to create copies of objects.
* Spread syntax is shallow: it only copies one level deep.
* To update a nested object, you need to create copies all the way up from the place you're updating.
* To reduce repetitive copying code, use Immer.
<TransBlock>
  - React의 모든 state를 불변으로 취급하세요.
  - state에 객체를 저장하면 객체를 변이해도 렌더링을 촉발하지 않고 이전 렌더링 "스냅샷"의 state가 변경됩니다.
  - 객체를 변이하는 대신 객체의 *새로운* 버전을 생성하고 state를 설정하여 다시 렌더링을 촉발하세요.
  - 객체 전개 구문 `{...obj, something: 'newValue'}`를 사용하여 객체 사본을 만들 수 있습니다.
  - 전개 구문은 한 수준 깊이만 복사하는 얕은 구문입니다.
  - 중첩된 객체를 업데이트하려면 업데이트하려는 위치에서 가장 위쪽까지 복사본을 만들어야 합니다.
  - 반복적인 코드 복사를 줄이려면 Immer를 사용하세요.
</TransBlock>

</Recap>



<Challenges>

#### Fix incorrect state updates <Trans>잘못된 state 업데이트 수정하기</Trans> {/*fix-incorrect-state-updates*/}

This form has a few bugs. Click the button that increases the score a few times. Notice that it does not increase. Then edit the first name, and notice that the score has suddenly "caught up" with your changes. Finally, edit the last name, and notice that the score has disappeared completely.
<Trans>이 form에는 몇 가지 버그가 있습니다. 점수를 올리는 버튼을 몇 번 클릭해 보세요. 점수가 올라가지 않는 것을 확인하세요. 그런 다음 이름을 수정하면 점수가 갑자기 변경 사항을 "따라잡는" 것을 확인할 수 있습니다. 마지막으로 last name을 수정하면 점수가 완전히 사라진 것을 확인할 수 있습니다.</Trans>

Your task is to fix all of these bugs. As you fix them, explain why each of them happens.
<Trans>여러분의 임무는 이 모든 버그를 수정하는 것입니다. 버그를 수정하면서 각각의 버그가 발생한 이유를 설명하세요.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Here is a version with both bugs fixed:
<Trans>다음은 두 가지 버그를 모두 수정한 버전입니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Score: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        First name:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

The problem with `handlePlusClick` was that it mutated the `player` object. As a result, React did not know that there's a reason to re-render, and did not update the score on the screen. This is why, when you edited the first name, the state got updated, triggering a re-render which _also_ updated the score on the screen.
<Trans>`handlePlusClick`의 문제는 `player` 객체를 변이시켰다는 것입니다. 그 결과 React는 다시 렌더링해야 할 이유가 있다는 것을 감지하지 못하고, 화면에 점수를 업데이트하지 않습니다. 그래서 first name을 수정했을 때 state가 업데이트되어 리렌더링을 촉발하고 화면의 점수 _또한_ 업데이트되었습니다.</Trans>

The problem with `handleLastNameChange` was that it did not copy the existing `...player` fields into the new object. This is why the score got lost after you edited the last name.
<Trans>`handleLastNameChange`은 기존 `...player` 필드를 새 객체에 복사하지 않고 있습니다. 이것이 last name을 편집한 후 점수가 잃은 이유입니다.</Trans>

</Solution>

#### Find and fix the mutation <Trans>변이 찾고 수정하기</Trans> {/*find-and-fix-the-mutation*/}

There is a draggable box on a static background. You can change the box's color using the select input.
<Trans>정적인 배경 위에 드래그 가능한 상자가 있습니다. select를 사용하여 상자의 색상을 변경할 수 있습니다.</Trans>

But there is a bug. If you move the box first, and then change its color, the background (which isn't supposed to move!) will "jump" to the box position. But this should not happen: the `Background`'s `position` prop is set to `initialPosition`, which is `{ x: 0, y: 0 }`. Why is the background moving after the color change?
<Trans>하지만 여기에는 버그가 있습니다. 상자를 먼저 이동한 다음 색상을 변경하면 (움직여서는 안 되는!) 배경이 상자 위치로 "점프"합니다. 이런 일이 일어나지 않아야 합니다: `Background`의 `position` props는 `{ x: 0, y: 0 }`인 `initialPosition`으로 설정되어 있습니다. 색상이 변경되고 나서 배경이 움직이는 이유는 무엇인가요?</Trans>

Find the bug and fix it.
<Trans>버그를 찾아서 수정하세요.</Trans>

<Hint>

If something unexpected changes, there is a mutation. Find the mutation in `App.js` and fix it.
<Trans>예기치 않은 변경 사항이 있으면 변이가 있는 것입니다. `App.js`에서 변이를 찾아 수정하세요.</Trans>

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

The problem was in the mutation inside `handleMove`. It mutated `shape.position`, but that's the same object that `initialPosition` points at. This is why both the shape and the background move. (It's a mutation, so the change doesn't reflect on the screen until an unrelated update--the color change--triggers a re-render.)
<Trans>문제는 `handleMove` 내부의 변이에 있었습니다. `shape.position`를 변이했지만 `initialPosition`이 가리키는 객체와 동일한 객체입니다. 이것이 도형과 배경이 모두 움직이는 이유입니다. (변이이기 때문에 관련 없는 업데이트(색상 변경)가 리렌더링을 촉발할 때까지 변경 사항이 화면에 반영되지 않습니다).</Trans>

The fix is to remove the mutation from `handleMove`, and use the spread syntax to copy the shape. Note that `+=` is a mutation, so you need to rewrite it to use a regular `+` operation.
<Trans>수정 방법은 `handleMove`에서 변이를 제거하고 전개 구문을 사용하여 모양을 복사하는 것입니다. 참고로 `+=`는 변이이므로 일반 `+` 연산을 사용하려면 다시 작성해야 합니다.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Update an object with Immer <Trans>Immer로 객체 업데이트하기</Trans> {/*update-an-object-with-immer*/}

This is the same buggy example as in the previous challenge. This time, fix the mutation by using Immer. For your convenience, `useImmer` is already imported, so you need to change the `shape` state variable to use it.
<Trans>이전 챌린지에서와 동일한 버그가 있는 예제입니다. 이번에는 Immer를 사용하여 변이를 수정합니다. 편의를 위해 `useImmer`는 이미 import되어 있으므로, 이를 사용하여 `shape` state 변수를 변경해야 합니다.</Trans>

<Sandpack>

```js App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

This is the solution rewritten with Immer. Notice how the event handlers are written in a mutating fashion, but the bug does not occur. This is because under the hood, Immer never mutates the existing objects.
<Trans>다음은 Immer로 다시 작성된 솔루션입니다. 이벤트 핸들러가 변이 방식으로 작성되었지만 버그가 발생하지 않는 것을 주목하세요. 이는 내부적으로 Immer가 기존 객체를 절대 변경하지 않기 때문입니다.</Trans>

<Sandpack>

```js App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Drag me!
      </Box>
    </>
  );
}
```

```js Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>
