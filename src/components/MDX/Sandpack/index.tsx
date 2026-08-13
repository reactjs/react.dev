/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Children} from 'react';
import {createFileMap} from './createFileMap';
import {SandpackClientIsland, SandpackRSCIsland} from './SandpackClient';

export function SandpackClient(props: any) {
  const files = createFileMap(Children.toArray(props.children));
  return <SandpackClientIsland {...props} files={files} />;
}

export function SandpackRSC(props: any) {
  const files = createFileMap(Children.toArray(props.children));
  return <SandpackRSCIsland {...props} files={files} />;
}
