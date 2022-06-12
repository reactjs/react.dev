/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {useRouteMeta} from 'components/Layout/useRouteMeta';
import Link from 'next/link';
import {IconChevron} from './Icon/IconChevron';

function Breadcrumbs() {
  const {breadcrumbs} = useRouteMeta();
  if (!breadcrumbs) return null;
  return (
    <div className="flex">
      {breadcrumbs.map(
        (crumb, i) =>
          crumb.path && (
            <div className="flex mb-3 mt-0.5 items-center" key={i}>
              <React.Fragment key={crumb.path}>
                <Link href={crumb.path}>
                  <a className="text-link dark:text-link-dark text-sm tracking-wide font-bold uppercase mr-1 hover:underline">
                    {crumb.title}
                  </a>
                </Link>
                <span className="inline-block mr-1 text-link dark:text-link-dark text-lg">
                  <IconChevron displayDirection="right" />
                </span>
              </React.Fragment>
            </div>
          )
      )}
    </div>
  );
}

export default Breadcrumbs;
