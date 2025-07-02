import { DocumentEngineClient } from '../../api/Client.js';
import { z } from 'zod';
import { MCPToolOutput } from '../../mcpTools.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { getDocumentInfo, listDocumentLayers } from '../../api/DocumentLayerAbstraction.js';

/**
 * Schema for read_document_info tool
 */
export const ReadDocumentInfoSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  include_metadata: z
    .boolean()
    .optional()
    .default(false)
    .describe('Whether to include document metadata'),
};

export const ReadDocumentInfoInputSchema = z.object(ReadDocumentInfoSchema);
export type ReadDocumentInfoInput = z.infer<typeof ReadDocumentInfoInputSchema>;

/**
 * Read document information from Document Engine API
 */
export async function readDocumentInfo(
  client: DocumentEngineClient,
  params: ReadDocumentInfoInput
): Promise<MCPToolOutput> {
  try {
    // Validate input
    const validatedParams = ReadDocumentInfoInputSchema.parse(params);
    const { document_fingerprint, include_metadata } = validatedParams;

    // If a layer is specified, verify it exists
    if (document_fingerprint.layer) {
      try {
        const layersResponse = await listDocumentLayers(client, document_fingerprint.document_id);
        const layers: string[] = layersResponse.data?.data || [];
        const layerExists = layers.includes(document_fingerprint.layer);

        if (!layerExists) {
          return {
            markdown: `# Error Reading Document Information\n\nLayer '${document_fingerprint.layer}' does not exist for document '${document_fingerprint.document_id}'.\n\nAvailable layers: ${layers.join(', ') || 'None'}`,
          };
        }
      } catch {
        // If we can't list layers, proceed anyway as the document might not support layers
        // The actual getDocumentInfoWithFingerprint call will fail if there's a real issue
      }
    }

    const docInfo = await getDocumentInfo(client, document_fingerprint);

    // Build the markdown content
    let markdown = `# Document Information\n\n`;
    markdown += `**Document ID:** ${document_fingerprint.document_id}  \n`;
    if (document_fingerprint.layer) {
      markdown += `**Layer:** ${document_fingerprint.layer}  \n`;
    }
    markdown += `**Pages:** ${docInfo.pageCount || 0}  \n`;

    markdown += `**Content Type:** application/pdf  \n`;

    // Include metadata if requested
    if (include_metadata) {
      markdown += `\n## Metadata\n`;

      // Add all available metadata fields
      if (docInfo.metadata) {
        if (docInfo.metadata.title) {
          markdown += `- **Title:** ${docInfo.metadata.title}\n`;
        }
        if (docInfo.metadata.author) {
          markdown += `- **Author:** ${docInfo.metadata.author}\n`;
        }
        if (docInfo.metadata.subject) {
          markdown += `- **Subject:** ${docInfo.metadata.subject}\n`;
        }
        if (docInfo.metadata.keywords) {
          markdown += `- **Keywords:** ${docInfo.metadata.keywords}\n`;
        }
        if (docInfo.metadata.creator) {
          markdown += `- **Creator:** ${docInfo.metadata.creator}\n`;
        }
        if (docInfo.metadata.producer) {
          markdown += `- **Producer:** ${docInfo.metadata.producer}\n`;
        }
        if (docInfo.metadata.dateCreated) {
          markdown += `- **Creation Date:** ${docInfo.metadata.dateCreated}\n`;
        }
        if (docInfo.metadata.dateModified) {
          markdown += `- **Modification Date:** ${docInfo.metadata.dateModified}\n`;
        }
      }

      if (docInfo.hasXFA) {
        markdown += `- **Has XFA Forms:** ${docInfo.hasXFA ? 'Yes' : 'No'}\n`;
      }

      // Add permissions if available
      if (docInfo.permissions) {
        markdown += `\n### Permissions\n`;
        const permissions = docInfo.permissions;

        if (typeof permissions.annotationAndForms === 'boolean') {
          markdown += `- **Annotation and Forms:** ${permissions.annotationAndForms ? 'Allowed' : 'Not Allowed'}\n`;
        }
        if (typeof permissions.assemble === 'boolean') {
          markdown += `- **Assemble Document:** ${permissions.assemble ? 'Allowed' : 'Not Allowed'}\n`;
        }
        if (typeof permissions.extract === 'boolean') {
          markdown += `- **Extract Content:** ${permissions.extract ? 'Allowed' : 'Not Allowed'}\n`;
        }
        if (typeof permissions.extractAccessibility === 'boolean') {
          markdown += `- **Extract for Accessibility:** ${permissions.extractAccessibility ? 'Allowed' : 'Not Allowed'}\n`;
        }
        if (typeof permissions.fillForms === 'boolean') {
          markdown += `- **Fill Forms:** ${permissions.fillForms ? 'Allowed' : 'Not Allowed'}\n`;
        }
        if (typeof permissions.modification === 'boolean') {
          markdown += `- **Modify Document:** ${permissions.modification ? 'Allowed' : 'Not Allowed'}\n`;
        }
        if (typeof permissions.print === 'boolean') {
          markdown += `- **Print:** ${permissions.print ? 'Allowed' : 'Not Allowed'}\n`;
        }
        if (typeof permissions.printHighQuality === 'boolean') {
          markdown += `- **High Quality Printing:** ${permissions.printHighQuality ? 'Allowed' : 'Not Allowed'}\n`;
        }
      }

      // Add page information if available
      if (docInfo.pages && docInfo.pages.length > 0) {
        markdown += `\n### Pages\n`;
        docInfo.pages.forEach((page, index) => {
          markdown += `- **Page ${index + 1}:** Width: ${page.width}, Height: ${page.height}\n`;
        });
      }
    }

    return { markdown };
  } catch (error) {
    // Provide a more user-friendly error message
    return {
      markdown: `# Error Reading Document Information\n\nAn error occurred while trying to read document information: ${error instanceof Error ? error.message : String(error)}\n\nPlease check your connection and try again.`,
    };
  }
}
