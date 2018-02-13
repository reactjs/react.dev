// highlight-next-line
const ThemeContext = React.createContext('light');

class ThemeProvider extends React.Component {
  state = {theme: 'light'};

  render() {
    // highlight-range{2}
    return (
      <ThemeContext.Provider value={this.state.theme}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

class ThemedButton extends React.Component {
  render() {
    // highlight-range{2-4}
    return (
      <ThemeContext.Consumer>
        {theme => {
          const background = theme ? '#fff' : '#000';

          return (
            <button style={{background}}>
              {this.props.children}
            </button>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
