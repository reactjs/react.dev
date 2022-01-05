/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React from 'react';
import {siteConfig} from 'siteConfig';

const TOP_OFFSET = 75;

export function getHeaderAnchors(): HTMLAnchorElement[] {
  return Array.prototype.filter.call(
    document.getElementsByClassName(siteConfig.headerIdConfig.className),
    function (testElement) {
      return (
        testElement.parentNode.nodeName === 'H1' ||
        testElement.parentNode.nodeName === 'H2' ||
        testElement.parentNode.nodeName === 'H3'
      );
    }
  );
}

/**
 * Sets up Table of Contents highlighting.
 */
export function useTocHighlight() {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    function updateActiveLink() {
      const pageHeight = document.body.scrollHeight;
      const scrollPosition = window.scrollY + window.innerHeight;
      const headersAnchors = getHeaderAnchors();

      if (scrollPosition >= 0 && pageHeight - scrollPosition <= TOP_OFFSET) {
        // Scrolled to bottom of page.
        setCurrentIndex(headersAnchors.length - 1);
        return;
      }

      let index = -1;
      while (index < headersAnchors.length - 1) {
        const headerAnchor = headersAnchors[index + 1];
        const {top} = headerAnchor.getBoundingClientRect();

        if (top >= TOP_OFFSET) {
          break;
        }
        index += 1;
      }

      setCurrentIndex(Math.max(index, 0));
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
  }, []);

  return {
    currentIndex,
  };
}
