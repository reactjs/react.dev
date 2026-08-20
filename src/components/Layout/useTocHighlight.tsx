/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useState, useRef, useEffect} from 'react';
import type {Toc} from '../MDX/TocContext';

const TOP_OFFSET = 85;

// Resolves each TOC entry to its heading element. The first entry
// ("Overview", href "#") is the top of the page and has no element.
function getTocTargets(headings: Toc): Array<HTMLElement | null> {
  return headings.map((heading) =>
    heading.url.length > 1
      ? document.getElementById(heading.url.slice(1))
      : null
  );
}

/**
 * Sets up Table of Contents highlighting.
 */
export function useTocHighlight(headings: Toc) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function updateActiveLink() {
      const pageHeight = document.body.scrollHeight;
      const scrollPosition = window.scrollY + window.innerHeight;
      const targets = getTocTargets(headings);

      if (scrollPosition >= 0 && pageHeight - scrollPosition <= 0) {
        // Scrolled to bottom of page.
        setCurrentIndex(targets.length - 1);
        return;
      }

      // The last heading that has scrolled past the top of the viewport.
      let index = 0;
      for (let i = 1; i < targets.length; i++) {
        const target = targets[i];
        if (target == null) {
          continue;
        }
        if (target.getBoundingClientRect().top >= TOP_OFFSET) {
          break;
        }
        index = i;
      }

      setCurrentIndex(index);
    }

    function throttledUpdateActiveLink() {
      if (timeoutRef.current === null) {
        timeoutRef.current = window.setTimeout(() => {
          timeoutRef.current = null;
          updateActiveLink();
        }, 100);
      }
    }

    document.addEventListener('scroll', throttledUpdateActiveLink);
    document.addEventListener('resize', throttledUpdateActiveLink);

    updateActiveLink();

    return () => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      document.removeEventListener('scroll', throttledUpdateActiveLink);
      document.removeEventListener('resize', throttledUpdateActiveLink);
    };
  }, [headings]);

  return {
    currentIndex,
  };
}
