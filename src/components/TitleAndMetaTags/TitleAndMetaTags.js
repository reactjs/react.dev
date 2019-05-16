/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import Helmet from 'react-helmet';
import React from 'react';

const defaultDescription = 'A JavaScript library for building user interfaces';

type Props = {
  title: string,
  ogDescription: string,
  canonicalUrl: string,
};

const TitleAndMetaTags = ({title, ogDescription, canonicalUrl}: Props) => {
  return (
    <Helmet title={title}>
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content="/logo-og.png" />
      <meta
        property="og:description"
        content={ogDescription || defaultDescription}
      />
      <meta property="fb:app_id" content="623268441017527" />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
};

export default TitleAndMetaTags;
