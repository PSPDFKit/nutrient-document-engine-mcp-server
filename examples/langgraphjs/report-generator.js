/**
 * Report Generation Engine
 *
 * This script provides functionality to generate comprehensive business intelligence reports
 * from multiple data sources using a LLM and Document Engine MCP Server. It performs the following operations:
 * - Analyzes data sources (CSV, Excel, JSON, Database exports)
 * - Extracts key metrics, trends, and performance indicators
 * - Calculates derived metrics and KPIs
 * - Populates report templates with relevant data
 * - Adds annotations for key findings
 * - Applies appropriate watermarks
 * - Creates stakeholder-specific versions
 * - Returns and downloads the generated report IDs
 *
 * Usage: node report-generator.js <path/to/data1> <path/to/data2> ...
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
import fs from 'fs';
import path from 'path';

config();

/**
 * Generates a business intelligence report from multiple data sources
 * @param {Array<string>} dataDocumentIds - Array of document IDs containing data
 * @returns {Promise<Array<string>>} - Array of document IDs for the generated reports
 */
async function generateReport(dataDocumentIds) {
  console.log(`📊 Generating report from ${dataDocumentIds.length} data sources...`);

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

  // Give agent the report generation task with streaming
  const systemMessage = `You are a business intelligence report generator executing in a tool-augmented environment.

Your task: Immediately begin generating comprehensive reports from data document(s): ${dataDocumentIds.join(', ')} using the provided Document Engine tools.

⚠️ CRITICAL INSTRUCTION: Execute these steps WITHOUT asking questions. DO NOT NARRATE your plan or write summaries. Begin directly with the first tool call. No explanation. No reasoning first. Just take action using tools.

If you output anything other than a tool call, the system will assume your job is finished and terminate.

---

Your workflow:

1. **Comprehensive Data Intelligence**
   - Analyze all data sources to understand business context, data types, and analytical opportunities
   - Extract key metrics, performance indicators, and trends from structured and unstructured data
   - Identify data relationships, patterns, and quality indicators across all sources

2. **Advanced Business Analytics**
   - Generate actionable business insights, trend analysis, and performance assessments
   - Identify critical business patterns, anomalies, and opportunities for improvement
   - Calculate derived metrics, KPIs, and predictive indicators relevant to business objectives

3. **Strategic Report Development**
   - Create comprehensive business intelligence reports with executive summaries and detailed analysis
   - Structure content to maximize business impact and support strategic decision-making
   - Ensure reports address key business questions and provide clear recommendations

4. **Professional Enhancement & Visualization**
   - Add strategic annotations highlighting critical insights and recommended actions
   - Create clear data presentations and performance dashboards where appropriate
   - Ensure professional formatting and optimal information hierarchy

5. **Multi-Level Distribution**
   - Generate versions appropriate for different organizational levels (C-suite, management, operational)
   - Create targeted reports focusing on specific business functions or decision areas
   - Apply appropriate branding and confidentiality controls for different audiences

6. **Business Impact Optimization**
   - Ensure reports drive actionable business decisions and measurable outcomes
   - Document methodology and data sources for transparency and reproducibility
   - Create follow-up recommendations and performance tracking frameworks

---

🚨 Repeat: NO explanations. Start with the first tool call immediately.

✅ When fully complete, output the final result in this exact format:
**FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**

Replace with actual Document Engine IDs.`;

  console.log('🤖 Starting report generation with ReAct agent...');

  // Stream the agent's execution
  const stream = await agent.stream(
    {
      messages: [{ role: 'system', content: systemMessage }],
    },
    {
      streamMode: 'values',
    }
  );

  const finalResponse = await handleAgentStream(stream);

  console.log('✅ Report generation complete!');

  const finalReportIds = parseDocumentIds(finalResponse);
  console.log('📄 Final Report IDs:', finalReportIds);

  return finalReportIds;
}

/**
 * Main function to handle the report generation process
 * @param {Array<string>} filePaths - Array of file paths to process
 */
async function processReportGeneration(filePaths) {
  console.log(`🔗 Starting upload and report generation for ${filePaths.length} documents...`);

  // Upload data documents using shared file handler
  const dataDocumentIds = await uploadDocumentWorkflow(
    filePaths,
    uploadDocuments,
    'Report generation'
  );

  // Generate reports
  const reportIds = await generateReport(dataDocumentIds);

  if (reportIds.length === 0) {
    throw new Error('No reports were generated.');
  }

  console.log('🎉 Report generation process completed successfully!');
  return reportIds;
}

await processCommandLine(async filePaths => {
  const reportIds = await processReportGeneration(filePaths);
  await downloadFiles(reportIds);
}, 'Usage: node report-generator.js <path/to/data1> <path/to/data2> <path/to/data3>');
