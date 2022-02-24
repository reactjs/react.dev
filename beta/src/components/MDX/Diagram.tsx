/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import Image from 'next/image';

interface DiagramProps {
  name: string;
  alt: string;
  height: number;
  width: number;
  children: string;
}

export function Diagram({name, alt, height, width, children}: DiagramProps) {
  return (
    <figure className="flex flex-col px-0 py-5 sm:p-10">
      <div className="dark-image">
        <Image
          src={`/images/docs/diagrams/${name}.dark.svg`}
          alt={alt}
          height={height}
          width={width}
        />
      </div>
      <div className="light-image">
        <Image
          src={`/images/docs/diagrams/${name}.svg`}
          alt={alt}
          height={height}
          width={width}
        />
      </div>
      <figcaption className="p-1 sm:p-4 mt-4 sm:mt-0 text-gray-40 text-base lg:text-lg text-center leading-6">
        {children}
      </figcaption>
    </figure>
  );
}

export default Diagram;
