function withTheme(Component) {
  // highlight-next-line
  function ThemedComponent({forwardedRef, ...rest}) {
    return (
      <ThemeContext.Consumer>
        {theme => (
          // Assign the custom prop "forwardedRef" as a ref
          // highlight-next-line
          <Component
            {...rest}
            ref={forwardedRef}
            theme={theme}
          />
        )}
      </ThemeContext.Consumer>
    );
  }

  // Note the second param "ref" provided by React.forwardRef.
  // We can pass it along to ThemedComponent as a regular prop, e.g. "forwardedRef"
  // And it can then be attached to the Component.
  // highlight-range{1-3}
  function refForwarder(props, ref) {
    return (
      <ThemedComponent {...props} forwardedRef={ref} />
    );
  }

  // These next lines are not necessary,
  // But they do give the component a better display name in DevTools,
  // e.g. "ForwardRef(withTheme(MyComponent))"
  // highlight-range{1-2}
  const name = Component.displayName || Component.name;
  refForwarder.displayName = `withTheme(${name})`;

  // highlight-next-line
  return React.forwardRef(refForwarder);
}

// highlight-next-line
const fancyButtonRef = React.createRef();

// fancyButtonRef will now point to FancyButton
// highlight-range{4}
<FancyThemedButton
  label="Click me!"
  onClick={handleClick}
  ref={fancyButtonRef}
/>;
