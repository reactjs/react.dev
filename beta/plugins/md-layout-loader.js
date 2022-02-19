module.exports = async function (src) {
  const callback = this.async();
  const code = `
  import * as AllComponents from 'components_new/AllComponents.server';
  global.COMPONENTS = AllComponents;
  ${src.replace('const layoutProps = {', 'const layoutProps = { data,')}
  `;
  return callback(null, code);
};
