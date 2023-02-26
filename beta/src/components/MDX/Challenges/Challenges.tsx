/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Children, useRef, useEffect, useState} from 'react';
import * as React from 'react';
import cn from 'classnames';
import {H2} from 'components/MDX/Heading';
import {H4} from 'components/MDX/Heading';
import {Challenge} from './Challenge';
import {Navigation} from './Navigation';
import {useRouter} from 'next/router';

interface ChallengesProps {
  children: React.ReactElement[];
  isRecipes?: boolean;
  titleText?: string;
  titleId?: string;
}

export interface ChallengeContents {
  id: string;
  name: string;
  order: number;
  content: React.ReactNode;
  solution: React.ReactNode;
  hint?: React.ReactNode;
}

const parseChallengeContents = (
  children: React.ReactElement[]
): ChallengeContents[] => {
  const contents: ChallengeContents[] = [];

  if (!children) {
    return contents;
  }

  let challenge: Partial<ChallengeContents> = {};
  let content: React.ReactElement[] = [];
  Children.forEach(children, (child) => {
    const {props, type} = child;
    switch ((type as any).mdxName) {
      case 'Solution': {
        challenge.solution = child;
        challenge.content = content;
        contents.push(challenge as ChallengeContents);
        challenge = {};
        content = [];
        break;
      }
      case 'Hint': {
        challenge.hint = child;
        break;
      }
      case 'h4': {
        challenge.order = contents.length + 1;
        challenge.name = props.children;
        challenge.id = props.id;
        break;
      }
      default: {
        content.push(child);
      }
    }
  });

  return contents;
};

enum QueuedScroll {
  INIT = 'init',
  NEXT = 'next',
}

export function Challenges({
  children,
  isRecipes,
  titleText = isRecipes ? 'Try out some examples' : 'Try out some challenges',
  titleId = isRecipes ? 'examples' : 'challenges',
}: ChallengesProps) {
  const challenges = parseChallengeContents(children);
  const totalChallenges = challenges.length;
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const queuedScrollRef = useRef<undefined | QueuedScroll>(QueuedScroll.INIT);
  const [activeIndex, setActiveIndex] = useState(0);
  const currentChallenge = challenges[activeIndex];
  const {asPath} = useRouter();

  useEffect(() => {
    if (queuedScrollRef.current === QueuedScroll.INIT) {
      const initIndex = challenges.findIndex(
        (challenge) => challenge.id === asPath.split('#')[1]
      );
      if (initIndex === -1) {
        queuedScrollRef.current = undefined;
      } else if (initIndex !== activeIndex) {
        setActiveIndex(initIndex);
      }
    }
    if (queuedScrollRef.current) {
      scrollAnchorRef.current!.scrollIntoView({
        block: 'start',
        ...(queuedScrollRef.current === QueuedScroll.NEXT && {
          behavior: 'smooth',
        }),
      });
      queuedScrollRef.current = undefined;
    }
  }, [activeIndex, asPath, challenges]);

  const handleChallengeChange = (index: number) => {
    setActiveIndex(index);
  };

  const Heading = isRecipes ? H4 : H2;
  return (
    <div className="max-w-7xl mx-auto py-4">
      <div
        className={cn(
          'border-gray-10 bg-card dark:bg-card-dark shadow-inner rounded-none -mx-5 sm:mx-auto sm:rounded-lg'
        )}>
        <div ref={scrollAnchorRef} className="py-2 px-5 sm:px-8 pb-0 md:pb-0">
          <Heading
            id={titleId}
            className={cn(
              'mb-2 leading-10 relative',
              isRecipes
                ? 'text-xl text-purple-50 dark:text-purple-30'
                : 'text-3xl text-link'
            )}>
            {titleText}
          </Heading>
          {totalChallenges > 1 && (
            <Navigation
              currentChallenge={currentChallenge}
              challenges={challenges}
              handleChange={handleChallengeChange}
              isRecipes={isRecipes}
            />
          )}
        </div>
        <Challenge
          key={currentChallenge.id}
          isRecipes={isRecipes}
          currentChallenge={currentChallenge}
          totalChallenges={totalChallenges}
          hasNextChallenge={activeIndex < totalChallenges - 1}
          handleClickNextChallenge={() => {
            setActiveIndex((i) => i + 1);
            queuedScrollRef.current = QueuedScroll.NEXT;
          }}
        />
      </div>
    </div>
  );
}
