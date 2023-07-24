/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import Breadcrumbs from 'components/Breadcrumbs';
import Tag from 'components/Tag';
import {H1} from './MDX/Heading';
import type {RouteTag, RouteItem} from './Layout/getRouteMeta';
import * as React from 'react';

interface PageHeadingProps {
  title: string;
  canary?: boolean;
  status?: string;
  description?: string;
  tags?: RouteTag[];
  breadcrumbs: RouteItem[];
}

function PageHeading({
  title,
  status,
  canary,
  description,
  tags = [],
  breadcrumbs,
}: PageHeadingProps) {
  return (
    <div className="px-5 sm:px-12 pt-3.5">
      <div className="max-w-4xl ml-0 2xl:mx-auto">
        {breadcrumbs ? <Breadcrumbs breadcrumbs={breadcrumbs} /> : null}
        <H1 className="mt-0 text-primary dark:text-primary-dark -mx-.5 break-words">
          <div className="flex items-center">
            {title}{' '}
            {canary && (
              <span
                title="This feature is available in the latest React Canary"
                className="ml-2 mt-1 border border-yellow-40 dark:border-yellow-50 rounded-full px-2 text-xl text-yellow-40 dark:text-yellow-50 pt-0 pb-1 align-top">
                Canary
              </span>
            )}
          </div>
          {status ? <em>—{status}</em> : ''}
        </H1>
        {description && (
          <p className="mt-4 mb-6 text-primary dark:text-primary-dark text-xl text-gray-90 leading-large">
            {description}
          </p>
        )}
        {tags?.length > 0 && (
          <div className="mt-4">
            {tags.map((tag) => (
              <Tag key={tag} variant={tag as RouteTag} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeading;
