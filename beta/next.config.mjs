/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {remarkPlugins, rehypePlugins} from './plugins/markdownToHtml.mjs';

const require = createRequire(import.meta.url);
const redirects = require('./src/redirects.json');

export default {
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
  env: {
    // @todo Remove when https://github.com/vercel/next.js/pull/16529 lands
    GA_TRACKING_ID: 'XXXX',
    NEXT_PUBLIC_GA_TRACKING_ID: 'XXX',
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
      test: /\.mdx?$/, // load both .md and .mdx files
      use: [
        // The default `babel-loader` used by Next:
        options.defaultLoaders.babel,
        {
          // To do: figure out why `@mdx-js/loader`, which is almost the same,
          // fails.
          // loader: '@mdx-js/loader',
          loader: 'xdm/webpack.cjs',
          options: /** @type {import('@mdx-js/loader').Options} */ ({
            remarkPlugins,
            rehypePlugins,
            // To do: use `.mdx` as an extension for files that contain MDX (JSX, expressions, ESM).
            // `.md` is normally parsed as “normal” markdown.
            // Good to be explicit.
            format: 'mdx',
            // To do: perhaps we don’t need this?
            providerImportSource: '@mdx-js/react'
          })
        }
      ]
    });

    return config;
  },
};
