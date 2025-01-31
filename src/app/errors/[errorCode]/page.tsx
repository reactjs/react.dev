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

  return Object.keys(errorCodes!).map((code) => ({
    errorCode: code,
  }));
}

async function getErrorPageContent(params: {errorCode?: string}) {
  const errorCodes = await getErrorCodes();

  const code = params?.errorCode;

  if (!code || !errorCodes?.[code]) {
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
    errorMessage: errorCodes[code],
  };
}

export default async function ErrorDecoderPage({
  params,
}: {
  params: Promise<{errorCode?: string}>;
}) {
  const {content, errorMessage, errorCode} = await getErrorPageContent(
    await params
  );

  return (
    <ErrorDecoderProvider errorMessage={errorMessage} errorCode={errorCode}>
      <Page
        pathname={`/${errorCode}`}
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

  const title = `Minified React error #${errorCode}`;

  return generateSeoMetadata({
    title,
    path: `/${errorCode}`,
    isHomePage: false,
  });
}
