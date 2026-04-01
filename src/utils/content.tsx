/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs/promises';
import path from 'path';
import {cacheLife, cacheTag} from 'next/cache';
import type {ReactNode} from 'react';
import sidebarBlog from 'sidebarBlog.json';
import sidebarCommunity from 'sidebarCommunity.json';
import sidebarHome from 'sidebarHome.json';
import sidebarLearn from 'sidebarLearn.json';
import sidebarReference from 'sidebarReference.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import type {Languages} from 'components/MDX/LanguagesContext';
import {generateMDX} from 'utils/generateMDX';

const CONTENT_ROOT = path.join(process.cwd(), 'src/content');
const ERROR_CONTENT_ROOT = path.join(CONTENT_ROOT, 'errors');
const DEV_ONLY_PAGES = new Set(['learn/rsc-sandbox-test']);
const TRANSLATIONS_URL =
  'https://raw.githubusercontent.com/reactjs/translations.react.dev/main/langs/langs.json';
const ERROR_CODES_URL =
  'https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json';
export const DEV_CONTENT_CACHE_TAG = 'react-docs-page-data';

export type SiteSection =
  | 'blog'
  | 'community'
  | 'home'
  | 'learn'
  | 'reference'
  | 'unknown';

export interface DocsPageData {
  content: ReactNode;
  languages: Languages | null;
  meta: Record<string, unknown>;
  pathname: string;
  routeTree: RouteItem;
  section: SiteSection;
  toc: Awaited<ReturnType<typeof generateMDX>>['toc'];
}

export interface ErrorPageData {
  content: ReactNode;
  errorCode: string | null;
  errorMessage: string | null;
  meta: Record<string, unknown>;
}

export class MissingMarkdownContentError extends Error {
  constructor(mdxPath: string) {
    super(`Unable to find markdown content for "${mdxPath}"`);
    this.name = 'MissingMarkdownContentError';
  }
}

export function getSectionForPathname(pathname: string): SiteSection {
  if (pathname === '/') {
    return 'home';
  }
  if (pathname.startsWith('/reference')) {
    return 'reference';
  }
  if (pathname.startsWith('/learn')) {
    return 'learn';
  }
  if (pathname.startsWith('/community')) {
    return 'community';
  }
  if (pathname.startsWith('/blog')) {
    return 'blog';
  }

  return 'unknown';
}

export function getRouteTreeForSection(section: SiteSection): RouteItem {
  switch (section) {
    case 'reference':
      return sidebarReference as RouteItem;
    case 'learn':
      return sidebarLearn as RouteItem;
    case 'community':
      return sidebarCommunity as RouteItem;
    case 'blog':
      return sidebarBlog as RouteItem;
    case 'home':
    case 'unknown':
    default:
      return sidebarHome as RouteItem;
  }
}

export async function getDocsPageData(
  markdownPath: string[] | undefined
): Promise<DocsPageData> {
  const normalizedPath = normalizeMarkdownPath(markdownPath);
  const pathname = pathnameFromSegments(markdownPath);
  return getDocsPageDataCached(normalizedPath, pathname);
}

export function shouldServeDocsRoute(markdownPath: string[] | undefined) {
  const normalizedPath = normalizeMarkdownPath(markdownPath);

  if (normalizedPath === 'index') {
    return markdownPath == null || markdownPath.length === 0;
  }

  if (normalizedPath.endsWith('/index')) {
    return false;
  }

  if (
    process.env.NODE_ENV === 'production' &&
    DEV_ONLY_PAGES.has(normalizedPath)
  ) {
    return false;
  }

  return true;
}

async function getDocsPageDataCached(
  normalizedPath: string,
  pathname: string
): Promise<DocsPageData> {
  'use cache';

  cacheTag(DEV_CONTENT_CACHE_TAG);
  if (pathname.endsWith('/translations')) {
    cacheLife('hours');
  } else {
    cacheLife('max');
  }
  return getDocsPageDataUncached(normalizedPath, pathname);
}

async function getDocsPageDataUncached(
  normalizedPath: string,
  pathname: string
): Promise<DocsPageData> {
  const section = getSectionForPathname(pathname);
  const mdx = await readDocMarkdownSource(normalizedPath);
  const {content, toc, meta} = await generateMDX(mdx, normalizedPath, {});

  return {
    content,
    languages: pathname.endsWith('/translations')
      ? await getTranslations()
      : null,
    meta,
    pathname,
    routeTree: getRouteTreeForSection(section),
    section,
    toc,
  };
}

export async function getErrorPageData(
  errorCodePath: string[] | undefined
): Promise<ErrorPageData | null> {
  if (errorCodePath && errorCodePath.length > 1) {
    return null;
  }

  const errorCode = errorCodePath?.[0] ?? null;
  return getErrorPageDataCached(errorCode);
}

async function getErrorPageDataCached(
  errorCode: string | null
): Promise<ErrorPageData | null> {
  'use cache';

  cacheTag(DEV_CONTENT_CACHE_TAG);
  cacheLife('hours');
  return getErrorPageDataUncached(errorCode);
}

async function getErrorPageDataUncached(
  errorCode: string | null
): Promise<ErrorPageData | null> {
  const errorCodes = await getErrorCodes();
  if (errorCode && errorCodes[errorCode] == null) {
    return null;
  }

  const mdx = await readErrorMarkdownSource(errorCode);
  const {content, meta} = await generateMDX(mdx, errorCode ?? 'index', {
    code: errorCode,
    errorCodes,
  });

  return {
    content,
    errorCode,
    errorMessage: errorCode ? errorCodes[errorCode] : null,
    meta,
  };
}

