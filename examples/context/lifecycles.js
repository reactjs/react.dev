class Button extends React.Component {
  componentDidMount() {
    // highlight-next-line
    alert(this.props.theme);
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
