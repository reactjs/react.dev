// Before
class ExampleComponent extends React.Component {
  // highlight-next-line
  componentWillUpdate(
    nextProps,
    nextState
  ) {
    // highlight-range{1-8}
    if (
      this.state.someStatefulValue !==
      nextState.someStatefulValue
    ) {
      nextProps.onChange(
        nextState.someStatefulValue
      );
    }
  }
}
