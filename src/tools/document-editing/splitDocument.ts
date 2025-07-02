import { z } from 'zod';

import { handleApiError } from '../../utils/ErrorHandling.js';
import { DocumentEngineClient } from '../../api/Client.js';
import {
  DocumentFingerprint,
  DocumentFingerprintSchema,
} from '../schemas/DocumentFingerprintSchema.js';
import { BuildInstructions, DocumentPart } from '../../api/DocumentEngineSchema.js';
import {
  applyDocumentInstructions,
  copyDocument,
  getDocumentInfo,
} from '../../api/DocumentLayerAbstraction.js';
import { MCPToolOutput } from '../../mcpTools.js';

/**
 * Split Document Tool
 *
 * Splits a document at specified page numbers by creating separate document copies
 * and removing unwanted pages from each copy.
 */

export const SplitDocumentSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  split_points: z
    .array(z.number().int().min(0))
    .min(1, 'At least one split point is required')
    .describe(
      'Array of page numbers where the document should be split. Each number represents the first page of a new document section (0-based indexing). For example, [3, 7] would create 3 documents: pages 0-2, pages 3-6, and pages 7-end.'
    ),
  naming_pattern: z.string().optional().default('part_{index}'),
};

const SplitDocumentInputSchema = z.object(SplitDocumentSchema);
type SplitDocumentInput = z.infer<typeof SplitDocumentInputSchema>;

interface SplitDocumentPart {
  fingerprint: DocumentFingerprint;
  title: string;
  startPage: number;
  endPage: number;
  pageCount: number;
  contentDescription?: string;
}

/**
 * Format operation type for display
 */
function formatPartName(pattern: string, index: number): string {
  return pattern.replace('{index}', (index + 1).toString());
}

/**
 * Generate content description based on page range
 */
function generateContentDescription(
  startPage: number,
  endPage: number,
  totalParts: number
): string {
  if (totalParts === 2) {
    return startPage === 1 ? 'First part' : 'Second part';
  } else if (totalParts === 3) {
    if (startPage === 1) return 'First part';
    if (endPage === totalParts) return 'Final part';
    return 'Middle part';
  } else {
    if (startPage === 1) return 'Opening section';
    if (endPage === totalParts) return 'Closing section';
    return `Section ${Math.ceil((startPage + endPage) / 2)}`;
  }
}

/**
 * Remove pages from a document using apply_instructions with multiple DocumentParts and page ranges
 */
async function removePages(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  pageIndexesToRemove: number[]
): Promise<void> {
  try {
    // Get total page count to validate page indexes
    const docInfo = await getDocumentInfo(client, fingerprint);
    const totalPages = docInfo.pageCount;

    // Sort page indexes to remove
    const sortedPageIndexesToRemove = [...pageIndexesToRemove].sort((a, b) => a - b);

    // Validate page indexes
    if (sortedPageIndexesToRemove.some(index => index < 0 || index >= totalPages)) {
      throw new Error(`Page index out of bounds (0-${totalPages - 1})`);
    }

    // Calculate page ranges to keep (all pages except those in pageIndexesToRemove)
    const pagesToKeep: number[] = [];
    for (let i = 0; i < totalPages; i++) {
      if (!sortedPageIndexesToRemove.includes(i)) {
        pagesToKeep.push(i);
      }
    }

    // Group consecutive pages into ranges
    const pageRanges: Array<{ start: number; end: number }> = [];
    let rangeStart: number | null = null;

    for (let i = 0; i < pagesToKeep.length; i++) {
      const currentPage = pagesToKeep[i];
      const nextPage = pagesToKeep[i + 1];

      // Start a new range if we don't have one
      if (rangeStart === null) {
        rangeStart = currentPage;
      }

      // End the current range if the next page isn't consecutive
      if (nextPage !== currentPage + 1) {
        pageRanges.push({
          start: rangeStart,
          end: currentPage,
        });
        rangeStart = null;
      }
    }

    // Create document parts for each page range
    const parts: DocumentPart[] = pageRanges.map(range => ({
      document: {
        id: fingerprint.document_id,
        layer: fingerprint.layer,
      },
      pages: {
        start: range.start,
        end: range.end,
      },
    }));

    // If there are no parts (all pages were removed), create an empty document
    if (parts.length === 0) {
      return;
    }

    // Create the build instructions with multiple document parts
    const buildInstructions: BuildInstructions = {
      parts: parts,
    };

    await applyDocumentInstructions(client, fingerprint, buildInstructions);
  } catch (error: unknown) {
    throw handleApiError(error);
  }
}

/**
 * Split a document at specified page numbers
 *
 * This implementation:
 * 1. Creates pageRanges.length - 1 duplicates of the original document
 * 2. Uses the original document as the first document
 * 3. For each document, removes all pages outside its designated pageRange
 */
