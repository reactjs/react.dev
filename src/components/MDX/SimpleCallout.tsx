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
        'my-8 rounded-2xl bg-card p-6 pb-4 text-base text-secondary shadow-inner-border dark:bg-card-dark dark:text-secondary-dark dark:shadow-inner-border-dark xl:p-8 xl:pb-6',
        className
      )}>
      <H3
        className="mt-0 mb-3 leading-tight text-primary dark:text-primary-dark"
        isPageAnchor={false}>
        {title}
      </H3>
      {children}
    </div>
  );
}

export default SimpleCallout;
