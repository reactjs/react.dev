import * as fs from 'node:fs/promises';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import remark from 'remark';
import remarkStringify from 'remark-stringify';
import remarkMdx from 'remark-mdx';
import visit from 'unist-util-visit';

const CONTENT_ROOT = './src/content';
const BASE_URL = 'https://react.dev';

type SidebarSection = 'learn' | 'reference';
type ExtraSectionName = Extract<SectionName, 'warnings' | 'errors'>;

const SIDEBAR_CONFIGS: Array<{file: string; section: SidebarSection}> = [
  {file: 'src/sidebarLearn.json', section: 'learn'},
  {file: 'src/sidebarReference.json', section: 'reference'},
];

export const SECTION_ORDER = [
  'learn',
  'reference',
  'warnings',
  'errors',
] as const;
export type SectionName = typeof SECTION_ORDER[number];

const EXTRA_SECTIONS: Array<{section: ExtraSectionName; glob: string}> = [
  {section: 'warnings', glob: `${CONTENT_ROOT}/warnings/**/*.md`},
  {section: 'errors', glob: `${CONTENT_ROOT}/errors/**/*.md`},
];

let docsBySectionPromise: Promise<Record<SectionName, string[]>> | null = null;

export async function scanDocumentationFiles(): Promise<string[]> {
  const bySection = await getDocsBySection();
  return SECTION_ORDER.flatMap((section) => bySection[section]);
}

export async function getDocsBySection(): Promise<
  Record<SectionName, string[]>
> {
  if (!docsBySectionPromise) {
    docsBySectionPromise = buildDocsBySection();
  }
  return docsBySectionPromise;
}

async function buildDocsBySection(): Promise<Record<SectionName, string[]>> {
  const sidebarDocs = getSidebarOrderedDocs();
  const extras = await getExtraSectionDocs();

  return {
    learn: dedupeList(sidebarDocs.learn),
    reference: dedupeList(sidebarDocs.reference),
    warnings: dedupeList(extras.warnings),
    errors: dedupeList(extras.errors),
  };
}

export async function parseFileContent(filePath: string) {
  const absolutePath = path.join(process.cwd(), filePath);
  const [fileContent, stats] = await Promise.all([
    fs.readFile(absolutePath),
    fs.stat(absolutePath),
  ]);
  const parsed = matter(fileContent.toString());
  const updatedFromFrontmatter =
    parsed.data?.updated || parsed.data?.lastUpdated || parsed.data?.date;
  const updatedAt = updatedFromFrontmatter
    ? new Date(updatedFromFrontmatter).toISOString()
    : stats.mtime.toISOString();
  return {...parsed, updatedAt};
}

export async function processMarkdownContent(content: string): Promise<string> {
  const file = await remark()
    // @ts-expect-error remark-mdx has mismatched typings with remark v12
    .use(remarkMdx)
    .use(stripMdxElements)
    // @ts-expect-error remark-stringify typings expect older processor signatures
    .use(remarkStringify, {
      bullet: '-',
      fences: true,
    })
    .process(content);

  return collapseWhitespace(String(file));
}

export function formatFilePath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  const withoutPrefix = normalized.replace(/^\.?(?:\/)?src\/content/, '');
  const withLeadingSlash = withoutPrefix.startsWith('/')
    ? withoutPrefix
    : `/${withoutPrefix}`;
  return withLeadingSlash.replace(/\.mdx?$/, '.md');
}

export function formatMarkdownUrl(filePath: string): string {
  const pathWithExt = formatFilePath(filePath);
  const markdownPath = pathWithExt.endsWith('/index.md')
    ? pathWithExt.replace(/\/index\.md$/, '.md')
    : pathWithExt;
  return `${BASE_URL}${markdownPath}`;
}

export function inferSection(filePath: string): string {
  const relative = formatFilePath(filePath).replace(/^\//, '');
  return relative.split('/')[0] || 'root';
}

function getSidebarOrderedDocs(): Record<SidebarSection, string[]> {
  const docs: Record<SidebarSection, string[]> = {
    learn: [],
    reference: [],
  };
  for (const {file, section} of SIDEBAR_CONFIGS) {
    const config = loadJSON(file);
    const routes = config.routes || [];
    collectFromRoutes(routes, docs[section]);
  }
  return docs;
}

function collectFromRoutes(routes: any[], docs: string[]) {
  for (const route of routes) {
    if (route?.hasSectionHeader) continue;

    if (route?.path) {
      const filePath = sidebarPathToFile(route.path);
      if (filePath && existsSync(path.join(process.cwd(), filePath))) {
        docs.push(filePath);
      }
    }

    if (route?.routes?.length) {
      collectFromRoutes(route.routes, docs);
    }
  }
}

function sidebarPathToFile(urlPath: string): string | null {
  const cleaned = urlPath.replace(/^\/+/, '');
  if (!cleaned) {
    return null;
  }

  const parts = cleaned.split('/');
  if (parts.length === 1) {
    return `${CONTENT_ROOT}/${parts[0]}/index.md`;
  }

  return `${CONTENT_ROOT}/${parts.join('/')}.md`;
}

async function getExtraSectionDocs(): Promise<
  Record<ExtraSectionName, string[]>
> {
  const files: Record<ExtraSectionName, string[]> = {
    warnings: [],
    errors: [],
  };
  for (const {glob: pattern, section} of EXTRA_SECTIONS) {
    const matches = await fg(pattern, {
      cwd: process.cwd(),
      dot: false,
      onlyFiles: true,
    });
    files[section] = matches.sort();
  }
  return files;
}

function loadJSON(relativePath: string) {
  const absolute = path.join(process.cwd(), relativePath);
  return JSON.parse(readFileSync(absolute, 'utf8'));
}

function collapseWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function stripMdxElements() {
  const COMPONENT_NAMES = new Set([
    'Intro',
    'YouWillLearn',
    'YouWillBuild',
    'DeepDive',
    'Note',
    'Warning',
    'Hint',
    'Diagram',
    'Recipe',
    'Sandpack',
    'Video',
    'ComponentPreview',
  ]);
  const startsWithUppercase = (name?: string) => !!name && /^[A-Z]/.test(name);

  return (tree: any) => {
    visit(tree as any, (node: any, index: number | null, parent: any) => {
      if (!parent || typeof index !== 'number') {
        return;
      }

      if (node.type === 'mdxjsEsm') {
        parent.children.splice(index, 1);
        return [visit.SKIP, index];
      }

      if (
        node.type === 'mdxJsxFlowElement' ||
        node.type === 'mdxJsxTextElement'
      ) {
        const name: string | undefined = node.name;
        if (startsWithUppercase(name) || (name && COMPONENT_NAMES.has(name))) {
          if (node.children && node.children.length > 0) {
            parent.children.splice(index, 1, ...node.children);
          } else {
            parent.children.splice(index, 1);
          }
          return [visit.SKIP, index];
        }
      }

      return undefined;
    });

    return tree;
  };
}

function dedupeList(list: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const item of list) {
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
  }
  return result;
}
