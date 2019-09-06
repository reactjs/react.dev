/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import {translate} from './translate';
import type {Node} from 'react';
import {Children, isValidElement} from 'react';

const translateArray = childArray => {
  let idx = 0;
  const cleaned = childArray.map(child => {
    if (isValidElement(child)) {
      return `<${idx}>${child.props.children}</${idx++}>`;
    }
    return child;
  });

  const cleanedStr = cleaned.join('');
  const translatedArray = translate(cleanedStr, cleanedStr).split(
    /(<[0-9]+>.*?<\/[0-9]>)/gm,
  );

  const validElements = childArray.filter(isValidElement);
  return translatedArray.map(tt => {
    const matches = tt.match(/<([0-9]+)>(.*?)<\/[0-9]>/m);
    if (matches === null || !Array.isArray(matches)) {
      return tt;
    }

    const index: number = parseInt(matches[1], 10);

    const el = validElements[index];
    return {...el, props: {...el.props, children: matches[2]}};
  });
};

const Translatable = ({children}: {children: Node}) => {
  if (Array.isArray(children)) {
    return translateArray(Children.toArray(children));
  } else if (typeof children === 'string') {
    return translate((children: string), (children: string));
  }

  return children;
};

export default Translatable;
