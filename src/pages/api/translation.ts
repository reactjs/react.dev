/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {NextApiRequest, NextApiResponse} from 'next';
import {finishedTranslations} from 'utils/finishedTranslations';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  const {language, from} = req.query;
  if (
    typeof language !== 'string' ||
    language === 'en' ||
    !finishedTranslations.includes(language)
  ) {
    res.status(404).end();
    return;
  }

  const homepage = `https://${language}.react.dev/`;
  if (
    typeof from !== 'string' ||
    !/^\/(?!\/)(?:learn|reference)(?:\/|$)[^\\?#]*$/.test(from)
  ) {
    res.redirect(302, homepage);
    return;
  }

  const translatedPage = new URL(from, homepage).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(translatedPage, {
      method: 'HEAD',
      signal: controller.signal,
    });
    if (response.ok) {
      res.redirect(302, translatedPage);
      return;
    }
  } catch {
    // Keep the original homepage behavior when the translation site is unavailable.
  } finally {
    clearTimeout(timeout);
  }

  res.redirect(302, homepage);
}
