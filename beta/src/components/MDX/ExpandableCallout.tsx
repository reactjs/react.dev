/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useRef} from 'react';
import * as React from 'react';
import cn from 'classnames';
import {IconNote} from '../Icon/IconNote';
import {IconGotcha} from '../Icon/IconGotcha';

type CalloutVariants = 'gotcha' | 'note' | 'wip';

interface ExpandableCalloutProps {
  children: React.ReactNode;
  type: CalloutVariants;
}

const variantMap = {
  note: {
    title: 'Note',
    Icon: IconNote,
    containerClasses:
      'bg-green-5 dark:bg-green-60 dark:bg-opacity-20 text-primary dark:text-primary-dark text-lg',
    textColor: 'text-green-60 dark:text-green-40',
    overlayGradient:
      'linear-gradient(rgba(245, 249, 248, 0), rgba(245, 249, 248, 1)',
  },
  gotcha: {
    title: 'Pitfall',
    Icon: IconGotcha,
    containerClasses: 'bg-yellow-5 dark:bg-yellow-60 dark:bg-opacity-20',
    textColor: 'text-yellow-50 dark:text-yellow-40',
    overlayGradient:
      'linear-gradient(rgba(249, 247, 243, 0), rgba(249, 247, 243, 1)',
  },
  wip: {
    title: 'Under Construction',
    Icon: IconNote,
    containerClasses: 'bg-yellow-5 dark:bg-yellow-60 dark:bg-opacity-20',
    textColor: 'text-yellow-50 dark:text-yellow-40',
    overlayGradient:
      'linear-gradient(rgba(249, 247, 243, 0), rgba(249, 247, 243, 1)',
  },
};

function ExpandableCallout({children, type}: ExpandableCalloutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const variant = variantMap[type];

  return (
    <div
      className={cn(
        'expandable-callout',
        'pt-8 pb-4 px-5 sm:px-8 my-8 relative rounded-none shadow-inner -mx-5 sm:mx-auto sm:rounded-lg',
        variant.containerClasses
      )}>
      <h3 className={cn('mb-2 text-2xl font-bold', variant.textColor)}>
        <variant.Icon
          className={cn('inline mr-3 mb-1 text-lg', variant.textColor)}
        />
        {variant.title}
      </h3>
      <div className="relative">
        <div ref={contentRef} className="py-2">
          {children}
        </div>
      </div>
    </div>
  );
}

ExpandableCallout.defaultProps = {
  type: 'note',
};

export default ExpandableCallout;
