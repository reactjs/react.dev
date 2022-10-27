/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Children} from 'react';
import * as React from 'react';
import CodeBlock from './CodeBlock';

interface CodeDiagramProps {
  children: React.ReactNode;
  flip?: boolean;
}

export function CodeDiagram({children, flip = false}: CodeDiagramProps) {
  const illustration = Children.toArray(children).filter((child: any) => {
    return child.type === 'img';
  });
  const content = Children.toArray(children).map((child: any) => {
    if (child.type?.mdxName === 'pre') {
      return <CodeBlock {...child.props} noMargin={true} noMarkers={true} />;
    } else if (child.type === 'img') {
      return null;
    } else {
      return child;
    }
  });
  if (flip) {
    return (
      <section className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
        {illustration}
        <div className="flex flex-col justify-center">{content}</div>
      </section>
    );
  }
  return (
    <section className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
      <div className="flex flex-col justify-center">{content}</div>
      <div className="py-4">{illustration}</div>
    </section>
  );
}
