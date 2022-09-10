/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const path = require('path');
const {remarkPlugins} = require('./plugins/markdownToHtml');
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

    const {IgnorePlugin} = require('webpack');
    config.plugins.push(
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
