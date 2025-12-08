/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import Image from 'next/image';

interface DiagramProps {
  name: string;
  alt: string;
  height: number;
  width: number;
  children: string;
  captionPosition: 'top' | 'bottom' | null;
}

function Caption({text}: {text: string}) {
  return (
    <div className="w-full flex justify-center">
      <figcaption className="p-1 sm:p-2 mt-0 sm:mt-0 text-gray-40 text-base lg:text-lg text-center leading-tight table-caption max-w-lg">
        {text}
      </figcaption>
    </div>
  );
}

export function Diagram({
  name,
  alt,
  height,
  width,
  children,
  captionPosition,
}: DiagramProps) {
  return (
    <figure className="flex flex-col px-0 p-0 sm:p-10 first:mt-0 mt-10 sm:mt-0 justify-center items-center">
      {captionPosition === 'top' && <Caption text={children} />}
      <div className="dark-image">
        <Image
          src={`/images/docs/diagrams/${name}.dark.png`}
          alt={alt}
          height={height}
          width={width}
        />
      </div>
      <div className="light-image">
        <Image
          src={`/images/docs/diagrams/${name}.png`}
          alt={alt}
          height={height}
          width={width}
        />
      </div>
      {(!captionPosition || captionPosition === 'bottom') && (
        <Caption text={children} />
      )}
    </figure>
  );
}

export default Diagram;
