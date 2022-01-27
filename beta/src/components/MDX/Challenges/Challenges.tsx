/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import {Button} from 'components/Button';
import {H2} from 'components/MDX/Heading';
import {Navigation} from './Navigation';
import {IconHint} from '../../Icon/IconHint';
import {IconSolution} from '../../Icon/IconSolution';
import {IconArrowSmall} from '../../Icon/IconArrowSmall';

interface ChallengesProps {
  children: React.ReactElement[];
  isRecipes?: boolean;
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
  React.Children.forEach(children, (child) => {
    const {props} = child;
    switch (props.mdxType) {
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
      case 'h3': {
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

export function Challenges({children, isRecipes}: ChallengesProps) {
  const challenges = parseChallengeContents(children);
  const scrollAnchorRef = React.useRef<HTMLDivElement>(null);

  const [showHint, setShowHint] = React.useState(false);
  const [showSolution, setShowSolution] = React.useState(false);
  const [activeChallenge, setActiveChallenge] = React.useState(
    challenges[0].id
  );

  const handleChallengeChange = (challengeId: string) => {
    setShowHint(false);
    setShowSolution(false);
    setActiveChallenge(challengeId);
  };

  const toggleHint = () => {
    if (showSolution && !showHint) {
      setShowSolution(false);
    }
    setShowHint((hint) => !hint);
  };

  const toggleSolution = () => {
    if (showHint && !showSolution) {
      setShowHint(false);
    }
    setShowSolution((solution) => !solution);
  };

  const currentChallenge = challenges.find(({id}) => id === activeChallenge);
  const nextChallenge = challenges.find(({order}) => {
    if (!currentChallenge) {
      return false;
    }
    return order === currentChallenge.order + 1;
  });

  return (
    <div className="max-w-7xl mx-auto py-4 md:py-12">
      <div
        className={cn(
          'border-gray-10 bg-card dark:bg-card-dark shadow-inner rounded-none -mx-5 sm:mx-auto sm:rounded-lg'
        )}>
        <div ref={scrollAnchorRef} className="py-2 px-5 sm:px-8 pb-0 md:pb-0">
          <H2
            id={isRecipes ? 'recipes' : 'challenges'}
            className={cn(
              'text-3xl mb-2 leading-10 relative',
              isRecipes ? 'text-purple-50 dark:text-purple-30' : 'text-link'
            )}>
            {isRecipes ? 'Try out some recipes' : 'Try out some challenges'}
          </H2>
          {challenges.length > 1 && (
            <Navigation
              activeChallenge={activeChallenge}
              challenges={challenges}
              handleChange={handleChallengeChange}
              isRecipes={isRecipes}
            />
          )}
        </div>
        <div className="p-5 sm:py-8 sm:px-8">
          <div key={activeChallenge}>
            <h3 className="text-xl text-primary dark:text-primary-dark mb-2">
              <div className="font-bold block md:inline">
                {isRecipes ? 'Recipe' : 'Challenge'} {currentChallenge?.order}{' '}
                of {challenges.length}
                <span className="text-primary dark:text-primary-dark">: </span>
              </div>
              {currentChallenge?.name}
            </h3>
            <>{currentChallenge?.content}</>
          </div>
          <div className="flex justify-between items-center mt-4">
            {currentChallenge?.hint ? (
              <div>
                <Button className="mr-2" onClick={toggleHint} active={showHint}>
                  <IconHint className="mr-1.5" />{' '}
                  {showHint ? 'Hide hint' : 'Show hint'}
                </Button>
                <Button
                  className="mr-2"
                  onClick={toggleSolution}
                  active={showSolution}>
                  <IconSolution className="mr-1.5" />{' '}
                  {showSolution ? 'Hide solution' : 'Show solution'}
                </Button>
              </div>
            ) : (
              !isRecipes && (
                <Button
                  className="mr-2"
                  onClick={toggleSolution}
                  active={showSolution}>
                  <IconSolution className="mr-1.5" />{' '}
                  {showSolution ? 'Hide solution' : 'Show solution'}
                </Button>
              )
            )}

            {nextChallenge && (
              <Button
                className={cn(
                  isRecipes
                    ? 'bg-purple-50 border-purple-50 hover:bg-purple-50 focus:bg-purple-50 active:bg-purple-50'
                    : 'bg-link dark:bg-link-dark'
                )}
                onClick={() => {
                  setActiveChallenge(nextChallenge.id);
                  setShowSolution(false);
                }}
                active>
                Next {isRecipes ? 'Recipe' : 'Challenge'}
                <IconArrowSmall
                  displayDirection="right"
                  className="block ml-1.5"
                />
              </Button>
            )}
          </div>
          {showHint && currentChallenge?.hint}

          {showSolution && (
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-primary dark:text-primary-dark">
                Solution
              </h3>
              {currentChallenge?.solution}
              <div className="flex justify-between items-center mt-4">
                <Button onClick={() => setShowSolution(false)}>
                  Close solution
                </Button>
                {nextChallenge && (
                  <Button
                    className={cn(
                      isRecipes ? 'bg-purple-50' : 'bg-link dark:bg-link-dark'
                    )}
                    onClick={() => {
                      setActiveChallenge(nextChallenge.id);
                      setShowSolution(false);
                      if (scrollAnchorRef.current) {
                        scrollAnchorRef.current.scrollIntoView({
                          block: 'start',
                          behavior: 'smooth',
                        });
                      }
                    }}
                    active>
                    Next Challenge
                    <IconArrowSmall
                      displayDirection="right"
                      className="block ml-1.5"
                    />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
