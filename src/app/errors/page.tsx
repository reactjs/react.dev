import type {Metadata, ResolvingMetadata} from 'next';
import {fetchReactErrorCodes} from './[errorCode]/lib/fetch-error-codes';
import ErrorDecoderPage from './components/error-decoder-page';

export default async function ErrorPage() {
  const errorCodes = await fetchReactErrorCodes();

  return <ErrorDecoderPage errorCode={null} errorCodes={errorCodes} />;
}

export async function generateMetadata(
  _: unknown,
  parent?: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParent = await parent;
  const parentOpenGraph = resolvedParent ? resolvedParent.openGraph : {};

  return {
    title: 'Minified Error Decoder',
    alternates: {
      canonical: `./`,
    },
    openGraph: {
      ...parentOpenGraph,
      title: 'Minified Error Decoder',
    },
  };
}
