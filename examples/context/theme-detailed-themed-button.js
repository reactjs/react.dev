import {ThemeContext} from './theme-context';

class ThemedButton extends React.Component {
  // highlight-range{3,12}
  render() {
    let props = this.props;
    let theme = this.context;
    return (
      <button
        {...props}
        style={{
          backgroundColor: theme.background,
          color: theme.foreground,
        }}
      />
    );
  }
}
ThemedButton.contextType = ThemeContext;

export default ThemedButton;
