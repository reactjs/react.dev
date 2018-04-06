import {ThemeContext} from './theme-context';

function ThemeTogglerButton() {
  // highlight-range{1}
  // The Theme Toggler Button receives not only the theme but also a toggleTheme funtion from the context
  // highlight-range{3}
  return (
    <ThemeContext.Consumer>
      {({theme, toggleTheme}) => (
        <button
          onClick={toggleTheme}
          style={{backgroundColor: theme.background}}>
          Toggle Theme
        </button>
      )}
    </ThemeContext.Consumer>
  );
}

export default ThemeTogglerButton;
