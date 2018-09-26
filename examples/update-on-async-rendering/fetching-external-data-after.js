// After
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  // highlight-range{1-8}
  componentDidMount() {
    this._asyncRequest = loadMyAsyncData().then(
      externalData => {
        this._asyncRequest = null;
        this.setState({externalData});
      }
    );
  }

  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  render() {
    if (this.state.externalData === null) {
      // Render loading state ...
    } else {
      // Render real UI ...
    }
  }
}
