// Theme context, default to light theme
// highlight-next-line
const ThemeContext = React.createContext('light');

// Signed-in user context
// highlight-next-line
const UserContext = React.createContext();

// An intermediate component that depends on both contexts
function Toolbar(props) {
  // highlight-range{2-10}
  return (
    <ThemeContext.Consumer>
      {theme => (
        <UserContext.Consumer>
          {user => (
            <ProfilePage user={user} theme={theme} />
          )}
        </UserContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
}

class App extends React.Component {
  render() {
    const {signedInUser, theme} = this.props;

    // App component that provides initial context values
    // highlight-range{2-3,5-6}
    return (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={signedInUser}>
          <Toolbar />
        </UserContext.Provider>
      </ThemeContext.Provider>
    );
  }
}
