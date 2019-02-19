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
  return React.forwardRef((props, ref) => (
    <ThemedComponent {...props} forwardedRef={ref} />
  ));
}

// Here we assume that FancyButton has been imported into the current scope
const FancyThemedButton = withTheme(FancyButton);

// Create a ref using the new Referenace API, as above
// highlight-next-line
const fancyButtonRef = React.createRef();

// fancyButtonRef will now point to FancyButton
// highlight-range{4}
<FancyThemedButton
  label="Click me!"
  onClick={handleClick}
  ref={fancyButtonRef}
/>;
