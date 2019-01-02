class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

// let mountNode = document.querySelector('#message')

ReactDOM.render(
  <HelloMessage name="Taylor" />,
  mountNode
);