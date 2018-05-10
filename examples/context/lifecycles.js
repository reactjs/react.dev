class Button extends React.Component {
  componentDidMount() {
    // highlight-next-line
    // ThemeContext value is this.props.theme
  }

  componentDidUpdate(prevProps, prevState) {
    // highlight-range{1-2}
    // Previous ThemeContext value is prevProps.theme
    // New ThemeContext value is this.props.theme
  }

  render() {
    const {theme, children} = this.props;
    return (
      <button className={theme ? 'dark' : 'light'}>
        {children}
      </button>
    );
  }
}

// highlight-range{3}
export default props => (
  <ThemeContext.Consumer>
    {theme => <Button {...props} theme={theme} />}
  </ThemeContext.Consumer>
);
