/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import fs from 'fs';
import path from 'path';
import {ImageResponse} from 'next/og';
import type {NextApiRequest, NextApiResponse} from 'next';

// Satori can't read woff2, so the site fonts are also vendored as
// TTF in public/fonts (converted from the woff2 files there).
const fontsDir = path.join(process.cwd(), 'public', 'fonts');
const bold = fs.readFileSync(
  path.join(fontsDir, 'Optimistic_Display_W_Bd.ttf')
);
const medium = fs.readFileSync(
  path.join(fontsDir, 'Optimistic_Display_W_Md.ttf')
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const title = String(req.query.title ?? 'react.dev').slice(0, 80);
  const pagePath = String(req.query.path ?? '').slice(0, 120);
  const footer = ('react.dev' + pagePath).toUpperCase();

  const image = new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px 80px',
          backgroundColor: '#23272f',
          backgroundImage:
            'radial-gradient(circle at 25% 30%, #343a46 0%, #23272f 55%)',
        }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
          <svg width="80" height="72" viewBox="-10.5 -9.45 21 18.9" fill="none">
            <circle cx="0" cy="0" r="2" fill="#58c4dc" />
            <g stroke="#58c4dc" strokeWidth="1" fill="none">
              <ellipse rx="10" ry="4.5" />
              <ellipse rx="10" ry="4.5" transform="rotate(60)" />
              <ellipse rx="10" ry="4.5" transform="rotate(120)" />
            </g>
          </svg>
          <div
            style={{
              fontSize: 48,
              fontFamily: 'Optimistic Display Bold',
              color: '#f6f7f9',
            }}>
            React
          </div>
        </div>
        <div
          style={{
            marginTop: 'auto',
            marginBottom: 'auto',
            fontSize: title.length > 24 ? 72 : 96,
            fontFamily: 'Optimistic Display Bold',
            color: '#f6f7f9',
            lineHeight: 1.1,
            wordBreak: 'break-word',
          }}>
          {title}
        </div>
        <div
          style={{
            fontSize: 28,
            fontFamily: 'Optimistic Display Medium',
            color: '#99a1b3',
            letterSpacing: '0.08em',
          }}>
          {footer}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Optimistic Display Bold',
          data: bold,
          style: 'normal',
          weight: 700,
        },
        {
          name: 'Optimistic Display Medium',
          data: medium,
          style: 'normal',
          weight: 500,
        },
      ],
    }
  );

  const buffer = Buffer.from(await image.arrayBuffer());
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.end(buffer);
}
