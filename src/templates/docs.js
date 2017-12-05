/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import MarkdownPage from 'components/MarkdownPage';
import PropTypes from 'prop-types';
import React from 'react';
import {createLinkDocs} from 'utils/createLink';
import {sectionListDocs} from 'utils/sectionList';

const Docs = ({data, location}) => (
  <MarkdownPage
    createLink={createLinkDocs}
    location={location}
    markdownRemark={data.markdownRemark}
    sectionList={sectionListDocs}
    titlePostfix=" - React"
  />
);

Docs.propTypes = {
  data: PropTypes.object.isRequired,
};

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
