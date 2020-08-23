function withTheme(Component) {
  return function ThemedComponent(props) {
    // highlight-range{2-4}
    return (
      <ThemeContext.Consumer>
        {theme => <Component {...props} theme={theme} />}
      </ThemeContext.Consumer>
    );
  };
}
