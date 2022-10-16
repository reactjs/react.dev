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

export function ErrorMessage({error}: {error: ErrorType}) {
  const {message, title} = error;

  return (
    <div className="p-6 bg-white rounded-t-none sm:rounded-lg ">
      <h2 className="text-red-40 text-xl mb-4">{title || 'Error'}</h2>
      <pre className="text-secondary whitespace-pre-wrap break-words leading-tight">
        {message}
      </pre>
    </div>
  );
}
