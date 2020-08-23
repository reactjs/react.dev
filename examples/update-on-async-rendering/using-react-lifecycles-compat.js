import React from 'react';
// highlight-next-line
import {polyfill} from 'react-lifecycles-compat';

class ExampleComponent extends React.Component {
  // highlight-next-line
  static getDerivedStateFromProps(props, state) {
    // Your state update logic here ...
  }
}

// Polyfill your component to work with older versions of React:
// highlight-next-line
polyfill(ExampleComponent);

export default ExampleComponent;
