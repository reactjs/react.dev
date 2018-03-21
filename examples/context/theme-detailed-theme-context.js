export const themes = {
  light: {
    foreground: '#ffffff',
    background: '#222222',
  },
  dark: {
    foreground: '#000000',
    background: '#eeeeee',
  },
};

// highlight-next-line
const ThemeContext = React.createContext(themes.dark);

export default ThemeContext;
