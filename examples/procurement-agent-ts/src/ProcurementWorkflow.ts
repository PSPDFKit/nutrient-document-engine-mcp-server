/**
 * Procurement Workflow
 *
 * Orchestrates the document processing pipeline for procurement automation.
 * The workflow processes documents through three sequential stages:
 * 1. Upload - Uploads documents to the Document Engine
 * 2. Classify - Uses AI to classify documents as PO, Invoice, or Payment
 * 3. Match - Performs intelligent 3-way matching between related documents
 */

import { END, START, StateGraph } from '@langchain/langgraph';
import { ConfigurationSchema, WorkflowStateAnnotation } from './State';
import { classifyDocumentsNode } from './nodes/ClassificationNode';
import { matchDocumentsNode } from './nodes/MatchingNode';
import { uploadNode } from './nodes/UploadNode';

export const procurementWorkflow = new StateGraph(WorkflowStateAnnotation, ConfigurationSchema)
  .addNode('upload', uploadNode)
  .addNode('classify', classifyDocumentsNode)
  .addNode('match', matchDocumentsNode)

  .addEdge(START, 'upload')
  .addEdge('upload', 'classify')
  .addEdge('classify', 'match')
  .addEdge('match', END)
  .compile();
