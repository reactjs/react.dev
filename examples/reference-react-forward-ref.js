function enhance(Component) {
  class Enhanced extends React.Component {
    // ...

    render() {
      const {forwardedRef, ...rest} = this.props;

      // Assign the custom prop "forwardedRef" as a ref
      // highlight-next-line
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // Intercept the "ref" and pass it as a custom prop, e.g. "forwardedRef"
  // highlight-range{1-3}
  function enhanceForwardRef(props, ref) {
    return <Enhanced {...props} forwardedRef={ref} />;
  }

  // These next lines are not necessary,
  // But they do give the component a better display name in DevTools,
  // e.g. "ForwardRef(withTheme(MyComponent))"
  const name = Component.displayName || Component.name;
  enhanceForwardRef.displayName = `enhance(${name})`;

  // highlight-next-line
  return React.forwardRef(enhanceForwardRef);
}
