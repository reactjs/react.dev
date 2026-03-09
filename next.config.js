/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  pageExtensions: ['jsx', 'js', 'ts', 'tsx', 'mdx', 'md'],
  reactStrictMode: true,
  reactCompiler: true,
  cacheComponents: true,
  experimental: {
    scrollRestoration: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Serve markdown when Accept header prefers text/markdown
        // Useful for LLM agents - https://www.skeptrune.com/posts/use-the-accept-header-to-serve-markdown-instead-of-html-to-llms/
        {
          source: '/:path((?!llms.txt).*)',
          has: [
            {
              type: 'header',
              key: 'accept',
              value: '(.*text/markdown.*)',
            },
          ],
          destination: '/api/md/:path*',
        },
        // Explicit .md extension also serves markdown
        {
          source: '/:path*.md',
          destination: '/api/md/:path*',
        },
      ],
    };
  },
  env: {},
  ...(process.env.ANALYZE
    ? {
        webpack: (config, {isServer}) => {
          const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              reportFilename: isServer
                ? '../analyze/server.html'
                : './analyze/client.html',
            })
          );

          return config;
        },
      }
    : {}),
};

module.exports = nextConfig;
