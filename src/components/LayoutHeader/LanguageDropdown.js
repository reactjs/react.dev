/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import React from 'react';
import type {Node} from 'react';
import {Link} from 'gatsby';

import {Menu, MenuButton, MenuList, MenuLink} from '@reach/menu-button';
import '@reach/menu-button/styles.css';

import {colors} from 'theme';
// $FlowFixMe this is a valid path
import languages from '../../../content/languages.yml';

const completeLanguages = languages.filter(language => {
  return language.status == 2;
});

function getPageLink(code, {pathname, hash}) {
  const prefix = code === 'en' ? '' : `${code}.`;
  return `https://${prefix}reactjs.org${pathname + hash}`;
}

interface Props {
  children: Node;
  location: Location;
}
export default function LanguageDropdown({children, location}: Props) {
  // All the styles have to be !important to override Reach UI defaults
  const linkStyle = {
    ':hover': {
      color: `${colors.brand} !important`,
      backgroundColor: 'transparent !important',
    },
    ':focus': {
      backgroundColor: `${colors.lighter} !important`,
    },
  };
  return (
    <Menu>
      <MenuButton
        css={{
          background: 'none',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
        }}>
        {children}
      </MenuButton>
      <MenuList
        css={{
          backgroundColor: `${colors.darker} !important`,
          color: 'white !important',
          fontSize: '1rem !important',
          border: 'none !important',
        }}>
        {completeLanguages.map(lang => (
          <MenuLink
            css={linkStyle}
            key={lang.code}
            target="_blank"
            href={getPageLink(lang.code, location)}>
            {lang.translated_name}
          </MenuLink>
        ))}
        <MenuLink css={linkStyle} as={Link} to="/languages">
          More languages
        </MenuLink>
      </MenuList>
    </Menu>
  );
}
