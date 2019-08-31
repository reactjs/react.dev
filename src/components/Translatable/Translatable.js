/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

import {translate} from './translate';

const Translatable = ({children}: {children: string}) => {
  return translate(children);
};

export default Translatable;
