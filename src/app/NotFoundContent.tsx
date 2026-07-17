/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import {MDXComponents} from 'components/MDX/MDXComponents';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export function NotFoundContent() {
  return (
    <main className="min-w-0 isolate">
      <article className="font-normal break-words text-primary dark:text-primary-dark">
        <div className="px-5 sm:px-12">
          <div className="max-w-7xl mx-auto">
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
          </div>
        </div>
      </article>
    </main>
  );
}
