// highlight-range{1-2}
// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
// highlight-range{2-4}
export const ThemeContext = React.createContext({
  theme: themes.dark,
  // optionally you can pass functions that log an error
  toggleTheme: () =>
    console.error('default toggleTheme called'),
});
