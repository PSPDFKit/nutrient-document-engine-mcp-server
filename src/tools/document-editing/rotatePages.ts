import { z } from 'zod';

import { handleApiError } from '../../utils/ErrorHandling.js';
import { DocumentEngineClient } from '../../api/Client.js';
import { BuildInstructions, RotateAction } from '../../api/DocumentEngineSchema.js';
import {
  DocumentFingerprint,
  DocumentFingerprintSchema,
} from '../schemas/DocumentFingerprintSchema.js';
import { applyDocumentInstructions, getDocumentInfo } from '../../api/DocumentLayerAbstraction.js';
import { MCPToolOutput } from '../../mcpTools.js';

/**
 * Rotate Pages Tool
 *
 * Rotates a given set of pages in a document in 90 degree increments.
 * Supports rotating specific pages or page ranges.
 */

const rotationSchema = z
  .union([z.literal(90), z.literal(180), z.literal(270)])
  .describe('Rotation angle in degrees (must be 90, 180, or 270)');

export const RotatePagesSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  pages: z
    .array(z.number().int().min(0))
    .min(1, 'At least one page is required')
    .describe('Array of page indices to rotate (0-based indexing)'),
  rotation: rotationSchema,
};

const RotatePagesInputSchema = z.object(RotatePagesSchema);
type RotatePagesInput = z.infer<typeof RotatePagesInputSchema>;
type Rotation = z.infer<typeof rotationSchema>;

/**
 * Validate page indices and convert to 1-based page numbers for the API
 */
function validateAndConvertPages(pages: number[], pageCount: number): number[] {
  const convertedPages: number[] = [];

  for (const pageIndex of pages) {
    // Validate page index
    if (pageIndex < 0 || pageIndex >= pageCount) {
      throw new Error(
        `Page index ${pageIndex} is out of bounds (document has ${pageCount} pages, valid indices are 0-${pageCount - 1})`
      );
    }

    // Convert 0-based index to 1-based page number for the API
    convertedPages.push(pageIndex + 1);
  }

  return convertedPages;
}

/**
 * Rotate pages using document-apply-instructions API
 */
async function applyPageRotation(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  pageNumbers: number[],
  rotation: Rotation,
  pageCount: number
): Promise<{ documentId: string }> {
  try {
    const rotatePageAction: RotateAction = {
      type: 'rotate',
      rotateBy: rotation,
    };

    // Create a set of page indices (0-based) that need to be rotated
    const pagesToRotate = new Set(pageNumbers.map(pageNum => pageNum - 1));

    // Create parts array for build instructions in page order
    const parts = [];

    // Process all pages in sequential order to maintain page sequence
    for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
      if (pagesToRotate.has(pageIndex)) {
        // This page needs to be rotated
        parts.push({
          document: {
            id: '#self',
          },
          pages: { start: pageIndex, end: pageIndex },
          actions: [rotatePageAction],
        });
      } else {
        // This page should not be rotated - include it as-is
        parts.push({
          document: {
            id: '#self',
          },
          pages: { start: pageIndex, end: pageIndex },
        });
      }
    }

    // Create build instructions with the parts
    const buildInstructions: BuildInstructions = {
      parts: parts,
    };

    await applyDocumentInstructions(client, fingerprint, buildInstructions);
    return { documentId: fingerprint.document_id };
  } catch (error: unknown) {
    throw handleApiError(error);
  }
}

/**
 * Format rotation direction for display
 */
function formatRotationDirection(rotation: number): string {
  switch (rotation) {
    case 90:
      return 'Clockwise (90°)';
    case 180:
      return 'Upside down (180°)';
    case 270:
      return 'Counter-clockwise (270°)';
    default:
      return `${rotation}°`;
  }
}

/**
 * Rotate pages in a document
 */
