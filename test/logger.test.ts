import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { Logger } from '../src/utils/Logger.js';

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

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

interface MockedMcpServer extends McpServer {
  isConnected: Mock;
  server: McpServer['server'] & {
    sendLoggingMessage: Mock;
  };
}

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
      const logger = new Logger('test-service', 'stdio', 'error');
      logger.debug(null, 'debug message');
      logger.info(null, 'info message');
      logger.warning(null, 'warn message');
      logger.error(null, 'error message');

      // Only error should be logged to stderr, nothing to stdout in stdio mode
      expect(mockStderr).toHaveBeenCalledTimes(1);
      expect(mockStdout).toHaveBeenCalledTimes(0);
      expect(mockStderr.mock.calls[0][0]).toContain('ERROR');
      expect(mockStderr.mock.calls[0][0]).toContain('error message');
    });

    it('should log all levels when set to DEBUG in HTTP mode', () => {
      const logger = new Logger('test-service', 'http', 'debug');

      logger.debug(null, 'debug message');
      logger.info(null, 'info message');
      logger.warning(null, 'warn message');
      logger.error(null, 'error message');

      // Error goes to stderr, others to stdout in HTTP mode
      expect(mockStderr).toHaveBeenCalledTimes(2);
      expect(mockStdout).toHaveBeenCalledTimes(2);
    });

    it('should log all messages to stderr in stdio mode when set to DEBUG', () => {
      const logger = new Logger('test-service', 'stdio', 'debug');

      logger.debug(null, 'debug message');
      logger.info(null, 'info message');
      logger.warning(null, 'warn message');
      logger.error(null, 'error message');

      // Only error should be logged to stderr, nothing to stdout in stdio mode
      expect(mockStderr).toHaveBeenCalledTimes(4);
      expect(mockStdout).toHaveBeenCalledTimes(0);
    });
  });

  describe('Log Format', () => {
    it('should format log entries', () => {
      const logger = new Logger('test-service', 'http');
      logger.info(null, 'test message');

      expect(mockStdout).toHaveBeenCalledTimes(1);
      const logOutput = mockStdout.mock.calls[0][0] as string;

      expect(logOutput).toContain('[INFO]');
      expect(logOutput).toContain('(test-service)');
      expect(logOutput).toContain(new Date().toISOString().slice(0, -8)); // Don't check seconds
      expect(logOutput).toContain('test message');
    });

    it('should include context', () => {
      const logger = new Logger('test-service', 'http');
      const context = { userId: '123', action: 'test' };

      logger.info(null, 'test message', context);

      expect(mockStdout).toHaveBeenCalledTimes(1);
      const logOutput = mockStdout.mock.calls[0][0] as string;

      expect(logOutput).toContain(JSON.stringify(context));
    });
  });

  describe('Convenience Methods', () => {
    it('should format request logs correctly in HTTP mode', () => {
      const logger = new Logger('test-service', 'http');
      logger.request(null, 'GET', '/api/test');

      expect(mockStdout).toHaveBeenCalledTimes(1);
      const logOutput = mockStdout.mock.calls[0][0] as string;

      expect(logOutput).toContain('INFO');
      expect(logOutput).toContain('Request: GET /api/test');
    });

    it('should format response logs correctly in HTTP mode', () => {
      const logger = new Logger('test-service', 'http');
      logger.response(null, 200, '/api/test');

      expect(mockStdout).toHaveBeenCalledTimes(1);
      const logOutput = mockStdout.mock.calls[0][0] as string;

      expect(logOutput).toContain('INFO');
      expect(logOutput).toContain('Response: 200 /api/test');
    });

    it('should log error responses as errors in HTTP mode', () => {
      const logger = new Logger('test-service', 'http');
      logger.response(null, 500, '/api/test');

      expect(mockStderr).toHaveBeenCalledTimes(1);
      expect(mockStdout).toHaveBeenCalledTimes(0);
      const logOutput = mockStderr.mock.calls[0][0] as string;

      expect(logOutput).toContain('ERROR');
      expect(logOutput).toContain('Response: 500 /api/test');
    });

    it('should format retry logs correctly in HTTP mode', () => {
      const logger = new Logger('test-service', 'http');
      logger.retry(null, 2, 3, 1000);

      expect(mockStderr).toHaveBeenCalledTimes(1);
      const logOutput = mockStderr.mock.calls[0][0] as string;

      expect(logOutput).toContain('WARNING');
      expect(logOutput).toContain('Retry attempt 2/3 after 1000ms');
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
          logging: {},
        },
      }) as MockedMcpServer;
      mockMcpServer.server.sendLoggingMessage.mockResolvedValue(undefined);
    });

    it('should write all logs to stderr in stdio mode when server is disconnected', () => {
      // Set server as disconnected
      mockMcpServer.isConnected.mockReturnValue(false);

      const logger = new Logger('test-service');

      logger.info(mockMcpServer, 'info message');
      logger.error(mockMcpServer, 'error message');

      // Both logs should go to stderr
      expect(mockStderr).toHaveBeenCalledTimes(2);
      expect(mockStdout).toHaveBeenCalledTimes(0);
      expect(mockMcpServer.server.sendLoggingMessage).not.toHaveBeenCalled();
    });

    it('should only send to server in stdio mode when server is connected', () => {
      // Set server as connected
      mockMcpServer.isConnected.mockReturnValue(true);

      const logger = new Logger('test-service');

      logger.info(mockMcpServer, 'info message');
      logger.error(mockMcpServer, 'error message');

      // Only error should go to stderr, info should only go to server
      expect(mockStderr).toHaveBeenCalledTimes(2);
      expect(mockStdout).toHaveBeenCalledTimes(0);
      expect(mockMcpServer.server.sendLoggingMessage).toHaveBeenCalledTimes(2);
    });

    it('should write to both console and server in HTTP mode when server is connected', () => {
      // Set server as connected
      mockMcpServer.isConnected.mockReturnValue(true);

      const logger = new Logger('test-service', 'http');

      logger.info(mockMcpServer, 'info message');
      logger.error(mockMcpServer, 'error message');

      // Error to stderr, info to stdout, both to server
      expect(mockStderr).toHaveBeenCalledTimes(1);
      expect(mockStdout).toHaveBeenCalledTimes(1);
      expect(mockMcpServer.server.sendLoggingMessage).toHaveBeenCalledTimes(2);
    });
  });
});
