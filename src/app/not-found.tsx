/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Page} from 'components/Layout/Page';
import Intro from 'components/MDX/Intro';
import Link from 'components/MDX/Link';
import {P} from 'components/MDX/Primitives';
import sidebarLearn from '../sidebarLearn.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import type {Metadata} from 'next';
import {buildNotFoundMetadata} from 'lib/buildPageMetadata';

export const metadata: Metadata = buildNotFoundMetadata();

export default function NotFound() {
  return (
    <Page
      toc={[]}
      meta={{title: 'Not Found'}}
      routeTree={sidebarLearn as RouteItem}
      section="unknown"
      pathname="/404">
      <div className="max-w-4xl ms-0 2xl:mx-auto">
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
      </div>
    </Page>
  );
}
