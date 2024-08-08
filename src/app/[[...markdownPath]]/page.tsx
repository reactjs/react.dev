/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import compileMDX from 'utils/compileMDX';
import {generateRssFeed} from '../../utils/rss';
import {Client} from './client';

export default async function Layout({
  params: {markdownPath},
}: {
  params: {markdownPath: string[]};
}) {
  const {toc, content, meta, languages} = await getData({markdownPath});
  return (
    <Client toc={toc} content={content} meta={meta} languages={languages} />
  );
}

// Put MDX output into JSON for client.
export async function getData({markdownPath}: {markdownPath: string[]}) {
  generateRssFeed();
  const fs = require('fs');
  const rootDir = process.cwd() + '/src/content/';

  // Read MDX from the file.
  let path = (markdownPath || []).join('/') || 'index';
  let mdx;
  try {
    mdx = fs.readFileSync(rootDir + path + '.md', 'utf8');
  } catch {
    mdx = fs.readFileSync(rootDir + path + '/index.md', 'utf8');
  }

  const {toc, content, meta, languages} = await compileMDX(mdx, path, {});
  return {
    toc,
    content,
    meta,
    languages,
  };
}

// Collect all MDX files for static generation.
export async function getStaticPaths() {
  const {promisify} = require('util');
  const {resolve} = require('path');
  const fs = require('fs');
  const readdir = promisify(fs.readdir);
  const stat = promisify(fs.stat);
  const rootDir = process.cwd() + '/src/content';

  // Find all MD files recursively.
  async function getFiles(dir: string) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(
      subdirs.map(async (subdir: string) => {
        const res = resolve(dir, subdir);
        return (await stat(res)).isDirectory()
          ? getFiles(res)
          : res.slice(rootDir.length + 1);
      })
    );
    return (
      files
        .flat()
        // ignores `errors/*.md`, they will be handled by `pages/errors/[errorCode].tsx`
        .filter((file) => file.endsWith('.md') && !file.startsWith('errors/'))
    );
  }

  // 'foo/bar/baz.md' -> ['foo', 'bar', 'baz']
  // 'foo/bar/qux/index.md' -> ['foo', 'bar', 'qux']
  function getSegments(file: string) {
    let segments = file.slice(0, -3).replace(/\\/g, '/').split('/');
    if (segments[segments.length - 1] === 'index') {
      segments.pop();
    }
    return segments;
  }

  const files = await getFiles(rootDir);

  const paths = files.map((file) => ({
    params: {
      markdownPath: getSegments(file),
      // ^^^ CAREFUL HERE.
      // If you rename markdownPath, update patches/next-remote-watch.patch too.
      // Otherwise you'll break Fast Refresh for all MD files.
    },
  }));

  return {
    paths: paths,
    fallback: false,
  };
}
