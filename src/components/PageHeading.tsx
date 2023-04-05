/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import Breadcrumbs from 'components/Breadcrumbs';
import Tag from 'components/Tag';
import {H1} from './MDX/Heading';
import type {RouteTag, RouteItem} from './Layout/getRouteMeta';
import Trans from './MDX/Trans';
import Link from './MDX/Link';

interface PageHeadingProps {
  title: string;
  status?: string;
  description?: string;
  tags?: RouteTag[];
  breadcrumbs: RouteItem[];
  translatedTitle?: string;
  translators?: string[];
}

function PageHeading({
  title,
  translatedTitle,
  translators,
  status,
  description,
  tags = [],
  breadcrumbs,
}: PageHeadingProps) {
  return (
    <div className="px-5 sm:px-12 pt-3.5">
      <div className="max-w-4xl ml-0 2xl:mx-auto">
        {breadcrumbs ? <Breadcrumbs breadcrumbs={breadcrumbs} /> : null}
        <H1 className="mt-0 text-primary dark:text-primary-dark -mx-.5 break-words">
          {title}
          {translatedTitle && <Trans>{translatedTitle}</Trans>}
          {status ? <em>—{status}</em> : ''}
        </H1>
        {translators?.length && (
          <div className="text-right mt-4 mb-6 text-secondary dark:text-secondary-dark">
            <span>번역:</span>
            {translators.map((t) => (
              <Link
                className="ml-2"
                key={t}
                href={`/community/translators#${t}`}>
                {t}
              </Link>
            ))}
          </div>
        )}
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
