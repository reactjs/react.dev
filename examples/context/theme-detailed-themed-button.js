import {ThemeContext} from './theme-context';

function ThemedButton(props) {
  // highlight-range{2-9}
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button
          {this.props}
          style={{backgroundColor: theme.background}}
        />
      )}
    </ThemeContext.Consumer>
  );
}

export default ThemedButton;
