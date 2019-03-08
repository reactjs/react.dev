import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {colors, media} from 'theme';
import CodeEditor from '../CodeEditor/CodeEditor';

class CodeExample extends Component {
  render() {
    const {children, code, id, containerNodeID, loaded} = this.props;
    return (
      <div
        id={id}
        css={{
          marginTop: 40,

          '&:first-child': {
            marginTop: 0,
          },

          '& .react-live': {
            width: '100%',
          },

          [media.greaterThan('xlarge')]: {
            display: 'flex',
            flexDirection: 'row',
            marginTop: 80,
          },

          [media.lessThan('large')]: {
            display: 'block',
          },
        }}>
        {children && (
          <div
            css={{
              flex: '0 0 33%',
              [media.lessThan('xlarge')]: {
                marginBottom: 20,
              },

              '& h3': {
                color: colors.dark,
                maxWidth: '11em',
                paddingTop: 0,
              },

              '& p': {
                marginTop: 15,
                marginRight: 40,
                lineHeight: 1.7,

                [media.greaterThan('xlarge')]: {
                  marginTop: 25,
                },
              },
            }}>
            {children}
          </div>
        )}
        {loaded ? (
          <CodeEditor code={code} containerNodeID={containerNodeID} />
        ) : (
          <h4>Loading code example...</h4>
        )}
      </div>
    );
  }
}

CodeExample.propTypes = {
  children: PropTypes.node,
  code: PropTypes.string.isRequired,
  loaded: PropTypes.bool.isRequired,
};

export default CodeExample;
