import fsp from 'node:fs/promises';
import fs from 'node:fs';
import {Page} from '../../../components/Layout/Page';
import sidebarLearn from 'sidebarLearn.json';
import type {RouteItem} from '../../../components/Layout/getRouteMeta';
import {notFound} from 'next/navigation';
import {join} from 'node:path';
import compileMDX from '../../../utils/compileMDX';
import ErrorMDX from './error-mdx';

export default async function ErrorDecoderPage({
  errorCode,
  errorCodes,
}: {
  errorCode: string | null;
  errorCodes: {[key: string]: string};
}) {
  if (errorCode && !errorCodes[errorCode]) {
    notFound();
  }

  const rootDir = join(process.cwd(), 'src', 'content', 'errors');
  let path = errorCode || 'index';
  let mdx;
  if (fs.existsSync(join(rootDir, path + '.md'))) {
    mdx = await fsp.readFile(join(rootDir, path + '.md'), 'utf8');
  } else {
    mdx = await fsp.readFile(join(rootDir, 'generic.md'), 'utf8');
  }

  const {content} = await compileMDX(mdx, path, {code: errorCode, errorCodes});
  const errorMessage = errorCode ? errorCodes[errorCode] : null;

  return (
    <Page
      toc={[]}
      meta={{
        title: errorCode
          ? 'Minified React error #' + errorCode
          : 'Minified Error Decoder',
      }}
      routeTree={sidebarLearn as RouteItem}
      section="unknown"
      appRouter>
      <div>
        <ErrorMDX
          content={content}
          errorCode={errorCode}
          errorMessage={errorMessage}
        />
      </div>
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
  );
}
