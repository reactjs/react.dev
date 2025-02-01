/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';
import {RouteItem} from 'components/Layout/getRouteMeta';
import {generateMetadata as generateSeoMetadata} from 'utils/generateMetadata';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page
      toc={[]}
      pathname="/404"
      section="unknown"
      meta={{title: 'Not Found'}}
      routeTree={sidebarLearn as RouteItem}>
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

export async function generateMetadata({}: {}) {
  return generateSeoMetadata({
    title: 'Not Found',
    isHomePage: false,
    path: '/404',
  });
}
