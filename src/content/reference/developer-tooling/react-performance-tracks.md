---
title: React Performance tracks
version: canary
---

<Canary>

**This feature is currently only available in React’s Canary and Experimental channels.**

[Learn more about React’s release channels here.](/community/versioning-policy#all-release-channels)

</Canary>

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
- **Profiling**: you can either wrap a subtree that you want to instrument with [`<Profiler>`](/reference/react/Profiler) component or have [React Developer Tools extension](/learn/react-developer-tools) enabled.

If enabled, tracks should appear automatically in the traces you record with the Performance panel of browsers that provide [extensibility APIs](https://developer.chrome.com/docs/devtools/performance/extension).

<Pitfall>

The profiling instrumentation that powers React Performance tracks adds some additional overhead, so it is disabled in production builds by default.

</Pitfall>

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
- **Render** - React renders the updated subtree by calling render functions of components. You can see the rendered components subtree on [Components track](/reference/developer-tooling/react-performance-tracks#components), which follows the same color scheme.
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
