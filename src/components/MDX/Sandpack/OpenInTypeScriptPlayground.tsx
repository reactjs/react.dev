/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {IconNewPage} from '../../Icon/IconNewPage';

export const OpenInTypeScriptPlaygroundButton = (props: {content: string}) => {
  const contentWithReactImport = `import * as React from 'react';\n\n${props.content}`;
  return (
    <a
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1 ml-2 md:ml-1"
      href={`https://www.typescriptlang.org/play#src=${encodeURIComponent(
        contentWithReactImport
      )}`}
      title="Open in TypeScript Playground"
      target="_blank"
      rel="noreferrer">
      <IconNewPage
        className="inline ml-1 mr-1 relative top-[1px]"
        width="1em"
        height="1em"
      />
      <span className="hidden md:block">TypeScript Playground</span>
    </a>
  );
};
