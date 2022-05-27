/**
 * @jest-environment jsdom
 */


import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";


import HelloMessage from '../content/home/examples/a-simple-component';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without a name", () => {
  act(() => {
    render(<HelloMessage />, container);
  });
  expect(container.textContent).toBe("Hey, stranger");

  act(() => {
    render(<HelloMessage name="Jenny" />, container);
  });
  expect(container.textContent).toBe("Hello, Jenny!");

  act(() => {
    render(<HelloMessage name="4KidsTV" />, container);
  });
  expect(container.textContent).toBe("Hello, 4KidsTV!");
});