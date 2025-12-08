/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as ContextMenu from '@radix-ui/react-context-menu';
import {IconCopy} from 'components/Icon/IconCopy';
import {IconDownload} from 'components/Icon/IconDownload';
import {IconNewPage} from 'components/Icon/IconNewPage';
import {ExternalLink} from 'components/ExternalLink';
import {IconClose} from '../../Icon/IconClose';

function MenuItem({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
}) {
  return (
    <ContextMenu.Item
      className="flex items-center hover:bg-border dark:hover:bg-border-dark ps-6 pe-4 py-2 w-full text-base cursor-pointer"
      onSelect={onSelect}>
      {children}
    </ContextMenu.Item>
  );
}

function DownloadMenuItem({
  fileName,
  href,
  children,
}: {
  fileName: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a download={fileName} href={href} className="flex items-center w-full">
      <MenuItem>{children}</MenuItem>
    </a>
  );
}

export default function BrandMenu({children}: {children: React.ReactNode}) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger className="flex items-center">
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content
          className="hidden lg:block z-50 mt-6 bg-wash border border-border dark:border-border-dark dark:bg-wash-dark rounded min-w-56 overflow-hidden shadow"
          // @ts-ignore
          sideOffset={0}
          align="end">
          <ContextMenu.Label className="ps-4 pt-2 text-base text-tertiary dark:text-tertiary-dark">
            Dark Mode
          </ContextMenu.Label>
          <DownloadMenuItem
            fileName="react_logo_dark.svg"
            href="/images/brand/logo_dark.svg">
            <span className="w-8">
              <IconDownload />
            </span>
            <span>Logo SVG</span>
          </DownloadMenuItem>
          <DownloadMenuItem
            fileName="react_wordmark_dark.svg"
            href="/images/brand/wordmark_dark.svg">
            <span className="w-8">
              <IconDownload />
            </span>
            <span>Wordmark SVG</span>
          </DownloadMenuItem>
          <MenuItem
            onSelect={async () => {
              await navigator.clipboard.writeText('#58C4DC');
            }}>
            <span className="w-8">
              <IconCopy />
            </span>
            <span>Copy dark mode color</span>
          </MenuItem>
          <ContextMenu.Label className="ps-4 text-base text-tertiary dark:text-tertiary-dark">
            Light Mode
          </ContextMenu.Label>
          <DownloadMenuItem
            fileName="react_logo_light.svg"
            href="/images/brand/logo_light.svg">
            <span className="w-8">
              <IconDownload />
            </span>
            <span>Logo SVG</span>
          </DownloadMenuItem>
          <DownloadMenuItem
            fileName="react_wordmark_light.svg"
            href="/images/brand/wordmark_light.svg">
            <span className="w-8">
              <IconDownload />
            </span>
            <span>Wordmark SVG</span>
          </DownloadMenuItem>
          <MenuItem
            onSelect={async () => {
              await navigator.clipboard.writeText('#087EA4');
            }}>
            <span className="w-8">
              <IconCopy />
            </span>
            <span>Copy light mode color</span>
          </MenuItem>
          <div className="uwu-visible flex flex-col">
            <ContextMenu.Separator className="" />
            <ContextMenu.Label className="ps-4 text-base text-tertiary dark:text-tertiary-dark">
              uwu
            </ContextMenu.Label>
            <MenuItem
              onSelect={() => {
                // @ts-ignore
                window.__setUwu(false);
              }}>
              <span className="w-8">
                <IconClose />
              </span>
              <span>Turn off</span>
            </MenuItem>
            <DownloadMenuItem fileName="react_uwu_png" href="/images/uwu.png">
              <span className="w-8">
                <IconDownload />
              </span>
              <span>Logo PNG</span>
            </DownloadMenuItem>

            <ExternalLink
              className="flex items-center"
              href="https://github.com/SAWARATSUKI/KawaiiLogos">
              <MenuItem>
                <span className="w-8">
                  <IconNewPage />
                </span>
                <span>Logo by @sawaratsuki1004</span>
              </MenuItem>
            </ExternalLink>
          </div>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  );
}
