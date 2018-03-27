// After
class ExampleComponent extends React.Component {
  // Initialize state in constructor,
  // Or with a property initializer.
  // highlight-range{1-4}
  state = {
    isScrollingDown: false,
    lastRow: null,
  };

  // highlight-range{1-8}
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentRow !== prevState.lastRow) {
      return {
        isScrollingDown:
          nextProps.currentRow > prevState.lastRow,
        lastRow: nextProps.currentRow,
      };
    }

    // Return null to indicate no change to state.
    return null;
  }
}
