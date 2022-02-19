const fm = require('gray-matter');
const path = require('path');

const layouts = {
  apis: 'LayoutAPI',
  learn: 'LayoutLearn',
};

module.exports = async function (src) {
  const callback = this.async();
  const code = `
  import * as AllComponents from 'components/AllComponents';
  global.COMPONENTS = AllComponents;
  ${src}
  `;
  return callback(null, code);
};
