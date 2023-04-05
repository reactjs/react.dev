// @ts-nocheck

const fs = require('fs');
const path = require('path');

const file = fs.readFileSync(path.resolve(__dirname, 'data.json'));
const data = JSON.parse(file);

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

data.forEach(({name, photo, github, twitter, personal, title, description}) =>
  results.push(`
<TeamMember 
  name="${name}" 
  title="${title}"
  ${photo && `photo="${photo}"`}
  ${github && `github="${github}"`}
  ${twitter && `twitter="${twitter}"`}
  ${personal && `personal="${personal}"`}
>
  ${description}
</TeamMember>
`)
);

fs.writeFileSync(path.resolve(__dirname, 'index.md'), results.join(''));
