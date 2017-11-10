/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

const {resolve} = require('path');

const DEFAULT_LANGUAGE_CODE = 'en'

// TODO Copy this helper method into a shared util
const getLanguageCodeFromPath = path => {
  const match = path.match(/^([a-z]{2}|[a-z]{2}-[A-Z]+)\//);

  return match ? match[1] : null;
}

// TODO Create Remark parser that adds language prefix to markdown links

// TODO Decide how we handle Gatsby website links?
// Maybe attach a language code field to GraphQL so we can pass it to templates,
// So it can be evaluated dynamically at build time to generate links that are static at runtime?

module.exports = async ({graphql, boundActionCreators}) => {
  const {createPage, createRedirect} = boundActionCreators;

  // Used to detect and prevent duplicate redirects
  const redirectToSlugMap = {};

  const blogTemplate = resolve(__dirname, '../src/templates/blog.js');
  const communityTemplate = resolve(__dirname, '../src/templates/community.js');
  const docsTemplate = resolve(__dirname, '../src/templates/docs.js');
  const tutorialTemplate = resolve(__dirname, '../src/templates/tutorial.js');

  // Redirect /index.html to root.
  // TODO Setup redirects for each language code too (eg '/zn-CH/index.html' => '/zn-CH/').
  createRedirect({
    fromPath: '/index.html',
    redirectInBrowser: true,
    toPath: '/',
  });

  // TODO Maybe redirect naked root / to a page that checks browser language
  // And auto-redirects to user's specific /<language>/index.html

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
        path = path.replace(/^\//, '');

        const localizedPath = `/${languageCode}/${path}`;

        createPage({
          path: localizedPath,
          component: template,
          context: {
            slug,
          },
        });

        // TODO Create these redirects in a format that allows Netlify to insert language code.
        // Daniel mentioned that should be possible in a comment on #82.
        // We only need to create redirect once.

        // Create redirect without locale if languageCode is default.
        // This allows us to support backwards compatible links (pre-localization)
        if (languageCode === DEFAULT_LANGUAGE_CODE) {
          createRedirect({
            fromPath: `/${path}`,
            redirectInBrowser: true,
            toPath: localizedPath,
          });
        }
      }

      // Register primary URL.
      createArticlePage(slug);

      // Register redirects as well if the markdown specifies them.
      if (fields.redirect) {
        let redirect = JSON.parse(edge.node.fields.redirect);
        if (!Array.isArray(redirect)) {
          redirect = [redirect];
        }

        redirect.forEach(fromPath => {
          fromPath = `${languageCode}/${fromPath}`;

          // A leading "/" is required for redirects to work,
          // But multiple leading "/" will break redirects.
          // For more context see github.com/reactjs/reactjs.org/pull/194
          const toPath = `/${languageCode}/${slug.replace(/^\//, '')}`;

          if (redirectToSlugMap[fromPath] != null) {
            console.error(
              `Duplicate redirect detected from "${fromPath}" to:\n` +
                `* ${redirectToSlugMap[fromPath]}\n` +
                `* ${slug}\n`,
            );
            process.exit(1);
          }

          redirectToSlugMap[fromPath] = toPath;

          createRedirect({
            fromPath,
            redirectInBrowser: true,
            toPath,
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