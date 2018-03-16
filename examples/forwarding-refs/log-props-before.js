// highlight-next-line
function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('old props:', this.props);
      console.log('new props:', nextProps);
    }

    render() {
      // highlight-next-line
      return <WrappedComponent {...this.props} />;
    }
  }

  return LogProps;
}
