/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @flow
 */

import React, {Component} from 'react';
import Container from 'components/Container';
import Layout from 'components/Layout';
import {colors} from 'theme';

type Props = {
  location: Location,
  pageContext: {|
    action: string,
    payload: string,
  |},
};

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

class CodepenExample extends Component<Props> {
  _form: HTMLFormElement | null = null;

  componentDidMount() {
    ((this._form: any): HTMLFormElement).submit();
  }

  render() {
    const {location, pageContext} = this.props;
    const {action, payload} = pageContext;

    return (
      <Layout location={location}>
        <Container>
          <h1>Redirecting to Codepen...</h1>
          <form
            style={{paddingBottom: '50px'}}
            ref={form => {
              this._form = form;
            }}
            action={action}
            method="POST">
            <input type="hidden" name="data" value={payload} />

            <p>
              Not automatically redirecting?
              <br />
              <br />
              <input style={primaryStyle} type="submit" value="Click here" />
            </p>
          </form>
        </Container>
      </Layout>
    );
  }
}

export default CodepenExample;
