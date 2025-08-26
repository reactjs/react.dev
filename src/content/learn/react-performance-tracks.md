---
title: React Performance tracks
version: experimental
---

<Experimental>

**This feature is experimental and is not available in a stable version of React yet.**

You can try it by upgrading React packages to the most recent experimental version:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Experimental versions of React may contain bugs. Don't use them in production.

</Experimental>

<Intro>

React Performance tracks are specialized custom entries that appear on the [Performance panel's timeline of Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/overview).

</Intro>

These tracks are designed to provide developers with comprehensive insights into their React application's performance by visualizing React-specific events and metrics alongside other critical data sources such as Network requests, JavaScript execution, and Event Loop activity, all synchronized on a unified timeline within the Performance panel for a complete understanding of application behavior.

<div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks.png" />
      <img className="w-full light-image" src="/images/blog/react-labs-april-2025/perf_tracks.webp" />
  </picture>
  <picture >
      <source srcset="/images/blog/react-labs-april-2025/perf_tracks_dark.png" />
      <img className="w-full dark-image" src="/images/blog/react-labs-april-2025/perf_tracks_dark.webp" />
  </picture>
</div>

<InlineToc />

---

## Usage {/*usage*/}

You don't need to do anything to explicitly enable React Performance tracks. They are enabled by default in development and profiling builds of React and should appear by default in the traces you record with the Performance panel.

<Pitfall>

Profiling instrumentation that powers React Performance tracks adds some additional overhead, so it is disabled in the production build by default.

</Pitfall>

---

## Tracks {/*tracks*/}

### Scheduler {/*scheduler*/}

🚧 Work in progress...

### Components {/*components*/}

🚧 Work in progress...
