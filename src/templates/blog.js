/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */
'use strict';

import React from 'react';
import MarkdownPage from 'components/MarkdownPage';
import {createLinkBlog} from 'utils/createLink';

import type {Edge, MarkdownPageData} from 'types';

type allMarkdownRemarkProps = {
  edges: Array<Edge>,
};

type SectionItem = {
  id: string,
  title: string,
};

type Section = {
  title: string,
  items: Array<SectionItem>,
};

const toSectionList = (
  allMarkdownRemark: allMarkdownRemarkProps,
): Array<Section> => [
  {
    title: 'Recent Posts',
    items: allMarkdownRemark.edges
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

const Blog = ({data, location}: MarkdownPageData) => (
  <MarkdownPage
    authors={data.markdownRemark.frontmatter.author}
    createLink={createLinkBlog}
    date={data.markdownRemark.fields.date}
    location={location}
    ogDescription={data.markdownRemark.excerpt}
    markdownRemark={data.markdownRemark}
    sectionList={toSectionList(data.allMarkdownRemark)}
    titlePostfix=" - React Blog"
  />
);

// eslint-disable-next-line no-undef
export const pageQuery = graphql`
  query TemplateBlogMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
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
    allMarkdownRemark(
      limit: 10
      filter: {id: {regex: "/blog/"}}
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
