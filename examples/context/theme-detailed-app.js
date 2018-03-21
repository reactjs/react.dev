import {ThemeContext, themes} from './theme-context';
import ThemedButton from './button';

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
    //highlight-range{2,6}
    return (
      <ThemeContext.Provider value={this.state.theme}>
        <ThemedButton onClick={this.toggleTheme}>
          Change Theme
        </ThemedButton>
      </ThemeContext.Provider>
    );
  }
}

ReactDOM.render(<App />, document.root);