export async function getDocsStaticParams() {
  const entries = await listMarkdownEntries();

  return entries
    .filter((entry: string) => !entry.startsWith('errors/'))
    .filter((entry: string) => {
      if (process.env.NODE_ENV !== 'production') {
        return true;
      }

      return !DEV_ONLY_PAGES.has(entry);
    })
    .map((entry: string) => ({
      markdownPath: entry === 'index' ? [] : entry.split('/').filter(Boolean),
    }));
}

export async function getErrorStaticParams() {
  const errorCodes = await getErrorCodes();
  return [
    {errorCode: []},
    ...Object.keys(errorCodes).map((code) => ({errorCode: [code]})),
  ];
}

export async function getMarkdownApiContent(
  pathSegments: string[] | undefined
): Promise<string | null> {
  if (!pathSegments || pathSegments.length === 0) {
    return null;
  }

  const filePath = pathSegments.join('/');
  if (filePath === 'index' || filePath.endsWith('/index')) {
    return null;
  }

  const content = await tryReadMarkdown(path.join(CONTENT_ROOT, filePath));
  if (content == null) {
    return null;
  }

  return `${content}${MARKDOWN_API_FOOTER}`;
}

const MARKDOWN_API_FOOTER = `

---

## Sitemap

[Overview of all docs pages](/llms.txt)
`;

export async function listMarkdownEntries() {
  if (process.env.NODE_ENV === 'production') {
    return listMarkdownEntriesCached();
  }

  return listMarkdownEntriesUncached();
}

export async function getErrorCodes() {
  if (process.env.NODE_ENV === 'production') {
    return getErrorCodesCached();
  }

  return getErrorCodesUncached();
}

export function pathnameFromSegments(pathSegments: string[] | undefined) {
  return pathSegments == null || pathSegments.length === 0
    ? '/'
    : `/${pathSegments.join('/')}`;
}

async function readDocMarkdownSource(mdxPath: string) {
  if (process.env.NODE_ENV === 'production') {
    return readDocMarkdownSourceCached(mdxPath);
  }

  return readDocMarkdownSourceUncached(mdxPath);
}

async function readDocMarkdownSourceCached(mdxPath: string) {
  'use cache';

  cacheLife('max');
  return readDocMarkdownSourceUncached(mdxPath);
}

async function readDocMarkdownSourceUncached(mdxPath: string) {
  const content = await tryReadMarkdown(path.join(CONTENT_ROOT, mdxPath));
  if (content == null) {
    throw new MissingMarkdownContentError(mdxPath);
  }
  return content;
}

async function readErrorMarkdownSource(errorCode: string | null) {
  if (process.env.NODE_ENV === 'production') {
    return readErrorMarkdownSourceCached(errorCode);
  }

  return readErrorMarkdownSourceUncached(errorCode);
}

async function readErrorMarkdownSourceCached(errorCode: string | null) {
  'use cache';

  cacheLife('max');
  return readErrorMarkdownSourceUncached(errorCode);
}

async function readErrorMarkdownSourceUncached(errorCode: string | null) {
  if (errorCode) {
    const specific = await readFileIfExists(
      path.join(ERROR_CONTENT_ROOT, `${errorCode}.md`)
    );
    if (specific != null) {
      return specific;
    }
  }

  const generic = await readFileIfExists(
    path.join(ERROR_CONTENT_ROOT, 'generic.md')
  );
  if (generic == null) {
    throw new Error('Unable to find generic error decoder content.');
  }
  return generic;
}

async function listMarkdownEntriesCached() {
  'use cache';

  cacheLife('max');
  return listMarkdownEntriesUncached();
}

async function listMarkdownEntriesUncached() {
  return collectMarkdownEntries(CONTENT_ROOT);
}

async function collectMarkdownEntries(
  rootDir: string,
  currentDir = rootDir
): Promise<string[]> {
  const entries = await fs.readdir(currentDir, {withFileTypes: true});
  const results: string[][] = await Promise.all(
    entries.map(async (entry) => {
      const resolvedPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        return collectMarkdownEntries(rootDir, resolvedPath);
      }

      if (!entry.isFile() || !entry.name.endsWith('.md')) {
        return [];
      }

      const relativePath = path
        .relative(rootDir, resolvedPath)
        .replace(/\\/g, '/');
      const withoutExtension = relativePath.slice(0, -3);
      if (withoutExtension.endsWith('/index')) {
        return [withoutExtension.slice(0, -'/index'.length) || 'index'];
      }

      return [withoutExtension];
    })
  );

  return results.flat().sort();
}

async function getTranslations() {
  if (process.env.NODE_ENV === 'production') {
    return getTranslationsCached();
  }

  return getTranslationsUncached();
}

async function getTranslationsCached() {
  'use cache';

  cacheLife('hours');
  return getTranslationsUncached();
}

async function getTranslationsUncached() {
  const response = await fetch(TRANSLATIONS_URL);
  if (!response.ok) {
    throw new Error(`Failed to load translations: ${response.status}`);
  }

  return (await response.json()) as Languages;
}

async function getErrorCodesCached() {
  'use cache';

  cacheLife('hours');
  return getErrorCodesUncached();
}

async function getErrorCodesUncached() {
  const response = await fetch(ERROR_CODES_URL);
  if (!response.ok) {
    throw new Error(`Failed to load error codes: ${response.status}`);
  }

  return (await response.json()) as Record<string, string>;
}

async function tryReadMarkdown(basePath: string) {
  const exactPath = `${basePath}.md`;
  const indexPath = path.join(basePath, 'index.md');
  return (await readFileIfExists(exactPath)) ?? readFileIfExists(indexPath);
}

async function readFileIfExists(filePath: string) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    return null;
  }
}

function normalizeMarkdownPath(pathSegments: string[] | undefined) {
  return pathSegments == null || pathSegments.length === 0
    ? 'index'
    : pathSegments.join('/');
}
