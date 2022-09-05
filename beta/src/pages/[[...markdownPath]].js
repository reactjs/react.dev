/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {createElement, Children, useMemo} from 'react';
import {MDXComponents} from 'components/MDX/MDXComponents';
import {MarkdownPage} from 'components/Layout/MarkdownPage';
import {Page} from 'components/Layout/Page';
import {mdx} from '@mdx-js/react';
import {prepareMDX} from '../utils/prepareMDX';

export default function Layout({content, meta}) {
  const decoded = useMemo(() => JSON.parse(content, reviveMDX), [content]);
  const {toc, children} = useMemo(
    () => prepareMDX(decoded.props.children),
    [decoded]
  );
  return (
    <Page>
      <MarkdownPage meta={meta} toc={toc}>
        {children}
      </MarkdownPage>
    </Page>
  );
}

// Create a React tree from server JSON.
function reviveMDX(key, val) {
  if (val && val.$m) {
    // This is an MDX node we need to revive.
    let args = val.$m;
    if (args[0] == null) {
      // First argument to createElement() is a type.
      // If it didn't serialize, this is a custom MDX component.
      args[0] = MDXComponents[args[1].mdxType];
      if (args[0] == null) {
        throw Error('Unknown type: ' + args[1].mdxType);
      }
    }
    return mdx.apply(null, args);
  } else {
    return val;
  }
}

// Put MDX output into JSON for client.
export async function getStaticProps(context) {
  const fs = require('fs');
  const compileMdx = require('@mdx-js/mdx');
  const {transform} = require('@babel/core');
  const fm = require('gray-matter');
  const {remarkPlugins} = require('../../plugins/markdownToHtml');
  const rootDir = process.cwd() + '/src/content/';

  // Read MDX and make JS out of it
  let path = (context.params.markdownPath || []).join('/') || 'index';
  let mdxWithFrontmatter;
  try {
    mdxWithFrontmatter = fs.readFileSync(rootDir + path + '.md', 'utf8');
  } catch {
    mdxWithFrontmatter = fs.readFileSync(rootDir + path + '/index.md', 'utf8');
  }
  const {content: mdx, data: meta} = fm(mdxWithFrontmatter);
  const jsx = await compileMdx(mdx, {
    remarkPlugins,
  });
  const js = transform(jsx, {
    plugins: ['@babel/plugin-transform-modules-commonjs'],
    presets: ['@babel/preset-react'],
  }).code;

  // Run it to get JSON for render output
  const run = new Function('exports', 'mdx', js);
  let outputExports = {};
  function createJSONNode(...args) {
    return {$m: args}; // Marker to turn this into createElement on the client
  }
  run(outputExports, createJSONNode);
  const json = outputExports.default({});
  return {
    props: {
      content: JSON.stringify(json),
      meta,
    },
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
  async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(
      subdirs.map(async (subdir) => {
        const res = resolve(dir, subdir);
        return (await stat(res)).isDirectory()
          ? getFiles(res)
          : res.slice(rootDir.length + 1);
      })
    );
    return files.flat().filter((file) => file.endsWith('.md'));
  }

  // 'foo/bar/baz.md' -> ['foo', 'bar', 'baz']
  // 'foo/bar/qux/index.md' -> ['foo', 'bar', 'qux']
  function getSegments(file) {
    let segments = file.slice(0, -3).split('/');
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
