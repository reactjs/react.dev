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
      <div className="justify-between p-5 sm:p-5 cursor-pointer w-full h-full flex flex-col flex-1 border-border border dark:border-border-dark hover:bg-card group hover:dark:bg-card-dark rounded-2xl text-xl text-primary dark:text-primary-dark leading-relaxed">
        <div className="flex flex-col w-full">
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
              <g clipPath="url(#clip0_10_20055)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24 6C25.3766 6 26.5766 6.93689 26.9104 8.27239L27.291 9.79486C28.6346 15.1691 32.8309 19.3654 38.2051 20.709L39.7276 21.0896C41.0631 21.4234 42 22.6234 42 24C42 25.3766 41.0631 26.5766 39.7276 26.9104L38.2051 27.291C32.8309 28.6346 28.6346 32.8309 27.291 38.2051L26.9104 39.7276C26.5766 41.0631 25.3766 42 24 42C22.6234 42 21.4234 41.0631 21.0896 39.7276L20.709 38.2051C19.3654 32.8309 15.1691 28.6346 9.79485 27.291L8.27239 26.9104C6.93689 26.5766 6 25.3766 6 24C6 22.6234 6.93689 21.4234 8.27239 21.0896L9.79485 20.709C15.1691 19.3654 19.3654 15.1691 20.709 9.79486L21.0896 8.27239C21.4234 6.93689 22.6234 6 24 6ZM24 17.2312C22.2953 19.9771 19.9771 22.2953 17.2312 24C19.9771 25.7047 22.2953 28.0229 24 30.7688C25.7047 28.0229 28.0229 25.7047 30.7688 24C28.0229 22.2953 25.7047 19.9771 24 17.2312Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M56.522 56.5214C55.5352 52.9034 55.5355 49.0815 56.5229 45.4636C52.9045 46.451 49.0819 46.451 45.4634 45.4637C46.4508 49.0814 46.4511 52.9031 45.4644 56.521C49.0823 55.5341 52.9042 55.5343 56.522 56.5214ZM36.0109 38.7491C35.9591 39.3557 36.0908 39.9837 36.428 40.5457L38.0666 43.2767C40.9167 48.0269 40.9167 53.9613 38.0666 58.7116L36.4742 61.3654C36.3591 61.5453 36.2641 61.7363 36.1902 61.9345C36.0551 62.2943 35.9935 62.6692 36.0005 63.0398C36.006 63.3524 36.0604 63.6667 36.1667 63.9711C36.3892 64.6123 36.8294 65.182 37.457 65.5585C38.4719 66.1675 39.7023 66.1063 40.6331 65.5037L43.275 63.9185C48.0252 61.0684 53.9596 61.0684 58.7099 63.9185L61.3744 65.5173C62.3027 66.1072 63.5221 66.1629 64.5294 65.5585C65.9501 64.7061 66.4108 62.8633 65.5584 61.4426L63.9198 58.7116C61.0696 53.9613 61.0696 48.0269 63.9198 43.2767L65.5584 40.5457C65.9359 39.9165 66.0559 39.2045 65.9489 38.5324C65.9144 38.313 65.8549 38.0953 65.7696 37.8833C65.6514 37.5887 65.4862 37.3115 65.277 37.0642C64.3448 35.958 62.7217 35.6598 61.4414 36.428L58.7104 38.0666C53.9602 40.9167 48.0258 40.9167 43.2755 38.0666L40.5445 36.428C39.2072 35.6256 37.4959 35.9867 36.5887 37.2168C36.4883 37.3524 36.4003 37.4955 36.3249 37.6444C36.1452 37.9981 36.0423 38.3731 36.0109 38.7491Z"
                  fill="currentColor"
                />
              </g>
              <defs>
                <clipPath id="clip0_10_20055">
                  <rect width="72" height="72" fill="white" />
                </clipPath>
              </defs>
            </svg>
          )}
          <h2 className="font-bold text-2xl lg:text-3xl group-hover:underline leading-snug mb-4">
            {title}
          </h2>
        </div>
        <div>
          <div className="flex items-center flex-row justify-between text-base text-tertiary dark:text-tertiary-dark">
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
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
