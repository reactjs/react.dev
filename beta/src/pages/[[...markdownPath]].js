/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Fragment, useMemo} from 'react';
import {MDXComponents} from 'components/MDX/MDXComponents';
import {MarkdownPage} from 'components/Layout/MarkdownPage';
import {Page} from 'components/Layout/Page';

export default function Layout({content, toc, meta}) {
  const parsedContent = useMemo(
    () => JSON.parse(content, reviveNodeOnClient),
    [content]
  );
  const parsedToc = useMemo(() => JSON.parse(toc, reviveNodeOnClient), [toc]);
  return (
    <Page>
      <MarkdownPage meta={meta} toc={parsedToc}>
        {parsedContent}
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

  // Read MDX from the file. Parse Frontmatter data out of it.
  let path = (context.params.markdownPath || []).join('/') || 'index';
  let mdxWithFrontmatter;
  try {
    mdxWithFrontmatter = fs.readFileSync(rootDir + path + '.md', 'utf8');
  } catch {
    mdxWithFrontmatter = fs.readFileSync(rootDir + path + '/index.md', 'utf8');
  }
  const {content: mdx, data: meta} = fm(mdxWithFrontmatter);

  // Turn the MDX we just read into some JS we can execute.
  let mdxWithFakeImports = '';
  for (let key in MDXComponents) {
    if (MDXComponents.hasOwnProperty(key)) {
      // If we don't add these fake imports, the MDX compiler
      // will insert a bunch of opaque components we can't introspect.
      // This will break the prepareMDX() call below.
      mdxWithFakeImports += 'import ' + key + ' from "' + key + '";\n';
    }
  }
  mdxWithFakeImports += '\n' + mdx;
  const jsxCode = await compileMdx(mdxWithFakeImports, {
    remarkPlugins,
  });
  const jsCode = transform(jsxCode, {
    plugins: ['@babel/plugin-transform-modules-commonjs'],
    presets: ['@babel/preset-react'],
  }).code;

  // Prepare environment for MDX and then eval it.
  let fakeExports = {};
  // For each fake MDX import, give back the string component name.
  // It will get serialized later.
  const fakeRequire = (key) => key;
  const evalJSCode = new Function('require', 'exports', 'mdx', jsCode);
  const createElement = require('react').createElement;
  evalJSCode(fakeRequire, fakeExports, createElement);
  const reactTree = fakeExports.default({});

  // Pre-process MDX output and serialize it.
  const {prepareMDX} = require('../utils/prepareMDX');
  const {toc, children} = prepareMDX(reactTree.props.children);
  return {
    props: {
      content: JSON.stringify(children, stringifyNodeOnServer),
      toc: JSON.stringify(toc, stringifyNodeOnServer),
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
