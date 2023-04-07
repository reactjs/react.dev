import * as React from 'react';

interface TransProps {
  children: React.ReactNode;
}

function Trans({children}: TransProps) {
  return <span className="translate">{children}</span>;
}

export function TransBlock({children}: TransProps) {
  return <div className="translate-block">{children}</div>;
}

export default Trans;
