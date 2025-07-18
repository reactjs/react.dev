#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const globby = require('globby');
const chalk = require('chalk');

const CONTENT_DIR = path.join(__dirname, '../src/content');
const PUBLIC_DIR = path.join(__dirname, '../public');
const fileCache = new Map();
const anchorMap = new Map(); // Map<filepath, Set<anchorId>>
const contributorMap = new Map(); // Map<anchorId, URL>
const redirectMap = new Map(); // Map<source, destination>
let errorCodes = new Set();

async function readFileWithCache(filePath) {
  if (!fileCache.has(filePath)) {
    try {
      const content = await fs.promises.readFile(filePath, 'utf8');
      fileCache.set(filePath, content);
    } catch (error) {
      throw new Error(`Failed to read file ${filePath}: ${error.message}`);
    }
  }
  return fileCache.get(filePath);
}

async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function getMarkdownFiles() {
  // Convert Windows paths to POSIX for globby compatibility
  const baseDir = CONTENT_DIR.replace(/\\/g, '/');
  const patterns = [
    path.posix.join(baseDir, '**/*.md'),
    path.posix.join(baseDir, '**/*.mdx'),
  ];
  return globby.sync(patterns);
}

function extractAnchorsFromContent(content) {
  const anchors = new Set();

  // MDX-style heading IDs: {/*anchor-id*/}
  const mdxPattern = /\{\/\*([a-zA-Z0-9-_]+)\*\/\}/g;
  let match;
  while ((match = mdxPattern.exec(content)) !== null) {
    anchors.add(match[1].toLowerCase());
  }

  // HTML id attributes
  const htmlIdPattern = /\sid=["']([a-zA-Z0-9-_]+)["']/g;
  while ((match = htmlIdPattern.exec(content)) !== null) {
    anchors.add(match[1].toLowerCase());
  }

  // Markdown heading with explicit ID: ## Heading {#anchor-id}
  const markdownHeadingPattern = /^#+\s+.*\{#([a-zA-Z0-9-_]+)\}/gm;
  while ((match = markdownHeadingPattern.exec(content)) !== null) {
    anchors.add(match[1].toLowerCase());
  }

  return anchors;
}

async function buildAnchorMap(files) {
  for (const filePath of files) {
    const content = await readFileWithCache(filePath);
    const anchors = extractAnchorsFromContent(content);
    if (anchors.size > 0) {
      anchorMap.set(filePath, anchors);
    }
  }
}

function extractLinksFromContent(content) {
  const linkPattern = /\[([^\]]*)\]\(([^)]+)\)/g;
  const links = [];
  let match;

  while ((match = linkPattern.exec(content)) !== null) {
    const [, linkText, linkUrl] = match;
    if (linkUrl.startsWith('/') && !linkUrl.startsWith('//')) {
      const lines = content.substring(0, match.index).split('\n');
      const line = lines.length;
      const lastLineStart =
        lines.length > 1 ? content.lastIndexOf('\n', match.index - 1) + 1 : 0;
      const column = match.index - lastLineStart + 1;

      links.push({
        text: linkText,
        url: linkUrl,
        line,
        column,
      });
    }
  }

  return links;
}

async function findTargetFile(urlPath) {
  // Check if it's an image or static asset that might be in the public directory
  const imageExtensions = [
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.webp',
  ];
  const hasImageExtension = imageExtensions.some((ext) =>
    urlPath.toLowerCase().endsWith(ext)
  );

  if (hasImageExtension || urlPath.includes('.')) {
    // Check in public directory (with and without leading slash)
    const publicPaths = [
      path.join(PUBLIC_DIR, urlPath),
      path.join(PUBLIC_DIR, urlPath.substring(1)),
    ];

    for (const p of publicPaths) {
      if (await fileExists(p)) {
        return p;
      }
    }
  }

  const possiblePaths = [
    path.join(CONTENT_DIR, urlPath + '.md'),
    path.join(CONTENT_DIR, urlPath + '.mdx'),
    path.join(CONTENT_DIR, urlPath, 'index.md'),
    path.join(CONTENT_DIR, urlPath, 'index.mdx'),
    // Without leading slash
    path.join(CONTENT_DIR, urlPath.substring(1) + '.md'),
    path.join(CONTENT_DIR, urlPath.substring(1) + '.mdx'),
    path.join(CONTENT_DIR, urlPath.substring(1), 'index.md'),
    path.join(CONTENT_DIR, urlPath.substring(1), 'index.mdx'),
  ];

  for (const p of possiblePaths) {
    if (await fileExists(p)) {
      return p;
    }
  }
  return null;
}

