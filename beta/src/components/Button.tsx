/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import cn from 'classnames';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  active: boolean;
  className?: string;
  style?: Record<string, string>;
}

export function Button({
  children,
  onClick,
  active,
  className,
  style,
}: ButtonProps) {
  return (
    <button
      style={style}
      onMouseDown={(evt) => {
        evt.preventDefault();
        evt.stopPropagation();
      }}
      onClick={onClick}
      className={cn(
        className,
        'text-base leading-tight font-bold border rounded-lg py-2 px-4 focus:ring-1 focus:ring-offset-2 focus:ring-link active:bg-link active:border-link active:text-white active:ring-0 active:ring-offset-0 outline-none inline-flex items-center my-1',
        {
          'bg-link border-link text-white hover:bg-link focus:bg-link active:bg-link':
            active,
          'bg-transparent text-secondary dark:text-secondary-dark bg-secondary-button dark:bg-secondary-button-dark hover:text-link focus:text-link border-transparent':
            !active,
        }
      )}>
      {children}
    </button>
  );
}

Button.defaultProps = {
  active: false,
  style: {},
};

export default Button;
