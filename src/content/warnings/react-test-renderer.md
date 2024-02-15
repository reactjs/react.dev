---
title: react-test-renderer Deprecation Warning
---

react-test-renderer is deprecated. A warning will fire whenever calling ReactTestRenderer.create() or ReactShallowRender.render(). The react-test-renderer package will remain available on NPM but will not be maintained and may break with new React features or changes to React's internals.

The React Team recommends migrating your tests to [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) or [@testing-library/react-native](https://callstack.github.io/react-native-testing-library/docs/getting-started) for a modern and well supported testing experience.
