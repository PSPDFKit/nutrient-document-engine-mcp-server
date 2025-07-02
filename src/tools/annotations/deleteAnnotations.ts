import { DocumentEngineClient } from '../../api/Client.js';
import {
  deleteDocumentAnnotation,
  getDocumentAnnotation,
} from '../../api/DocumentLayerAbstraction.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { z } from 'zod';
import { MCPToolOutput } from '../../mcpTools.js';
import { formatBBox } from '../../utils/Common.js';

export const DeleteAnnotationsSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  annotation_ids: z.array(z.string()).describe('The IDs of the annotations to delete'),
  confirm_deletion: z.boolean().optional().describe('Confirm deletion of annotations'),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DeleteAnnotationsInputSchema = z.object(DeleteAnnotationsSchema);
type DeleteAnnotationsInput = z.infer<typeof DeleteAnnotationsInputSchema>;

/**
 * Delete multiple annotations from a document
 */
export async function deleteAnnotations(
  client: DocumentEngineClient,
  params: DeleteAnnotationsInput
): Promise<MCPToolOutput> {
  // Handle confirmation parameter
  if (params.confirm_deletion === false) {
    let markdown = `# Annotation Deletion Cancelled\n\n`;
    markdown += `🛑 **Status:** Deletion cancelled by user request  \n`;
    markdown += `📄 **Document ID:** ${params.document_fingerprint.document_id}  \n`;
    if (params.document_fingerprint.layer) {
      markdown += `🔀 **Layer:** ${params.document_fingerprint.layer}  \n`;
    }
    markdown += `🗑️ **Annotation IDs:** ${params.annotation_ids.join(', ')}  \n\n`;

    markdown += `The annotation deletion was cancelled because \`confirm_deletion\` was set to \`false\`.\n\n`;

    markdown += `💡 **To proceed with deletion:**\n`;
    markdown += `- Set \`confirm_deletion\` to \`true\`\n`;
    markdown += `- Or remove the \`confirm_deletion\` parameter entirely\n\n`;

    return { markdown };
  }

  try {
    // Get details for each annotation before deletion
    const annotationDetailsPromises = params.annotation_ids.map(async id => {
      try {
        const response = await getDocumentAnnotation(client, params.document_fingerprint, id);
        return response.data;
      } catch (error) {
        throw new Error(
          `Annotation ${id} not found: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });

    // Wait for all annotation details to be retrieved
    const annotationDetails = await Promise.all(annotationDetailsPromises);

    // Delete all annotations using layer-aware client
    const deleteAnnotationPromises = params.annotation_ids.map(id =>
      deleteDocumentAnnotation(client, params.document_fingerprint, id)
    );

    await Promise.all(deleteAnnotationPromises);

    const deletedAt = new Date().toISOString();

    // Generate markdown response
    let markdown = `# Annotations Deleted Successfully\n\n`;
    markdown += `✅ **Status:** ${params.annotation_ids.length} annotation${params.annotation_ids.length > 1 ? 's' : ''} removed  \n`;
    markdown += `📄 **Document ID:** ${params.document_fingerprint.document_id}  \n`;
    if (params.document_fingerprint.layer) {
      markdown += `🔀 **Layer:** ${params.document_fingerprint.layer}  \n`;
    }
    markdown += `🗑️ **Deleted Annotation IDs:** ${params.annotation_ids.join(', ')}  \n`;
    markdown += `⏱️ **Deleted At:** ${deletedAt}  \n\n`;

    markdown += `---\n\n`;
    markdown += `## Deleted Annotation Details\n`;

    // Add details for each deleted annotation
    annotationDetails.forEach((details, index) => {
      const location = details.content?.bbox
        ? formatBBox(details.content.bbox)
        : 'Unknown location';

      markdown += `### Annotation ${index + 1}: ${details.id}\n`;
      markdown += `- **Type:** ${details.content?.type || 'Unknown'}\n`;
      markdown += `- **Author:** ${details.createdBy || 'Unknown'}\n`;
      markdown += `- **Original Content:** "${details.content || 'No content'}"\n`;
      markdown += `- **Page:** ${details.content?.pageIndex ?? 'Unknown'}\n`;
      markdown += `- **Location on page:** ${location}\n`;
      markdown += `- **Created:** ${details.content?.createdAt ?? 'unknown'}\n\n`;
    });

    markdown += `---\n\n`;

    return { markdown };
  } catch (error) {
    // Check if the error is related to annotation not found
    if (error instanceof Error && error.message.includes('not found')) {
      let errorMarkdown = `# Error: Annotation Not Found\n\n`;
      errorMarkdown += `❌ **Status:** Annotation does not exist  \n`;
      errorMarkdown += `📄 **Document ID:** ${params.document_fingerprint.document_id}  \n`;
      if (params.document_fingerprint.layer) {
        errorMarkdown += `🔀 **Layer:** ${params.document_fingerprint.layer}  \n`;
      }
      errorMarkdown += `🔍 **Annotation IDs:** ${params.annotation_ids.join(', ')}  \n\n`;

      errorMarkdown += `The specified annotation could not be found in the document.\n\n`;

      errorMarkdown += `## Possible Reasons\n`;
      errorMarkdown += `1. The annotation ID is incorrect\n`;
      errorMarkdown += `2. The annotation has already been deleted\n`;
      errorMarkdown += `3. The annotation belongs to a different document\n`;
      errorMarkdown += `4. The document itself does not exist\n\n`;

      return { markdown: errorMarkdown };
    }

    // General error handling
    let errorMarkdown = `# Error Deleting Annotations\n\n`;
    errorMarkdown += `An error occurred while trying to delete the annotations: ${error instanceof Error ? error.message : 'Unknown error'}\n\n`;
    errorMarkdown += `**Document ID:** ${params.document_fingerprint.document_id}  \n`;
    if (params.document_fingerprint.layer) {
      errorMarkdown += `**Layer:** ${params.document_fingerprint.layer}  \n`;
    }
    errorMarkdown += `**Annotation IDs:** ${params.annotation_ids.join(', ')}  \n`;

    errorMarkdown += `\n## Troubleshooting Tips\n`;
    errorMarkdown += `1. Verify the document ID and annotation IDs are correct\n`;
    errorMarkdown += `2. Check that you have permission to delete annotations from this document\n`;
    errorMarkdown += `3. Ensure the Document Engine instance is accessible\n`;
    errorMarkdown += `4. Verify the annotations exist by using \`read_annotations\` first\n`;
    errorMarkdown += `5. Check if the annotations might have already been deleted\n\n`;
    errorMarkdown += `Please check your parameters and try again.`;

    return { markdown: errorMarkdown };
  }
}
