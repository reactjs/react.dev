// Create a theme context, defaulting to light theme
// highlight-next-line
const ThemeContext = React.createContext('light');

class ThemeProvider extends React.Component {
  render() {
    // highlight-range{2-4}
    return (
      <ThemeContext.Provider value={this.props.theme}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

class ThemedButton extends React.Component {
  render() {
    //highlight-range{2-4}
    return (
      <ThemeContext.Consumer>
        {theme => <Button theme={theme} />}
      </ThemeContext.Consumer>
    );
  }
}

const SomeComponent = props => {
  // The ThemedButton receives the theme from context;
  // SomeComponent does not need to know about it
  // highlight-range{3}
  return (
    <div>
      <ThemedButton />
    </div>
  );
};

class App extends React.Component {
  render() {
    // The ThemedButton button inside the ThemeProvider
    // uses the dark theme while the one outside uses the
    // default light theme
    // highlight-range{3-5,7}
    return (
      <div>
        <ThemeProvider theme="dark">
          <SomeComponent />
        </ThemeProvider>
        <div>
          <ThemedButton />
        </div>
      </div>
    );
  }
}
