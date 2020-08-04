/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import Helmet from 'react-helmet';
import React from 'react';
import {urlRoot} from 'site-constants';
// $FlowFixMe This is a valid path
import languages from '../../../content/languages.yml';

const defaultDescription = 'A JavaScript library for building user interfaces';

type Props = {
  title: string,
  ogDescription: string,
  canonicalUrl: string,
  ogType: string,
};

// only provide alternate links to pages in languages where 95-100% of core content has been translated
// which is determined by status enum of 2
const completeLanguages = languages.filter(language => {
  return language.status == 2;
});

const alternatePages = canonicalUrl => {
  return completeLanguages.map(language => (
    <link
      key={('alt-', language.code)}
      rel="alternate"
      hreflang={language.code}
      href={canonicalUrl.replace(
        urlRoot,
        `https://${
          language.code === 'en' ? '' : `${language.code}.`
        }reactjs.org`,
      )}
    />
  ));
};

const defaultPage = canonicalUrl => {
  return canonicalUrl.replace(urlRoot, 'https://reactjs.org');
};

const TitleAndMetaTags = ({
  title,
  ogDescription,
  canonicalUrl,
  ogType = 'website',
}: Props) => {
  return (
    <Helmet title={title}>
      <meta property="og:title" content={title} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content="https://reactjs.org/logo-og.png" />
      <meta
        property="og:description"
        content={ogDescription || defaultDescription}
      />
      <meta property="fb:app_id" content="623268441017527" />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {canonicalUrl && (
        <link
          rel="alternate"
          href={defaultPage(canonicalUrl)}
          hreflang="x-default"
        />
      )}
      {canonicalUrl && alternatePages(canonicalUrl)}
    </Helmet>
  );
};

export default TitleAndMetaTags;
