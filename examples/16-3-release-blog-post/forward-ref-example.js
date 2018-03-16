function withTheme(Component) {
  // highlight-next-line
  function ThemedComponent({forwardedRef, ...rest}) {
    // highlight-range{6}
    return (
      <ThemeContext.Consumer>
        {theme => (
          <Component
            {...rest}
            ref={forwardedRef}
            theme={theme}
          />
        )}
      </ThemeContext.Consumer>
    );
  }

  // Intercept the "ref" and pass it as a custom prop.
  // highlight-range{1, 3}
  return React.forwardRef(function forward(props, ref) {
    return (
      <ThemedComponent {...props} forwardedRef={ref} />
    );
  });
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
