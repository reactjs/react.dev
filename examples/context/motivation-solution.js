const ColorContext = React.createContext();

class Button extends React.Component {
  render() {
    // highlight-range{2-8}
    return (
      <ColorContext.Consumer>
        {color => (
          <button style={{background: color}}>
            {this.props.children}
          </button>
        )}
      </ColorContext.Consumer>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.text}</p>
        <Button>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const color = 'purple';
    const children = this.props.messages.map(message => (
      <Message text={message.text} />
    ));
    // highlight-range{2-4}
    return (
      <ColorContext.Provider value={color}>
        {children}
      </ColorContext.Provider>
    );
  }
}
