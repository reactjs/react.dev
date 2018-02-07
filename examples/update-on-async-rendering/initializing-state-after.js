// After
class ExampleComponent extends React.Component {
  // highlight-range{1-5}
  state = {
    currentColor: this.props
      .defaultColor,
    palette: 'rgb',
  };
}
