const ThemeContext = React.createContext('light');

// This function takes a component...
// highlight-next-line
export function withTheme(Component) {
  // ...and returns another component...
  // highlight-next-line
  return function ThemedComponent(props) {
    // ... and renders the wrapped component with the context theme!
    // Notice that we pass through any additional props as well
    // highlight-range{2-4}
    return (
      <ThemeContext.Consumer>
        {theme => <Component {...props} theme={theme} />}
      </ThemeContext.Consumer>
    );
  };
}
