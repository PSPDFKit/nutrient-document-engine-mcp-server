#!/usr/bin/env node

/**
 * OpenAI Agents SDK Smart Contract Processing Pipeline
 * 
 * This example demonstrates autonomous legal document processing using OpenAI Agents SDK
 * with specialized agents for contract analysis, term extraction, compliance verification,
 * and risk assessment through sophisticated agent handoffs and workflows.
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
 * Creates all the specialized agents for contract processing
 */
async function createContractProcessingAgents() {
  /**
   * Contract Analyzer Agent - Analyzes legal document structure and content
   */
  const contractAnalyzer = await createSpecializedAgent({
    name: 'Contract Analyzer',
    instructions: `You are a legal document analysis expert. Execute these steps WITHOUT asking questions:

    1. Analyze the overall contract structure, sections, and legal language patterns
    2. Identify the contract type, all parties involved, and key legal provisions
    3. Locate and extract important dates, deadlines, and milestone information throughout the document
    4. Categorize contract clauses and terms by their legal significance and business impact
    5. Identify any unusual, non-standard, or potentially problematic contract provisions

    IMPORTANT: Perform comprehensive legal analysis immediately using available document analysis capabilities.
    After completing analysis, IMMEDIATELY hand off to the Term Extractor with your detailed findings.
    Do not provide final conclusions - this is step 1 of a 4-step process.`
  });

  /**
   * Term Extractor Agent - Extracts and categorizes contract terms
   */
  const termExtractor = await createSpecializedAgent({
    name: 'Term Extractor',
    instructions: `You are a legal term extraction specialist. Execute these steps WITHOUT asking questions:

    1. Extract all key contract terms, conditions, and legal obligations from the document
    2. Identify specific payment terms, delivery schedules, and performance requirements
    3. Locate and extract termination clauses, penalty provisions, and dispute resolution mechanisms
    4. Categorize all terms by their legal importance and potential business impact
    5. Create structured, organized summaries of all extracted terms and conditions

    IMPORTANT: Perform detailed term extraction immediately using available text analysis capabilities.
    After completing term extraction, IMMEDIATELY hand off to the Compliance Checker with organized terms.
    Do not provide final conclusions - this is step 2 of a 4-step process.`
  });

  /**
   * Compliance Checker Agent - Verifies legal and regulatory compliance
   */
  const complianceChecker = await createSpecializedAgent({
    name: 'Compliance Checker',
    instructions: `You are a legal compliance verification expert. Execute these steps WITHOUT asking questions:

    1. Verify that the contract complies with relevant laws, regulations, and industry standards
    2. Identify potential legal risks, liability issues, and regulatory violations
    3. Check for missing standard protective clauses or required legal terms
    4. Flag any contract terms that may be legally problematic, unenforceable, or non-compliant
    5. Assess the overall legal soundness and regulatory compliance of the entire contract

    IMPORTANT: Perform thorough compliance verification immediately using available document analysis tools.
    After completing compliance verification, IMMEDIATELY hand off to the Risk Assessor with compliance findings.
    Do not provide final conclusions - this is step 3 of a 4-step process.`
  });

  /**
   * Risk Assessor Agent - Conducts comprehensive risk assessment
   */
  const riskAssessor = await createSpecializedAgent({
    name: 'Risk Assessor',
    instructions: `You are a contract risk assessment specialist. Execute these steps WITHOUT asking questions:

    1. Conduct comprehensive business and legal risk analysis across all contract elements
    2. Assess financial risks, performance risks, and potential liability exposure
    3. Evaluate contract terms for business impact, fairness, and commercial viability
    4. Identify potential areas for disputes, conflicts, or enforcement difficulties
    5. Generate a detailed risk assessment report with specific recommendations and mitigation strategies

    IMPORTANT: Perform complete risk analysis immediately using all available contract information.
    This is the FINAL step (4 of 4) - provide the comprehensive final report with processed contract ID.
    Include all findings from Contract Analyzer, Term Extractor, and Compliance Checker in your final assessment.
    
    ✅ When fully complete, output the final result in this exact format:
    **FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**
    
    Replace with actual Document Engine IDs.`
  });

  /**
   * Main Contract Processing Coordinator - Orchestrates the contract processing workflow
   */
  const contractProcessingCoordinator = await createSpecializedAgent({
    name: 'Contract Processing Coordinator',
    instructions: `You are the legal contract processing workflow coordinator. Execute the COMPLETE workflow WITHOUT stopping early:

    1. Begin by analyzing the contract document thoroughly for structure and content
    2. IMMEDIATELY hand off to the Contract Analyzer for detailed legal analysis
    3. After Contract Analyzer completes, IMMEDIATELY hand off to Term Extractor for detailed term extraction
    4. After Term Extractor completes, IMMEDIATELY hand off to Compliance Checker for regulatory verification
    5. After Compliance Checker completes, IMMEDIATELY hand off to Risk Assessor for final risk evaluation
    6. Only provide final results after ALL FOUR specialized agents have completed their work

    IMPORTANT: DO NOT stop after initial analysis. Execute the complete multi-agent workflow to completion.
    The workflow is not complete until Risk Assessor provides the final comprehensive report.`,
    handoffs: [contractAnalyzer, termExtractor, complianceChecker, riskAssessor]
  });

  return { contractAnalyzer, termExtractor, complianceChecker, riskAssessor, contractProcessingCoordinator };
}

