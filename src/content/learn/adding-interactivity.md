---
title: Adding Interactivity
translatedTitle: 상호작용 추가하기
translators: [정재남, 이승효, 조성민]
---

<Intro>

Some things on the screen update in response to user input. For example, clicking an image gallery switches the active image. In React, data that changes over time is called *state.* You can add state to any component, and update it as needed. In this chapter, you'll learn how to write components that handle interactions, update their state, and display different output over time.
<Trans>화면의 일부 항목은 사용자 입력에 따라 업데이트됩니다. 예를 들어, 이미지 갤러리를 클릭하면 활성 이미지가 전환됩니다. React에서는 시간이 지남에 따라 변하는 데이터를 *state*라고 합니다. 모든 컴포넌트에 state를 추가하고 필요에 따라 업데이트할 수 있습니다. 이 장에서는 상호작용을 처리하고, state를 업데이트하고, 시간에 따라 다른 출력을 표시하는 컴포넌트를 작성하는 방법을 배웁니다.</Trans>

</Intro>

<YouWillLearn isChapter={true}>

* [How to handle user-initiated events](/learn/responding-to-events)
* [How to make components "remember" information with state](/learn/state-a-components-memory)
* [How React updates the UI in two phases](/learn/render-and-commit)
* [Why state doesn't update right after you change it](/learn/state-as-a-snapshot)
* [How to queue multiple state updates](/learn/queueing-a-series-of-state-updates)
* [How to update an object in state](/learn/updating-objects-in-state)
* [How to update an array in state](/learn/updating-arrays-in-state)

<TransBlock>
* [사용자 이벤트를 처리하는 방법](/learn/responding-to-events)
* [컴포넌트가 state로 정보를 "기억"하게 만드는 방법](/learn/state-a-components-memory)
* [React가 UI를 두 단계로 업데이트하는 방법](/learn/render-and-commit)
* [state를 변경한 직후에 state가 업데이트되지 않는 이유](/learn/state-as-a-snapshot)
* [여러 state 업데이트를 큐에 대기시키는 방법](/learn/queueing-a-series-of-state-updates)
* [state 오브젝트를 업데이트하는 방법](/learn/updating-objects-in-state)
* [배열 state를 업데이트하는 방법](/learn/updating-arrays-in-state)
</TransBlock>

</YouWillLearn>

## Responding to events<Trans>이벤트에 응답하기</Trans> {/*responding-to-events*/}

React lets you add *event handlers* to your JSX. Event handlers are your own functions that will be triggered in response to user interactions like clicking, hovering, focusing on form inputs, and so on.
<Trans>React를 사용하면 JSX에 이벤트 핸들러를 추가할 수 있습니다. 이벤트 핸들러는 클릭, 마우스오버, input에 초점 맞추기 등과 같은 사용자 상호작용에 반응하여 촉발되는 자체 함수입니다.</Trans>

Built-in components like `<button>` only support built-in browser events like `onClick`. However, you can also create your own components, and give their event handler props any application-specific names that you like.
<Trans>`<button>`과 같은 기본 제공 컴포넌트는 `onClick`과 같은 기본 제공 브라우저 이벤트만 지원합니다. 그러나 자체 컴포넌트를 생성하고 이벤트 핸들러 프롭에 원하는 애플리케이션별 이름을 지정할 수도 있습니다.</Trans>

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

<LearnMore path="/learn/responding-to-events">

Read [**Responding to Events**](/learn/responding-to-events) to learn how to add event handlers.
<Trans>[**이벤트에 응답하기**](/learn/responding-to-events)에서 이벤트 핸들러를 추가하는 방법을 알아보세요.</Trans>

</LearnMore>

## State: a component's memory<Trans>state: 컴포넌트의 메모리</Trans> {/*state-a-components-memory*/}

Components often need to change what's on the screen as a result of an interaction. Typing into the form should update the input field, clicking "next" on an image carousel should change which image is displayed, clicking "buy" puts a product in the shopping cart. Components need to "remember" things: the current input value, the current image, the shopping cart. In React, this kind of component-specific memory is called *state.*
<Trans>컴포넌트는 상호 작용의 결과로 화면의 내용을 변경해야 하는 경우가 많습니다. 양식에 입력하면 입력 필드가 업데이트되어야 하고, 이미지 캐러셀에서 '다음'을 클릭하면 표시되는 이미지가 변경되어야 하며, '구매'를 클릭하면 장바구니에 제품이 담겨야 합니다. 컴포넌트는 현재 입력값, 현재 이미지, 장바구니와 같은 것들을 "기억"해야 합니다. React에서는 이런 종류의 컴포넌트별 메모리를 *state*라고 부릅니다.</Trans>

You can add state to a component with a [`useState`](/reference/react/useState) Hook. *Hooks* are special functions that let your components use React features (state is one of those features). The `useState` Hook lets you declare a state variable. It takes the initial state and returns a pair of values: the current state, and a state setter function that lets you update it.
<Trans>컴포넌트에 state를 추가하려면 `[useState](/reference/react/useState)` 훅을 사용하면 됩니다. *훅*들은 컴포넌트가 React 기능을 사용할 수 있게 해주는 특수한 함수들입니다(state는 그 기능 중 하나입니다). `useState` 훅을 사용하면 state 변수를 선언할 수 있습니다. 초기 state를 받아 현재 state와 이를 업데이트할 수 있는 state 설정자 함수의 값 쌍을 반환합니다.</Trans>

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Here is how an image gallery uses and updates state on click:
<Trans>이미지 갤러리에서 클릭 시 state를 사용하고 업데이트하는 방법은 다음과 같습니다:</Trans>

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Next
      </button>
      <h2>
        <i>{sculpture.name} </i>
        by {sculpture.artist}
      </h2>
      <h3>
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        {showMore ? 'Hide' : 'Show'} details
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

Read [**State: A Component's Memory**](/learn/state-a-components-memory) to learn how to remember a value and update it on interaction.
<Trans>[**State: 컴포넌트의 메모리**](/learn/state-a-components-memory)에서 값을 기억하고 상호작용 시 업데이트하는 방법을 알아보세요.</Trans>

</LearnMore>

## Render and commit<Trans>렌더링하고 커밋하기</Trans> {/*render-and-commit*/}

Before your components are displayed on the screen, they must be rendered by React. Understanding the steps in this process will help you think about how your code executes and explain its behavior.
<Trans>컴포넌트가 화면에 표시되기 전에, 컴포넌트들은 React에서 렌더링해야 합니다. 이 프로세스의 단계를 이해하면 코드가 어떻게 실행되는지 생각하고 그 동작을 설명하는 데 도움이 됩니다.</Trans>

Imagine that your components are cooks in the kitchen, assembling tasty dishes from ingredients. In this scenario, React is the waiter who puts in requests from customers and brings them their orders. This process of requesting and serving UI has three steps:
<Trans>컴포넌트가 주방에서 재료로 맛있는 요리를 만드는 요리사라고 상상해 보세요. 이 시나리오에서 React는 고객의 요청을 접수하고 주문을 가져오는 웨이터 역할을 합니다. UI를 요청하고 제공하는 이 과정은 세 단계로 이루어집니다:</Trans>

1. **Triggering** a render (delivering the diner's order to the kitchen)
2. **Rendering** the component (preparing the order in the kitchen)
3. **Committing** to the DOM (placing the order on the table)

<TransBlock>
  1. 렌더링 **발동**(식당의 주문을 주방으로 전달)
  2. 컴포넌트 **렌더링**(주방에서 주문 준비)
  3. DOM에 **커밋**(테이블에 주문 배치)
</TransBlock>

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

Read [**Render and Commit**](/learn/render-and-commit) to learn the lifecycle of a UI update.
<Trans>[**렌더링하고 커밋하기**](/learn/render-and-commit)에서 UI 업데이트의 라이프사이클에 대해 알아보세요.</Trans>

</LearnMore>

## State as a snapshot<Trans>스냅샷으로서의 state</Trans> {/*state-as-a-snapshot*/}

Unlike regular JavaScript variables, React state behaves more like a snapshot. Setting it does not change the state variable you already have, but instead triggers a re-render. This can be surprising at first!
<Trans>일반 JavaScript 변수와 달리 React state는 스냅샷처럼 동작합니다. state 변수를 설정해도 이미 가지고 있는 state 변수는 변경되지 않고 대신 리렌더링됩니다. 처음에는 놀랄 수 있습니다!</Trans>

```js
console.log(count);  // 0
setCount(count + 1); // Request a re-render with 1
console.log(count);  // Still 0!
```

This behavior help you avoid subtle bugs. Here is a little chat app. Try to guess what happens if you press "Send" first and *then* change the recipient to Bob. Whose name will appear in the `alert` five seconds later?
<Trans>React는 이런 식으로 작동하여 미묘한 버그를 피할 수 있습니다. 다음은 간단한 채팅 앱입니다. 먼저 "보내기"를 누른 다음 수신자를 Bob으로 변경하면 어떻게 될지 추측해 보세요. 5초 후 `alert`에 누구의 이름이 나타날까요?</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

Read [**State as a Snapshot**](/learn/state-as-a-snapshot) to learn why state appears "fixed" and unchanging inside the event handlers.
<Trans>[**스냅샷으로서의 state**](/learn/state-as-a-snapshot)에서 이벤트 핸들러 내부에서 state가 "고정"되어 변경되지 않는 이유를 알아보세요.</Trans>

</LearnMore>

## Queueing a series of state updates<Trans>여러 state 업데이트를 큐에 담기</Trans> {/*queueing-a-series-of-state-updates*/}

This component is buggy: clicking "+3" increments the score only once.
<Trans>이 컴포넌트에는 버그가 있습니다. “+3”을 클릭해도 점수가 1씩 증가합니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[State as a Snapshot](/learn/state-as-a-snapshot) explains why this is happening. Setting state requests a new re-render, but does not change it in the already running code. So `score` continues to be `0` right after you call `setScore(score + 1)`.
<Trans>[스냅샷으로서의 state](/learn/state-as-a-snapshot)에서 이런 일이 발생하는 이유를 설명합니다. state를 설정하면 새로운 렌더링을 요청하지만 이미 실행 중인 코드에서는 변경하지 않습니다. 따라서 `setScore(score + 1)`를 호출한 직후에도 `score`는 계속 `0`이 됩니다.</Trans>

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

You can fix this by passing an *updater function* when setting state. Notice how replacing `setScore(score + 1)` with `setScore(s => s + 1)` fixes the "+3" button. This lets you queue multiple state updates.
<Trans>state를 설정할 때 *업데이터 함수*를 전달하면 이 문제를 해결할 수 있습니다. `setScore(score + 1)`를 `setScore(s => s + 1)`로 바꾸면 "+3" 버튼이 어떻게 수정되는지 확인해보세요. 여러 state 업데이트를 큐에 넣어야 할 때 유용합니다.</Trans>

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Score: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

Read [**Queueing a Series of State Updates**](/learn/queueing-a-series-of-state-updates) to learn how to queue a sequence of state updates.
<Trans>[여러 state 업데이트를 큐에 담기](/learn/queueing-a-series-of-state-updates)에서 다음 렌더링 전에 여러 업데이트를 큐에 대기시키는 방법을 알아보세요.</Trans>

</LearnMore>

## Updating objects in state<Trans>객체 state 업데이트</Trans> {/*updating-objects-in-state*/}

State can hold any kind of JavaScript value, including objects. But you shouldn't change objects and arrays that you hold in the React state directly. Instead, when you want to update an object and array, you need to create a new one (or make a copy of an existing one), and then update the state to use that copy.
<Trans>state는 객체를 포함한 모든 종류의 JavaScript 값을 보유할 수 있습니다. 하지만 state에 있는 객체와 배열을 직접 변경해서는 안 됩니다. 대신 객체와 배열을 업데이트하려면 새 객체를 생성하거나 기존 객체의 복사본을 만든 다음 해당 복사본을 사용하도록 state를 업데이트해야 합니다.</Trans>

Usually, you will use the `...` spread syntax to copy objects and arrays that you want to change. For example, updating a nested object could look like this:
<Trans>일반적으로 `...` 스프레드 구문을 사용하여 변경하려는 객체 및 배열을 복사합니다. 예를 들어 중첩된 객체를 업데이트하는 것은 다음과 같습니다:</Trans>

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

If copying objects in code gets tedious, you can use a library like [Immer](https://github.com/immerjs/use-immer) to reduce repetitive code:
<Trans>코드에서 객체를 복사하는 것이 지루하다면 [Immer](https://github.com/immerjs/use-immer)와 같은 라이브러리를 사용하여 반복되는 코드를 줄일 수 있습니다:</Trans>

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

<LearnMore path="/learn/updating-objects-in-state">

Read [**Updating Objects in State**](/learn/updating-objects-in-state) to learn how to update objects correctly.
<Trans>[**객체 state 업데이트**](/learn/updating-objects-in-state)에서 객체를 올바르게 업데이트하는 방법을 알아보세요.</Trans>

</LearnMore>

## Updating arrays in state<Trans>배열 state 업데이트</Trans> {/*updating-arrays-in-state*/}

Arrays are another type of mutable JavaScript objects you can store in state and should treat as read-only. Just like with objects, when you want to update an array stored in state, you need to create a new one (or make a copy of an existing one), and then set state to use the new array:
<Trans>배열은 state에 저장할 수 있는 또 다른 유형의 변경 가능한 JavaScript 객체이며 읽기 전용으로 취급해야 합니다. 객체와 마찬가지로 state에 저장된 배열을 업데이트하려면 새 배열을 생성하거나 기존 배열의 복사본을 만든 다음 새 배열을 사용하도록 state를 설정해야 합니다:</Trans>

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
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
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

If copying arrays in code gets tedious, you can use a library like [Immer](https://github.com/immerjs/use-immer) to reduce repetitive code:
<Trans>코드에서 배열을 복사하는 것이 지루하다면 [Immer](https://github.com/immerjs/use-immer)와 같은 라이브러리를 사용하여 반복되는 코드를 줄일 수 있습니다:</Trans>

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
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
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
        artworks={list}
        onToggle={handleToggle} />
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

<LearnMore path="/learn/updating-arrays-in-state">

Read [**Updating Arrays in State**](/learn/updating-arrays-in-state) to learn how to update arrays correctly.
<Trans>[**배열 state 업데이트**](/learn/updating-arrays-in-state)에서 배열을 올바르게 업데이트하는 방법을 알아보세요.</Trans>

</LearnMore>

## What's next? {/*whats-next*/}

Head over to [Responding to Events](/learn/responding-to-events) to start reading this chapter page by page!
<Trans>[이벤트에 응답하기](/learn/responding-to-events)로 이동하여 이 챕터를 한 페이지씩 읽어보세요!</Trans>

Or, if you're already familiar with these topics, why not read about [Managing State](/learn/managing-state)?
<Trans>또는 이러한 주제에 이미 익숙하다면 [state 관리](/learn/managing-state)를 읽어보는 것은 어떨까요?</Trans>
