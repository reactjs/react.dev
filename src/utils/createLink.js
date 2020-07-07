/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import {Link} from 'gatsby';
import React from 'react';
import ExternalLinkSvg from 'templates/components/ExternalLinkSvg';
import slugify from 'utils/slugify';
import {colors, media} from 'theme';

import type {Node} from 'react';

type CreateLinkBaseProps = {
  isActive: boolean,
  item: Object,
  section: Object,
};

const createLinkBlog = ({
  isActive,
  item,
  section,
}: CreateLinkBaseProps): Node => {
  return (
    <Link css={[linkCss, isActive && activeLinkCss]} to={item.id}>
      {isActive && <span css={activeLinkBefore} />}
      {item.title}
    </Link>
  );
};

const createLinkCommunity = ({
  isActive,
  item,
  section,
}: CreateLinkBaseProps): Node => {
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
    isActive,
    item,
    section,
  });
};

const createLinkDocs = ({
  isActive,
  item,
  section,
}: CreateLinkBaseProps): Node => {
  return (
    <Link
      css={[linkCss, isActive && activeLinkCss]}
      to={slugify(item.id, section.directory)}>
      {isActive && <span css={activeLinkBefore} />}
      {item.title}
    </Link>
  );
};

type CreateLinkTutorialProps = {
  onLinkClick: Function,
} & CreateLinkBaseProps;

const createLinkTutorial = ({
  isActive,
  item,
  onLinkClick,
  section,
}: CreateLinkTutorialProps): Node => {
  return (
    <Link
      css={[linkCss, isActive && activeLinkCss]}
      onClick={onLinkClick}
      to={item.href}>
      {isActive && <span css={activeLinkBefore} />}
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
