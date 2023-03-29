/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

interface ErrorType {
  title?: string;
  message: string;
  column?: number;
  line?: number;
  path?: string;
}

export function ErrorMessage({error, ...props}: {error: ErrorType}) {
  const {message, title} = error;

  return (
    <div className="rounded-lg border-2 border-red-40 bg-white p-6" {...props}>
      <h2 className="mb-4 text-xl text-red-40">{title || 'Error'}</h2>
      <pre className="whitespace-pre-wrap break-words leading-tight text-secondary">
        {message}
      </pre>
    </div>
  );
}
