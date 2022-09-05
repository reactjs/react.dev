/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MarkdownPage} from 'components/Layout/MarkdownPage';
import {MDXComponents} from 'components/MDX/MDXComponents';

export default function NotFound() {
  return (
    <Page>
      <MarkdownPage meta={{title: 'Not Found'}} toc={[]}>
        <p>Oh no.</p>
      </MarkdownPage>
    </Page>
  );
}
