'use client';

import {Fragment} from 'react';
import {ErrorDecoderProvider} from '../../../components/_/ErrorDecoderContext';
import {MDXComponents} from '../../../components/MDX/MDXComponents';

export default function ErrorMDX({
  content,
  errorCode,
  errorMessage,
}: {
  content: string;
  errorCode: string | null;
  errorMessage: string | null;
}) {
  return (
    <ErrorDecoderProvider value={{errorMessage, errorCode}}>
      {JSON.parse(content, reviveNodeOnClient)}
    </ErrorDecoderProvider>
  );
}

// Deserialize a client React tree from JSON.
function reviveNodeOnClient(parentPropertyName: unknown, val: any) {
  if (Array.isArray(val) && val[0] == '$r') {
    // Assume it's a React element.
    let Type = val[1];
    let key = val[2];
    if (key == null) {
      key = parentPropertyName; // Index within a parent.
    }
    let props = val[3];
    if (Type === 'wrapper') {
      Type = Fragment;
      props = {children: props.children};
    }
    if (Type in MDXComponents) {
      Type = MDXComponents[Type as keyof typeof MDXComponents];
    }
    if (!Type) {
      console.error('Unknown type: ' + Type);
      Type = Fragment;
    }
    return <Type key={key} {...props} />;
  } else {
    return val;
  }
}
