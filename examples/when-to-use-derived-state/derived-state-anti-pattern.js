import React, {Fragment, PureComponent} from 'react';
import {render} from 'react-dom';

// This component illustrates a getDerivedStateFromProps anti-pattern.
// Don't copy this approach!
class ExampleInput extends PureComponent {
  state = {
    text: this.props.text,
  };

  // This lifecycle will be re-run any time the component is rendered,
  // Even if props (or props.text) have not changed.
  // For this reason, it should not update state in the way shown below!
  static getDerivedStateFromProps(props, state) {
    if (props.text) {
      // This return would override state,
      // Erasing anything the user typed since the last render.
      return {text: props.text};
    }
    return null;
  }

  render() {
    return (
      <input
        onChange={this.handleChange}
        value={this.state.text}
      />
    );
  }

  handleChange = event =>
    this.setState({text: event.target.value});
}

// This component uses a timer to simulate arbitrary re-renders.
// In a real application, this could happen for a variety of reasons:
// Event handlers that call setState, Flux updates, network responses, etc.
class Timer extends PureComponent {
  state = {
    count: 0,
  };

  componentDidMount() {
    this.interval = setInterval(
      () =>
        this.setState(prevState => ({
          count: prevState.count + 1,
        })),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    // Binding the validat function inline, as is done below,
    // Causes a new function value to be passed each time we render.
    // Even though ExampleInput is a PureComponent,
    // Its shouldComponentUpdate() will always return true because of this.
    // The same would be true of inline objects (e.g. styles) or arrays.
    return (
      <Fragment>
        <p>Type in the box below:</p>
        <ExampleInput
          exampleFunctionProp={this.exampleInstanceMethod.bind(
            this
          )}
          text="example@google.com"
        />
        <p>
          Each time the render count ({this.state.count}) is
          updated, the text you type will be reset. This
          illustrates a derived state anti-pattern.
        </p>
      </Fragment>
    );
  }

  exampleInstanceMethod(text) {
    // ...
  }
}

render(<Timer />, document.getElementById('root'));
