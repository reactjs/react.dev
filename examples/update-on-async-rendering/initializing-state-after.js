// After
class ExampleComponent extends React.Component {
  // highlight-range{1-4}
  state = {
    isScrollingDown: false,
    lastRow: this.props.currentRow,
  };
}
