/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

import {urlRoot} from 'site-constants';

export default slug =>
  slug == null ? null : `${urlRoot}/${slug.replace(/^\//, '')}`;
