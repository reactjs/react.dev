/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import Head from 'next/head';
import {withRouter, Router} from 'next/router';

export interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  // jsonld?: JsonLDType | Array<JsonLDType>;
  children?: React.ReactNode;
  isHomePage: boolean;
  searchOrder?: number;
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
    const pageTitle = isHomePage ? 'React' : title + ' – React';
    // Twitter's meta parser is not very good.
    const twitterTitle = pageTitle.replace(/[<>]/g, '');
    return (
      <Head>
        {/* DEFAULT */}

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {title != null && <title key="title">{pageTitle}</title>}
        {description != null && (
          <meta name="description" key="description" content={description} />
        )}
        {/* <link rel="icon" type="image/x-icon" href={favicon} />
      <link rel="apple-touch-icon" href={favicon} />  @todo favicon */}
        <meta property="fb:app_id" content="623268441017527" />
        {/* OPEN GRAPH */}
        <meta property="og:type" key="og:type" content="website" />
        <meta
          property="og:url"
          key="og:url"
          content={`https://react.dev${router.asPath.split(/[\?\#]/)[0]}`}
        />
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
          content={`https://react.dev${image}`}
        />

        {/* TWITTER */}
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
          content={`https://react.dev${image}`}
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
