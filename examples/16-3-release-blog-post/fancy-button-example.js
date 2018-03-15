class FancyButton extends React.Component {
  buttonRef = React.createRef();

  focus() {
    this.buttonRef.current.focus();
  }

  render() {
    // highlight-next-line
    const {label, theme, ...rest} = this.props;
    // highlight-range{4}
    return (
      <button
        {...rest}
        className={`${theme}-button`}
        ref={this.buttonRef}>
        {label}
      </button>
    );
  }
}

// highlight-next-line
const FancyThemedButton = withTheme(FancyButton);

// We can render FancyThemedButton as if it were a FancyButton
// It will automatically receive the current "theme",
// And the HOC will pass through our other props.
<FancyThemedButton
  label="Click me!"
  onClick={handleClick}
/>;
