#!/usr/bin/env node

/**
 * OpenAI Agents SDK Report Generation Engine
 * 
 * This example demonstrates autonomous business intelligence report generation
 * using OpenAI Agents SDK with specialized agents for data analysis, 
 * visualization, and professional report formatting through agent handoffs.
 */

import { Agent } from '@openai/agents';
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
 * Creates all the specialized agents for report generation
 */
async function createReportGenerationAgents() {
  /**
   * Data Analyst Agent - Analyzes data and generates insights
   */
  const dataAnalyst = await createSpecializedAgent({
    name: 'Data Analyst',
    instructions: `You are a business intelligence data analyst. Execute these steps WITHOUT asking questions:

    1. Extract and thoroughly analyze all data from the uploaded files including spreadsheets and structured documents
    2. Identify key trends, patterns, anomalies, and significant insights within the data
    3. Calculate important business metrics, KPIs, and statistical summaries
    4. Determine the most relevant and impactful visualizations needed to represent the findings
    5. Create data-driven recommendations and actionable business insights

    IMPORTANT: Perform comprehensive data analysis immediately using available data extraction capabilities.
    Hand off to the Chart Generator with detailed findings for visualization creation.`
  });

  /**
   * Chart Generator Agent - Creates visualizations and charts
   */
  const chartGenerator = await createSpecializedAgent({
    name: 'Chart Generator',
    instructions: `You are a data visualization specialist. Execute these steps WITHOUT asking questions:

    1. Create appropriate charts and graphs that effectively represent the analyzed data findings
    2. Generate various visualization types including bar charts, line graphs, pie charts, and data tables as needed
    3. Ensure all visualizations are clear, professional, visually appealing, and easy to understand
    4. Add proper labels, legends, titles, and formatting to make charts self-explanatory
    5. Create multiple visualization formats to highlight different aspects and insights from the data

    IMPORTANT: Generate comprehensive visualizations immediately using available document creation tools.
    Hand off to the Report Designer with all charts and visualizations for professional report assembly.`
  });

  /**
   * Report Designer Agent - Assembles professional reports
   */
  const reportDesigner = await createSpecializedAgent({
    name: 'Report Designer',
    instructions: `You are a professional report design specialist. Execute these steps WITHOUT asking questions:

    1. Assemble all data analysis and visualizations into a cohesive, professional business report
    2. Create an executive summary section with key findings, insights, and actionable recommendations
    3. Add professional formatting, headers, section dividers, and logical document structure
    4. Integrate data tables, charts, and narrative explanations in a visually appealing layout
    5. Generate a comprehensive business intelligence report document with consistent branding and formatting

    IMPORTANT: Create the final professional report immediately using available document assembly tools.
    Provide the final report document ID and summary of key business insights discovered.
    
    ✅ When fully complete, output the final result in this exact format:
    **FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**
    
    Replace with actual Document Engine IDs.`
  });

  /**
   * Main Report Generation Coordinator - Orchestrates the report generation workflow
   */
  const reportGenerationCoordinator = await createSpecializedAgent({
    name: 'Report Generation Coordinator',
    instructions: `You are the business intelligence report generation coordinator. Your role is to:

    1. Upload data files for analysis and report generation
    2. Coordinate workflow between Data Analyst → Chart Generator → Report Designer
    3. Ensure comprehensive data analysis and professional visualization
    4. Monitor progress and handle any data processing issues
    5. Provide final report status and document IDs

    Start by uploading the data file, then initiate data analysis.`,
    handoffs: [dataAnalyst, chartGenerator, reportDesigner]
  });

  return { dataAnalyst, chartGenerator, reportDesigner, reportGenerationCoordinator };
}

/**
 * Main execution function
 */
async function main() {
  console.log('📊 OpenAI Agents SDK Report Generation Engine');
  console.log('==============================================');

  // Process command line arguments
  const filePaths = processCommandLine(process.argv, [
    '../assets/finance.xlsx'
  ]);

  console.log(`\\n📋 Data file to analyze: ${filePaths.join(', ')}`);

  const documentIds = await uploadDocuments(filePaths);

  // Create all the specialized agents
  console.log('\\n🤖 Creating specialized agents...');
  const { dataAnalyst, chartGenerator, reportDesigner, reportGenerationCoordinator } = await createReportGenerationAgents();

  // Create the report generation prompt
  const reportGenerationPrompt = `
Please perform comprehensive business intelligence report generation from the following data file: ${documentIds.join(', ')}

Requirements:
1. Upload the data file for analysis
2. Perform thorough data analysis:
   - Extract and analyze all relevant data points
   - Identify trends, patterns, and key insights
   - Calculate important business metrics and KPIs
   - Generate data-driven recommendations
3. Create professional visualizations:
   - Generate appropriate charts and graphs
   - Create data tables and summaries
   - Ensure all visualizations are clear and informative
4. Assemble comprehensive business report:
   - Create executive summary with key findings
   - Include data analysis, visualizations, and recommendations  
   - Apply professional formatting and structure
   - Generate final report document with all insights
5. Provide final report document ID and summary of key business insights

Please coordinate this workflow using the specialized business intelligence agents.

✅ When fully complete, output the final result in this exact format:
**FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**

Replace with actual Document Engine IDs.
  `;

  try {
    // Execute the report generation workflow
    const result = await handleAgentRun(reportGenerationCoordinator, reportGenerationPrompt);

    // Parse document IDs from the result
    const reportIds = parseDocumentIds(result.finalOutput);

    if (reportIds.length > 0) {
      console.log('\\n📥 Downloading generated reports...');
      await downloadFiles(reportIds);

      console.log('\\n🎉 Report generation completed successfully!');
      console.log(`Generated report IDs: ${reportIds.join(', ')}`);
    } else {
      console.log('\\n⚠️  No report document IDs found in agent response');
      console.log('Check the agent output above for details.');
    }

  } catch (error) {
    console.error('\\n❌ Report generation failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up MCP servers
    console.log('\\n🔌 Cleaning up MCP servers...');
    await closeMCPServers(dataAnalyst);
    await closeMCPServers(chartGenerator);
    await closeMCPServers(reportDesigner);
    await closeMCPServers(reportGenerationCoordinator);
    console.log('✅ MCP servers disconnected');
  }
}

// Run the example
main().catch(console.error);
