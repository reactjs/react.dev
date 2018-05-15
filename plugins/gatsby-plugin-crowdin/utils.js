'use strict';

// Parses language code (e.g. en, zh-CH, fil-PH) from a path (eg en/path/to/file.js)
// Returns null if path doesn't contain a language code.
exports.getLanguageCodeFromPath = path => {
  const match = path.match(/^([a-z]{2}|[a-z]{2,}-[A-Z]+)\//);

  return match ? match[1] : null;
};

// Parses a language (eg en, zn) from a langauge and region string (eg en-GB, zh-CH).
// If the specified param doesn't contain a region (eg en) then it is returned as-is.
exports.getLanguageFromLanguageAndRegion = languageAndRegion =>
  languageAndRegion.indexOf('-')
    ? languageAndRegion.split('-')[0]
    : languageAndRegion;
