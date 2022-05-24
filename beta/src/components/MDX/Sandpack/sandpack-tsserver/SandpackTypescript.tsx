import {
  SandpackConsumer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  SandpackSetup,
  SandpackThemeProvider,
  SandpackPredefinedTemplate,
  SandpackThemeProp,
  SandpackFiles,
} from '@codesandbox/sandpack-react';
import '@codesandbox/sandpack-react/dist/index.css';
import React from 'react';
import {CodeEditor} from './CodeEditor';

declare module '@codesandbox/sandpack-react' {
  interface SandpackProviderProps {
    children?: React.ReactNode;
  }

  // @ts-expect-error Force allow overriding variables
  const SandpackThemeProvider: React.FC<{
    theme?: SandpackThemeProp;
    children?: React.ReactNode;
  }>;
}

export const SandpackTypescript: React.FC<{
  theme?: SandpackThemeProp;
  files?: SandpackFiles;
  customSetup?: SandpackSetup;
  template: SandpackPredefinedTemplate;
}> = ({customSetup, template, theme}) => {
  return (
    <div
      style={
        {
          position: 'relative',
          '--sp-border-radius': '2px',
        } as React.CSSProperties
      }>
      <SandpackProvider template={template} customSetup={customSetup}>
        <SandpackThemeProvider theme={theme}>
          <SandpackLayout>
            <SandpackTypescriptEditor />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackThemeProvider>
      </SandpackProvider>
    </div>
  );
};

export function SandpackTypescriptEditor() {
  return (
    <SandpackConsumer>
      {(state) => <CodeEditor activePath={state?.activePath} />}
    </SandpackConsumer>
  );
}

type wat = JSX.Element;
