/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

import ButtonLink from 'components/ButtonLink';
import Container from 'components/Container';
import Flex from 'components/Flex';
import mountCodeExample from 'utils/mountCodeExample';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import TitleAndMetaTags from 'components/TitleAndMetaTags';
import {colors, media, sharedStyles} from 'theme';
import createOgUrl from 'utils/createOgUrl';
import loadScript from 'utils/loadScript';
import {babelURL} from 'site-constants';
import ReactDOM from 'react-dom';

class Home extends Component {
  componentDidMount() {
    renderExamplePlaceholder('helloExample');
    renderExamplePlaceholder('timerExample');
    renderExamplePlaceholder('todoExample');
    renderExamplePlaceholder('markdownExample');

    function mountCodeExamples() {
      mountCodeExample('helloExample', HELLO_COMPONENT);
      mountCodeExample('timerExample', TIMER_COMPONENT);
      mountCodeExample('todoExample', TODO_COMPONENT);
      mountCodeExample('markdownExample', MARKDOWN_COMPONENT);
    }

    loadScript(babelURL).then(mountCodeExamples, error => {
      console.error('Babel failed to load.');

      mountCodeExamples();
    });
  }

  render() {
    const {data} = this.props;
    const title = 'React - A JavaScript library for building user interfaces';
    const marketingContent = data.marketing.edges.map(edge => ({
      title: edge.node.frontmatter.title,
      content: edge.node.html,
    }));
    const examplesContent = data.examples.edges.map(edge => ({
      title: edge.node.frontmatter.title,
      name: edge.node.frontmatter.example_name,
      content: edge.node.html,
    }));

    return (
      <div css={{width: '100%'}}>
        <TitleAndMetaTags title={title} ogUrl={createOgUrl('index.html')} />
        <header
          css={{
            backgroundColor: colors.dark,
            color: colors.white,
          }}>
          <div
            css={{
              paddingTop: 45,
              paddingBottom: 20,

              [media.greaterThan('small')]: {
                paddingTop: 60,
                paddingBottom: 70,
              },

              [media.greaterThan('xlarge')]: {
                paddingTop: 95,
                paddingBottom: 85,
                maxWidth: 1500, // Positioning of background logo
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundImage: 'url(/large-logo.svg)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: '100% 100px',
                backgroundSize: '50% auto',
              },
            }}>
            <Container>
              <h1
                css={{
                  color: colors.brand,
                  textAlign: 'center',
                  margin: 0,
                  fontSize: 45,
                  letterSpacing: '0.01em',
                  [media.size('xsmall')]: {
                    fontSize: 30,
                  },
                  [media.greaterThan('xlarge')]: {
                    fontSize: 60,
                  },
                }}>
                React
              </h1>
              <p
                css={{
                  paddingTop: 15,
                  textAlign: 'center',
                  fontSize: 24,
                  letterSpacing: '0.01em',
                  fontWeight: 200,

                  [media.size('xsmall')]: {
                    fontSize: 16,
                    maxWidth: '12em',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  },

                  [media.greaterThan('xlarge')]: {
                    paddingTop: 20,
                    fontSize: 30,
                  },
                }}>
                A JavaScript library for building user interfaces
              </p>
              <Flex
                valign="center"
                css={{
                  paddingTop: 40,

                  [media.greaterThan('xlarge')]: {
                    paddingTop: 65,
                  },
                }}>
                <CtaItem>
                  <ButtonLink to="/docs/hello-world.html" type="primary">
                    Get Started
                  </ButtonLink>
                </CtaItem>
                <CtaItem>
                  <ButtonLink to="/tutorial/tutorial.html" type="secondary">
                    Take the Tutorial
                  </ButtonLink>
                </CtaItem>
              </Flex>
            </Container>
          </div>
        </header>

        <Container>
          <div css={sharedStyles.markdown}>
            <section
              css={[
                sectionStyles,
                {
                  [media.lessThan('medium')]: {
                    marginTop: 0,
                    marginBottom: 0,
                    overflowX: 'auto',
                    paddingTop: 30,
                    WebkitOverflowScrolling: 'touch',
                    position: 'relative',
                    maskImage:
                      'linear-gradient(to right, transparent, white 10px, white 90%, transparent)',
                  },
                },
              ]}>
              <div
                css={{
                  display: 'flex',
                  flexDirection: 'row',

                  [media.lessThan('medium')]: {
                    display: 'block',
                    whiteSpace: 'nowrap',
                  },
                }}>
                {marketingContent.map((column, index) => (
                  <div
                    key={index}
                    css={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: '0 1 33%',
                      marginLeft: 40,

                      '&:first-of-type': {
                        marginLeft: 0,

                        [media.lessThan('medium')]: {
                          marginLeft: 10,
                        },
                      },

                      [media.lessThan('medium')]: {
                        display: 'inline-block',
                        verticalAlign: 'top',
                        marginLeft: 0,
                        whiteSpace: 'normal',
                        width: '75%',
                        marginRight: 20,
                        paddingBottom: 40,

                        '&:first-of-type': {
                          marginTop: 0,
                        },
                      },
                    }}>
                    <h3
                      css={[
                        headingStyles,
                        {
                          '&&': {
                            // Make specificity higher than the site-wide h3 styles.
                            color: colors.subtle,
                            paddingTop: 0,
                            fontWeight: 300,
                            fontSize: 20,

                            [media.greaterThan('xlarge')]: {
                              fontSize: 24,
                              fontWeight: 200,
                            },
                          },
                        },
                      ]}>
                      {column.title}
                    </h3>
                    <div dangerouslySetInnerHTML={{__html: column.content}} />
                  </div>
                ))}
              </div>
            </section>
            <hr
              css={{
                height: 1,
                marginBottom: -1,
                border: 'none',
                borderBottom: `1 solid ${colors.divider}`,
              }}
            />
            <section css={sectionStyles}>
              <div id="examples">
                {examplesContent.map((example, index) => (
                  <div
                    key={index}
                    css={{
                      marginTop: 40,

                      '&:first-child': {
                        marginTop: 0,
                      },

                      [media.greaterThan('xlarge')]: {
                        marginTop: 80,
                      },
                    }}>
                    <h3 css={headingStyles}>{example.title}</h3>
                    <div dangerouslySetInnerHTML={{__html: example.content}} />
                    <div id={example.name} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </Container>

        <section
          css={{
            background: colors.dark,
            color: colors.white,
            paddingTop: 45,
            paddingBottom: 45,
          }}>
          <Container>
            <Flex valign="center">
              <CtaItem>
                <ButtonLink to="/docs/hello-world.html" type="primary">
                  Get Started
                </ButtonLink>
              </CtaItem>
              <CtaItem>
                <ButtonLink to="/tutorial/tutorial.html" type="secondary">
                  Take the Tutorial
                </ButtonLink>
              </CtaItem>
            </Flex>
          </Container>
        </section>
      </div>
    );
  }
}

Home.propTypes = {
  data: PropTypes.shape({
    marketing: PropTypes.object.isRequired,
    examples: PropTypes.object.isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
};

// TODO Improve this temporarily placeholder as part of
// converting the home page from markdown template to a Gatsby
// page (see issue #2)
function renderExamplePlaceholder(containerId) {
  ReactDOM.render(
    <h4>Loading code example...</h4>,
    document.getElementById(containerId),
  );
}

const CtaItem = ({children, primary = false}) => (
  <div
    css={{
      width: '50%',

      [media.between('small', 'large')]: {
        paddingLeft: 20,
      },

      [media.greaterThan('xlarge')]: {
        paddingLeft: 40,
      },

      '&:first-child': {
        textAlign: 'right',
        paddingRight: 15,
      },

      '&:nth-child(2)': {
        [media.greaterThan('small')]: {
          paddingLeft: 15,
        },
      },
    }}>
    {children}
  </div>
);

// eslint-disable-next-line no-undef
export const pageQuery = graphql`
  query IndexMarkdown {
    marketing: allMarkdownRemark(
      filter: {id: {regex: "//marketing//"}}
      sort: {fields: [frontmatter___order], order: ASC}
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          html
        }
      }
    }
    examples: allMarkdownRemark(
      filter: {id: {regex: "//examples//"}}
      sort: {fields: [frontmatter___order], order: ASC}
    ) {
      edges {
        node {
          frontmatter {
            title
            example_name
          }
          html
        }
      }
    }
  }
`;

export default Home;

const sectionStyles = {
  marginTop: 20,
  marginBottom: 15,

  [media.greaterThan('medium')]: {
    marginTop: 60,
    marginBottom: 65,
  },
};

const headingStyles = {
  '&&': {
    marginBottom: 20,
  },
};

// TODO Move these hard-coded examples into example files and out of the template?
// Alternately, move them into the markdown and transform them during build?
// This could be done via a new Gatsby transform plug-in that auto-converts to runnable REPLs?
const name = Math.random() > 0.5 ? 'John' : 'Jane';
const HELLO_COMPONENT = `
class HelloMessage extends React.Component {
  render() {
    return (
      <div>
        Hello {this.props.name}
      </div>
    );
  }
}

ReactDOM.render(
  <HelloMessage name="${name}" />,
  mountNode
);
`.trim();

const TIMER_COMPONENT = `
class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seconds: 0 };
  }

  tick() {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        Seconds: {this.state.seconds}
      </div>
    );
  }
}

ReactDOM.render(<Timer />, mountNode);
`.trim();

var TODO_COMPONENT = `
class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], text: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <h3>TODO</h3>
        <TodoList items={this.state.items} />
        <form onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button>
            Add #{this.state.items.length + 1}
          </button>
        </form>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.text.length) {
      return;
    }
    const newItem = {
      text: this.state.text,
      id: Date.now()
    };
    this.setState(prevState => ({
      items: prevState.items.concat(newItem),
      text: ''
    }));
  }
}

class TodoList extends React.Component {
  render() {
    return (
      <ul>
        {this.props.items.map(item => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    );
  }
}

ReactDOM.render(<TodoApp />, mountNode);
`.trim();

var MARKDOWN_COMPONENT = `
class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = { value: 'Type some *markdown* here!' };
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  getRawMarkup() {
    const md = new Remarkable();
    return { __html: md.render(this.state.value) };
  }

  render() {
    return (
      <div className="MarkdownEditor">
        <h3>Input</h3>
        <textarea
          onChange={this.handleChange}
          defaultValue={this.state.value}
        />
        <h3>Output</h3>
        <div
          className="content"
          dangerouslySetInnerHTML={this.getRawMarkup()}
        />
      </div>
    );
  }
}

ReactDOM.render(<MarkdownEditor />, mountNode);
`.trim();
