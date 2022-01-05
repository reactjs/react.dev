import {SandpackReactDevTools} from '@codesandbox/sandpack-react';

function ReactDevTools() {
  const theme = window.__theme as 'light' | 'dark';
  return <SandpackReactDevTools theme={theme} />;
}

export default ReactDevTools;
