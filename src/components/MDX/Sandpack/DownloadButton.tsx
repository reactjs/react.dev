/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {useSandpack} from '@codesandbox/sandpack-react/unstyled';
import {IconDownload} from '../../Icon/IconDownload';
export interface DownloadButtonProps {}

/**
 * Computes CRC-32 checksum required by the ZIP format.
 */
function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

/**
 * Builds an uncompressed ZIP archive from a map of filename → content.
 * Produces a valid ZIP that any OS or tool can extract.
 */
function createZip(files: Record<string, string>): Uint8Array {
  const encoder = new TextEncoder();

  const entries = Object.entries(files).map(([name, content]) => {
    const nameBytes = encoder.encode(name);
    const contentBytes = encoder.encode(content);
    return {nameBytes, contentBytes, crc: crc32(contentBytes)};
  });

  // Pre-calculate total buffer size
  const localSize = entries.reduce(
    (sum, e) => sum + 30 + e.nameBytes.length + e.contentBytes.length,
    0
  );
  const centralSize = entries.reduce(
    (sum, e) => sum + 46 + e.nameBytes.length,
    0
  );
  const buffer = new ArrayBuffer(localSize + centralSize + 22);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  const w16 = (off: number, v: number) => view.setUint16(off, v, true);
  const w32 = (off: number, v: number) => view.setUint32(off, v, true);

  let pos = 0;
  const localOffsets: number[] = [];

  // Local file entries
  for (const e of entries) {
    localOffsets.push(pos);
    w32(pos, 0x04034b50); // local file header signature
    w16(pos + 4, 20); // version needed
    w16(pos + 6, 0); // general purpose bit flag
    w16(pos + 8, 0); // compression: stored
    w16(pos + 10, 0); // last mod time
    w16(pos + 12, 0); // last mod date
    w32(pos + 14, e.crc);
    w32(pos + 18, e.contentBytes.length); // compressed size
    w32(pos + 22, e.contentBytes.length); // uncompressed size
    w16(pos + 26, e.nameBytes.length);
    w16(pos + 28, 0); // extra field length
    bytes.set(e.nameBytes, pos + 30);
    bytes.set(e.contentBytes, pos + 30 + e.nameBytes.length);
    pos += 30 + e.nameBytes.length + e.contentBytes.length;
  }

  // Central directory
  const centralStart = pos;
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    w32(pos, 0x02014b50); // central directory file header signature
    w16(pos + 4, 20); // version made by
    w16(pos + 6, 20); // version needed
    w16(pos + 8, 0); // general purpose bit flag
    w16(pos + 10, 0); // compression: stored
    w16(pos + 12, 0); // last mod time
    w16(pos + 14, 0); // last mod date
    w32(pos + 16, e.crc);
    w32(pos + 20, e.contentBytes.length); // compressed size
    w32(pos + 24, e.contentBytes.length); // uncompressed size
    w16(pos + 28, e.nameBytes.length);
    w16(pos + 30, 0); // extra field length
    w16(pos + 32, 0); // file comment length
    w16(pos + 34, 0); // disk number start
    w16(pos + 36, 0); // internal attributes
    w32(pos + 38, 0); // external attributes
    w32(pos + 42, localOffsets[i]); // offset of local header
    bytes.set(e.nameBytes, pos + 46);
    pos += 46 + e.nameBytes.length;
  }

  // End of central directory record
  w32(pos, 0x06054b50); // end of central directory signature
  w16(pos + 4, 0); // disk number
  w16(pos + 6, 0); // disk with start of central directory
  w16(pos + 8, entries.length);
  w16(pos + 10, entries.length);
  w32(pos + 12, centralSize);
  w32(pos + 16, centralStart);
  w16(pos + 20, 0); // comment length

  return bytes;
}

export function DownloadButton({}: {providedFiles: Array<string>}) {
  const {sandpack} = useSandpack();

  const downloadZip = () => {
    // Include all files (user files + hidden template files like package.json,
    // src/index.js, public/index.html) so the downloaded project can be run
    // with `npm install && npm start` without any extra configuration.
    const zipFiles: Record<string, string> = {};
    for (const [path, file] of Object.entries(sandpack.files)) {
      // Zip paths must not start with '/' and should be nested under "sandbox/"
      // so extracting the archive creates a tidy top-level folder.
      const zipPath =
        'sandbox/' + (path.startsWith('/') ? path.slice(1) : path);
      zipFiles[zipPath] = (file as {code: string}).code ?? '';
    }

    const zipBytes = createZip(zipFiles);
    const blob = new Blob([zipBytes], {type: 'application/zip'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'sandbox.zip';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <button
      className="text-sm text-primary dark:text-primary-dark inline-flex items-center hover:text-link duration-100 ease-in transition mx-1"
      onClick={downloadZip}
      title="Download Sandbox"
      type="button">
      <IconDownload className="inline me-1" /> Download
    </button>
  );
}
