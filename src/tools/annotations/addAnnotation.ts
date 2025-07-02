import { DocumentEngineClient } from '../../api/Client.js';
import {
  AnnotationBbox,
  AnnotationContent,
  AnnotationCreateSingle,
  Lines,
} from '../../api/DocumentEngineSchema.js';
import { z, ZodError } from 'zod';
import { createDocumentAnnotation, getDocumentInfo } from '../../api/DocumentLayerAbstraction.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { MCPToolOutput } from '../../mcpTools.js';

/**
 * Create markup for review and approval workflows
 */

export const AddAnnotationSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  page_number: z
    .number()
    .min(0)
    .describe('Page number (0-based) where the annotation should be added'),
  annotation_type: z
    .enum(['note', 'highlight', 'strikeout', 'underline', 'ink', 'text', 'stamp', 'image', 'link'])
    .describe('Type of annotation to create'),
  content: z.string().describe('Content for the annotation (text, note, URL, etc.)'),
  coordinates: z
    .object({
      left: z.number().describe('Left coordinate for the annotation'),
      top: z.number().describe('Top coordinate for the annotation'),
      width: z.number().min(0).describe('Width of the annotation'),
      height: z.number().min(0).describe('Height of the annotation'),
    })
    .strict()
    .describe('Position and size of the annotation'),
  author: z.string().optional().describe('Name of the annotation author'),
};

