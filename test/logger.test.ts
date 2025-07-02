import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Logger, LogLevel } from '../src/utils/Logger.js';

// Mock the Environment module
vi.mock('../src/utils/Environment.js', () => ({
  getEnvironment: vi.fn(),
}));

// Mock the MCP server
vi.mock('@modelcontextprotocol/sdk/server/mcp.js', () => {
  return {
    McpServer: vi.fn().mockImplementation(() => ({
      isConnected: vi.fn(),
      server: {
        sendLoggingMessage: vi.fn(),
      },
    })),
  };
});

import { getEnvironment, ParsedEnvironment } from '../src/utils/Environment.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

interface MockedMcpServer extends McpServer {
  isConnected: Mock;
  server: McpServer['server'] & {
    sendLoggingMessage: Mock;
  };
}

const defaultEnvironment: ParsedEnvironment = {
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
};

describe('Logger', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mock objects for testing stream methods
  let mockStderr: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Mock objects for testing stream methods
  let mockStdout: any;
  let originalStderr: typeof process.stderr.write;
  let originalStdout: typeof process.stdout.write;

  beforeEach(() => {
    // Mock process.stderr.write
    mockStderr = vi.fn();
    mockStdout = vi.fn();
    originalStderr = process.stderr.write;
    originalStdout = process.stdout.write;
    process.stderr.write = mockStderr;
    process.stdout.write = mockStdout;

    vi.mocked(getEnvironment).mockReturnValue(defaultEnvironment);
  });

  afterEach(() => {
    // Restore original stderr
    process.stderr.write = originalStderr;
    process.stdout.write = originalStdout;
    vi.clearAllMocks();
  });

  describe('Log Levels', () => {
    it('should respect log level filtering', () => {
      // Create logger with ERROR level
      const logger = new Logger('test-service');
      // Set log level via constructor or skip this test
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Accessing private property for testing
      (logger as any).logLevel = LogLevel.ERROR;

      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');

      // Only error should be logged to stderr, nothing to stdout in stdio mode
      expect(mockStderr).toHaveBeenCalledTimes(1);
      expect(mockStdout).toHaveBeenCalledTimes(0);
      expect(mockStderr.mock.calls[0][0]).toContain('ERROR');
      expect(mockStderr.mock.calls[0][0]).toContain('error message');
    });

    it('should log all levels when set to DEBUG in HTTP mode', () => {
      // Mock HTTP mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'http',
        LOG_LEVEL: 'DEBUG',
      });

      const logger = new Logger('test-service');
      // Set log level via constructor or skip this test
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Accessing private property for testing
      (logger as any).logLevel = LogLevel.DEBUG;

      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');

      // Error goes to stderr, others to stdout in HTTP mode
      expect(mockStderr).toHaveBeenCalledTimes(1);
      expect(mockStdout).toHaveBeenCalledTimes(3);
    });

    it('should log all messages to stderr in stdio mode when set to DEBUG', () => {
      // Ensure stdio mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'stdio',
        LOG_LEVEL: 'DEBUG',
      });

      const logger = new Logger('test-service');

      logger.debug('debug message');
      logger.info('info message');
      logger.warn('warn message');
      logger.error('error message');

      // Only error should be logged to stderr, nothing to stdout in stdio mode
      expect(mockStderr).toHaveBeenCalledTimes(4);
      expect(mockStdout).toHaveBeenCalledTimes(0);
    });
  });

  describe('Log Format', () => {
    it('should format log entries as JSON in HTTP mode', () => {
      // Mock HTTP mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'http',
        LOG_LEVEL: 'INFO',
      });

      const logger = new Logger('test-service');
      logger.info('test message');

      expect(mockStdout).toHaveBeenCalledTimes(1);
      const logOutput = mockStdout.mock.calls[0][0] as string;

      // Should be valid JSON
      expect(() => JSON.parse(logOutput)).not.toThrow();

      const parsed = JSON.parse(logOutput);
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('level', 'INFO');
      expect(parsed).toHaveProperty('message', '[test-service] test message');
    });

    it('should not write info logs to stdout in stdio mode', () => {
      // Ensure stdio mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'stdio',
        LOG_LEVEL: 'INFO',
      });

      const logger = new Logger('test-service');
      logger.info('test message');

      expect(mockStdout).toHaveBeenCalledTimes(0);
    });

    it('should include context when provided in HTTP mode', () => {
      // Mock HTTP mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'http',
        LOG_LEVEL: 'INFO',
      });

      const logger = new Logger('test-service');
      const context = { userId: '123', action: 'test' };

      logger.info('test message', context);

      expect(mockStdout).toHaveBeenCalledTimes(1);
      const logOutput = mockStdout.mock.calls[0][0] as string;
      const parsed = JSON.parse(logOutput);

      expect(parsed).toHaveProperty('context', context);
    });
  });

  describe('Convenience Methods', () => {
    it('should format request logs correctly in HTTP mode', () => {
      // Mock HTTP mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'http',
        LOG_LEVEL: 'INFO',
      });

      const logger = new Logger('test-service');
      logger.request('GET', '/api/test');

      expect(mockStdout).toHaveBeenCalledTimes(1);
      const logOutput = mockStdout.mock.calls[0][0] as string;
      const parsed = JSON.parse(logOutput);

      expect(parsed.level).toBe('INFO');
      expect(parsed.message).toContain('Request: GET /api/test');
    });

    it('should not write request logs to stdout in stdio mode', () => {
      // Ensure stdio mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'stdio',
        LOG_LEVEL: 'INFO',
      });

      const logger = new Logger('test-service');
      logger.request('GET', '/api/test');

      expect(mockStdout).toHaveBeenCalledTimes(0);
    });

    it('should format response logs correctly in HTTP mode', () => {
      // Mock HTTP mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'http',
        LOG_LEVEL: 'INFO',
      });

      const logger = new Logger('test-service');
      logger.response(200, '/api/test');

      expect(mockStdout).toHaveBeenCalledTimes(1);
      const logOutput = mockStdout.mock.calls[0][0] as string;
      const parsed = JSON.parse(logOutput);

      expect(parsed.level).toBe('INFO');
      expect(parsed.message).toContain('Response: 200 /api/test');
    });

    it('should log error responses as errors in both modes', () => {
      // Test in stdio mode first
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'stdio',
        LOG_LEVEL: 'INFO',
      });

      const logger = new Logger('test-service');
      logger.response(500, '/api/test');

      expect(mockStderr).toHaveBeenCalledTimes(1);
      expect(mockStdout).toHaveBeenCalledTimes(0);
      const logOutput = mockStderr.mock.calls[0][0] as string;
      const parsed = JSON.parse(logOutput);

      expect(parsed.level).toBe('ERROR');
      expect(parsed.message).toContain('Response: 500 /api/test');

      // Reset mocks
      vi.clearAllMocks();

      // Test in HTTP mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'http',
        LOG_LEVEL: 'INFO',
      });

      logger.response(500, '/api/test');

      expect(mockStderr).toHaveBeenCalledTimes(1);
      expect(mockStdout).toHaveBeenCalledTimes(0);
    });

    it('should format retry logs correctly in HTTP mode', () => {
      // Mock HTTP mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'http',
        LOG_LEVEL: 'INFO',
      });

      const logger = new Logger('test-service');
      logger.retry(2, 3, 1000);

      expect(mockStdout).toHaveBeenCalledTimes(1);
      const logOutput = mockStdout.mock.calls[0][0] as string;
      const parsed = JSON.parse(logOutput);

      expect(parsed.level).toBe('WARNING');
      expect(parsed.message).toContain('Retry attempt 2/3 after 1000ms');
    });

    it('should not write retry logs to stdout in stdio mode', () => {
      // Ensure stdio mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'stdio',
        LOG_LEVEL: 'INFO',
      });

      const logger = new Logger('test-service');
      logger.retry(2, 3, 1000);

      expect(mockStdout).toHaveBeenCalledTimes(0);
    });
  });

  describe('Server Connection Behavior', () => {
    // Mock for the MCP server
    let mockMcpServer: MockedMcpServer;

    beforeEach(() => {
      // Create a fresh mock for each test
      mockMcpServer = new McpServer({
        name: 'mock-nutrient-document-engine-mcp',
        version: '0.0.1',
        capabilities: {
          tools: {},
        },
      }) as MockedMcpServer;
      mockMcpServer.server.sendLoggingMessage.mockResolvedValue(undefined);
    });

    it('should write all logs to stderr in stdio mode when server is disconnected', () => {
      // Set server as disconnected
      mockMcpServer.isConnected.mockReturnValue(false);

      // Ensure stdio mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'stdio',
        LOG_LEVEL: 'INFO',
      });

      const logger = new Logger('test-service');
      logger.setMCPServer(mockMcpServer);

      logger.info('info message');
      logger.error('error message');

      // Both logs should go to stderr
      expect(mockStderr).toHaveBeenCalledTimes(2);
      expect(mockStdout).toHaveBeenCalledTimes(0);
      expect(mockMcpServer.server.sendLoggingMessage).not.toHaveBeenCalled();
    });

    it('should only send to server in stdio mode when server is connected', () => {
      // Set server as connected
      mockMcpServer.isConnected.mockReturnValue(true);

      // Ensure stdio mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'stdio',
        LOG_LEVEL: 'INFO',
      });

      const logger = new Logger('test-service');
      logger.setMCPServer(mockMcpServer);

      logger.info('info message');
      logger.error('error message');

      // Only error should go to stderr, info should only go to server
      expect(mockStderr).toHaveBeenCalledTimes(0);
      expect(mockStdout).toHaveBeenCalledTimes(0);
      expect(mockMcpServer.server.sendLoggingMessage).toHaveBeenCalledTimes(2);
    });

    it('should write to both console and server in HTTP mode when server is connected', () => {
      // Set server as connected
      mockMcpServer.isConnected.mockReturnValue(true);

      // Set HTTP mode
      vi.mocked(getEnvironment).mockReturnValue({
        ...defaultEnvironment,
        MCP_TRANSPORT: 'http',
        LOG_LEVEL: 'INFO',
      });

      const logger = new Logger('test-service');
      logger.setMCPServer(mockMcpServer);

      logger.info('info message');
      logger.error('error message');

      // Error to stderr, info to stdout, both to server
      expect(mockStderr).toHaveBeenCalledTimes(1);
      expect(mockStdout).toHaveBeenCalledTimes(1);
      expect(mockMcpServer.server.sendLoggingMessage).toHaveBeenCalledTimes(2);
    });
  });
});
