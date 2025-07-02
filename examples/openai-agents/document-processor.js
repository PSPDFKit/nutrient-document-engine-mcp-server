#!/usr/bin/env node

/**
 * OpenAI Agents SDK Document Compliance Processor
 * 
 * This example demonstrates autonomous regulatory monitoring using OpenAI Agents SDK
 * with specialized agents for compliance checking, sensitive data detection, and
 * audit trail creation through agent handoffs.
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
 * Creates all the specialized agents for compliance processing
 */
async function createComplianceAgents() {
  /**
   * Compliance Scanner Agent - Scans for regulatory compliance issues
   */
  const complianceScanner = await createSpecializedAgent({
    name: 'Compliance Scanner',
    instructions: `You are a regulatory compliance expert. Execute these steps WITHOUT asking questions:

    1. Thoroughly scan all document content for potential regulatory compliance issues
    2. Search for sensitive data patterns including Social Security numbers, credit card numbers, and personal information
    3. Identify any form fields that might contain sensitive or regulated information
    4. Look for content related to GDPR, CCPA, and other data protection regulations
    5. Create a comprehensive compliance violation report with specific page locations and findings

    IMPORTANT: Execute all compliance scans immediately using available document analysis tools.
    Hand off to the Data Protection Agent with specific findings and page locations for remediation.`
  });

  /**
   * Data Protection Agent - Identifies and handles sensitive data
   */
  const dataProtectionAgent = await createSpecializedAgent({
    name: 'Data Protection Agent',
    instructions: `You are a data protection specialist. Execute these steps WITHOUT asking questions:

    1. Review the compliance findings to locate all specific sensitive data instances identified
    2. Create redaction areas to permanently hide all personal information, Social Security numbers, and credit card data
    3. Redact email addresses, phone numbers, physical addresses, and other identifying information
    4. Add protective annotations to mark redacted areas with explanations for why they were protected
    5. Apply all redactions permanently to create a privacy-compliant version of the document

    IMPORTANT: Execute all privacy protections immediately to safeguard sensitive information.
    Hand off to the Audit Trail Agent with redaction summary and the protected document ID.`
  });

  /**
   * Audit Trail Agent - Creates comprehensive audit documentation
   */
  const auditTrailAgent = await createSpecializedAgent({
    name: 'Audit Trail Agent',
    instructions: `You are an audit documentation specialist. Your role is to:

    1. Create comprehensive audit trails of all compliance actions taken
    2. Document all redactions and compliance modifications
    3. Generate compliance reports with timestamps and justifications
    4. Add audit annotations to the processed document
    5. Create a final compliance summary document

    Provide final document IDs and compliance status report.
    
    ✅ When fully complete, output the final result in this exact format:
    **FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**
    
    Replace with actual Document Engine IDs.`
  });

  /**
   * Main Compliance Processor - Orchestrates the compliance workflow
   */
  const complianceProcessor = await createSpecializedAgent({
    name: 'Compliance Processor',
    instructions: `You are the main compliance processing coordinator. Your role is to:

    1. Upload documents for compliance processing
    2. Coordinate workflow between Compliance Scanner → Data Protection Agent → Audit Trail Agent
    3. Ensure thorough regulatory compliance checking
    4. Monitor progress and handle escalations
    5. Provide final compliance status and processed document IDs

    Start by uploading the document, then initiate compliance scanning.`,
    handoffs: [complianceScanner, dataProtectionAgent, auditTrailAgent]
  });

  return { complianceScanner, dataProtectionAgent, auditTrailAgent, complianceProcessor };
}

/**
 * Main execution function
 */
async function main() {
  console.log('🔒 OpenAI Agents SDK Document Compliance Processor');
  console.log('==================================================');

  // Process command line arguments
  const filePaths = processCommandLine(process.argv, [
    '../assets/credit-card-application.pdf'
  ]);

  console.log(`\\n📋 Document to process: ${filePaths.join(', ')}`);

  const documentIds = await uploadDocuments(filePaths);

  // Create all the specialized agents
  console.log('\\n🤖 Creating specialized compliance agents...');
  const { complianceScanner, dataProtectionAgent, auditTrailAgent, complianceProcessor } = await createComplianceAgents();

  // Create the compliance processing prompt
  const compliancePrompt = `
Please perform comprehensive compliance processing on the following document: ${documentIds.join(', ')}

Requirements:
1. Upload the document for processing
2. Perform regulatory compliance scanning:
   - Check for GDPR/CCPA compliance issues
   - Identify financial regulation concerns
   - Flag any non-compliant content
3. Conduct sensitive data protection:
   - Identify PII, PHI, and financial data
   - Create redaction annotations for sensitive information
   - Apply redactions to protect sensitive data
4. Create comprehensive audit trail:
   - Document all compliance actions taken
   - Add audit annotations to the document
   - Generate compliance summary report
5. Provide final processed document ID and compliance status

Please coordinate this workflow using the specialized compliance agents.

✅ When fully complete, output the final result in this exact format:
**FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**

Replace with actual Document Engine IDs.
  `;

  try {
    // Execute the compliance processing workflow
    const result = await handleAgentRun(complianceProcessor, compliancePrompt);

    // Parse document IDs from the result
    const processedDocumentIds = parseDocumentIds(result.finalOutput);

    if (processedDocumentIds.length > 0) {
      console.log('\\n📥 Downloading compliance-processed documents...');
      await downloadFiles(processedDocumentIds);

      console.log('\\n🎉 Compliance processing completed successfully!');
      console.log(`Processed document IDs: ${processedDocumentIds.join(', ')}`);
    } else {
      console.log('\\n⚠️  No processed document IDs found in agent response');
      console.log('Check the agent output above for details.');
    }

  } catch (error) {
    console.error('\\n❌ Compliance processing failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up MCP servers
    console.log('\\n🔌 Cleaning up MCP servers...');
    await closeMCPServers(complianceScanner);
    await closeMCPServers(dataProtectionAgent);
    await closeMCPServers(auditTrailAgent);
    await closeMCPServers(complianceProcessor);
    console.log('✅ MCP servers disconnected');
  }
}

// Run the example
main().catch(console.error);
