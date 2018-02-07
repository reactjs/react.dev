// Before
class ExampleComponent extends React.Component {
  // highlight-range{1-8}
  componentWillUpdate(nextProps, nextState) {
    if (
      this.state.someStatefulValue !==
      nextState.someStatefulValue
    ) {
      nextProps.onChange(nextState.someStatefulValue);
    }
  }
}