export async function splitDocument(
  client: DocumentEngineClient,
  params: SplitDocumentInput
): Promise<MCPToolOutput> {
  try {
    // Validate input
    const validatedParams = SplitDocumentInputSchema.parse(params);
    const { document_fingerprint, split_points, naming_pattern } = validatedParams;

    // Get original document information
    const originalDocInfo = await getDocumentInfo(client, document_fingerprint);
    const totalPages = originalDocInfo.pageCount;
    const originalTitle = originalDocInfo.title || `Document ${document_fingerprint.document_id}`;

    // Validate split points
    const sortedSplitPoints = [...split_points].sort((a, b) => a - b);
    if (sortedSplitPoints.some(point => point >= totalPages)) {
      throw new Error(`Split point exceeds document page count (${totalPages})`);
    }

    // Calculate page ranges for each part
    const pageRanges: Array<{ start: number; end: number }> = [];
    let currentStart = 1;

    for (const splitPoint of sortedSplitPoints) {
      if (splitPoint >= currentStart) {
        pageRanges.push({ start: currentStart, end: splitPoint });
        currentStart = splitPoint + 1;
      }
    }

    // Add the final range
    if (currentStart <= totalPages) {
      pageRanges.push({ start: currentStart, end: totalPages });
    }

    if (pageRanges.length < 2) {
      throw new Error('Split points must create at least 2 document parts');
    }

    // Create pageRanges.length - 1 duplicates (we'll use the original as the first document)
    const documents: DocumentFingerprint[] = [document_fingerprint]; // Start with original document

    for (let i = 1; i < pageRanges.length; i++) {
      const documentId = await copyDocument(client, document_fingerprint);
      documents.push({ document_id: documentId });
    }

    // Create document parts
    const parts: SplitDocumentPart[] = [];

    // Process each document and its corresponding page range
    for (let i = 0; i < pageRanges.length; i++) {
      const range = pageRanges[i];
      const docId = documents[i];
      const partName = formatPartName(naming_pattern, i);

      // Calculate pages to remove (all pages outside the range)
      const pagesToRemove: number[] = [];

      // Remove pages before the range
      for (let page = 1; page < range.start; page++) {
        pagesToRemove.push(page - 1); // Convert to 0-based indexing
      }

      // Remove pages after the range
      for (let page = range.end + 1; page <= totalPages; page++) {
        pagesToRemove.push(page - 1); // Convert to 0-based indexing
      }

      // Remove the pages outside the range
      if (pagesToRemove.length > 0) {
        await removePages(client, docId, pagesToRemove);
      }

      // Create part info
      parts.push({
        fingerprint: docId,
        title: `${originalTitle.replace(/\.[^/.]+$/, '')}_${partName}.pdf`,
        startPage: range.start,
        endPage: range.end,
        pageCount: range.end - range.start + 1,
        contentDescription: generateContentDescription(range.start, range.end, pageRanges.length),
      });
    }

    // Sort parts by their original page order
    parts.sort((a, b) => a.startPage - b.startPage);

    // Build the markdown response
    let markdown = `# Document Split Complete\n\n`;
    markdown += `📄 **Original Document:** ${originalTitle}  \n`;
    markdown += `✂️ **Split into:** ${parts.length} parts  \n`;
    markdown += `📊 **Total Pages Processed:** ${totalPages}  \n\n`;
    markdown += `---\n\n`;

    // Document parts section
    markdown += `## Document Parts Created\n\n`;

    parts.forEach((part, index) => {
      markdown += `### 📄 Part ${index + 1}: ${part.title}\n`;
      markdown += `- **Document ID:** ${part.fingerprint.document_id}\n`;
      if (part.fingerprint.layer) {
        markdown += `- **Layer:** ${part.fingerprint.layer}\n`;
      }
      markdown += `- **Pages:** ${part.startPage}-${part.endPage} (${part.pageCount} pages)\n`;
      if (part.contentDescription) {
        markdown += `- **Content:** ${part.contentDescription}\n`;
      }
      markdown += `\n`;
    });

    markdown += `---\n\n`;

    // Processing info
    markdown += `---\n\n`;
    markdown += `## Processing Summary\n`;
    markdown += `- **Split Points Used:** ${sortedSplitPoints.join(', ')}\n`;
    markdown += `- **Success:** All ${parts.length} parts created successfully\n\n`;

    markdown += `💡 **Tip:** Keep track of the document IDs above for further operations on individual parts.`;

    return { markdown };
  } catch (error: unknown) {
    // Return error in markdown format
    let errorMarkdown = `# Error Splitting Document\n\n`;
    errorMarkdown += `An error occurred while trying to split the document: ${error instanceof Error ? error.message : 'Unknown error'}\n\n`;
    errorMarkdown += `**Document ID:** ${params.document_fingerprint?.document_id || 'Unknown'}  \n`;
    if (params.document_fingerprint?.layer) {
      errorMarkdown += `**Layer:** ${params.document_fingerprint.layer}  \n`;
    }
    errorMarkdown += `**Split Points:** ${params.split_points.join(', ')}  \n\n`;
    errorMarkdown += `## Troubleshooting Tips\n`;
    errorMarkdown += `1. Verify the document ID is correct\n`;
    errorMarkdown += `2. Ensure split points are within the document's page range\n`;
    errorMarkdown += `3. Check that split points create at least 2 parts\n`;
    errorMarkdown += `4. Try splitting into fewer parts to reduce complexity\n\n`;
    errorMarkdown += `Please check your parameters and try again.`;

    return { markdown: errorMarkdown };
  }
}
