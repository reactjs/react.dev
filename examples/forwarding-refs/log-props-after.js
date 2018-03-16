function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('old props:', this.props);
      console.log('new props:', nextProps);
    }

    render() {
      const {forwardedRef, ...rest} = this.props;

      // Assign the custom prop "forwardedRef" as a ref
      // highlight-range{1-3}
      return (
        <WrappedComponent ref={forwardedRef} {...rest} />
      );
    }
  }

  // Intercept the "ref" and pass it as a custom prop, e.g. "forwardedRef"
  // highlight-range{1-3}
  function logPropsForwardRef(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }

  return React.forwardRef(logPropsForwardRef);
}
