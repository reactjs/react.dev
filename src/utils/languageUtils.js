/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 * @flow
 */

// $FlowFixMe This is a valid path
import languagesArray from '../../crowdin/languages.json';

const DEFAULT_LANGUAGE = 'en-US';

const languagesMap = languagesArray.reduce((map: Object, language: string) => {
  map[language] = true;
  return map;
}, Object.create(null));

export function getTranslatedLanguages(): Array<string> {
  return languagesArray;
}

export function getSelectedLanguage(): string {
  let language = localStorage.getItem('selectedLanguage');
  if (languagesMap[language]) {
    return ((language: any): string);
  } else {
    const {languages} = navigator;
    for (let i = 0; i < languages.length; i++) {
      language = languages[i];
      if (languagesMap[language]) {
        return language;
      }
    }
  }
  return DEFAULT_LANGUAGE;
}

export function setSelectedLanguage(language: string): void {
  if (languagesMap[language]) {
    localStorage.setItem('selectedLanguage', language);
  } else if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `Specified language "${language}" is not a valid translation.`,
    );
  }
}
