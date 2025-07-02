import { DocumentEngineClient } from '../../api/Client.js';
import { z } from 'zod';
import { formatFileSize } from '../../utils/Common.js';
import { MCPToolOutput } from '../../mcpTools.js';
import { listDocumentLayers } from '../../api/DocumentLayerAbstraction.js';

/**
 * Schema for list_documents tool
 */
export const ListDocumentsSchema = {
  limit: z.number().optional().describe('Maximum number of documents to return'),
  offset: z.number().optional().describe('Number of documents to skip'),
  sort_by: z.enum(['created_at', 'title']).optional().describe('Field to sort by'),
  sort_order: z.enum(['asc', 'desc']).optional().describe('Sort order'),
  cursor: z.string().optional().describe('Pagination cursor for fetching next/previous page'),
  title: z.string().optional().describe('Filter documents by title'),
  count_remaining: z.boolean().optional().describe('Include count of remaining documents'),
};

export const ListDocumentsInputSchema = z.object(ListDocumentsSchema);
export type ListDocumentsInput = z.infer<typeof ListDocumentsInputSchema>;

/**
 * List documents from Document Engine API
 */
export async function listDocuments(
  client: DocumentEngineClient,
  params: ListDocumentsInput
): Promise<MCPToolOutput> {
  try {
    // Validate input
    const validatedParams = ListDocumentsInputSchema.parse(params);
    const {
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'desc',
      cursor,
      title,
      count_remaining = false,
    } = validatedParams;

    // Call the Document Engine API to get the list of documents
    const response = await client['list-documents']({
      page_size: limit,
      order_by: sort_by,
      order_direction: sort_order,
      count_remaining: count_remaining,
      cursor,
      title,
    });

    const {
      data: documents = [],
      next_cursor,
      prev_cursor,
      document_count = 0,
      prev_document_count = 0,
      next_document_count = 0,
    } = response.data;

    // Build the markdown content
    let markdown = `# Document List\n\n`;
    markdown += `Found ${document_count} documents`;

    if (count_remaining) {
      markdown += ` (${prev_document_count} before, ${next_document_count} after current page)`;
    }

    markdown += `:\n\n`;

    // Add pagination information if cursors are available
    if (prev_cursor || next_cursor) {
      markdown += `## Pagination\n`;
      if (prev_cursor) {
        markdown += `- **Previous Page Cursor:** \`${prev_cursor}\`\n`;
      }
      if (next_cursor) {
        markdown += `- **Next Page Cursor:** \`${next_cursor}\`\n`;
      }
      markdown += `\n`;
    }

    // List documents with layer information
    for (const doc of documents) {
      markdown += `## Title: ${doc.title || 'Untitled Document'}\n`;
      markdown += `- **Document ID:** ${doc.id}\n`;

      if (doc.createdAt) {
        markdown += `- **Created:** ${doc.createdAt}\n`;
      }

      if (doc.byteSize !== undefined) {
        markdown += `- **Size:** ${formatFileSize(doc.byteSize)}\n`;
      }

      // Fetch layers for this document
      try {
        const layersResponse = await listDocumentLayers(client, doc.id);
        const layers = layersResponse.data?.data || [];

        if (layers.length > 0) {
          markdown += `- **Available Layers:** ${layers.join(', ')}\n`;
        } else {
          markdown += `- **Available Layers:** None\n`;
        }
      } catch {
        markdown += `- **Available Layers:** Error fetching layers\n`;
      }

      markdown += `\n`;
    }

    markdown += `---\n\n`;
    markdown += 'When responding to the user you should refer to the documents with their titles.';

    // If no documents were found
    if (documents.length === 0) {
      markdown += `No documents found.\n`;
    }

    return { markdown };
  } catch (error) {
    // Provide a more user-friendly error message
    return {
      markdown: `# Error Listing Documents\n\nAn error occurred while trying to list documents: ${error instanceof Error ? error.message : String(error)}\n\nPlease check your connection and try again.`,
    };
  }
}
