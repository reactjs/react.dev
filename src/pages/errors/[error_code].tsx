import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import ErrorDecoder from 'components/ErrorDecoder';
import sidebarLearn from 'sidebarLearn.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next';

const {MaxWidth, p: P, Intro} = MDXComponents;

interface ErrorDecoderProps {
  errorCode: string;
  errorMessages: string;
}

export default function ErrorDecoderPage({
  errorMessages,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Page
      toc={[]}
      meta={{title: 'Error Decoder'}}
      routeTree={sidebarLearn as RouteItem}
      section="unknown">
      <MaxWidth>
        <Intro>
          <P>
            In the minified production build of React, we avoid sending down
            full error messages in order to reduce the number of bytes sent over
            the wire.
          </P>
        </Intro>
        <P>
          We highly recommend using the development build locally when debugging
          your app since it tracks additional debug info and provides helpful
          warnings about potential problems in your apps, but if you encounter
          an exception while using the production build, this page will
          reassemble the original error message.
        </P>
        <ErrorDecoder errorMessages={errorMessages} />
      </MaxWidth>
    </Page>
  );
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

  return {
    props: {
      errorCode: code,
      errorMessages: errorCodes[code],
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
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
