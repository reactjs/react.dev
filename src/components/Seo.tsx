/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {siteConfig} from '../siteConfig';
import {finishedTranslations} from 'utils/finishedTranslations';

export interface SeoProps {
  pathname: string;
  title: string;
  titleForTitleTag: undefined | string;
  description?: string;
  image?: string;
  // jsonld?: JsonLDType | Array<JsonLDType>;
  children?: React.ReactNode;
  isHomePage: boolean;
  searchOrder?: number;
}

// If you are a maintainer of a language fork,
// deployedTranslations has been moved to src/utils/finishedTranslations.ts.

function getDomain(languageCode: string): string {
  const subdomain = languageCode === 'en' ? '' : languageCode + '.';
  return subdomain + 'react.dev';
}

export function Seo({
  pathname,
  title,
  titleForTitleTag,
  image = '/images/og-default.png',
  children,
  isHomePage,
  searchOrder,
}: SeoProps) {
  const siteDomain = getDomain(siteConfig.languageCode);
  const canonicalUrl = `https://${siteDomain}${pathname}`;
  const pageTitle =
    (titleForTitleTag ?? title) + (isHomePage ? '' : ' – React');
  const twitterTitle = pageTitle.replace(/[<>]/g, '');
  const pageDescription = isHomePage
    ? 'React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript. React is designed to let you seamlessly combine components written by independent people, teams, and organizations.'
    : 'The library for web and native user interfaces';

  return (
    <>
      {title != null ? <title>{pageTitle}</title> : null}
      {isHomePage ? (
        <meta name="description" content={pageDescription} />
      ) : null}
      <link rel="canonical" href={canonicalUrl} />
      <link
        rel="alternate"
        href={canonicalUrl.replace(siteDomain, getDomain('en'))}
        hrefLang="x-default"
      />
      {finishedTranslations.map((languageCode) => (
        <link
          key={languageCode}
          rel="alternate"
          hrefLang={languageCode}
          href={canonicalUrl.replace(siteDomain, getDomain(languageCode))}
        />
      ))}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      {title != null ? <meta property="og:title" content={pageTitle} /> : null}
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={`https://${siteDomain}${image}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@reactjs" />
      <meta name="twitter:creator" content="@reactjs" />
      {title != null ? (
        <meta name="twitter:title" content={twitterTitle} />
      ) : null}
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={`https://${siteDomain}${image}`} />
      {searchOrder != null ? (
        <meta name="algolia-search-order" content={`${searchOrder}`} />
      ) : null}
      {children}
    </>
  );
}
