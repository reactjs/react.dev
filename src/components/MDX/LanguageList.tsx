'use client';

import Link from './Link';
import React from 'react';
import {finishedTranslations} from 'utils/finishedTranslations';
import {LanguagesContext} from './LanguagesContext';
import {UL, LI} from './Primitives';

type TranslationProgress = 'complete' | 'in-progress';

export function LanguageList({progress}: {progress: TranslationProgress}) {
  const allLanguages = React.useContext(LanguagesContext) ?? [];
  const languages = allLanguages
    .filter(
      ({code}) =>
        code !== 'en' &&
        (progress === 'complete'
          ? finishedTranslations.includes(code)
          : !finishedTranslations.includes(code))
    )
    .sort((a, b) => a.enName.localeCompare(b.enName));
  return (
    <UL>
      {languages.map(({code, name, enName}) => {
        return (
          <LI key={code}>
            <Link href={`https://${code}.react.dev/`}>
              {enName} ({name})
            </Link>{' '}
            &mdash;{' '}
            <Link href={`https://github.com/reactjs/${code}.react.dev`}>
              Contribute
            </Link>
          </LI>
        );
      })}
    </UL>
  );
}
