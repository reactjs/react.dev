/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import Link from 'next/link';

export interface BlogCardProps {
  title?: string;
  date?: string;
  url?: string;
  children?: React.ReactNode;
}

function BlogCard({title, date, url, children}: BlogCardProps) {
  return (
    <Link href={url as string}>
      <div className="p-5 sm:p-5 cursor-pointer w-full h-full flex flex-col flex-1 border-border border dark:border-border-dark hover:bg-card group hover:dark:bg-card-dark rounded-2xl text-xl text-primary dark:text-primary-dark leading-relaxed">
        <h2 className="font-bold text-2xl lg:text-3xl group-hover:underline leading-snug lg:mb-4">
          {title}
        </h2>
        <span className="text-base text-tertiary dark:text-tertiary-dark">
          {date}
        </span>
        <span className="text-lg text-secondary dark:text-secondary-dark">
          {children}
        </span>
      </div>
    </Link>
  );
}

export default BlogCard;
