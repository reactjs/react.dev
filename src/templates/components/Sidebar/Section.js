/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 */

'use strict';

import {colors, media} from 'theme';
import isItemActive from 'utils/isItemActive';
import MetaTitle from '../MetaTitle';
import ChevronSvg from '../ChevronSvg';

const Section = ({
  activeItemId,
  createLink,
  isActive,
  isScrollSync,
  location,
  onLinkClick,
  onSectionTitleClick,
  section,
}) => (
  <div>
    <MetaTitle
      onClick={onSectionTitleClick}
      cssProps={{
        marginTop: 10,

        [media.greaterThan('small')]: {
          color: isActive ? colors.text : colors.subtle,

          ':hover': {
            color: colors.text,
          },
        },
      }}>
      {section.title}
      <ChevronSvg
        cssProps={{
          marginLeft: 7,
          transform: isActive ? 'rotateX(180deg)' : 'rotateX(0deg)',
          transition: 'transform 0.2s ease',

          [media.lessThan('small')]: {
            display: 'none',
          },
        }}
      />
    </MetaTitle>
    <ul
      css={{
        marginBottom: 10,

        [media.greaterThan('small')]: {
          display: isActive ? 'block' : 'none',
        },
      }}>
      {section.items.map(item => (
        <li
          key={item.id}
          css={{
            marginTop: 5,
          }}>
          {createLink({
            isActive: isScrollSync
              ? activeItemId === item.id
              : isItemActive(location, item),
            item,
            location,
            onLinkClick,
            section,
          })}

          {item.subitems && (
            <ul css={{marginLeft: 20}}>
              {item.subitems.map(subitem => (
                <li key={subitem.id}>
                  {createLink({
                    isActive: isScrollSync
                      ? activeItemId === subitem.id
                      : isItemActive(location, subitem),
                    item: subitem,
                    location,
                    onLinkClick,
                    section,
                  })}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default Section;
