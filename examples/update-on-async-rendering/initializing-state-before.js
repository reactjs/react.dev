// Before
class ExampleComponent extends React.Component {
  state = {};

  // highlight-range{1-6}
  componentWillMount() {
    this.setState({
      currentColor: this.props.defaultColor,
      palette: 'rgb',
    });
  }
}
