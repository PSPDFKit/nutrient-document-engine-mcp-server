#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';
import express from 'express';
import { randomUUID } from 'node:crypto';
import { getEnvironment, validateEnvironment } from './utils/Environment.js';
import { getDocumentEngineClient } from './api/ClientFactory.js';
import { logger } from './utils/Logger.js';
import { mcpToolsToRegister } from './mcpTools.js';
import { healthCheck } from './tools/healthCheck.js';
import { createDashboardRouter } from './dashboard/index.js';
import { DocumentEngineClient } from './api/Client.js';
import { getVersion } from './version.js';

dotenv.config();

// Validate environment variables at startup (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  try {
    validateEnvironment();
  } catch (error) {
    console.error('Environment validation failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

/**
 * Polls the Document Engine API until it's ready
 * @returns Promise that resolves with the client when ready
 */
async function waitForDocumentEngine(): Promise<DocumentEngineClient> {
  const env = getEnvironment();
  const maxRetries = env.DOCUMENT_ENGINE_POLL_MAX_RETRIES;
  const retryDelay = env.DOCUMENT_ENGINE_POLL_RETRY_DELAY;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      logger.info(
        `Attempting to connect to Document Engine (attempt ${attempts + 1}/${maxRetries})`
      );
      const client = await getDocumentEngineClient();

      // Test the connection with a health check
      await client.get('/healthcheck');

      logger.info('Document Engine is ready! Connection established successfully.');
      return client;
    } catch (error) {
      attempts++;
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (attempts >= maxRetries) {
        logger.error(
          `Failed to connect to Document Engine after ${maxRetries} attempts. Last error: ${errorMessage}`
        );
        throw new Error(
          `Document Engine connection failed after ${maxRetries} attempts: ${errorMessage}`
        );
      }

      logger.warn(
        `Document Engine not ready yet (attempt ${attempts}/${maxRetries}): ${errorMessage}. Retrying in ${retryDelay}ms...`
      );
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw new Error('Unexpected error in waitForDocumentEngine');
}

const client = await waitForDocumentEngine();

function createMCPServer(): McpServer {
  const server = new McpServer(
    {
      name: 'nutrient-document-engine-mcp',
      version: getVersion(),
    },
    {
      capabilities: {
        tools: {},
        logging: {},
      },
    }
  );

  // Configure all tools
  configureMCPServerTools(server);

  return server;
}

function configureMCPServerTools(server: McpServer): void {
  for (const tool of mcpToolsToRegister) {
    server.tool(tool.name, tool.schema, (args, extra) => tool.handler(client, args, extra));
  }
}

function createExpressApp(enableDashboard: boolean = false): express.Application {
  const app = express();
  app.use(express.json());

  // Health check endpoint
  app.get('/health', async (req, res) => {
    try {
      // Perform health check
      const healthCheckResult = await healthCheck(client);

      // Check if Document Engine API is operational
      const isHealthy = !healthCheckResult.markdown.includes('❌ Error');

      // Return appropriate status code based on health check result
      if (isHealthy) {
        res.status(200).json({
          status: 'operational',
          message: 'All systems operational',
        });
      } else {
        res.status(503).json({
          status: 'degraded',
          message: 'Document Engine API connection error',
        });
      }
    } catch (error) {
      logger.error('Health check endpoint error', { error });
      res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Mount dashboard routes only if enabled
  if (enableDashboard) {
    app.use('/dashboard', createDashboardRouter(client));
  }

  return app;
}

async function startStdioServer() {
  const env = getEnvironment();
  const dashboardEnabled = !!(env.DASHBOARD_USERNAME && env.DASHBOARD_PASSWORD);

  if (dashboardEnabled) {
    // Start Express server for dashboard
    const app = createExpressApp(true);

    // Start HTTP server for dashboard
    app.listen(env.PORT, env.MCP_HOST, () => {
      logger.info(`Dashboard server running on HTTP at ${env.MCP_HOST}:${env.PORT}/dashboard`);
    });
  }

  // Start MCP server on stdio
  const server = createMCPServer();
  const transport = new StdioServerTransport();

  // Error handling
  process.on('SIGINT', async () => {
    await server.close();
    process.exit(0);
  });

  await server.connect(transport);
  logger.setMCPServer(server);
  logger.info(`Nutrient Document Engine MCP server ${getVersion()} running on stdio`);
}

async function startHttpServer() {
  const env = getEnvironment();
  const dashboardEnabled = !!(env.DASHBOARD_USERNAME && env.DASHBOARD_PASSWORD);
  const app = createExpressApp(dashboardEnabled);

  // Map to store transports by session ID
  const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

  // Handle POST requests for client-to-server communication
  app.post('/mcp', async (req, res) => {
    try {
      // Check for existing session ID
      const sessionId = req.headers['mcp-session-id'] as string | undefined;
      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports[sessionId]) {
        // Reuse existing transport
        transport = transports[sessionId];
      } else if (!sessionId && isInitializeRequest(req.body)) {
        // New initialization request
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: sessionId => {
            // Store the transport by session ID
            transports[sessionId] = transport;
          },
        });

        // Clean up transport when closed
        transport.onclose = () => {
          if (transport.sessionId) {
            delete transports[transport.sessionId];
          }
        };

        const server = createMCPServer();
        await server.connect(transport);
        logger.setMCPServer(server);
      } else {
        // Invalid request
        res.status(400).json({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Bad Request: No valid session ID provided',
          },
          id: null,
        });
        return;
      }

      // Handle the request
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      logger.error('Error handling MCP request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    }
  });

  // Reusable handler for GET and DELETE requests
  const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send('Invalid or missing session ID');
      return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
  };

  // Handle GET requests for server-to-client notifications via SSE
  app.get('/mcp', handleSessionRequest);

  // Handle DELETE requests for session termination
  app.delete('/mcp', handleSessionRequest);

  // Error handling
  process.on('SIGINT', () => {
    process.exit(0);
  });

  app.listen(env.PORT, env.MCP_HOST, () => {
    logger.info(
      `Nutrient Document Engine MCP server ${getVersion()} running on HTTP at ${env.MCP_HOST}:${env.PORT}/mcp`
    );
    if (dashboardEnabled) {
      logger.info(`Dashboard server running on HTTP at ${env.MCP_HOST}:${env.PORT}/dashboard`);
    }
  });
}

async function main() {
  const env = getEnvironment();

  if (env.MCP_TRANSPORT === 'http') {
    await startHttpServer();
  } else {
    await startStdioServer();
  }
}

main().catch(error => {
  logger.error('Failed to start server', { error: error.message, stack: error.stack });
  process.exit(1);
});
