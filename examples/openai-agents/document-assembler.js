#!/usr/bin/env node

/**
 * OpenAI Agents SDK Document Assembly Example
 * 
 * This example demonstrates intelligent document assembly using OpenAI Agents SDK
 * with the Document Engine MCP server. It shows how agents can analyze, order,
 * and professionally assemble multiple documents with handoffs between specialized agents.
 */

import {
  validateEnvironment, 
  createSpecializedAgent, 
  handleAgentRun, 
  processCommandLine, 
  parseDocumentIds,
  closeMCPServers
} from './shared/common.js';
import { uploadDocuments, downloadFiles } from './shared/fileHandlers.js';

// Validate environment before starting
validateEnvironment();

/**
 * Creates all the specialized agents for document assembly
 */
async function createDocumentAssemblyAgents() {
  /**
   * Document Analysis Agent - Analyzes and categorizes documents
   */
  const documentAnalyzer = await createSpecializedAgent({
    name: 'Document Analyzer',
    instructions: `You are a professional document analysis expert. Execute these steps WITHOUT asking questions:

    1. Examine the metadata and characteristics of each document provided
    2. Analyze the content and structure by reviewing the first few pages of each document
    3. Visually inspect document layouts to understand formatting and design
    4. Determine logical ordering based on document types (cover → main content → closing)
    5. Create a structured analysis report with document IDs and recommended assembly order

    IMPORTANT: Take action immediately using available tools - do not ask for clarification or additional information.
    When analysis is complete, hand off to the Document Assembler with your findings.`
  });

  /**
   * Document Assembly Agent - Handles the actual document assembly process
   */
  const documentAssembler = await createSpecializedAgent({
    name: 'Document Assembler',
    instructions: `You are a professional document assembly specialist. Execute these steps WITHOUT asking questions:

    1. Combine the documents in the order specified by the analyzer into a single cohesive document
    2. Add professional section headers and dividers between different document sections
    3. Apply an "ASSEMBLED DOCUMENT" watermark with the current date to brand the final output
    4. Create a backup copy of the assembled document for safety
    5. Document all changes and modifications made during the assembly process

    IMPORTANT: Execute the assembly immediately using available tools to create a professional final document.
    When assembly is complete, hand off to the Quality Controller with the new document ID.
    
    When providing document IDs, use this format: document_id: DOCUMENTID123456`
  });

  /**
   * Quality Control Agent - Reviews and finalizes documents
   */
  const qualityController = await createSpecializedAgent({
    name: 'Quality Controller',
    instructions: `You are a quality control specialist for document assembly. Execute these steps WITHOUT asking questions:

    1. Verify the assembled document's page count, file size, and other metadata characteristics
    2. Visually inspect the first, middle, and last pages to ensure proper formatting and layout
    3. Review all annotations and modifications that were added during the assembly process
    4. Check sample pages to verify content integrity and readability
    5. Create a comprehensive quality control report with document statistics and findings

    IMPORTANT: Perform thorough quality checks using available tools immediately.
    Provide the final document ID and comprehensive quality report when complete.
    
    ✅ When fully complete, output the final result in this exact format:
    **FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**
    
    Replace with actual Document Engine IDs.`
  });

  /**
   * Main Triage Agent - Orchestrates the document assembly workflow
   */
  const triageAgent = await createSpecializedAgent({
    name: 'Document Assembly Triage',
    instructions: `You are the triage agent for professional document assembly. Your role is to:

    1. Coordinate the document assembly workflow between specialized agents
    2. Upload documents and initiate the analysis process
    3. Ensure proper handoffs between Document Analyzer → Document Assembler → Quality Controller
    4. Monitor progress and handle any issues that arise
    5. Provide final status updates and document IDs

    Start by uploading the provided documents, then hand off to Document Analyzer.
    
    Ensure the final output includes document IDs in the format: document_id: DOCUMENTID123456`,
    handoffs: [documentAnalyzer, documentAssembler, qualityController]
  });

  return { documentAnalyzer, documentAssembler, qualityController, triageAgent };
}

/**
 * Main execution function
 */
async function main() {
  console.log('🏗️  OpenAI Agents SDK Document Assembly Example');
  console.log('================================================');

  // Process command line arguments
  const filePaths = processCommandLine(process.argv, [
    '../assets/cover.pdf',
    '../assets/contract.pdf', 
    '../assets/thanks.pdf'
  ]);

  console.log(`\\n📋 Documents to assemble: ${filePaths.join(', ')}`);

  const documentIds = await uploadDocuments(filePaths)

  // Create all the specialized agents
  console.log('\\n🤖 Creating specialized agents...');
  const { documentAnalyzer, documentAssembler, qualityController, triageAgent } = await createDocumentAssemblyAgents();

  // Create the assembly prompt
  const assemblyPrompt = `
Please perform professional document assembly with the following files: ${documentIds.join(', ')}

Requirements:
1. Analyze each document's content and determine optimal ordering
2. Assemble documents with professional formatting:
   - Add cover page with document summary
   - Insert section headers between documents  
   - Apply consistent formatting and page numbering
   - Add watermark indicating "ASSEMBLED DOCUMENT"
3. Perform quality control review
4. Provide final assembled document ID

Please coordinate this workflow using the specialized agents and provide progress updates.

✅ When fully complete, output the final result in this exact format:
**FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**

Replace with actual Document Engine IDs.
  `;

  try {
    // Execute the document assembly workflow
    const result = await handleAgentRun(triageAgent, assemblyPrompt);

    // Parse document IDs from the result
    const finalDocumentIds = parseDocumentIds(result.finalOutput);

    if (finalDocumentIds.length > 0) {
      console.log('\\n📥 Downloading assembled documents...');
      await downloadFiles(finalDocumentIds);

      console.log('\\n🎉 Document assembly completed successfully!');
      console.log(`Final document IDs: ${finalDocumentIds.join(', ')}`);
    } else {
      console.log('\\n⚠️  No final document IDs found in agent response');
      console.log('Check the agent output above for details.');
    }

  } catch (error) {
    console.error('\\n❌ Document assembly failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up MCP servers
    console.log('\\n🔌 Cleaning up MCP servers...');
    await closeMCPServers(documentAnalyzer);
    await closeMCPServers(documentAssembler);
    await closeMCPServers(qualityController);
    await closeMCPServers(triageAgent);
    console.log('✅ MCP servers disconnected');
  }
}

// Run the example
main().catch(console.error);
