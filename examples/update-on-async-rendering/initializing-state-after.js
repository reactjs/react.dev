// After
class ExampleComponent extends React.Component {
  // highlight-range{1-6}
  state = {
    count: 0,
    derivedValue: computeDerivedValue(
      this.props
    ),
  };
}
