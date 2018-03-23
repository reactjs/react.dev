const Button = ({theme, children}) => (
  <button className={theme ? 'dark' : 'light'}>
    {children}
  </button>
);

// highlight-range{1,3}
export default React.forwardRef((props, ref) => (
  <ThemeContext.Consumer>
    {theme => <Button {...props} theme={theme} ref={ref} />}
  </ThemeContext.Consumer>
));
