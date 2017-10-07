/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @emails react-core
*/

'use strict';

import Link from 'gatsby-link';
import React from 'react';
import ExternalLinkSvg from 'templates/components/ExternalLinkSvg';
import isItemActive from 'utils/isItemActive';
import slugify from 'utils/slugify';
import {colors, media} from 'theme';

const createLinkBlog = ({item, location, section, isActive}) => {
  const active =
    typeof isActive === 'boolean' ? isActive : isItemActive(location, item);

  return (
    <Link css={[linkCss, active && activeLinkCss]} to={item.id}>
      {active && <span css={activeLinkBefore} />}
      {item.title}
    </Link>
  );
};

const createLinkCommunity = ({item, location, section}) => {
  if (item.href) {
    return (
      <a css={[linkCss]} href={item.href} target="_blank" rel="noopener">
        {item.title}
        <ExternalLinkSvg
          cssProps={{
            verticalAlign: -2,
            display: 'inline-block',
            marginLeft: 5,
            color: colors.subtle,
          }}
        />
      </a>
    );
  }
  return createLinkDocs({
    item,
    location,
    section,
  });
};

const createLinkDocs = ({item, location, section, isActive}) => {
  const active =
    typeof isActive === 'boolean' ? isActive : isItemActive(location, item);

  return (
    <Link
      css={[linkCss, active && activeLinkCss]}
      to={slugify(item.id, section.directory)}>
      {active && <span css={activeLinkBefore} />}
      {item.title}
    </Link>
  );
};

const createLinkTutorial = ({
  item,
  location,
  onLinkClick,
  section,
  isActive,
}) => {
  const active =
    typeof isActive === 'boolean' ? isActive : isItemActive(location, item);

  return (
    <Link
      css={[linkCss, active && activeLinkCss]}
      onClick={onLinkClick}
      to={item.href}>
      {active && <span css={activeLinkBefore} />}
      {item.title}
    </Link>
  );
};

const activeLinkCss = {
  fontWeight: 700,
};

const activeLinkBefore = {
  width: 4,
  height: 25,
  borderLeft: `4px solid ${colors.brand}`,
  paddingLeft: 16,
  position: 'absolute',
  left: 0,
  marginTop: -3,

  [media.greaterThan('largerSidebar')]: {
    left: 15,
  },
};

const linkCss = {
  color: colors.text,
  display: 'inline-block',
  borderBottom: '1px solid transparent',
  transition: 'border 0.2s ease',
  marginTop: 5,

  '&:hover': {
    color: colors.subtle,
  },
};

export {
  createLinkBlog,
  createLinkCommunity,
  createLinkDocs,
  createLinkTutorial,
};
