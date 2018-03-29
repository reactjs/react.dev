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

// highlight-range{1-3}
export const ThemeContext = React.createContext(
  themes.dark // default value
);
