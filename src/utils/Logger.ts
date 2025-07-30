/**
 * MCP-compatible logging utility
 *
 * This logger follows MCP conventions by:
 * 1. Sending log messages to the MCP client via sendLoggingMessage when a server is available
 * 2. Falling back to stderr for server-side output when no MCP server is connected
 * 3. Keeping the main communication channel (stdout) clean for protocol messages
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  LoggingMessageNotification,
  LoggingMessageNotificationSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { getEnvironment } from './Environment.js';

// MCP standard logging levels
type MCPLogLevel = z.infer<typeof LoggingMessageNotificationSchema.shape.params.shape.level>;

const LogLevel: Record<MCPLogLevel, number> = {
  debug: 0,
  info: 1,
  notice: 2,
  warning: 3,
  error: 4,
  critical: 5,
  alert: 6,
  emergency: 7,
};

type TransportType = 'stdio' | 'http' | 'sse';

class Logger {
  private serviceName: string;
  private serverLogLevel: MCPLogLevel;
  private transportType: TransportType;

  /**
   * Constructor for initializing an instance with the specified service name, transport type, and server log level.
   *
   * @param {string} serviceName - The name of the service.
   * @param {TransportType} [transportType="stdio"] - The transport type for the server.
   * @param {MCPLogLevel} [serverLogLevel="info"] - The logging level for the server (this is different from client log level. Defaults to "info" if not specified.
   * @return {void}
   */
  constructor(
    serviceName: string,
    transportType: TransportType = 'stdio',
    serverLogLevel: MCPLogLevel = 'info'
  ) {
    this.serviceName = serviceName;
    this.transportType = transportType;
    this.serverLogLevel = serverLogLevel;
  }

  private shouldServerLog(logLevel: MCPLogLevel) {
    return LogLevel[this.serverLogLevel] <= LogLevel[logLevel];
  }

  private formatLogEntry(level: string, message: string, context?: unknown): string {
    let log = `[${level.toUpperCase()}] - (${this.serviceName}) - ${new Date().toISOString()} : ${message}`;
    if (context !== undefined) {
      log += ` ${JSON.stringify(context)}`;
    }
    return log;
  }

  writeLog(logLevel: MCPLogLevel, mcpServer: McpServer | null, message: string, context?: unknown) {
    const isServerConnected = mcpServer?.isConnected();
    const isStdIOMode = this.transportType === 'stdio';

    // Send to server notifications when connected
    if (isServerConnected) {
      const params: LoggingMessageNotification['params'] = {
        level: logLevel,
        data: `[${this.serviceName}] ${message}`,
      };

      try {
        mcpServer!.server.sendLoggingMessage(params);
      } catch {
        // Fall through to console fallback if notification fails
      }
    }

    if (this.shouldServerLog(logLevel)) {
      const logLine = this.formatLogEntry(logLevel, message, context);
      // Console output handling based on mode and connection status
      if (isStdIOMode) {
        process.stderr.write(logLine + '\n');
      } else {
        // HTTP mode: write to stderr for errors, stdout for other log levels
        if (['warning', 'error', 'critical', 'alert', 'emergency'].includes(logLevel)) {
          process.stderr.write(logLine + '\n');
        } else {
          process.stdout.write(logLine + '\n');
        }
      }
    }
  }

  // Tier 1 convenience methods
  debug(mcpServer: McpServer | null, message: string, context?: unknown) {
    this.writeLog('debug', mcpServer, message, context);
  }

  info(mcpServer: McpServer | null, message: string, context?: unknown) {
    this.writeLog('info', mcpServer, message, context);
  }

  notice(mcpServer: McpServer | null, message: string, context?: unknown) {
    this.writeLog('notice', mcpServer, message, context);
  }

  warning(mcpServer: McpServer | null, message: string, context?: unknown) {
    this.writeLog('warning', mcpServer, message, context);
  }

  error(mcpServer: McpServer | null, message: string, context?: unknown) {
    this.writeLog('error', mcpServer, message, context);
  }

  critical(mcpServer: McpServer | null, message: string, context?: unknown) {
    this.writeLog('critical', mcpServer, message, context);
  }

  alert(mcpServer: McpServer | null, message: string, context?: unknown) {
    this.writeLog('alert', mcpServer, message, context);
  }

  emergency(mcpServer: McpServer | null, message: string, context?: unknown) {
    this.writeLog('emergency', mcpServer, message, context);
  }

  // Tier 2 convenience methods
  request(mcpServer: McpServer | null, method: string, url: string, context?: unknown): void {
    const message = `Request: ${method?.toUpperCase()} ${url}`;
    if (this.serverLogLevel === 'debug') {
      this.debug(mcpServer, message, context);
    } else {
      this.info(mcpServer, message);
    }
  }

  response(mcpServer: McpServer | null, status: number, url: string, context?: unknown): void {
    const message = `Response: ${status} ${url}`;

    if (status >= 400) {
      this.error(mcpServer, message, context);
    } else if (this.serverLogLevel === 'debug') {
      this.debug(mcpServer, message, context);
    } else {
      this.info(mcpServer, message);
    }
  }

  retry(
    mcpServer: McpServer | null,
    attempt: number,
    maxRetries: number,
    delay: number,
    context?: unknown
  ): void {
    this.warning(mcpServer, `Retry attempt ${attempt}/${maxRetries} after ${delay}ms`, context);
  }
}
const env = getEnvironment();
// Create a singleton logger instance
export const logger = new Logger('document-engine-mcp', env.MCP_TRANSPORT, env.LOG_LEVEL);

// Export the Logger class for testing
export { Logger };
