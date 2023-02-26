/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import {H3} from './Heading';

interface SimpleCalloutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}
function SimpleCallout({title, children, className}: SimpleCalloutProps) {
  return (
    <div
      className={cn(
        'p-6 xl:p-8 pb-4 xl:pb-6 bg-card dark:bg-card-dark rounded-lg shadow-inner text-base text-secondary dark:text-secondary-dark my-8',
        className
      )}>
      <H3
        className="text-primary dark:text-primary-dark mt-0 mb-3 leading-tight"
        isPageAnchor={false}>
        {title}
      </H3>
      {children}
    </div>
  );
}

export default SimpleCallout;
