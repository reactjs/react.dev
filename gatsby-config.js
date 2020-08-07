/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 */

'use strict';

module.exports = {
  siteMetadata: {
    title: 'React: A JavaScript library for building user interfaces',
    siteUrl: 'https://reactjs.org',
    rssFeedTitle: 'React',
    rssFeedDescription: 'A JavaScript library for building user interfaces',
  },
  mapping: {
    'MarkdownRemark.frontmatter.author': 'AuthorYaml',
  },
  plugins: [
    'gatsby-source-react-error-codes',
    'gatsby-transformer-authors-yaml',
    'gatsby-transformer-home-example-code',
    'gatsby-transformer-versions-yaml',
    'gatsby-plugin-netlify',
    'gatsby-plugin-glamor',
    'gatsby-plugin-twitter',
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: '#61dafb',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: `${__dirname}/src/pages`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: `${__dirname}/content/`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-inline-codesandbox',
            options: {
              mode: 'iframe',
              // Whether we generate the sandboxes during build-time
              autoDeploy: process.env.NODE_ENV === 'production',
              query: {
                codemirror: 1,
                fontsize: 14,
                hidenavigation: 1,
                editorsize: 70,
                hidedevtools: 1,
              },
              customTemplates: {
                umd: {
                  extends: 'file:./codesandbox/examples/umd',
                  entry: 'src/index.js',
                },
                simple: {
                  extends: 'file:./codesandbox/examples/simple',
                  entry: 'src/index.js',
                },
                cra: {
                  extends: 'file:./codesandbox/examples/cra',
                  entry: 'src/App.js',
                },
              },
            },
          },
          'gatsby-remark-responsive-iframe',
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 840,
            },
          },
          'gatsby-remark-external-links',
          'gatsby-remark-header-custom-ids',
          {
            resolve: 'gatsby-remark-code-repls',
            options: {
              defaultText: '<b>Try it on CodePen</b>',
              directory: `${__dirname}/examples/`,
              externals: [
                `//unpkg.com/react/umd/react.development.js`,
                `//unpkg.com/react-dom/umd/react-dom.development.js`,
              ],
              dependencies: [`react`, `react-dom`],
              redirectTemplate: `${__dirname}/src/templates/codepen-example.js`,
              target: '_blank',
            },
          },
          {
            resolve: 'gatsby-remark-embed-snippet',
            options: {
              classPrefix: 'gatsby-code-',
              directory: `${__dirname}/examples/`,
            },
          },
          'gatsby-remark-use-jsx',
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'gatsby-code-',
            },
          },
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-41298772-1',
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
         {
          site {
            siteMetadata {
              title: rssFeedTitle
              description: rssFeedDescription
              siteUrl
              site_url: siteUrl
            }
          }
        }`,
        feeds: [
          {
            serialize: ({query: {site, allMarkdownRemark}}) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign(
                  {},
                  {
                    title: edge.node.frontmatter.title,
                    description: edge.node.html,
                    date: require('moment')(edge.node.fields.date).format(
                      'MMMM DD, YYYY, h:mm A',
                    ),
                    url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                    guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  },
                );
              });
            },
            query: `
              {
                  allMarkdownRemark
                  (limit: 10,
                  filter: {fileAbsolutePath: {regex: "/blog/"}},
                  sort: {fields: [fields___date],
                  order: DESC}) {
                    edges {
                      node {
                        fields {
                          date
                          slug
                        }
                        frontmatter {
                          title
                        }
                        html
                      }
                    }
                  }
                }
            `,
            output: '/feed.xml',
          },
        ],
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-catch-links',
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'React Docs',
        short_name: 'React', // eg. React [%LANG_CODE%]
        // Translators: please change this and two above options (see https://www.gatsbyjs.org/packages/gatsby-plugin-manifest/#feature-configuration---optional)
        lang: 'en',
        start_url: '/',
        background_color: '#20232a',
        theme_color: '#20232a',
        display: 'standalone',
        icon: 'static/logo-512x512.png',
        legacy: true,
      },
    },
  ],
};
