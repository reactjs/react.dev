---
title: react-test-renderer Deprecation Warnings
---

## ReactTestRenderer.create() warning {/*reacttestrenderercreate-warning*/}

`react-test-renderer` is deprecated. An error will log whenever calling ReactTestRenderer.create(). The package will remain available on NPM but will not be maintained and will break with new React features or changes to React's internals.

<Note>
The React Team recommends migrating your tests to [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) or [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started) for a modern and well supported testing experience.

If your application has extensive `react-test-renderer` usage, consider pinning the package to an alias such as `react-test-renderer-DO_NOT_USE` and incrementally migrating to `testing-library`. When your tests have been migrated, you can upgrade to React 19 with more confidence.
</Note>

## new ShallowRenderer() warning {/*new-shallowrenderer-warning*/}

Shallow rendering is no longer supported. As of React 19, the `react-test-renderer` package no longer exports a renderer at `react-test-renderer/shallow` and you will get an error when creating a `ShallowRenderer` instance.

<Note>
The React Team recommends migrating your tests to [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) or [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started) for a modern and well supported testing experience.

If your application has extensive `react-test-renderer/shallow` usage, consider installing the external package, [`react-shallow-renderer`](https://www.npmjs.com/package/react-shallow-renderer), pinning it to an alias such as `react-shallow-renderer-DO_NOT_USE`, and incrementally migrating to `testing-library`. When your tests have been migrated, you can upgrade to React 19 with more confidence.
</Note>