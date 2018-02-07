// After
class ExampleComponent extends React.Component {
  // highlight-range{1-4}
  state = {
    currentColor: this.props.defaultColor,
    palette: 'rgb',
  };
}
