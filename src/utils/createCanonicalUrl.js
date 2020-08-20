/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * @emails react-core
 * @flow
 */

import {urlRoot} from 'site-constants';

export default (slug: string): string | null =>
  slug == null ? null : `${urlRoot}/${slug.replace(/^\//, '')}`;
