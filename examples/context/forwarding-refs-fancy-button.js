class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// Use context to pass the current "theme" to FancyButton.
// Use forwardRef to pass refs to FancyButton as well.
// highlight-range{1,3}
export default React.forwardRef((props, ref) => (
  <ThemeContext.Consumer>
    {theme => (
      <FancyButton {...props} theme={theme} ref={ref} />
    )}
  </ThemeContext.Consumer>
));
