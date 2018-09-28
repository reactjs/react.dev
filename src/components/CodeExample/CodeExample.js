import React, { Component } from 'react';
import {colors, media} from 'theme';
import CodeEditor from '../CodeEditor/CodeEditor';

class CodeExample extends Component {
  render() {
    const {children, code, loaded} = this.props;
    return (
      <div
      css={{
        [media.greaterThan('xlarge')]: {
          display: 'flex',
          flexDirection: 'row',
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
          {loaded ? <CodeEditor code={code} /> : <h4>Loading code example...</h4>}
      </div>
    )
  }
}

export default CodeExample;
