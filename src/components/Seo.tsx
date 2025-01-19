// lib/seo.ts
import {Metadata} from 'next';
import {siteConfig} from '../siteConfig';
import {finishedTranslations} from 'utils/finishedTranslations';

export interface SeoProps {
  title: string;
  titleForTitleTag?: string;
  description?: string;
  image?: string;
  isHomePage: boolean;
  searchOrder?: number;
  path: string;
}

function getDomain(languageCode: string): string {
  const subdomain = languageCode === 'en' ? '' : languageCode + '.';
  return subdomain + 'react.dev';
}

export function generateMetadata({
  title,
  titleForTitleTag,
  image = '/images/og-default.png',
  isHomePage,
  description: customDescription,
  searchOrder,
  path,
}: SeoProps): Metadata {
  const siteDomain = getDomain(siteConfig.languageCode);
  const canonicalUrl = `https://${siteDomain}${path.split(/[\?\#]/)[0]}`;

  // Allow setting a different title for Google results
  const pageTitle =
    (titleForTitleTag ?? title) + (isHomePage ? '' : ' – React');
  // Twitter's meta parser is not very good.
  const twitterTitle = pageTitle.replace(/[<>]/g, '');

  const description = isHomePage
    ? 'React is the library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript. React is designed to let you seamlessly combine components written by independent people, teams, and organizations.'
    : customDescription ?? 'The library for web and native user interfaces';

  const alternateLanguages = {
    'x-default': canonicalUrl.replace(siteDomain, getDomain('en')),
    ...Object.fromEntries(
      finishedTranslations.map((languageCode) => [
        languageCode,
        canonicalUrl.replace(siteDomain, getDomain(languageCode)),
      ])
    ),
  };

  const metadata: Metadata = {
    title: pageTitle,
    description: isHomePage ? description : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateLanguages,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: 'React',
      type: 'website',
      images: [
        {
          url: `https://${siteDomain}${image}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@reactjs',
      creator: '@reactjs',
      title: twitterTitle,
      description,
      images: [`https://${siteDomain}${image}`],
    },
    verification: {
      google: 'sIlAGs48RulR4DdP95YSWNKZIEtCqQmRjzn-Zq-CcD0',
    },
    other: {
      'fb:app_id': '623268441017527',
      ...(searchOrder != null && {
        'algolia-search-order': searchOrder.toString(),
      }),
    },
  };

  return metadata;
}
