/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRef, useEffect, createRef, useMemo} from 'react';
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
  const challengesNavRefs = useMemo(
    () => challenges.map(() => createRef<HTMLButtonElement>()),
    [challenges]
  );
  const scrollPos = currentChallenge.order - 1;
  const canScrollLeft = scrollPos > 0;
  const canScrollRight = scrollPos < challenges.length - 1;

  const handleScrollRight = () => {
    if (scrollPos < challenges.length - 1) {
      const currentNavRef = challengesNavRefs[scrollPos + 1].current;
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
      const currentNavRef = challengesNavRefs[scrollPos - 1].current;
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
    const currentNavRef = challengesNavRefs[index].current;
    if (containerRef.current) {
      containerRef.current.scrollLeft = currentNavRef?.offsetLeft || 0;
    }
    handleChange(index);
  };

  useEffect(() => {
    const scrollToCurrentChallenge = () => {
      if (containerRef.current) {
        const el = containerRef.current;
        el.scrollLeft = challengesNavRefs[scrollPos].current?.offsetLeft || 0;
      }
    };
    scrollToCurrentChallenge();
    const debouncedHandleResize = debounce(scrollToCurrentChallenge, 200);
    window.addEventListener('resize', debouncedHandleResize);
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    };
  }, [challengesNavRefs, scrollPos]);

  return (
    <div className="flex items-center justify-between">
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex relative transition-transform content-box overflow-x-auto">
          {challenges.map(({name, id, order}, index) => (
            <button
              className={cn(
                'py-2 me-4 text-base border-b-4 duration-100 ease-in transition whitespace-nowrap text-ellipsis',
                isRecipes &&
                  currentChallenge.id === id &&
                  'text-purple-50 border-purple-50 hover:text-purple-50 dark:text-purple-30 dark:border-purple-30 dark:hover:text-purple-30',
                !isRecipes &&
                  currentChallenge.id === id &&
                  'text-link border-link hover:text-link dark:text-link-dark dark:border-link-dark dark:hover:text-link-dark'
              )}
              onClick={() => handleSelectNav(index)}
              key={`button-${id}`}
              ref={challengesNavRefs[index]}>
              {order}. {name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex z-10 pb-2 ps-2">
        <button
          onClick={handleScrollLeft}
          aria-label="Scroll left"
          className={cn(
            'bg-secondary-button dark:bg-secondary-button-dark h-8 px-2 rounded-l rtl:rounded-r rtl:rounded-l-none border-gray-20 border-r rtl:border-l rtl:border-r-0',
            {
              'text-primary dark:text-primary-dark': canScrollLeft,
              'text-gray-30': !canScrollLeft,
            }
          )}>
          <IconChevron displayDirection="start" />
        </button>
        <button
          onClick={handleScrollRight}
          aria-label="Scroll right"
          className={cn(
            'bg-secondary-button dark:bg-secondary-button-dark h-8 px-2 rounded-e',
            {
              'text-primary dark:text-primary-dark': canScrollRight,
              'text-gray-30': !canScrollRight,
            }
          )}>
          <IconChevron displayDirection="end" />
        </button>
      </div>
    </div>
  );
}
