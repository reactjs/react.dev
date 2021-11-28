import * as React from 'react';

export function Heart({fill}: {fill: Boolean}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="32"
      height="32"
      stroke="currentColor"
      strokeWidth="2"
      fill={fill ? 'currentColor' : 'none'}
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  );
}

Heart.displayName = 'Heart';
