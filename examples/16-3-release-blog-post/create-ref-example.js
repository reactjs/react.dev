class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    // highlight-next-line
    this.inputRef = React.createRef();
  }

  render() {
    // highlight-next-line
    return <input type="text" ref={this.inputRef} />;
  }

  componentDidMount() {
    // highlight-next-line
    this.inputRef.current.focus();
  }
}
