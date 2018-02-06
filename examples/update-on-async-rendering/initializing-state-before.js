// Before
class ExampleComponent extends React.Component {
  // highlight-next-line
  state = {};

  // highlight-range{1-8}
  componentWillMount() {
    this.setState({
      count: 0,
      derivedValue: computeDerivedValue(
        this.props
      ),
    });
  }
}
