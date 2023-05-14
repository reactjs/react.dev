import * as React from 'react';

interface TransProps {
  dedent?: boolean;
  children: React.ReactNode;
}

function Trans({dedent = false, children}: TransProps) {
  return (
    <span className={`translate${dedent ? ' dedent' : ''}`}>{children}</span>
  );
}

export function TransBlock({children}: TransProps) {
  return <div className="translate-block">{children}</div>;
}

export default Trans;
