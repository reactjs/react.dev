// Before
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  // highlight-range{1-5}
  componentWillMount() {
    asyncLoadData(this.props.id).then(externalData =>
      this.setState({externalData})
    );
  }
  // highlight-line
  // highlight-range{1-7}
  componentWillReceiveProps(nextProps) {
    if (nextProps.id !== this.props.id) {
      asyncLoadData(this.props.id).then(externalData =>
        this.setState({externalData})
      );
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
