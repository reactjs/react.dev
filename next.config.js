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
  turbopack: {
    resolveAlias: {
      // Don't bundle the shim unnecessarily.
      'use-sync-external-store/shim': 'react',
      // ESLint depends on the CommonJS version of esquery,
      // but Webpack loads the ESM version by default. This
      // alias ensures the correct version is used.
      //
      // More info:
      // https://github.com/reactjs/react.dev/pull/8115
      esquery: 'esquery/dist/esquery.min.js',
      // Replace transitive dependencies with lightweight shims.
      raf: './src/utils/rafShim.js',
      process: './src/utils/processShim.js',
    },
  },
  pageExtensions: ['jsx', 'js', 'ts', 'tsx', 'mdx', 'md'],
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
    turbopackImportTypeText: true,
  },
  reactCompiler: true,
  async rewrites() {
    return {
      beforeFiles: [
        // Explicit .md extension also serves markdown
        {
          source: '/:path*.md',
          destination: '/api/md/:path*',
        },
        // Serve markdown when Accept header prefers text/markdown
        // Useful for LLM agents - https://www.skeptrune.com/posts/use-the-accept-header-to-serve-markdown-instead-of-html-to-llms/
        {
          source: '/:path((?!llms\\.txt|api/md).*)',
          has: [
            {
              type: 'header',
              key: 'accept',
              value: '(.*text/markdown.*)',
            },
          ],
          destination: '/api/md/:path*',
        },
      ],
    };
  },
  env: {},
};

module.exports = nextConfig;
