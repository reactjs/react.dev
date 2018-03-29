class Example extends React.Component {
  render() {
    // The inline function will be called when the context value changes,
    // And when the props value changes!
    return (
      <Ctx.Consumer>
        {value => (
          <div>
            Context value:{value}. Props value:{this.props.counter}
          </div>
        )}
      </Ctx.Consumer>
    );
  }
}
