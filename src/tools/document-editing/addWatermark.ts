import { z } from 'zod';

import { handleApiError } from '../../utils/ErrorHandling.js';
import { DocumentEngineClient } from '../../api/Client.js';
import {
  BuildInstructions,
  ImageWatermarkAction,
  TextWatermarkAction,
} from '../../api/DocumentEngineSchema.js';
import {
  DocumentFingerprint,
  DocumentFingerprintSchema,
} from '../schemas/DocumentFingerprintSchema.js';
import { applyDocumentInstructions, getDocumentInfo } from '../../api/DocumentLayerAbstraction.js';
import { MCPToolOutput } from '../../mcpTools.js';

/**
 * Add Watermark Tool
 *
 * Adds a text or image watermark to all pages of a document using the Document Engine API.
 * Supports customization of opacity, font size, and rotation.
 */

export const AddWatermarkSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  watermark_type: z.enum(['text', 'image']),
  content: z.string().min(1, 'Content is required (text content or image URL)'),
  opacity: z.number().min(0).max(1).optional().default(0.7),
  rotation: z
    .number()
    .optional()
    .default(0)
    .describe(' Rotation of the watermark in counterclockwise degrees.'),
};

const AddWatermarkInputSchema = z.object(AddWatermarkSchema);
type AddWatermarkInput = z.infer<typeof AddWatermarkInputSchema>;

/**
 * Create text watermark action
 *
 * Note: Using string values for width/height instead of WatermarkDimension objects
 * because the actual API expects strings, not the complex dimension objects in the schema.
 * Position support is temporarily removed as it's not currently supported by the API.
 */
function createTextWatermarkAction(
  content: string,
  opacity: number,
  rotation: number = 0
): TextWatermarkAction {
  // Using 'any' type to bypass TypeScript errors while schema is being updated
  // to match actual API expectations (strings vs WatermarkDimension objects)
  return {
    type: 'watermark',
    text: content,
    width: '100%', // String format required by API
    height: '100%', // String format required by API
    opacity,
    rotation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Watermark action object has flexible structure for API
  } as any;
}

/**
 * Create image watermark action
 *
 * Note: Using string values for width/height instead of WatermarkDimension objects
 * because the actual API expects strings, not the complex dimension objects in the schema.
 * Position support is temporarily removed as it's not currently supported by the API.
 */
function createImageWatermarkAction(
  imageUrl: string,
  opacity: number,
  rotation: number = 0
): ImageWatermarkAction {
  // Using 'as any' to bypass TypeScript errors while schema is being updated
  // to match actual API expectations (strings vs WatermarkDimension objects)
  return {
    type: 'watermark',
    image: { url: imageUrl },
    width: '25%', // String format required by API
    height: '15%', // String format required by API
    opacity,
    rotation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Watermark action object has flexible structure for API
  } as any;
}

/**
 * Apply watermark using layer-aware document instructions API
 */
async function applyWatermark(
  client: DocumentEngineClient,
  fingerprint: DocumentFingerprint,
  watermarkAction: TextWatermarkAction | ImageWatermarkAction
): Promise<DocumentFingerprint> {
  try {
    // Create build instructions to watermark the existing document
    const buildInstructions: BuildInstructions = {
      parts: [
        {
          document: {
            id: '#self',
          },
        },
      ],
      actions: [watermarkAction],
    };

    await applyDocumentInstructions(client, fingerprint, buildInstructions);
    return fingerprint;
  } catch (error: unknown) {
    throw handleApiError(error);
  }
}

/**
 * Add watermark to a document
 */
export async function addWatermark(
  client: DocumentEngineClient,
  params: AddWatermarkInput
): Promise<MCPToolOutput> {
  const startTime = Date.now();

  try {
    // Validate input
    const validatedParams = AddWatermarkInputSchema.parse(params);
    const { document_fingerprint, watermark_type, content, opacity, rotation } = validatedParams;

    // Get original document information
    const documentInfo = await getDocumentInfo(client, document_fingerprint);
    const pageCount = documentInfo.pageCount;

    // Create watermark action based on type
    let watermarkAction: TextWatermarkAction | ImageWatermarkAction;

    if (watermark_type === 'text') {
      watermarkAction = createTextWatermarkAction(content, opacity, rotation);
    } else {
      // Validate URL format for image watermarks
      try {
        new URL(content);
      } catch {
        throw new Error('Invalid image URL provided');
      }
      watermarkAction = createImageWatermarkAction(content, opacity, rotation);
    }

    // Apply watermark using layer-aware document instructions API
    const buildResult = await applyWatermark(client, document_fingerprint, watermarkAction);

    const processingTime = Date.now() - startTime;

    // Build the markdown response
    let markdown = `# Watermark Applied Successfully\n\n`;
    markdown += `✅ **Status:** Watermark added to all pages  \n`;
    markdown += `📄 **Document ID:** ${buildResult.document_id}  \n`;
    if (document_fingerprint.layer) {
      markdown += `🔀 **Layer:** ${document_fingerprint.layer}  \n`;
    }
    markdown += `📊 **Pages Watermarked:** ${pageCount}  \n\n`;
    markdown += `---\n\n`;

    // Watermark details section
    markdown += `## Watermark Details\n`;
    markdown += `- **Type:** ${watermark_type === 'text' ? 'Text watermark' : 'Image watermark'}\n`;
    markdown += `- **Content:** ${watermark_type === 'text' ? `"${content}"` : `Image from ${content}`}\n`;
    markdown += `- **Rotation:** ${rotation}°\n`;
    markdown += `- **Opacity:** ${Math.round(opacity * 100)}%\n`;

    markdown += `\n---\n\n`;

    // Application summary section
    markdown += `## Application Summary\n`;
    markdown += `- **Pages Processed:** ${pageCount}/${pageCount}\n`;
    markdown += `- **Processing Time:** ${(processingTime / 1000).toFixed(1)} seconds\n`;
    markdown += `- **Status:** Complete\n\n`;
    markdown += `---\n\n`;

    return { markdown };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Return error in markdown format
    let errorMarkdown = `# Error Adding Watermark\n\n`;
    errorMarkdown += `An error occurred while trying to add watermark to the document: ${errorMessage}\n\n`;
    errorMarkdown += `**Document ID:** ${params.document_fingerprint?.document_id || 'Unknown'}  \n`;
    if (params.document_fingerprint?.layer) {
      errorMarkdown += `**Layer:** ${params.document_fingerprint.layer}  \n`;
    }
    errorMarkdown += `**Watermark Type:** ${params.watermark_type}  \n`;
    errorMarkdown += `**Content:** ${params.content}  \n`;
    errorMarkdown += `**Rotation:** ${params.rotation || 0}°  \n\n`;
    errorMarkdown += `## Troubleshooting Tips\n`;
    errorMarkdown += `1. Verify the document ID is correct\n`;
    errorMarkdown += `2. For image watermarks, ensure the URL is accessible\n`;
    errorMarkdown += `3. Check that opacity is between 0 and 1\n`;
    errorMarkdown += `4. Try using a different position if the watermark overlaps content\n`;
    errorMarkdown += `5. Adjust the rotation angle if the watermark is not oriented correctly\n\n`;
    errorMarkdown += `Please check your parameters and try again.`;

    return { markdown: errorMarkdown };
  }
}
