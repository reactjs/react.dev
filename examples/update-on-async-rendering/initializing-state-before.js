// Before
class ExampleComponent extends React.Component {
  state = {};

  // highlight-range{1-7}
  componentWillMount() {
    this.setState({
      currentColor: this.props
        .defaultColor,
      palette: 'rgb',
    });
  }
}
