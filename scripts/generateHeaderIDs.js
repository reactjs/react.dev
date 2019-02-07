const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walk(file));
    } else {
      /* Is a file */
      results.push(file);
    }
  });
  return results;
}

function generateID(text) {
  return text
    .toLowerCase()
    .replace(/\s/g, '-')
    .replace(/[^-a-z0-9]/g, '');
}

function addHeaderID(line) {
  // check if we're a header at all
  if (!line.startsWith('#')) return line;
  // check if it already has an id
  if (/\{#[-A-Za-z0-9]+\}/.test(line)) return line;
  const headingText = line.slice(line.indexOf(' ')).trim();
  const headingLevel = line.slice(0, line.indexOf(' '));
  return `${headingLevel} ${headingText} {#${generateID(headingText)}}`;
}

function addHeaderIDs(lines) {
  let inCode = false;
  const results = [];
  lines.forEach(line => {
    // Ignore code blocks
    if (line.startsWith('```')) {
      inCode = !inCode;
      results.push(line);
      return;
    }
    if (inCode) {
      results.push(line);
      return;
    }

    results.push(addHeaderID(line));
  });
  return results;
}

const [path] = process.argv.slice(2);

const files = walk(path);
files.forEach(file => {
  if (!file.endsWith('.md')) return;

  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  const updatedLines = addHeaderIDs(lines);
  fs.writeFileSync(file, updatedLines.join('\n'));
});
