import {Fragment, useMemo} from 'react';
import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from 'sidebarLearn.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next';
import {ErrorDecoderContext} from '../../components/MDX/ErrorDecoderContext';

interface ErrorDecoderProps {
  errorCode: string;
  errorMessages: string;
  content: string;
}

export default function ErrorDecoderPage({
  errorMessages,
  content,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const parsedContent = useMemo<React.ReactNode>(
    () => JSON.parse(content, reviveNodeOnClient),
    [content]
  );

  return (
    <ErrorDecoderContext.Provider value={errorMessages}>
      <Page
        toc={[]}
        meta={{title: 'Error Decoder'}}
        routeTree={sidebarLearn as RouteItem}
        section="unknown">
        {parsedContent}
        {/* <MaxWidth>
          <P>
            We highly recommend using the development build locally when debugging
            your app since it tracks additional debug info and provides helpful
            warnings about potential problems in your apps, but if you encounter
            an exception while using the production build, this page will
            reassemble the original error message.
          </P>
          <ErrorDecoder />
        </MaxWidth> */}
      </Page>
    </ErrorDecoderContext.Provider>
  );
}

// Deserialize a client React tree from JSON.
function reviveNodeOnClient(key: unknown, val: any) {
  if (Array.isArray(val) && val[0] == '$r') {
    // Assume it's a React element.
    let type = val[1];
    let key = val[2];
    let props = val[3];
    if (type === 'wrapper') {
      type = Fragment;
      props = {children: props.children};
    }
    if (type in MDXComponents) {
      type = MDXComponents[type as keyof typeof MDXComponents];
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

/**
 * Next.js Page Router doesn't have a way to cache specific data fetching request.
 * But since Next.js uses limited number of workers, keep "cachedErrorCodes" as a
 * module level memory cache can reduce the number of requests down to once per worker.
 *
 * TODO: use `next/unstable_cache` when migrating to Next.js App Router
 */
let cachedErrorCodes: Record<string, string> | null = null;

export const getStaticProps: GetStaticProps<ErrorDecoderProps> = async ({
  params,
}) => {
  const errorCodes = (cachedErrorCodes ||= await (
    await fetch(
      'https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json'
    )
  ).json());

  const code =
    typeof params?.error_code === 'string' ? params?.error_code : null;
  if (!code || !errorCodes[code]) {
    return {
      notFound: true,
    };
  }

  /**
   * Read Markdown files from disk and render into MDX, then into JSON
   *
   * This is copied from [[...markdownPath]].js
   *
   * TODO: build a shared function
   */
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~ IMPORTANT: BUMP THIS IF YOU CHANGE ANY CODE BELOW ~~~
  const DISK_CACHE_BREAKER = 0;
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const fs = require('fs');
  const {
    prepareMDX,
    PREPARE_MDX_CACHE_BREAKER,
  } = require('../../utils/prepareMDX');
  const rootDir = process.cwd() + '/src/content/errors';
  const mdxComponentNames = Object.keys(MDXComponents);

  // Read MDX from the file.
  let path = params?.error_code || 'default';
  let mdx;
  try {
    mdx = fs.readFileSync(rootDir + path + '.md', 'utf8');
  } catch {
    // if error_code.md is not found, fallback to default.md
    mdx = fs.readFileSync(rootDir + '/default.md', 'utf8');
  }

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

  console.log({mdxComponentNames});

  // Turn the MDX we just read into some JS we can execute.
  const {remarkPlugins} = require('../../../plugins/markdownToHtml');
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
              'tagName' in node &&
              typeof node.tagName === 'string' &&
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
    props: {
      content: JSON.stringify(children, stringifyNodeOnServer),
      errorCode: code,
      errorMessages: errorCodes[code],
      toc: JSON.stringify(toc, stringifyNodeOnServer),
      meta,
    },
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
};

export const getStaticPaths: GetStaticPaths = async () => {
  /**
   * Fetch error codes from GitHub
   */
  const errorCodes = (cachedErrorCodes ||= await (
    await fetch(
      'https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json'
    )
  ).json());

  const paths = Object.keys(errorCodes).map((code) => ({
    params: {
      error_code: code,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};
