/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import Breadcrumbs from 'components/Breadcrumbs';
import Tag from 'components/Tag';
import {H1} from './MDX/Heading';
import type {RouteTag, RouteItem} from './Layout/getRouteMeta';
import * as React from 'react';
import {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import {IconCanary} from './Icon/IconCanary';
import {IconExperimental} from './Icon/IconExperimental';
import {IconCopy} from './Icon/IconCopy';
import {Button} from './Button';

interface PageHeadingProps {
  title: string;
  version?: 'experimental' | 'canary' | 'rc';
  experimental?: boolean;
  status?: string;
  description?: string;
  tags?: RouteTag[];
  breadcrumbs: RouteItem[];
}

function CopyAsMarkdownButton() {
  const {asPath} = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleCopy() {
    const cleanPath = asPath.split(/[?#]/)[0];
    try {
      const res = await fetch(cleanPath + '.md');
      if (!res.ok) return;
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Silently fail
    }
  }

  return (
    <Button onClick={handleCopy} className="text-sm py-1 px-3">
      <IconCopy className="w-3.5 h-3.5 me-1.5" />
      {copied ? (
        'Copied!'
      ) : (
        <>
          <span className="hidden sm:inline">Copy page</span>
          <span className="sm:hidden">Copy</span>
        </>
      )}
    </Button>
  );
}

function PageHeading({
  title,
  status,
  version,
  tags = [],
  breadcrumbs,
}: PageHeadingProps) {
  return (
    <div className="px-5 sm:px-12 pt-3.5">
      <div className="max-w-4xl ms-0 2xl:mx-auto">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {breadcrumbs ? <Breadcrumbs breadcrumbs={breadcrumbs} /> : null}
          </div>
          <CopyAsMarkdownButton />
        </div>
        <H1 className="mt-0 text-primary dark:text-primary-dark -mx-.5 break-words">
          {title}
          {version === 'canary' && (
            <IconCanary
              title=" - This feature is available in the latest Canary version of React"
              className="ms-4 mt-1 text-gray-50 dark:text-gray-40 inline-block w-6 h-6 align-[-1px]"
            />
          )}
          {version === 'rc' && (
            <IconCanary
              title=" - This feature is available in the latest RC version"
              className="ms-4 mt-1 text-gray-50 dark:text-gray-40 inline-block w-6 h-6 align-[-1px]"
            />
          )}
          {version === 'experimental' && (
            <IconExperimental
              title=" - This feature is available in the latest Experimental version of React"
              className="ms-4 mt-1 text-gray-50 dark:text-gray-40 inline-block w-6 h-6 align-[-1px]"
            />
          )}
          {status ? <em>—{status}</em> : ''}
        </H1>
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
