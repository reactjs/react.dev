/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {useSandpack} from '@codesandbox/sandpack-react';
import {IconArrowSmall} from '../../Icon/IconArrowSmall';
export interface DownloadButtonProps {}

export const DownloadButton: React.FC<DownloadButtonProps> = () => {
  const {sandpack} = useSandpack();
  const [supported, setSupported] = React.useState(false);
  React.useEffect(() => {
    // This detection will work in Chrome 97+
    if (
      (HTMLScriptElement as any).supports &&
      (HTMLScriptElement as any).supports('importmap')
    ) {
      setSupported(true);
    }
  }, []);

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
      title="Refresh Sandpack"
      type="button">
      <IconArrowSmall
        displayDirection="down"
        className="inline mb-0.5 mr-1 mt-1"
      />{' '}
      Download
    </button>
  );
};
