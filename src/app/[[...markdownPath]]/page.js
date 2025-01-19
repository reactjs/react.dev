// src/app/[[...markdownPath]]/page.js
import {Fragment} from 'react';
import fs from 'fs/promises';
import path from 'path';
import {Page} from 'components/Layout/Page';
import sidebarHome from '../../sidebarHome.json';
import sidebarLearn from '../../sidebarLearn.json';
import sidebarReference from '../../sidebarReference.json';
import sidebarCommunity from '../../sidebarCommunity.json';
import sidebarBlog from '../../sidebarBlog.json';
import {MDXComponents} from 'components/MDX/MDXComponents';
import compileMDX from 'utils/compileMDX';
import {generateRssFeed} from '../../utils/rss';

// Deserialize a client React tree from JSON.
function reviveNodeOnClient(parentPropertyName, val) {
  if (Array.isArray(val) && val[0] == '$r') {
    let Type = val[1];
    let key = val[2];
    if (key == null) {
      key = parentPropertyName;
    }
    let props = val[3];
    if (Type === 'wrapper') {
      Type = Fragment;
      props = {children: props.children};
    }
    if (Type in MDXComponents) {
      Type = MDXComponents[Type];
    }
    if (!Type) {
      console.error('Unknown type: ' + Type);
      Type = Fragment;
    }
    return <Type key={key} {...props} />;
  } else {
    return val;
  }
}

function getActiveSection(pathname) {
  if (pathname === '/') {
    return 'home';
  } else if (pathname.startsWith('/reference')) {
    return 'reference';
  } else if (pathname.startsWith('/learn')) {
    return 'learn';
  } else if (pathname.startsWith('/community')) {
    return 'community';
  } else if (pathname.startsWith('/blog')) {
    return 'blog';
  } else {
    return 'unknown';
  }
}

async function getRouteTree(section) {
  switch (section) {
    case 'home':
    case 'unknown':
      return sidebarHome;
    case 'learn':
      return sidebarLearn;
    case 'reference':
      return sidebarReference;
    case 'community':
      return sidebarCommunity;
    case 'blog':
      return sidebarBlog;
  }
}

// This replaces getStaticProps
async function getPageContent(markdownPath) {
  const rootDir = path.join(process.cwd(), 'src/content');
  let mdxPath = markdownPath?.join('/') || 'index';
  let mdx;

  try {
    mdx = await fs.readFile(path.join(rootDir, mdxPath + '.md'), 'utf8');
  } catch {
    mdx = await fs.readFile(path.join(rootDir, mdxPath, 'index.md'), 'utf8');
  }

  // Generate RSS feed during build time
  if (process.env.NODE_ENV === 'production') {
    await generateRssFeed();
  }

  return await compileMDX(mdx, mdxPath, {});
}

// This replaces getStaticPaths
export async function generateStaticParams() {
  const rootDir = path.join(process.cwd(), 'src/content');

  async function getFiles(dir) {
    const entries = await fs.readdir(dir, {withFileTypes: true});
    const files = await Promise.all(
      entries.map(async (entry) => {
        const res = path.resolve(dir, entry.name);
        return entry.isDirectory()
          ? getFiles(res)
          : res.slice(rootDir.length + 1);
      })
    );
    return files
      .flat()
      .filter((file) => file.endsWith('.md') && !file.startsWith('errors/'));
  }

  function getSegments(file) {
    let segments = file.slice(0, -3).replace(/\\/g, '/').split('/');
    if (segments[segments.length - 1] === 'index') {
      segments.pop();
    }
    return segments;
  }

  const files = await getFiles(rootDir);

  return files.map((file) => ({
    markdownPath: getSegments(file),
  }));
}
export default async function WrapperPage({params}) {
  const {markdownPath} = await params;

  // Get the MDX content and associated data
  const {content, toc, meta, languages} = await getPageContent(markdownPath);

  const pathname = '/' + (markdownPath?.join('/') || '');
  const section = getActiveSection(pathname);
  const routeTree = await getRouteTree(section);

  // Pass the content and TOC directly, as `getPageContent` should already return them in the correct format
  return (
    <Page
      toc={toc} // Pass the TOC directly without parsing
      routeTree={routeTree}
      meta={meta}
      section={section}
      languages={languages}>
      {content}
    </Page>
  );
}
// Configure dynamic segments to be statically generated
export const dynamicParams = false;
