/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';
import tailwindConfig from '../../../tailwind.config';
import CodeBlock from './CodeBlock';

interface APIAnatomyProps {
  children: React.ReactNode;
}

interface AnatomyContent {
  steps: React.ReactElement[];
  code: React.ReactNode;
}

const twColors = tailwindConfig.theme.extend.colors;
const colors = [
  {
    hex: twColors['blue-40'],
    border: 'border-blue-40',
    background: 'bg-blue-40',
  },
  {
    hex: twColors['yellow-40'],
    border: 'border-yellow-40',
    background: 'bg-yellow-40',
  },
  {
    hex: twColors['green-50'],
    border: 'border-green-50',
    background: 'bg-green-50',
  },
  {
    hex: twColors['purple-40'],
    border: 'border-purple-40',
    background: 'bg-purple-40',
  },
];

export function APIAnatomy({children}: APIAnatomyProps) {
  const [activeStep, setActiveStep] = React.useState<number | null>(null);

  const {steps, code} = React.Children.toArray(children).reduce(
    (acc: AnatomyContent, child) => {
      if (!React.isValidElement(child)) return acc;
      switch (child.props.mdxType) {
        case 'AnatomyStep':
          acc.steps.push(
            React.cloneElement(child, {
              ...child.props,
              activeStep,
              handleStepChange: setActiveStep,
              stepNumber: acc.steps.length + 1,
            })
          );
          break;
        case 'pre':
          acc.code = (
            <CodeBlock {...child.props.children.props} noMargin={true} />
          );
          break;
      }
      return acc;
    },
    {steps: [], code: null}
  );

  return (
    <section className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
      <div className="lg:order-2">{code}</div>
      <div className="lg:order-1 flex flex-col justify-center gap-y-2">
        {steps}
      </div>
    </section>
  );
}

interface AnatomyStepProps {
  children: React.ReactNode;
  title: string;
  stepNumber: number;
  activeStep?: number;
  handleStepChange: (stepNumber: number) => void;
}

export function AnatomyStep({
  title,
  stepNumber,
  children,
  activeStep,
  handleStepChange,
}: AnatomyStepProps) {
  const color = colors[stepNumber - 1];
  return (
    <div
      className={cn(
        'border-l-4 rounded-lg px-5 pt-8 pb-2 bg-opacity-5 shadow-inner',
        color.border,
        color.background
      )}>
      <div className="relative flex items-center justify-between">
        <div
          className={cn(
            'inline align-middle text-center rounded-full w-5 h-5 absolute font-bold text-white text-code font-mono leading-tight -left-8',
            color.background
          )}>
          {stepNumber}
        </div>
        <div className="text-primary dark:text-primary-dark leading-3 font-bold">
          {title}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
