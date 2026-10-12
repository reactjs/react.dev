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
import {IconChevron} from './Icon/IconChevron';
import {Menu} from '@headlessui/react';
import {IconNewPage} from './Icon/IconNewPage';

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

  const cleanPath = asPath.split(/[?#]/)[0];
  const mdPath = cleanPath + '.md';
  const fullMdUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${mdPath}`
      : mdPath;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function fetchPageBlob() {
    const res = await fetch(mdPath);
    if (!res.ok) throw new Error('Failed to fetch');
    const text = await res.text();
    return new Blob([text], {type: 'text/plain'});
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.write([
        // Don't wait for the blob, or Safari will refuse clipboard access
        new ClipboardItem({'text/plain': fetchPageBlob()}),
      ]);
      setCopied(true);
    } catch {
      // Silently fail
    }
  }

  return (
    <div className="relative inline-flex items-center rounded-full text-primary dark:text-primary-dark shadow-secondary-button-stroke dark:shadow-secondary-button-stroke-dark">
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onClick={handleCopy}
        disabled={copied}
        className="text-sm font-bold leading-tight py-1 p-3 inline-flex items-center rounded-s-full outline-none hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/2 active:dark:bg-gray-60/10 disabled:opacity-50 disabled:cursor-not-allowed">
        <IconCopy className="w-3.5 h-3.5 me-1.5" />
        {copied ? (
          'Copied!'
        ) : (
          <>
            <span className="hidden sm:inline">Copy page</span>
            <span className="sm:hidden">Copy</span>
          </>
        )}
      </button>

      <span
        className="w-px h-4 bg-gray-40/30 dark:bg-gray-60/30"
        aria-hidden="true"
      />

      {/* @ts-ignore */}
      <Menu>
        {/* @ts-ignore */}
        <Menu.Button as={React.Fragment}>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="py-1 ps-2 pe-3 inline-flex items-center rounded-e-full outline-none hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/2 active:dark:bg-gray-60/10">
            <IconChevron displayDirection="down" className="w-3.5 h-3.5" />
          </button>
        </Menu.Button>

        {/* @ts-ignore */}
        <Menu.Items
          transition
          className="absolute end-0 top-full mt-2 p-1 w-48 rounded-lg bg-white dark:bg-wash-dark border border-border dark:border-border-dark shadow-sm z-50 focus:outline-none">
          {/* @ts-ignore */}
          <Menu.Item>
            <a
              href={mdPath}
              target="_blank"
              rel="noreferrer"
              className="w-full font-bold text-start px-4 py-0.5 text-sm rounded-md inline-flex items-center justify-between hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/2 active:dark:bg-gray-60/10">
              View markdown
              <IconNewPage className="w-3 h-3" />
            </a>
          </Menu.Item>
          {/* @ts-ignore */}
          <Menu.Item>
            <a
              href={`https://chatgpt.com/?q=${encodeURIComponent(
                `Read from this URL: ${fullMdUrl} and explain it to me.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full font-bold text-start px-4 py-0.5 text-sm rounded-md inline-flex items-center justify-between hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/2 active:dark:bg-gray-60/10">
              Open in ChatGPT
              <IconNewPage className="w-3 h-3" />
            </a>
          </Menu.Item>
          {/* @ts-ignore */}
          <Menu.Item>
            <a
              href={`https://claude.ai/new?q=${encodeURIComponent(
                `Read from this URL: ${fullMdUrl} and explain it to me.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full font-bold text-start px-4 py-0.5 text-sm rounded-md inline-flex items-center justify-between hover:bg-gray-40/5 active:bg-gray-40/10 hover:dark:bg-gray-60/2 active:dark:bg-gray-60/10">
              Open in Claude
              <IconNewPage className="w-3 h-3" />
            </a>
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </div>
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
