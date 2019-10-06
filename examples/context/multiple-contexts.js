// Theme context, default to light theme
const ThemeContext = React.createContext('light');

// Signed-in user context
const UserContext = React.createContext({
  name: 'Guest',
});

function App(props) {
  const {signedInUser, theme} = props;

  // App component that provides initial context values
  // highlight-range{2-3,5-6}
  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={signedInUser}>
        <Layout />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}

function Layout() {
  return (
    <div>
      <Sidebar />
      <Content />
    </div>
  );
}

// A component may consume multiple contexts
function Content() {
  // highlight-range{1-4}
  const theme = useContext(ThemeContext);
  const user = useContext(UserContext);

  return <ProfilePage user={user} theme={theme} />;
}
