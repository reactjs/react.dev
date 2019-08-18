/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

import React from 'react';
import {Link} from 'gatsby';

import {Menu, MenuButton, MenuList, MenuLink} from '@reach/menu-button';
import '@reach/menu-button/styles.css';

import {colors} from 'theme';
import languages from '../../../content/languages.yml';

const completeLanguages = languages.filter(language => {
  return language.status == 2;
});

function getPageLink(code, {pathname, hash}) {
  const prefix = code === 'en' ? '' : `${code}.`;
  return `https://${prefix}reactjs.org${pathname + hash}`;
}

export default function LanguageDropdown({children, location}) {
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
