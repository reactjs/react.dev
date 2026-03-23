const URL_POSTFIX = '_.rsc';
const HEADER_ACTION_ID = 'x-rsc-action';

export function createRscRenderRequest(urlString, action) {
  const url = new URL(urlString);
  url.pathname += URL_POSTFIX;
  const headers = new Headers();
  if (action) {
    headers.set(HEADER_ACTION_ID, action.id);
  }
  return new Request(url.toString(), {
    method: action ? 'POST' : 'GET',
    headers,
    body: action?.body,
  });
}

export function parseRenderRequest(request) {
  const url = new URL(request.url);
  const isAction = request.method === 'POST';
  if (url.pathname.endsWith(URL_POSTFIX)) {
    url.pathname = url.pathname.slice(0, -URL_POSTFIX.length);
    const actionId = request.headers.get(HEADER_ACTION_ID) || undefined;
    if (request.method === 'POST' && !actionId) {
      throw new Error('Missing action id header for RSC action request');
    }
    return {
      isRsc: true,
      isAction,
      actionId,
      request: new Request(url, request),
      url,
    };
  } else {
    return {
      isRsc: false,
      isAction,
      request,
      url,
    };
  }
}
