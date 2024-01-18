import {MDXComponents} from 'components/MDX/MDXComponents';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~ IMPORTANT: BUMP THIS IF YOU CHANGE ANY CODE BELOW ~~~
const DISK_CACHE_BREAKER = 8;
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default async function compileMDX(
  mdx: string,
  path: string | string[],
  params: {[key: string]: any}
): Promise<{content: string; toc: string; meta: any}> {
  const fs = require('fs');
  const {
    prepareMDX,
    PREPARE_MDX_CACHE_BREAKER,
  } = require('../utils/prepareMDX');
  const mdxComponentNames = Object.keys(MDXComponents);

  // See if we have a cached output first.
  const {FileStore, stableHash} = require('metro-cache');
  const store = new FileStore({
    root: process.cwd() + '/node_modules/.cache/react-docs-mdx/',
  });
  const hash = Buffer.from(
    stableHash({
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // ~~~~ IMPORTANT: Everything that the code below may rely on.
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      mdx,
      ...params,
      mdxComponentNames,
      DISK_CACHE_BREAKER,
      PREPARE_MDX_CACHE_BREAKER,
      lockfile: fs.readFileSync(process.cwd() + '/yarn.lock', 'utf8'),
    })
  );
  const cached = await store.get(hash);
  if (cached) {
    console.log(
      'Reading compiled MDX for /' + path + ' from ./node_modules/.cache/'
    );
    return cached;
  }
  if (process.env.NODE_ENV === 'production') {
    console.log(
      'Cache miss for MDX for /' + path + ' from ./node_modules/.cache/'
    );
  }

  // If we don't add these fake imports, the MDX compiler
  // will insert a bunch of opaque components we can't introspect.
  // This will break the prepareMDX() call below.
  let mdxWithFakeImports =
    mdx +
    '\n\n' +
    mdxComponentNames
      .map((key) => 'import ' + key + ' from "' + key + '";\n')
      .join('\n');

  // Turn the MDX we just read into some JS we can execute.
  const {remarkPlugins} = require('../../plugins/markdownToHtml');
  const {compile: compileMdx} = await import('@mdx-js/mdx');
  const visit = (await import('unist-util-visit')).default;
  const jsxCode = await compileMdx(mdxWithFakeImports, {
    remarkPlugins: [
      ...remarkPlugins,
      (await import('remark-gfm')).default,
      (await import('remark-frontmatter')).default,
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
  });
  const {transform} = require('@babel/core');
  const jsCode = await transform(jsxCode, {
    plugins: ['@babel/plugin-transform-modules-commonjs'],
    presets: ['@babel/preset-react'],
  }).code;

  // Prepare environment for MDX.
  let fakeExports = {};
  const fakeRequire = (name: string) => {
    if (name === 'react/jsx-runtime') {
      return require('react/jsx-runtime');
    } else {
      // For each fake MDX import, give back the string component name.
      // It will get serialized later.
      return name;
    }
  };
  const evalJSCode = new Function('require', 'exports', jsCode);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // THIS IS A BUILD-TIME EVAL. NEVER DO THIS WITH UNTRUSTED MDX (LIKE FROM CMS)!!!
  // In this case it's okay because anyone who can edit our MDX can also edit this file.
  evalJSCode(fakeRequire, fakeExports);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // @ts-expect-error -- default exports is existed after eval
  const reactTree = fakeExports.default({});

  // Pre-process MDX output and serialize it.
  let {toc, children} = prepareMDX(reactTree.props.children);
  if (path === 'index') {
    toc = [];
  }

  // Parse Frontmatter headers from MDX.
  const fm = require('gray-matter');
  const meta = fm(mdx).data;

  const output = {
    content: JSON.stringify(children, stringifyNodeOnServer),
    toc: JSON.stringify(toc, stringifyNodeOnServer),
    meta,
  };

  // Serialize a server React tree node to JSON.
  function stringifyNodeOnServer(key: unknown, val: any) {
    if (val != null && val.$$typeof === Symbol.for('react.element')) {
      // Remove fake MDX props.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Cache it on the disk.
  await store.set(hash, output);
  return output;
}
