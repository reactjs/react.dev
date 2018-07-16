export const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};

// highlight-range{1-3}
export const ThemeContext = React.createContext(
  themes.dark // default value
);
