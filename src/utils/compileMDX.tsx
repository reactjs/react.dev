import fs from 'fs';
import {FileStore, stableHash} from 'metro-cache';
import grayMatter from 'gray-matter';
import {compile, run} from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import {remarkPlugins} from '../../plugins/markdownToHtml';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import {MDXComponents} from '../components/MDX/MDXComponents'; // Assuming MDXComponents is modularized
import visit from 'unist-util-visit';
import {u} from 'unist-builder';

const DISK_CACHE_BREAKER = 11;

export function remarkTOCExtractor({maxDepth = Infinity} = {}) {
  return (tree, file) => {
    const toc = [];

    visit(tree, (node) => {
      // Standard markdown headings
      if (node.type === 'heading') {
        if (node.depth > maxDepth) {
          return;
        }
        const text = node.children
          .filter((child) => child.type === 'text')
          .map((child) => child.value)
          .join('');
        const id =
          node.data?.hProperties?.id || text.toLowerCase().replace(/\s+/g, '-');

        toc.push({
          depth: node.depth,
          text,
          url: `#${id}`,
        });
      }

      // MDX custom components (e.g., <TeamMember>)
      else if (node.type === 'mdxJsxFlowElement') {
        switch (node.name) {
          case 'TeamMember': {
            // Extract attributes like name, permalink, etc.
            let name = 'Team Member';
            let permalink = 'team-member';

            if (Array.isArray(node.attributes)) {
              for (const attr of node.attributes) {
                if (attr.name === 'name' && attr.value) {
                  name = attr.value;
                } else if (attr.name === 'permalink' && attr.value) {
                  permalink = attr.value;
                }
              }
            }

            toc.push({
              url: `#${permalink}`,
              depth: 3,
              text: name,
            });
            break;
          }

          // Similarly handle <Challenges>, <Recap>, or any other custom tags if needed
          case 'Challenges':
            toc.push({
              url: '#challenges',
              depth: 2,
              text: 'Challenges',
            });
            break;
          case 'Recap':
            toc.push({
              url: '#recap',
              depth: 2,
              text: 'Recap',
            });
            break;
          default:
            break;
        }
      }
    });

    // Insert "Overview" at the top if there's at least one heading
    if (toc.length > 0) {
      toc.unshift({
        url: '#',
        text: 'Overview',
        depth: 2,
      });
    }

    file.data.toc = toc;
  };
}

function remarkWrapElements() {
  const fullWidthTypes = [
    'Sandpack',
    'FullWidth',
    'Illustration',
    'IllustrationBlock',
    'Challenges',
    'Recipes',
  ];

  return (tree) => {
    const newChildren = [];
    let wrapQueue = [];

    function flushWrapper() {
      if (wrapQueue.length > 0) {
        newChildren.push(
          u('mdxJsxFlowElement', {
            name: 'MaxWidth',
            attributes: [],
            children: wrapQueue,
          })
        );
        wrapQueue = [];
      }
    }

    for (const node of tree.children) {
      if (
        node.type === 'mdxJsxFlowElement' &&
        fullWidthTypes.includes(node.name)
      ) {
        flushWrapper();
        newChildren.push(node);
      } else {
        wrapQueue.push(node);
      }
    }
    flushWrapper();

    tree.children = newChildren;
  };
}

export default async function compileMDX(
  mdx: string,
  path: string | string[],
  params: {[key: string]: any}
): Promise<{content: JSX.Element; toc: any; meta: any}> {
  // Cache setup
  const store = new FileStore({
    root: `${process.cwd()}/node_modules/.cache/react-docs-mdx/`,
  });

  const hash = Buffer.from(
    stableHash({
      mdx,
      ...params,
      DISK_CACHE_BREAKER,
      lockfile: fs.readFileSync(`${process.cwd()}/yarn.lock`, 'utf8'),
    })
  );

  // const cached = await store.get(hash);
  // if (cached) {
  //   console.log(
  //     `Reading compiled MDX for /${path} from ./node_modules/.cache/`
  //   );
  //   return cached;
  // }

  if (process.env.NODE_ENV === 'production') {
    console.log(`Cache miss for MDX for /${path} from ./node_modules/.cache/`);
  }

  // Compile the MDX source code
  const code = await compile(mdx, {
    remarkPlugins: [
      ...remarkPlugins,
      remarkGfm,
      remarkFrontmatter,
      remarkTOCExtractor,
      remarkWrapElements,
    ],

    rehypePlugins: [
      // Support stuff like ```js App.js {1-5} active by passing it through.
      function rehypeMetaAsAttributes() {
        return (tree) => {
          visit(tree, 'element', (node) => {
            if (
              // @ts-expect-error -- tagName is a valid property
              node.tagName === 'code' &&
              node.data &&
              node.data.meta
            ) {
              // @ts-expect-error -- properties is a valid property
              node.properties.meta = node.data.meta;
            }
          });
        };
      },
    ],
    outputFormat: 'function-body',
  });

  const {data: meta} = grayMatter(mdx);

  const {default: MDXContent} = await run(String(code), {
    ...runtime,
    baseUrl: import.meta.url,
  });

  const content = <MDXContent components={{...MDXComponents}} />;

  return {
    content,
    toc: code.data.toc,
    meta,
  };
}
