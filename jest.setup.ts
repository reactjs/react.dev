import {jest, expect, render} from '@jest/globals';
import '@testing-library/jest-dom';

global.jest = jest;
// global.expect = expect;
// global.render = render;

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
    };
  };

/**
 * Utility function that mocks the `IntersectionObserver` API. Necessary for components that rely
 * on it, otherwise the tests will crash. Recommended to execute inside `beforeEach`.
 * @param intersectionObserverMock - Parameter that is sent to the `Object.defineProperty`
 * overwrite method. `jest.fn()` mock functions can be passed here if the goal is to not only
 * mock the intersection observer, but its methods.
 */
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}

  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return null;
  }

  unobserve() {
    return null;
  }
};
