---
title: JavaScript in JSX with Curly Braces
translatedTitle: JSX에서 JavaScript 사용하기
translators: [강민혜, 유한나라, 정재남]
---

<Intro>

JSX lets you write HTML-like markup inside a JavaScript file, keeping rendering logic and content in the same place. Sometimes you will want to add a little JavaScript logic or reference a dynamic property inside that markup. In this situation, you can use curly braces in your JSX to open a window to JavaScript.
<Trans>JSX를 사용하면 JavaScript 파일 내에 HTML과 유사한 마크업을 작성하여 렌더링 로직과 콘텐츠를 같은 위치에 유지할 수 있습니다. 때로는 마크업 안에 약간의 JavaScript 로직을 추가하거나 동적 프로퍼티를 참조하고 싶을 때가 있습니다. 이 경우 JSX에서 중괄호를 사용하여 JavaScript로 창을 열 수 있습니다.</Trans>

</Intro>

<YouWillLearn>

* How to pass strings with quotes
* How to reference a JavaScript variable inside JSX with curly braces
* How to call a JavaScript function inside JSX with curly braces
* How to use a JavaScript object inside JSX with curly braces

<TransBlock>
- 따옴표로 문자열을 전달하는 방법
- 중괄호를 사용하여 JSX 내에서 JavaScript 변수를 참조하는 방법
- 중괄호를 사용하여 JSX 내에서 JavaScript 함수를 호출하는 방법
- 중괄호를 사용하여 JSX 내에서 JavaScript 객체를 사용하는 방법
</TransBlock>

</YouWillLearn>

## Passing strings with quotes<Trans>따옴표로 문자열 전달하기</Trans> {/*passing-strings-with-quotes*/}

When you want to pass a string attribute to JSX, you put it in single or double quotes:
<Trans>JSX에 문자열 속성을 전달하려면, 작은따옴표 또는 큰따옴표로 묶습니다:</Trans>

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Here, `"https://i.imgur.com/7vQD0fPs.jpg"` and `"Gregorio Y. Zara"` are being passed as strings.
<Trans>여기서 `"https://i.imgur.com/7vQD0fPs.jpg"` 및 `"Gregorio Y. Zara"`는 문자열로 전달됩니다.</Trans>

But what if you want to dynamically specify the `src` or `alt` text? You could **use a value from JavaScript by replacing `"` and `"` with `{` and `}`**:
<Trans>하지만 `src` 또는 `alt` 를 동적으로 지정하려면 어떻게 해야 할까요? `"` 및 `"`를 `{` 및 `}`로 대체하여 JavaScript의 값을 사용할 수 있습니다:</Trans>

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Notice the difference between `className="avatar"`, which specifies an `"avatar"` CSS class name that makes the image round, and `src={avatar}` that reads the value of the JavaScript variable called `avatar`. That's because curly braces let you work with JavaScript right there in your markup!
<Trans>이미지를 둥글게 만들어주는 `"avatar"` CSS 클래스명 `className="avatar"`와 아바타라는 JavaScript 변수의 값을 읽는 `src={avatar}`의 차이점에 주목하세요. 중괄호를 사용하면 마크업에서 바로 JavaScript로 작업할 수 있기 때문입니다!</Trans>

