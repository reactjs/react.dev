/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import {useEffect, useState} from 'react';
import {Button} from './Button';
import {IconCopy} from './Icon/IconCopy';

export function CopyAsMarkdownButton({pathname}: {pathname: string}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function fetchPageBlob() {
    const cleanPath = pathname.split(/[?#]/)[0];
    const res = await fetch(cleanPath + '.md');
    if (!res.ok) throw new Error('Failed to fetch');
    const text = await res.text();
    return new Blob([text], {type: 'text/plain'});
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.write([
        // Don't wait for the blob, or Safari will refuse clipboard access.
        new ClipboardItem({'text/plain': fetchPageBlob()}),
      ]);
      setCopied(true);
    } catch {
      // Silently fail.
    }
  }

  return (
    <Button onClick={handleCopy} className="text-sm py-1 px-3">
      <IconCopy className="w-3.5 h-3.5 me-1.5" />
      {copied ? (
        'Copied!'
      ) : (
        <>
          <span className="hidden sm:inline">Copy page</span>
          <span className="sm:hidden">Copy</span>
        </>
      )}
    </Button>
  );
}
