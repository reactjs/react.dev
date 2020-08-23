// After
class ExampleComponent extends React.Component {
  // highlight-range{1-5}
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isVisible !== prevProps.isVisible) {
      logVisibleChange(this.props.isVisible);
    }
  }
}
