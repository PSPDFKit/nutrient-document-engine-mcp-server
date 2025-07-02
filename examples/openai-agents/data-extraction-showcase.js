#!/usr/bin/env node

/**
 * OpenAI Agents SDK Data Extraction Showcase
 * 
 * This example demonstrates the comprehensive data extraction capabilities of the
 * Document Engine MCP server, showcasing OCR, table extraction, key-value pairs,
 * and advanced search functionality through specialized agents.
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
 * Creates all the specialized agents for data extraction showcase
 */
async function createDataExtractionAgents() {
  /**
   * OCR Specialist Agent - Handles scanned document text extraction
   */
  const ocrSpecialist = await createSpecializedAgent({
    name: 'OCR Specialist',
    instructions: `You are an OCR and text extraction expert. Execute these steps WITHOUT asking questions:

    1. Examine the document's characteristics and properties to understand its nature
    2. Visually assess document quality by inspecting the first few pages for scan quality and text clarity
    3. Extract text from any scanned or image-based content using optical character recognition
    4. Also extract any existing digital text content that may be available
    5. Compare and analyze the differences between OCR-extracted and native text content
    6. Generate a comprehensive text extraction report with quality metrics and statistics

    IMPORTANT: Execute all text extractions immediately and provide detailed findings about text quality and accessibility.
    Hand off to the Table Extractor when text analysis is complete.`
  });

  /**
   * Table Extraction Agent - Specializes in structured data extraction
   */
  const tableExtractor = await createSpecializedAgent({
    name: 'Table Extractor',
    instructions: `You are a structured data extraction specialist. Execute these steps WITHOUT asking questions:

    1. Find and extract all tabular data from the document, preserving structure and formatting
    2. Identify and extract structured information like key-value pairs and form data
    3. Search for specific patterns including financial data, dates, identification numbers, and other structured content
    4. Analyze the structure and data types found (numeric values, text fields, date formats, etc.)
    5. Generate a comprehensive structured data summary with extraction statistics and data quality metrics

    IMPORTANT: Extract all structured data immediately using available document analysis capabilities.
    Hand off to the Content Analyzer when data extraction is complete.`
  });

  /**
   * Content Analysis Agent - Performs advanced content analysis
   */
  const contentAnalyzer = await createSpecializedAgent({
    name: 'Content Analyzer',
    instructions: `You are a content analysis expert. Execute these steps WITHOUT asking questions:

    1. Search for specific content patterns like email addresses, phone numbers, postal addresses, and currency amounts
    2. Identify important document sections, headers, and organizational structure using pattern matching
    3. Map content locations and spatial relationships to understand document layout
    4. Analyze overall document structure, content organization, and information hierarchy
    5. Create a comprehensive content classification and summary report with findings

    IMPORTANT: Perform thorough content analysis using available search and extraction capabilities.
    Hand off to the Report Generator when analysis is complete.`
  });

  /**
   * Data Report Generator - Creates comprehensive extraction reports
   */
  const reportGenerator = await createSpecializedAgent({
    name: 'Data Report Generator',
    instructions: `You are a data extraction report specialist. Execute these steps WITHOUT asking questions:

    1. Compile all extraction results from previous agents
    2. Use add_annotation to highlight key findings in the document
    3. Generate comprehensive data extraction report including:
       - Text extraction statistics and quality metrics
       - All tables found with data summaries
       - Key-value pairs and structured data
       - Search results for important patterns
       - Content analysis and classification
    4. Create summary annotations on the document

    IMPORTANT: Generate complete extraction report immediately.
    Provide final document ID and comprehensive data extraction summary.
    
    ✅ When fully complete, output the final result in this exact format:
    **FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**
    
    Replace with actual Document Engine IDs.`
  });

  /**
   * Main Data Extraction Coordinator
   */
  const dataExtractionCoordinator = await createSpecializedAgent({
    name: 'Data Extraction Coordinator',
    instructions: `You are the data extraction workflow coordinator. Execute these steps WITHOUT asking questions:

    1. Coordinate workflow between OCR Specialist → Table Extractor → Content Analyzer → Report Generator
    2. Ensure comprehensive data extraction using all available tools
    3. Monitor progress and ensure all extraction capabilities are demonstrated
    4. Provide final status and comprehensive extraction results

    IMPORTANT: Execute the complete data extraction workflow immediately.
    Demonstrate the full power of the Document Engine's extraction capabilities.`,
    handoffs: [ocrSpecialist, tableExtractor, contentAnalyzer, reportGenerator]
  });

  return { ocrSpecialist, tableExtractor, contentAnalyzer, reportGenerator, dataExtractionCoordinator };
}

/**
 * Main execution function
 */
async function main() {
  console.log('🔍 OpenAI Agents SDK Data Extraction Showcase');
  console.log('==============================================');

  // Process command line arguments - use documents with rich data
  const filePaths = processCommandLine(process.argv, [
    '../assets/credit-card-application.pdf'  // Rich form with tables and structured data
  ]);

  console.log(`\\n📋 Document to analyze: ${filePaths.join(', ')}`);

  const documentIds = await uploadDocuments(filePaths);

  // Create all the specialized agents
  console.log('\\n🤖 Creating specialized data extraction agents...');
  const { ocrSpecialist, tableExtractor, contentAnalyzer, reportGenerator, dataExtractionCoordinator } = await createDataExtractionAgents();

  // Create the data extraction prompt
  const dataExtractionPrompt = `
Perform comprehensive data extraction showcase on document: ${documentIds.join(', ')}

EXTRACTION TASKS TO EXECUTE:
1. OCR Analysis:
   - Extract text using OCR from all pages
   - Compare with native text extraction
   - Assess document scan quality
   - Provide text extraction statistics

2. Structured Data Extraction:
   - Extract all tables with preserved formatting
   - Extract key-value pairs using AI analysis
   - Search for patterns: emails, phones, addresses, currency, dates
   - Analyze data types and structure

3. Content Analysis:
   - Map content locations with coordinates
   - Identify document sections and organization
   - Classify content types and importance
   - Find regulatory or compliance-related content

4. Comprehensive Reporting:
   - Annotate document with key findings
   - Generate detailed extraction report
   - Provide statistics and quality metrics
   - Demonstrate full extraction capabilities

IMPORTANT: Execute all extractions immediately - this is a showcase of Document Engine capabilities.

✅ When fully complete, output the final result in this exact format:
**FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**

Replace with actual Document Engine IDs.
`;

  try {
    // Execute the data extraction showcase workflow
    const result = await handleAgentRun(dataExtractionCoordinator, dataExtractionPrompt);

    // Parse document IDs from the result
    const processedDocumentIds = parseDocumentIds(result.finalOutput);

    if (processedDocumentIds.length > 0) {
      console.log('\\n📥 Downloading data extraction results...');
      await downloadFiles(processedDocumentIds);

      console.log('\\n🎉 Data extraction showcase completed successfully!');
      console.log(`Processed document IDs: ${processedDocumentIds.join(', ')}`);
    } else {
      console.log('\\n⚠️  No processed document IDs found in agent response');
      console.log('Check the agent output above for extraction details.');
    }

  } catch (error) {
    console.error('\\n❌ Data extraction showcase failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up MCP servers
    console.log('\\n🔌 Cleaning up MCP servers...');
    await closeMCPServers(ocrSpecialist);
    await closeMCPServers(tableExtractor);
    await closeMCPServers(contentAnalyzer);
    await closeMCPServers(reportGenerator);
    await closeMCPServers(dataExtractionCoordinator);
    console.log('✅ MCP servers disconnected');
  }
}

// Run the example
main().catch(console.error);
