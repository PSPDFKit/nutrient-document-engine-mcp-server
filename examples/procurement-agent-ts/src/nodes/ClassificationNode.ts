/**
 * Document Classification Agent using LangChain Structured Output
 * Classifies documents and extracts key data using Zod schemas and MCP tools
 */

import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { BaseDocument, DocumentClassificationSchema, ProcessedDocument } from '../types';
import { RunnableConfig } from '@langchain/core/runnables';
import { ensureRunnableConfig, WorkflowStateAnnotation } from '../State';
import { createMCPClient } from '../utils/MCPClient';
import { HumanMessagePromptTemplate } from '@langchain/core/prompts';

const CLASSIFICATION_PROMPT = `You are a procurement document classification expert with access to document processing tools.

Your task is to:
1. Use available tools to extract text and data from the document
2. Classify the document type (purchase_order, invoice, payment, or unknown) 
3. Extract key data fields that are useful for matching documents together
4. Identify cross-references to other documents (e.g., PO numbers on invoices, invoice numbers on payments)
5. Provide a confidence score and reasoning for your classification

Key indicators for each document type:
- **Purchase Order**: PO numbers, vendor details, line items, delivery dates, "purchase order" text
- **Invoice**: Invoice numbers, PO references, billing details, payment terms, "invoice" text  
- **Payment**: Transaction IDs, payment methods, amounts, authorization codes, invoice references
- **Unknown**: Documents that don't clearly fit the above categories

IMPORTANT: First use the available tools to extract document content, then analyze that content for classification.`;

const ANALYSIS_PROMPT = `Analyze this document and extract key information:

Document ID: {documentId}
Filename: {filename}
Source: {source}

Please use the available tools to:
1. Extract the full text content from this document
2. Extract any form data or structured information
3. Look for key identifying information like PO numbers, invoice numbers, vendor names, amounts, dates
4. Analyze the content to determine what type of document this is

After extracting the information, provide a summary of what you found.`;

const EXTRACT_DATA_PROMPT = `Based on the following extracted document content, classify this document and extract key information:

EXTRACTED CONTENT:
{content}

DOCUMENT INFO:
- Filename: {filename}
- Document ID: {documentId}

Please analyze this content and provide a structured classification with extracted data.`;

export async function classifyDocumentsNode(
  state: typeof WorkflowStateAnnotation.State,
  config: RunnableConfig
): Promise<typeof WorkflowStateAnnotation.Update> {
  const results: ProcessedDocument[] = [];

  for (const document of state.documents) {
    const processed = await processDocument(document, config);
    results.push(processed);
    console.log(
      `✅ Classified ${document.filename} as ${processed.type} (${(processed.confidence * 100).toFixed(1)}% confidence)`
    );
  }

  return {
    processedDocuments: results,
  };
}

async function processDocument(
  document: BaseDocument,
  config: RunnableConfig
): Promise<ProcessedDocument> {
  if (!document.documentId) {
    throw new Error(`Document ${document.filename} has no documentId`);
  }

  const configurable = ensureRunnableConfig(config);

  // Step 1: Use ReAct agent to extract document content using tools
  const mcpClient = createMCPClient(configurable.documentEngineMcpServerUrl);

  const relevantTools = await mcpClient
    .getTools()
    .then(tools =>
      tools.filter(
        tool =>
          tool.name?.includes('extract_text') ||
          tool.name?.includes('extract_tables') ||
          tool.name?.includes('extract_key_value_pairs') ||
          tool.name?.includes('extract_form_data') ||
          tool.name?.includes('read_document_info')
      )
    );

  // Create ReAct agent for tool-based document analysis
  const agent = createReactAgent({
    llm: configurable.model,
    tools: relevantTools,
    prompt: CLASSIFICATION_PROMPT,
  });

  const inputMessage = await HumanMessagePromptTemplate.fromTemplate(ANALYSIS_PROMPT).invoke({
    documentId: document.documentId,
    filename: document.filename,
    source: document.source,
  });

  const agentResult = await agent.invoke({
    messages: inputMessage,
  });

  // Step 2: Use structured output to get the final classification
  const messages = agentResult.messages || [];
  const extractedContent = messages[messages.length - 1]?.content || '';

  const structuredOutputModel = configurable.model.withStructuredOutput(
    DocumentClassificationSchema
  );
  const classificationPrompt = await HumanMessagePromptTemplate.fromTemplate(
    EXTRACT_DATA_PROMPT
  ).invoke({
    content:
      typeof extractedContent === 'string' ? extractedContent : JSON.stringify(extractedContent),
    filename: document.filename,
    documentId: document.documentId,
  });
  const result = await structuredOutputModel.invoke(classificationPrompt);

  return {
    ...document,
    documentId: document.documentId,
    type: result.type,
    confidence: result.confidence,
    extractedData: {
      vendor: result.vendor,
      amount: result.amount,
      date: result.date,
      poNumber: result.poNumber,
      invoiceNumber: result.invoiceNumber,
      paymentReference: result.paymentReference,
      poReference: result.poReference,
      invoiceReference: result.invoiceReference,
    },
    reasoning: result.reasoning,
  };
}
