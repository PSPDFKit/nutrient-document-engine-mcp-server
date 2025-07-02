import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import { isAIMessage, isAIMessageChunk } from '@langchain/core/messages';

/**
 * Creates and initializes an MCP client for Document Engine
 * @param {Object} options - Configuration options
 * @param {string} options.serverUrl - MCP server URL (default: http://localhost:5100/mcp)
 * @returns {Promise<{tools: Array}>} - MCP client and available tools
 */
export async function createMCPClient(options = {}) {
  const { serverUrl = process.env.MCP_SERVER_URL || 'http://localhost:5100/mcp' } = options;

  const mcpClient = new MultiServerMCPClient({
    mcpServers: {
      documentEngine: {
        transport: 'http',
        url: serverUrl,
      },
    },
  });

  const tools = await mcpClient.getTools();

  return { tools };
}

/**
 * Creates a ChatOpenAI model instance with common configuration
 * @param {Object} options - Model configuration options
 * @param {string} options.model - Model name (default: gpt-4-1106-preview)
 * @param {number} options.temperature - Temperature setting (default: 0.1)
 * @returns {ChatOpenAI} - Configured ChatOpenAI instance
 */
export function createLLM(options = {}) {
  return new ChatOpenAI(options);
}

/**
 * Parses document IDs from agent response content
 * @param {Object} response - Agent response object
 * @returns {Array<string>} - Array of parsed document IDs
 */
export function parseDocumentIds(response) {
  if (!response?.content) return [];

  const content =
    typeof response.content === 'string' ? response.content : response.content.toString();

  // Look for patterns like:
  // **FINAL_DOCUMENT_IDS: ["id1", "id2"]**
  // FINAL_DOCUMENT_IDS: [id1, id2]
  // **FINAL_DOCUMENT_IDS: [id1, id2]**
  const patterns = [
    /\*\*FINAL_DOCUMENT_IDS:\s*\[([^\]]+)\]\*\*/,
    /FINAL_DOCUMENT_IDS:\s*\[([^\]]+)\]/,
    /FINAL_DOCUMENTS_IDS:\s*\[([^\]]+)\]/  // Handle typo variant
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
 * Handles streaming responses from agents with consistent logging
 * @param {AsyncIterable} stream - The agent stream to process
 * @returns {Promise<Object>} - The final response message
 */
export async function handleAgentStream(stream) {
  let finalResponse = null;

  for await (const { messages } of stream) {
    const lastMessage = messages[messages?.length - 1];
    if (
      (isAIMessage(lastMessage) || isAIMessageChunk(lastMessage)) &&
      lastMessage?.content &&
      lastMessage?.content.length > 0
    ) {
      console.log(lastMessage.content);
      console.log('-----');
    }
    finalResponse = lastMessage;
  }

  return finalResponse;
}

/**
 * Generic command line processor for examples
 * @param {Function} processFunction - The main processing function to run
 * @param {string} usageMessage - Usage message to display when no args provided
 * @param {number} minArgs - Minimum number of arguments required (default: 1)
 */
export async function processCommandLine(processFunction, usageMessage, minArgs = 1) {
  const args = process.argv.slice(2);

  if (args.length < minArgs) {
    console.log(usageMessage);
    process.exit(1);
  }

  try {
    await processFunction(args);
    process.exit(0);
  } catch (error) {
    console.error('Error during processing:', error);
    process.exit(1);
  }
}

/**
 * Standard document upload workflow with error handling
 * @param {Array<string>} filePaths - Array of file paths to upload
 * @param {Function} uploadFunction - The upload function from fileHandlers
 * @param {string} processName - Name of the process for logging
 * @returns {Promise<Array<string>>} - Array of uploaded document IDs
 */
export async function uploadDocumentWorkflow(filePaths, uploadFunction, processName = 'process') {
  const documentIds = await uploadFunction(filePaths);

  if (documentIds.length === 0) {
    throw new Error(`No documents were successfully uploaded. ${processName} cannot proceed.`);
  }

  console.log(`✅ Uploaded ${documentIds.length} documents. Starting ${processName}...`);
  return documentIds;
}
