class MyComponent extends React.Component {
  // highlight-next-line
  divRef = React.createRef();

  render() {
    // highlight-range{4}
    return (
      <input
        type="text"
        ref={this.divRef}
      />
    );
  }

  componentDidMount() {
    // highlight-next-line
    this.divRef.value.focus();
  }
}
