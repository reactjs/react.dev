/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React, {createRef} from 'react';
import cn from 'classnames';
import {IconChevron} from 'components/Icon/IconChevron';
import {ChallengeContents} from './Challenges';
const debounce = require('debounce');

export function Navigation({
  challenges,
  handleChange,
  activeChallenge,
  isRecipes,
}: {
  challenges: ChallengeContents[];
  handleChange: (id: string) => void;
  activeChallenge: string;
  isRecipes?: boolean;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const challengesNavRef = React.useRef(
    challenges.map(() => createRef<HTMLButtonElement>())
  );
  const [scrollPos, setScrollPos] = React.useState(0);
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
      handleChange(challenges[scrollPos + 1].id);
      setScrollPos(scrollPos + 1);
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
      handleChange(challenges[scrollPos - 1].id);
      setScrollPos(scrollPos - 1);
    }
  };

  const handleSelectNav = (id: string) => {
    const selectedChallenge = challenges.findIndex(
      (challenge) => challenge.id === id
    );
    const currentNavRef = challengesNavRef.current[selectedChallenge].current;
    if (containerRef.current) {
      containerRef.current.scrollLeft = currentNavRef?.offsetLeft || 0;
    }
    handleChange(id);
    setScrollPos(selectedChallenge);
  };

  const handleResize = React.useCallback(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      el.scrollLeft =
        challengesNavRef.current[scrollPos].current?.offsetLeft || 0;
    }
  }, [containerRef, challengesNavRef, scrollPos]);

  React.useEffect(() => {
    handleResize();
    window.addEventListener('resize', debounce(handleResize, 200));
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <div className="flex items-center justify-between">
      <div className="overflow-hidden">
        <div
          ref={containerRef}
          className="flex relative transition-transform content-box overflow-x-auto">
          {challenges.map(({name, id, order}, index) => (
            <button
              className={cn(
                'py-2 mr-4 text-base border-b-4 duration-100 ease-in transition whitespace-nowrap overflow-ellipsis',
                isRecipes &&
                  activeChallenge === id &&
                  'text-purple-50 border-purple-50 hover:text-purple-50 dark:text-purple-30 dark:border-purple-30 dark:hover:text-purple-30',
                !isRecipes &&
                  activeChallenge === id &&
                  'text-link border-link hover:text-link dark:text-link-dark dark:border-link-dark dark:hover:text-link-dark'
              )}
              onClick={() => handleSelectNav(id)}
              key={`button-${id}`}
              ref={challengesNavRef.current[index]}>
              {order}. {name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex z-10 pb-2 pl-2">
        <button
          onClick={handleScrollLeft}
          className={cn(
            'bg-secondary-button dark:bg-secondary-button-dark h-8 px-2 rounded-l border-gray-20 border-r',
            {
              'text-primary dark:text-primary-dark': canScrollLeft,
              'text-gray-30': !canScrollLeft,
            }
          )}>
          <IconChevron displayDirection="left" />
        </button>
        <button
          onClick={handleScrollRight}
          className={cn(
            'bg-secondary-button dark:bg-secondary-button-dark h-8 px-2 rounded-r-lg',
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
