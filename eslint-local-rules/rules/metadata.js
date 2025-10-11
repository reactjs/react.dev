/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @typedef {{type: 'text', raw: string}} TextToken
 * @typedef {{
 *   type: 'expectedErrors',
 *   entries: Record<string, Array<number>>,
 *   raw?: string,
 * }} ExpectedErrorsToken
 * @typedef {TextToken | ExpectedErrorsToken} MetadataToken
 *
 * @typedef {{
 *   leading: string,
 *   trailing: string,
 *   tokens: Array<MetadataToken>,
 *   parseError: boolean,
 *   hadDuplicateExpectedErrors: boolean,
 * }} FenceMetadata
 */

const EXPECTED_ERRORS_BLOCK_REGEX = /\{\s*expectedErrors\s*:/;
const REACT_COMPILER_KEY = 'react-compiler';

function getSortedUniqueNumbers(values) {
  return Array.from(new Set(values))
    .filter((value) => typeof value === 'number' && !Number.isNaN(value))
    .sort((a, b) => a - b);
}

function tokenizeMeta(body) {
  if (!body) {
    return [];
  }

  const tokens = [];
  let current = '';
  let depth = 0;

  for (let i = 0; i < body.length; i++) {
    const char = body[i];
    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth = Math.max(depth - 1, 0);
    }

    if (char === ' ' && depth === 0) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (current) {
    tokens.push(current);
  }

  return tokens;
}

function normalizeEntryValues(values) {
  if (!Array.isArray(values)) {
    return [];
  }
  return getSortedUniqueNumbers(values);
}

function parseExpectedErrorsEntries(rawEntries) {
  const normalized = rawEntries
    .replace(/([{,]\s*)([a-zA-Z_$][\w$]*)\s*:/g, '$1"$2":')
    .replace(/'([^']*)'/g, '"$1"');

  const parsed = JSON.parse(normalized);
  const entries = {};

  if (parsed && typeof parsed === 'object') {
    for (const [key, value] of Object.entries(parsed)) {
      entries[key] = normalizeEntryValues(Array.isArray(value) ? value.flat() : value);
    }
  }

  return entries;
}

function parseExpectedErrorsToken(tokenText) {
  const match = tokenText.match(/^\{\s*expectedErrors\s*:\s*(\{[\s\S]*\})\s*\}$/);
  if (!match) {
    return null;
  }

  const entriesSource = match[1];
  let parseError = false;
  let entries;

  try {
    entries = parseExpectedErrorsEntries(entriesSource);
  } catch (error) {
    parseError = true;
    entries = {};
  }

  return {
    token: {
      type: 'expectedErrors',
      entries,
      raw: tokenText,
    },
    parseError,
  };
}

function parseFenceMetadata(metaText) {
  if (!metaText) {
    return {
      leading: '',
      trailing: '',
      tokens: [],
      parseError: false,
      hadDuplicateExpectedErrors: false,
    };
  }

  const leading = metaText.match(/^\s*/)?.[0] ?? '';
  const trailing = metaText.match(/\s*$/)?.[0] ?? '';
  const bodyStart = leading.length;
  const bodyEnd = metaText.length - trailing.length;
  const body = metaText.slice(bodyStart, bodyEnd).trim();

  if (!body) {
    return {
      leading,
      trailing,
      tokens: [],
      parseError: false,
      hadDuplicateExpectedErrors: false,
    };
  }

  const tokens = [];
  let parseError = false;
  let sawExpectedErrors = false;
  let hadDuplicateExpectedErrors = false;

  for (const rawToken of tokenizeMeta(body)) {
    const normalizedToken = rawToken.trim();
    if (!normalizedToken) {
      continue;
    }

    if (EXPECTED_ERRORS_BLOCK_REGEX.test(normalizedToken)) {
      const parsed = parseExpectedErrorsToken(normalizedToken);
      if (parsed) {
        if (sawExpectedErrors) {
          hadDuplicateExpectedErrors = true;
          // Drop duplicates. We'll rebuild the canonical block on write.
          continue;
        }
        tokens.push(parsed.token);
        parseError = parseError || parsed.parseError;
        sawExpectedErrors = true;
        continue;
      }
    }

    tokens.push({type: 'text', raw: normalizedToken});
  }

  return {
    leading,
    trailing,
    tokens,
    parseError,
    hadDuplicateExpectedErrors,
  };
}

function cloneMetadata(metadata) {
  return {
    leading: metadata.leading,
    trailing: metadata.trailing,
    parseError: metadata.parseError,
    hadDuplicateExpectedErrors: metadata.hadDuplicateExpectedErrors,
    tokens: metadata.tokens.map((token) => {
      if (token.type === 'expectedErrors') {
        const clonedEntries = {};
        for (const [key, value] of Object.entries(token.entries)) {
          clonedEntries[key] = [...value];
        }
        return {type: 'expectedErrors', entries: clonedEntries};
      }
      return {type: 'text', raw: token.raw};
    }),
  };
}

function findExpectedErrorsToken(metadata) {
  return metadata.tokens.find((token) => token.type === 'expectedErrors') || null;
}

function getCompilerExpectedLines(metadata) {
  const token = findExpectedErrorsToken(metadata);
  if (!token) {
    return [];
  }
  return getSortedUniqueNumbers(token.entries[REACT_COMPILER_KEY] || []);
}

function hasCompilerEntry(metadata) {
  const token = findExpectedErrorsToken(metadata);
  return Boolean(token && token.entries[REACT_COMPILER_KEY]?.length);
}

function metadataHasExpectedErrorsToken(metadata) {
  return Boolean(findExpectedErrorsToken(metadata));
}

function stringifyExpectedErrorsToken(token) {
  const entries = token.entries || {};
  const keys = Object.keys(entries).filter((key) => entries[key].length > 0);
  if (keys.length === 0) {
    return '';
  }

  keys.sort();

  const segments = keys.map((key) => {
    const values = entries[key];
    return `'${key}': [${values.join(', ')}]`;
  });

  return `{expectedErrors: {${segments.join(', ')}}}`;
}

function stringifyFenceMetadata(metadata) {
  if (!metadata.tokens.length) {
    return '';
  }

  const parts = metadata.tokens
    .map((token) => {
      if (token.type === 'expectedErrors') {
        return stringifyExpectedErrorsToken(token);
      }
      return token.raw;
    })
    .filter(Boolean);

  if (!parts.length) {
    return '';
  }

  const leading = metadata.leading || ' ';
  const trailing = metadata.trailing ? metadata.trailing.trimEnd() : '';
  const body = parts.join(' ');
  return `${leading}${body}${trailing}`;
}

function buildFenceLine(lang, metadata) {
  const meta = stringifyFenceMetadata(metadata);
  return meta ? `\`\`\`${lang}${meta}` : `\`\`\`${lang}`;
}

function metadataEquals(a, b) {
  if (a.leading !== b.leading || a.trailing !== b.trailing) {
    return false;
  }

  if (a.tokens.length !== b.tokens.length) {
    return false;
  }

  for (let i = 0; i < a.tokens.length; i++) {
    const left = a.tokens[i];
    const right = b.tokens[i];
    if (left.type !== right.type) {
      return false;
    }
    if (left.type === 'text') {
      if (left.raw !== right.raw) {
        return false;
      }
    } else {
      const leftKeys = Object.keys(left.entries).sort();
      const rightKeys = Object.keys(right.entries).sort();
      if (leftKeys.length !== rightKeys.length) {
        return false;
      }
      for (let j = 0; j < leftKeys.length; j++) {
        if (leftKeys[j] !== rightKeys[j]) {
          return false;
        }
        const lValues = getSortedUniqueNumbers(left.entries[leftKeys[j]]);
        const rValues = getSortedUniqueNumbers(right.entries[rightKeys[j]]);
        if (lValues.length !== rValues.length) {
          return false;
        }
        for (let k = 0; k < lValues.length; k++) {
          if (lValues[k] !== rValues[k]) {
            return false;
          }
        }
      }
    }
  }

  return true;
}

function normalizeMetadata(metadata) {
  const normalized = cloneMetadata(metadata);
  normalized.hadDuplicateExpectedErrors = false;
  normalized.parseError = false;
  if (!normalized.tokens.length) {
    normalized.leading = '';
    normalized.trailing = '';
  }
  return normalized;
}

function setCompilerExpectedLines(metadata, lines) {
  const normalizedLines = getSortedUniqueNumbers(lines);
  if (normalizedLines.length === 0) {
    return removeCompilerExpectedLines(metadata);
  }

  const next = cloneMetadata(metadata);
  let token = findExpectedErrorsToken(next);
  if (!token) {
    token = {type: 'expectedErrors', entries: {}};
    next.tokens = [token, ...next.tokens];
  }

  token.entries[REACT_COMPILER_KEY] = normalizedLines;
  return normalizeMetadata(next);
}

function removeCompilerExpectedLines(metadata) {
  const next = cloneMetadata(metadata);
  const token = findExpectedErrorsToken(next);
  if (!token) {
    return normalizeMetadata(next);
  }

  delete token.entries[REACT_COMPILER_KEY];

  const hasEntries = Object.values(token.entries).some(
    (value) => Array.isArray(value) && value.length > 0
  );

  if (!hasEntries) {
    next.tokens = next.tokens.filter((item) => item !== token);
  }

  return normalizeMetadata(next);
}

module.exports = {
  buildFenceLine,
  getCompilerExpectedLines,
  getSortedUniqueNumbers,
  hasCompilerEntry,
  metadataEquals,
  metadataHasExpectedErrorsToken,
  parseFenceMetadata,
  removeCompilerExpectedLines,
  setCompilerExpectedLines,
  stringifyFenceMetadata,
};
