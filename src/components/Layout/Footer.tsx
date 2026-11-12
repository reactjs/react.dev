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
import NextLink from 'next/link';
import cn from 'classnames';
import {ExternalLink} from 'components/ExternalLink';
import {IconFacebookCircle} from 'components/Icon/IconFacebookCircle';
import {IconTwitter} from 'components/Icon/IconTwitter';
import {IconBsky} from 'components/Icon/IconBsky';
import {IconGitHub} from 'components/Icon/IconGitHub';

export function Footer() {
  const socialLinkClasses = 'hover:text-primary dark:text-primary-dark';
  return (
    <footer className={cn('text-secondary dark:text-secondary-dark')}>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-12 gap-y-8 max-w-7xl mx-auto">
        <div className="col-span-2 md:col-span-1 justify-items-start mt-3.5">
          <ExternalLink
            href="https://react.foundation/"
            className="font-display text-lg text-primary dark:text-primary-dark">
            React Foundation
          </ExternalLink>

          <div
            className="text-xs text-left rtl:text-right mt-2 pe-0.5"
            dir="ltr">
            Copyright &copy; React a Series of LF Projects, LLC and its
            contributors.
          </div>
          <div
            className="uwu-visible text-xs cursor-pointer hover:text-link hover:dark:text-link-dark hover:underline"
            onClick={() => {
              // @ts-ignore
              window.__setUwu(false);
            }}>
            no uwu plz
          </div>
          <div
            className="uwu-hidden text-xs cursor-pointer hover:text-link hover:dark:text-link-dark hover:underline"
            onClick={() => {
              // @ts-ignore
              window.__setUwu(true);
            }}>
            uwu?
          </div>
          <div className="uwu-visible text-xs">
            Logo by
            <ExternalLink
              className="ms-1"
              href="https://twitter.com/sawaratsuki1004">
              @sawaratsuki1004
            </ExternalLink>
          </div>
        </div>
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
          <FooterLink href="/learn/managing-state">Managing State</FooterLink>
          <FooterLink href="/learn/escape-hatches">Escape Hatches</FooterLink>
        </div>
        <div className="flex flex-col">
          <FooterLink href="/reference/react" isHeader={true}>
            API Reference
          </FooterLink>
          <FooterLink href="/reference/react">React APIs</FooterLink>
          <FooterLink href="/reference/react-dom">React DOM APIs</FooterLink>
        </div>
        <div className="md:col-start-2 xl:col-start-4 flex flex-col">
          <FooterLink href="/community" isHeader={true}>
            Community
          </FooterLink>
          <FooterLink href="https://github.com/react/react/blob/main/CODE_OF_CONDUCT.md">
            Code of Conduct
          </FooterLink>
          <FooterLink href="/community/team">Meet the Team</FooterLink>
          <FooterLink href="/community/docs-contributors">
            Docs Contributors
          </FooterLink>
          <FooterLink href="/community/acknowledgements">
            Acknowledgements
          </FooterLink>
        </div>
        <div className="flex flex-col">
          <FooterLink isHeader={true}>More</FooterLink>
          <FooterLink href="/blog">Blog</FooterLink>
          <FooterLink href="https://reactnative.dev/">React Native</FooterLink>
          <FooterLink href="https://lfprojects.org/policies/privacy-policy/">
            Privacy
          </FooterLink>
          <FooterLink href="https://lfprojects.org/policies/terms-of-use/">
            Terms
          </FooterLink>
          <FooterLink href="https://lfprojects.org/policies/">
            Policies
          </FooterLink>
          <div className="flex flex-row items-center mt-8 gap-x-2">
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
              aria-label="React on Bluesky"
              href="https://bsky.app/profile/react.dev"
              className={socialLinkClasses}>
              <IconBsky />
            </ExternalLink>
            <ExternalLink
              aria-label="React on Github"
              href="https://github.com/react/react"
              className={socialLinkClasses}>
              <IconGitHub />
            </ExternalLink>
          </div>
        </div>
      </div>
    </footer>
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
      <NextLink href={href} className={classes}>
        {children}
      </NextLink>
    </div>
  );
}
