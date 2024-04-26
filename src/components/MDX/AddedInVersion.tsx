/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import InlineCode from './InlineCode';
import Link from './Link';
import * as React from 'react';

const versionChangelogs = {
  '18.0.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#1800-march-29-2022',
  '16.9.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#1690-august-8-2019',
  '16.8.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#1680-february-6-2019',
  '16.6.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#1660-october-23-2018',
  '16.3.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#1630-march-29-2018',
  '16.2.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#1620-november-28-2017',
  '16.0.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#1600-september-26-2017',
  '15.3.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#1530-july-29-2016',
  '0.14.3':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#0143-november-18-2015',
  '0.14.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#0140-october-7-2015',
  '0.13.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#0130-march-10-2015',
  '0.12.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#0120-october-28-2014',
  '0.11.2':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#0112-september-16-2014',
  '0.10.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#0100-march-21-2014',
  '0.5.0':
    'https://github.com/facebook/react/blob/main/CHANGELOG.md#050-october-16-2013',
};

export interface AddedInVersionProps {
  version: keyof typeof versionChangelogs;
}

function AddedInVersion({version}: AddedInVersionProps) {
  const changelog = versionChangelogs[version];
  return (
    <div className={'text-sm leading-large'}>
      <em>Added in</em>{' '}
      <InlineCode isLink={Boolean(changelog)}>
        {changelog ? <Link href={changelog}>{version}</Link> : version}
      </InlineCode>
    </div>
  );
}

export default AddedInVersion;
