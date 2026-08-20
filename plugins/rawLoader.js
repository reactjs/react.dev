/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Turbopack loader that exposes a file's contents as a string.
module.exports = function rawLoader(source) {
  return 'export default ' + JSON.stringify(source) + ';';
};
