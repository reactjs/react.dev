/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import MarkdownPage from 'components/MarkdownPage';
import PropTypes from 'prop-types';
import React from 'react';
import {graphql} from 'gatsby';
import Layout from 'components/Layout';
import {createLinkDocs} from 'utils/createLink';
import {sectionListDocs} from 'utils/sectionList';

const Docs = ({data, location}) => (
  <Layout location={location}>
    <MarkdownPage
      createLink={createLinkDocs}
      location={location}
      mdx={data.mdx}
      sectionList={sectionListDocs}
      titlePostfix=" &ndash; React"
    />
  </Layout>
);

Docs.propTypes = {
  data: PropTypes.object.isRequired,
};

export const pageQuery = graphql`
  query TemplateDocsMarkdown($slug: String!) {
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

export default Docs;
