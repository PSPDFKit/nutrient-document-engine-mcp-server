import { z } from 'zod';

import { handleApiError } from '../../utils/ErrorHandling.js';
import { DocumentEngineClient } from '../../api/Client.js';
import { BuildInstructions, Part, PageRange } from '../../api/DocumentEngineSchema.js';
import {
  DocumentFingerprint,
  DocumentFingerprintSchema,
} from '../schemas/DocumentFingerprintSchema.js';
import { MCPToolOutput } from '../../mcpTools.js';
import { getDocumentInfo } from '../../api/DocumentLayerAbstraction.js';

/**
 * Merge Document Pages Tool
 *
 * Merges two or more documents together, where the order in the array of documents
 * defines the order of which document pages are passed are the order of the final document.
 * Each part consists of a documentID, along with the page range to take for the final document.
 */

// Create a Zod schema for PageRange
const PageRangeSchema = z.object({
  start: z.number().optional(),
  end: z.number().optional(),
});

export const MergeDocumentPagesSchema = {
  parts: z
    .array(
      z.object({
        document_fingerprint: DocumentFingerprintSchema,
        page_range: PageRangeSchema.optional().describe(
          'Range of pages to include with start and end indices (0-based)'
        ),
      })
    )
    .min(1, 'At least one document part is required'),
  title: z
    .string()
    .optional()
    .describe('Title for the merged document (defaults to "Merged Document")'),
};

const MergeDocumentPagesInputSchema = z.object(MergeDocumentPagesSchema);
type MergeDocumentPagesInput = z.infer<typeof MergeDocumentPagesInputSchema>;

/**
 * Validate page range object
 */
function validatePageRange(pageRange: PageRange, pageCount: number): void {
  // If start is provided, validate it
  if (pageRange.start !== undefined) {
    if (pageRange.start < 0 || pageRange.start >= pageCount) {
      throw new Error(
        `Page range start ${pageRange.start} is out of bounds (document has ${pageCount} pages, valid indices are 0-${pageCount - 1})`
      );
    }
  }

  // If end is provided, validate it
  if (pageRange.end !== undefined) {
    if (pageRange.end < 0 || pageRange.end >= pageCount) {
      throw new Error(
        `Page range end ${pageRange.end} is out of bounds (document has ${pageCount} pages, valid indices are 0-${pageCount - 1})`
      );
    }
  }

  // If both start and end are provided, validate that start <= end
  if (
    pageRange.start !== undefined &&
    pageRange.end !== undefined &&
    pageRange.start > pageRange.end
  ) {
    throw new Error(
      `Invalid page range: start (${pageRange.start}) must be less than or equal to end (${pageRange.end})`
    );
  }
}

/**
 * Merge document pages using document-create-from-instructions API
 */
async function mergeDocuments(
  client: DocumentEngineClient,
  parts: Array<{
    fingerprints: DocumentFingerprint;
    pageRange?: PageRange;
  }>,
  title: string = 'Merged Document'
): Promise<DocumentFingerprint> {
  try {
    // Create build instructions to merge the documents
    const buildParts: Part[] = [];

    for (const part of parts) {
      if (!part.pageRange) {
        // If no specific page range is specified, include the entire document
        buildParts.push({
          document: {
            id: part.fingerprints.document_id,
            layer: part.fingerprints.layer,
          },
        });
      } else {
        // If a page range is provided, include it
        buildParts.push({
          document: {
            id: part.fingerprints.document_id,
            layer: part.fingerprints.layer,
          },
          pages: part.pageRange,
        });
      }
    }

    const buildInstructions: BuildInstructions = {
      parts: buildParts,
    };

    // Create a new document with the merged content
    const result = await client['upload-document'](
      {},
      {
        instructions: buildInstructions,
        title: title,
      }
    );
    if (!result.data?.data?.document_id) {
      throw new Error('Invalid response from Document Engine API');
    }
    return { document_id: result.data.data.document_id };
  } catch (error: unknown) {
    throw handleApiError(error);
  }
}

/**
 * Merge multiple documents with specified page ranges
 */
