/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MarkdownPage} from 'components/Layout/MarkdownPage';
import {MDXComponents} from 'components/MDX/MDXComponents';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page toc={[]}>
      <MarkdownPage meta={{title: 'Not Found'}}>
        <MaxWidth>
          <Intro>
            <P>This page doesn’t exist.</P>
            <P>
              Quite possibly, it hasn’t been written yet. This beta is a{' '}
              <A href="/#how-much-content-is-ready">work in progress!</A>
            </P>
            <P>Please check back later.</P>
          </Intro>
        </MaxWidth>
      </MarkdownPage>
    </Page>
  );
}
