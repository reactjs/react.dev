import {createFromReadableStream} from '@vitejs/plugin-rsc/ssr';
import React from 'react';
import {renderToReadableStream} from 'react-dom/server.edge';
import {injectRSCPayload} from 'rsc-html-stream/server';

export async function renderHTML(rscStream, options) {
  const [rscStream1, rscStream2] = rscStream.tee();

  let payload;
  function SsrRoot() {
    payload ??= createFromReadableStream(rscStream1);
    return React.use(payload).root;
  }

  const bootstrapScriptContent =
    await import.meta.viteRsc.loadBootstrapScriptContent('index');
  let htmlStream;
  let status;
  try {
    htmlStream = await renderToReadableStream(<SsrRoot />, {
      bootstrapScriptContent: options?.debugNojs
        ? undefined
        : bootstrapScriptContent,
      nonce: options?.nonce,
      formState: options?.formState,
    });
  } catch (e) {
    status = 500;
    htmlStream = await renderToReadableStream(
      <html>
        <body>
          <noscript>Internal Server Error: SSR failed</noscript>
        </body>
      </html>,
      {
        bootstrapScriptContent:
          `self.__NO_HYDRATE=1;` +
          (options?.debugNojs ? '' : bootstrapScriptContent),
        nonce: options?.nonce,
      }
    );
  }

  let responseStream = htmlStream;
  if (!options?.debugNojs) {
    responseStream = responseStream.pipeThrough(
      injectRSCPayload(rscStream2, {
        nonce: options?.nonce,
      })
    );
  }

  return {stream: responseStream, status};
}
