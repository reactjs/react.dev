/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import sidebarReference from '../../sidebarReference.json';
import {NotFoundContent} from 'components/Layout/NotFoundContent';
import type {RouteItem} from 'components/Layout/getRouteMeta';

export default function NotFound() {
  return (
    <NotFoundContent
      routeTree={sidebarReference as RouteItem}
      sectionPath="/reference"
    />
  );
}
