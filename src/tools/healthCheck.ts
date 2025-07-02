import { getEnvironment } from '../utils/Environment.js';
import { DocumentEngineClient } from '../api/Client.js';
import { hostname } from 'node:os';
import { MCPToolOutput } from '../mcpTools.js';

/**
 * Schema for health_check tool
 */
export const HealthCheckSchema = {};

/**
 * Performs a health check on the Document Engine MCP server
 * @param client The Document Engine client instance
 * @returns A markdown string with health check results
 */
export async function healthCheck(client: DocumentEngineClient): Promise<MCPToolOutput> {
  const startTime = Date.now();
  const env = getEnvironment();

  // Server information
  const serverInfo = {
    status: 'operational',
    version: process.env.npm_package_version || 'unknown',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  };

  // Check Document Engine API connection
  let apiStatus = 'operational';
  let apiError = null;

  try {
    // Make a simple request to Document Engine API to check connectivity
    await client.get('/healthcheck');
  } catch (error) {
    apiStatus = 'error';
    apiError = error instanceof Error ? error.message : String(error);
    serverInfo.status = 'degraded';
  }

  // Format response as markdown
  const responseTime = Date.now() - startTime;

  let markdown = `# Health Check Results\n\n`;
  markdown += `## Overall Status\n\n`;
  markdown += `- **Status**: ${serverInfo.status === 'operational' ? '✅ Operational' : '⚠️ Degraded'}\n`;
  markdown += `- **Response Time**: ${responseTime}ms\n\n`;

  markdown += `## Component Status\n\n`;
  markdown += `- **MCP Server**: ✅ Operational\n`;
  markdown += `- **Document Engine API**: ${apiStatus === 'operational' ? '✅ Operational' : '❌ Error'}\n`;
  if (apiError) {
    markdown += `  - Error: ${apiError}\n`;
  }

  markdown += `\n## Server Information\n\n`;
  markdown += `- **Version**: ${serverInfo.version}\n`;
  markdown += `- **Environment**: ${serverInfo.environment}\n`;
  markdown += `- **Uptime**: ${formatUptime(serverInfo.uptime)}\n`;
  markdown += `- **Timestamp**: ${serverInfo.timestamp}\n`;

  markdown += `\n## Configuration\n\n`;
  markdown += `- **Document Engine URL**: ${maskUrl(env.DOCUMENT_ENGINE_BASE_URL)}\n`;
  markdown += `- **Connection Timeout**: ${env.CONNECTION_TIMEOUT}ms\n`;
  markdown += `- **Max Retries**: ${env.MAX_RETRIES}\n`;
  markdown += `- **Retry Delay**: ${env.RETRY_DELAY}ms\n`;
  markdown += `- **Max Connections**: ${env.MAX_CONNECTIONS}\n`;
  markdown += `- **Log Level**: ${env.LOG_LEVEL}\n`;
  markdown += `- **MCP Transport**: ${env.MCP_TRANSPORT}\n`;

  if (env.MCP_TRANSPORT === 'http') {
    markdown += `- **MCP Port**: ${env.PORT}\n`;
    markdown += `- **MCP Host**: ${hostname()}\n`;
  }

  return { markdown };
}

/**
 * Formats uptime in a human-readable format
 */
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
}

/**
 * Masks sensitive parts of URLs for security
 */
function maskUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}`;
  } catch {
    return url;
  }
}
