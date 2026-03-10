/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {NextApiRequest, NextApiResponse} from 'next';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {StreamableHTTPServerTransport} from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {z} from 'zod';

import sidebarLearn from '../../sidebarLearn.json';
import sidebarReference from '../../sidebarReference.json';
import sidebarBlog from '../../sidebarBlog.json';
import sidebarCommunity from '../../sidebarCommunity.json';

import {
  type PageEntry,
  type Sidebar,
  collectPages,
  readContentFile,
} from '../../utils/docs';

// --- Sidebar types and page collection ---

interface Section {
  section: string;
  pages: PageEntry[];
}

// Build page index at module load time (static data)
const PAGE_INDEX: Section[] = (
  [sidebarLearn, sidebarReference, sidebarBlog, sidebarCommunity] as Sidebar[]
).map((sidebar) => ({
  section: sidebar.title,
  pages: collectPages(sidebar.routes),
}));

// --- MCP server (created once at module load) ---

const server = new McpServer(
  {
    name: 'react-docs',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.registerTool(
  'list_pages',
  {
    description:
      'List all available React documentation pages, grouped by section (Learn, Reference, Blog, Community). Returns JSON with titles and paths.',
  },
  async () => {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(PAGE_INDEX, null, 2),
        },
      ],
    };
  }
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- MCP SDK generic types cause TS2589
(server.registerTool as any)(
  'get_page',
  {
    description:
      'Get the full markdown content of a React documentation page by its path. Use list_pages to discover available paths.',
    inputSchema: {
      path: z
        .string()
        .describe(
          'Page path without leading slash, e.g. "reference/react/useState" or "blog/2024/12/05/react-19"'
        ),
    },
  },
  async ({path: pagePath}: {path: string}) => {
    const content = readContentFile(pagePath);
    if (content === null) {
      return {
        isError: true,
        content: [
          {
            type: 'text' as const,
            text: `Page not found: ${pagePath}`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: 'text' as const,
          text: content,
        },
      ],
    };
  }
);

// --- Next.js API config ---

export const config = {
  api: {
    // The MCP SDK reads the raw body itself
    bodyParser: false,
  },
};

// --- Request handler ---

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({error: 'Method not allowed. Use POST for MCP.'});
    return;
  }

  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });

  await server.connect(transport);

  await transport.handleRequest(req, res);
}
