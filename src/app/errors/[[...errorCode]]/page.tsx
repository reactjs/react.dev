import {Page} from 'components/Layout/Page';
import sidebarLearn from '../../../sidebarLearn.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import {generateMDX} from 'utils/generateMDX';
import fs from 'fs/promises';
import path from 'path';
import {ErrorDecoderProvider} from 'components/ErrorDecoderProvider';
import {notFound} from 'next/navigation';
import {generateMetadata as generateSeoMetadata} from 'utils/generateMetadata';

let errorCodesCache: Record<string, string> | null = null;

async function getErrorCodes() {
  if (!errorCodesCache) {
    const response = await fetch(
      'https://raw.githubusercontent.com/facebook/react/main/scripts/error-codes/codes.json'
    );
    errorCodesCache = await response.json();
  }
  return errorCodesCache;
}

export async function generateStaticParams() {
  const errorCodes = await getErrorCodes();

  const staticParams = Object.keys(errorCodes!).map((code) => ({
    errorCode: [code],
  })) as Array<{errorCode: string[] | undefined}>;

  staticParams.push({errorCode: undefined});

  return staticParams;
}

async function getErrorPageContent(params: {errorCode: string[]}) {
  if (params.errorCode?.length > 1) {
    notFound();
  }

  const code = params.errorCode?.[0];

  const errorCodes = await getErrorCodes();

  if (code && !errorCodes?.[code]) {
    notFound();
  }

  const rootDir = path.join(process.cwd(), 'src/content/errors');
  let mdxPath = params?.errorCode || 'index';
  let mdx;

  try {
    mdx = await fs.readFile(path.join(rootDir, mdxPath + '.md'), 'utf8');
  } catch {
    mdx = await fs.readFile(path.join(rootDir, 'generic.md'), 'utf8');
  }

  const {content, toc, meta} = await generateMDX(mdx, mdxPath, {
    code,
    errorCodes,
  });

  return {
    content,
    toc,
    meta,
    errorCode: code,
    errorMessage: code ? errorCodes![code] : null,
  };
}

export default async function ErrorDecoderPage({
  params,
}: {
  params: Promise<{errorCode: string[]}>;
}) {
  const {content, errorMessage, errorCode} = await getErrorPageContent(
    await params
  );

  return (
    <ErrorDecoderProvider errorMessage={errorMessage} errorCode={errorCode}>
      <Page
        pathname={`/errors/${errorCode}`}
        toc={[]}
        meta={{
          title: errorCode
            ? `Minified React error #${errorCode}`
            : 'Minified Error Decoder',
        }}
        routeTree={sidebarLearn as RouteItem}
        section="unknown">
        <div className="whitespace-pre-line">{content}</div>
      </Page>
    </ErrorDecoderProvider>
  );
}

// Disable dynamic params to ensure all pages are statically generated
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{errorCode: string[]}>;
}) {
  const {errorCode} = await params;

  const title = errorCode
    ? `Minified React error #${errorCode}`
    : 'Minified Error Decoder';

  return generateSeoMetadata({
    title,
    path: `errors/${errorCode}`,
    isHomePage: false,
  });
}
