function enhance(WrappedComponent) {
  class Enhanced extends React.Component {
    // ...

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
  function enhanceForwardRef(props, ref) {
    return <Enhanced {...props} forwardedRef={ref} />;
  }

  // highlight-next-line
  return React.forwardRef(enhanceForwardRef);
}
