/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import cx from 'classnames';
import {useTocHighlight} from './useTocHighlight';
import type {Toc} from '../MDX/TocContext';

export function Toc({headings}: {headings: Toc}) {
  const {currentIndex} = useTocHighlight();
  // TODO: We currently have a mismatch between the headings in the document
  // and the headings we find in MarkdownPage (i.e. we don't find Recap or Challenges).
  // Select the max TOC item we have here for now, but remove this after the fix.
  const selectedIndex = Math.min(currentIndex, headings.length - 1);
  return (
    <nav role="navigation" className="pt-20 sticky top-0 end-0">
      {headings.length > 0 && (
        <h2 className="mb-3 lg:mb-3 uppercase tracking-wide font-bold text-sm text-secondary dark:text-secondary-dark px-4 w-full">
          On this page
        </h2>
      )}
      <div
        className="h-full overflow-y-auto ps-4 max-h-[calc(100vh-7.5rem)]"
        style={{
          overscrollBehavior: 'contain',
        }}>
        <ul className="space-y-2 pb-16">
          {headings.length > 0 &&
            headings.map((h, i) => {
              if (!h.url && process.env.NODE_ENV === 'development') {
                console.error('Heading does not have URL');
              }
              return (
                <li
                  key={`heading-${h.url}-${i}`}
                  className={cx(
                    'text-sm px-2 rounded-s-xl',
                    selectedIndex === i
                      ? 'bg-highlight dark:bg-highlight-dark'
                      : null,
                    {
                      'ps-4': h?.depth === 3,
                      hidden: h.depth && h.depth > 3,
                    }
                  )}>
                  <a
                    className={cx(
                      selectedIndex === i
                        ? 'text-link dark:text-link-dark font-bold'
                        : 'text-secondary dark:text-secondary-dark',
                      'block hover:text-link dark:hover:text-link-dark leading-normal py-2'
                    )}
                    href={h.url}>
                    {h.text}
                  </a>
                </li>
              );
            })}
        </ul>
      </div>
    </nav>
  );
}
