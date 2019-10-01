// highlight-range{7-9}
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // This syntax ensures `this` is bound within handleClick
    return (
      <button onClick={e => this.handleClick(e)}>
        Click me
      </button>
    );
  }
}
