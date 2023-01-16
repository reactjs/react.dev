import {createContext} from 'react';

export type SnippetTargetLanguage = 'js' | 'ts';

export interface SnippetTargetLanguageContextValue {
  snippetTargetLanguage: SnippetTargetLanguage;
  setSnippetTargetLanguage: (
    nextSnippetTargetLanguage: SnippetTargetLanguage
  ) => void;
}

export const SnippetTargetLanguageContext =
  createContext<SnippetTargetLanguageContextValue>({
    snippetTargetLanguage: 'ts',
    setSnippetTargetLanguage: () => {
      throw new TypeError(
        `Could not change snippet language since no <SnippetLanguageProvider> was used in this React tree. This is a bug.`
      );
    },
  });

if (process.env.NODE_ENV !== 'production') {
  SnippetTargetLanguageContext.displayName = 'SnippetTargetLanguageContext';
}
