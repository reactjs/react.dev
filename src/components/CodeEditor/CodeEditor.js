/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Remarkable from 'remarkable';
// TODO: switch back to the upstream version of react-live
// once https://github.com/FormidableLabs/react-live/issues/37 is fixed.
import {LiveEditor, LiveProvider} from '@gaearon/react-live';
import {colors, media} from 'theme';
import MetaTitle from 'templates/components/MetaTitle';

const compileES5 = (
  code, // eslint-disable-next-line no-undef
) => Babel.transform(code, {presets: ['es2015', 'react']}).code;

// eslint-disable-next-line no-undef
const compileES6 = code => Babel.transform(code, {presets: ['react']}).code;

class CodeEditor extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = this._updateState(props.code);
    this.state.showJSX = true;
  }

  componentDidMount() {
    // Initial render() will always be a no-op,
    // Because the mountNode ref won't exist yet.
    this._render();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.compiled !== this.state.compiled) {
      this._render();
    }
  }

  render() {
    const {children} = this.props;
    const {
      compiledES6,
      code,
      error,
      showBabelErrorMessage,
      showJSX,
    } = this.state;

    let errorMessage;
    if (showBabelErrorMessage) {
      errorMessage = (
        <span>
          Babel could not be loaded.
          <br />
          <br />
          This can be caused by an ad blocker. If you're using one, consider
          adding reactjs.org to the whitelist so the live code examples will
          work.
        </span>
      );
    } else if (error != null) {
      errorMessage = error.message;
    }

    return (
      <LiveProvider code={showJSX ? code : compiledES6} mountStylesheet={false}>
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

          <div
            css={{
              [media.greaterThan('medium')]: {
                flex: '0 0 67%',
                display: 'flex',
                alignItems: 'stretch',
                flexDirection: 'row',
              },

              [media.lessThan('small')]: {
                display: 'block',
              },
            }}>
            <div
              css={{
                flex: '0 0 70%',
                overflow: 'hidden',
                borderRadius: '10px 0 0 10px',

                [media.lessThan('medium')]: {
                  borderRadius: '10px 10px 0 0',
                },
              }}>
              <div
                css={{
                  padding: '0px 10px',
                  background: colors.darker,
                  color: colors.white,
                }}>
                <MetaTitle onDark={true}>
                  Live JSX Editor
                  <label
                    css={{
                      fontSize: 14,
                      float: 'right',
                      cursor: 'pointer',
                    }}>
                    <input
                      checked={this.state.showJSX}
                      onChange={event =>
                        this.setState({showJSX: event.target.checked})}
                      type="checkbox"
                    />{' '}
                    JSX?
                  </label>
                </MetaTitle>
              </div>
              <div
                css={{
                  height: '100%',
                  width: '100%',
                  borderRadius: '0',
                  maxHeight: '340px !important',
                  marginTop: '0 !important',
                  marginLeft: '0 !important',
                  paddingLeft: '0 !important',
                  marginRight: '0 !important',
                  paddingRight: '0 !important',
                  marginBottom: '0 !important',
                  paddingBottom: '20px !important',
                  [media.lessThan('medium')]: {
                    marginBottom: '0 !important',
                  },

                  '& pre.prism-code[contenteditable]': {
                    outline: 0,
                    overflow: 'auto',
                    marginRight: '0 !important',
                    marginBottom: '0 !important',
                  },
                }}
                className="gatsby-highlight">
                <LiveEditor onChange={this._onChange} />
              </div>
            </div>
            {error && (
              <div
                css={{
                  flex: '0 0 30%',
                  overflow: 'hidden',
                  border: `1px solid ${colors.error}`,
                  borderRadius: '0 10px 10px 0',
                  fontSize: 12,
                  lineHeight: 1.5,

                  [media.lessThan('medium')]: {
                    borderRadius: '0 0 10px 10px',
                  },
                }}>
                <div
                  css={{
                    padding: '0px 10px',
                    background: colors.error,
                    color: colors.white,
                  }}>
                  <MetaTitle
                    cssProps={{
                      color: colors.white,
                    }}>
                    Error
                  </MetaTitle>
                </div>
                <pre
                  css={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: colors.error,
                    padding: 10,
                  }}>
                  {errorMessage}
                </pre>
              </div>
            )}
            {!error && (
              <div
                css={{
                  flex: '0 0 30%',
                  overflow: 'hidden',
                  border: `1px solid ${colors.divider}`,
                  borderRadius: '0 10px 10px 0',

                  [media.lessThan('medium')]: {
                    borderRadius: '0 0 10px 10px',
                  },
                }}>
                <div
                  css={{
                    padding: '0 10px',
                    backgroundColor: colors.divider,
                  }}>
                  <MetaTitle>Result</MetaTitle>
                </div>
                <div
                  css={{
                    padding: 10,
                    maxHeight: '340px !important',
                    overflow: 'auto',

                    '& input': {
                      width: '100%',
                      display: 'block',
                      border: '1px solid #ccc', // TODO
                      padding: 5,
                    },

                    '& button': {
                      marginTop: 10,
                      padding: '5px 10px',
                    },

                    '& textarea': {
                      width: '100%',
                      marginTop: 10,
                      height: 60,
                      padding: 5,
                    },
                  }}
                  ref={this._setMountRef}
                />
              </div>
            )}
          </div>
        </div>
      </LiveProvider>
    );
  }

  _render() {
    if (!this._mountNode) {
      return;
    }

    const {compiled} = this.state;

    try {
      // Example code requires React, ReactDOM, and Remarkable to be within scope.
      // It also requires a "mountNode" variable for ReactDOM.render()
      // eslint-disable-next-line no-new-func
      new Function('React', 'ReactDOM', 'Remarkable', 'mountNode', compiled)(
        React,
        ReactDOM,
        Remarkable,
        this._mountNode,
      );
    } catch (error) {
      console.error(error);

      this.setState({
        compiled: null,
        error,
      });
    }
  }

  _setMountRef = ref => {
    this._mountNode = ref;
  };

  _updateState(code, showJSX = true) {
    try {
      let newState = {
        compiled: compileES5(code),
        error: null,
      };

      if (showJSX) {
        newState.code = code;
        newState.compiledES6 = compileES6(code);
      } else {
        newState.compiledES6 = code;
      }

      return newState;
    } catch (error) {
      console.error(error);

      // Certain ad blockers (eg Fair AdBlocker) prevent Babel from loading.
      // If we suspect this is the case, we can show a more helpful error.
      const showBabelErrorMessage = !window.Babel;

      return {
        compiled: null,
        error,
        showBabelErrorMessage,
      };
    }
  }

  _onChange = code => {
    this.setState(state => this._updateState(code, state.showJSX));
  };
}

export default CodeEditor;