export const AddAnnotationInputSchema = z.object(AddAnnotationSchema);
export type AddAnnotationInput = z.infer<typeof AddAnnotationInputSchema>;
export async function addAnnotation(
  client: DocumentEngineClient,
  params: AddAnnotationInput
): Promise<MCPToolOutput> {
  try {
    // Validate input
    const validatedParams = AddAnnotationInputSchema.parse(params);
    const { document_fingerprint, page_number, annotation_type, content, coordinates, author } =
      validatedParams;

    // Get document info for context
    const docInfo = await getDocumentInfo(client, document_fingerprint);

    const title = docInfo.title || 'Untitled Document';

    const bbox: AnnotationBbox = [
      coordinates.left,
      coordinates.top,
      coordinates.width,
      coordinates.height,
    ];

    // Create annotation content based on type
    let annotationContent: AnnotationContent;

    switch (annotation_type) {
      case 'note':
        annotationContent = {
          v: 2,
          type: 'pspdfkit/note',
          pageIndex: page_number,
          bbox,
          text: {
            format: 'plain',
            value: content,
          },
          icon: 'comment',
          color: '#FFD83F',
          opacity: 1.0,
        };
        break;

      case 'highlight': {
        // For markup annotations, we need rects instead of just bbox
        const rects = [
          [
            coordinates.left,
            coordinates.top,
            coordinates.left + coordinates.width,
            coordinates.top + coordinates.height,
          ],
        ];
        annotationContent = {
          v: 2,
          type: 'pspdfkit/markup/highlight',
          pageIndex: page_number,
          bbox,
          rects,
          color: '#FFFF00',
          note: content,
          blendMode: 'multiply',
          opacity: 1.0,
        };
        break;
      }

      case 'strikeout':
        annotationContent = {
          v: 2,
          type: 'pspdfkit/markup/strikeout',
          pageIndex: page_number,
          bbox,
          rects: [
            [
              coordinates.left,
              coordinates.top,
              coordinates.left + coordinates.width,
              coordinates.top + coordinates.height,
            ],
          ],
          color: '#FF0000',
          note: content,
          opacity: 1.0,
        };
        break;

      case 'underline':
        annotationContent = {
          v: 2,
          type: 'pspdfkit/markup/underline',
          pageIndex: page_number,
          bbox,
          rects: [
            [
              coordinates.left,
              coordinates.top,
              coordinates.left + coordinates.width,
              coordinates.top + coordinates.height,
            ],
          ],
          color: '#0000FF',
          note: content,
          opacity: 1.0,
        };
        break;

      case 'ink': {
        // For ink annotations, create a simple line within the bbox
        const lines: Lines = {
          points: [
            [
              [coordinates.left, coordinates.top],
              [coordinates.left + coordinates.width, coordinates.top + coordinates.height],
            ],
          ],
        };
        annotationContent = {
          v: 2,
          type: 'pspdfkit/ink',
          pageIndex: page_number,
          bbox,
          lines,
          lineWidth: 2,
          color: '#000000',
          opacity: 1.0,
        };
        break;
      }

      case 'text':
        annotationContent = {
          v: 2,
          type: 'pspdfkit/text',
          pageIndex: page_number,
          bbox,
          text: {
            format: 'plain',
            value: content,
          },
          fontSize: 12,
          fontColor: '#000000',
          opacity: 1.0,
          horizontalAlign: 'left',
          verticalAlign: 'top',
        };
        break;

      case 'stamp':
        annotationContent = {
          v: 2,
          type: 'pspdfkit/stamp',
          pageIndex: page_number,
          bbox,
          title: content,
          stampType: 'Custom',
          opacity: 1.0,
        };
        break;

      case 'image':
        annotationContent = {
          v: 2,
          type: 'pspdfkit/image',
          pageIndex: page_number,
          bbox,
          fileName: content,
          opacity: 1.0,
        };
        break;

      case 'link':
        annotationContent = {
          v: 2,
          type: 'pspdfkit/link',
          pageIndex: page_number,
          bbox,
          action: {
            type: 'uri',
            uri: content,
          },
          opacity: 1.0,
        };
        break;

      default:
        throw new Error(`Unsupported annotation type: ${annotation_type}`);
    }

    // Add author information if provided
    if (author) {
      annotationContent.creatorName = author;
    }

    // Create the annotation request
    const createRequest: AnnotationCreateSingle = {
      content: annotationContent,
      user_id: author,
    };

    // Call the API to create the annotation using layer-aware client
    const createResponse = await createDocumentAnnotation(
      client,
      document_fingerprint,
      createRequest
    );

    // Get the annotation ID from the response
    const responseData = createResponse.data?.data;
    let annotationId = 'Unknown';

    if (responseData) {
      if (Array.isArray(responseData) && responseData[0]?.id) {
        annotationId = responseData[0].id;
      } else if (!Array.isArray(responseData)) {
        // Check if the property exists in the object
        if ('annotation_id' in responseData && responseData.annotation_id) {
          annotationId = responseData.annotation_id;
        } else if ('id' in responseData && responseData.id) {
          annotationId = responseData.id;
        }
      }
    }

    // Build the markdown response
    let markdown = `# Annotation Added Successfully\n\n`;
    markdown += `📝 **Annotation ID:** ${annotationId}  \n`;
    markdown += `📄 **Document:** ${title}  \n`;
    markdown += `📄 **Document ID:** ${document_fingerprint.document_id}  \n`;
    if (document_fingerprint.layer) {
      markdown += `🔀 **Layer:** ${document_fingerprint.layer}  \n`;
    }

    if (author) {
      markdown += `👤 **Author:** ${author}  \n`;
    }

    markdown += `📅 **Created:** ${new Date().toISOString()}  \n\n`;

    markdown += `---\n\n`;

    // Add annotation details
    markdown += `## Annotation Details\n\n`;
    markdown += `- **Type:** ${formatAnnotationType(annotation_type)}\n`;
    markdown += `- **Page:** ${page_number + 1}\n`; // Convert to 1-based indexing for display
    markdown += `- **Content:** "${content}"\n`;
    markdown += `- **Location:** Page ${page_number + 1}, coordinates (${coordinates.left.toFixed(1)}, ${coordinates.top.toFixed(1)})\n`;
    markdown += `- **Size:** ${coordinates.width.toFixed(1)} × ${coordinates.height.toFixed(1)}\n\n`;

    // Add type-specific details
    switch (annotation_type) {
      case 'highlight':
      case 'strikeout':
      case 'underline':
        if ('color' in annotationContent && annotationContent.color) {
          markdown += `- **Color:** ${annotationContent.color}\n`;
        }
        if ('blendMode' in annotationContent && annotationContent.blendMode) {
          markdown += `- **Blend Mode:** ${annotationContent.blendMode}\n`;
        }
        break;
      case 'text':
        if ('fontSize' in annotationContent && annotationContent.fontSize) {
          markdown += `- **Font Size:** ${annotationContent.fontSize}pt\n`;
        }
        if ('fontColor' in annotationContent && annotationContent.fontColor) {
          markdown += `- **Font Color:** ${annotationContent.fontColor}\n`;
        }
        break;
      case 'ink':
        if ('lineWidth' in annotationContent && annotationContent.lineWidth) {
          markdown += `- **Line Width:** ${annotationContent.lineWidth}px\n`;
        }
        if ('color' in annotationContent && annotationContent.color) {
          markdown += `- **Color:** ${annotationContent.color}\n`;
        }
        break;
      case 'note':
        if ('icon' in annotationContent && annotationContent.icon) {
          markdown += `- **Icon:** ${annotationContent.icon}\n`;
        }
        if ('color' in annotationContent && annotationContent.color) {
          markdown += `- **Color:** ${annotationContent.color}\n`;
        }
        break;
    }

    markdown += `\n---\n\n`;

    return { markdown };
  } catch (error) {
    // Handle Zod validation errors with more user-friendly messages
    if (error instanceof ZodError) {
      const firstError = error.errors[0];
      if (
        firstError?.path.includes('annotation_type') &&
        firstError?.code === 'invalid_enum_value'
      ) {
        return {
          markdown: `# Error Adding Annotation\n\nAn error occurred while trying to add the annotation: Unsupported annotation type: ${firstError.received}\n\nPlease check your parameters and try again:\n- Ensure the document ID is valid\n- Check that coordinates are within page bounds\n- Verify the annotation type is supported`,
        };
      }
    }

    // Provide a more user-friendly error message
    return {
      markdown: `# Error Adding Annotation\n\nAn error occurred while trying to add the annotation: ${error instanceof Error ? error.message : String(error)}\n\nPlease check your parameters and try again:\n- Ensure the document ID is valid\n- Check that coordinates are within page bounds\n- Verify the annotation type is supported`,
    };
  }
}

/**
 * Format annotation type for display
 */
function formatAnnotationType(type: string): string {
  switch (type) {
    case 'note':
      return 'Note (Sticky Note)';
    case 'highlight':
      return 'Highlight';
    case 'strikeout':
      return 'Strikeout';
    case 'underline':
      return 'Underline';
    case 'ink':
      return 'Ink (Freehand Drawing)';
    case 'text':
      return 'Text';
    case 'stamp':
      return 'Stamp';
    case 'image':
      return 'Image';
    case 'link':
      return 'Link';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}
