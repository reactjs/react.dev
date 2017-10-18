/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

import MarkdownPage from 'components/MarkdownPage';
import PropTypes from 'prop-types';
import React from 'react';
import {createLinkDocs} from 'utils/createLink';
import {sectionListAPI} from 'utils/sectionList';

const Api = ({data, location}) => (
  <MarkdownPage
    createLink={createLinkDocs}
    location={location}
    markdownRemark={data.markdownRemark}
    sectionList={sectionListAPI}
    titlePostfix=" - React"
  />
);

Api.propTypes = {
  data: PropTypes.object.isRequired,
};

// eslint-disable-next-line no-undef
export const pageQuery = graphql`
  query TemplateApiMarkdown($slug: String!) {
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

export default Api;
