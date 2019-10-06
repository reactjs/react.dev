import {ThemeContext, themes} from './theme-context';
import ThemedButton from './themed-button';

// An intermediate component that uses the ThemedButton
function Toolbar(props) {
  return (
    <ThemedButton onClick={props.changeTheme}>
      Change Theme
    </ThemedButton>
  );
}

function App() {
  const [theme, setTheme] = useState(themes.light);

  function toggleTheme() {
    setTheme(
      theme =>
        theme === themes.dark ? themes.light : themes.dark
    );
  }

  //highlight-range{1-3}
  // The ThemedButton button inside the ThemeProvider
  // uses the theme from state while the one outside uses
  // the default dark theme
  //highlight-range{3-5,7}
  return (
    <Page>
      <ThemeContext.Provider value={theme}>
        <Toolbar changeTheme={toggleTheme} />
      </ThemeContext.Provider>
      <Section>
        <ThemedButton />
      </Section>
    </Page>
  );
}

ReactDOM.render(<App />, document.root);
