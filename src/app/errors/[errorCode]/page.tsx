import {unstable_cache} from 'next/cache';
import {notFound} from 'next/navigation';
import ErrorDecoderPage from '../components/error-decoder-page';
import type {Metadata, ResolvingMetadata} from 'next';

interface ErrorDecoderPageProps {
  params: Promise<{errorCode: string}>;
}

export default async function ErrorPage({params}: ErrorDecoderPageProps) {
  const {errorCode} = await params;
  const errorCodes = await fetchReactErrorCodes();

  if (errorCode && !(errorCode in errorCodes)) {
    notFound();
  }

  return <ErrorDecoderPage errorCode={errorCode} errorCodes={errorCodes} />;
}

const fetchReactErrorCodes = unstable_cache(async () => {
  return (
    await fetch(
      'https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json'
    )
  ).json() as Promise<{[key: string]: string}>;
}, ['react-error-codes']);

export async function generateStaticParams(): Promise<
  Array<{errorCode: string}>
> {
  return Object.keys(await fetchReactErrorCodes()).map((code) => ({
    errorCode: code,
  }));
}

export async function generateMetadata(
  {params}: ErrorDecoderPageProps,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const {errorCode} = await params;
  const resolvedParent = await parent;
  const parentOpenGraph = resolvedParent ? resolvedParent.openGraph : {};

  return {
    title: `Minified React error #${errorCode}`,
    alternates: {
      canonical: `./`,
    },
    openGraph: {
      ...parentOpenGraph,
      title: `Minified React error #${errorCode}`,
    },
  };
}
