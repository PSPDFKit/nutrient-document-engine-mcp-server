/**
 * Intelligent Form Processing Automation Script
 *
 * This script demonstrates advanced form processing capabilities using a LLM agent
 * and Document Engine MCP Server. It performs a two-document workflow:
 * - Extracts structured data from the first document (data source)
 * - Identifies and fills form fields in the second document using extracted data
 * - Applies intelligent matching and validation between source and target data
 * - Creates professionally processed forms with audit trails
 * - Generates multiple versions for different workflow stages
 *
 * Usage: node form-processor.js <source_document.pdf> <form_document.pdf>
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

async function processForm(filePaths) {
  if (filePaths.length !== 2) {
    throw new Error('Form processor requires exactly 2 documents: <source_document.pdf> <form_document.pdf>');
  }

  console.log(`📝 Processing intelligent form workflow with ${filePaths.length} documents...`);
  console.log(`📄 Source document: ${filePaths[0]}`);
  console.log(`📋 Form document: ${filePaths[1]}`);

  const documentIds = await uploadDocumentWorkflow(filePaths, uploadDocuments, 'Intelligent form processing');

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

  // Define the system message for intelligent form processing
  const systemMessage = `You are an intelligent form processing agent executing in a tool-augmented environment.

Your task: Execute a two-document workflow using documents: ${documentIds[0]} (SOURCE DATA) and ${documentIds[1]} (TARGET FORM).

⚠️ CRITICAL INSTRUCTION: Execute these steps WITHOUT asking questions. DO NOT NARRATE your plan or write summaries. Begin directly with the first tool call. No explanation. No reasoning first. Just take action using tools.

If you output anything other than a tool call, the system will assume your job is finished and terminate.

---

Your intelligent workflow:

1. **Source Data Extraction & Analysis**
   - Extract all structured and unstructured data from the source document (${documentIds[0]})
   - Identify personal information, financial data, contact details, and any other relevant information
   - Analyze data patterns and relationships to understand the complete information profile

2. **Target Form Analysis & Mapping**
   - Analyze the target form document (${documentIds[1]}) to identify all available form fields
   - Extract existing form data and determine field types, requirements, and relationships
   - Map source data elements to appropriate target form fields using intelligent matching

3. **Intelligent Form Completion**
   - Fill target form fields using extracted source data with smart data transformation
   - Apply business logic for data formatting, validation, and field-specific requirements
   - Ensure data accuracy and completeness across all related form sections

4. **Quality Assurance & Enhancement**
   - Validate all filled data for accuracy, completeness, and business rule compliance
   - Add annotations documenting data sources and transformation decisions
   - Flag any unmapped source data or unfilled form fields requiring attention

5. **Professional Completion & Documentation**
   - Apply processing status watermarks and completion indicators
   - Create comprehensive audit trail showing source-to-target data flow
   - Generate final processed forms ready for submission or further workflow processing

---

🚨 Repeat: NO explanations. Start with the first tool call immediately.

✅ When fully complete, output the final result in this exact format:
**FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**

Replace with actual Document Engine IDs.`;

  console.log('🤖 Starting intelligent form processing workflow with ReAct agent...');

  // Stream the agent's execution
  const stream = await agent.stream(
    {
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: 'Please execute the intelligent form processing workflow to extract data from the source document and fill the target form.' },
      ],
    },
    {
      streamMode: 'values',
    }
  );

  const finalResponse = await handleAgentStream(stream);

  console.log('✅ Form processing complete!');

  const finalDocumentIds = parseDocumentIds(finalResponse);
  console.log('📄 Final Document IDs:', finalDocumentIds);

  return finalDocumentIds;
}

await processCommandLine(async filePaths => {
  const documentIds = await processForm(filePaths);
  await downloadFiles(documentIds);
}, 'Usage: node form-processor.js <source_document.pdf> <form_document.pdf>', 2);
