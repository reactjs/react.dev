/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import React from 'react';

import type {Node} from 'react';

const addString = (list: Array<Node>, string: string) =>
  list.push(<span key={`${list.length}-${string}`}>{string}</span>);

const toCommaSeparatedList = (
  array: Array<any>,
  renderCallback: Function,
): Array<any> => {
  if (array.length <= 1) {
    return array.map(renderCallback);
  }

  const list = [];

  array.forEach((item, index) => {
    if (index === array.length - 1) {
      addString(list, array.length === 2 ? ' and ' : ', and ');
      list.push(renderCallback(item, index));
    } else if (index > 0) {
      addString(list, ', ');
      list.push(renderCallback(item, index));
    } else {
      list.push(renderCallback(item, index));
    }
  });

  return list;
};

export default toCommaSeparatedList;
