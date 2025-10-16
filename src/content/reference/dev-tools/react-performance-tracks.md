---
title: React Performance tracks
---

<Intro>

React Performance tracks are specialized custom entries that appear on the Performance panel's timeline in your browser developer tools.

</Intro>

These tracks are designed to provide developers with comprehensive insights into their React application's performance by visualizing React-specific events and metrics alongside other critical data sources such as network requests, JavaScript execution, and event loop activity, all synchronized on a unified timeline within the Performance panel for a complete understanding of application behavior.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/overview.png" alt="React Performance Tracks" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/overview.dark.png" alt="React Performance Tracks" />
</div>

<InlineToc />

---

## Usage {/*usage*/}

React Performance tracks are only available in development and profiling builds of React:

- **Development**: enabled by default.
- **Profiling**: Only Scheduler tracks are enabled by default. The Components track only lists Components that are in subtrees wrapped with [`<Profiler>`](/reference/react/Profiler). If you have [React Developer Tools extension](/learn/react-developer-tools) enabled, all Components are included in the Components track even if they're not wrapped in `<Profiler>`. Server tracks are not available in profiling builds.

If enabled, tracks should appear automatically in the traces you record with the Performance panel of browsers that provide [extensibility APIs](https://developer.chrome.com/docs/devtools/performance/extension).

<Pitfall>

The profiling instrumentation that powers React Performance tracks adds some additional overhead, so it is disabled in production builds by default.
Server Components and Server Requests tracks are only available in development builds.

</Pitfall>

### Using profiling builds {/*using-profiling-builds*/}

In addition to production and development builds, React also includes a special profiling build.
To use profiling builds, you have to use `react-dom/profiling` instead of `react-dom/client`.
We recommend that you alias `react-dom/client` to `react-dom/profiling` at build time via bundler aliases instead of manually updating each `react-dom/client` import.
Your framework might have built-in support for enabling React's profiling build.

---

## Tracks {/*tracks*/}

### Scheduler {/*scheduler*/}

The Scheduler is an internal React concept used for managing tasks with different priorities. This track consists of 4 subtracks, each representing work of a specific priority:

- **Blocking** - The synchronous updates, which could've been initiated by user interactions.
- **Transition** - Non-blocking work that happens in the background, usually initiated via [`startTransition`](/reference/react/startTransition).
- **Suspense** - Work related to Suspense boundaries, such as displaying fallbacks or revealing content.
- **Idle** - The lowest priority work that is done when there are no other tasks with higher priority.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler.png" alt="Scheduler track" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler.dark.png" alt="Scheduler track" />
</div>

#### Renders {/*renders*/}

Every render pass consists of multiple phases that you can see on a timeline:

- **Update** - this is what caused a new render pass.
- **Render** - React renders the updated subtree by calling render functions of components. You can see the rendered components subtree on [Components track](#components), which follows the same color scheme.
- **Commit** - After rendering components, React will submit the changes to the DOM and run layout effects, like [`useLayoutEffect`](/reference/react/useLayoutEffect).
- **Remaining Effects** - React runs passive effects of a rendered subtree. This usually happens after the paint, and this is when React runs hooks like [`useEffect`](/reference/react/useEffect). One known exception is user interactions, like clicks, or other discrete events. In this scenario, this phase could run before the paint.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler-update.png" alt="Scheduler track: updates" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler-update.dark.png" alt="Scheduler track: updates" />
</div>

[Learn more about renders and commits](/learn/render-and-commit).

#### Cascading updates {/*cascading-updates*/}

Cascading updates is one of the patterns for performance regressions. If an update was scheduled during a render pass, React could discard completed work and start a new pass.

In development builds, React can show you which Component scheduled a new update. This includes both general updates and cascading ones. You can see the enhanced stack trace by clicking on the "Cascading update" entry, which should also display the name of the method that scheduled an update.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/scheduler-cascading-update.png" alt="Scheduler track: cascading updates" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/scheduler-cascading-update.dark.png" alt="Scheduler track: cascading updates" />
</div>

[Learn more about Effects](/learn/you-might-not-need-an-effect).

### Components {/*components*/}

The Components track visualizes the durations of React components. They are displayed as a flamegraph, where each entry represents the duration of the corresponding component render and all its descendant children components.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/components-render.png" alt="Components track: render durations" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/components-render.dark.png" alt="Components track: render durations" />
</div>

Similar to render durations, effect durations are also represented as a flamegraph, but with a different color scheme that aligns with the corresponding phase on the Scheduler track.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/components-effects.png" alt="Components track: effects durations" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/components-effects.dark.png" alt="Components track: effects durations" />
</div>

<Note>

Unlike renders, not all effects are shown on the Components track by default.

To maintain performance and prevent UI clutter, React will only display those effects, which had a duration of 0.05ms or longer, or triggered an update.

</Note>

Additional events may be displayed during the render and effects phases:

- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Mount</span> - A corresponding subtree of component renders or effects was mounted.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Unmount</span> - A corresponding subtree of component renders or effects was unmounted.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Reconnect</span> - Similar to Mount, but limited to cases when [`<Activity>`](/reference/react/Activity) is used.
- <span style={{padding: '0.125rem 0.25rem', backgroundColor: '#facc15', color: '#1f1f1fff'}}>Disconnect</span> - Similar to Unmount, but limited to cases when [`<Activity>`](/reference/react/Activity) is used.

#### Changed props {/*changed-props*/}

In development builds, when you click on a component render entry, you can inspect potential changes in props. You can use this information to identify unnecessary renders.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/changed-props.png" alt="Components track: changed props" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/changed-props.dark.png" alt="Components track: changed props" />
</div>

### Server {/*server*/}

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <img className="w-full light-image" src="/images/docs/performance-tracks/server-overview.png" alt="React Server Performance Tracks" />
  <img className="w-full dark-image" src="/images/docs/performance-tracks/server-overview.dark.png" alt="React Server Performance Tracks" />
</div>

#### Server Requests {/*server-requests*/}

The Server Requests track visualized all Promises that eventually end up in a React Server Component. This includes any `async` operations like calling `fetch` or async Node.js file operations. 

React will try to combine Promises that are started from inside third-party code into a single span representing the the duration of the entire operation blocking 1st party code.
For example, a third party library method called `getUser` that calls `fetch` internally multiple times will be represented as a single span called `getUser`, instead of showing multiple `fetch` spans.

Clicking on spans will show you a stack trace of where the Promise was created as well as a view of the value that the Promise resolved to, if available.

Rejected Promises are displayed as red with their rejected value.

#### Server Components {/*server-components*/}

The Server Components tracks visualize the durations of React Server Components Promises they awaited. Timings are displayed as a flamegraph, where each entry represents the duration of the corresponding component render and all its descendant children components.

If you await a Promise, React will display duration of that Promise. To see all I/O operations, use the Server Requests track.

Different colors are used to indicate the duration of the component render. The darker the color, the longer the duration.

The Server Components track group will always contain a "Primary" track. If React is able to render Server Components concurrently, it will display addititional "Parallel" tracks.
If more than 8 Server Components are rendered concurrently, React will associate them with the last "Parallel" track instead of adding more tracks.
