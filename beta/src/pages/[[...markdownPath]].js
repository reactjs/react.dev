/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {createElement, Children, Fragment, useMemo} from 'react';
import {MDXComponents} from 'components/MDX/MDXComponents';
import {MarkdownPage} from 'components/Layout/MarkdownPage';
import {Page} from 'components/Layout/Page';
import {prepareMDX} from '../utils/prepareMDX';

export default function Layout({content, meta}) {
  const decoded = useMemo(
    () => JSON.parse(content, reviveNodeOnClient),
    [content]
  );
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

// Deserialize a client React tree from JSON.
function reviveNodeOnClient(key, val) {
  if (Array.isArray(val) && val[0] == '$r') {
    // Assume it's a React element.
    let type = val[1];
    let key = val[2];
    let props = val[3];
    if (type === 'wrapper') {
      type = Fragment;
      props = {children: props.children};
    }
    if (MDXComponents[type]) {
      type = MDXComponents[type];
    }
    if (!type) {
      console.error('Unknown type: ' + type);
      type = Fragment;
    }
    return {
      $$typeof: Symbol.for('react.element'),
      type: type,
      key: key,
      ref: null,
      props: props,
      _owner: null,
    };
  } else {
    return val;
  }
}

// Serialize a server React tree node to JSON.
function stringifyNodeOnServer(key, val) {
  if (val != null && val.$$typeof === Symbol.for('react.element')) {
    // Remove fake MDX props.
    const {mdxType, originalType, parentName, ...cleanProps} = val.props;
    return [
      '$r',
      typeof val.type === 'string' ? val.type : mdxType,
      val.key,
      cleanProps,
    ];
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
  run(outputExports, createElement);
  const reactTree = outputExports.default({});
  return {
    props: {
      content: JSON.stringify(reactTree, stringifyNodeOnServer),
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
