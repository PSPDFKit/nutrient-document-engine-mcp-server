import { z } from 'zod';

import { DocumentEngineClient } from '../../api/Client.js';
import { PageLayout } from '../../api/DocumentEngineSchema.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { applyDocumentInstructions, getDocumentInfo } from '../../api/DocumentLayerAbstraction.js';
import { MCPToolOutput } from '../../mcpTools.js';

/**
 * Add New Page Tool
 *
 * Adds a new blank page to a document at the specified position.
 * Supports different page sizes and orientations.
 */

export const AddNewPageSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  position: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('Position where to add the new page (0-based index, defaults to end of document)'),
  page_size: z
    .enum(['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Letter', 'Legal'])
    .default('A4')
    .optional(),
  orientation: z.enum(['portrait', 'landscape']).default('portrait').optional(),
  count: z
    .number()
    .int()
    .min(1)
    .default(1)
    .optional()
    .describe('Number of new pages to add (defaults to 1)'),
};

const AddNewPageInputSchema = z.object(AddNewPageSchema);
type AddNewPageInput = z.infer<typeof AddNewPageInputSchema>;

/**
 * Add a new blank page to a document
 */
export async function addNewPage(
  client: DocumentEngineClient,
  params: AddNewPageInput
): Promise<MCPToolOutput> {
  const startTime = Date.now();

  try {
    // Validate input
    const validatedParams = AddNewPageInputSchema.parse(params);
    const { document_fingerprint, position, page_size, orientation, count = 1 } = validatedParams;

    // Get original document information
    const documentInfo = await getDocumentInfo(client, document_fingerprint);
    const originalPageCount = documentInfo.pageCount;

    // Validate position if specified
    if (position !== undefined && (position < 0 || position > originalPageCount)) {
      throw new Error(
        `Position ${position} is out of bounds (document has ${originalPageCount} pages)`
      );
    }

    const pageLayout: PageLayout = {
      size: page_size,
      orientation: orientation,
    };

    // Create parts array based on position
    let parts = [];

    if (position === 0) {
      // If the page is at the start, the `page: 'new'` should be first, then the document (#self)
      parts = [
        {
          page: 'new' as const,
          pageCount: count,
          layout: pageLayout,
        },
        {
          document: {
            id: '#self',
          },
        },
      ];
    } else if (position === undefined || position === originalPageCount) {
      // If the page is at the end, we have document (#self) first, and the new page at the end
      parts = [
        {
          document: {
            id: '#self',
          },
        },
        {
          page: 'new' as const,
          pageCount: count,
          layout: pageLayout,
        },
      ];
    } else {
      // If the page is in the middle, we have document (#self), then the new page, then document (#self) with the remainder of the document
      parts = [
        {
          document: {
            id: '#self',
          },
          pages: {
            start: 0,
            end: position - 1,
          },
        },
        {
          page: 'new' as const,
          pageCount: count,
          layout: pageLayout,
        },
        {
          document: {
            id: '#self',
          },
          pages: {
            start: position,
            // -1 denote the end of the document.
            end: -1,
          },
        },
      ];
    }

    await applyDocumentInstructions(client, document_fingerprint, {
      parts: parts,
    });

    // For add new page, we need to get updated document info
    const updatedDocInfo = await getDocumentInfo(client, document_fingerprint);
    const result = {
      title: updatedDocInfo.title || `Document ${document_fingerprint.document_id}`,
      pageCount: updatedDocInfo.pageCount,
    };

    const processingTime = Date.now() - startTime;

    // Determine the position where the page was added
    const positionDescription =
      position !== undefined
        ? `at position ${position} (0-based index)`
        : `at the end (position ${originalPageCount})`;

    // Build the markdown response
    let markdown = `# New ${count > 1 ? 'Pages' : 'Page'} Added Successfully\n\n`;
    markdown += `✅ **Status:** ${count} new ${count > 1 ? 'pages' : 'page'} added  \n`;
    markdown += `📄 **Document Title:** ${result.title}  \n`;
    markdown += `📊 **New Page Count:** ${result.pageCount}  \n\n`;
    markdown += `---\n\n`;

    // Page details section
    markdown += `## Page Details\n`;
    markdown += `- **Page Size:** ${page_size}\n`;
    markdown += `- **Orientation:** ${orientation ? orientation.charAt(0).toUpperCase() + orientation.slice(1) : 'Default'}\n`;
    markdown += `- **Position:** ${positionDescription}\n\n`;
    markdown += `---\n\n`;

    // Operation summary section
    markdown += `## Operation Summary\n`;
    markdown += `- **Original Page Count:** ${originalPageCount}\n`;
    markdown += `- **Pages Added:** ${count}\n`;
    markdown += `- **New Page Count:** ${originalPageCount + count}\n`;
    markdown += `- **Processing Time:** ${(processingTime / 1000).toFixed(1)} seconds\n`;
    markdown += `- **Status:** Complete\n\n`;
    markdown += `---\n\n`;

    return { markdown };
  } catch (error: unknown) {
    // Return error in markdown format
    let errorMarkdown = `# Error Adding New Page\n\n`;
    errorMarkdown += `❌ **Status:** Failed  \n`;
    errorMarkdown += `An error occurred while trying to add a new page to the document: ${error instanceof Error ? error.message : 'Unknown error'}\n\n`;
    errorMarkdown += `**Document ID:** ${params.document_fingerprint?.document_id || 'Unknown'}  \n`;
    if (params.document_fingerprint?.layer) {
      errorMarkdown += `**Layer:** ${params.document_fingerprint.layer}  \n`;
    }

    if (params.position !== undefined) {
      errorMarkdown += `**Position:** ${params.position}  \n`;
    }

    if (params.page_size) {
      errorMarkdown += `**Page Size:** ${params.page_size}  \n`;
    }

    if (params.orientation) {
      errorMarkdown += `**Orientation:** ${params.orientation}  \n`;
    }

    if (params.count && params.count > 1) {
      errorMarkdown += `**Count:** ${params.count}  \n`;
    }

    errorMarkdown += `\n## Troubleshooting Tips\n`;
    errorMarkdown += `1. Verify the document ID is correct\n`;
    errorMarkdown += `2. Check that the position is within the document's page range\n`;
    errorMarkdown += `3. Ensure the document is not locked or protected\n`;
    errorMarkdown += `4. Try using default page size and orientation\n\n`;
    errorMarkdown += `Please check your parameters and try again.`;

    return { markdown: errorMarkdown };
  }
}
