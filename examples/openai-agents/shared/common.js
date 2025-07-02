import { Agent, MCPServerStreamableHttp, run } from '@openai/agents';
import 'dotenv/config';

/**
 * Creates an MCP server connection for Document Engine
 */
export async function createMCPServer() {
  const mcpServer = new MCPServerStreamableHttp({
    url: process.env.MCP_SERVER_URL || 'http://localhost:5100/mcp',
  });

  await mcpServer.connect();
  return mcpServer;
}

/**
 * Parses document IDs from agent response content
 * @param {Object} response - Agent response object
 * @returns {Array<string>} - Array of parsed document IDs
 */
export function parseDocumentIds(response) {
  const content =
    typeof response === 'string' ? response : response.toString();

  // Look for patterns like:
  // **FINAL_DOCUMENT_IDS: ["id1", "id2"]**
  // FINAL_DOCUMENT_IDS: [id1, id2]
  // FINAL_DOCUMENTS_IDS: [id1, id2]
  // **FINAL_DOCUMENT_IDS: [id1, id2]**
  // **FINAL_DOCUMENTS_IDS: [id1, id2]**
  const patterns = [
    /\*\*FINAL_DOCUMENT_IDS:\s*\[([^\]]+)]\*\*/,
    /FINAL_DOCUMENT_IDS:\s*\[([^\]]+)]/,
    /FINAL_DOCUMENTS_IDS:\s*\[([^\]]+)]/  // Handle typo variant
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1]
        .split(',')
        .map(id => id.trim().replace(/['"]/g, '')) // Remove quotes
        .filter(id => id.length > 0);
    }
  }

  return [];
}
/**
 * Handles agent execution and results
 */
export async function handleAgentRun(agent, prompt, options = {}) {
  console.log(`\n🤖 Running agent: ${agent.name || 'Unnamed Agent'}`);
  console.log(`📝 Prompt: ${prompt}`);

  const startTime = Date.now();

  try {
    const result = await run(agent, prompt, {
      maxTurns: 100,
      ...options
    });
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log(`✅ Agent completed in ${duration}s`);
    console.log(`📄 Final output: ${result.finalOutput}`);

    return result;
  } catch (error) {
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.error(`❌ Agent failed after ${duration}s:`, error.message);
    throw error;
  }
}

/**
 * Generic command line processing
 */
export function processCommandLine(args, defaultFiles = []) {
  const files = args.slice(2);

  if (files.length === 0 && defaultFiles.length > 0) {
    console.log(`No files provided, using default files: ${defaultFiles.join(', ')}`);
    return defaultFiles;
  }

  if (files.length === 0) {
    console.error('Please provide file paths as arguments');
    process.exit(1);
  }

  return files;
}

/**
 * Creates a specialized agent with handoffs
 * WARNING: This function creates an MCP server but doesn't handle cleanup.
 * Consider using runAgentWithMCP() for automatic lifecycle management.
 */
export async function createSpecializedAgent(config, handoffAgents = []) {
  const mcpServer = await createMCPServer();

  return new Agent({
    model: 'gpt-4.1-mini',
    temperature: 0.1,
    mcpServers: [mcpServer],
    handoffs: handoffAgents,
    ...config
  });
}

/**
 * Closes MCP servers associated with an agent
 * Use this function to properly cleanup MCP servers when using createAgent() or createSpecializedAgent()
 */
export async function closeMCPServers(agent) {
  if (agent.mcpServers && Array.isArray(agent.mcpServers)) {
    for (const server of agent.mcpServers) {
      try {
        await server.close();
      } catch (error) {
        console.error('Error closing MCP server:', error);
      }
    }
  }
}

/**
 * Validation helper for required environment variables
 */
export function validateEnvironment() {
  const required = ['OPENAI_API_KEY'];
  const missing = required.filter(env => !process.env[env]);

  if (missing.length > 0) {
    console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
    console.error('Please create a .env file with the required variables.');
    process.exit(1);
  }

  console.log('✅ Environment validation passed');
}