/**
 * Main execution function
 */
async function main() {
  console.log('⚖️  OpenAI Agents SDK Smart Contract Processing Pipeline');
  console.log('=======================================================');

  // Process command line arguments
  const filePaths = processCommandLine(process.argv, [
    '../assets/contract.pdf'
  ]);

  console.log(`\\n📋 Contract to process: ${filePaths.join(', ')}`);

  const documentIds = await uploadDocuments(filePaths);

  // Create all the specialized agents
  console.log('\\n🤖 Creating specialized agents...');
  const { contractAnalyzer, termExtractor, complianceChecker, riskAssessor, contractProcessingCoordinator } = await createContractProcessingAgents();

  // Create the contract processing prompt
  const contractProcessingPrompt = `
Execute the COMPLETE 4-step legal contract processing workflow on document: ${documentIds.join(', ')}

MANDATORY WORKFLOW - Execute ALL steps in sequence:

STEP 1: Contract Analysis
- Analyze contract structure, parties, and key provisions
- Identify contract type and legal framework
- Extract important dates and milestones
- THEN hand off to Term Extractor

STEP 2: Term Extraction  
- Extract all key contract terms, conditions, and obligations
- Identify payment terms, delivery schedules, performance requirements
- Extract termination clauses, penalties, dispute resolution terms
- THEN hand off to Compliance Checker

STEP 3: Compliance Verification
- Verify contract compliance with laws and regulations
- Check for legal risks and liability issues
- Identify missing standard clauses or protective terms
- THEN hand off to Risk Assessor

STEP 4: Risk Assessment (FINAL)
- Conduct comprehensive business and legal risk analysis
- Assess financial risks, performance risks, liability exposure
- Generate detailed risk assessment with recommendations
- Provide final processed contract ID and complete report

CRITICAL: Execute ALL 4 steps using specialized agents. Do not stop after step 1.

✅ When fully complete, output the final result in this exact format:
**FINAL_DOCUMENT_IDS: [document_id_1, document_id_2, ...]**

Replace with actual Document Engine IDs.
  `;

  try {
    // Execute the contract processing workflow
    const result = await handleAgentRun(contractProcessingCoordinator, contractProcessingPrompt);

    // Parse document IDs from the result
    const processedContractIds = parseDocumentIds(result.finalOutput);

    if (processedContractIds.length > 0) {
      console.log('\\n📥 Downloading processed contracts...');
      await downloadFiles(processedContractIds);

      console.log('\\n🎉 Contract processing completed successfully!');
      console.log(`Processed contract IDs: ${processedContractIds.join(', ')}`);
    } else {
      console.log('\\n⚠️  No processed contract IDs found in agent response');
      console.log('Check the agent output above for details.');
    }

  } catch (error) {
    console.error('\\n❌ Contract processing failed:', error.message);
    process.exit(1);
  } finally {
    // Clean up MCP servers
    console.log('\\n🔌 Cleaning up MCP servers...');
    await closeMCPServers(contractAnalyzer);
    await closeMCPServers(termExtractor);
    await closeMCPServers(complianceChecker);
    await closeMCPServers(riskAssessor);
    await closeMCPServers(contractProcessingCoordinator);
    console.log('✅ MCP servers disconnected');
  }
}

// Run the example
main().catch(console.error);
