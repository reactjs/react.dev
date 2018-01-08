/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import MarkdownPage from 'components/MarkdownPage';
import React from 'react';
import {createLinkDocs} from 'utils/createLink';
import {sectionListDocs} from 'utils/sectionList';

import type {MarkdownPageData} from 'types';

const Docs = ({data, location}: MarkdownPageData) => (
  <MarkdownPage
    createLink={createLinkDocs}
    location={location}
    markdownRemark={data.markdownRemark}
    sectionList={sectionListDocs}
    titlePostfix=" - React"
  />
);

// eslint-disable-next-line no-undef
export const pageQuery = graphql`
  query TemplateDocsMarkdown($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      html
      frontmatter {
        title
        next
        prev
      }
      fields {
        path
        slug
      }
    }
  }
`;

export default Docs;
