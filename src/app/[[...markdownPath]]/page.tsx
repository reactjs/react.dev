import fs from 'fs/promises';
import path from 'path';
import {Page} from 'components/Layout/Page';
import sidebarHome from '../../sidebarHome.json';
import sidebarLearn from '../../sidebarLearn.json';
import sidebarReference from '../../sidebarReference.json';
import sidebarCommunity from '../../sidebarCommunity.json';
import sidebarBlog from '../../sidebarBlog.json';
import {generateMDX} from '../../utils/generateMDX';

import {RouteItem} from 'components/Layout/getRouteMeta';

function getActiveSection(pathname: string) {
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

async function getRouteTree(section: string) {
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
    default:
      throw new Error(`Unknown section: ${section}`);
  }
}

// This replaces getStaticProps
async function getPageContent(markdownPath: any[]) {
  const rootDir = path.join(process.cwd(), 'src/content');
  let mdxPath = markdownPath?.join('/') || 'index';
  let mdx;

  try {
    mdx = await fs.readFile(path.join(rootDir, mdxPath + '.md'), 'utf8');
  } catch {
    mdx = await fs.readFile(path.join(rootDir, mdxPath, 'index.md'), 'utf8');
  }

  return await generateMDX(mdx, mdxPath, {});
}

// This replaces getStaticPaths
export async function generateStaticParams() {
  const rootDir = path.join(process.cwd(), 'src/content');

  async function getFiles(dir: string): Promise<string[]> {
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
      .filter(
        (file: string) => file.endsWith('.md') && !file.startsWith('errors/')
      );
  }

  function getSegments(file: string) {
    let segments = file.slice(0, -3).replace(/\\/g, '/').split('/');
    if (segments[segments.length - 1] === 'index') {
      segments.pop();
    }
    return segments;
  }

  const files = await getFiles(rootDir);

  return files.map((file: any) => ({
    markdownPath: getSegments(file),
  }));
}

export default async function WrapperPage({
  params,
}: {
  params: Promise<{markdownPath: any[]}>;
}) {
  const {markdownPath} = await params;

  // Get the MDX content and associated data
  const {content, toc, meta} = await getPageContent(markdownPath);

  const pathname = '/' + (markdownPath?.join('/') || '');
  const section = getActiveSection(pathname);
  const routeTree = await getRouteTree(section);

  // Pass the content and TOC directly, as `getPageContent` should already return them in the correct format
  return (
    <Page
      toc={toc} // Pass the TOC directly without parsing
      routeTree={routeTree as RouteItem}
      meta={meta}
      section={section}
      languages={null}>
      {content}
    </Page>
  );
}
// Configure dynamic segments to be statically generated
export const dynamicParams = false;
