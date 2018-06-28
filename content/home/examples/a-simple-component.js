class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}


ReactDOM.render(
  <HelloMessage name="Taylor" />,
  mountNode       //A reference to the DOM element that you would like to render "HelloMessage" in.
);
