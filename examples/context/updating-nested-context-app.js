import {ThemeContext, themes} from './theme-context';
import ThemeTogglerButton from './theme-toggler-button';

function App() {
  // highlight-range{1-2}
  // State also contains the updater function so it will
  // be passed down into the context provider
  const [state, setState] = useState({
    theme: themes.light,
    toggleTheme,
  });

  function toggleTheme() {
    setState(state => ({
      ...state,
      theme:
        state.theme === themes.dark
          ? themes.light
          : themes.dark,
    }));
  }

  // highlight-range{1,3}
  // The entire state is passed to the provider
  return (
    <ThemeContext.Provider value={state}>
      <Content />
    </ThemeContext.Provider>
  );
}

function Content() {
  return (
    <div>
      <ThemeTogglerButton />
    </div>
  );
}

ReactDOM.render(<App />, document.root);
