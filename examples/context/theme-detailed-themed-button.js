import ThemeContext from './theme-context';

class ThemedButton extends React.Component {
  // highlight-range{3-10}
  render() {
    return (
      <ThemeContext.Consumer>
        {theme => (
          <button
            {...this.props}
            style={{backgroundColor: theme.background}}
          />
        )}
      </ThemeContext.Consumer>
    );
  }
}

export default ThemedButton;
