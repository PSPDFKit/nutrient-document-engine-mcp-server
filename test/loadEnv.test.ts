import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: class {
    tool() {}
    async connect() {}
    async close() {}
  },
}));

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: class {},
}));

vi.mock('@modelcontextprotocol/sdk/server/streamableHttp.js', () => ({
  StreamableHTTPServerTransport: class {},
}));

vi.mock('../src/api/ClientFactory.js', () => ({
  getDocumentEngineClient: vi.fn().mockResolvedValue({
    get: vi.fn().mockResolvedValue({}),
  }),
}));

describe('entry module environment loading', () => {
  const originalCwd = process.cwd();
  const originalEnv = { ...process.env };
  const originalSigintListeners = process.listeners('SIGINT');
  let temporaryDirectory: string | undefined;

  afterEach(async () => {
    process.chdir(originalCwd);
    process.env = { ...originalEnv };
    vi.resetModules();
    for (const listener of process.listeners('SIGINT')) {
      if (!originalSigintListeners.includes(listener)) {
        process.removeListener('SIGINT', listener);
      }
    }

    if (temporaryDirectory) {
      await rm(temporaryDirectory, { recursive: true, force: true });
      temporaryDirectory = undefined;
    }
  });

  it('loads .env before application modules memoize the environment', async () => {
    temporaryDirectory = await mkdtemp(join(tmpdir(), 'document-engine-mcp-env-'));
    await writeFile(join(temporaryDirectory, '.env'), 'MCP_HTTP_AUTH_TOKEN=from-dotenv\n');

    process.chdir(temporaryDirectory);
    process.env = { ...originalEnv, NODE_ENV: 'test', MCP_TRANSPORT: 'stdio' };
    delete process.env.MCP_HTTP_AUTH_TOKEN;
    vi.resetModules();

    await import('../src/index.js');
    const { getEnvironment } = await import('../src/utils/Environment.js');

    expect(getEnvironment().MCP_HTTP_AUTH_TOKEN).toBe('from-dotenv');
  });
});
