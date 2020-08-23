// Before
class ExampleComponent extends React.Component {
  // highlight-range{1-5}
  componentWillReceiveProps(nextProps) {
    if (this.props.isVisible !== nextProps.isVisible) {
      logVisibleChange(nextProps.isVisible);
    }
  }
}
