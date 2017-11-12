/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

import MarkdownPage from 'components/MarkdownPage';
import PropTypes from 'prop-types';
import React from 'react';
import {createLinkCommunity} from 'utils/createLink';
import {sectionListCommunity} from 'utils/sectionList';

const Community = ({data, location}) => (
  <MarkdownPage
    createLink={createLinkCommunity}
    location={location}
    markdownRemark={data.markdownRemark}
    sectionList={sectionListCommunity}
    titlePostfix=" - React"
  />
);

Community.propTypes = {
  data: PropTypes.object.isRequired,
};

// eslint-disable-next-line no-undef
export const pageQuery = graphql`
  query TemplateCommunityMarkdown($id: String!) {
    markdownRemark(fields: {id: {eq: $id}}) {
      html
      frontmatter {
        title
        next
        prev
      }
      fields {
        path
        id
      }
    }
  }
`;

export default Community;
