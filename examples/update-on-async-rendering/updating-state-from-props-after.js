// After
class ExampleComponent extends React.Component {
  // highlight-range{1-3}
  // Initialize state in constructor,
  // Or with a property initializer.
  state = {};

  // highlight-range{1-20}
  static getDerivedStateFromProps(
    nextProps,
    prevState
  ) {
    if (
      prevState.someMirroredValue !==
      nextProps.someValue
    ) {
      return {
        derivedData: computeDerivedState(
          nextProps
        ),
        someMirroredValue:
          nextProps.someValue,
      };
    }

    // Return null to indicate no change to state.
    return null;
  }
}
