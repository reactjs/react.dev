/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import * as React from 'react';
import {
  FileTabs,
  useSandpack,
  useSandpackNavigation,
} from '@codesandbox/sandpack-react';
import {OpenInCodeSandboxButton} from './OpenInCodeSandboxButton';
import {ResetButton} from './ResetButton';
import {DownloadButton} from './DownloadButton';
import {FilesDropdown} from './FilesDropdown';

export function NavigationBar({showDownload}: {showDownload: boolean}) {
  const {sandpack} = useSandpack();
  const [dropdownActive, setDropdownActive] = React.useState(false);
  const {openPaths, clients} = sandpack;
  const clientId = Object.keys(clients)[0];
  const {refresh} = useSandpackNavigation(clientId);

  const resizeHandler = React.useCallback(() => {
    const width = window.innerWidth || document.documentElement.clientWidth;
    if (!dropdownActive && width < 640) {
      setDropdownActive(true);
    }
    if (dropdownActive && width >= 640) {
      setDropdownActive(false);
    }
  }, [dropdownActive]);

  React.useEffect(() => {
    if (openPaths.length > 1) {
      resizeHandler();
      window.addEventListener('resize', resizeHandler);
      return () => {
        window.removeEventListener('resize', resizeHandler);
      };
    }
    return;
  }, [openPaths.length, resizeHandler]);

  const handleReset = () => {
    sandpack.resetAllFiles();
    refresh();
  };

  return (
    <div className="bg-wash dark:bg-card-dark flex justify-between items-center relative z-10 border-b border-border dark:border-border-dark rounded-t-lg rounded-b-none">
      <div className="px-4 lg:px-6">
        {dropdownActive ? <FilesDropdown /> : <FileTabs />}
      </div>
      <div
        className="px-3 flex items-center justify-end flex-grow text-right"
        translate="yes">
        {showDownload && <DownloadButton />}
        <ResetButton onReset={handleReset} />
        <OpenInCodeSandboxButton />
      </div>
    </div>
  );
}