## Using curly braces: A window into the JavaScript world<Trans>중괄호 사용하기: JavaScript 세계를 들여다보는 창</Trans> {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX is a special way of writing JavaScript. That means it’s possible to use JavaScript inside it—with curly braces `{ }`. The example below first declares a name for the scientist, `name`, then embeds it with curly braces inside the `<h1>`:
<Trans>JSX는 JavaScript를 작성하는 특별한 방법입니다. 그것은 즉,  중괄호 `{ }` 안에서 JavaScript를 사용할 수 있다는 의미입니다. 아래 예시에서는 먼저 과학자의 이름인 `name` 을 선언한 다음 `<h1>`안에 중괄호와 함께 포함시켰습니다:</Trans>

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'s To Do List</h1>
  );
}
```

</Sandpack>

Try changing the `name`'s value from `'Gregorio Y. Zara'` to `'Hedy Lamarr'`. See how the list title changes?
<Trans>`name` 값을 `'Gregorio Y. Zara'` 에서 `'Hedy Lamarr'`로 변경해 보세요. 투두리스트의 제목이 어떻게 바뀌는지 보셨나요?</Trans>

Any JavaScript expression will work between curly braces, including function calls like `formatDate()`:
<Trans>중괄호 사이에는 `formatDate()`와 같은 함수 호출을 포함하여 모든 JavaScript 표현식이 작동합니다:</Trans>

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>To Do List for {formatDate(today)}</h1>
  );
}
```

</Sandpack>

### Where to use curly braces<Trans>중괄호 사용 위치</Trans> {/*where-to-use-curly-braces*/}

You can only use curly braces in two ways inside JSX:
<Trans>JSX 내부에서는 중괄호를 두 가지 방법으로만 사용할 수 있습니다:</Trans>

1. **As text** directly inside a JSX tag: `<h1>{name}'s To Do List</h1>` works, but `<{tag}>Gregorio Y. Zara's To Do List</{tag}>`  will not.
2. **As attributes** immediately following the `=` sign: `src={avatar}` will read the `avatar` variable, but `src="{avatar}"` will pass the string `"{avatar}"`.

<TransBlock>
- 1. JSX 태그 안에 직접 **텍스트**로 사용: `<h1>{name}'s To Do List</h1>` 는 작동하지만 `<{tag}>Gregorio Y. Zara's To Do List</{tag}>` 는 작동하지 않습니다.
- 2. `=`기호 바로 뒤에 오는 **속성**: `src={avatar}`는 아바타 변수를 읽지만, `src="{avatar}"`는 문자열 `"{avatar}"`를 전달합니다.
</TransBlock>

## Using "double curlies": CSS and other objects in JSX<Trans>“이중 중괄호" 사용: JSX 내에서의 CSS 및 다른 객체</Trans> {/*using-double-curlies-css-and-other-objects-in-jsx*/}

