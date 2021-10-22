/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {IconClipboard} from '../Icon/IconClipboard';

function CopyButton({message}: {message: string}) {
  return (
    <button
      className="hover:opacity-70"
      onClick={() => {
        window.navigator.clipboard.writeText(message);
      }}>
      <IconClipboard />
    </button>
  );
}

export default CopyButton;
