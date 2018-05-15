/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * @emails react-core
 */

'use strict';

/** Params
{
  page: {
    layout: "index",
    jsonName: "dev-404-page.json",
    internalComponentName: "ComponentDev404Page",
    path: "/dev-404-page/",
    matchPath: undefined,
    component:
      "/Users/bvaughn/Documents/git/reactjs.org/.cache/dev-404-page.js",
    componentChunkName: "component---cache-dev-404-page-js",
    context: {},
    updatedAt: 1510471947417,
    pluginCreator___NODE: "Plugin dev-404-page",
    pluginCreatorId: "Plugin dev-404-page",
    componentPath:
      "/Users/bvaughn/Documents/git/reactjs.org/.cache/dev-404-page.js"
  },
  traceId: "initial-createPages",
  pathPrefix: "",
  boundActionCreators: {
    deletePage: [Function],
    createPage: [Function],
    deleteLayout: [Function],
    createLayout: [Function],
    deleteNode: [Function],
    deleteNodes: [Function],
    createNode: [Function],
    touchNode: [Function],
    createNodeField: [Function],
    createParentChildLink: [Function],
    createPageDependency: [Function],
    deleteComponentsDependencies: [Function],
    replaceComponentQuery: [Function],
    createJob: [Function],
    setJob: [Function],
    endJob: [Function],
    setPluginStatus: [Function],
    createRedirect: [Function]
  },
  loadNodeContent: [Function],
  store: {
    dispatch: [(Function: dispatch)],
    subscribe: [(Function: subscribe)],
    getState: [(Function: getState)],
    replaceReducer: [(Function: replaceReducer)],
    [Symbol(observable)]: [(Function: observable)]
  },
  getNodes: [Function],
  getNode: [(Function: getNode)],
  hasNodeChanged: [Function],
  reporter: undefined,
  getNodeAndSavePathDependency: [Function],
  cache: {
    initCache: [Function],
    get: [Function],
    set: [Function]
  }
}
*/

// Gatsby has 2 types of pages:
// (1) Pages generated from Markdown content (src/templates)
// (2) Pages defined in JavaScript (src/pages)
// This plug-in makes no attempt to localize pages, only markdown content.
// One way to differnetiate between the 2 is to check for 'context.languageCode'
// This field gets inserted during markdown template creation.
module.exports = ({page, boundActionCreators}, pluginOptions) => {
  const {createRedirect} = boundActionCreators;

  const {
    context: {
      language, // eg zn
      languageCode, // eg zn-CH
    },
    path, // eg /zn-CH/path/to/template.html, /path/to/page.html
  } = page;

  // TODO: Only do this for `gatsby-source-filesystem` name=translated sources?
  if (!languageCode) {
    return; // No-op for JavaScript pages (eg src/pages)
  }

  const nonLocalizedPath = path.substr(
    path.indexOf(languageCode) + languageCode.length,
  );

  createRedirect({
    fromPath: nonLocalizedPath,
    toPath: path,
    redirectInBrowser: true,
    Language: language,
  });
};
