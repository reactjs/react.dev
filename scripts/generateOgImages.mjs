/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Generates a static OG image for every content page, so social
// cards show the page title without any runtime image generation.
// Run after `next build` (see the `build` script in package.json).

import fs from 'fs';
import path from 'path';
import satori from 'satori';
import {Resvg} from '@resvg/resvg-js';
import matter from 'gray-matter';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src', 'content');
const OUT_DIR = path.join(ROOT, 'public', 'images', 'og');
const CONCURRENCY = 8;

const SECTION_LABELS = {
  learn: 'Learn React',
  reference: 'API Reference',
  community: 'Community',
  blog: 'Blog',
};

const bold = fs.readFileSync(
  path.join(ROOT, 'public', 'fonts', 'Optimistic_Display_W_Bd.ttf')
);
const medium = fs.readFileSync(
  path.join(ROOT, 'public', 'fonts', 'Optimistic_Display_W_Md.ttf')
);

function el(type, style, children) {
  return {type, props: {style, children}};
}

function card(title, pagePath) {
  const section = pagePath.split('/')[1] ?? '';
  const label = SECTION_LABELS[section] ?? 'React';
  const logo = {
    type: 'svg',
    props: {
      width: 80,
      height: 72,
      viewBox: '-10.5 -9.45 21 18.9',
      fill: 'none',
      children: [
        {type: 'circle', props: {cx: 0, cy: 0, r: 2, fill: '#58c4dc'}},
        {
          type: 'g',
          props: {
            stroke: '#58c4dc',
            strokeWidth: 1,
            fill: 'none',
            children: [
              {type: 'ellipse', props: {rx: 10, ry: 4.5}},
              {
                type: 'ellipse',
                props: {rx: 10, ry: 4.5, transform: 'rotate(60)'},
              },
              {
                type: 'ellipse',
                props: {rx: 10, ry: 4.5, transform: 'rotate(120)'},
              },
            ],
          },
        },
      ],
    },
  };
  return el(
    'div',
    {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '72px 80px',
      backgroundColor: '#23272f',
      backgroundImage:
        'radial-gradient(circle at 25% 30%, #343a46 0%, #23272f 55%)',
    },
    [
      el('div', {display: 'flex', alignItems: 'center', gap: '20px'}, [
        logo,
        el(
          'div',
          {
            fontSize: 48,
            fontFamily: 'Optimistic Display Bold',
            color: '#f6f7f9',
          },
          'React'
        ),
      ]),
      el(
        'div',
        {
          marginTop: 'auto',
          marginBottom: 'auto',
          fontSize: title.length > 24 ? 72 : 96,
          fontFamily: 'Optimistic Display Bold',
          color: '#f6f7f9',
          lineHeight: 1.1,
          wordBreak: 'break-word',
        },
        title
      ),
      el(
        'div',
        {
          fontSize: 32,
          fontFamily: 'Optimistic Display Medium',
          color: '#99a1b3',
        },
        label
      ),
    ]
  );
}

async function renderCard(title, pagePath) {
  const svg = await satori(card(title, pagePath), {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Optimistic Display Bold',
        data: bold,
        weight: 700,
        style: 'normal',
      },
      {
        name: 'Optimistic Display Medium',
        data: medium,
        weight: 500,
        style: 'normal',
      },
    ],
  });
  return new Resvg(svg, {fitTo: {mode: 'width', value: 1200}}).render().asPng();
}

function collectSidebarTitles() {
  const titles = new Map();
  for (const name of fs.readdirSync(path.join(ROOT, 'src'))) {
    if (!/^sidebar.*\.json$/.test(name)) continue;
    const walk = (node) => {
      if (node.path && node.title) {
        titles.set(node.path, node.title);
      }
      for (const child of node.routes ?? []) walk(child);
    };
    walk(JSON.parse(fs.readFileSync(path.join(ROOT, 'src', name), 'utf8')));
  }
  return titles;
}

const sidebarTitles = collectSidebarTitles();

function collectPages(dir, out) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectPages(full, out);
    } else if (entry.name.endsWith('.md')) {
      const rel = path.relative(CONTENT_DIR, full).replace(/\.md$/, '');
      const segments = rel.split(path.sep);
      if (segments[segments.length - 1] === 'index') {
        segments.pop();
      }
      const pagePath = '/' + segments.join('/');
      if (pagePath === '/' || pagePath.startsWith('/errors')) {
        continue;
      }
      const {data} = matter(fs.readFileSync(full, 'utf8'));
      const title = data.title ?? sidebarTitles.get(pagePath);
      if (title) {
        out.push({title: String(title), pagePath});
      }
    }
  }
  return out;
}

export function ogImageFileName(pagePath) {
  return pagePath.replace(/^\//, '').replace(/\//g, '-') + '.png';
}

async function main() {
  const pages = collectPages(CONTENT_DIR, []);
  fs.mkdirSync(OUT_DIR, {recursive: true});
  let done = 0;
  const queue = [...pages];
  async function worker() {
    for (;;) {
      const page = queue.shift();
      if (!page) return;
      const png = await renderCard(page.title, page.pagePath);
      fs.writeFileSync(path.join(OUT_DIR, ogImageFileName(page.pagePath)), png);
      done++;
      if (done % 100 === 0) {
        console.log(`og-images: ${done}/${pages.length}`);
      }
    }
  }
  await Promise.all(Array.from({length: CONCURRENCY}, worker));
  console.log(`og-images: generated ${done} images in public/images/og`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
