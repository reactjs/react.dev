import ThemeContext from './theme-context';

class ThemedButton extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {theme => (
          <button
            {...this.props}
            style={{backgroundColor: theme.highlight}}
          />
        )}
      </ThemeContext.Consumer>
    );
  }
}

export default ThemedButton;
