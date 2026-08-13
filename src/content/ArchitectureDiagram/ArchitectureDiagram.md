
---
title: "React Component Diagram"
---

July 5, 2023 by [Esteban Iglesias](https://github.com/EstebanUCR), [Fabio Sanabria](https://github.com/FabioSanabria), [Daniel Lizano](https://github.com/DanielLM2002) and [Esteban Castañeda](https://github.com/estebancb03)

<Intro>

This component diagram is important because it provides a clear and concise visual representation of the structure and relationships between components in a system. This diagram allows developers to quickly understand how the system is organized and functions, identify dependencies and couplings between components, and visualize the overall architecture of the system.

</Intro>

### React Browser Connection {/*React-Browser-Connection*/}
The app uses React-Router-Dom to connect with the DOM.

### React Components Creation {/*React-Components-Creation*/}
This is practically the code part designed to implement the interface. It is responsible for providing attributes to the components and sending them to be rendered in the browser.

### Server/Web Page {/*Server-Web-Page*/}
When a change is made by the user, it is first made in the Virtual DOM, which is an exact copy of the DOM. The component to be changed is isolated in the Virtual DOM.

### Changes to User View {/*Changes-To-User-View*/}
Next, the change is applied through the reconciler, which compares the DOM with the Virtual DOM and only renders the component that the user has modified in the DOM tree.

![diagram](/react.dev\public\images\docs\diagrams\ArchitectureDiagram.png)

# Relationships between components {/*Relationships-between-components*/}

## React Browser Connection {/*React-Browser-Connection*/}

The React-Router-Dom library is used to connect the React app with the DOM. This library allows the creation of routes that are used to navigate between the different pages of the app. The routes are defined in the App.js file, which is the main file of the app.

## React Components Creation {/*React-Components-Creation*/}

The components are created in the components folder. Each component has its own folder with its respective .js file and .css file. The .js file contains the code that defines the component and the .css file contains the styles that are applied to the component. The components are created using the React library.

## Server/Web Page {/*Server-Web-Page*/}

The server is created using the Express library. The server is responsible for receiving the requests made by the user and sending the corresponding responses. The server is created in the server.js file.

## Changes to User View {/*Changes-To-User-View*/}

The reconciler is responsible for comparing the DOM with the Virtual DOM and rendering the changes made by the user in the DOM. The reconciler is created using the React library.

# Interfaces {/*Interfaces*/}

C-shaped symbols represent the implicit implementation of an interface that connects two modules, interfaces are abstract objects whose functionalities the modules communicate.

# Bibliography {/*Bibliography*/}
1. React Router. (June 18). Main Concepts v6.14.1. Retrieved from https://reactrouter.com/en/main/start/concepts 
2. React. (June 18). Components and Props. Retrieved from https://reactjs.org/docs/components-and-props.html
3. React. (June 18). React DOM APIs. Retrieved from https://react.dev/reference/react-dom