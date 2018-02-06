// After
class ExampleComponent extends React.Component {
  // highlight-next-line
  _hasUnmounted = false;

  state = {
    externalData: null,
  };

  // highlight-range{1-9}
  componentDidMount() {
    asyncLoadData(
      this.props.someId
    ).then(externalData => {
      if (!this._hasUnmounted) {
        this.setState({externalData});
      }
    });
  }

  // highlight-range{1-3}
  componentWillUnmount() {
    this._hasUnmounted = true;
  }

  render() {
    if (this.externalData === null) {
      // Render loading state ...
    } else {
      // Render real UI ...
    }
  }
}
