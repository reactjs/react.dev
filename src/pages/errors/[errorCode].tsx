import {Fragment, useMemo} from 'react';
import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from 'sidebarLearn.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next';
import {ErrorDecoderContext} from 'components/ErrorDecoderContext';
import compileMDX from 'utils/compileMDX';

interface ErrorDecoderProps {
  errorCode: string | null;
  errorMessage: string | null;
  content: string;
  toc: string;
  meta: any;
}

export default function ErrorDecoderPage({
  errorMessage,
  errorCode,
  content,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const parsedContent = useMemo<React.ReactNode>(
    () => JSON.parse(content, reviveNodeOnClient),
    [content]
  );

  return (
    <ErrorDecoderContext.Provider value={{errorMessage, errorCode}}>
      <Page
        toc={[]}
        meta={{
          title: errorCode
            ? `Minified React error #${errorCode}`
            : 'Minified Error Decoder',
        }}
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
  const errorCodes: {[key: string]: string} = (cachedErrorCodes ||= await (
    await fetch(
      'https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json'
    )
  ).json());

  const code = typeof params?.errorCode === 'string' ? params?.errorCode : null;
  if (code && !errorCodes[code]) {
    return {
      notFound: true,
    };
  }

  const fs = require('fs');
  const rootDir = process.cwd() + '/src/content/errors';

  // Read MDX from the file.
  let path = params?.errorCode || 'index';
  let mdx;
  try {
    mdx = fs.readFileSync(rootDir + '/' + path + '.md', 'utf8');
  } catch {
    // if [errorCode].md is not found, fallback to generic.md
    mdx = fs.readFileSync(rootDir + '/generic.md', 'utf8');
  }

  const {content, toc, meta} = await compileMDX(mdx, path, {code, errorCodes});

  return {
    props: {
      content,
      toc,
      meta,
      errorCode: code,
      errorMessage: code ? errorCodes[code] : null,
    },
  };
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
      errorCode: code,
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};