export async function rotatePages(
  client: DocumentEngineClient,
  params: RotatePagesInput
): Promise<MCPToolOutput> {
  const startTime = Date.now();

  try {
    // Validate input
    const validatedParams = RotatePagesInputSchema.parse(params);
    const { document_fingerprint, pages, rotation } = validatedParams;

    // Get document information
    const documentInfo = await getDocumentInfo(client, document_fingerprint);
    const pageCount = documentInfo.pageCount;

    // Validate page indices and convert to 1-based page numbers for the API
    const pageNumbers = validateAndConvertPages(pages, pageCount);

    // Rotate the pages
    const result = await applyPageRotation(
      client,
      document_fingerprint,
      pageNumbers,
      rotation,
      pageCount
    );

    const processingTime = Date.now() - startTime;

    // Build the markdown response
    let markdown = `# Pages Rotated Successfully\n\n`;
    markdown += `✅ **Status:** Pages rotated  \n`;
    markdown += `📄 **Document ID:** ${result.documentId}  \n`;
    if (document_fingerprint.layer) {
      markdown += `🏷️ **Layer:** ${document_fingerprint.layer}  \n`;
    }
    markdown += `📊 **Pages Rotated:** ${pageNumbers.length} page${pageNumbers.length === 1 ? '' : 's'}  \n`;
    markdown += `🔄 **Rotation Applied:** ${rotation}°  \n\n`;
    markdown += `---\n\n`;

    // Rotation details section
    markdown += `## Rotation Details\n`;
    markdown += `- **Rotation:** ${formatRotationDirection(rotation)}\n`;

    // Group consecutive pages for cleaner display
    const pageGroups: string[] = [];
    let currentGroup: number[] = [];

    // Convert 1-based page numbers back to 0-based indices for display
    const pageIndices = pageNumbers.map(pageNum => pageNum - 1);

    [...pageIndices]
      .sort((a, b) => a - b)
      .forEach((page, index, sortedPages) => {
        if (index === 0 || page !== sortedPages[index - 1] + 1) {
          if (currentGroup.length > 0) {
            pageGroups.push(
              currentGroup.length === 1
                ? `Page ${currentGroup[0]}`
                : `Pages ${currentGroup[0]}-${currentGroup[currentGroup.length - 1]}`
            );
            currentGroup = [];
          }
          currentGroup.push(page);
        } else {
          currentGroup.push(page);
        }

        if (index === sortedPages.length - 1 && currentGroup.length > 0) {
          pageGroups.push(
            currentGroup.length === 1
              ? `Page ${currentGroup[0]}`
              : `Pages ${currentGroup[0]}-${currentGroup[currentGroup.length - 1]}`
          );
        }
      });

    markdown += `- **Detailed Page List:** ${pageGroups.join(', ')}\n\n`;
    markdown += `---\n\n`;

    // Operation summary section
    markdown += `## Operation Summary\n`;
    markdown += `- **Total Document Pages:** ${pageCount}\n`;
    markdown += `- **Pages Rotated:** ${pageNumbers.length}/${pageCount}\n`;
    markdown += `- **Processing Time:** ${(processingTime / 1000).toFixed(1)} seconds\n`;
    markdown += `- **Status:** Complete\n\n`;
    markdown += `---\n\n`;

    return { markdown };
  } catch (error: unknown) {
    // Return error in markdown format
    let errorMarkdown = `# Error Rotating Pages\n\n`;
    errorMarkdown += `❌ **Status:** Failed  \n`;
    errorMarkdown += `An error occurred while trying to rotate pages in the document: ${error instanceof Error ? error.message : 'Unknown error'}\n\n`;
    errorMarkdown += `**Document ID:** ${params.document_fingerprint?.document_id || 'Unknown'}  \n`;
    if (params.document_fingerprint?.layer) {
      errorMarkdown += `**Layer:** ${params.document_fingerprint.layer}  \n`;
    }
    errorMarkdown += `**Pages:** ${params.pages ? JSON.stringify(params.pages) : 'None provided'}  \n`;
    errorMarkdown += `**Rotation:** ${params.rotation}°  \n\n`;
    errorMarkdown += `## Troubleshooting Tips\n`;
    errorMarkdown += `1. Verify the document ID is correct\n`;
    errorMarkdown += `2. Check that the page indices are valid and within document bounds (0-based indexing)\n`;
    errorMarkdown += `3. Ensure the rotation angle is one of the supported values (90, 180, 270)\n`;
    errorMarkdown += `4. Verify the document is not locked or protected\n\n`;
    errorMarkdown += `Please check your parameters and try again.`;

    return { markdown: errorMarkdown };
  }
}
