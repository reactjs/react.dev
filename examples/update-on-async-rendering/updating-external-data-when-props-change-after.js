// After
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  // highlight-range{1-13}
  static getDerivedStateFromProps(nextProps, prevState) {
    // Store prevId in state so we can compare when props change.
    // Clear out previously-loaded data (so we don't render stale stuff).
    if (nextProps.id !== prevState.prevId) {
      return {
        externalData: null,
        prevId: nextProps.id,
      };
    }

    // No state update necessary
    return null;
  }

  componentDidMount() {
    this._loadAsyncData(this.props.id);
  }

  // highlight-range{1-5}
  componentDidUpdate(prevProps, prevState) {
    if (this.state.externalData === null) {
      this._loadAsyncData(this.props.id);
    }
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

  _loadAsyncData(id) {
    this._asyncRequest = asyncLoadData(id).then(
      externalData => {
        this._asyncRequest = null;
        this.setState({externalData});
      }
    );
  }
}
