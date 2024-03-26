---
title: Installation
---

<Intro>
TODO
</Intro>

<YouWillLearn>

* run healthcheck script
* npm install compiler and eslint plugin
* configuring directories

</YouWillLearn>

<Note>
React Compiler is a new experimental compiler that we've open sourced to get early feedback from the community. It still has rough edges and is not yet fully ready for production.
</Note>

## Installation {/*installation*/}

### Set up the babel-plugin-react-compiler {/*set-up-the-babel-plugin-react-compiler*/}

<TerminalBlock>
npm install babel-plugin-react-compiler eslint-plugin-react-compiler
</TerminalBlock>

Please note that the babel-plugin-react-compiler should run before other Babel plugins or presets as the compiler requires the input source information for sound analysis.

## Rollout Strategy {/*rollout-strategy*/}

### Add React Compiler to an existing project {/*add-react-compiler-to-an-existing-project*/}

- Incremental: Opt-in, Opt-out
- Drop in

### Add React Compiler to a new project {/*add-react-compiler-to-a-new-project*/}

### Add React Compiler if you're not using React 19 {/*add-react-compiler-if-youre-not-using-react-19*/}

## Troubleshooting {/*troubleshooting*/}

#### `(0 , _react.unstable_useMemoCache) is not a function` error {/*0--_reactunstable_usememocache-is-not-a-function-error*/}

This occurs during JavaScript module evaluation when you are not using an experimental version of React that has this API, and you haven't enabled the `enableUseMemoCachePolyfill` compiler option.

To fix, either change your React version to an experimental one, or enable the polyfill.
