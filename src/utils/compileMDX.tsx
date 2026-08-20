/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Fragment} from 'react';
import type {ReactNode} from 'react';
import {compile, createProcessor, run} from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import type {Root} from 'mdast';
import {remarkPlugins} from '../../plugins/markdownToHtml';
import {createMDXComponents} from 'components/MDX/MDXComponents';
import type {LanguageItem} from 'components/MDX/LanguagesContext';
import type {Toc} from 'components/MDX/TocContext';
import {MaxWidthWrapperPlugin} from './mdx/MaxWidthWrapperPlugin';
import {MetaAttributesPlugin} from './mdx/MetaAttributesPlugin';
import {
  TOCExtractorPlugin,
  type ExtractedTocItem,
} from './mdx/TOCExtractorPlugin';

interface CompiledTocItem {
  url: string;
  depth: number;
  code?: string;
  text?: string;
}

export interface CompiledMDX {
  code: string;
  toc: CompiledTocItem[];
  meta: any;
  languages: LanguageItem[] | null;
}

function compileOptions() {
  return {
    remarkPlugins: [
      ...remarkPlugins,
      remarkGfm,
      remarkFrontmatter,
      // Must run before MaxWidthWrapperPlugin; see TOCExtractorPlugin.
      TOCExtractorPlugin,
      MaxWidthWrapperPlugin,
    ],
    rehypePlugins: [MetaAttributesPlugin],
    outputFormat: 'function-body' as const,
  };
}

// Compiles the processed heading mdast rather than re-parsing its source,
// which would e.g. turn "1. Install" into a list and lose smartypants.
const tocProcessor = createProcessor({outputFormat: 'function-body'});

async function compileToc(toc: ExtractedTocItem[]) {
  return Promise.all(
    toc.map(async ({children, ...item}): Promise<CompiledTocItem> => {
      if (!children) {
        return item;
      }
      const tree: Root = {
        type: 'root',
        children: [{type: 'paragraph', children}],
      };
      const transformed = await tocProcessor.run(tree);
      const code = tocProcessor.stringify(transformed as any);
      return {...item, code: String(code)};
    })
  );
}

export default async function compileMDX(mdx: string): Promise<CompiledMDX> {
  const compiled = await compile(mdx, compileOptions());
  const toc = await compileToc(
    (compiled.data.toc as ExtractedTocItem[] | undefined) ?? []
  );
  const result: CompiledMDX = {
    code: String(compiled),
    toc,
    meta: matter(mdx).data,
    languages: null,
  };
  return result;
}

const TocParagraph = ({children}: {children: ReactNode}) => (
  <Fragment>{children}</Fragment>
);

export async function renderCompiledMDX({
  code,
  toc,
  languages,
}: Pick<CompiledMDX, 'code' | 'toc' | 'languages'>): Promise<{
  content: ReactNode;
  toc: Toc;
}> {
  const {default: Content} = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });
  const renderedToc = await Promise.all(
    toc.map(async ({code: tocCode, text, ...item}) => {
      if (!tocCode) {
        return {...item, text: text ?? ''};
      }
      const {default: TocContent} = await run(tocCode, {
        ...runtime,
        baseUrl: import.meta.url,
      });
      return {
        ...item,
        text: (
          <TocContent
            components={{
              ...createMDXComponents({isInToc: true}),
              p: TocParagraph,
            }}
          />
        ),
      };
    })
  );
  return {
    content: (
      <Content
        components={createMDXComponents({languages, toc: renderedToc})}
      />
    ),
    toc: renderedToc,
  };
}
