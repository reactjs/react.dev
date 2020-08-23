// Before
class ExampleComponent extends React.Component {
  state = {
    isScrollingDown: false,
  };

  // highlight-range{1-8}
  componentWillReceiveProps(nextProps) {
    if (this.props.currentRow !== nextProps.currentRow) {
      this.setState({
        isScrollingDown:
          nextProps.currentRow > this.props.currentRow,
      });
    }
  }
}
