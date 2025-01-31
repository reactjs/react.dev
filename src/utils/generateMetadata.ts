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
  image,
  isHomePage,
  description: customDescription,
  searchOrder,
  path,
}: SeoProps): Metadata {
  const siteDomain = getDomain(siteConfig.languageCode);
  const canonicalUrl = `https://${siteDomain}${path.split(/[\?\#]/)[0]}`;

  const pageTitle =
    (titleForTitleTag ?? title) + (isHomePage ? '' : ' – React');
  const twitterTitle = pageTitle.replace(/[<>]/g, '');

  const description = isHomePage
    ? 'React is the library for web and native user interfaces...'
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

  return {
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
      images: [
        {url: `https://${siteDomain}${image || '/images/og-default.png'}`},
      ],
    },
    twitter: {
      title: twitterTitle,
      description,
      images: [`https://${siteDomain}${image || '/images/og-default.png'}`],
    },
    other: {
      ...(searchOrder != null && {
        'algolia-search-order': searchOrder.toString(),
      }),
    },
  };
}
