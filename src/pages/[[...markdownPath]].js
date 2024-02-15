/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Fragment, useMemo} from 'react';
import {useRouter} from 'next/router';
import {Page} from 'components/Layout/Page';
import sidebarHome from '../sidebarHome.json';
import sidebarLearn from '../sidebarLearn.json';
import sidebarReference from '../sidebarReference.json';
import sidebarCommunity from '../sidebarCommunity.json';
import sidebarBlog from '../sidebarBlog.json';
import {MDXComponents} from 'components/MDX/MDXComponents';
import compileMDX from 'utils/compileMDX';
export default function Layout({content, toc, meta}) {
  const parsedContent = useMemo(
    () => JSON.parse(content, reviveNodeOnClient),
    [content]
  );
  const parsedToc = useMemo(() => JSON.parse(toc, reviveNodeOnClient), [toc]);
  const section = useActiveSection();
  let routeTree;
  switch (section) {
    case 'home':
    case 'unknown':
      routeTree = sidebarHome;
      break;
    case 'learn':
      routeTree = sidebarLearn;
      break;
    case 'reference':
      routeTree = sidebarReference;
      break;
    case 'community':
      routeTree = sidebarCommunity;
      break;
    case 'blog':
      routeTree = sidebarBlog;
      break;
  }
  return (
    <Page toc={parsedToc} routeTree={routeTree} meta={meta} section={section}>
      {parsedContent}
    </Page>
  );
}

function useActiveSection() {
  const {asPath} = useRouter();
  const cleanedPath = asPath.split(/[\?\#]/)[0];
  if (cleanedPath === '/') {
    return 'home';
  } else if (cleanedPath.startsWith('/reference')) {
    return 'reference';
  } else if (asPath.startsWith('/learn')) {
    return 'learn';
  } else if (asPath.startsWith('/community')) {
    return 'community';
  } else if (asPath.startsWith('/blog')) {
    return 'blog';
  } else {
    return 'unknown';
  }
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

// Put MDX output into JSON for client.
export async function getStaticProps(context) {
  const fs = require('fs');
  const rootDir = process.cwd() + '/src/content/';

  // Read MDX from the file.
  let path = (context.params.markdownPath || []).join('/') || 'index';
  let mdx;
  try {
    mdx = fs.readFileSync(rootDir + path + '.md', 'utf8');
  } catch {
    mdx = fs.readFileSync(rootDir + path + '/index.md', 'utf8');
  }

  const {toc, content, meta} = await compileMDX(mdx, path, {});
  return {
    props: {
      toc,
      content,
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
    return (
      files
        .flat()
        // ignores `errors/*.md`, they will be handled by `pages/errors/[errorCode].tsx`
        .filter((file) => file.endsWith('.md') && !file.startsWith('errors/'))
    );
  }

  // 'foo/bar/baz.md' -> ['foo', 'bar', 'baz']
  // 'foo/bar/qux/index.md' -> ['foo', 'bar', 'qux']
  function getSegments(file) {
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
