/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useEffect, useState} from 'react';
import {useSandpack} from '@codesandbox/sandpack-react/unstyled';
import {IconCopy} from '../../Icon/IconCopy';

type CopyStatus = 'idle' | 'copied' | 'error';

export function CopyButton() {
  const {sandpack} = useSandpack();
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');

  useEffect(() => {
    if (copyStatus === 'idle') {
      return;
    }

    const timeout = setTimeout(() => setCopyStatus('idle'), 2000);
    return () => clearTimeout(timeout);
  }, [copyStatus]);

  async function handleCopy() {
    const code = sandpack.files[sandpack.activeFile]?.code;
    if (typeof code !== 'string') {
      console.error('Unable to copy the active sandbox file: no code found.');
      setCopyStatus('error');
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopyStatus('copied');
    } catch (error) {
      console.error('Failed to copy the active sandbox file.', error);
      setCopyStatus('error');
    }
  }

  const statusText =
    copyStatus === 'copied'
      ? 'Copied!'
      : copyStatus === 'error'
      ? 'Copy failed'
      : 'Copy';
  const accessibleLabel =
    copyStatus === 'copied'
      ? 'Code copied'
      : copyStatus === 'error'
      ? 'Copy failed'
      : 'Copy active file';

  return (
    <button
      aria-label={accessibleLabel}
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
      onClick={handleCopy}
      title={accessibleLabel}
      type="button">
      <IconCopy className="inline mx-1 relative" />
      <span className="hidden md:block" aria-live="polite">
        {statusText}
      </span>
    </button>
  );
}
