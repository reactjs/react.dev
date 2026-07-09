/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {ImageResponse} from 'next/og';
import type {NextRequest} from 'next/server';

export const config = {
  runtime: 'edge',
};

const SECTION_LABELS: Record<string, string> = {
  learn: 'Learn React',
  reference: 'API Reference',
  community: 'Community',
  blog: 'Blog',
};

// Satori doesn't support woff2, so the site fonts can't be reused here.
// Source Code Pro matches the code-styled titles used across the docs.
const fontPromise = fetch(
  'https://raw.githubusercontent.com/adobe-fonts/source-code-pro/release/TTF/SourceCodePro-Semibold.ttf'
).then((res) => res.arrayBuffer());

export default async function handler(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const title = searchParams.get('title')?.slice(0, 80) ?? 'react.dev';
  const section = searchParams.get('section') ?? '';
  const label = SECTION_LABELS[section] ?? 'react.dev';
  const fontData = await fontPromise;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#23272f',
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
          <svg
            width="72"
            height="72"
            viewBox="-11.5 -10.23 23 20.46"
            fill="none">
            <circle cx="0" cy="0" r="2.05" fill="#58c4dc" />
            <g stroke="#58c4dc" strokeWidth="1" fill="none">
              <ellipse rx="11" ry="4.2" />
              <ellipse rx="11" ry="4.2" transform="rotate(60)" />
              <ellipse rx="11" ry="4.2" transform="rotate(120)" />
            </g>
          </svg>
          <div
            style={{
              fontSize: 36,
              color: '#99a1b3',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}>
            {label}
          </div>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: title.length > 24 ? 64 : 96,
            color: '#f6f7f9',
            lineHeight: 1.1,
            wordBreak: 'break-word',
          }}>
          {title}
        </div>
        <div
          style={{
            marginTop: 'auto',
            fontSize: 32,
            color: '#99a1b3',
          }}>
          react.dev
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Source Code Pro',
          data: fontData,
          style: 'normal',
          weight: 600,
        },
      ],
    }
  );
}
