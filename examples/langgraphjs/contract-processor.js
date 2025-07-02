/**
 * Contract Processing Script
 *
 * This script provides functionality to process contracts for legal review
 * using a ReAct agent and Document Engine MCP Server. It performs the following operations:
 * - Analyzes contract content and type
 * - Extracts key terms, parties, dates, and financial information
 * - Adds review annotations for critical sections
 * - Applies appropriate status watermark
 * - Creates stakeholder-specific versions
 *
 * Usage: node contract-processor.js <path/to/file>
 */

import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { config } from 'dotenv';
import {
  createMCPClient,
  createLLM,
  parseDocumentIds,
  handleAgentStream,
  processCommandLine,
  uploadDocumentWorkflow,
} from './shared/common.js';
import { uploadDocuments, downloadFiles } from './shared/fileHandlers.js';

config();

async function processContract(filePaths) {
  console.log(`📋 Processing contracts for ${filePaths.length} documents...`);

  const documentIds = await uploadDocumentWorkflow(
    filePaths,
    uploadDocuments,
    'Contract processing'
  );

  // Connect to Document Engine MCP Server
  const { tools } = await createMCPClient();

  // Create LLM model
  const llm = createLLM({ model: 'gpt-4.1-mini', temperature: 0.1 });

  // Create ReAct agent with Document Engine tools
  const agent = createReactAgent({
    llm: llm,
    tools: tools,
  }).withConfig({
    recursionLimit: 100,
  });

  // Give agent the contract processing task with streaming
  const systemMessage = `You are a contract processing agent executing in a tool-augmented environment.

Your task: Immediately begin processing contract(s): ${documentIds.join(', ')} for legal review using the provided Document Engine tools.

⚠️ CRITICAL INSTRUCTION: Execute these steps WITHOUT asking questions. DO NOT NARRATE your plan or write summaries. Begin directly with the first tool call. No explanation. No reasoning first. Just take action using tools.

If you output anything other than a tool call, the system will assume your job is finished and terminate.

---

Your workflow:

1. **Comprehensive Contract Intelligence**
   - Analyze contract type, structure, and legal framework
   - Extract all key business terms including parties, obligations, financial terms, and critical dates
   - Identify potential risks, unusual clauses, and areas requiring legal attention
   - Search for and analyze critical legal concepts (termination, liability, confidentiality, etc.)

2. **Legal Review Enhancement**
   - Highlight and annotate all high-risk sections and critical decision points
   - Mark areas requiring specialized legal expertise or immediate attention
   - Document potential compliance issues and regulatory considerations
   - Create comprehensive review notes for legal teams

3. **Professional Document Preparation**
   - Apply appropriate legal review status indicators and watermarks
   - Organize content for optimal legal review workflow
   - Create clear navigation and reference system for complex contract sections

4. **Multi-Audience Versions**
   - Generate versions appropriate for different stakeholders (legal counsel, executives, business teams)
   - Create executive summaries highlighting key business impacts and decisions needed
   - Ensure each version contains appropriate level of detail for its intended audience

---

🚨 Repeat: NO explanations. Start with the first tool call immediately.

✅ When fully complete, output the final result in this exact format:
**FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**

Replace with actual Document Engine IDs.`;

  console.log('🤖 Starting contract processing with ReAct agent...');

  // Stream the agent's execution
  const stream = await agent.stream(
    {
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: 'Please process these contracts for legal review workflow.' },
      ],
    },
    {
      streamMode: 'values',
    }
  );

  const finalResponse = await handleAgentStream(stream);

  console.log('✅ Contract processing complete!');

  const finalDocumentIds = parseDocumentIds(finalResponse);
  console.log('📄 Final Document IDs:', finalDocumentIds);

  return finalDocumentIds;
}

await processCommandLine(async filePaths => {
  const documentIds = await processContract(filePaths);
  await downloadFiles(documentIds);
}, 'Usage: node contract-processor.js <path/to/file>');
