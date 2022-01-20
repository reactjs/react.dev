/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

const path = require('path');
const {remarkPlugins} = require('./plugins/markdownToHtml');
const redirects = require('./src/redirects.json');

module.exports = {
  pageExtensions: ['jsx', 'js', 'ts', 'tsx', 'mdx', 'md'],
  experimental: {
    plugins: true,
    // TODO: this doesn't work because https://github.com/vercel/next.js/issues/30714
    // concurrentFeatures: true,
    scrollRestoration: true,
  },
  async redirects() {
    return redirects.redirects;
  },
  rewrites() {
    return [
      {
        source: '/feed.xml',
        destination: '/_next/static/feed.xml',
      },
    ];
  },
  webpack: (config, {dev, isServer, ...options}) => {
    if (process.env.ANALYZE) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: options.isServer
            ? '../analyze/server.html'
            : './analyze/client.html',
        })
      );
    }

    // Add our custom markdown loader in order to support frontmatter
    // and layout
    config.module.rules.push({
      test: /.mdx?$/, // load both .md and .mdx files
      use: [
        options.defaultLoaders.babel,
        {
          loader: '@mdx-js/loader',
          options: {
            remarkPlugins,
          },
        },
        path.join(__dirname, './plugins/md-layout-loader'),
      ],
    });

    return config;
  },
};
