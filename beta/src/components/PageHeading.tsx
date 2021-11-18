/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import Tag from 'components/Tag';
import {RouteTag} from './Layout/useRouteMeta';
import {H1} from './MDX/Heading';

interface PageHeadingProps {
  title: string;
  status?: string;
  description?: string;
  tags?: RouteTag[];
}

function PageHeading({
  title,
  status,
  description,
  tags = [],
}: PageHeadingProps) {
  return (
    <div className="px-5 sm:px-12 pt-5">
      <div className="max-w-4xl ml-0 2xl:mx-auto">
        {tags ? <Breadcrumbs /> : null}
        <H1 className="mt-0 text-primary dark:text-primary-dark -mx-.5 break-words">
          {title}
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
