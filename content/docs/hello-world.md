---
id: hello-world
title: Hello World
permalink: docs/hello-world.html
prev: installation.html
next: introducing-jsx.html
redirect_from:
  - "docs/"
  - "docs/index.html"
  - "docs/getting-started.html"
  - "docs/getting-started-ko-KR.html"
  - "docs/getting-started-zh-CN.html"
---

Кратчайший путь начать пользоваться React - использовать [этот Hello World пример кода на CodePen](codepen://hello-world). Вам не нужно что-либо устанавливать; Вам просто нужно открыть этот пример в другой вкладке и по мере продвижения следите за примерами. Если Вы больше предпочитаете локальное  окружение, посетите страницу [Установка](/docs/installation.html).

Простейший пример на React выглядит примерно так:

```js
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);
```

Он рендерит заголовок с надписью "Hello, world!".

Следующие несколько разделов будут постепенно вводить Вас в процесс разработки на React. Мы будем изучать построение блоков-кирпичиков React-приложений: элементов и компонентов. Когда Вы этим овладеете, Вы сможете конструировать сложные приложения из маленьких переиспользуемых кусочков.

## Замечание по JavaScript

React - это JavaScript библиотека, и это предполагает, что Вы имеете некоторые начальные знания по языку JavaScript. Если Вы чувствуете неуверенность, мы рекомендуем [освежить свои знания JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript), чтобы Вам было проще двигаться вперёд.

Мы также немного используем в примерах ES6 синтаксис. Мы стараемся использовать его пореже, ввиду его новизны, но рекомендуем Вам почаще прибегать к использованию [стрелочных функций](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), [классов](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [обратных кавычек](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), и [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const). Для проверки, во что компилируется код на ES6, можно использовать [Babel REPL](babel-repl://es5-syntax-example).
