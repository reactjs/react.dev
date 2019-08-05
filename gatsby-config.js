/**
 * Copyright (c) 2013-present, Facebook, Inc.
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
    'Mdx.frontmatter.author': 'AuthorYaml',
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
      resolve: 'gatsby-plugin-mdx',
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [
          {resolve: 'gatsby-remark-responsive-iframe'},
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 840,
            },
          },
          {resolve: 'gatsby-remark-external-links'},
          {
            resolve: require.resolve(
              './plugins/gatsby-remark-header-custom-ids',
            ),
          },
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
          {resolve: require.resolve('./plugins/gatsby-remark-use-jsx')},
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'gatsby-code-',
            },
          },
          {resolve: 'gatsby-remark-copy-linked-files'},
          {resolve: 'gatsby-remark-smartypants'},
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
            serialize: ({query: {site, allMdx}}) => {
              return allMdx.edges.map(edge => {
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
                  allMdx
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
  ],
};
