#!/usr/bin/env node

/**
 * Intelligent Form Processing Automation Script
 *
 * This script demonstrates advanced form processing capabilities using OpenAI Agents SDK
 * and Document Engine MCP Server. It performs a two-document workflow:
 * - Extracts structured data from the first document (data source)
 * - Identifies and fills form fields in the second document using extracted data
 * - Applies intelligent matching and validation between source and target data
 * - Creates professionally processed forms with audit trails
 * - Generates multiple versions for different workflow stages
 *
 * Usage: node form-processor.js <source_document.pdf> <form_document.pdf>
 */

import { Agent } from '@openai/agents';
import { 
  validateEnvironment, 
  createSpecializedAgent, 
  handleAgentRun, 
  parseDocumentIds,
  closeMCPServers
} from './shared/common.js';
import { uploadDocuments, downloadFiles } from './shared/fileHandlers.js';

// Validate environment before starting
validateEnvironment();

/**
 * Creates the specialized agent for form processing
 */
async function createFormProcessingAgent() {
  /**
   * Form Processing Agent - Handles the complete two-document workflow
   */
  const formProcessor = await createSpecializedAgent({
    name: 'Intelligent Form Processor',
    instructions: `You are an intelligent form processing agent executing in a tool-augmented environment.

Your task: Execute a two-document workflow using the provided documents: first document (SOURCE DATA) and second document (TARGET FORM).

⚠️ CRITICAL INSTRUCTION: Execute these steps WITHOUT asking questions. DO NOT NARRATE your plan or write summaries. Begin directly with the first tool call. No explanation. No reasoning first. Just take action using tools.

If you output anything other than a tool call, the system will assume your job is finished and terminate.

---

Your intelligent workflow:

1. **Source Data Extraction & Analysis**
   - Extract all structured and unstructured data from the source document (first document)
   - Identify personal information, financial data, contact details, and any other relevant information
   - Analyze data patterns and relationships to understand the complete information profile

2. **Target Form Analysis & Mapping**
   - Analyze the target form document (second document) to identify all available form fields
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

Replace with actual Document Engine IDs.`
  });

  return formProcessor;
}

/**
 * Main execution function
 */
async function main() {
  console.log('📝 Intelligent Form Processing Automation Script');
  console.log('==============================================');

  // Process command line arguments
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    console.error('❌ Form processor requires exactly 2 documents: <source_document.pdf> <form_document.pdf>');
    console.log('Usage: node form-processor.js <source_document.pdf> <form_document.pdf>');
    process.exit(1);
  }

  const filePaths = args;
  console.log(`\n📄 Source document: ${filePaths[0]}`);
  console.log(`📋 Form document: ${filePaths[1]}`);

  // Upload documents
  console.log('\n📤 Uploading documents for intelligent form processing...');
  const documentIds = await uploadDocuments(filePaths);
  console.log(`✅ Documents uploaded: ${documentIds.join(', ')}`);

  // Create the specialized agent
  console.log('\n🤖 Creating intelligent form processing agent...');
  const formProcessor = await createFormProcessingAgent();

  // Create the form processing prompt
  const formProcessingPrompt = `Please execute the intelligent form processing workflow to extract data from the source document (${documentIds[0]}) and fill the target form (${documentIds[1]}).`;

  try {
    // Execute the form processing workflow
    console.log('\n🤖 Starting intelligent form processing workflow...');
    const result = await handleAgentRun(formProcessor, formProcessingPrompt);

    // Parse document IDs from the result
    const processedFormIds = parseDocumentIds(result.finalOutput);

    if (processedFormIds.length > 0) {
      console.log('\n📥 Downloading processed forms...');
      await downloadFiles(processedFormIds);

      console.log('\n✅ Form processing complete!');
      console.log(`📄 Final Document IDs: ${processedFormIds.join(', ')}`);
    } else {
      console.log('\n⚠️  No processed form IDs found in agent response');
      console.log('Check the agent output above for details.');
    }

  } catch (error) {
    console.error('\n❌ Form processing failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up MCP servers
    console.log('\n🔌 Cleaning up MCP servers...');
    await closeMCPServers(formProcessor);
    console.log('✅ MCP servers disconnected');
  }
}

// Run the example
main().catch(console.error);
