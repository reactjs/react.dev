import PropTypes from 'prop-types';
import React from 'react';

class ThemeProvider extends React.Component {
  // highlight-range{1-3}
  static childContextTypes = {
    theme: PropTypes.string,
  };

  state = {
    theme: 'light',
  };

  // highlight-range{1-5}
  getChildContext() {
    return {
      theme: state.theme,
    };
  }

  render() {
    return this.props.children;
  }
}

class ThemedButton extends React.Component {
  // highlight-range{1-3}
  static contextTypes = {
    theme: PropTypes.string,
  };

  render() {
    // highlight-next-line
    const background = this.context.theme ? '#fff' : '#000';

    return (
      <button style={{background}}>
        {this.props.children}
      </button>
    );
  }
}
