/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import MarkdownPage from 'components/MarkdownPage';
import React from 'react';
import {createLinkCommunity} from 'utils/createLink';
import {sectionListCommunity} from 'utils/sectionList';

import type {MarkdownPageData} from 'types';

const Community = ({data, location}: MarkdownPageData) => (
  <MarkdownPage
    createLink={createLinkCommunity}
    location={location}
    markdownRemark={data.markdownRemark}
    sectionList={sectionListCommunity}
    titlePostfix=" - React"
  />
);

// eslint-disable-next-line no-undef
export const pageQuery = graphql`
  query TemplateCommunityMarkdown($slug: String!) {
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

export default Community;
