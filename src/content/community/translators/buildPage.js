// @ts-nocheck

const fs = require('fs');
const path = require('path');

const paths = [
  '/learn',
  '/reference/react',
  '/reference/react-dom/client',
  '/reference/react-dom/components',
  '/reference/react-dom/server',
  '/reference/react-dom',
];
const results = [
  `---
title: Translation Contributors
translatedTitle: 번역한 사람들
showToc: false
showSurvey: false
---
<Intro>
</Intro>

<br/>
`,
];

const memberTranslatedList = new Map();

const removeQuote = (str) => {
  const regex = str.startsWith("'")
    ? /\'/g
    : str.startsWith('"')
    ? /\"/g
    : null;
  return regex ? str.replace(regex, '') : str;
};

paths
  .flatMap((pathname) =>
    fs
      .readdirSync(path.resolve(__dirname, `../../${pathname}`))
      .filter((f) => f.endsWith('.md'))
      .map((filename) => {
        const file = fs.readFileSync(
          path.resolve(__dirname, `../../${pathname}`, `./${filename}`),
          'utf8'
        );
        return {
          file,
          url: `${pathname}/${filename.slice(0, -3)}`,
        };
      })
  )
  .forEach(({file, url}) => {
    let title, translatedTitle, translators;
    for (const line of file.split('\n').slice(0, 5)) {
      const splicer = line.indexOf(': ');
      const [key, val] = [line.slice(0, splicer), line.slice(splicer + 2)];
      if (key === 'title') title = removeQuote(val);
      else if (key === 'translatedTitle') translatedTitle = removeQuote(val);
      else if (key === 'translators')
        translators = val.slice(1, -1).split(', ');
    }

    if (translators?.length)
      translators.forEach((t) => {
        const memberData = memberTranslatedList.get(t) || [];
        memberData.push({title, translatedTitle, url});
        memberTranslatedList.set(t, memberData);
      });
  });

const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data.json')));

if (process.argv[process.argv.length - 1] === '--shuffle') {
  const jn = data.shift();
  data.sort(() => Math.random() - 0.5);
  data.unshift(jn);

  fs.writeFileSync(
    path.resolve(__dirname, 'data.json'),
    JSON.stringify(data),
    'utf8'
  );
}

data.forEach(({description, name, ...props}) => {
  const prop = [];
  Object.entries(props).map(([key, val]) => {
    if (val) prop.push(`${key}="${val}"`);
  });
  const translated = memberTranslatedList.get(name);
  results.push(`
<TeamMember 
  ${prop.join('\n')}
  name="${name}"
  translated={${JSON.stringify(translated)}}
>
  ${description}
</TeamMember>
`);
});

fs.writeFileSync(path.resolve(__dirname, 'index.md'), results.join(''));