export async function mergeDocumentPages(
  client: DocumentEngineClient,
  params: MergeDocumentPagesInput
): Promise<MCPToolOutput> {
  const startTime = Date.now();

  try {
    // Validate input
    const validatedParams = MergeDocumentPagesInputSchema.parse(params);
    const { parts, title } = validatedParams;

    // Process each document part
    const processedParts = [];
    const documentInfoMap = new Map<string, { pageCount: number; title?: string }>();

    for (const part of parts) {
      const key = `${part.document_fingerprint.document_id}:${part.document_fingerprint.layer || ''}`;
      // Get document info if not already cached
      if (!documentInfoMap.has(key)) {
        const documentInfo = await getDocumentInfo(client, part.document_fingerprint);
        documentInfoMap.set(key, {
          pageCount: documentInfo.pageCount,
          title: documentInfo.title || 'Untitled Document',
        });
      }

      const documentInfo = documentInfoMap.get(key)!;

      // Validate page range if specified
      if (part.page_range) {
        validatePageRange(part.page_range, documentInfo.pageCount);
      }

      processedParts.push({
        documentFingerprint: part.document_fingerprint,
        pageRange: part.page_range,
        documentInfo,
      });
    }

    // Merge the documents
    const mergeResult = await mergeDocuments(
      client,
      processedParts.map(part => ({
        fingerprints: part.documentFingerprint,
        pageRange: part.pageRange,
      })),
      title
    );

    const processingTime = Date.now() - startTime;

    // Calculate total pages in the merged document
    let totalPages = 0;
    for (const part of processedParts) {
      if (part.pageRange) {
        // If page range is specified, calculate the number of pages in the range
        const start = part.pageRange.start ?? 0;
        const end = part.pageRange.end ?? part.documentInfo.pageCount - 1;
        totalPages += end - start + 1;
      } else {
        totalPages += part.documentInfo.pageCount;
      }
    }

    // Build the markdown response
    let markdown = `# Documents Merged Successfully\n\n`;
    markdown += `✅ **Status:** Documents merged  \n`;
    markdown += `📄 **New Document ID:** ${mergeResult.document_id}  \n`;
    markdown += `📑 **Document Title:** ${title || 'Merged Document'}  \n`;
    markdown += `📊 **Total Pages:** ${totalPages}  \n\n`;
    markdown += `---\n\n`;

    // Document parts section
    markdown += `## Document Parts\n`;

    for (let i = 0; i < processedParts.length; i++) {
      const part = processedParts[i];
      const docTitle = part.documentInfo.title || `Document ${i + 1}`;

      markdown += `### Part ${i + 1}: ${docTitle}\n`;
      markdown += `- **Document ID:** ${part.documentFingerprint.document_id}\n`;
      if (part.documentFingerprint.layer) {
        markdown += `- **Layer Name:** ${part.documentFingerprint.layer}\n`;
      }
      markdown += `- **Total Pages:** ${part.documentInfo.pageCount}\n`;

      if (part.pageRange) {
        const start = part.pageRange.start ?? 0;
        const end = part.pageRange.end ?? part.documentInfo.pageCount - 1;
        const pageCount = end - start + 1;

        if (part.pageRange.start !== undefined && part.pageRange.end !== undefined) {
          markdown += `- **Pages Included:** ${part.pageRange.start} to ${part.pageRange.end} (0-based indices)\n`;
        } else if (part.pageRange.start !== undefined) {
          markdown += `- **Pages Included:** ${part.pageRange.start} to end\n`;
        } else if (part.pageRange.end !== undefined) {
          markdown += `- **Pages Included:** 0 to ${part.pageRange.end}\n`;
        }

        markdown += `- **Number of Pages Included:** ${pageCount}\n`;
      } else {
        markdown += `- **Pages Included:** All pages\n`;
        markdown += `- **Number of Pages Included:** ${part.documentInfo.pageCount}\n`;
      }

      markdown += `\n`;
    }

    markdown += `---\n\n`;

    // Merge summary section
    markdown += `## Merge Summary\n`;
    markdown += `- **Documents Merged:** ${processedParts.length}\n`;
    markdown += `- **Total Pages in New Document:** ${totalPages}\n`;
    markdown += `- **Processing Time:** ${(processingTime / 1000).toFixed(1)} seconds\n`;
    markdown += `- **Status:** Complete\n\n`;
    markdown += `---\n\n`;

    return { markdown };
  } catch (error: unknown) {
    // Return error in markdown format
    let errorMarkdown = `# Error Merging Documents\n\n`;
    errorMarkdown += `❌ **Status:** Failed  \n`;
    errorMarkdown += `An error occurred while trying to merge the documents: ${error instanceof Error ? error.message : 'Unknown error'}\n\n`;

    errorMarkdown += `## Document Parts That Failed to Merge\n`;
    for (let i = 0; i < params.parts.length; i++) {
      const part = params.parts[i];
      let pageRangeInfo = '';

      if (part.page_range) {
        if (part.page_range.start !== undefined && part.page_range.end !== undefined) {
          pageRangeInfo = `, Pages ${part.page_range.start} to ${part.page_range.end}`;
        } else if (part.page_range.start !== undefined) {
          pageRangeInfo = `, Pages ${part.page_range.start} to end`;
        } else if (part.page_range.end !== undefined) {
          pageRangeInfo = `, Pages 0 to ${part.page_range.end}`;
        }
      }

      errorMarkdown += `- **Part ${i + 1}:** Document ID ${part.document_fingerprint.document_id}${pageRangeInfo}\n`;
    }

    errorMarkdown += `\n## Troubleshooting Tips\n`;
    errorMarkdown += `1. Verify all document IDs are correct\n`;
    errorMarkdown += `2. Check that page ranges are valid and within document bounds\n`;
    errorMarkdown += `3. Ensure all documents are accessible\n`;
    errorMarkdown += `4. Try merging fewer documents at once\n\n`;
    errorMarkdown += `Please check your parameters and try again.`;

    return { markdown: errorMarkdown };
  }
}
