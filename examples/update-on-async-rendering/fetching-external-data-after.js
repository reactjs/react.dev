// After
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  // highlight-range{1-9}
  componentDidMount() {
    this._currentRequest = asyncLoadData(
      this.props.id,
      externalData => {
        this._currentRequest = null;
        this.setState({externalData});
      }
    );
  }
  // highlight-line
  // highlight-range{1-11}
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.id !== this.props.id) {
      this._currentRequest = asyncLoadData(
        this.props.id,
        externalData => {
          this._currentRequest = null;
          this.setState({externalData});
        }
      );
    }
  }
  // highlight-line
  // highlight-range{1-5}
  componentWillUnmount() {
    if (this._currentRequest) {
      this._currentRequest.cancel();
    }
  }

  render() {
    if (this.externalData === null) {
      // Render loading state ...
    } else {
      // Render real UI ...
    }
  }
}
