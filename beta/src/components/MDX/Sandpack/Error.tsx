/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';

interface ErrorType {
  title?: string;
  message: string;
  column?: number;
  line?: number;
  path?: string;
}

export function Error({error}: {error: ErrorType}) {
  const {message, title} = error;

  return (
    <div className={'bg-white border-2 border-red-40 rounded-lg p-6'}>
      <h2 className="text-red-40 text-xl mb-4">{title || 'Error'}</h2>
      <pre className="text-secondary whitespace-pre-wrap break-words">
        {message}
      </pre>
    </div>
  );
}

export function LintError({
  error: {line, column, message},
}: {
  error: {
    line: number;
    column: number;
    message: string;
  };
}) {
  console.log(message, 'err');
  return (
    <div
      className={
        'bg-white border-2 border-orange-40 border- border-red-40 rounded-lg p-6'
      }>
      <h2 className="text-red-40 text-xl mb-4">LintError</h2>
      <pre className="text-secondary whitespace-pre-wrap break-words">
        {line}:{column} - {message}
      </pre>
    </div>
  );
}
