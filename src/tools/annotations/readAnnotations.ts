import { DocumentEngineClient } from '../../api/Client.js';
import { getDocumentAnnotations } from '../../api/DocumentLayerAbstraction.js';
import { AnnotationRecord, TextAnnotation } from '../../api/DocumentEngineSchema.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { z } from 'zod';
import { MCPToolOutput } from '../../mcpTools.js';
import { formatBBox } from '../../utils/Common.js';

/**
 * Schema for read_annotations tool
 */
export const ReadAnnotationsSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  page_number: z
    .number()
    .min(0)
    .optional()
    .describe('Filter annotations by specific page number (0-based)'),
  annotation_type: z
    .enum(['note', 'highlight', 'strikeout', 'underline', 'ink', 'text', 'stamp', 'image', 'link'])
    .optional()
    .describe('Filter annotations by type'),
  author: z.string().optional().describe('Filter annotations by author name'),
};

// Define the ReadAnnotationsRequest type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ReadAnnotationsInputSchema = z.object(ReadAnnotationsSchema);
type ReadAnnotationsInput = z.infer<typeof ReadAnnotationsInputSchema>;

/**
 * Normalize annotation type by removing prefixes
 */
function normalizeAnnotationType(type: string): string {
  // Remove pspdfkit/ prefix
  let normalizedType = type.replace(/^pspdfkit\//, '');

  // Remove markup/ prefix if present
  normalizedType = normalizedType.replace(/^markup\//, '');

  return normalizedType;
}

/**
 * Get emoji for annotation type
 */
function getAnnotationEmoji(type: string): string {
  const normalizedType = normalizeAnnotationType(type);
  const emojiMap: Record<string, string> = {
    note: '📝',
    highlight: '🖍️',
    strikeout: '✏️',
    underline: '📏',
    ink: '🖊️',
    text: '📄',
    stamp: '📌',
    image: '🖼️',
    link: '🔗',
  };
  return emojiMap[normalizedType] || '📄';
}

/**
 * Group annotations by page
 */
function groupAnnotationsByPage(
  annotations: AnnotationRecord[]
): Record<number, AnnotationRecord[]> {
  return annotations.reduce((groups: Record<number, AnnotationRecord[]>, annotation) => {
    const pageIndex = annotation.content?.pageIndex;
    if (pageIndex !== undefined) {
      if (!groups[pageIndex]) {
        groups[pageIndex] = [];
      }
      groups[pageIndex].push(annotation);
    }
    return groups;
  }, {});
}

/**
 * Generate summary statistics
 */
function generateSummaryStats(annotations: AnnotationRecord[]): {
  byType: Record<string, number>;
  byAuthor: Record<string, number>;
} {
  const byType: Record<string, number> = {};
  const byAuthor: Record<string, number> = {};

  annotations.forEach(annotation => {
    // Count by type
    const annotationType = annotation.content?.type;
    if (annotationType) {
      byType[annotationType] = (byType[annotationType] || 0) + 1;
    }

    // Count by author
    const author = annotation.createdBy || 'Unknown';
    byAuthor[author] = (byAuthor[author] || 0) + 1;
  });

  return { byType, byAuthor };
}

/**
 * Apply filters to annotations
 */
function applyFilters(
  annotations: AnnotationRecord[],
  filters: Pick<ReadAnnotationsInput, 'page_number' | 'annotation_type' | 'author'>
): AnnotationRecord[] {
  return annotations.filter(annotation => {
    // Filter by page number
    if (filters.page_number !== undefined) {
      if (annotation.content?.pageIndex !== filters.page_number) {
        return false;
      }
    }

    // Filter by annotation type
    if (filters.annotation_type && annotation.content?.type !== filters.annotation_type) {
      return false;
    }

    // Filter by author
    if (filters.author) {
      if (!annotation.createdBy) return false;
      if (annotation.createdBy !== filters.author) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Read annotations from a document
 */
export async function readAnnotations(
  client: DocumentEngineClient,
  params: ReadAnnotationsInput
): Promise<MCPToolOutput> {
  try {
    // Get annotations from Document Engine API using layer-aware client
    const response = await getDocumentAnnotations(client, params.document_fingerprint);
    const allAnnotations = response.data?.data?.annotations || [];

    // Apply filters
    const filteredAnnotations = applyFilters(allAnnotations, params);

    // If no annotations found
    if (filteredAnnotations.length === 0) {
      let message = `# Document Annotations\n\n`;
      message += `📄 **Document ID:** ${params.document_fingerprint.document_id}  \n`;
      if (params.document_fingerprint.layer) {
        message += `🔀 **Layer:** ${params.document_fingerprint.layer}  \n`;
      }
      message += `📝 **Total Annotations:** 0  \n\n`;

      if (allAnnotations.length > 0) {
        message += `**Note:** Document has ${allAnnotations.length} total annotations, but none match the specified filters.\n\n`;
        message += `**Applied Filters:**\n`;
        if (params.page_number !== undefined) message += `- Page: ${params.page_number}\n`;
        if (params.annotation_type) message += `- Type: ${params.annotation_type}\n`;
        if (params.author) message += `- Author: ${params.author}\n`;
      } else {
        message += `This document does not contain any annotations.\n\n`;
      }

      return { markdown: message };
    }

    // Group annotations by page
    const annotationsByPage = groupAnnotationsByPage(filteredAnnotations);
    const pages = Object.keys(annotationsByPage)
      .map(Number)
      .sort((a, b) => a - b);

    // Get unique authors
    const authors = [...new Set(filteredAnnotations.map(a => a.createdBy || 'Unknown'))];

    // Generate summary statistics
    const stats = generateSummaryStats(filteredAnnotations);

    // Build markdown response
    let markdown = `# Document Annotations\n\n`;
    markdown += `📄 **Document ID:** ${params.document_fingerprint.document_id}  \n`;
    if (params.document_fingerprint.layer) {
      markdown += `🔀 **Layer:** ${params.document_fingerprint.layer}  \n`;
    }
    markdown += `📝 **Total Annotations:** ${filteredAnnotations.length}  \n`;
    markdown += `📊 **Pages with Annotations:** ${pages.length} (pages ${pages.join(', ')})  \n`;
    markdown += `👥 **Authors:** ${authors.length} (${authors.join(', ')})  \n`;

    // Add filter information if filters were applied
    if (params.page_number !== undefined || params.annotation_type || params.author) {
      markdown += `\n**Applied Filters:**\n`;
      if (params.page_number !== undefined) markdown += `- Page: ${params.page_number}\n`;
      if (params.annotation_type) markdown += `- Type: ${params.annotation_type}\n`;
      if (params.author) markdown += `- Author: ${params.author}\n`;
    }

    markdown += `\n---\n\n`;

    // Add annotations grouped by page
    pages.forEach(pageNumber => {
      const pageAnnotations = annotationsByPage[pageNumber];
      markdown += `## Page ${pageNumber} (${pageAnnotations.length} annotation${pageAnnotations.length === 1 ? '' : 's'})\n\n`;

      pageAnnotations.forEach((annotation, index) => {
        const emoji = getAnnotationEmoji(annotation.content?.type || 'unknown');

        markdown += `### ${emoji} Annotation ${index + 1}: ${annotation.id}\n`;
        const normalizedType = normalizeAnnotationType(annotation.content?.type || 'unknown');
        markdown += `- **Type:** ${normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1)}\n`;
        markdown += `- **Author:** ${annotation.createdBy || 'Unknown'}\n`;
        markdown += `- **Created:** ${annotation.content?.createdAt || 'Unknown'}\n`;
        if (normalizedType === 'text') {
          const textAnnotation = annotation.content as TextAnnotation;
          markdown += `- **Content:** "${textAnnotation.text.value || 'No content'}"\n`;
        }
        markdown += `- **Location:** ${annotation.content?.bbox ? formatBBox(annotation.content.bbox) : 'Unknown location'}\n\n`;
      });

      if (pageNumber !== pages[pages.length - 1]) {
        markdown += `---\n\n`;
      }
    });

    // Add summary statistics
    markdown += `---\n\n`;
    markdown += `## Summary by Type\n`;
    Object.entries(stats.byType).forEach(([type, count]) => {
      const emoji = getAnnotationEmoji(type);
      const normalizedType = normalizeAnnotationType(type);
      markdown += `- **${emoji} ${normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1)}s:** ${count} annotation${count === 1 ? '' : 's'}\n`;
    });

    markdown += `\n## Summary by Author\n`;
    Object.entries(stats.byAuthor).forEach(([author, count]) => {
      markdown += `- **${author}:** ${count} annotation${count === 1 ? '' : 's'}\n`;
    });

    markdown += `\n---\n\n`;
    return { markdown };
  } catch (error) {
    let errorMarkdown = `# Error Reading Annotations\n\n`;
    errorMarkdown += `An error occurred while trying to read annotations: ${error instanceof Error ? error.message : 'Unknown error'}\n\n`;
    errorMarkdown += `**Document ID:** ${params.document_fingerprint.document_id}  \n`;
    if (params.document_fingerprint.layer) {
      errorMarkdown += `**Layer:** ${params.document_fingerprint.layer}  \n`;
    }

    if (params.page_number !== undefined)
      errorMarkdown += `**Page Filter:** ${params.page_number}  \n`;
    if (params.annotation_type) errorMarkdown += `**Type Filter:** ${params.annotation_type}  \n`;
    if (params.author) errorMarkdown += `**Author Filter:** ${params.author}  \n`;

    errorMarkdown += `\n## Troubleshooting Tips\n`;
    errorMarkdown += `1. Verify the document ID is correct and the document exists\n`;
    errorMarkdown += `2. Check that you have permission to read annotations from this document\n`;
    errorMarkdown += `3. Ensure the Document Engine instance is accessible\n`;
    errorMarkdown += `4. Try removing filters if you're using specific page/type/author filters\n\n`;
    errorMarkdown += `Please check your parameters and try again.`;

    return { markdown: errorMarkdown };
  }
}
