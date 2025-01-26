/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import { exec } from 'child_process';
import { mkdir, promises as fsPromises } from 'fs';
import { dirname } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Taken from Downloads on https://www.facebook.com/brand/meta/typography/.
// To refresh the list, go to the Conf website's public/fonts/ folder and run this:
// printf "\n[\n%s\n]\n" "$(find . -type f ! -path "*/.*" -name "*.woff2" | sed 's|^./||' | sort | awk '{printf "  \"%s\",\n", $0}' | sed '$s/,$//')"
const paths = [
  "Optimistic_Display_Arbc_W_Bd.woff2",
  "Optimistic_Display_Arbc_W_Md.woff2",
  "Optimistic_Display_Arbc_W_SBd.woff2",
  "Optimistic_Display_Cyrl_W_Bd.woff2",
  "Optimistic_Display_Cyrl_W_Md.woff2",
  "Optimistic_Display_Cyrl_W_SBd.woff2",
  "Optimistic_Display_Deva_W_Bd.woff2",
  "Optimistic_Display_Deva_W_Md.woff2",
  "Optimistic_Display_Deva_W_SBd.woff2",
  "Optimistic_Display_Viet_W_Bd.woff2",
  "Optimistic_Display_Viet_W_Md.woff2",
  "Optimistic_Display_Viet_W_SBd.woff2",
  "Optimistic_Display_W_Bd.woff2",
  "Optimistic_Display_W_BdIt.woff2",
  "Optimistic_Display_W_Lt.woff2",
  "Optimistic_Display_W_Md.woff2",
  "Optimistic_Display_W_MdIt.woff2",
  "Optimistic_Display_W_SBd.woff2",
  "Optimistic_Display_W_SBdIt.woff2",
  "Optimistic_Display_W_XBd.woff2",
  "Optimistic_Display_W_XLt.woff2",
  "Optimistic_Text_Arbc_W_Bd.woff2",
  "Optimistic_Text_Arbc_W_Md.woff2",
  "Optimistic_Text_Arbc_W_Rg.woff2",
  "Optimistic_Text_Arbc_W_XBd.woff2",
  "Optimistic_Text_Cyrl_W_Bd.woff2",
  "Optimistic_Text_Cyrl_W_Md.woff2",
  "Optimistic_Text_Cyrl_W_Rg.woff2",
  "Optimistic_Text_Cyrl_W_XBd.woff2",
  "Optimistic_Text_Deva_W_Bd.woff2",
  "Optimistic_Text_Deva_W_Md.woff2",
  "Optimistic_Text_Deva_W_Rg.woff2",
  "Optimistic_Text_Deva_W_XBd.woff2",
  "Optimistic_Text_Viet_W_Bd.woff2",
  "Optimistic_Text_Viet_W_Md.woff2",
  "Optimistic_Text_Viet_W_Rg.woff2",
  "Optimistic_Text_Viet_W_XBd.woff2",
  "Optimistic_Text_W_Bd.woff2",
  "Optimistic_Text_W_BdIt.woff2",
  "Optimistic_Text_W_It.woff2",
  "Optimistic_Text_W_Md.woff2",
  "Optimistic_Text_W_MdIt.woff2",
  "Optimistic_Text_W_Rg.woff2",
  "Optimistic_Text_W_XBd.woff2",
  "Optimistic_Text_W_XBdIt.woff2"
];

const baseURL = "https://conf.reactjs.org/fonts/";
const outputDir = "public/fonts/";

await Promise.all(
  paths.map(async (path) => {
    const localPath = `${outputDir}${path}`;
    const localDir = dirname(localPath);
    await fsPromises.mkdir(localDir, { recursive: true });

    const command = `curl ${baseURL}${path} --output ${localPath}`;
    await execAsync(command);
    console.log(`Downloaded ${path}`);
  })
);

console.log("All fonts downloaded.");
