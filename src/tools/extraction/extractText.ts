import { DocumentEngineClient } from '../../api/Client.js';
import { TextLine } from '../../api/DocumentEngineSchema.js';
import { z } from 'zod';
import { MCPToolOutput } from '../../mcpTools.js';
import { getDocumentInfo, getDocumentPageText } from '../../api/DocumentLayerAbstraction.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { formatBBox } from '../../utils/Common.js';

/**
 * Schema for extract_text tool
 */
// Create a Zod schema for PageRange
const PageRangeSchema = z.object({
  start: z.number().optional(),
  end: z.number().optional(),
});

export const ExtractTextSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  page_range: PageRangeSchema.optional().describe(
    'Range of pages to include with start and end indices (0-based)'
  ),
  include_coordinates: z
    .boolean()
    .optional()
    .default(false)
    .describe('Whether to include text coordinates'),
  ocr_enabled: z
    .boolean()
    .optional()
    .default(false)
    .describe('Whether to enable OCR for text extraction'),
};

export const ExtractTextInputSchema = z.object(ExtractTextSchema);
export type ExtractTextInput = z.infer<typeof ExtractTextInputSchema>;
/**
 * Extract text content from a document with OCR support and pagination
 */
export async function extractText(
  client: DocumentEngineClient,
  params: ExtractTextInput
): Promise<MCPToolOutput> {
  try {
    // Validate input
    const validatedParams = ExtractTextInputSchema.parse(params);
    const {
      document_fingerprint,
      page_range,
      include_coordinates = false,
      ocr_enabled = false,
    } = validatedParams;

    // Get document info to get total page count
    const docInfo = await getDocumentInfo(client, document_fingerprint);
    const pageCount = docInfo.pageCount || 0;

    // Parse page range if provided, otherwise use all pages
    let pageIndices: number[] = [];
    if (page_range) {
      const start = page_range.start !== undefined ? page_range.start : 0;
      const end = page_range.end !== undefined ? page_range.end : pageCount - 1;

      // Validate page range
      if (start < 0 || start >= pageCount) {
        throw new Error(
          `Page range start ${start} is out of bounds (document has ${pageCount} pages, valid indices are 0-${pageCount - 1})`
        );
      }
      if (end < 0 || end >= pageCount) {
        throw new Error(
          `Page range end ${end} is out of bounds (document has ${pageCount} pages, valid indices are 0-${pageCount - 1})`
        );
      }
      if (start > end) {
        throw new Error(
          `Invalid page range: start (${start}) must be less than or equal to end (${end})`
        );
      }

      // Generate array of page indices from start to end
      pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    } else {
      pageIndices = Array.from({ length: pageCount }, (_, i) => i);
    }

    // Fetch text for each page
    const pageTextPromises = pageIndices.map(async pageIndex => {
      const response = await getDocumentPageText(
        client,
        document_fingerprint,
        pageIndex,
        ocr_enabled
      );
      return {
        pageIndex,
        textLines: response.data.textLines,
      };
    });

    const pageTexts = await Promise.all(pageTextPromises);

    // Count total words
    let totalWords = 0;
    pageTexts.forEach(page => {
      const textLines = page.textLines || [];
      textLines.forEach((line: TextLine) => {
        // Count words in each line by splitting on whitespace
        const words = line.contents.trim().split(/\s+/).filter(Boolean);
        totalWords += words.length;
      });
    });

    // Build the markdown content
    let markdown = `# Text Extraction\n\n`;
    markdown += `📄 **Document ID:** ${document_fingerprint.document_id}  \n`;
    if (document_fingerprint.layer) {
      markdown += `🔖 **Layer:** ${document_fingerprint.layer}  \n`;
    }
    markdown += `📄 **Total Pages:** ${pageCount}  \n`;
    markdown += `📝 **Total Words:** ${totalWords.toLocaleString()}  \n`;
    markdown += `🔍 **OCR Applied:** ${ocr_enabled ? 'Yes' : 'No'}  \n`;

    // Add page range information if provided
    if (page_range) {
      const rangeText =
        page_range.start !== undefined && page_range.end !== undefined
          ? `${page_range.start}-${page_range.end}`
          : page_range.start !== undefined
            ? `${page_range.start}-end`
            : page_range.end !== undefined
              ? `0-${page_range.end}`
              : 'All pages';
      markdown += `📖 **Pages Processed:** ${rangeText}  \n`;
    } else {
      markdown += `📖 **Pages Processed:** All pages  \n`;
    }

    markdown += `\n---\n\n`;

    // Add text content for each page
    pageTexts.forEach(page => {
      const pageNumber = page.pageIndex + 1;

      // Count words on this page
      let pageWordCount = 0;
      const textLines = page.textLines || [];
      textLines.forEach((line: TextLine) => {
        const words = line.contents.trim().split(/\s+/).filter(Boolean);
        pageWordCount += words.length;
      });

      markdown += `## Page ${pageNumber} (${pageWordCount} words)\n`;

      // Add coordinates if requested or if OCR
      if (include_coordinates || ocr_enabled) {
        markdown += `### Coordinates for Page ${pageNumber}\n`;
        markdown += `\`\`\`json\n`;
        markdown += JSON.stringify(
          textLines.map((line: TextLine) => ({
            contents: line.contents,
            boundingBox: formatBBox([
              line.left || 0,
              line.top || 0,
              line.width || 0,
              line.height || 0,
            ]),
          })),
          null,
          2
        );
        markdown += `\n\`\`\`\n\n`;
      } else {
        // Combine all text lines for this page
        const pageText = textLines.map((line: TextLine) => line.contents).join(' ');
        markdown += `${pageText}\n\n`;
      }
    });

    markdown += `---\n\n`;
    markdown += `💡 **Tip:** Use \`extract_form_data\` if this document contains fillable forms.\n`;

    return { markdown };
  } catch (error) {
    // Provide a more user-friendly error message
    return {
      markdown: `# Error Extracting Text\n\nAn error occurred while trying to extract text: ${error instanceof Error ? error.message : String(error)}\n\nPlease check your connection and try again.`,
    };
  }
}
