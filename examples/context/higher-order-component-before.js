const ThemeContext = React.createContext('light');

function ThemedButton(props) {
  // highlight-range{2-4}
  return (
    <ThemeContext.Consumer>
      {theme => <button className={theme} {...props} />}
    </ThemeContext.Consumer>
  );
}
