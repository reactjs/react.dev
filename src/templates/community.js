/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 */

import MarkdownPage from 'components/MarkdownPage';
import React from 'react';
import {graphql} from 'gatsby';
import Layout from 'components/Layout';
import {createLinkCommunity} from 'utils/createLink';
import {sectionListCommunity} from 'utils/sectionList';

const Community = ({data, location}) => (
  <Layout location={location}>
    <MarkdownPage
      createLink={createLinkCommunity}
      location={location}
      markdownRemark={data.markdownRemark}
      sectionList={sectionListCommunity}
      titlePostfix=" &ndash; React"
    />
  </Layout>
);

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
