---
title: Known Issues
---

<Intro>
TODO
</Intro>

<YouWillLearn>

* Incompatible libraries
* Known issues

</YouWillLearn>

<Note>
React Compiler is a new experimental compiler that we've open sourced to get early feedback from the community. It still has rough edges and is not yet fully ready for production.
</Note>

## Troubleshooting {/*troubleshooting*/}

#### `(0 , _react.unstable_useMemoCache) is not a function` error {/*0--_reactunstable_usememocache-is-not-a-function-error*/}

This occurs during JavaScript module evaluation when you are not using an experimental version of React that has this API, and you haven't enabled the `enableUseMemoCachePolyfill` compiler option.

To fix, either change your React version to an experimental one, or enable the polyfill.
