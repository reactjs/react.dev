'use strict';

// Parses language code (eg en, zh-CH) from a path (eg en/path/to/file.js)
// Returns null if path doesn't contain a language code.
exports.getLanguageCodeFromPath = path => {
  const match = path.match(/^([a-z]{2}|[a-z]{2}-[A-Z]+)\//);

  return match ? match[1] : null;
};
