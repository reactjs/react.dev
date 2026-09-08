import Link from './Link';
import {LI, UL} from './Primitives';
import type {Languages} from './LanguagesContext';
import {finishedTranslations} from 'utils/finishedTranslations';

type TranslationProgress = 'complete' | 'in-progress';

export function LanguageList({
  languages,
  progress,
}: {
  languages: Languages | null;
  progress: TranslationProgress;
}) {
  const visibleLanguages = (languages ?? [])
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
      {visibleLanguages.map(({code, name, enName}) => (
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
