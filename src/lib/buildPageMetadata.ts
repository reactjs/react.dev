/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Metadata} from 'next';
import {siteConfig} from '../siteConfig';
import {finishedTranslations} from 'utils/finishedTranslations';
import {getRouteMeta, type RouteItem} from 'components/Layout/getRouteMeta';
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
  routeTree,
}: {
  data: PageData;
  pathname: string;
  section: PageSection;
  /**
   * Optional sidebar tree, used to compute the Algolia `algolia-search-order`
   * meta tag for Learn/Blog pages. Omit for routes outside those sections.
   */
  routeTree?: RouteItem;
}): Metadata {
  const isHomePage = pathname === '/';
  const isBlogIndex = section === 'blog' && pathname === '/blog';
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
  // OG images are generated per page at build time by
  // scripts/generateOgImages.mjs. Pages without a generated card
  // (home, errors) fall back to the static section image.
  const ogImage =
    isHomePage || !title || pathname.startsWith('/errors')
      ? `https://${siteDomain}/images/og-${
          section === 'unknown' ? 'default' : section
        }.png`
      : `https://${siteDomain}/images/og/${pathname
          .slice(1)
          .replace(/\//g, '-')}.png`;

  const languages: Record<string, string> = {
    'x-default': canonicalUrl.replace(siteDomain, getDomain('en')),
  };
  for (const code of finishedTranslations) {
    languages[code] = canonicalUrl.replace(siteDomain, getDomain(code));
  }

  // Match the Pages Router behavior: emit `algolia-search-order` on Learn
  // pages and Blog post pages (not the Blog index) so Algolia can preserve
  // the docs sidebar ordering in search results.
  const other: Record<string, string> = {};
  if (
    routeTree &&
    (section === 'learn' || (section === 'blog' && !isBlogIndex))
  ) {
    const {order} = getRouteMeta(pathname, routeTree);
    if (order != null) {
      other['algolia-search-order'] = String(order);
    }
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
    other: Object.keys(other).length > 0 ? other : undefined,
  };
}
