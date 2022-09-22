/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import {Button} from 'components/Button';
import {ChallengeContents} from './Challenges';
import {IconHint} from '../../Icon/IconHint';
import {IconSolution} from '../../Icon/IconSolution';
import {IconArrowSmall} from '../../Icon/IconArrowSmall';

interface ChallengeProps {
  isRecipes?: boolean;
  totalChallenges: number;
  currentChallenge: ChallengeContents;
  hasNextChallenge: boolean;
  handleClickNextChallenge: () => void;
}

export function Challenge({
  isRecipes,
  totalChallenges,
  currentChallenge,
  hasNextChallenge,
  handleClickNextChallenge,
}: ChallengeProps) {
  const [showHint, setShowHint] = React.useState(false);
  const [showSolution, setShowSolution] = React.useState(false);

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

  return (
    <div className="p-5 sm:py-8 sm:px-8">
      <div>
        <h3 className="text-xl text-primary dark:text-primary-dark mb-2">
          <div className="font-bold block md:inline">
            {isRecipes ? 'Example' : 'Challenge'} {currentChallenge.order} of{' '}
            {totalChallenges}
            <span className="text-primary dark:text-primary-dark">: </span>
          </div>
          {currentChallenge.name}
        </h3>
        {currentChallenge.content}
      </div>
      <div className="flex justify-between items-center mt-4">
        {currentChallenge.hint ? (
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

        {hasNextChallenge && (
          <Button
            className={cn(
              isRecipes
                ? 'bg-purple-50 border-purple-50 hover:bg-purple-50 focus:bg-purple-50 active:bg-purple-50'
                : 'bg-link dark:bg-link-dark'
            )}
            onClick={handleClickNextChallenge}
            active>
            Next {isRecipes ? 'Example' : 'Challenge'}
            <IconArrowSmall displayDirection="right" className="block ml-1.5" />
          </Button>
        )}
      </div>
      {showHint && currentChallenge.hint}

      {showSolution && (
        <div className="mt-6">
          <h3 className="text-2xl font-bold text-primary dark:text-primary-dark">
            Solution
          </h3>
          {currentChallenge.solution}
          <div className="flex justify-between items-center mt-4">
            <Button onClick={() => setShowSolution(false)}>
              Close solution
            </Button>
            {hasNextChallenge && (
              <Button
                className={cn(
                  isRecipes ? 'bg-purple-50' : 'bg-link dark:bg-link-dark'
                )}
                onClick={handleClickNextChallenge}
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
  );
}
