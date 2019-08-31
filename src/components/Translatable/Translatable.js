/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

// $FlowFixMe
import strings from '../../../content/strings.yml';

const Translatable = ({children}: {children: string}) => {
  if (children in strings && strings[children] !== '') {
    return strings[children];
  }
  return children;
};

export default Translatable;
