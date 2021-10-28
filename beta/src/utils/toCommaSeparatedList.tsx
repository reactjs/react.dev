/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import React from 'react';

const addString = (list: React.ReactNodeArray, string: string) =>
  list.push(<span key={`${list.length}-${string}`}>{string}</span>);

function toCommaSeparatedList<Item>(
  array: Item[],
  renderCallback: (item: Item, index: number) => void
): Array<any> {
  if (array.length <= 1) {
    return array.map(renderCallback);
  }

  const list: any = [];

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
}

export default toCommaSeparatedList;
