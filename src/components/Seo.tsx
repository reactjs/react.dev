/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import Head from 'next/head';
import {withRouter, Router} from 'next/router';
import {siteConfig} from '../siteConfig';

export interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  // jsonld?: JsonLDType | Array<JsonLDType>;
  children?: React.ReactNode;
  isHomePage: boolean;
  searchOrder?: number;
}

const deployedTranslations = [
  'en',
  'zh-hans',
  'es',
  // We'll add more languages when they have enough content.
  // Please DO NOT edit this list without a discussion in the reactjs/react.dev repo.
  // It must be the same between all translations.
];

let shouldPreventIndexing = false;
if (
  siteConfig.languageCode !== 'en' &&
  !deployedTranslations.includes(siteConfig.languageCode)
) {
  shouldPreventIndexing = true;
}

function getDomain(languageCode: string): string {
  const subdomain = languageCode === 'en' ? '' : languageCode + '.';
  return subdomain + 'react.dev';
}

export const Seo = withRouter(
  ({
    title,
    description = 'The library for web and native user interfaces',
    image = '/images/og-default.png',
    router,
    children,
    isHomePage,
    searchOrder,
  }: SeoProps & {router: Router}) => {
    const siteDomain = getDomain(siteConfig.languageCode);
    const canonicalUrl = `https://${siteDomain}${
      router.asPath.split(/[\?\#]/)[0]
    }`;
    const pageTitle = isHomePage ? title : title + ' – React';
    // Twitter's meta parser is not very good.
    const twitterTitle = pageTitle.replace(/[<>]/g, '');
    return (
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {title != null && <title key="title">{pageTitle}</title>}
        {description != null && (
          <meta name="description" key="description" content={description} />
        )}
        <link rel="canonical" href={canonicalUrl} />
        <link
          rel="alternate"
          href={canonicalUrl.replace(siteDomain, getDomain('en'))}
          hrefLang="x-default"
        />
        {shouldPreventIndexing && <meta name="robots" content="noindex" />}
        {deployedTranslations.map((languageCode) => (
          <link
            key={'alt-' + languageCode}
            rel="alternate"
            hrefLang={languageCode}
            href={canonicalUrl.replace(siteDomain, getDomain(languageCode))}
          />
        ))}
        <meta property="fb:app_id" content="623268441017527" />
        <meta property="og:type" key="og:type" content="website" />
        <meta property="og:url" key="og:url" content={canonicalUrl} />
        {title != null && (
          <meta property="og:title" content={pageTitle} key="og:title" />
        )}
        {description != null && (
          <meta
            property="og:description"
            key="og:description"
            content={description}
          />
        )}
        <meta
          property="og:image"
          key="og:image"
          content={`https://${siteDomain}${image}`}
        />
        <meta
          name="twitter:card"
          key="twitter:card"
          content="summary_large_image"
        />
        <meta name="twitter:site" key="twitter:site" content="@reactjs" />
        <meta name="twitter:creator" key="twitter:creator" content="@reactjs" />
        {title != null && (
          <meta
            name="twitter:title"
            key="twitter:title"
            content={twitterTitle}
          />
        )}
        {description != null && (
          <meta
            name="twitter:description"
            key="twitter:description"
            content={description}
          />
        )}
        <meta
          name="twitter:image"
          key="twitter:image"
          content={`https://${siteDomain}${image}`}
        />
        <meta
          name="google-site-verification"
          content="sIlAGs48RulR4DdP95YSWNKZIEtCqQmRjzn-Zq-CcD0"
        />
        {searchOrder != null && (
          <meta name="algolia-search-order" content={'' + searchOrder} />
        )}
        <link
          rel="preload"
          href="/fonts/Source-Code-Pro-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://react.dev/fonts/Optimistic_Display_W_Md.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://react.dev/fonts/Optimistic_Display_W_SBd.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://react.dev/fonts/Optimistic_Display_W_Bd.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://react.dev/fonts/Optimistic_Text_W_Md.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://react.dev/fonts/Optimistic_Text_W_Bd.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://react.dev/fonts/Optimistic_Text_W_Rg.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://react.dev/fonts/Optimistic_Text_W_It.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {children}
      </Head>
    );
  }
);
