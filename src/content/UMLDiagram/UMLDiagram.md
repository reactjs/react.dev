---
title: "React Component Diagram"
---

July 5, 2023 by [Esteban Iglesias](https://github.com/EstebanUCR), [Fabio Sanabria](https://github.com/FabioSanabria), [Daniel Lizano](https://github.com/DanielLM2002) and [Esteban Castañeda](https://github.com/estebancb03)

<Intro>

This diagram is important because it allows us to have a better understanding of the system and its components, and how they interact with each other. It also allows us to see the different patterns used in the system and how they are implemented.

</Intro>

### React Browser Connection {/*React-Browser-Connection*/}

The app uses React-Router-Dom to connect with the DOM.

### React Components Creation {/*React-Components-Creation*/}

This is practically the code part designed to implement the interface. It is responsible for providing attributes to the components and sending them to be rendered in the browser.

### Server Web Page {/*Server-Web-Page*/}

When a change is made by the user, it is first made in the Virtual DOM, which is an exact copy of the DOM. The component to be changed is isolated in the Virtual DOM.

### Changes to User View {/*Changes-To-User-View*/}

Next, the change is applied through the reconciler, which compares the DOM with the Virtual DOM and only renders the component that the user has modified in the DOM tree.

![diagram](/react.dev/public/images/docs/diagrams/UMLDiagram.png)

# Patterns of each system component {/*Patterns-of-each-system-component*/}

### Composite {/*Composite*/}

Allows the nesting of components, meaning that components can invoke others within themselves. It also allows the propagation of properties through props, which can be propagated hierarchically. Finally, since React aims to create reusable generic components, it inherently demonstrates the presence of this pattern.

### Virtual DOM {/*Virtual-DOM*/}

A virtual DOM is used to update the component tree. It handles updates differently by not updating the entire tree like the DOM does, but only updating the node that contains the component that needs to be updated.

### HOC (Higher-Order Component) {/*HOC*/}

It is a decorator that allows using both the previous version of the component and the new version with the applied component change.

### Observer {/*Observer*/}

The "setState()" method uses the observer implementation so that components subscribed to state changes are notified when they occur and update accordingly.

# Does the system adhere to design principles? {/*Does-the-system-adhere-to-design-principles?*/}

### SOLID {/*SOLID*/}

* Single responsibility: Yes, React components are reusable to ensure that each time we need to perform a specific task, we can create a new instance of the component that only performs the assigned task, thereby eliminating dependencies on other classes and components.

* Open-Closed: Yes, React is open to modifications to implement new features. Internally, the system is designed to mainly add new functions and avoid making changes to existing ones, except for bug fixes or improvements.

* Liskov principle: Yes, React, by using design patterns like HOC, avoids inheritance of components that can lead to design problems.
Interface Segregation: No, although developers never directly call the Virtual DOM, they are fully dependent on it for the components to function.

* Dependency Inversion: Yes, React rarely interacts with low-level abstractions. React itself has a transpiler that directly generates the necessary HTML and vanilla JS for its operation.

# Key Design Issues {/*Key-Design-Issues*/}

React has certain design issues, including the problem of shared state through props, which often leads to communication problems between components in complex and large-scale projects. To address these issues, an external API like Redux is commonly used. The use of such APIs is essential to prevent data desynchronization between components.

Another issue is that React relies on events and asynchronous calls, making unit testing of components difficult and resulting in a significant number of false positives and negatives, even with React's proprietary testing library.

Another significant problem is the data structure system in which components are organized with their respective parents and children. React uses a tree that is not self-balancing, so the more components added to a project, the higher the level of complexity and effort required to navigate the tree.

# Relevant Quality Attributes {/*Relevant-Quality-Attributes*/}

* Virtual DOM
* Strict mode
* JSX
* Modularity
* Immutability
* Transpiler
* React testing library
* Compatibility with browser engines (e.g., Google's V8)
* Well-known, thus having extensive documentation for its usage
* Various extras, such as libraries and tools, can be added to React to enhance development quality.
