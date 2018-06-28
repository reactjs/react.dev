class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

// DOM element to render React inside
const mountNode = document.querySelector("#hello-message")

ReactDOM.render(
  <HelloMessage name="Taylor" />,
  mountNode
);
