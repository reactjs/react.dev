/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

const {resolve} = require('path');
const {getLanguageCodeFromPath} = require('../plugins/gatsby-plugin-crowdin/utils');

// TODO Read these values from the gatbsy-config rather than duplicating them
const DEFAULT_LANGUAGE_CODE = 'en';

module.exports = async (params) => {
  const {graphql, boundActionCreators} = params;
  const {createRedirect} = boundActionCreators; // TODO?

  const pluginConfig = {defaultLanguageCode: DEFAULT_LANGUAGE_CODE};
  const createPage = require('../plugins/gatsby-plugin-crowdin/createPage')(params, pluginConfig);
  //const createRedirect = require('../plugins/gatsby-plugin-crowdin/createRedirect')(params, pluginConfig);

  // Used to detect and prevent duplicate redirects
  const redirectToSlugMap = {};

  const blogTemplate = resolve(__dirname, '../src/templates/blog.js');
  const communityTemplate = resolve(__dirname, '../src/templates/community.js');
  const docsTemplate = resolve(__dirname, '../src/templates/docs.js');
  const tutorialTemplate = resolve(__dirname, '../src/templates/tutorial.js');

  // Redirect /index.html to root.
  createRedirect({
    fromPath: '/index.html',
    redirectInBrowser: true,
    toPath: '/',
  });

  // TODO Create localized pages/index for each language
  // TODO Netlify language redirect for home page

  const allMarkdown = await graphql(
    `
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              fields {
                path
                redirect
                slug
              }
            }
          }
        }
      }
    `,
  );

  if (allMarkdown.errors) {
    console.error(allMarkdown.errors);

    throw Error(allMarkdown.errors);
  }

  allMarkdown.data.allMarkdownRemark.edges.forEach(edge => {
    const {fields} = edge.node;
    const {path, slug} = fields;

    // Parse language code from path for Crowdin content.
    // Fall back to English as the default.
    const languageCode = getLanguageCodeFromPath(path) || DEFAULT_LANGUAGE_CODE;

    if (slug === 'docs/error-decoder.html') {
      // No-op so far as markdown templates go.
      // Error codes are managed by a page in src/pages
      // (which gets created by Gatsby during a separate phase).
    } else if (
      slug.includes('blog/') ||
      slug.includes('community/') ||
      slug.includes('contributing/') ||
      slug.includes('docs/') ||
      slug.includes('tutorial/') ||
      slug.includes('warnings/')
    ) {
      let template;
      if (slug.includes('blog/')) {
        template = blogTemplate;
      } else if (slug.includes('community/')) {
        template = communityTemplate;
      } else if (
        slug.includes('contributing/') ||
        slug.includes('docs/') ||
        slug.includes('warnings/')
      ) {
        template = docsTemplate;
      } else if (slug.includes('tutorial/')) {
        template = tutorialTemplate;
      }

      const createArticlePage = path => {
        createPage({
          path,
          component: template,
          context: {
            slug,
          },
        });
      };

      // Register primary URL.
      createArticlePage(slug);

      // Register redirects as well if the markdown specifies them.
      if (fields.redirect) {
        let redirect = JSON.parse(edge.node.fields.redirect);
        if (!Array.isArray(redirect)) {
          redirect = [redirect];
        }

        if (redirectToSlugMap[languageCode] === undefined) {
          redirectToSlugMap[languageCode] = {};
        }

        // Extract language code (eg "zn") from language & region code strings (eg "zn-CH").
        // TODO Use helper function in gatsby-plugin-crowdin
        const language = languageCode.indexOf('-')
          ? languageCode.split('-')[0]
          : languageCode;

        redirect.forEach(fromPath => {
          if (redirectToSlugMap[languageCode][fromPath] != null) {
            console.error(
              `Duplicate redirect detected from "${fromPath}" to:\n` +
                `* ${redirectToSlugMap[languageCode][fromPath]}\n` +
                `* ${slug}\n`,
            );
            process.exit(1);
          }

          redirectToSlugMap[languageCode][fromPath] = slug;

          // Create language-aware redirect
          createRedirect({
            fromPath,
            toPath: `/${languageCode}/${slug}`,
            redirectInBrowser: true,
            Language: language,
          });
        });
      }
    }
  });

  const newestBlogEntry = await graphql(
    `
      {
        allMarkdownRemark(
          limit: 1
          filter: {id: {regex: "/blog/"}}
          sort: {fields: [fields___date], order: DESC}
        ) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `,
  );
  const newestBlogNode = newestBlogEntry.data.allMarkdownRemark.edges[0].node;

  // Blog landing page should always show the most recent blog entry.
  // TODO Setup redirets for each language code too.
  createRedirect({
    fromPath: '/blog/',
    redirectInBrowser: true,
    toPath: newestBlogNode.fields.slug,
  });
};