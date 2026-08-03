/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use client';

import {Page} from 'components/Layout/Page';
import {useDeserializedMDX} from 'components/Layout/useDeserializedMDX';
import {ErrorDecoderContext} from 'components/ErrorDecoderContext';
import sidebarLearn from '../../sidebarLearn.json';
import type {RouteItem} from 'components/Layout/getRouteMeta';
import type {ErrorDecoderData} from 'lib/loadErrorDecoderData';

interface ErrorDecoderViewProps {
  data: ErrorDecoderData;
  pathname: string;
}

export function ErrorDecoderView({data, pathname}: ErrorDecoderViewProps) {
  const {parsedContent} = useDeserializedMDX(data.content, data.toc);
  return (
    <ErrorDecoderContext
      value={{errorMessage: data.errorMessage, errorCode: data.errorCode}}>
      <Page
        toc={[]}
        meta={{
          title: data.errorCode
            ? `Minified React error #${data.errorCode}`
            : 'Minified Error Decoder',
        }}
        routeTree={sidebarLearn as RouteItem}
        section="unknown"
        pathname={pathname}>
        <div>{parsedContent}</div>
      </Page>
    </ErrorDecoderContext>
  );
}
