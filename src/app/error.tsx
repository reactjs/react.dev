/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import {useEffect} from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen px-5 py-16 sm:px-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-primary dark:text-primary-dark">
          Something Went Wrong
        </h1>
        <div className="mt-6 font-display text-xl leading-relaxed text-primary dark:text-primary-dark">
          <p>Something went very wrong. Sorry about that.</p>
          <p className="mt-4">
            You can try again or{' '}
            <a
              className="text-link dark:text-link-dark underline"
              href="https://github.com/reactjs/react.dev/issues/new">
              report a bug
            </a>
            .
          </p>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            type="button"
            onClick={reset}
            className="py-2 px-4 rounded-full bg-link text-white font-bold">
            Try again
          </button>
          <Link
            href="/"
            className="py-2 px-4 rounded-full border border-border dark:border-border-dark font-bold text-primary dark:text-primary-dark">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
