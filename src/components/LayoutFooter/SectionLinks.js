/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @flow
 */

import React from 'react';
import ExternalFooterLink from './ExternalFooterLink';
import FooterLink from './FooterLink';

type Link = {|
  title: string,
  to: string,
|};

type Props = {|
  links: Array<Link>,
|};

const SectionLinks = ({links}: Props) =>
  links.map(item => {
    if (item.external) {
      return (
        <ExternalFooterLink
          key={item.title}
          href={item.to}
          target="_blank"
          rel="noopener">
          {item.title}
        </ExternalFooterLink>
      );
    }

    return (
      <FooterLink key={item.title} to={item.to}>
        {item.title}
      </FooterLink>
    );
  });

export default SectionLinks;
