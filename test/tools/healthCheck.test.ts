import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { healthCheck } from '../../src/tools/healthCheck.js';
import { getEnvironment } from '../../src/utils/Environment.js';
import { createMockClient, MockedDocumentEngineClient } from '../utils/mockTypes.js';
import { hostname } from 'node:os';

// Mock the logger to prevent console output during tests
vi.mock('../../src/utils/Logger.js', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

// Mock the Environment module
vi.mock('../../src/utils/Environment.js', () => ({
  getEnvironment: vi.fn(),
}));

describe('healthCheck', () => {
  let mockClient: MockedDocumentEngineClient;
  let originalEnv: NodeJS.ProcessEnv;
  let originalUptime: () => number;

  beforeEach(() => {
    // Save original environment and process.uptime
    originalEnv = { ...process.env };
    originalUptime = process.uptime;

    // Mock process.uptime
    process.uptime = vi.fn(() => 3665); // 1h 1m 5s

    // Set package version for testing
    process.env.npm_package_version = '1.0.0';
    process.env.NODE_ENV = 'test';

    // Set up default environment mock
    vi.mocked(getEnvironment).mockReturnValue({
      DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com',
      DOCUMENT_ENGINE_API_AUTH_TOKEN: 'mock-token',
      DASHBOARD_USERNAME: undefined,
      DASHBOARD_PASSWORD: undefined,
      CONNECTION_TIMEOUT: 30000,
      MAX_RETRIES: 3,
      RETRY_DELAY: 1000,
      MAX_CONNECTIONS: 100,
      LOG_LEVEL: 'INFO',
      MCP_TRANSPORT: 'stdio',
      PORT: 5100,
      MCP_HOST: 'localhost',
      DOCUMENT_ENGINE_POLL_MAX_RETRIES: 30,
      DOCUMENT_ENGINE_POLL_RETRY_DELAY: 2000,
    });

    mockClient = createMockClient();
  });

  afterEach(() => {
    // Restore original environment and process.uptime
    process.env = originalEnv;
    process.uptime = originalUptime;
  });

  describe('successful scenarios', () => {
    it('should return operational status when all systems are healthy', async () => {
      // Mock the client response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockClient.get as any).mockResolvedValue({ status: 200 }); // Mocking client method for testing

      // Call the function
      const result = await healthCheck(mockClient);

      // Verify the client was called with the correct endpoint
      expect(mockClient.get).toHaveBeenCalledWith('/healthcheck');

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Health Check Results');
      expect(result.markdown).toContain('## Overall Status');
      expect(result.markdown).toContain('- **Status**: ✅ Operational');
      expect(result.markdown).toContain('## Component Status');
      expect(result.markdown).toContain('- **MCP Server**: ✅ Operational');
      expect(result.markdown).toContain('- **Document Engine API**: ✅ Operational');
      expect(result.markdown).not.toContain('Error:');

      // Verify server information
      expect(result.markdown).toContain('## Server Information');
      expect(result.markdown).toContain('- **Version**: 1.0.0');
      expect(result.markdown).toContain('- **Environment**: test');
      expect(result.markdown).toContain('- **Uptime**: 1h 1m 5s');
      expect(result.markdown).toContain('- **Timestamp**:');

      // Verify configuration
      expect(result.markdown).toContain('## Configuration');
      expect(result.markdown).toContain('- **Document Engine URL**: https://api.example.com');
      expect(result.markdown).toContain('- **Connection Timeout**: 30000ms');
      expect(result.markdown).toContain('- **Max Retries**: 3');
      expect(result.markdown).toContain('- **Retry Delay**: 1000ms');
      expect(result.markdown).toContain('- **Max Connections**: 100');
      expect(result.markdown).toContain('- **Log Level**: INFO');
      expect(result.markdown).toContain('- **MCP Transport**: stdio');
    });

    it('should handle HTTP transport configuration', async () => {
      // Mock the environment to return HTTP transport
      vi.mocked(getEnvironment).mockReturnValue({
        DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: 'mock-token',
        DASHBOARD_USERNAME: undefined,
        DASHBOARD_PASSWORD: undefined,
        CONNECTION_TIMEOUT: 30000,
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000,
        MAX_CONNECTIONS: 100,
        LOG_LEVEL: 'INFO',
        MCP_TRANSPORT: 'http',
        PORT: 5100,
        MCP_HOST: 'localhost',
        DOCUMENT_ENGINE_POLL_MAX_RETRIES: 30,
        DOCUMENT_ENGINE_POLL_RETRY_DELAY: 2000,
      });

      // Mock the client response
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockClient.get as any).mockResolvedValue({ status: 200 }); // Mocking client method for testing

      // Call the function
      const result = await healthCheck(mockClient);

      // Verify HTTP transport specific configuration
      expect(result.markdown).toContain('- **MCP Transport**: http');
      expect(result.markdown).toContain('- **MCP Port**: 5100');
      expect(result.markdown).toContain(`- **MCP Host**: ${hostname()}`);
    });
  });

  describe('error scenarios', () => {
    it('should report degraded status when Document Engine API is unavailable', async () => {
      // Mock the client to throw an error
      const errorMessage = 'API Error: Connection failed';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (mockClient.get as any).mockRejectedValue(new Error(errorMessage)); // Mocking client method for testing

      // Call the function
      const result = await healthCheck(mockClient);

      // Verify the result contains the degraded status
      expect(result.markdown).toContain('- **Status**: ⚠️ Degraded');
      expect(result.markdown).toContain('- **Document Engine API**: ❌ Error');
      expect(result.markdown).toContain(`- Error: ${errorMessage}`);
    });
  });

  describe('utility functions', () => {
    it('should format uptime correctly', async () => {
      // Test different uptime values

      // 10 seconds
      process.uptime = vi.fn(() => 10);
      let result = await healthCheck(mockClient);
      expect(result.markdown).toContain('- **Uptime**: 10s');

      // 65 seconds (1m 5s)
      process.uptime = vi.fn(() => 65);
      result = await healthCheck(mockClient);
      expect(result.markdown).toContain('- **Uptime**: 1m 5s');

      // 3665 seconds (1h 1m 5s)
      process.uptime = vi.fn(() => 3665);
      result = await healthCheck(mockClient);
      expect(result.markdown).toContain('- **Uptime**: 1h 1m 5s');

      // 90061 seconds (1d 1h 1m 1s)
      process.uptime = vi.fn(() => 90061);
      result = await healthCheck(mockClient);
      expect(result.markdown).toContain('- **Uptime**: 1d 1h 1m 1s');
    });

    it('should mask URLs correctly', async () => {
      // Test with different URLs

      // Standard URL
      vi.mocked(getEnvironment).mockReturnValue({
        DOCUMENT_ENGINE_BASE_URL: 'https://username:password@api.example.com/path?query=value',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: 'mock-token',
        DASHBOARD_USERNAME: undefined,
        DASHBOARD_PASSWORD: undefined,
        CONNECTION_TIMEOUT: 30000,
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000,
        MAX_CONNECTIONS: 100,
        LOG_LEVEL: 'INFO',
        MCP_TRANSPORT: 'stdio',
        PORT: 5100,
        MCP_HOST: 'localhost',
        DOCUMENT_ENGINE_POLL_MAX_RETRIES: 30,
        DOCUMENT_ENGINE_POLL_RETRY_DELAY: 2000,
      });

      let result = await healthCheck(mockClient);
      expect(result.markdown).toContain('- **Document Engine URL**: https://api.example.com');

      // URL with port
      vi.mocked(getEnvironment).mockReturnValue({
        DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com:8443/path',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: 'mock-token',
        DASHBOARD_USERNAME: undefined,
        DASHBOARD_PASSWORD: undefined,
        CONNECTION_TIMEOUT: 30000,
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000,
        MAX_CONNECTIONS: 100,
        LOG_LEVEL: 'INFO',
        MCP_TRANSPORT: 'stdio',
        PORT: 5100,
        MCP_HOST: 'localhost',
        DOCUMENT_ENGINE_POLL_MAX_RETRIES: 30,
        DOCUMENT_ENGINE_POLL_RETRY_DELAY: 2000,
      });

      result = await healthCheck(mockClient);
      expect(result.markdown).toContain('- **Document Engine URL**: https://api.example.com:8443');
    });
  });
});
