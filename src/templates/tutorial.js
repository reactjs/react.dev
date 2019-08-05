/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import MarkdownPage from 'components/MarkdownPage';
import React from 'react';
import {graphql} from 'gatsby';
import Layout from 'components/Layout';
import {createLinkTutorial} from 'utils/createLink';
import {sectionListTutorial} from 'utils/sectionList';

const Tutorial = ({data, location}) => {
  return (
    <Layout location={location}>
      <MarkdownPage
        enableScrollSync
        createLink={createLinkTutorial}
        location={location}
        mdx={data.mdx}
        sectionList={sectionListTutorial}
        titlePostfix=" &ndash; React"
      />
    </Layout>
  );
};

export const pageQuery = graphql`
  query TemplateTutorialMarkdown($slug: String!) {
    mdx(fields: {slug: {eq: $slug}}) {
      body
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

export default Tutorial;
