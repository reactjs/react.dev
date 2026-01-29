/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import Link from 'next/link';

export interface CareerCardProps {
  title?: string;
  badge?: boolean;
  location?: string;
  url?: string;
  children?: React.ReactNode;
}

function CareerCard({title, badge, location, url, children}: CareerCardProps) {
  return (
    <Link
      href={url as string}
      passHref
      className="block h-full w-full rounded-2xl outline-none focus:outline-none focus-visible:outline focus-visible:outline-link focus:outline-offset-2 focus-visible:dark:focus:outline-link-dark">
      <div className="justify-between p-5 sm:p-5 cursor-pointer w-full h-full flex flex-col flex-1 shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark hover:bg-gray-40/5 active:bg-gray-40/10  hover:dark:bg-gray-60/5 active:dark:bg-gray-60/10 rounded-2xl text-xl text-primary dark:text-primary-dark leading-relaxed">
        <div className="flex flex-row gap-3 w-full">
          <h2 className="font-semibold flex-1 text-2xl lg:text-3xl hover:underline leading-snug mb-4">
            {title}
          </h2>
        </div>
        <div>
          <div className="flex flex-row justify-start gap-2 items-center text-base text-tertiary dark:text-tertiary-dark">
            {location}
            {badge ? (
              <div className="h-fit px-1 bg-highlight dark:bg-highlight-dark rounded uppercase text-link dark:text-link-dark font-bold tracking-wide text-xs whitespace-nowrap">
                New
              </div>
            ) : null}
          </div>
          <span className="text-base text-secondary dark:text-secondary-dark">
            {children}
          </span>
          {children != null && (
            <div className="text-link text-base dark:text-link-dark hover:underline mt-4">
              Read more
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default CareerCard;
