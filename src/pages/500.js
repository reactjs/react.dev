/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page
      toc={[]}
      routeTree={sidebarLearn}
      meta={{title: 'Something Went Wrong'}}>
      <MaxWidth>
        <Intro>
          <P>Something went very wrong.</P>
          <P>Sorry about that.</P>
          <P>
            If you’d like, please{' '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              report a bug.
            </A>
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
