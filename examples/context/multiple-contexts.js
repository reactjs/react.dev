// Create a theme context, defaulting to light theme
const ThemeContext = React.createContext('light');

// Signed-in user context
const UserContext = React.createContext();

class App extends React.Component {
  static propTypes = {
    theme: PropTypes.string,
    signedInUser: PropTypes.shape({
      id: number,
      name: string,
      avatar: string,
    }),
  };

  render() {
    return (
      <ThemeContext.Provider value={this.props.theme}>
        <UserContext.Provider
          value={this.props.signedInUser}>
          <ThemeContext.Consumer>
            {theme => (
              <UserContext.Consumer>
                {user => (
                  <ProfilePage user={user} theme={theme} />
                )}
              </UserContext.Consumer>
            )}
          </ThemeContext.Consumer>
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}
