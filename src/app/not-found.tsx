/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page
      toc={[]}
      meta={{title: 'Not Found'}}
      routeTree={sidebarLearn as RouteItem}
      section="unknown"
      pathname="/404">
      <MaxWidth>
        <Intro>
          <P>This page doesn’t exist.</P>
          <P>
            If this is a mistake{', '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              let us know
            </A>
            {', '}
            and we will try to fix it!
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
