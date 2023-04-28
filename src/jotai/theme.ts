import {atom, useAtomValue, useSetAtom} from 'jotai';

export type Theme = 'dark' | 'light';
const themeState = atom<Theme | ''>('');

const themeAtom = atom(
  null,
  (get, set, fn: (Theme | '') | ((prev: Theme | '') => Theme | '')) => {
    const prev = get(themeState);
    const res = typeof fn === 'function' ? fn(prev) : fn;
    const stored = localStorage.getItem('theme') as Theme;
    const media = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme =
      res || get(themeState) || stored || (media ? 'dark' : 'light');
    document.documentElement.classList[theme === 'dark' ? 'add' : 'remove'](
      'dark'
    );
    set(themeState, theme);
    localStorage.setItem('theme', theme);
  }
);

export const useTheme = () => useAtomValue(themeState);
export const useSetTheme = () => useSetAtom(themeAtom);
