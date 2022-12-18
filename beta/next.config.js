/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const redirects = require('./src/redirects.json');

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  pageExtensions: ['jsx', 'js', 'ts', 'tsx', 'mdx', 'md'],
  reactStrictMode: true,
  experimental: {
    plugins: true,
    scrollRestoration: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
  },
  env: {
    SANDPACK_BARE_COMPONENTS: process.env.SANDPACK_BARE_COMPONENTS,
  },
  async redirects() {
    return redirects.redirects;
  },
  // TODO: this causes extra router.replace() on every page.
  // Let's disable until we figure out what's going on.
  // rewrites() {
  //   return [
  //     {
  //       source: '/feed.xml',
  //       destination: '/_next/static/feed.xml',
  //     },
  //   ];
  // },
  webpack: (config, {dev, isServer, ...options}) => {
    if (process.env.ANALYZE) {
      const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: options.isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }

    // Don't bundle the shim unnecessarily.
    config.resolve.alias['use-sync-external-store/shim'] = 'react';

    const {IgnorePlugin, NormalModuleReplacementPlugin} = require('webpack');
    config.plugins.push(
      new NormalModuleReplacementPlugin(
        /^@stitches\/core$/,
        require.resolve('./src/utils/emptyShim.js')
      ),
      new NormalModuleReplacementPlugin(
        /^raf$/,
        require.resolve('./src/utils/rafShim.js')
      ),
      new NormalModuleReplacementPlugin(
        /^process$/,
        require.resolve('./src/utils/processShim.js')
      ),
      new IgnorePlugin({
        checkResource(resource, context) {
          if (
            /\/eslint\/lib\/rules$/.test(context) &&
            /\.\/[\w-]+(\.js)?$/.test(resource)
          ) {
            // Skips imports of built-in rules that ESLint
            // tries to carry into the bundle by default.
            // We only want the engine and the React rules.
            return true;
          }
          return false;
        },
      })
    );

    return config;
  },
};

module.exports = nextConfig;
