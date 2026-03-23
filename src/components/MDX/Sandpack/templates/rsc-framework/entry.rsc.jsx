import {
  renderToReadableStream,
  createTemporaryReferenceSet,
  decodeReply,
  loadServerAction,
  decodeAction,
  decodeFormState,
} from '@vitejs/plugin-rsc/rsc';
import {Root} from '../root.jsx';
import {parseRenderRequest} from './request.jsx';

export default {fetch: handler};

async function handler(request) {
  const renderRequest = parseRenderRequest(request);
  request = renderRequest.request;

  let returnValue;
  let formState;
  let temporaryReferences;
  let actionStatus;

  if (renderRequest.isAction === true) {
    if (renderRequest.actionId) {
      const contentType = request.headers.get('content-type');
      const body = contentType?.startsWith('multipart/form-data')
        ? await request.formData()
        : await request.text();
      temporaryReferences = createTemporaryReferenceSet();
      const args = await decodeReply(body, {temporaryReferences});
      const action = await loadServerAction(renderRequest.actionId);
      try {
        const data = await action.apply(null, args);
        returnValue = {ok: true, data};
      } catch (e) {
        returnValue = {ok: false, data: e};
        actionStatus = 500;
      }
    } else {
      const formData = await request.formData();
      const decodedAction = await decodeAction(formData);
      try {
        const result = await decodedAction();
        formState = await decodeFormState(result, formData);
      } catch (e) {
        return new Response('Internal Server Error: server action failed', {
          status: 500,
        });
      }
    }
  }

  const rscPayload = {
    root: <Root url={renderRequest.url} />,
    formState,
    returnValue,
  };
  const rscOptions = {temporaryReferences};
  const rscStream = renderToReadableStream(rscPayload, rscOptions);

  if (renderRequest.isRsc) {
    return new Response(rscStream, {
      status: actionStatus,
      headers: {
        'content-type': 'text/x-component;charset=utf-8',
      },
    });
  }

  const ssrEntryModule = await import.meta.viteRsc.loadModule('ssr', 'index');
  const ssrResult = await ssrEntryModule.renderHTML(rscStream, {
    formState,
    debugNojs: renderRequest.url.searchParams.has('__nojs'),
  });

  return new Response(ssrResult.stream, {
    status: ssrResult.status,
    headers: {
      'Content-type': 'text/html',
    },
  });
}

if (import.meta.hot) {
  import.meta.hot.accept();
}