In addition to strings, numbers, and other JavaScript expressions, you can even pass objects in JSX. Objects are also denoted with curly braces, like `{ name: "Hedy Lamarr", inventions: 5 }`. Therefore, to pass a JS object in JSX, you must wrap the object in another pair of curly braces: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.
<Trans>문자열, 숫자 및 기타 JavaScript 표현식 외에도 JSX로 객체를 전달할 수도 있습니다. 객체는 중괄호로 표시할 수도 있습니다(예: `{ name: "Hedy Lamarr", inventions: 5 }`. 따라서 JSX에서 JS 객체를 전달하려면 다른 중괄호 쌍으로 객체를 감싸야 합니다. `(person={{ name: "Hedy Lamarr", inventions: 5 }}`</Trans>

You may see this with inline CSS styles in JSX. React does not require you to use inline styles (CSS classes work great for most cases). But when you need an inline style, you pass an object to the `style` attribute:
<Trans>JSX의 인라인 CSS 스타일에서 이것을 볼 수 있습니다. React에서는 인라인 스타일을 사용할 필요가 없습니다(대부분의 경우 CSS 클래스가 잘 작동합니다). 하지만 인라인 스타일이 필요한 경우 `style` 어트리뷰트에 객체를 전달합니다:</Trans>

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Improve the videophone</li>
      <li>Prepare aeronautics lectures</li>
      <li>Work on the alcohol-fuelled engine</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

Try changing the values of `backgroundColor` and `color`.
<Trans>`backgroundColor` 와 `color` 의 값을 바꿔보세요.</Trans>

You can really see the JavaScript object inside the curly braces when you write it like this:
<Trans>이렇게 작성하면 중괄호 안에 JavaScript 객체가 실제로 보이는 것을 확인할 수 있습니다:</Trans>

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

The next time you see `{{` and `}}` in JSX, know that it's nothing more than an object inside the JSX curlies!
<Trans>다음에 JSX에서 `{{` 와 `}}`를 볼 때, 이는 JSX 중괄호 내부의 객체일 뿐이라는 점을 기억하세요!</Trans>

<Pitfall>

Inline `style` properties are written in camelCase. For example, HTML `<ul style="background-color: black">` would be written as `<ul style={{ backgroundColor: 'black' }}>`  in your component.
<Trans>인라인 `style` 프로퍼티는 카멜케이스로 작성됩니다. 예를 들어, HTML `<ul style="background-color: black">`은 컴포넌트에서 `<ul style={{ backgroundColor: 'black' }}>`으로 작성됩니다.</Trans>

</Pitfall>

## More fun with JavaScript objects and curly braces<Trans>JavaScript 객체와 중괄호로 더 재미있게 즐기기</Trans> {/*more-fun-with-javascript-objects-and-curly-braces*/}

You can move several expressions into one object, and reference them in your JSX inside curly braces:
<Trans>여러 표현식을 하나의 객체로 이동하여 중괄호 안에 있는 JSX에서 참조할 수 있습니다:</Trans>

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

In this example, the `person` JavaScript object contains a `name` string and a `theme` object:
<Trans>이 예제에서 `person` JavaScript 객체에는 `name` 문자열과 `theme` 객체가 포함되어 있습니다:</Trans>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

The component can use these values from `person` like so:
<Trans>컴포넌트는 다음과 같이 `person`의 값을 사용할 수 있습니다:</Trans>

```js
<div style={person.theme}>
  <h1>{person.name}'s Todos</h1>
```

JSX is very minimal as a templating language because it lets you organize data and logic using JavaScript.
<Trans>JSX는 JavaScript를 사용하여 데이터와 로직을 구성할 수 있기 때문에 템플릿 언어로서 매우 최소한의 기능을 제공합니다.</Trans>

<Recap>

Now you know almost everything about JSX:
<Trans>이제 JSX에 대한 거의 모든 것을 알게 되었습니다:</Trans>

* JSX attributes inside quotes are passed as strings.
* Curly braces let you bring JavaScript logic and variables into your markup.
* They work inside the JSX tag content or immediately after `=` in attributes.
* `{{` and `}}` is not special syntax: it's a JavaScript object tucked inside JSX curly braces.

<TransBlock>
- 따옴표 안의 JSX 속성은 문자열로 전달됩니다.
- 중괄호를 사용하면 JavaScript 로직과 변수를 마크업으로 가져올 수 있습니다.
- 중괄호는 JSX 태그 콘텐츠 내부 또는 속성의 `=` 바로 뒤에서 작동합니다.
- `{{` 와 `}}` 는 특별한 구문이 아니라 JSX 중괄호 안에 들어 있는 JavaScript 객체입니다.
</TransBlock>

</Recap>

<Challenges>

#### Fix the mistake<Trans>실수를 고쳐보세요</Trans> {/*fix-the-mistake*/}

This code crashes with an error saying `Objects are not valid as a React child`:
<Trans>이 코드는 `Objects are not valid as a React child | 객체가 React 자식으로 유효하지 않음` 이라는 오류와 함께 깨집니다:</Trans>
<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Can you find the problem?
<Trans>문제를 찾을 수 있나요?</Trans>

<Hint>
Look for what's inside the curly braces. Are we putting the right thing there?
<Trans>중괄호 안에 무엇이 있는지 확인하세요. 올바른 것을 넣었나요?</Trans>
</Hint>

<Solution>

This is happening because this example renders *an object itself* into the markup rather than a string: `<h1>{person}'s Todos</h1>` is trying to render the entire `person` object! Including raw objects as text content throws an error because React doesn't know how you want to display them.
<Trans>이 예제에서는 문자열이 아닌 *객체 자체*를 마크업으로 렌더링하기 때문에 이런 일이 발생합니다: `<h1>{person}의 Todos/<h1>`는 전체 `person` 객체를 렌더링하려고 합니다! 원시 객체를 텍스트 콘텐츠로 포함하면 React가 객체를 어떻게 표시할지 모르기 때문에 오류가 발생합니다.</Trans>

To fix it, replace `<h1>{person}'s Todos</h1>` with `<h1>{person.name}'s Todos</h1>`:
<Trans>이 문제를 해결하려면 `<h1>{person}의 Todos</h1>`를 `<h1>{person.name}의 Todos</h1>`로 바꾸세요:</Trans>
<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Extract information into an object<Trans>정보를 객체로 추출하세요</Trans> {/*extract-information-into-an-object*/}

Extract the image URL into the `person` object.
<Trans>이미지 URL을 `person` 객체로 추출하세요.</Trans>

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

Move the image URL into a property called `person.imageUrl` and read it from the `<img>` tag using the curlies:
<Trans>이미지 URL을 `person.imageUrl`이라는 속성으로 이동하고 중괄호를 사용하여 `<img>` 태그에서 읽습니다:</Trans>

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Write an expression inside JSX curly braces<Trans>JSX 중괄호 안에 표현식을 작성하세요</Trans> {/*write-an-expression-inside-jsx-curly-braces*/}

In the object below, the full image URL is split into four parts: base URL, `imageId`, `imageSize`, and file extension.
<Trans>아래 객체에서 전체 이미지 URL은 기본 URL,  `imageId`, `imageSize` 및 파일 확장자의 네 부분으로 나뉩니다.</Trans>

We want the image URL to combine these attributes together: base URL (always `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`), and file extension (always `'.jpg'`). However, something is wrong with how the `<img>` tag specifies its `src`.
<Trans>이미지 URL에 기본 URL(항상 `'https://i.imgur.com/'`), `imageId`('`7vQD0fP'`), `imageSize`(`'s'`), 파일 확장자(항상 `'.jpg'`)의 속성이 결합되기를 원합니다. 하지만 `<img>` 태그의 `src` 지정 방식에 문제가 있습니다.</Trans>

Can you fix it?
<Trans>고칠 수 있나요?</Trans>

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

To check that your fix worked, try changing the value of `imageSize` to `'b'`. The image should resize after your edit.
<Trans>수정이 제대로 되었는지 확인하려면 `imageSize`의 값을 `'b'`로 변경해 보세요. 수정 후 이미지 크기가 조정되어야 합니다.</Trans>

<Solution>

You can write it as `src={baseUrl + person.imageId + person.imageSize + '.jpg'}`.
<Trans>`src={baseUrl + person.imageId + person.imageSize + '.jpg'}`로 작성할 수 있습니다.</Trans>

1. `{` opens the JavaScript expression
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` produces the correct URL string
3. `}` closes the JavaScript expression

<TransBlock>
  1. `{`는 JavaScript 표현식을 엽니다.
  2. '`baseUrl + person.imageId + person.imageSize + '.jpg'`는 올바른 URL 문자열을 생성합니다.
  3. `}`는 JavaScript 표현식을 닫습니다.
</TransBlock>

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

You can also move this expression into a separate function like `getImageUrl` below:
<Trans>이 표현식을 아래의 `getImageUrl`과 같은 별도의 함수로 옮길 수도 있습니다:</Trans>

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'s Todos</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Improve the videophone</li>
        <li>Prepare aeronautics lectures</li>
        <li>Work on the alcohol-fuelled engine</li>
      </ul>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Variables and functions can help you keep the markup simple!
<Trans>변수와 함수를 사용하면 마크업을 간단하게 만들 수 있습니다!</Trans>

</Solution>

</Challenges>
