// After
class ExampleComponent extends React.Component {
  // highlight-next-line
  componentDidUpdate(
    prevProps,
    prevState
  ) {
    // highlight-range{1-8}
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
