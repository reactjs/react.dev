import ThemeContext from './theme-context';
import ThemedButton from './button';

class App extends React.Component {
  state = {
    theme: {
      highlight: 'blue',
      accent: 'purple',
    },
  };

  changeHighlightColor = () => {
    const colors = ['red', 'blue', 'green'];
    const randomColor =
      colors[Math.floor(Math.random() * 3)];
    this.setState({
      theme: {
        ...this.state.theme,
        highlight: randomColor,
      },
    });
  };

  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        <div>
          <ThemedButton onClick={this.changeHighlightColor}>
            Change Theme
          </ThemedButton>
        </div>
      </ThemeContext.Provider>
    );
  }
}

ReactDOM.render(<App />, document.root);
