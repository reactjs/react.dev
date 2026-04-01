// @ts-nocheck

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import grayMatter from 'gray-matter';
import {compile, run} from '@mdx-js/mdx';
import {FileStore, stableHash} from 'metro-cache';
import * as runtime from 'react/jsx-runtime';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import {remarkPlugins} from '../../plugins/markdownToHtml';
import type {Toc} from 'components/MDX/TocContext';
import {MDXComponents, MDXComponentsToc} from 'components/MDX/MDXComponents';
import {ExtractedTOC, TOCExtractorPlugin} from './mdx/TOCExtractorPlugin';
import {MaxWidthWrapperPlugin} from './mdx/MaxWidthWrapperPlugin';
import {MetaAttributesPlugin} from './mdx/MetaAttributesPlugin';
import {RehypeMDXNamePlugin, RemarkMDXNamePlugin} from './mdx/MDXNamePlugin';

const DISK_CACHE_BREAKER = 14;
const CACHE_PATH = `${process.cwd()}/node_modules/.cache/react-docs-mdx/`;
const LOCKFILE_PATH = `${process.cwd()}/yarn.lock`;

type Params = Record<string, unknown>;

type CachedResult = {
  code: string;
  meta: Record<string, unknown>;
  toc: ExtractedTOC[];
};

export async function generateMDX(
  mdx: string,
  path: string | string[],
  params: Params
): Promise<{
  content: React.ReactNode;
  meta: Record<string, unknown>;
  toc: Toc;
}> {
  const store = new FileStore({root: CACHE_PATH});
  const hash = Buffer.from(
    stableHash({
      mdx,
      path,
      params,
      mdxComponentNames: Object.keys(MDXComponents),
      DISK_CACHE_BREAKER,
      lockfile: fs.readFileSync(LOCKFILE_PATH, 'utf8'),
    })
  );

  const cachedResult = await readFromCache(store, hash);
  if (cachedResult) {
    return hydrateCompiledMdx(cachedResult);
  }

  const compiled = await compile(mdx, {
    outputFormat: 'function-body',
    remarkPlugins: [
      ...remarkPlugins,
      remarkGfm,
      remarkFrontmatter,
      MaxWidthWrapperPlugin,
      TOCExtractorPlugin,
      RemarkMDXNamePlugin,
    ],
    rehypePlugins: [MetaAttributesPlugin, RehypeMDXNamePlugin],
  });

  const result: CachedResult = {
    code: String(compiled),
    meta: grayMatter(mdx).data,
    toc: (compiled.data.toc as ExtractedTOC[]) ?? [],
  };

  await writeToCache(store, hash, result);
  return hydrateCompiledMdx(result);
}

async function hydrateCompiledMdx(result: CachedResult) {
  const {default: MDXContent} = await run(result.code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return {
    content: <MDXContent components={MDXComponents} />,
    meta: result.meta,
    toc: await transformToc(result.toc),
  };
}

async function transformToc(toc: ExtractedTOC[]): Promise<Toc> {
  return Promise.all(
    toc.map(async (item) => {
      if (typeof item.node !== 'string') {
        return {
          depth: item.depth,
          text: item.node,
          url: item.url,
        };
      }

      const compiled = await compile(item.node, {
        outputFormat: 'function-body',
      });
      const {default: MDXContent} = await run(compiled, {
        ...runtime,
        baseUrl: import.meta.url,
      });

      return {
        depth: item.depth,
        text: <MDXContent components={MDXComponentsToc} />,
        url: item.url,
      };
    })
  );
}

async function readFromCache(store: FileStore, hash: Buffer) {
  try {
    const cached = await store.get(hash);
    if (!cached) {
      return null;
    }

    return JSON.parse(cached.toString()) as CachedResult;
  } catch {
    return null;
  }
}

async function writeToCache(
  store: FileStore,
  hash: Buffer,
  result: CachedResult
) {
  try {
    await store.set(hash, Buffer.from(JSON.stringify(result)));
  } catch {
    // Ignore cache write failures and continue serving fresh output.
  }
}
