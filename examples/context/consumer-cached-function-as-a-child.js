class Example extends React.Component {
  // This method will be called when the context value changes,
  // But not when the props value changes!
  renderValue = value => {
    return (
      <div>
        Context value:{value}. Props value:{this.props.counter}
      </div>
    );
  };

  render() {
    return <Ctx.Consumer>{this.renderValue}</Ctx.Consumer>;
  }
}
