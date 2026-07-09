/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import cx from 'classnames';
import {useTocHighlight} from './useTocHighlight';
import type {Toc} from '../MDX/TocContext';

let animationFrameId: number;

const smoothScrollTo = (targetId: string) => {
  const element = document.getElementById(targetId);
  if (!element) return;

  (window as any).__isAutoScrolling = true;

  const headerOffset = 84;
  const startPosition = window.scrollY;
  const elementPosition = element.getBoundingClientRect().top;
  const targetPosition = startPosition + elementPosition - headerOffset;
  const distance = targetPosition - startPosition;
  const duration = 300;
  let startTime: number | null = null;

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startPosition + distance * easedProgress);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animation);
    } else {
      (window as any).__isAutoScrolling = false;
    }
  };

  cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(animation);
};

const getAnchorIdFromUrl = (url: string) => {
  return url.startsWith('#') ? url.substring(1) : url;
};

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
              const anchorId = getAnchorIdFromUrl(h.url);
              return (
                <li
                  key={`heading-${h.url}-${i}`}
                  className={cx(
                    'text-sm px-2 rounded-s-xl transition-colors duration-200 ease-in-out',
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
                      'block hover:text-link dark:hover:text-link-dark leading-normal py-2 transition-colors duration-200 ease-in-out'
                    )}
                    href={h.url}
                    onClick={(e) => {
                      e.preventDefault();
                      smoothScrollTo(anchorId);
                      window.history.pushState(null, '', `#${anchorId}`);
                    }}>
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
