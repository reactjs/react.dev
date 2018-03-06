const defaultTheme = 'light';
// highlight-next-line
const ThemeContext = React.createContext(defaultTheme);

class ThemeProvider extends React.Component {
  state = {theme: 'light'};

  render() {
    // highlight-range{2-4}
    return (
      <ThemeContext.Provider value={this.state.theme}>
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

class App extends React.Component {
  // highlight-range{3}
  // highlight-range{5}
  // highlight-range{7}
  render() {
    return (
      <ThemeProvider>
        <SomeComponent>
          <ThemedButton />
        </SomeComponent>
      </ThemeProvider>
    );
  }
}
