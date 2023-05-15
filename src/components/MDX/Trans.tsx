import * as React from 'react';

interface TransProps {
  outdent?: boolean;
  children: React.ReactNode;
}

function Trans({outdent = false, children}: TransProps) {
  return (
    <span className={`translate${outdent ? ' outdent' : ''}`}>{children}</span>
  );
}

export function TransBlock({children}: TransProps) {
  return <div className="translate-block">{children}</div>;
}

export default Trans;
