import fs from 'fs';
import {FileStore, stableHash} from 'metro-cache';
import grayMatter from 'gray-matter';
import {compile, run} from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import {remarkPlugins} from '../../plugins/markdownToHtml';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import {MDXComponents, MDXComponentsToc} from '../components/MDX/MDXComponents';
import {MaxWidthWrapperPlugin} from './mdx/MaxWidthWrapperPlugin';
import {ExtractedTOC, TOCExtractorPlugin} from './mdx/TOCExtractorPlugin';
import {MetaAttributesPlugin} from './mdx/MetaAttributesPlugin';

const DISK_CACHE_BREAKER = 13;
const CACHE_PATH = `${process.cwd()}/node_modules/.cache/react-docs-mdx/`;
const LOCKFILE_PATH = `${process.cwd()}/yarn.lock`;

type Params = {[key: string]: any};
type MDXResult = {
  content: React.ReactNode;
  toc: ExtractedTOC[];
  meta: any;
};

type CachedResult = {
  code: string;
  toc: ExtractedTOC[];
  meta: any;
};

async function readFromCache(
  store: FileStore,
  hash: Buffer,
  path: string | string[]
): Promise<CachedResult | null> {
  try {
    const cached = await store.get(hash);
    if (cached) {
      return JSON.parse(cached.toString());
    }
  } catch (error) {
    console.warn(`Cache read failed for /${path}:`, error);
  }
  return null;
}

async function writeToCache(
  store: FileStore,
  hash: Buffer,
  result: CachedResult,
  path: string | string[]
): Promise<void> {
  try {
    await store.set(hash, Buffer.from(JSON.stringify(result)));
  } catch (error) {
    console.warn(`Cache write failed for /${path}:`, error);
  }
}

export async function generateMDX(
  mdx: string,
  path: string | string[],
  params: Params
): Promise<MDXResult> {
  const store = new FileStore({root: CACHE_PATH});
  const hash = Buffer.from(
    stableHash({
      ...params,
      mdx,
      mdxComponentNames: Object.keys(MDXComponents),
      DISK_CACHE_BREAKER,
      lockfile: fs.readFileSync(LOCKFILE_PATH, 'utf8'),
    })
  );

  const cachedResult = await readFromCache(store, hash, path);
  if (cachedResult) {
    const {code, meta, toc} = cachedResult;
    const {default: MDXContent} = await run(code, {
      ...runtime,
      baseUrl: import.meta.url,
    });
    const tocWithMDX = await getTransformedToc(toc);
    return {
      content: <MDXContent components={{...MDXComponents}} />,
      toc: tocWithMDX,
      meta,
    };
  }

  const compiled = await compile(mdx, {
    remarkPlugins: [
      ...remarkPlugins,
      remarkGfm,
      remarkFrontmatter,
      MaxWidthWrapperPlugin,
      TOCExtractorPlugin,
    ],
    rehypePlugins: [MetaAttributesPlugin],
    outputFormat: 'function-body',
  });

  const {data: meta} = grayMatter(mdx);
  const toc = compiled.data.toc as ExtractedTOC[];
  const result: CachedResult = {
    code: String(compiled),
    toc,
    meta,
  };

  await writeToCache(store, hash, result, path);

  const tocWithMDX = await getTransformedToc(toc);

  const {default: MDXContent} = await run(result.code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  return {
    content: <MDXContent components={{...MDXComponents}} />,
    toc: tocWithMDX,
    meta: result.meta,
  };
}

async function getTransformedToc(toc: ExtractedTOC[]): Promise<ExtractedTOC[]> {
  return await Promise.all(
    toc.map(async (item) => {
      if (typeof item.node !== 'string') {
        return item;
      }

      const compiled = await compile(item.node, {
        outputFormat: 'function-body',
      });

      const {default: MDXContent} = await run(compiled, {
        ...runtime,
        baseUrl: import.meta.url,
      });

      item.node = <MDXContent components={{...MDXComponentsToc}} />;

      return item;
    })
  );
}
