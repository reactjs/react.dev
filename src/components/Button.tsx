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
        'my-1 inline-flex items-center rounded-full py-2 px-4 text-base font-bold leading-tight focus:outline focus:outline-offset-2 focus:outline-link dark:focus:outline-link-dark',
        {
          'border-link bg-link text-white hover:bg-link focus:bg-link active:bg-link':
            active,
          'bg-transparent text-primary shadow-secondary-button-stroke hover:bg-gray-40/5 active:bg-gray-40/10 active:text-primary dark:text-primary-dark dark:shadow-secondary-button-stroke-dark  hover:dark:bg-gray-60/5 active:dark:bg-gray-60/10':
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
