const validateHeaderIds = require('./headingIDHelpers/validateHeadingIDs');
const generateHeadingIds = require('./headingIDHelpers/generateHeadingIDs');

/**
 * yarn lint-heading-ids --> Checks all files and causes an error if heading ID is missing
 * yarn lint-heading-ids --fix --> Fixes all markdown file's heading IDs
 * yarn lint-heading-ids path/to/markdown.md --> Checks that particular file for missing heading ID (path can denote a directory or particular file)
 * yarn lint-heading-ids --fix path/to/markdown.md --> Fixes that particular file's markdown IDs (path can denote a directory or particular file)
 */

const markdownPaths = process.argv.slice(2);
if (markdownPaths.includes('--fix')) {
  generateHeadingIds(markdownPaths.filter((path) => path !== '--fix'));
} else {
  validateHeaderIds(markdownPaths);
}
