---
title: React Server Components
canary: true
---

<Intro>

Server Components are a new type of Component that renders ahead of time, before bundling, in an environment separate from your client app or SSR server.

</Intro>

This separate environment is the "server" in React Server Components. Server Components can run once at build time on your CI server, or they can be run for each request using a web server.

<InlineToc />

<Note>

#### How do I build support for Server Components? {/*how-do-i-build-support-for-server-components*/}

While React Server Components in React 19 are stable and will not break between major versions, the underlying APIs used to implement a React Server Components bundler or framework do not follow semver and may break between minors in React 19.x. 

To support React Server Components as a bundler or framework, we recommend pinning to a specific React version, or using the Canary release. We will continue working with bundlers and frameworks to stabilize the APIs used to implement React Server Components in the future.

</Note>

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
import db from './database';

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
import db from './database';

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
  // NOTE: loads *after* Note,
  // but is fast if data is co-located.
  const author = await db.authors.get(id);
  return <span>By: {author.name}</span>;
}
```

The bundler then combines the data, rendered Server Components and dynamic Client Components into a bundle. Optionally, that bundle can then be server-side rendered (SSR) to create the initial HTML for the page. When the page loads, the browser does not see the original `Note` and `Author` components; only the rendered output is sent to the client:

```js
<div>
  <span>By: The React Team</span>
  <p>React 19 is...</p>
</div>
```

Server Components can be made dynamic by re-fetching them from a server, where they can access the data and render again. This new application architecture combines the simple “request/response” mental model of server-centric Multi-Page Apps with the seamless interactivity of client-centric Single-Page Apps, giving you the best of both worlds.

### Adding interactivity to Server Components {/*adding-interactivity-to-server-components*/}

Server Components are not sent to the browser, so they cannot use interactive APIs like `useState`. To add interactivity to Server Components, you can compose them with Client Component using the `"use client"` directive.

<Note>

#### There is no directive for Server Components. {/*there-is-no-directive-for-server-components*/}

A common misunderstanding is that Server Components are denoted by `"use server"`, but there is no directive for Server Components. The `"use server"` directive is used for Server Actions.

For more info, see the docs for [Directives](/reference/rsc/directives).

</Note>


In the following example, the `Notes` Server Component imports an `Expandable` Client Component that uses state to toggle its `expanded` state:
```js
// Server Component
import Expandable from './Expandable';

async function Notes() {
  const notes = await db.notes.getAll();
  return (
    <div>
      {notes.map(note => (
        <Expandable key={note.id}>
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
      <button
        onClick={() => setExpanded(!expanded)}
      >
        Toggle
      </button>
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
    <Expandable key={1}>
      <p>this is the first note</p>
    </Expandable>
    <Expandable key={2}>
      <p>this is the second note</p>
    </Expandable>
    <!--...-->
  </div> 
</body>
```

### Async components with Server Components {/*async-components-with-server-components*/}

Server Components introduce a new way to write Components using async/await. When you `await` in an async component, React will suspend and wait for the promise to resolve before resuming rendering. This works across server/client boundaries with streaming support for Suspense.

You can even create a promise on the server, and await it on the client:

```js
// Server Component
import db from './database';

async function Page({id}) {
  // Will suspend the Server Component.
  const note = await db.notes.get(id);
  
  // NOTE: not awaited, will start here and await on the client. 
  const commentsPromise = db.comments.get(note.id);
  return (
    <div>
      {note}
      <Suspense fallback={<p>Loading Comments...</p>}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </div>
  );
}
```

```js
// Client Component
"use client";
import {use} from 'react';

function Comments({commentsPromise}) {
  // NOTE: this will resume the promise from the server.
  // It will suspend until the data is available.
  const comments = use(commentsPromise);
  return comments.map(comment => <p>{comment}</p>);
}
```

The `note` content is important data for the page to render, so we `await` it on the server. The comments are below the fold and lower-priority, so we start the promise on the server, and wait for it on the client with the `use` API. This will Suspend on the client, without blocking the `note` content from rendering.

Since async components are [not supported on the client](#why-cant-i-use-async-components-on-the-client), we await the promise with `use`.
