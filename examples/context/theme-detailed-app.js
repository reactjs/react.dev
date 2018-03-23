import {ThemeContext, themes} from './theme-context';
import ThemedButton from './button';

// An intermediate component that uses the ThemedButton
const Toolbar = props => {
  return (
    <ThemedButton onClick={props.changeTheme}>
      Change Theme
    </ThemedButton>
  );
};

class App extends React.Component {
  state = {
    theme: themes.light,
  };

  toggleTheme = () => {
    this.setState(state => ({
      theme:
        state.theme === themes.dark
          ? themes.light
          : themes.dark,
    }));
  };

  render() {
    //highlight-range{1-3}
    // The ThemedButton button inside the ThemeProvider
    // uses the theme from state while the one outside uses
    // the default dark theme
    //highlight-range{3-5,7}
    return (
      <div>
        <ThemeContext.Provider value={this.state.theme}>
          <Toolbar changeTheme={this.toggleTheme} />
        </ThemeContext.Provider>
        <div>
          <ThemedButton />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.root);
