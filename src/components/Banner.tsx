/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useState, useRef, useEffect} from 'react';
import cn from 'classnames';
import {ExternalLink} from './ExternalLink';

export default function Banner({
  text,
  link,
  linkText,
}: {
  text: string;
  link: string;
  linkText: string;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function patchedScrollTo(x: number, y: number) {
      if (y === 0) {
        // We're trying to reset scroll.
        // If we already scrolled past the banner, consider it as y = 0.
        const bannerHeight = ref.current?.offsetHeight ?? 0; // Could be zero (e.g. mobile)
        y = Math.min(window.scrollY, bannerHeight);
      }
      return realScrollTo(x, y);
    }
    const realScrollTo = window.scrollTo;
    (window as any).scrollTo = patchedScrollTo;
    return () => {
      (window as any).scrollTo = realScrollTo;
    };
  }, []);
  if (!isVisible) return null;
  return (
    <div
      ref={ref}
      className={cn(
        `h-[40px] hidden lg:flex w-full bg-gray-100 dark:bg-gray-700 text-base md:text-lg py-2 sm:py-0 items-center flex-col sm:flex-row space-x-4`
      )}>
      <div className="hidden sm:block flex-grow text-center">
        {text}
        <ExternalLink
          className="ms-0 sm:ms-1 text-link dark:text-link-dark hover:underline"
          href={link}>
          {linkText}
        </ExternalLink>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-3xl text-gray-800 ml-auto">
        &times;
      </button>
    </div>
  );
}
