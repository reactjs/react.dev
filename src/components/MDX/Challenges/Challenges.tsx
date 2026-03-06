'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

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
import {useLocationHash} from 'hooks/useLocationHash';
import {getMDXName} from 'components/MDX/getMDXName';

interface ChallengesProps {
  children: React.ReactElement[];
  isRecipes?: boolean;
  titleText?: string;
  titleId?: string;
  noTitle?: boolean;
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
  const flattenedChildren = flattenChallengeChildren(children);

  if (!flattenedChildren.length) {
    return contents;
  }

  let challenge: Partial<ChallengeContents> = {};
  let content: React.ReactNode[] = [];
  Children.forEach(flattenedChildren, (child) => {
    const {props} = child as React.ReactElement<{
      children?: string;
      id?: string;
    }>;
    switch (getMDXName(child)) {
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

function flattenChallengeChildren(
  children: React.ReactNode
): React.ReactNode[] {
  const flattened: React.ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) {
      flattened.push(child);
      return;
    }

    if (child.type === React.Fragment) {
      const fragmentChild = child as React.ReactElement<{
        children?: React.ReactNode;
      }>;
      flattened.push(...flattenChallengeChildren(fragmentChild.props.children));
      return;
    }

    flattened.push(child);
  });

  return flattened;
}

enum QueuedScroll {
  INIT = 'init',
  NEXT = 'next',
}

export function Challenges({
  children,
  isRecipes,
  noTitle,
  titleText = isRecipes ? 'Try out some examples' : 'Try out some challenges',
  titleId = isRecipes ? 'examples' : 'challenges',
}: ChallengesProps) {
  const challenges = parseChallengeContents(children);
  const totalChallenges = challenges.length;
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const queuedScrollRef = useRef<undefined | QueuedScroll>(QueuedScroll.INIT);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const hash = useLocationHash();
  const hashIndex = challenges.findIndex((challenge) => challenge.id === hash);
  const activeIndex =
    !hasInteracted && hashIndex !== -1 ? hashIndex : selectedIndex;
  const currentChallenge = challenges[activeIndex];

  useEffect(() => {
    if (queuedScrollRef.current === QueuedScroll.INIT) {
      if (hashIndex === -1) {
        queuedScrollRef.current = undefined;
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
  }, [activeIndex, challenges, hashIndex]);

  if (totalChallenges === 0 || currentChallenge == null) {
    return <>{children}</>;
  }

  const handleChallengeChange = (index: number) => {
    setHasInteracted(true);
    setSelectedIndex(index);
  };

  const Heading = isRecipes ? H4 : H2;
  return (
    <div className="max-w-7xl mx-auto py-4 w-full">
      <div
        className={cn(
          'border-gray-10 bg-card dark:bg-card-dark shadow-inner rounded-none -mx-5 sm:mx-auto sm:rounded-2xl'
        )}>
        <div ref={scrollAnchorRef} className="py-2 px-5 sm:px-8 pb-0 md:pb-0">
          {!noTitle && (
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
          )}
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
            setHasInteracted(true);
            setSelectedIndex(activeIndex + 1);
            queuedScrollRef.current = QueuedScroll.NEXT;
          }}
        />
      </div>
    </div>
  );
}
