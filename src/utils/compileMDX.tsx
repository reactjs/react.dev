import fs from 'fs';
import {FileStore, stableHash} from 'metro-cache';
import grayMatter from 'gray-matter';
import {compile, run} from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import {remarkPlugins} from '../../plugins/markdownToHtml';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import {prepareMDX} from './prepareMDX'; // Assuming prepareMDX is modularized
import {MDXComponents} from '../components/MDX/MDXComponents'; // Assuming MDXComponents is modularized
import visit from 'unist-util-visit';

const DISK_CACHE_BREAKER = 11;

export default async function compileMDX(
  mdx: string,
  path: string | string[],
  params: {[key: string]: any}
): Promise<{Component: JSX.Element; toc: any; meta: any}> {
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
  const code = String(
    await compile(mdx, {
      remarkPlugins: [...remarkPlugins, remarkGfm, remarkFrontmatter],

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
    })
  );

  // Parse frontmatter for metadata
  const {data: meta} = grayMatter(mdx);

  // Run the compiled code with the runtime and get the default export
  const {default: MDXContent} = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });

  // Prepare TOC (you can process toc within the MDX or separately)
  const {toc} = prepareMDX(MDXContent);

  // Return the ready-to-render React component
  return {
    content: <MDXContent components={{...MDXComponents}} />, // Replace {} with your custom components if needed
    toc,
    meta,
  };
}
