import { z } from 'zod';

import { DocumentEngineClient } from '../../api/Client.js';
import { applyDocumentRedactions, getDocumentInfo } from '../../api/DocumentLayerAbstraction.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { MCPToolOutput } from '../../mcpTools.js';

/**
 * Apply Redactions Tool
 *
 * Executes redactions. This permanently removes sensitive content
 * from the document.
 */

export const ApplyRedactionsSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  redaction_ids: z
    .array(z.string().min(1, 'Redaction ID cannot be empty'))
    .min(1, 'At least one redaction ID is required'),
};

export const ApplyRedactionsInputSchema = z.object(ApplyRedactionsSchema);
export type ApplyRedactionsInput = z.infer<typeof ApplyRedactionsInputSchema>;

/**
 * Apply redactions to a document
 */
export async function applyRedactions(
  client: DocumentEngineClient,
  params: ApplyRedactionsInput
): Promise<MCPToolOutput> {
  try {
    // Validate input
    const validatedParams = ApplyRedactionsInputSchema.parse(params);
    const { document_fingerprint, redaction_ids } = validatedParams;

    // Get original document information
    const documentInfo = await getDocumentInfo(client, document_fingerprint);
    const documentTitle = documentInfo.title || `Document ${document_fingerprint.document_id}`;

    // Process redactions using layer-aware client
    await applyDocumentRedactions(client, document_fingerprint);

    // Build the markdown response
    let markdown = `# Redactions Applied Successfully\n\n`;
    markdown += `✅ **Status:** All redactions applied permanently  \n`;
    markdown += `📄 **Original Document ID:** ${document_fingerprint.document_id}  \n`;
    if (document_fingerprint.layer) {
      markdown += `🔀 **Layer:** ${document_fingerprint.layer}  \n`;
    }
    markdown += `🔒 **Redactions Applied:** ${redaction_ids.length} instances  \n`;
    markdown += `---\n\n`;

    // Redaction summary section
    markdown += `## Redaction Summary\n\n`;

    markdown += `---\n\n`;

    // Document processing details
    markdown += `## Processing Details\n`;
    markdown += `- **Original Document:** ${documentTitle}\n`;
    markdown += `- **Pages Processed:** ${documentInfo.pageCount}\n`;
    markdown += `- **Redactions Performed:** ${redaction_ids.length}\n`;
    markdown += `- **Processing Status:** Complete\n\n`;

    markdown += `---\n\n`;

    return { markdown };
  } catch (error: unknown) {
    // Return error in markdown format
    let errorMarkdown = `# Error Applying Redactions\n\n`;
    errorMarkdown += `An error occurred while trying to apply redactions: ${error instanceof Error ? error.message : 'Unknown error'}\n\n`;
    errorMarkdown += `**Document ID:** ${params.document_fingerprint.document_id}  \n`;
    if (params.document_fingerprint.layer) {
      errorMarkdown += `**Layer:** ${params.document_fingerprint.layer}  \n`;
    }
    errorMarkdown += `**Redaction IDs:** ${params.redaction_ids.join(', ')}  \n\n`;

    errorMarkdown += `## Troubleshooting Tips\n`;
    errorMarkdown += `1. Verify the document ID is correct and accessible\n`;
    errorMarkdown += `2. Ensure all redaction IDs are valid and exist\n`;
    errorMarkdown += `3. Check that redactions were properly created first using \`create_redaction\`\n`;
    errorMarkdown += `4. Verify you have sufficient permissions for redaction operations\n`;
    errorMarkdown += `5. Consider creating a document backup before retrying\n\n`;
    errorMarkdown += `Please check your parameters and try again.`;

    return { markdown: errorMarkdown };
  }
}
