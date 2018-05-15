/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

const {resolve} = require('path');

module.exports = async (params) => {
  const {graphql, boundActionCreators} = params;
  const {createPage, createRedirect} = boundActionCreators;

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

  // TODO Create localized root redirects for each language

  const allMarkdown = await graphql(
    `
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              fields {
                id
                language
                languageCode
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
    let {id, language, languageCode, slug} = fields;

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
        // TODO This should be a utility exposed by gatsby-plugin-crowdin
        if (languageCode != null && path.startsWith('/')) {
          path = `/${languageCode}/${path.substr(1)}`;
        }

        createPage({
          path,
          component: template,
          context: {
            id,
            language,
            languageCode,
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

        redirect.forEach(fromPath => {
          if (fromPath.startsWith('/')) {
            fromPath = fromPath.substr(1);
          }

          const localizedFromPath = `/${languageCode}/${fromPath}`;

          if (redirectToSlugMap[localizedFromPath] != null) {
            console.error(
              `Duplicate redirect detected from "${fromPath}" to:\n` +
                `* ${redirectToSlugMap[localizedFromPath]}\n` +
                `* ${slug}\n`,
            );
            process.exit(1);
          }

          redirectToSlugMap[localizedFromPath] = slug;

          // Create language-aware redirect
          createRedirect({
            fromPath: localizedFromPath,
            toPath: slug,
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
  // Note that blog content is not localized.
  createRedirect({
    fromPath: '/blog/',
    redirectInBrowser: true,
    toPath: newestBlogNode.fields.slug,
  });
};