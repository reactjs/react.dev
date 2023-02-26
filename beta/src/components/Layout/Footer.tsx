/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import NextLink from 'next/link';
import cn from 'classnames';
import ButtonLink from 'components/ButtonLink';
import {ExternalLink} from 'components/ExternalLink';
import {IconFacebookCircle} from 'components/Icon/IconFacebookCircle';
import {IconTwitter} from 'components/Icon/IconTwitter';
import {IconGitHub} from 'components/Icon/IconGitHub';
import {IconNavArrow} from 'components/Icon/IconNavArrow';

export function Footer() {
  const socialLinkClasses = 'hover:text-primary dark:text-primary-dark';
  return (
    <>
      <div className="self-stretch w-full">
        <div className="mx-auto w-full px-5 sm:px-12 md:px-12 pt-10 md:pt-12 lg:pt-10">
          <hr className="max-w-7xl mx-auto border-border dark:border-border-dark" />
          <div className="flex flex-col items-center m-4 p-4">
            <p className="font-bold text-primary dark:text-primary-dark text-lg mb-4">
              How do you like these docs?
            </p>
            <div>
              <ButtonLink
                href="https://www.surveymonkey.co.uk/r/PYRPF3X"
                className="mt-1"
                type="primary"
                size="md"
                target="_blank">
                Take our survey!
                <IconNavArrow
                  displayDirection="right"
                  className="inline ml-1"
                />
              </ButtonLink>
            </div>
          </div>
          <hr className="max-w-7xl mx-auto border-border dark:border-border-dark" />
        </div>
        <footer className="text-secondary dark:text-secondary-dark py-12 px-5 sm:px-12 md:px-12 sm:py-12 md:py-16 lg:py-14">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-x-12 gap-y-8 max-w-7xl mx-auto ">
            <ExternalLink
              href="https://opensource.fb.com/"
              className="col-span-2 sm:col-span-1 justify-items-start w-44 text-left">
              <div>
                <svg
                  className="mt-4 mb-4"
                  width="115"
                  height="13"
                  viewBox="0 0 115 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.12655 0.414727V2.061C9.1323 2.15436 9.06215 2.23355 8.97245 2.23945C8.96555 2.23945 8.95865 2.23945 8.95175 2.23945H2.07259V5.60409H7.75002C7.84087 5.59818 7.91792 5.67027 7.92367 5.76364C7.92367 5.76955 7.92367 5.77664 7.92367 5.78255V7.43C7.92942 7.52336 7.85927 7.60254 7.76842 7.60845C7.76267 7.60845 7.75577 7.60845 7.75002 7.60845H2.07259V12.5827C2.07949 12.6761 2.01049 12.7565 1.92079 12.7635C1.91389 12.7635 1.90699 12.7635 1.90009 12.7635H0.175126C0.084278 12.7695 0.00607958 12.6974 0.000329697 12.6028C0.000329697 12.5969 0.000329697 12.5898 0.000329697 12.5839V0.411182C-0.00542019 0.317818 0.0647284 0.237454 0.156727 0.231545C0.162476 0.231545 0.169376 0.231545 0.175126 0.231545H8.9506C9.04145 0.225636 9.1208 0.296545 9.12655 0.389909C9.1277 0.398182 9.1277 0.406454 9.12655 0.414727Z"
                    fill="currentColor"
                  />
                  <path
                    d="M23.1608 12.7637H21.2633C21.1656 12.7708 21.0793 12.701 21.0621 12.6018C20.8102 11.5736 20.5055 10.491 20.157 9.39902H14.3324C13.9874 10.491 13.6792 11.5736 13.4354 12.6018C13.4193 12.701 13.3331 12.7708 13.2353 12.7637H11.4068C11.285 12.7637 11.216 12.6916 11.2505 12.5663C12.3475 8.57648 14.0184 4.17539 15.7078 0.469206C15.7549 0.317933 15.8987 0.219842 16.0528 0.232842H18.5172C18.6713 0.219842 18.815 0.317933 18.8621 0.469206C20.6561 4.37393 22.1465 8.4193 23.3195 12.5663C23.3528 12.6904 23.2827 12.7637 23.1608 12.7637ZM19.513 7.46675C18.8771 5.65857 18.1722 3.85157 17.4431 2.2053H17.0348C16.3115 3.85157 15.5974 5.65857 14.9649 7.46675H19.513Z"
                    fill="currentColor"
                  />
                  <path
                    d="M26.2773 6.60636C26.2773 2.71818 28.767 0 32.317 0H32.5781C34.8079 0 36.5317 1.16291 37.4459 2.84464C37.5011 2.91082 37.4942 3.01127 37.4287 3.068C37.416 3.07982 37.4011 3.08927 37.385 3.09518L35.8521 3.874C35.7543 3.94018 35.6221 3.91182 35.5577 3.81136C35.5542 3.80545 35.5508 3.79955 35.5473 3.79364C34.9033 2.64845 33.9373 2.03982 32.5091 2.03982H32.248C30.0102 2.03982 28.4692 3.86455 28.4692 6.513C28.4692 9.16145 29.9837 10.9507 32.248 10.9507H32.5091C33.9718 10.9507 34.8251 10.4414 35.4783 9.66255C35.545 9.57036 35.6681 9.54318 35.7658 9.59991L37.3413 10.387C37.3907 10.4095 37.4241 10.4567 37.4287 10.5123C37.4252 10.5619 37.4068 10.6092 37.3758 10.647C36.4098 12.0971 34.6687 12.9917 32.5459 12.9917H32.2848C28.6716 13 26.2773 10.4449 26.2773 6.60636Z"
                    fill="currentColor"
                  />
                  <path
                    d="M51.3171 10.9367V12.5829C51.3228 12.6763 51.2527 12.7567 51.1607 12.7626C51.1549 12.7626 51.1492 12.7626 51.1434 12.7626H42.0011C41.9103 12.7685 41.8332 12.6964 41.8275 12.6042C41.8275 12.5971 41.8275 12.59 41.8275 12.5829V0.4102C41.8217 0.316836 41.8907 0.236473 41.9804 0.230563C41.9873 0.230563 41.9942 0.230563 42.0011 0.230563H50.9859C51.0767 0.224654 51.1549 0.296745 51.1607 0.391291C51.1607 0.3972 51.1607 0.404291 51.1607 0.4102V2.05647C51.1664 2.14984 51.0963 2.22902 51.0066 2.23493C50.9997 2.23493 50.9928 2.23493 50.9859 2.23493H43.8986V5.49202H49.6623C49.7531 5.48611 49.8313 5.5582 49.8371 5.65275C49.8371 5.65866 49.8371 5.66575 49.8371 5.67166V7.3002C49.8417 7.39356 49.7715 7.47393 49.6795 7.47865C49.6738 7.47865 49.668 7.47865 49.6623 7.47865H43.8986V10.7547H51.1434C51.2343 10.7487 51.3125 10.8197 51.3171 10.913C51.3182 10.9213 51.3182 10.9284 51.3171 10.9367Z"
                    fill="currentColor"
                  />
                  <path
                    d="M67.058 9.32692C67.058 11.518 65.4216 12.7625 62.5305 12.7625H56.5403C56.4495 12.7684 56.3724 12.6963 56.3667 12.6041C56.3667 12.597 56.3667 12.5899 56.3667 12.5828V0.410105C56.3609 0.316741 56.4299 0.236378 56.5196 0.230469C56.5265 0.230469 56.5334 0.230469 56.5403 0.230469H61.9993C64.8121 0.230469 66.3439 1.37565 66.3439 3.46983C66.3439 4.84783 65.6654 5.75192 64.2889 6.17147C66.222 6.59692 67.058 7.78701 67.058 9.32692ZM61.9556 2.18638H58.4389V5.55456H61.9556C63.5322 5.55456 64.2555 5.02629 64.2555 3.87165C64.2555 2.71701 63.5322 2.18638 61.9556 2.18638ZM64.934 9.13902C64.934 7.97492 64.1854 7.44783 62.5398 7.44783H58.4389V10.8113H62.5398C64.2107 10.8113 64.934 10.3102 64.934 9.13902Z"
                    fill="currentColor"
                  />
                  <path
                    d="M70.7057 6.5C70.7057 2.72409 73.1436 0 76.9742 0H77.2353C81.0658 0 83.5038 2.71818 83.5038 6.5C83.5038 10.2818 81.0658 13 77.2353 13H76.9742C73.1413 13 70.7057 10.2747 70.7057 6.5ZM77.2353 10.9555C79.7342 10.9555 81.3096 9.19336 81.3096 6.5C81.3096 3.80664 79.7342 2.04455 77.2353 2.04455H76.9742C74.4753 2.04455 72.8998 3.80664 72.8998 6.5C72.8998 9.19336 74.4753 10.9555 76.9742 10.9555H77.2353Z"
                    fill="currentColor"
                  />
                  <path
                    d="M87.0387 6.5C87.0387 2.72409 89.4766 0 93.3072 0H93.5683C97.3988 0 99.8368 2.71818 99.8368 6.5C99.8368 10.2818 97.3988 13 93.5683 13H93.3072C89.4766 13 87.0387 10.2747 87.0387 6.5ZM93.5683 10.9555C96.0672 10.9555 97.6426 9.19336 97.6426 6.5C97.6426 3.80664 96.0672 2.04455 93.5683 2.04455H93.3072C90.8083 2.04455 89.2329 3.80664 89.2329 6.5C89.2329 9.19336 90.8083 10.9555 93.3072 10.9555H93.5683Z"
                    fill="currentColor"
                  />
                  <path
                    d="M114.855 12.7637H112.608C112.488 12.7744 112.37 12.7153 112.304 12.6113C110.758 10.7511 109.079 9.01266 107.28 7.41129H106.271V12.5829C106.277 12.6763 106.206 12.7567 106.114 12.7626C106.109 12.7626 106.102 12.7626 106.096 12.7626H104.371C104.28 12.7685 104.203 12.6964 104.197 12.6042C104.197 12.5971 104.197 12.59 104.197 12.5829V0.4102C104.192 0.316836 104.261 0.236473 104.35 0.230563C104.357 0.230563 104.364 0.230563 104.371 0.230563H106.096C106.187 0.224654 106.265 0.296745 106.271 0.391291C106.271 0.3972 106.271 0.404291 106.271 0.4102V5.35375H107.295C108.951 3.83393 110.472 2.16638 111.84 0.370018C111.895 0.279018 111.996 0.227018 112.101 0.235291H114.226C114.33 0.235291 114.383 0.289654 114.383 0.360563C114.378 0.411382 114.356 0.458654 114.322 0.495291C112.682 2.59893 110.861 4.54538 108.88 6.31102C111.065 8.21375 113.095 10.2961 114.948 12.538C115.046 12.655 115 12.7637 114.855 12.7637Z"
                    fill="currentColor"
                  />
                </svg>
                Open Source
              </div>
              <div className="text-xs text-left mt-2 pr-0.5">
                &copy;{new Date().getFullYear()}
              </div>
            </ExternalLink>
            <div className="flex flex-col">
              <FooterLink href="/learn" isHeader={true}>
                Learn React
              </FooterLink>
              <FooterLink href="/learn/">Quick Start</FooterLink>
              <FooterLink href="/learn/installation">Installation</FooterLink>
              <FooterLink href="/learn/describing-the-ui">
                Describing the UI
              </FooterLink>
              <FooterLink href="/learn/adding-interactivity">
                Adding Interactivity
              </FooterLink>
              <FooterLink href="/learn/managing-state">
                Managing State
              </FooterLink>
              <FooterLink href="/learn/escape-hatches">
                Escape Hatches
              </FooterLink>
            </div>
            <div className="flex flex-col">
              <FooterLink href="/reference/react" isHeader={true}>
                API Reference
              </FooterLink>
              <FooterLink href="/reference/react">React APIs</FooterLink>
              <FooterLink href="/reference/react-dom">
                React DOM APIs
              </FooterLink>
            </div>
            <div className="flex flex-col sm:col-start-2 xl:col-start-4">
              <FooterLink href="/" isHeader={true}>
                Community
              </FooterLink>
              <FooterLink href="https://github.com/facebook/react/blob/main/CODE_OF_CONDUCT.md">
                Code of Conduct
              </FooterLink>
              <FooterLink href="/community/acknowledgements">
                Acknowledgements
              </FooterLink>
              <FooterLink href="/community/docs-contributors">
                Docs Contributors
              </FooterLink>
              <FooterLink href="/community/team">Meet the Team</FooterLink>
              <FooterLink href="https://reactjs.org/blog">Blog</FooterLink>
              {/* <FooterLink href="/">Community Resources</FooterLink> */}
            </div>
            <div className="flex flex-col">
              <FooterLink isHeader={true}>More</FooterLink>
              {/* <FooterLink href="/">Tutorial</FooterLink> */}
              {/* <FooterLink href="/">Blog</FooterLink> */}
              {/* <FooterLink href="/">Acknowledgements</FooterLink> */}
              <FooterLink href="https://reactnative.dev/">
                React Native
              </FooterLink>
              <FooterLink href="https://opensource.facebook.com/legal/privacy">
                Privacy
              </FooterLink>
              <FooterLink href="https://opensource.fb.com/legal/terms/">
                Terms
              </FooterLink>
              <div className="flex flex-row mt-8 gap-x-2">
                <ExternalLink
                  aria-label="React on Facebook"
                  href="https://www.facebook.com/react"
                  className={socialLinkClasses}>
                  <IconFacebookCircle />
                </ExternalLink>
                <ExternalLink
                  aria-label="React on Twitter"
                  href="https://twitter.com/reactjs"
                  className={socialLinkClasses}>
                  <IconTwitter />
                </ExternalLink>
                <ExternalLink
                  aria-label="React on Github"
                  href="https://github.com/facebook/react"
                  className={socialLinkClasses}>
                  <IconGitHub />
                </ExternalLink>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function FooterLink({
  href,
  children,
  isHeader = false,
}: {
  href?: string;
  children: React.ReactNode;
  isHeader?: boolean;
}) {
  const classes = cn('border-b inline-block border-transparent', {
    'text-sm text-primary dark:text-primary-dark': !isHeader,
    'text-md text-secondary dark:text-secondary-dark my-2 font-bold': isHeader,
    'hover:border-gray-10': href,
  });

  if (!href) {
    return <div className={classes}>{children}</div>;
  }

  if (href.startsWith('https://')) {
    return (
      <div>
        <ExternalLink href={href} className={classes}>
          {children}
        </ExternalLink>
      </div>
    );
  }

  return (
    <div>
      <NextLink href={href}>
        <a className={classes}>{children}</a>
      </NextLink>
    </div>
  );
}
