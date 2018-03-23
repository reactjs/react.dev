// Create a theme context, defaulting to light theme
// highlight-next-line
const ThemeContext = React.createContext('light');

const ThemedButton = props => {
  // highlight-range{1,3-5}
  // The ThemedButton receives the theme from context
  return (
    <ThemeContext.Consumer>
      {theme => <Button theme={theme} />}
    </ThemeContext.Consumer>
  );
};

// An intermediate component
const Toolbar = props => {
  return (
    <div>
      <ThemedButton />
    </div>
  );
};

class App extends React.Component {
  render() {
    // highlight-range{2,4}
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}
