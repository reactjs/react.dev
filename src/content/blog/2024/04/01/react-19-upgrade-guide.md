---
title: "React 19 Beta Upgrade Guide"
---

April 1, 2024 by [The React Team](/community/team)

---

<Intro>

Today we're releasing a beta version of React 19, the next major version of React.  In this post, we will guide you through the steps for upgrading.

If you'd like to help us test React 19, follow the steps in this upgrade guide and [report any issues](https://github.com/facebook/react/issues/new/choose) you encounter.

</Intro>

<Note>

React Conf 2024 is scheduled for May 15–16 in Henderson, Nevada!

For more see [the React Conf website](https://conf.react.dev).

</Note>

---
## Installing {/*installing*/}

To install the latest version of React:

```bash
npm install react react-dom
```

Or if you’re using yarn:

```bash
yarn add react react-dom
```

TODO: Note about jsx transform?


## New JSX Transform {/*new-jsx-transform*/}

TODO: new jsx transform now required


## Removed APIs {/*removed-apis*/}

In this release we're removing many long-time deprecated APIs:

### React {/*removed-apis-react*/}
- PropTypes 15.5.0
- Legacy context 15.5.0
- Module pattern factories 16.9.0
- String Refs 16.13.0
- createFactory 16.13.0

### React DOM {/*removed-apis-react-dom*/}
- render 18.0.0  
- hydrate 18.0.0   
- unmountComponentAtNode 18.0.0   
- findDOMNode 18.0.0   
- createFactory 16.13.0  
- test-utils 18.3.0   

### react-test-renderer {/*react-test-renderer*/}

TODO

### UMD builds {/*umd-builds*/}

TODO

## Deprecations {/*deprecations*/}

- react: Warn when using defaultProps in functions, memo, lazy, and forwardRef (TODO)
- react: Warn when spreading “key” as part of props in DEV  (TODO)
- react-dom: Moved createPortal and (TODO) to `react-dom/client` (TODO)
- react: Warn when calling setState during initial render  (TODO)

## Other Breaking Changes {/*breaking-changes*/}

- New JSX Transform: React now requires using the “new” jsx transform.  (TODO)
- react-dom: Remove errorInfo.digest with warning (TODO)
- react-dom: Removed unstable_renderSubtreeIntoContainer (TODO)
- react-dom: Warn and don’t set empty string attributes for src/href (TODO: land)
- react-dom: Error and do not allow javascript URLs in src/href (TODO: land)

## Other notable changes {/*other-notable-changes*/}

### React {/*other-notable-changes-react*/}
- act moved to top-level React package (TODO)
- unstable_batchedUpdates is a noop (TODO).
- Transitions in popstate are now synchronous.

### React DOM {/*other-notable-changes-react-dom*/}
- Removed layout effect warning during SSR.
- Removed workaround for IE style sorting hydration errors (TODO: land)
- Revert to client render in more cases (TODO: status)
- APIs moved to react-dom/client
