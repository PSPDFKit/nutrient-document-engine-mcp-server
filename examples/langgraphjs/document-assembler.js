/**
 * Document Assembly Script
 *
 * This script provides functionality to assemble multiple documents into a professional final document
 * using a ReAct agent and Document Engine MCP Server. It performs the following operations:
 * - Uploads input documents to the Document Engine
 * - Uses an AI agent to analyze and organize document content
 * - Adds professional annotations and headers
 * - Applies watermarks
 * - Creates different versions for stakeholders as needed
 * - Returns and downloads the assembled document IDs
 *
 * Usage: node document-assembler.js <path/to/file1> <path/to/file2> ...
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

async function assembleDocuments(filePaths) {
  console.log(`🔗 Starting upload and assembly of ${filePaths.length} documents...`);

  const documentIds = await uploadDocumentWorkflow(filePaths, uploadDocuments, 'Assembly');

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

  // Give agent the assembly task with streaming
  const systemMessage = `You are a document assembly agent executing in a tool-augmented environment.

Your task: Immediately begin assembling document(s): ${documentIds.join(', ')} into a professional final document using the provided Document Engine tools.

⚠️ CRITICAL INSTRUCTION: Execute these steps WITHOUT asking questions. DO NOT NARRATE your plan or write summaries. Begin directly with the first tool call. No explanation. No reasoning first. Just take action using tools.

If you output anything other than a tool call, the system will assume your job is finished and terminate.

---

Your workflow:

1. **Intelligent Content Analysis**
   - Analyze each source document's purpose, content type, and key information
   - Understand document relationships and dependencies
   - Identify optimal assembly sequence for logical flow and maximum impact

2. **Professional Document Architecture**
   - Create cohesive document structure with clear hierarchy and navigation
   - Establish seamless transitions between different source materials
   - Ensure content flow supports the overall document objectives

3. **Enhanced Presentation**
   - Add professional annotations, headers, and organizational elements
   - Apply consistent formatting and visual hierarchy throughout
   - Create clear section delineations and reference systems for easy navigation

4. **Quality and Branding**
   - Apply appropriate branding, watermarks, and professional presentation standards
   - Ensure document meets corporate or organizational style requirements
   - Validate overall document coherence and professional appearance

5. **Targeted Distribution Versions**
   - Generate versions optimized for different audiences and use cases
   - Create appropriate access levels while maintaining document integrity
   - Ensure each version serves its intended purpose effectively

---

🚨 Repeat: NO explanations. Start with the first tool call immediately.

✅ When fully complete, output the final result in this exact format:
**FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**

Replace with actual Document Engine IDs.`;

  console.log('🤖 Starting document assembly with ReAct agent...');

  // Stream the agent's execution
  const stream = await agent.stream(
    {
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: 'Please assemble these documents now.' },
      ],
    },
    {
      streamMode: 'values',
    }
  );

  const finalResponse = await handleAgentStream(stream);

  console.log('✅ Assembly complete!');

  const finalDocumentIds = parseDocumentIds(finalResponse);
  console.log('📄 Final Document IDs:', finalDocumentIds);

  return finalDocumentIds;
}

await processCommandLine(async filePaths => {
  const documentIds = await assembleDocuments(filePaths);
  await downloadFiles(documentIds);
}, 'Usage: node document-assembler.js <path/to/file1> <path/to/file2> <path/to/file3>');
