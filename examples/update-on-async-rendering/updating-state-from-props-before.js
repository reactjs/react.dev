// Before
class ExampleComponent extends React.Component {
  // highlight-range{1-5}
  state = {
    derivedData: computeDerivedState(
      this.props
    ),
  };

  // highlight-range{1-12}
  componentWillReceiveProps(nextProps) {
    if (
      this.props.someValue !==
      nextProps.someValue
    ) {
      this.setState({
        derivedData: computeDerivedState(
          nextProps
        ),
      });
    }
  }
}
