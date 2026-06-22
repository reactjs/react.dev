/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import 'server-only';
import fs from 'fs';
import path from 'path';
import {notFound} from 'next/navigation';
import compileMDX from 'utils/compileMDX';

export interface ErrorDecoderData {
  errorCode: string | null;
  errorMessage: string | null;
  content: string;
  toc: string;
  meta: any;
}

async function loadErrorCodes(): Promise<Record<string, string>> {
  const res = await fetch(
    'https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json'
  );
  return (await res.json()) as Record<string, string>;
}

export async function loadErrorDecoderData(
  code: string | null
): Promise<ErrorDecoderData> {
  const errorCodes = await loadErrorCodes();
  if (code && !errorCodes[code]) {
    notFound();
  }

  const rootDir = path.join(process.cwd(), 'src/content/errors');
  const targetPath = code || 'index';
  let mdx: string;
  try {
    mdx = fs.readFileSync(path.join(rootDir, targetPath + '.md'), 'utf8');
  } catch {
    mdx = fs.readFileSync(path.join(rootDir, 'generic.md'), 'utf8');
  }

  const {content, toc, meta} = await compileMDX(mdx, targetPath, {
    code,
    errorCodes,
  });

  return {
    errorCode: code,
    errorMessage: code ? errorCodes[code] : null,
    content,
    toc,
    meta,
  };
}

export async function listErrorCodes(): Promise<string[]> {
  const errorCodes = await loadErrorCodes();
  return Object.keys(errorCodes);
}
