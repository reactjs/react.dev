/**
 * @jest-environment jsdom
 */

import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import pretty from 'pretty';

import HelloMessage from '../content/home/examples/a-simple-component';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it('renders with or without a name', () => {
  act(() => {
    render(<HelloMessage />, container);
  });

  expect(pretty(container.innerHTML)).toMatchInlineSnapshot(
    `"<span>Hey, stranger</span>"`,
  ); /* ... gets filled automatically by jest ... */

  act(() => {
    render(<HelloMessage name="Jenny" />, container);
  });
  expect(pretty(container.innerHTML)).toMatchInlineSnapshot(
    `"<h1>Hello, Jenny!</h1>"`,
  ); /* ... gets filled automatically by jest ... */

  act(() => {
    render(<HelloMessage name="4KidsTV" />, container);
  });
  expect(pretty(container.innerHTML)).toMatchInlineSnapshot(
    `"<h1>Hello, 4KidsTV!</h1>"`,
  ); /* ... gets filled automatically by jest ... */
});
