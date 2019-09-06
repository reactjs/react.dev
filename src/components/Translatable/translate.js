/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

// $FlowFixMe
import strings from '../../../content/strings.yml';

export const translate = (text: string, defaultText: string): string => {
  if (text in strings && strings[text] !== '') {
    return strings[text];
  }
  return defaultText || text;
};
