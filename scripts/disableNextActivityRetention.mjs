import {readFile, writeFile} from 'node:fs/promises';

const nextModules = [
  '../node_modules/next/dist/client/components/bfcache-state-manager.js',
  '../node_modules/next/dist/esm/client/components/bfcache-state-manager.js',
];
const original =
  'const MAX_BF_CACHE_ENTRIES = process.env.__NEXT_CACHE_COMPONENTS ? 3 : 1;';
const replacement =
  'const MAX_BF_CACHE_ENTRIES = process.env.__NEXT_CACHE_COMPONENTS ? 1 : 1;';

for (const nextModule of nextModules) {
  const url = new URL(nextModule, import.meta.url);
  const source = await readFile(url, 'utf8');

  if (source.includes(replacement)) {
    continue;
  }
  if (!source.includes(original)) {
    throw new Error(`Could not patch ${nextModule}`);
  }

  await writeFile(url, source.replace(original, replacement));
}

console.log('Disabled inactive Next.js Activity route retention');
