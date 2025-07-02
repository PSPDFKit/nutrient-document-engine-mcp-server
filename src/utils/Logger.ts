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
import * as process from 'node:process';

export enum LogLevel {
  ERROR = 0,
  WARNING = 1,
  INFO = 2,
  DEBUG = 3,
}

// MCP standard logging levels
type MCPLogLevel = z.infer<typeof LoggingMessageNotificationSchema.shape.params.shape.level>;

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Context can be any type of metadata
  context?: any;
}

class Logger {
  private logLevel: LogLevel;
  private serviceName: string;
  private mcpServer: McpServer | null = null;

  constructor(serviceName: string = 'document-engine-mcp') {
    this.serviceName = serviceName;

    // Parse log level from validated environment
    try {
      const env = getEnvironment();
      switch (env.LOG_LEVEL) {
        case 'ERROR':
          this.logLevel = LogLevel.ERROR;
          break;
        case 'WARN':
        case 'WARNING':
          this.logLevel = LogLevel.WARNING;
          break;
        case 'INFO':
          this.logLevel = LogLevel.INFO;
          break;
        case 'DEBUG':
          this.logLevel = LogLevel.DEBUG;
          break;
        default:
          this.logLevel = LogLevel.INFO;
      }
    } catch {
      // If environment validation fails, use default log level
      this.logLevel = LogLevel.INFO;
    }
  }

  /**
   * Set the MCP server instance to enable client logging
   */
  setMCPServer(server: McpServer | null): void {
    this.mcpServer = server;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Context can be any type of metadata
  private formatLogEntry(level: string, message: string, context?: any): string {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message: `[${this.serviceName}] ${message}`,
    };

    if (context !== undefined) {
      entry.context = context;
    }

    return JSON.stringify(entry);
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private writeLog(
    level: MCPLogLevel,
    stderrLevel: string,
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Context can be any type of metadata
    context?: any
  ): void {
    const logLine = this.formatLogEntry(stderrLevel, message, context);
    const env = getEnvironment();
    const isServerConnected = this.mcpServer?.isConnected();
    const isStdIOMode = env.MCP_TRANSPORT === 'stdio';

    // Send to server notifications when connected
    if (isServerConnected) {
      const params: LoggingMessageNotification['params'] = {
        level,
        data: `[${this.serviceName}] ${message}`,
      };

      try {
        this.mcpServer!.server.sendLoggingMessage(params);
      } catch {
        // Fall through to console fallback if notification fails
      }
    }

    // Console output handling based on mode and connection status
    if (isStdIOMode) {
      if (!isServerConnected) {
        process.stderr.write(logLine + '\n');
      }
    } else {
      // HTTP mode: write to stderr for errors, stdout for other log levels
      if (level === 'error') {
        process.stderr.write(logLine + '\n');
      } else {
        process.stdout.write(logLine + '\n');
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Context can be any type of metadata
  error(message: string, context?: any): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    this.writeLog('error', 'ERROR', message, context);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Context can be any type of metadata
  warn(message: string, context?: any): void {
    if (this.shouldLog(LogLevel.WARNING)) {
      this.writeLog('warning', 'WARNING', message, context);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Context can be any type of metadata
  info(message: string, context?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.writeLog('info', 'INFO', message, context);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Context can be any type of metadata
  debug(message: string, context?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.writeLog('debug', 'DEBUG', message, context);
    }
  }

  // Convenience methods for common logging patterns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Context can be any type of metadata
  request(method: string, url: string, context?: any): void {
    this.info(`Request: ${method?.toUpperCase()} ${url}`, context);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Context can be any type of metadata
  response(status: number, url: string, context?: any): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const message = `Response: ${status} ${url}`;

    if (level === LogLevel.ERROR) {
      this.error(message, context);
    } else {
      this.info(message, context);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Context can be any type of metadata
  retry(attempt: number, maxRetries: number, delay: number, context?: any): void {
    this.warn(`Retry attempt ${attempt}/${maxRetries} after ${delay}ms`, context);
  }
}

// Create a singleton logger instance
export const logger = new Logger();

// Export the Logger class for testing
export { Logger };
