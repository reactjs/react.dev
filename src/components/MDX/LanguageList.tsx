'use client';

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useContext} from 'react';
import type {HTMLAttributes} from 'react';
import {finishedTranslations} from 'utils/finishedTranslations';
import Link from './Link';
import {LanguagesContext} from './LanguagesContext';

type TranslationProgress = 'complete' | 'in-progress';

function UL(props: HTMLAttributes<HTMLUListElement>) {
  return <ul className="ms-6 my-3 list-disc" {...props} />;
}

function LI(props: HTMLAttributes<HTMLLIElement>) {
  return <li className="leading-relaxed mb-1" {...props} />;
}

export default function LanguageList({
  progress,
}: {
  progress: TranslationProgress;
}) {
  const allLanguages = useContext(LanguagesContext) ?? [];
  const languages = allLanguages
    .filter(({code}) =>
      progress === 'complete'
        ? code !== 'en' && finishedTranslations.includes(code)
        : code !== 'en' && !finishedTranslations.includes(code)
    )
    .sort((left, right) => left.enName.localeCompare(right.enName));

  return (
    <UL>
      {languages.map(({code, enName, name}) => (
        <LI key={code}>
          <Link href={`https://${code}.react.dev/`}>
            {enName} ({name})
          </Link>{' '}
          &mdash;{' '}
          <Link href={`https://github.com/reactjs/${code}.react.dev`}>
            Contribute
          </Link>
        </LI>
      ))}
    </UL>
  );
}
