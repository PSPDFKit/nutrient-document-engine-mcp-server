import { ZodRawShape, ZodObject, infer as ZodInfer } from 'zod';
import { listDocuments, ListDocumentsSchema } from './tools/discovery/listDocuments.js';
import { readDocumentInfo, ReadDocumentInfoSchema } from './tools/discovery/readDocumentInfo.js';
import { extractText, ExtractTextSchema } from './tools/extraction/extractText.js';
import { search, SearchSchema } from './tools/extraction/search.js';
import { extractTables, ExtractTablesSchema } from './tools/extraction/extractTables.js';
import {
  renderDocumentPage,
  RenderDocumentPageSchema,
} from './tools/extraction/renderDocumentPage.js';
import { extractFormData, ExtractFormDataSchema } from './tools/forms/extractFormData.js';
import { fillFormFields, FillFormFieldSchema } from './tools/forms/fillFormFields.js';
import { addAnnotation, AddAnnotationSchema } from './tools/annotations/addAnnotation.js';
import { splitDocument, SplitDocumentSchema } from './tools/document-editing/splitDocument.js';
import { addWatermark, AddWatermarkSchema } from './tools/document-editing/addWatermark.js';
import { createRedaction, CreateRedactionSchema } from './tools/annotations/createRedaction.js';
import { applyRedactions, ApplyRedactionsSchema } from './tools/annotations/applyRedactions.js';
import { healthCheck, HealthCheckSchema } from './tools/healthCheck.js';
import { readAnnotations, ReadAnnotationsSchema } from './tools/annotations/readAnnotations.js';
import {
  deleteAnnotations,
  DeleteAnnotationsSchema,
} from './tools/annotations/deleteAnnotations.js';
import {
  duplicateDocument,
  DuplicateDocumentSchema,
} from './tools/document-editing/duplicateDocument.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { DocumentEngineClient } from './api/Client.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { ServerNotification, ServerRequest } from '@modelcontextprotocol/sdk/types.js';
import { logger } from './utils/Logger.js';
import {
  extractKeyValuePairs,
  ExtractKeyValuePairsSchema,
} from './tools/extraction/extractKeyValuePairs.js';
import { addNewPage, AddNewPageSchema } from './tools/document-editing/addNewPage.js';
import {
  mergeDocumentPages,
  MergeDocumentPagesSchema,
} from './tools/document-editing/mergeDocumentPages.js';
import { rotatePages, RotatePagesSchema } from './tools/document-editing/rotatePages.js';

export type MCPToolOutput = {
  markdown: string;
  images?: Array<{
    mimeType: string;
    base64: string;
    pageIndex: number;
  }>;
};

type MCPToolCallback = (
  client: DocumentEngineClient,
  args: Record<string, unknown>,
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>
) => CallToolResult | Promise<CallToolResult>;

/**
 * Type definition for MCP tool registration
 */
export type MCPTool = {
  name: string;
  schema: ZodRawShape;
  handler: MCPToolCallback;
};

/**
 * Wraps a tool function with entry/exit logging
 */
async function withLogging<T, R>(
  toolName: string,
  extras: RequestHandlerExtra<ServerRequest, ServerNotification>,
  toolFn: (client: DocumentEngineClient, params: T) => Promise<R>,
  client: DocumentEngineClient,
  params: T
): Promise<R> {
  let messagePrefix = `[${toolName}]`;
  if (extras.sessionId) messagePrefix += `[s=${extras.sessionId}]`;
  if (extras.requestId) messagePrefix += `[r=${extras.requestId}]`;

  logger.info(`${messagePrefix} START`, params);

  try {
    const result = await toolFn(client, params);
    logger.debug(`${messagePrefix} END`, result);
    logger.info(`${messagePrefix} END`);
    return result;
  } catch (error) {
    logger.error(`${messagePrefix} END`, {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * Creates a tool handler with automatic logging
 */
function createToolHandler<TParams>(
  toolFn: (client: DocumentEngineClient, params: TParams) => Promise<MCPToolOutput>
): (toolName: string) => MCPToolCallback {
  return (toolName: string) => async (client, params, extras) => {
    const result = await withLogging(toolName, extras, toolFn, client, params as TParams);

    // Create the content array with the markdown text
    const textContent = {
      type: 'text' as const,
      text: result.markdown,
    };

    // Create image content items
    const imageContents = result.images
      ? result.images.map(image => ({
          type: 'image' as const,
          data: image.base64,
          mimeType: image.mimeType,
        }))
      : [];

    // Combine text and image content
    return {
      content: [textContent, ...imageContents],
    };
  };
}

/**
 * Helper function to create a tool definition with automatic handler creation
 */
function createTool<TSchema extends ZodRawShape>(
  name: string,
  schema: TSchema,
  toolFn: (
    client: DocumentEngineClient,
    params: ZodInfer<ZodObject<TSchema>>
  ) => Promise<MCPToolOutput>
): MCPTool {
  return {
    name,
    schema,
    handler: createToolHandler(toolFn)(name),
  };
}

/**
 * Creates and returns the array of tools to register with the MCP server
 * @param client The Document Engine client instance
 * @returns Array of MCPTool objects
 */
export const mcpToolsToRegister: MCPTool[] = [
  // Document Discovery
  createTool('read_document_info', ReadDocumentInfoSchema, readDocumentInfo),
  createTool('list_documents', ListDocumentsSchema, listDocuments),

  // Extraction
  createTool('search', SearchSchema, search),
  createTool('extract_text', ExtractTextSchema, extractText),
  createTool('extract_form_data', ExtractFormDataSchema, extractFormData),
  createTool('extract_key_value_pairs', ExtractKeyValuePairsSchema, extractKeyValuePairs),
  createTool('extract_tables', ExtractTablesSchema, extractTables),
  createTool('render_document_page', RenderDocumentPageSchema, renderDocumentPage),

  // Annotations
  createTool('create_redaction', CreateRedactionSchema, createRedaction),
  createTool('apply_redactions', ApplyRedactionsSchema, applyRedactions),
  createTool('add_annotation', AddAnnotationSchema, addAnnotation),
  createTool('read_annotations', ReadAnnotationsSchema, readAnnotations),
  createTool('delete_annotations', DeleteAnnotationsSchema, deleteAnnotations),

  // Forms
  createTool('fill_form_fields', FillFormFieldSchema, fillFormFields),

  // Document Editing
  createTool('split_document', SplitDocumentSchema, splitDocument),
  createTool('add_watermark', AddWatermarkSchema, addWatermark),
  createTool('duplicate_document', DuplicateDocumentSchema, duplicateDocument),
  createTool('add_new_page', AddNewPageSchema, addNewPage),
  createTool('rotate_pages', RotatePagesSchema, rotatePages),
  createTool('merge_document_pages', MergeDocumentPagesSchema, mergeDocumentPages),

  // Miscellaneous
  createTool('health_check', HealthCheckSchema, healthCheck),
];
