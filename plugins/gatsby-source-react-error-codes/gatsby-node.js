const request = require('request-promise');

const errorCodesUrl =
  'http://raw.githubusercontent.com/facebook/react/master/scripts/error-codes/codes.json';

exports.sourceNodes = async ({boundActionCreators}) => {
  const {createNode} = boundActionCreators;

  const jsonString = await request(errorCodesUrl);

  createNode({
    id: 'error-codes',
    children: [],
    parent: 'ERRORS',
    internal: {
      type: 'ErrorCodesJson',
      contentDigest: jsonString,
    },
  });
};
