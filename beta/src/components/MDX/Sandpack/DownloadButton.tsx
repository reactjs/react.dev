/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {useSandpack} from '@codesandbox/sandpack-react';
import {IconDownload} from '../../Icon/IconDownload';
export interface DownloadButtonProps {}

let supportsImportMap: boolean | void;

function useSupportsImportMap() {
  function subscribe() {
    // It never updates.
    return () => {};
  }
  function getCurrentValue() {
    if (supportsImportMap === undefined) {
      supportsImportMap =
        (HTMLScriptElement as any).supports &&
        (HTMLScriptElement as any).supports('importmap');
    }
    return supportsImportMap;
  }
  function getServerSnapshot() {
    return false;
  }

  return React.useSyncExternalStore(
    subscribe,
    getCurrentValue,
    getServerSnapshot
  );
}

export const DownloadButton: React.FC<DownloadButtonProps> = () => {
  const {sandpack} = useSandpack();
  const supported = useSupportsImportMap();
  if (!supported) {
    return null;
  }

  const downloadHTML = () => {
    const css = sandpack.files['/styles.css']?.code ?? '';
    const code = sandpack.files['/App.js']?.code ?? '';
    const blob = new Blob([
      `<!DOCTYPE html>
<html>
<body>
  <div id="root"></div>
</body>
<!-- This setup is not suitable for production. -->
<!-- Only use it in development! -->
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="importmap">
{
  "imports": {
    "react": "https://cdn.skypack.dev/react",
    "react-dom": "https://cdn.skypack.dev/react-dom"
  }
}
</script>
<script type="text/babel" data-type="module">
import * as React from 'react';
import * as ReactDOM from 'react-dom';

${code.replace('export default ', 'let Root = ')}

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
</script>
<style>
${css}
</style>
</html>`,
    ]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'sandbox.html';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
      onClick={downloadHTML}
      title="Download Sandbox"
      type="button">
      <IconDownload className="inline mr-1" /> Download
    </button>
  );
};
