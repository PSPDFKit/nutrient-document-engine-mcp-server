/**
 * MCP Client utility for connecting to Document Engine MCP Server
 */

import { MultiServerMCPClient } from '@langchain/mcp-adapters';

/**
 * Creates and initializes an MCP client for Document Engine
 */
export function createMCPClient(mcpUrl: string): MultiServerMCPClient {
  return new MultiServerMCPClient({
    mcpServers: {
      documentEngine: {
        transport: 'http',
        url: mcpUrl,
      },
    },
  });
}
