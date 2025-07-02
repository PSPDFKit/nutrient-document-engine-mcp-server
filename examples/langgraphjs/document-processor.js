/**
 * Document Compliance Processor
 *
 * This script provides functionality for autonomous regulatory monitoring of documents
 * using a ReAct agent and Document Engine MCP Server. It performs the following operations:
 * - Scans documents for regulatory adherence
 * - Automatically applies redactions for sensitive data
 * - Creates audit trails
 * - Generates compliance reports
 * - Monitors document repositories for policy violations
 * - Applies protective measures
 * - Maintains comprehensive compliance documentation
 *
 * Usage: node document-processor.js <path/to/file>
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

async function processCompliance(filePaths) {
  console.log(`🛡️ Starting compliance processing for ${filePaths.length} documents...`);

  const documentIds = await uploadDocumentWorkflow(
    filePaths,
    uploadDocuments,
    'Compliance processing'
  );

  // Connect to Document Engine MCP Server
  const { tools } = await createMCPClient();

  // Create LLM model
  const llm = createLLM({ model: 'gpt-4.1-mini', temperature: 0 });

  // Create ReAct agent with Document Engine tools
  const agent = createReactAgent({
    llm: llm,
    tools: tools,
  }).withConfig({
    recursionLimit: 100,
  });

  // Give agent the compliance processing task with streaming
  const systemMessage = `You are a compliance monitoring agent executing in a tool-augmented environment.

Your task: Immediately begin scanning document(s): ${documentIds.join(', ')} for regulatory compliance issues using the provided Document Engine tools.

⚠️ CRITICAL INSTRUCTION: DO NOT NARRATE your plan or write summaries. Begin directly with the first tool call. No explanation. No reasoning first. Just take action using tools.

If you output anything other than a tool call, the system will assume your job is finished and terminate.

---

Your workflow:

1. **Comprehensive PII Protection**
   - Identify and redact ALL types of personally identifiable information including:
     * First, Middle and last names
     * Identity numbers (SSN, driver's license, passport, etc.)
     * Financial information (credit cards, bank accounts, etc.) 
     * Contact details (names, addresses, phone numbers, emails)
     * Location data (addresses, ZIP codes, coordinates)
     * Tax related numbers
     * Dates and times that could identify individuals
     * Any other sensitive personal data

2. **Document Security Enhancement**
   - Apply appropriate confidentiality classifications and watermarks
   - Add compliance annotations documenting protection measures taken
   - Create comprehensive audit trail of all security actions

3. **Multi-Stakeholder Versions**
   - Generate appropriately redacted versions for different access levels
   - Ensure sensitive data is properly protected while maintaining document utility
   - Create versions suitable for public disclosure, internal review, and audit purposes

4. **Compliance Verification**
   - Ensure all regulatory requirements are met (GDPR, CCPA, HIPAA, etc.)
   - Document any areas requiring manual legal review
   - Verify completeness of data protection measures

---

🚨 Repeat: NO explanations. Start with the first tool call.

✅ When fully complete, output the final result in this exact format:
**FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**

Replace with actual Document Engine IDs.
  `;

  console.log('🤖 Starting document compliance processing with ReAct agent...');

  // Stream the agent's execution
  const stream = await agent.stream(
    {
      messages: [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content:
            'Please scan these documents for compliance issues and apply necessary protections.',
        },
      ],
    },
    {
      streamMode: 'values',
    }
  );

  const finalResponse = await handleAgentStream(stream);

  console.log('✅ Compliance processing complete!');

  const finalDocumentIds = parseDocumentIds(finalResponse);
  console.log('📄 Final Document IDs:', finalDocumentIds);

  return finalDocumentIds;
}

await processCommandLine(async filePaths => {
  const documentIds = await processCompliance(filePaths);
  await downloadFiles(documentIds);
}, 'Usage: node document-processor.js <path/to/file>');
