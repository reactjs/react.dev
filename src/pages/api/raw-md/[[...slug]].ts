import type {NextApiRequest, NextApiResponse} from 'next';
import path from 'node:path';
import fs from 'node:fs/promises';

const CONTENT_ROOT = path.join(process.cwd(), 'src/content');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slugParam = req.query.slug;
  const slug = Array.isArray(slugParam)
    ? slugParam.filter(Boolean)
    : slugParam
    ? [slugParam]
    : [];

  const candidates = buildCandidatePaths(slug);

  for (const candidate of candidates) {
    try {
      const file = await fs.readFile(candidate, 'utf8');
      res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
      res.setHeader(
        'Cache-Control',
        'public, max-age=60, s-maxage=600, stale-while-revalidate=86400'
      );
      res.status(200).send(file);
      return;
    } catch (error) {
      // try next candidate
    }
  }

  res.status(404).json({error: 'Markdown not found'});
}

function buildCandidatePaths(slug: string[]): string[] {
  const cleaned = slug.join('/');
  const root = cleaned || 'index';
  const candidates = new Set<string>();

  candidates.add(path.join(CONTENT_ROOT, `${root}.md`));
  candidates.add(path.join(CONTENT_ROOT, `${root}.mdx`));

  if (!root.endsWith('/index')) {
    candidates.add(path.join(CONTENT_ROOT, root, 'index.md'));
    candidates.add(path.join(CONTENT_ROOT, root, 'index.mdx'));
  }

  return Array.from(candidates);
}
