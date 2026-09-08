/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'server-only';
import {notFound} from 'next/navigation';
import {cacheLife} from 'next/cache';
import compileMDX from 'utils/compileMDX';
import type {CompiledMDX} from 'utils/compileMDX';
import {readContentFile} from 'contentFiles';

export interface ErrorDecoderData extends CompiledMDX {
  errorCode: string | null;
  errorMessage: string | null;
}

async function loadErrorCodes(): Promise<Record<string, string>> {
  'use cache';
  cacheLife('max');
  const res = await fetch(
    'https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json'
  );
  return (await res.json()) as Record<string, string>;
}

/**
 * Compile the error decoder MDX for a given code. Cached at this layer so the
 * page render and `generateMetadata` share one compile. `notFound()` is kept
 * in the caller because it can't be thrown from inside a `'use cache'` scope.
 */
async function compileErrorDecoderData(
  code: string | null,
  errorMessage: string | null
): Promise<ErrorDecoderData> {
  'use cache';
  cacheLife('max');
  const mdx =
    (await readContentFile(`errors/${code || 'index'}.md`)) ??
    (await readContentFile('errors/generic.md'));
  if (mdx == null) {
    throw new Error('Missing src/content/errors/generic.md');
  }

  const compiled = await compileMDX(mdx);

  return {
    ...compiled,
    errorCode: code,
    errorMessage,
  };
}

export async function loadErrorDecoderData(
  code: string | null
): Promise<ErrorDecoderData> {
  const errorCodes = await loadErrorCodes();
  if (code && !errorCodes[code]) {
    notFound();
  }
  return compileErrorDecoderData(code, code ? errorCodes[code] : null);
}

export async function listErrorCodes(): Promise<string[]> {
  const errorCodes = await loadErrorCodes();
  return Object.keys(errorCodes);
}
