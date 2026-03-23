/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Children} from 'react';
import * as React from 'react';
import {SandpackProvider} from '@webcontainer/react';
import {CustomPreset} from './CustomPreset';
import {createFileMap} from './createFileMap';
import {CustomTheme} from './Themes';
import {viteRscTemplate} from './templates';

type SandpackProps = {
  children: React.ReactNode;
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
  const {children, autorun = true} = props;
  const codeSnippets = Children.toArray(children) as React.ReactElement[];
  const files = createFileMap(codeSnippets);

  if ('/index.html' in files) {
    throw new Error(
      'You cannot use `index.html` file in sandboxes. ' +
        'Only `public/index.html` is respected by Sandpack and CodeSandbox (where forks are created).'
    );
  }

  files['/src/styles.css'] = {
    code: [sandboxStyle, files['/src/styles.css']?.code ?? ''].join('\n\n'),
    hidden: !files['/src/styles.css']?.visible,
  };

  return (
    <div className="sandpack sandpack--playground w-full my-8" dir="ltr">
      <SandpackProvider
        template={viteRscTemplate}
        files={files}
        theme={CustomTheme}
        options={{
          autorun,
          initMode: 'user-visible',
          initModeObserverOptions: {rootMargin: '1400px 0px'},
        }}>
        <CustomPreset providedFiles={Object.keys(files)} />
      </SandpackProvider>
    </div>
  );
}

export default SandpackRSCRoot;
