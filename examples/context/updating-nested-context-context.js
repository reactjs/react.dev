// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
// highlight-range{2-3}
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
