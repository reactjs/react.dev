// Before
class ExampleComponent extends React.Component {
  state = {
    externalData: null,
  };

  // highlight-range{1-7}
  componentWillMount() {
    asyncLoadData(
      this.props.someId
    ).then(externalData =>
      this.setState({externalData})
    );
  }

  render() {
    if (this.externalData === null) {
      // Render loading state ...
    } else {
      // Render real UI ...
    }
  }
}
