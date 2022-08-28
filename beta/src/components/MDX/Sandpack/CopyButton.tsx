/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {IconCopy} from 'components/Icon/IconCopy';
import cn from 'classnames';

export const CopyButton = ({text}: {text?: string}) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    window.navigator.clipboard.writeText(text ?? '');
    setCopied(true);
  };

  React.useEffect(() => {
    if (!copied) {
      return;
    } else {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
      title="Copy"
      onClick={copyToClipboard}
      type="button">
      <IconCopy
        className={cn(
          'inline-flex mr-2 self-center',
          copied && 'text-slate-500'
        )}
      />
      <span className="hidden md:block">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
};
