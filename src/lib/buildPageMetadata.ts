/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from 'next';
import {siteConfig} from '../siteConfig';
import {finishedTranslations} from 'utils/finishedTranslations';
import type {PageData} from './readMarkdownPage';
import type {PageSection} from 'components/Layout/Page';

function getDomain(languageCode: string): string {
  const subdomain = languageCode === 'en' ? '' : languageCode + '.';
  return subdomain + 'react.dev';
}

export function buildPageMetadata({
  data,
  pathname,
  section,
}: {
  data: PageData;
  pathname: string;
  section: PageSection;
}): Metadata {
  const isHomePage = pathname === '/';
  const title = data.meta.title || '';
  const titleForTitleTag = data.meta.titleForTitleTag;
  const pageTitle =
    (titleForTitleTag ?? title) + (isHomePage ? '' : ' – React');
  const twitterTitle = pageTitle.replace(/[<>]/g, '');

  const description = isHomePage
    ? 'React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript. React is designed to let you seamlessly combine components written by independent people, teams, and organizations.'
    : 'The library for web and native user interfaces';

  const siteDomain = getDomain(siteConfig.languageCode);
  const canonicalUrl = `https://${siteDomain}${pathname}`;
  const ogImage = `https://${siteDomain}/images/og-${
    section === 'unknown' ? 'default' : section
  }.png`;

  const languages: Record<string, string> = {
    'x-default': canonicalUrl.replace(siteDomain, getDomain('en')),
  };
  for (const code of finishedTranslations) {
    languages[code] = canonicalUrl.replace(siteDomain, getDomain(code));
  }

  return {
    title: pageTitle,
    description: isHomePage ? description : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: pageTitle,
      description,
      images: [{url: ogImage}],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@reactjs',
      creator: '@reactjs',
      title: twitterTitle,
      description,
      images: [ogImage],
    },
  };
}
