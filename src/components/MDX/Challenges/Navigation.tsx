/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRef, useCallback, useEffect, createRef} from 'react';
import cn from 'classnames';
import {IconChevron} from 'components/Icon/IconChevron';
import {ChallengeContents} from './Challenges';
import {debounce} from 'debounce';

export function Navigation({
  challenges,
  handleChange,
  currentChallenge,
  isRecipes,
}: {
  challenges: ChallengeContents[];
  handleChange: (index: number) => void;
  currentChallenge: ChallengeContents;
  isRecipes?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const challengesNavRef = useRef(
    challenges.map(() => createRef<HTMLButtonElement>())
  );
  const scrollPos = currentChallenge.order - 1;
  const canScrollLeft = scrollPos > 0;
  const canScrollRight = scrollPos < challenges.length - 1;

  const handleScrollRight = () => {
    if (scrollPos < challenges.length - 1) {
      const currentNavRef = challengesNavRef.current[scrollPos + 1].current;
      if (!currentNavRef) {
        return;
      }
      if (containerRef.current) {
        containerRef.current.scrollLeft = currentNavRef.offsetLeft;
      }
      handleChange(scrollPos + 1);
    }
  };

  const handleScrollLeft = () => {
    if (scrollPos > 0) {
      const currentNavRef = challengesNavRef.current[scrollPos - 1].current;
      if (!currentNavRef) {
        return;
      }
      if (containerRef.current) {
        containerRef.current.scrollLeft = currentNavRef.offsetLeft;
      }
      handleChange(scrollPos - 1);
    }
  };

  const handleSelectNav = (index: number) => {
    const currentNavRef = challengesNavRef.current[index].current;
    if (containerRef.current) {
      containerRef.current.scrollLeft = currentNavRef?.offsetLeft || 0;
    }
    handleChange(index);
  };

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      el.scrollLeft =
        challengesNavRef.current[scrollPos].current?.offsetLeft || 0;
    }
  }, [containerRef, challengesNavRef, scrollPos]);

  useEffect(() => {
    handleResize();
    const debouncedHandleResize = debounce(handleResize, 200);
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [handleResize]);

  return (
    <div className="flex items-center justify-between">
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="content-box relative flex overflow-x-auto transition-transform">
          {challenges.map(({name, id, order}, index) => (
            <button
              className={cn(
                'mr-4 text-ellipsis whitespace-nowrap border-b-4 py-2 text-base transition duration-100 ease-in',
                isRecipes &&
                  currentChallenge.id === id &&
                  'border-purple-50 text-purple-50 hover:text-purple-50 dark:border-purple-30 dark:text-purple-30 dark:hover:text-purple-30',
                !isRecipes &&
                  currentChallenge.id === id &&
                  'border-link text-link hover:text-link dark:border-link-dark dark:text-link-dark dark:hover:text-link-dark'
              )}
              onClick={() => handleSelectNav(index)}
              key={`button-${id}`}
              ref={challengesNavRef.current[index]}>
              {order}. {name}
            </button>
          ))}
        </div>
      </div>
      <div className="z-10 flex pb-2 pl-2">
        <button
          onClick={handleScrollLeft}
          aria-label="Scroll left"
          className={cn(
            'h-8 rounded-l border-r border-gray-20 bg-secondary-button px-2 dark:bg-secondary-button-dark',
            {
              'text-primary dark:text-primary-dark': canScrollLeft,
              'text-gray-30': !canScrollLeft,
            }
          )}>
          <IconChevron displayDirection="left" />
        </button>
        <button
          onClick={handleScrollRight}
          aria-label="Scroll right"
          className={cn(
            'h-8 rounded-r bg-secondary-button px-2 dark:bg-secondary-button-dark',
            {
              'text-primary dark:text-primary-dark': canScrollRight,
              'text-gray-30': !canScrollRight,
            }
          )}>
          <IconChevron displayDirection="right" />
        </button>
      </div>
    </div>
  );
}
