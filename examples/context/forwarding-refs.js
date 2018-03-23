const Button = ({theme, children}) => (
  <button className={theme ? 'dark' : 'light'}>
    {children}
  </button>
);

export default React.forwardRef((props, ref) => (
  <ThemeContext.Consumer>
    {theme => <Button {...props} theme={theme} ref={ref} />}
  </ThemeContext.Consumer>
));
