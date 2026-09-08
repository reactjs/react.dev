/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {use} from 'react';
import * as React from 'react';
import {
  SandpackProvider,
  type SandpackFile,
} from '@codesandbox/sandpack-react/unstyled';
import {SandpackLogLevel} from '@codesandbox/sandpack-client';
import {CustomPreset} from './CustomPreset';
import {CustomTheme} from './Themes';
import {loadTemplateRSC} from './templateRSC';
import {RscFileBridge} from './sandpack-rsc/RscFileBridge';

type SandpackProps = {
  files: Record<string, SandpackFile>;
  autorun?: boolean;
};

const sandboxStyle = `
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

h3 {
  margin-top: 0;
  font-size: 18px;
}

h4 {
  margin-top: 0;
  font-size: 16px;
}

h5 {
  margin-top: 0;
  font-size: 14px;
}

h6 {
  margin-top: 0;
  font-size: 12px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}
`.trim();

function SandpackRSCRoot(props: SandpackProps) {
  const {files: sourceFiles, autorun = true} = props;
  const templateRSC = use(loadTemplateRSC());
  const files = {...sourceFiles};

  if ('/index.html' in files) {
    throw new Error(
      'You cannot use `index.html` file in sandboxes. ' +
        'Only `public/index.html` is respected by Sandpack and CodeSandbox (where forks are created).'
    );
  }

  files['/src/styles.css'] = {
    code: [sandboxStyle, files['/src/styles.css']?.code ?? ''].join('\n\n'),
    hidden: true,
  };

  return (
    <div className="sandpack sandpack--playground w-full my-8" dir="ltr">
      <SandpackProvider
        files={{...templateRSC, ...files}}
        theme={CustomTheme}
        customSetup={{
          dependencies: {},
        }}
        options={{
          autorun,
          initMode: 'user-visible',
          initModeObserverOptions: {rootMargin: '1400px 0px'},
          bundlerURL: 'https://786946de.sandpack-bundler-4bw.pages.dev',
          logLevel: SandpackLogLevel.None,
        }}>
        <RscFileBridge />
        <CustomPreset
          providedFiles={Object.keys(files)}
          showOpenInCodeSandbox={false}
        />
      </SandpackProvider>
    </div>
  );
}

export default SandpackRSCRoot;
