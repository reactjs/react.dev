'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Page} from 'components/Layout/Page';
import sidebarLearn from 'sidebarLearn.json';
import Intro from 'components/MDX/Intro';
import Link from 'components/MDX/Link';

function MaxWidth({children}: {children: React.ReactNode}) {
  return <div className="max-w-4xl ms-0 2xl:mx-auto">{children}</div>;
}

function P(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className="whitespace-pre-wrap my-4" {...props} />;
}

export function NotFoundPage() {
  return (
    <Page
      pathname="/404"
      toc={[]}
      meta={{title: 'Not Found'}}
      routeTree={sidebarLearn}
      section="unknown">
      <MaxWidth>
        <Intro>
          <P>This page doesn’t exist.</P>
          <P>
            If this is a mistake{', '}
            <Link href="https://github.com/reactjs/react.dev/issues/new">
              let us know
            </Link>
            {', '}
            and we will try to fix it!
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}

export function InternalErrorPage({
  onRetry,
}: {
  onRetry?: (() => void) | undefined;
}) {
  return (
    <Page
      pathname="/500"
      toc={[]}
      meta={{title: 'Something Went Wrong'}}
      routeTree={sidebarLearn}
      section="unknown">
      <MaxWidth>
        <Intro>
          <P>Something went very wrong.</P>
          <P>Sorry about that.</P>
          <P>
            If you’d like, please{' '}
            <Link href="https://github.com/reactjs/react.dev/issues/new">
              report a bug.
            </Link>
          </P>
          {onRetry ? (
            <p className="mt-6">
              <button
                className="rounded-full bg-link px-4 py-2 text-white hover:bg-link-hover"
                onClick={onRetry}>
                Try again
              </button>
            </p>
          ) : null}
        </Intro>
      </MaxWidth>
    </Page>
  );
}
