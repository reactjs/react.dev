/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import React from 'react';
import {graphql} from 'gatsby';
import Layout from 'components/Layout';
import MarkdownPage from 'components/MarkdownPage';
import {createLinkBlog} from 'utils/createLink';

const toSectionList = allMdx => [
  {
    title: 'Recent Posts',
    items: allMdx.edges
      .map(({node}) => ({
        id: node.fields.slug,
        title: node.frontmatter.title,
      }))
      .concat({
        id: '/blog/all.html',
        title: 'All posts ...',
      }),
  },
];

const Blog = ({data, location}) => (
  <Layout location={location}>
    <MarkdownPage
      authors={data.mdx.frontmatter.author}
      createLink={createLinkBlog}
      date={data.mdx.fields.date}
      location={location}
      ogDescription={data.mdx.excerpt}
      mdx={data.mdx}
      sectionList={toSectionList(data.allMdx)}
      titlePostfix=" &ndash; React Blog"
    />
  </Layout>
);

export const pageQuery = graphql`
  query TemplateBlogMarkdown($slug: String!) {
    mdx(fields: {slug: {eq: $slug}}) {
      body
      excerpt(pruneLength: 500)
      frontmatter {
        title
        next
        prev
        author {
          frontmatter {
            name
            url
          }
        }
      }
      fields {
        date(formatString: "MMMM DD, YYYY")
        path
        slug
      }
    }
    allMdx(
      limit: 10
      filter: {fileAbsolutePath: {regex: "/blog/"}}
      sort: {fields: [fields___date], order: DESC}
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default Blog;
