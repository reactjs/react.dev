const fs = require('fs');

module.exports = function walk(dir) {
  let results = [];
  /** 
   * If the param is a directory we can return the file
   */
  if(dir.includes('md')){
    return [dir];
  }
  const list = fs.readdirSync(dir);
  list.forEach(function (file) {
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
};
