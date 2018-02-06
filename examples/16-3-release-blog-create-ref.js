class MyComponent extends React.Component {
  // highlight-next-line
  _divRef = React.createRef();

  render() {
    // highlight-range{4}
    return (
      <input
        type="text"
        ref={this._divRef}
      />
    );
  }

  componentDidMount() {
    // highlight-next-line
    this._divRef.value.focus();
  }
}
