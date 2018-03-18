class MyComponent extends React.Component {
  // highlight-next-line
  inputRef = React.createRef();

  render() {
    // highlight-next-line
    return <input type="text" ref={this.inputRef} />;
  }

  componentDidMount() {
    // highlight-next-line
    this.inputRef.current.focus();
  }
}
