import { DocumentEngineClient } from '../../api/Client.js';
import { copyDocument, getDocumentInfo } from '../../api/DocumentLayerAbstraction.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { z } from 'zod';
import { MCPToolOutput } from '../../mcpTools.js';

/**
 * Schema for duplicate_document tool
 */
export const DuplicateDocumentSchema = {
  document_fingerprint: DocumentFingerprintSchema,
};

/**
 * Type for the duplicate document request parameters
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DuplicateDocumentInputSchema = z.object(DuplicateDocumentSchema);
type DuplicateDocumentInput = z.infer<typeof DuplicateDocumentInputSchema>;

/**
 * Duplicate a document with all its content
 */
export async function duplicateDocument(
  client: DocumentEngineClient,
  params: DuplicateDocumentInput
): Promise<MCPToolOutput> {
  try {
    // Get original document info
    const originalDocInfo = await getDocumentInfo(client, params.document_fingerprint);
    if (!originalDocInfo) {
      let errorMarkdown = `# Error: Document Not Found\n\n`;
      errorMarkdown += `❌ **Status:** Original document does not exist  \n`;
      errorMarkdown += `📄 **Document ID:** ${params.document_fingerprint.document_id}  \n`;
      if (params.document_fingerprint.layer) {
        errorMarkdown += `🔀 **Layer:** ${params.document_fingerprint.layer}  \n`;
      }
      errorMarkdown += `\n`;
      errorMarkdown += `The specified document could not be found or accessed.\n\n`;
      errorMarkdown += `## Troubleshooting Tips\n`;
      errorMarkdown += `1. Verify the document ID is correct\n`;
      errorMarkdown += `2. Check that the document exists in Document Engine\n`;
      errorMarkdown += `3. Ensure you have permission to access this document\n`;
      errorMarkdown += `4. Use \`list_documents\` to see available documents\n\n`;
      errorMarkdown += `Please check your parameters and try again.`;

      return { markdown: errorMarkdown };
    }

    // Use layer-aware copy function
    const newDocumentId = await copyDocument(client, params.document_fingerprint);

    let markdown = `# Document Duplicated Successfully\n\n`;
    markdown += `✅ **Status:** Document copied successfully  \n`;
    markdown += `📄 **Original Document ID:** ${params.document_fingerprint.document_id}  \n`;
    if (params.document_fingerprint.layer) {
      markdown += `🔀 **Original Layer:** ${params.document_fingerprint.layer}  \n`;
    }
    markdown += `📄 **New Document ID:** ${newDocumentId}  \n`;

    markdown += `\n---\n\n`;
    markdown += `## What Was Copied\n`;
    markdown += `- ✅ **All Pages:** ${originalDocInfo.pageCount || 0} pages copied\n`;
    markdown += `- ✅ **Text Content:** All text preserved\n`;
    markdown += `- ✅ **Annotations:** Annotations were copied\n`;
    markdown += `- ✅ **Metadata:** Title and properties updated\n`;

    markdown += `\n---\n`;

    return { markdown };
  } catch (error) {
    let errorMarkdown = `# Error Duplicating Document\n\n`;
    errorMarkdown += `An error occurred while trying to duplicate the document: ${error instanceof Error ? error.message : 'Unknown error'}\n\n`;
    errorMarkdown += `**Original Document ID:** ${params.document_fingerprint.document_id}  \n`;
    if (params.document_fingerprint.layer) {
      errorMarkdown += `**Original Layer:** ${params.document_fingerprint.layer}  \n`;
    }

    errorMarkdown += `\n## Troubleshooting Tips\n`;
    errorMarkdown += `1. Verify the original document ID is correct and the document exists\n`;
    errorMarkdown += `2. Check that you have permission to duplicate documents\n`;
    errorMarkdown += `3. Ensure the Document Engine instance has sufficient storage space\n`;
    errorMarkdown += `4. Try duplicating without annotations first (\`include_annotations: false\`)\n`;
    errorMarkdown += `5. Check if the document might be locked or in use by another process\n\n`;
    errorMarkdown += `Please check your parameters and try again.`;

    return { markdown: errorMarkdown };
  }
}
