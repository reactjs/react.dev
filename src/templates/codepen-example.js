'use strict';

import React, {Component} from 'react';
import Container from 'components/Container';
import {colors} from 'theme';
// import {version} from '../site-constants';

// Copied over styles from ButtonLink for the submit btn
const primaryStyle = {
  backgroundColor: colors.brand,
  color: colors.black,
  padding: '10px 25px',
  whiteSpace: 'nowrap',
  transition: 'background-color 0.2s ease-out',
  outline: 0,
  border: 'none',
  cursor: 'pointer',

  ':hover': {
    backgroundColor: colors.white,
  },

  display: 'inline-block',
  fontSize: 16,
};

class CodepenExample extends Component {
  componentDidMount() {
    this.codepenForm.submit();
  }

  render() {
    const {payload} = this.props.pathContext;
    // Set codepen options
    payload.js_pre_processor = 'babel';
    // Only have the JS editor open (default for all examples)
    payload.editors = '0010';
    // We can pass @version in the URL for version locking, if desired.
    payload.js_external = `https://unpkg.com/react/umd/react.development.js;https://unpkg.com/react-dom/umd/react-dom.development.js`;

    return (
      <Container>
        <h1>Redirecting to Codepen...</h1>
        <form
          style={{paddingBottom: '50px'}}
          ref={form => {
            this.codepenForm = form;
          }}
          action="https://codepen.io/pen/define"
          method="POST">
          <input type="hidden" name="data" value={JSON.stringify(payload)} />

          <input
            style={primaryStyle}
            type="submit"
            value="Not automatically redirecting? Click here."
          />
        </form>
      </Container>
    );
  }
}

export default CodepenExample;
