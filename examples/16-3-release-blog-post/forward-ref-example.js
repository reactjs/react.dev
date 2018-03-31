function withTheme(Component) {
  // Note the second param "ref" provided by React.forwardRef.
  // We can attach this to Component directly.
  // highlight-range{1,5}
  function ThemedComponent(props, ref) {
    return (
      <ThemeContext.Consumer>
        {theme => (
          <Component {...props} ref={ref} theme={theme} />
        )}
      </ThemeContext.Consumer>
    );
  }

  // These next lines are not necessary,
  // But they do give the component a better display name in DevTools,
  // e.g. "ForwardRef(withTheme(MyComponent))"
  // highlight-range{1-2}
  const name = Component.displayName || Component.name;
  ThemedComponent.displayName = `withTheme(${name})`;

  // Tell React to pass the "ref" to ThemedComponent.
  // highlight-next-line
  return React.forwardRef(ThemedComponent);
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
