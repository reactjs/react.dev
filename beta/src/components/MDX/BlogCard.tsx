/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import Link from 'next/link';

export interface BlogCardProps {
  title?: string;
  badge?: boolean;
  icon?: string;
  date?: string;
  url?: string;
  children?: React.ReactNode;
}

function BlogCard({title, badge, date, icon, url, children}: BlogCardProps) {
  return (
    <Link href={url as string}>
      <a className="block h-full w-full rounded-2xl outline-none focus:outline-none focus-visible:outline focus-visible:outline-link focus:outline-offset-2 focus-visible:dark:focus:outline-link-dark">
        <div className="justify-between p-5 sm:p-5 cursor-pointer w-full h-full flex flex-col flex-1 shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark hover:bg-gray-40/5 active:bg-gray-40/10  hover:dark:bg-gray-60/5 active:dark:bg-gray-60/10 rounded-2xl text-xl text-primary dark:text-primary-dark leading-relaxed">
          <div className="flex flex-row gap-3 w-full">
            <h2 className="font-semibold flex-1 text-2xl lg:text-3xl hover:underline leading-snug mb-4">
              {title}
            </h2>
          </div>
          <div>
            <div className="flex flex-row justify-start gap-2 items-center text-base text-tertiary dark:text-tertiary-dark">
              {icon === 'labs' && (
                <svg
                  className="w-6 h-6 text-tertiary dark:text-tertiary-dark"
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
                  className="w-6 h-6 text-tertiary dark:text-tertiary-dark"
                  viewBox="0 0 72 72"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.7101 56.3758C13.0724 56.7251 13.6324 57 14.3887 57H57.6113C58.3676 57 58.9276 56.7251 59.2899 56.3758C59.6438 56.0346 59.8987 55.5407 59.9086 54.864C59.9354 53.022 59.9591 50.7633 59.9756 48H12.0244C12.0409 50.7633 12.0645 53.022 12.0914 54.864C12.1013 55.5407 12.3562 56.0346 12.7101 56.3758ZM12.0024 42H59.9976C59.9992 41.0437 60 40.0444 60 39C60 29.5762 59.9327 22.5857 59.8589 17.7547C59.8359 16.2516 58.6168 15 56.9938 15L15.0062 15C13.3832 15 12.1641 16.2516 12.1411 17.7547C12.0673 22.5857 12 29.5762 12 39C12 40.0444 12.0008 41.0437 12.0024 42ZM65.8582 17.6631C65.7843 12.8227 61.8348 9 56.9938 9H15.0062C10.1652 9 6.21572 12.8227 6.1418 17.6631C6.06753 22.5266 6 29.5477 6 39C6 46.2639 6.03988 51.3741 6.09205 54.9515C6.15893 59.537 9.80278 63 14.3887 63H57.6113C62.1972 63 65.8411 59.537 65.9079 54.9515C65.9601 51.3741 66 46.2639 66 39C66 29.5477 65.9325 22.5266 65.8582 17.6631ZM39 21C37.3431 21 36 22.3431 36 24C36 25.6569 37.3431 27 39 27H51C52.6569 27 54 25.6569 54 24C54 22.3431 52.6569 21 51 21H39ZM36 33C36 31.3431 37.3431 30 39 30H51C52.6569 30 54 31.3431 54 33C54 34.6569 52.6569 36 51 36H39C37.3431 36 36 34.6569 36 33ZM24 33C27.3137 33 30 30.3137 30 27C30 23.6863 27.3137 21 24 21C20.6863 21 18 23.6863 18 27C18 30.3137 20.6863 33 24 33Z"
                    fill="currentColor"
                  />
                </svg>
              )}
              {date}
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
      </a>
    </Link>
  );
}

export default BlogCard;
