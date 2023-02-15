/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import Link from 'next/link';

export interface BlogCardProps {
  title?: string;
  icon?: string;
  date?: string;
  url?: string;
  children?: React.ReactNode;
}

function BlogCard({title, date, icon, url, children}: BlogCardProps) {
  return (
    <Link href={url as string}>
      <div className="p-5 sm:p-5 cursor-pointer w-full h-full flex flex-col flex-1 border-border border dark:border-border-dark hover:bg-card group hover:dark:bg-card-dark rounded-2xl text-xl text-primary dark:text-primary-dark leading-relaxed">
        {icon === 'labs' && (
          <svg
            className="w-8 h-8 mb-4 text-tertiary dark:text-tertiary-dark"
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M27.4865 9C25.8297 9 24.4865 10.3431 24.4865 12C24.4865 13.6569 25.8297 15 27.4865 15V31.1087C27.4865 32.3397 27.1078 33.5409 26.4019 34.5494L13.095 53.5592C10.3114 57.5359 13.1563 63 18.0104 63H54.9626C59.8167 63 62.6616 57.5359 59.878 53.5592L46.5711 34.5494C45.8652 33.5409 45.4865 32.3397 45.4865 31.1087V15C47.1434 15 48.4865 13.6569 48.4865 12C48.4865 10.3431 47.1434 9 45.4865 9H27.4865ZM39.4865 31.1087V15H33.4865V31.1087C33.4865 33.5707 32.7292 35.9732 31.3173 37.9902L28.5104 42H44.4626L41.6557 37.9902C40.2438 35.9732 39.4865 33.5707 39.4865 31.1087ZM18.0104 57L24.3104 48H48.6626L54.9626 57H18.0104Z"
              fill="currentColor"
            />
          </svg>
        )}
        {icon === 'blog' && (
          <svg
            className="w-8 h-8 mb-4 text-tertiary dark:text-tertiary-dark"
            viewBox="0 0 72 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_40_48064)">
              <path
                d="M24 27C24 25.3431 25.3431 24 27 24H45C46.6569 24 48 25.3431 48 27C48 28.6569 46.6569 30 45 30H27C25.3431 30 24 28.6569 24 27Z"
                fill="currentColor"
              />
              <path
                d="M24 39C24 37.3431 25.3431 36 27 36H39C40.6569 36 42 37.3431 42 39C42 40.6569 40.6569 42 39 42H27C25.3431 42 24 40.6569 24 39Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 18C12 13.0294 16.0294 9 21 9H51C55.9706 9 60 13.0294 60 18V54C60 58.9706 55.9706 63 51 63H21C16.0294 63 12 58.9706 12 54V18ZM21 15H51C52.6569 15 54 16.3431 54 18V54C54 55.6569 52.6569 57 51 57H21C19.3431 57 18 55.6569 18 54V18C18 16.3431 19.3431 15 21 15Z"
                fill="currentColor"
              />
            </g>
            <defs>
              <clipPath id="clip0_40_48064">
                <rect width="72" height="72" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )}
        <h2 className="font-bold text-2xl lg:text-3xl group-hover:underline leading-snug mb-4">
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