async function validateLink(link) {
  const urlAnchorPattern = /#([a-zA-Z0-9-_]+)$/;
  const anchorMatch = link.url.match(urlAnchorPattern);
  const urlWithoutAnchor = link.url.replace(urlAnchorPattern, '');

  if (urlWithoutAnchor === '/') {
    return {valid: true};
  }

  // Check for redirects
  if (redirectMap.has(urlWithoutAnchor)) {
    const redirectDestination = redirectMap.get(urlWithoutAnchor);
    if (
      redirectDestination.startsWith('http://') ||
      redirectDestination.startsWith('https://')
    ) {
      return {valid: true};
    }
    const redirectedLink = {
      ...link,
      url: redirectDestination + (anchorMatch ? anchorMatch[0] : ''),
    };
    return validateLink(redirectedLink);
  }

  // Check if it's an error code link
  const errorCodeMatch = urlWithoutAnchor.match(/^\/errors\/(\d+)$/);
  if (errorCodeMatch) {
    const code = errorCodeMatch[1];
    if (!errorCodes.has(code)) {
      return {
        valid: false,
        reason: `Error code ${code} not found in React error codes`,
      };
    }
    return {valid: true};
  }

  // Check if it's a contributor link on the team or acknowledgements page
  if (
    anchorMatch &&
    (urlWithoutAnchor === '/community/team' ||
      urlWithoutAnchor === '/community/acknowledgements')
  ) {
    const anchorId = anchorMatch[1].toLowerCase();
    if (contributorMap.has(anchorId)) {
      const correctUrl = contributorMap.get(anchorId);
      if (correctUrl !== link.url) {
        return {
          valid: false,
          reason: `Contributor link should be updated to: ${correctUrl}`,
        };
      }
      return {valid: true};
    } else {
      return {
        valid: false,
        reason: `Contributor link not found`,
      };
    }
  }

  const targetFile = await findTargetFile(urlWithoutAnchor);

  if (!targetFile) {
    return {
      valid: false,
      reason: `Target file not found for: ${urlWithoutAnchor}`,
    };
  }

  // Only check anchors for content files, not static assets
  if (anchorMatch && targetFile.startsWith(CONTENT_DIR)) {
    const anchorId = anchorMatch[1].toLowerCase();

    // TODO handle more special cases. These are usually from custom MDX components that include
    // a Heading from src/components/MDX/Heading.tsx which automatically injects an anchor tag.
    switch (anchorId) {
      case 'challenges':
      case 'recap': {
        return {valid: true};
      }
    }

    const fileAnchors = anchorMap.get(targetFile);

    if (!fileAnchors || !fileAnchors.has(anchorId)) {
      return {
        valid: false,
        reason: `Anchor #${anchorMatch[1]} not found in ${path.relative(
          CONTENT_DIR,
          targetFile
        )}`,
      };
    }
  }

  return {valid: true};
}

async function processFile(filePath) {
  const content = await readFileWithCache(filePath);
  const links = extractLinksFromContent(content);
  const deadLinks = [];

  for (const link of links) {
    const result = await validateLink(link);
    if (!result.valid) {
      deadLinks.push({
        file: path.relative(process.cwd(), filePath),
        line: link.line,
        column: link.column,
        text: link.text,
        url: link.url,
        reason: result.reason,
      });
    }
  }

  return {deadLinks, totalLinks: links.length};
}

async function buildContributorMap() {
  const teamFile = path.join(CONTENT_DIR, 'community/team.md');
  const teamContent = await readFileWithCache(teamFile);

  const teamMemberPattern = /<TeamMember[^>]*permalink=["']([^"']+)["']/g;
  let match;

  while ((match = teamMemberPattern.exec(teamContent)) !== null) {
    const permalink = match[1];
    contributorMap.set(permalink, `/community/team#${permalink}`);
  }

  const ackFile = path.join(CONTENT_DIR, 'community/acknowledgements.md');
  const ackContent = await readFileWithCache(ackFile);
  const contributorPattern = /\*\s*\[([^\]]+)\]\(([^)]+)\)/g;

  while ((match = contributorPattern.exec(ackContent)) !== null) {
    const name = match[1];
    const url = match[2];
    const hyphenatedName = name.toLowerCase().replace(/\s+/g, '-');
    if (!contributorMap.has(hyphenatedName)) {
      contributorMap.set(hyphenatedName, url);
    }
  }
}

async function fetchErrorCodes() {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json'
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch error codes: ${response.status}`);
    }
    const codes = await response.json();
    errorCodes = new Set(Object.keys(codes));
    console.log(chalk.gray(`Fetched ${errorCodes.size} React error codes`));
  } catch (error) {
    throw new Error(`Failed to fetch error codes: ${error.message}`);
  }
}

async function buildRedirectsMap() {
  try {
    const vercelConfigPath = path.join(__dirname, '../vercel.json');
    const vercelConfig = JSON.parse(
      await fs.promises.readFile(vercelConfigPath, 'utf8')
    );

    if (vercelConfig.redirects) {
      for (const redirect of vercelConfig.redirects) {
        redirectMap.set(redirect.source, redirect.destination);
      }
      console.log(
        chalk.gray(`Loaded ${redirectMap.size} redirects from vercel.json`)
      );
    }
  } catch (error) {
    console.log(
      chalk.yellow(
        `Warning: Could not load redirects from vercel.json: ${error.message}\n`
      )
    );
  }
}

async function main() {
  const files = getMarkdownFiles();
  console.log(chalk.gray(`Checking ${files.length} markdown files...`));

  await fetchErrorCodes();
  await buildRedirectsMap();
  await buildContributorMap();
  await buildAnchorMap(files);

  const filePromises = files.map((filePath) => processFile(filePath));
  const results = await Promise.all(filePromises);
  const deadLinks = results.flatMap((r) => r.deadLinks);
  const totalLinks = results.reduce((sum, r) => sum + r.totalLinks, 0);

  if (deadLinks.length > 0) {
    console.log('\n');
    for (const link of deadLinks) {
      console.log(chalk.yellow(`${link.file}:${link.line}:${link.column}`));
      console.log(chalk.reset(`  Link text: ${link.text}`));
      console.log(chalk.reset(`  URL: ${link.url}`));
      console.log(`  ${chalk.red('✗')} ${chalk.red(link.reason)}\n`);
    }

    console.log(
      chalk.red(
        `\nFound ${deadLinks.length} dead link${
          deadLinks.length > 1 ? 's' : ''
        } out of ${totalLinks} total links\n`
      )
    );
    process.exit(1);
  }

  console.log(chalk.green(`\n✓ All ${totalLinks} links are valid!\n`));
  process.exit(0);
}

main().catch((error) => {
  console.log(chalk.red(`Error: ${error.message}`));
  process.exit(1);
});
