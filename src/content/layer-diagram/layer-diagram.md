---
title: Layered Diagram Documentation
---

July 5, 2023 by [FabioSanabria](https://github.com/FabioSanabria), [Esteban Iglesias](https://github.com/EstebanUCR), [Esteban Castañeda](https://github.com/estebancb03) and [Daniel Lizano](https://github.com/DanielLM2002)


## Layer Diagram {/*Layer-Diagram*/}

![LayerDiagram](/public/images/docs/diagrams/layer_diagram.png)

## DOM and Virtual DOM Layer {/*DOM-and-Virtual-DOM-Layer*/}

The Real DOM is the object structure that represents the content and structure of an HTML document in a web browser. It is a programming interface that provides access to and manipulation of the elements and nodes of the web document. [2]

When a web page is loaded, the browser constructs the Real DOM from the HTML code. Each element, such as tags, attributes, text content, etc., is represented as an object in the DOM. The Real DOM is a tree of objects, where each node represents an element of the document. [1]

On the other hand, the Virtual DOM is a virtual and efficient representation of the Real DOM that is used for optimized comparisons and updates in the user interface, improving performance and efficiency of the application. Instead of directly updating the Real DOM every time there is a change in data or application state, React creates and uses the Virtual DOM to make relevant changes there, and then compares them with what the Real DOM has, significantly reducing the number of operations. [2]

## Components and State Components Layer {/*Components-and-State-Components-Layer*/}

Components are reusable tools that encapsulate the logic and user interface of a specific part of an application and can be used in an isolated manner. Components in React are created using JavaScript and can be considered as visual or functional elements that are combined to build the user interface. [3] A set of components forms the DOM tree.

In React, Stateful Components (State Components) are those components that have the ability to handle and maintain an internal state. The state in React refers to the data and variables that can change during the lifespan of a component and affect its representation in the user interface. [6]

To change the structure of a component, the Virtual DOM is used to improve DOM performance.

## Babel and JSX Layer {/*Babel-and-JSX-Layer*/}

JSX (JavaScript XML) is a syntax extension used in React to write the structure of components and user interface elements in a more declarative and readable way.

JSX combines JavaScript and XML (markup language used in HTML) to allow the definition of components and elements in a way similar to how HTML is created and structured. With JSX, it is possible to represent the structure and content of the user interface in a more intuitive and browser-like (translated for the web) way. [5]

Babel is a compilation tool used in the React ecosystem to transform modern JavaScript code (such as ES6/ES7) into a version compatible with older browsers. Babel is responsible for converting React source code written in a newer syntax into code compatible with earlier browser versions. In other words, JSX passes the code to Babel, and Babel transpiles it into code compatible with other versions. [4]

## React Layer {/*React-Layer*/}

It is the main layer that the user interacts with, and it is related to all the other layers to achieve proper functioning of the framework. It consists of HTML, CSS, and JavaScript.

## Bibliography {/*Bibliography*/}

[1] ReactDOM – React. (s.f.). React – A JavaScript library for building user interfaces. https://es.legacy.reactjs.org/docs/react-dom.html

[2] Desarrollo Útil. (2021, 28 de junio). 👨‍💻 ¿Qué es el DOM y el VIRTUAL DOM de React? ⚛️ ¿CÓMO funciona? [Video]. YouTube. https://www.youtube.com/watch?v=EJgNlZpSEBI

[3] Components and properties – React. (s.f.). React – A JavaScript library for building user interfaces. https://es.legacy.reactjs.org/docs/components-and-props.html

[4] What is Babel? · Babel. (s.f.). Babel · Babel. https://babeljs.io/docs/

[5] Presentando JSX – React. (s.f.). React – Una biblioteca de JavaScript para construir interfaces de usuario. https://es.legacy.reactjs.org/docs/introducing-jsx.html

[6] State and Lifecycle – React. (s.f.-b). React – A JavaScript library for building user interfaces. https://legacy.reactjs.org/docs/state-and-lifecycle.html

