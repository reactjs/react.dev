---
title: "React 19 Beta"
---

April 1, 2024, by [The React Team](/community/team)

---

**TODO**
- Content
  - [ ] Finish RSC and RSA sections and examples
  - [ ] Finish other incomplete sections 
  - [ ] Write Deep Dives
  - [ ] Review changelog and add any missing sections
  - [ ] Finish inline todos
- Polish
  - [ ] Header capitalization consistency
  - [ ] React concept capitalization
  - [ ] Package name capitalization (react-dom vs React DOM)
  - [ ] Format code with prettier

--- 

<Intro>

React 19 Beta is now available on npm! 

In our [React 19 Upgrade Guide](/blog/04/01/react-19-upgrade-guide), we shared step-by-step instructions for upgrading your app to the React 19 Beta. In this post, we'll give an overview of the new features in React 19 Beta, and how you can adopt them.

<InlineToc />

_Note for React Native users: React 19 will ship a future version of React Native with the New React Native Architecture._

</Intro>

<Note>

React Conf 2024 is scheduled for May 15–16 in Henderson, Nevada!

For more see [the React Conf website](https://conf.react.dev).

</Note>

---

## What's new in React 19 {/*whats-new-in-react-19*/}

### Actions {/*actions*/}

A common use case in React apps is to perform a data mutation and then update state in response. For example, when a user submits a form to change their name, you will make an API request, and then handle the response. Since this is an async request, you need to handle the pending state in a separate useState call:

```js {5,8,10}
const [name, setName] = useState('');
const [error, setError] = useState(null);

// Manually handle the pending state
const [isPending, setIsPending] = useState(false);

const handleSubmit = async () => {
  setIsPending(true);
  const {error} = await updateName(name);
  setIsPending(false);
  if (error) {
    setError(error);
  } else {
    setName('');
  }
}
```

In React 19, we added support for using async functions in transitions:

```js {5,8,15}
const [name, setName] = useState('');
const [error, setError] = useState(null);

// Pending state is handled for you
const [isPending, startTransition] = useTransition();

const submitAction = async () => {
  startTransition(async () => {
    const {error} = await updateName(name);
    if (!error) {
      setError(error);
    } else {
      setName('');  
    }
  })
}
```

By convention, functions that use async transitions are called "Actions". Actions will immediately set the `isPending` state to true, make the async request(s), and render any state updates as transitions. This allows you to keep the current UI responsive and interactive while the data is changing.

For more information, see the docs for [`useTransition`](/reference/react/useTransition).

### New Hook: `useActionState` {/*new-hook-useactionstate*/}

You can always create an Action by dropping down to `useTransition`, but to make the common cases easier we've added a new hook called `useActionState`:

```js {2,9}
const [name, setName] = useState('');
const [submitAction, state, isPending] = useActionState(async () => {
  const {error} = await updateName(name);
  setName('');
  
  // You can return any result of the action.
  // Here, we return only the error.
  return error;
});
```

`useActionState` accepts a function (the "Action"), and returns a new Action to call. This works because Actions compose. When the new Action is called, `useActionState` will return the last result of the Action as `data`, and the pending state of the Action as `pending`. 

For more information, see the docs for [`useActionState`](/reference/react/useActionState).

### Form Actions {/*form-actions*/}

Actions are also integrated with React 19's new Form features. We've added an `action` prop to React DOM `<form>` elements to automatically submit forms with Actions:

```js {1,3,7-8}
const [submitAction, state, isPending] = useActionState(async (formData) => {
  return updateName(formData.get('name'));
})

return (
  <form action={submitAction}>
    <input type="text" name="name" disabled={isPending}/>
    {!state.success && <span>Failed: {state.error}</span>}
  </form>
)
```

When a `<form>` Action succeeds, React will automatically reset the form for uncontrolled components. If you need to reset the `<form>` manually, you can call the new [`requestFormReset`](/todo) React DOM API.

### New Hook: `useFormStatus` {/*new-hook-useformstatus*/}

In design systems, it's common to write design components that need access to the nearest Form status, without passing the status down to the component. This can be done via Context, but to make the common case easier, we've added a new hook `useFormStatus`:

```js {2,5-6}
function NameInput() {
  const {data, pending} = useFormStatus();
  return (
    <>
      <input type="text" name="name" disabled={pending} />
      {!data.sucess && <span>Failed: {data.error}</span>}
    </>
  )
}
```

`useFormStatus` works like Context for the nearest `<form>` element, returning it's `pending` state, the last submitted form `data`, and the `action`.

For more information, see the docs for [`useFormStatus`](/reference/react-dom/hooks/useFormStatus).

### New Hook: `useOptimistic` {/*new-feature-optimistic-updates*/}

Another common UI pattern when performing a data mutation is to show the final state optimistically while the async request is underway. In React 19, we're adding a new hook called `useOptimistic` to make this easier:

```js {2,6,13,19}
const [name, setName] = useState("");
const [optimisticName, setOptimisticName] = useOptimistic(name);

const handleSubmit = async (formData) => {
  const newName = formData.get("name");
  setOptimisticName(newName);
  const updatedName = await updateName(newName);
  setName(updatedName);
};

return (
  <form action={handleSubmit}>
    <p>Your name is: {optimisticName}</p>
    <p>
      <label>Change Name:</label>
      <input
        type="text"
        name="name"
        disabled={name !== optimisticName}/>
    </p>
  </form>
);
```
The `useOptimisitc` hook will immediately render the `optimisticName` while the `updateName` request is in progress. When the update finishes, React will automatically switch back to the original `name` value.

For more information, see the docs for [`useOptimistic`](/reference/react/useOptimistic).

### New API: `use` {/*new-feature-use*/}

In React 19 we're introducing a new API to read resources in render: `use`.

For example, you can read a promise with `use`, and React will Suspend until the promise resolves:

```js {1,6}
import {use} from 'react';

function Comments({loadComments}) {
  // NOTE: this will resume the promise from the server.
  // It will suspend until the data is available.
  const comments = use(loadComments);
  return comments.map(commment => <p>{comment}</p>);
}
```

Or you can read context with `use`:

```js {1,5}
import {use} from 'react';
import ThemeContext from 'ThemeContext'

function ThemedPage({children}) {
  const theme = use(ThemeContext);
  return (
    <div className={theme === 'dark' ? 'dark' : 'light'}>
      {children}
    </div>
  );
}
```

The `use` API can only be called in render, similar to hooks. Unlike hooks, `use` can be called conditionally. In the future we plan to support more ways to consume resources in render with `use`.

For more information, see the docs for [`use`](/reference/react/use).

<DeepDive>

#### Why can't I use async components on the client? {/*why-cant-i-use-async-components-on-the-client*/}

TODO: we can't yet

</DeepDive>

## React Server Components (RSC) {/*new-feature-server-components*/}

Server Components are a new option that allows rendering components ahead of time, before bundling, in an environment separate from your application (the "server"). They can run once at build time, or can be run for each request to a web server. 

Today we're releasing React Server Components as semver stable in React 19. This means libraries that ship Server Components and Server Action can target React 19 as a peer dependency for use in frameworks that support the [Full-stack React Architecture](/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision). 

<DeepDive>

#### How do I use Server Components? {/*how-do-i-use-server-components*/}

We first announced React Server Components (RSC) in a [demo in December 2020](https://legacy.reactjs.org/blog/2020/12/21/data-fetching-with-react-server-components.html). In 2022, we merged the [RFC for React Server Components](https://github.com/reactjs/rfcs/blob/main/text/0188-server-components.md) and the [RFC for React Server Module Conventions](https://github.com/reactjs/rfcs/blob/main/text/0227-server-module-conventions.md) and partnered with Next.js for the first implementation in the Next.js 13 App Router beta. We worked with the Next.js team to implement Server Components via the stable Canary channel, and Server Components shipped as the default in Next.js 14.

We will continue working with bundlers and framework authors to expand support for React Server Components.

TODO:
- need a framework
- bundler: link to "How do bundler authors support Directives?"
- router: link to "How do I make Server Components dynamic?"


</DeepDive>

### Server Components without a Server {/*server-components-without-a-server*/}
Server components can run at build time to read from the filesystem or fetch static content, so a web server is not required. For example, you may want to read static data from a content management system.

Without Server Components, it's common to fetch static data on the client with an Effect:
```js
// bundle.js
import marked from 'marked'; // 35.9K (11.2K gzipped)
import sanitizeHtml from 'sanitize-html'; // 206K (63.3K gzipped)

function Page({page}) {
  const [content, setContent] = useState('');
  // NOTE: loads *after* first page render.
  useEffect(() => {
    fetch(`/api/content/${page}`).then((data) => {
      setContent(data.content);
    });
  }, [page]);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```
```js
// api.js
app.get(`/api/content/:page`, async (req, res) => {
  const page = req.params.page;
  const content = await file.readFile(`${page}.md`);
  res.send({content});
});
```

This pattern means users need to download and parse an additional 75K (gzipped) of libraries, and wait for a second request to fetch the data after the page loads, just to render static content that will not change for the lifetime of the page. 

With Server Components, you can render these components once at build time:

```js
import marked from 'marked'; // Not included in bundle
import sanitizeHtml from 'sanitize-html'; // Not included in bundle

async function Page({page}) {
  // NOTE: loads *during* render, when the app is built.
  const content = await file.readFile(`${page}.md`);
  
  return <div>{sanitizeHtml(marked(content))}</div>;
}
```

The rendered output can then be server-side rendered (SSR) to HTML and uploaded to a CDN. When the app loads, the client will not see the original `Page` component, or the expensive libraries for rendering the markdown. The client will only see the rendered output:

```js
<div><!-- html for markdown --></div>
```

This means the content is visible during first page load, and the bundle does not include the expensive libraries needed to render the static content.

<Note>

You may notice that the Server Component above is an async function:

```js
async function Page({page}) {
  //...
}
```

Async Components are a new feature of Server Components that allow you to `await` in render. 

See [Async components with Server Components](#async-components-with-server-components) below. 

</Note>

### Server Components with a Server {/*server-components-with-a-server*/}
Server Components can also run on a web server during a request for a page, letting you access your data layer without having to build an API. They are rendered before your application is bundled, and can pass data and JSX as props to Client Components.

Without Server Components, it's common to fetch dynamic data on the client in an Effect:

```js
// bundle.js
function Note({id}) {
  const [note, setNote] = useState('');
  // NOTE: loads *after* first render.
  useEffect(() => {
    fetch(`/api/notes/${id}`).then(data => {
      setNote(data.note);
    });
  }, [id]);
  
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

function Author({id}) {
  const [author, setAuthor] = useState('');
  // NOTE: loads *after* Note renders.
  // Causing an expensive client-server waterfall.
  useEffect(() => {
    fetch(`/api/authors/${id}`).then(data => {
      setAuthor(data.author);
    });
  }, [id]);

  return <span>By: {author.name}</span>;
}
```
```js
// api
import db from 'db';

app.get(`/api/notes/:id`, async (req, res) => {
  const note = await db.notes.get(id);
  res.send({note});
});

app.get(`/api/authors/:id`, async (req, res) => {
  const author = await db.authors.get(id);
  res.send({author});
});
```

With Server Components, you can read the data and render it in the component:

```js
import db from 'db';

async function Note({id}) {
  // NOTE: loads *during* render.
  const note = await db.notes.get(id);
  return (
    <div>
      <Author id={note.authorId} />
      <p>{note}</p>
    </div>
  );
}

async function Author({id}) {
  // NOTE: loads *after* Node,
  // but is fast if data is co-located.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

The bundler then combines the data, rendered Server Components and dynamic Client Components into a bundle. Optionally, that bundle can then be server-side rendered (SSR) to create the initial HTML for the page. When the page loads, the browser does not see the original `Note` and `Author` components; only the rendered output is sent to the client:

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 Beta is...</p>
</div>
```

Server Components can be made dynamic by re-fetching them from a server, where they can access the data and render again. This new application architecture combines the simple “request/response” mental model of server-centric Multi-Page Apps with the seamless interactivity of client-centric Single-Page Apps, giving you the best of both worlds.

<DeepDive>

#### How do I make Server Components dynamic? {/*how-do-i-make-server-components-dynamic*/}

TODO: use a router, re-fetch them.

</DeepDive>

### Directives `"use client"` and `"use server"` {/*directives*/}

[Directives](/reference/react/directives) are bundler features designed for full-stack React frameworks. They mark the “split points” between the two environments:

- `"use client"` instructs the bundler to generate a `<script>` tag (like Astro Islands).
- `"use server"` tells the bundler to generate a POST endpoint (like tRPC Mutations).

Together, directives let you write reusable components that compose client-side interactivity with the related server-side logic. `"use client"` composes client-side interactivity on the server with Server Components, and `"use server"` composes server-side code on the client with Server Actions.

<DeepDive>

#### How do bundler authors support Directives? {/*how-do-bundler-authors-support-directives*/}

TODO

</DeepDive>

### Adding interactivity to Server Components {/*adding-interactivity-to-server-components*/}

Server Components are not sent to the browser, so they cannot use interactive APIs like `useState`. To add interactivity to Server Components, you can compose them with Client Component using the `"use client"` directive.

<Note>

#### There is no directive for Server Components. {/*there-is-no-directive-for-server-components*/}

A common misunderstanding is that Server Components are denoted by `"use server"`, but there is no directive for Server Components. The `"use server"` directive is used for Server Actions.

</Note>


In the following example, the `Notes` Server Component imports an `Expandable` Client Component that uses state to toggle it's `expanded` state:
```js
// Server Component
import Exapandable from 'Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable>
          <p note={note} />
        </Expandable>
      ))}
    </div>
  )
}
```
```js
// Client Component
"use client"

export default function Expandable({children}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button onClick={() => setExpanded(s => !s)}>Toggle</button>
      {expanded && children}
    </div>
  )
}
```

This works by first rendering `Notes` as a Server Component, and then instructing the bundler to create a bundle for the Client Component `Expandable`. In the browser, the Client Components will see output of the Server Components passed as props:

```js
<head>
  <!-- the bundle for Client Components -->
  <script src="bundle.js" />
</head>
<body>
  <div>
    <Expandable>
      <p>this is the first note</p>
    </Expandable>
    <Expandable>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div> 
</body>
```

### Async components with Server Components {/*async-components-with-server-components*/}

Server Components introduce a new way to write Components using async/await. When you `await` in an async component, React will suspend and wait for the promise to resolve before resuming rendering. This works across server/client boundaries with streaming support for Suspense.

You can even start a promise on the server, and resume it on the client:

```js
// Server Component
import db from 'db';

async function Page({id}) {
  // Will suspend the Server Component.
  const note = await db.notes.get(id);
  
  // NOTE: not awaited, will resume and suspend on the client. 
  const loadComments = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments loadComments={loadComments} />
      </Suspense>
    </div>
  );
}
```

```js
// Client Component
"use client";
import {use} from 'react';

function Comments({loadComments}) {
  // NOTE: this will resume the promise from the server.
  // It will suspend until the data is available.
  const comments = use(loadComments);
  return comments.map(commment => <p>{comment}</p>);
}
```

The `note` content is important data for the page to render, so we `await` it on the server. The comments are below the fold and lower-priority, so we start the promise on the server, and wait for it on the client with the `use` API. This will Suspend on the client, without blocking the `note` content from rendering.

Since async components are [not supported on the client](#why-cant-i-use-async-components-on-the-client), we await the promise with `use`.

## React Server Actions (RSA) {/*react-server-actions-rsa*/}

Server Actions allow Client Components to call async functions executed on the server.

When a Server Action is defined with the `"use server"` directive, your framework will automatically create a reference to the server function, and pass that reference to the Client Component. When that function is called on the client, React will send a request to the server to execute the function, and return the result.

Server Actions can be created in Server Components and passed as props to Client Components, or they can be imported and used in Client Components.

<DeepDive>

#### How do I use Server Actions? {/*how-do-i-use-server-actions*/}

TODO

</DeepDive>

### Creating a Server Action from a Server Component {/*creating-a-server-action-from-a-server-component*/}

Server Components can define Server Actions with the `"use server"` directive:

```js [[2, 7, "'use server'"], [1, 5, "emptyNoteAction"], [1, 12, "emptyNoteAction"]]
// Server Component
import Button from 'Button';

function EmptyNote () {
  async function emptyNoteAction() {
    // Server Action
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={emptyNoteAction}/>;
}
```

When React renders the `EmptyNote` Server Component, it will create a reference to the `emptyNoteAction` function, and pass that reference to the `Button` Client Component. When the button is clicked, React will send a request to the server to execute the `emptyNoteAction` function with the reference provided:

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'emptyNoteAction'}
  return <button onClick={onClick}>Create Empty Note</button>
}
```

For more, see the docs for [`"use server"`](/reference/react/use-server).


### Importing Server Actions from Client Components {/*importing-server-actions-from-client-components*/}

Client Components can import Server Actions from files that use the `"use server"` directive:

```js [[1, 3, "emptyNoteAction"]]
"use server";

export async function emptyNoteAction() {
  await db.notes.create();
}

```

When the bundler builds the `EmptyNote` Client Component, it will create a reference to the `emptyNoteAction` function in the bundle. When the `button` is clicked, React will send a request to the server to execute the `emptyNoteAction` function using the reference provided:

```js [[1, 2, "emptyNoteAction"], [1, 5, "emptyNoteAction"], [1, 7, "emptyNoteAction"]]
"use client";
import {emptyNoteAction} from './actions';

function EmptyNote() {
  console.log(emptyNoteAction);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'emptyNoteAction'}
  <button onClick={emptyNoteAction} />
}
```

For more, see the docs for [`"use server"`](/reference/react/use-server).

### Composing Server Actions with Actions {/*composing-server-actions-with-actions*/}

Server Actions can be composed with Actions on the client: 

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'Name is required'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (!error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  )
}
```

This allows you to access the `isPending` state of the Server Action by wrapping it in an Action on the client.

For more, see the docs for [Calling a Server Action outside of `<form>`](/reference/react/use-server#calling-a-server-action-outside-of-form)

### Form Actions with Server Actions {/*form-actions-with-server-actions*/}

Server Actions work with the new Form features in React 19.

You can pass a Server Action to a Form to automatically submit the form to the server:


```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

When the Form submission succeeds, React will automatically reset the form. You can add `useActionState` to access the pending state, last response, or to support progressive enhancement.

For more, see the docs for [Server Actions in Forms](/reference/react/use-server#server-actions-in-forms).

### Server Actions with `useActionState` {/*server-actions-with-use-action-state*/}

You can compose Server Actions with `useActionState` for the common case where you just need access to the action pending state and last returned response:

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [submitAction, state, isPending] = useActionState(updateName);

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Failed: {state.error}</span>}
    </form>
  );
}
```

When using `useActionState` with Server Actions, React will also automatically replay form submissions entered before hydration finishes. This means users can interact with your app even before the app has hydrated. 

For more, see the docs for [`useActionState`](/reference/react-dom/hooks/useFormState).

### Progressive enhancement with `useActionState` {/*progressive-enhancement-with-useactionstate*/}

Server Actions also support progressive enhancement with the second argument of `useActionState`.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [submitAction] = useActionState(updateName, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

When the <CodeStep step={2}>permalink</CodeStep> is provided to `useActionState`, React will redirect to the provided URL if the form is submitted before the JavaScript bundle loads. 

For more, see the docs for [`useActionState`](/reference/react-dom/hooks/useFormState).


## Improvements in React 19 {/*improvements-in-react-19*/}

### `ref` as a prop {/*ref-as-a-prop*/}

In 16.3 we introduced `forwardRef` as way for function components to expose `ref` to a parent:

```js [[2, 1, "forwardRef"], [1, 1, "ref"], [1, 2, "ref", 20]]
const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} />
});

//...
<MyInput ref={ref} />
```

Starting in React 19, you can now access `ref` as a prop for function components:

```js [[1, 1, "ref"], [1, 2, "ref", 20]]
function MyInput({ref}) {
  return <input ref={ref} />
}

//...
<MyInput ref={ref} />
```

<Note>

Todo: This requires the new transform, correct?

</Note>

For more information, see [Manipulating the DOM with refs](/learn/manipulating-the-dom-with-refs)

### `<Context>` as a provider {/*context-as-a-provider*/}

In React 19, you can render `<Context>` as a provider instead of `<Context.Provider>`:


```js {5,7}
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );  
}
```

In future versions we will deprecate `<Context.Provider>`.

For more, see [`createContext`](/reference/react/createContext).

### `useDeferredValue` inital value {/*use-deferred-value-initial-value*/}

We've added an `initalValue` option to `useDeferredValue`:

```js [[1, 1, "deferredValue"], [1, 4, "deferredValue"], [2, 4, "value"], [2, 7, "value"], [3, 4, "''"]]
function Search({deferredValue}) {
  // On inital render the value is ''.
  // Then a re-render is scheduled with the deferredValue.
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
````

When <CodeStep step={3}>initialValue</CodeStep> is provided, React will return it as the <CodeStep step={2}>value</CodeStep> for the initial render of the component, and scheduled a re-render in the background with the <CodeStep step={1}>deferredValue</CodeStep> returned.

For more, see [`useDeferredValue`](/reference/react/useDeferredValue).

### Support for Document Metadata {/*support-for-metadata-tags*/}

In HTML, document metadata tags like `<title>` and `<meta>` are reserved for placement in the `<head>` section of the document. In React, it's often convenient these elements deeper in the tree where the data for those tags is available. In the past, these elements would need to be inserted manually in an effect, or by libraries like [`react-helmet`](github.com/nfl/react-helmet). 

In React 19, we're adding support for rendering document metadata tags in components natively:

```js {5,6}
function Component() {
  return (
    <div>
      <p>Hello World</p>
      <title>Hello World</title>
      <meta name="keywords" content="React 19"/>
    </div>
  );
}
```

When React renders this component, it will see the `<title>` and `<meta>` tags, and automatically hoist them to the `<head>` section of document. By supporting these metadata tags natively, we're able to ensure they work with client-only apps, streaming SSR, and Server Components. 

For more info, see the docs for [`<title>`](/reference/react-dom/components/title) and [`<meta>`](/reference/react-dom/components/meta)

### Support for Document Resources {/*support-for-document-resources*/}

In HTML, document resource tags like `<script>`, `<style>` and `<link>` are used to load external resources for the page. In React, it's often convenient these elements deeper in the tree, but in the past React would silently ignore these tags when rendered in a component. These elements can be inserted manually in an effect, and libraries like [`react-helmet`](github.com/nfl/react-helmet) have made this easier.

In React 19, we're adding support for rendering document resources:

```js
return (
  <div>
    <p>Hello World</p>
    <title>Hello World</title>
    <link rel="icon" href="favicon.ico" />
    <style>{` p { color: red; } `}</style>
    <script src="script.js" async />
  </div>
);
```
When React renders this component, it will see the `<link>`, `<style>`, and `<script>` tags and hoist them to the `<head>` of the document.

For some resource elements, React will suspend while waiting for the resource to load (such as a `<link>` to a css file). This ensures that styles are available before the components are displayed, preventing flashes of un-styled content. React may also dedupe some elements to ensure duplicate resources are not loaded.

To maintain compatibility with HTML and optimize performance, React will dedupe and hoist some but not all elements for all props. For the specific constraints, read the docs for [Resource and Metadata Components](/reference/react-dom/components#resource-and-metadata-components).

### Improved hydration for third-party scripts {/*improved-hydration-for-third-party-scripts*/}

We've improved hydration to account for third-party scripts and browser extensions. TODO: explain how.

### Better Error Reporting {/*error-handling*/}

We improved error handling in React 19 to remove duplication and provide options for handling caught and uncaught errors. For example, when there's an error in render caught by an error boundary, previously React would throw the error twice (once for the original error, then again after failing to automatically recover), and then call `console.error` with info about where the error occurred. 

This resulted in three errors for every caught error:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: hit<span className="ms-2 text-gray-30">{'    <--'} Duplicate</span>
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...

</ConsoleLogLine>

<ConsoleLogLine level="error">

The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

</ConsoleLogLine>

</ConsoleBlockMulti>

In React 19, we log a single error with all the error information included:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Error: hit
{'  '}at Throws
{'  '}at renderWithHooks
{'  '}...{'\n'}
The above error occurred in the Throws component:
{'  '}at Throws
{'  '}at ErrorBoundary
{'  '}at App{'\n'}
React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
{'  '}at ErrorBoundary
{'  '}at App

</ConsoleLogLine>

</ConsoleBlockMulti>

Additionally, we've added two new root options to compliment `onRecoverableError`:

- `onCaughtError`: called when React catches an error in an Error Boundary.
- `onUncaughtError`: called when an error is thrown and not caught by an Error Boundary.
- `onRecoverableError`: called when an error is thrown and automatically recovered.

For more info and examples, see the docs for [`createRoot`](/reference/react-dom/client/createRoot) and [`hydrateRoot`](/reference/react-dom/client/createRoot).

### Diffs for Hydration Errors {/*diffs-for-hydration-errors*/}

We also improved error reporting for hydration errors. For example, instead of logging multiple errors in DEV without any information about what mismatched:

<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: Text content did not match. Server: "Server" Client: "Client"
{'  '}at span
{'  '}at App

</ConsoleLogLine>

<ConsoleLogLine level="error">

Warning: An error occurred during hydration. The server HTML was replaced with client content in \<div\>.

</ConsoleLogLine>

<ConsoleLogLine level="error">

Uncaught Error: Text content does not match server-rendered HTML.
{'  '}at checkForUnmatchedText
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

We now log a single message with a diff of the mismatch:


<ConsoleBlockMulti>

<ConsoleLogLine level="error">

Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if an SSR-ed Client Component used:{'\n'}
\- A server/client branch `if (typeof window !== 'undefined')`.
\- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
\- Date formatting in a user's locale which doesn't match the server.
\- External changing data without sending a snapshot of it along with the HTML.
\- Invalid HTML tag nesting.{'\n'}
It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.{'\n'}
https://react.dev/link/hydration-mismatch {'\n'}
{'  '}\<App\>
{'    '}\<span\>
{'+    '}Client
{'-    '}Server{'\n'}
{'  '}at throwOnHydrationMismatch
{'  '}...

</ConsoleLogLine>

</ConsoleBlockMulti>

### Custom Element Support {/*support-for-web-components*/}

TODO

### Hydration support for extensions {/*hydration-support-for-extensions*/}

TODO


### TODO {/*todo*/}

More improvements?
- Strict Mode improvements
- Refs can now return a cleanup function. (TODO: docs)


#### How to Upgrade {/*how-to-upgrade*/}
See the React 19 Upgrade Guide for step-by-step instructions and a full list of breaking and notable changes.



