class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.props.color}}>
        {this.props.children}
      </button>
    );
  }
}

class Message extends React.Component {
  render() {
    // highlight-range{1-3}
    // The Message component must take `color` as as prop to pass it
    // to the Button. Using context, the Button could connect to the
    // color context on its own.
    return (
      <div>
        <p>{this.props.text}</p>
        <Button color={this.props.color}>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const color = 'purple';
    const children = this.props.messages.map(message => (
      <Message text={message.text} color={color} />
    ));
    return <div>{children}</div>;
  }
}
