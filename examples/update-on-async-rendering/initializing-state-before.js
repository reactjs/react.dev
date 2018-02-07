// Before
class ExampleComponent extends React.Component {
  state = {};

  // highlight-range{1-6}
  componentWillMount() {
    this.setState({
      isScrollingDown: false,
      lastRow: this.props.currentRow,
    });
  }
}
