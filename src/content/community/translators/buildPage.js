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
title: Translate Contributors
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
      const [key, val] = line.split(': ');
      if (key === 'title') title = val;
      else if (key === 'translatedTitle') translatedTitle = val;
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

JSON.parse(fs.readFileSync(path.resolve(__dirname, 'data.json'))).forEach(
  ({description, name, ...props}) => {
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
  }
);

fs.writeFileSync(path.resolve(__dirname, 'index.md'), results.join(''));
