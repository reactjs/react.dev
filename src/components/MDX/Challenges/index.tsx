/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Children, isValidElement} from 'react';
import {H4} from '../Heading';
import {
  Challenges as ChallengesClient,
  type ChallengeContents,
} from './Challenges';

export function Hint({children}: {children: React.ReactNode}) {
  return <div>{children}</div>;
}

export function Solution({children}: {children: React.ReactNode}) {
  return <div>{children}</div>;
}

export function Challenges({
  children,
  ...props
}: {
  children: React.ReactNode;
  isRecipes?: boolean;
  titleText?: string;
  titleId?: string;
  noTitle?: boolean;
}) {
  const challenges: ChallengeContents[] = [];
  let challenge: Partial<ChallengeContents> = {};
  let content: React.ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      return;
    }
    if (child.type === Solution) {
      challenge.solution = child;
      challenge.content = content;
      challenges.push(challenge as ChallengeContents);
      challenge = {};
      content = [];
    } else if (child.type === Hint) {
      challenge.hint = child;
    } else if (child.type === H4) {
      const heading = child.props as {children: string; id: string};
      challenge.order = challenges.length + 1;
      challenge.name = heading.children;
      challenge.id = heading.id;
    } else {
      content.push(child);
    }
  });

  return <ChallengesClient {...props} challenges={challenges} />;
}
