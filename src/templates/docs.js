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
import {setSelectedLanguage} from 'utils/languageUtils';

const Docs = ({data, location}) => {
  // Store the user's most recent locale based on the current URL.
  // We'll restore this language when they visit a new (unlocalized) URL.
  const matches = location.pathname.substr(1).split('/');
  if (matches.length > 1) {
    setSelectedLanguage(matches[0]);
  }

  return (
    <MarkdownPage
      createLink={createLinkDocs}
      location={location}
      markdownRemark={data.markdownRemark}
      sectionList={sectionListDocs}
      titlePostfix=" - React"
    />
  );
};

Docs.propTypes = {
  data: PropTypes.object.isRequired,
};

// allFile(filter: {internal: {mediaType: {eq: "text/markdown"}}, sourceInstanceName: {eq: "projects"}}) {
//     allMarkdownRemark(
//      filter: { fileAbsolutePath: {regex : "\/posts/"} },
//      sort: {fields: [frontmatter___date], order: DESC},
//    ) {
// https://github.com/gatsbyjs/gatsby/issues/1634

// eslint-disable-next-line no-undef
export const pageQuery = graphql`
  query TemplateDocsMarkdown($id: String!) {
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

export default Docs;
