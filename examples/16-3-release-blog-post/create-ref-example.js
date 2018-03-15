class MyComponent extends React.Component {
  // highlight-next-line
  divRef = React.createRef();

  render() {
    // highlight-next-line
    return <input type="text" ref={this.divRef} />;
  }

  componentDidMount() {
    // highlight-next-line
    this.divRef.current.focus();
  }
}
