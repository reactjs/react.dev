// After
class ExampleComponent extends React.Component {
  // highlight-range{1-13}
  componentDidUpdate(
    prevProps,
    prevState
  ) {
    if (
      this.state.someStatefulValue !==
      prevState.someStatefulValue
    ) {
      this.props.onChange(
        this.state.someStatefulValue
      );
    }
  }
}
