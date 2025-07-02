import { DocumentEngineClient } from '../../api/Client.js';
import { z } from 'zod';
import { DocumentPart } from '../../api/DocumentEngineSchema.js';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { MCPToolOutput } from '../../mcpTools.js';
import { getDocumentInfo } from '../../api/DocumentLayerAbstraction.js';

/**
 * Schema for extract_key_value_pairs tool
 */
// Create a Zod schema for PageRange
const PageRangeSchema = z.object({
  start: z.number().optional(),
  end: z.number().optional(),
});

export const ExtractKeyValuePairsSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  page_range: PageRangeSchema.optional().describe(
    'Range of pages to include with start and end indices (0-based)'
  ),
};

export const ExtractKeyValuePairsInputSchema = z.object(ExtractKeyValuePairsSchema);
export type ExtractKeyValuePairsInput = z.infer<typeof ExtractKeyValuePairsInputSchema>;

/**
 * Extract key value pairs from a document using OCR and document analysis
 */
export async function extractKeyValuePairs(
  client: DocumentEngineClient,
  params: ExtractKeyValuePairsInput
): Promise<MCPToolOutput> {
  try {
    // Validate input
    const validatedParams = ExtractKeyValuePairsInputSchema.parse(params);
    const { document_fingerprint, page_range } = validatedParams;

    // Get document info to get total page count and title
    const docInfo = await getDocumentInfo(client, document_fingerprint);

    const pageCount = docInfo.pageCount || 0;
    const title = docInfo.title || 'Untitled Document';

    // Prepare document part with optional page range
    const documentPart: DocumentPart = {
      document: {
        id: document_fingerprint.document_id,
        layer: document_fingerprint.layer,
      },
    };

    // Add page range if provided
    if (page_range) {
      documentPart['pages'] = page_range;
    }

    // Build request with JSONContentOutput for key-value pairs
    const response = await client['build-document'](
      {},
      {
        parts: [documentPart],
        output: {
          type: 'json-content',
          plainText: false,
          structuredText: false,
          keyValuePairs: true,
          tables: false,
        },
      }
    );

    // Extract the key-value pairs from the response, preserving page information
    // Build the markdown content
    let markdown = `# Key-Value Pair Extraction\n\n`;
    markdown += `📄 **Document:** ${title}  \n`;
    markdown += `📄 **Document ID:** ${document_fingerprint.document_id}  \n`;
    if (document_fingerprint.layer) {
      markdown += `🔀 **Layer:** ${document_fingerprint.layer} \n`;
    }
    markdown += `📑 **Total Pages:** ${pageCount}  \n`;

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
    // Ensure pages exist in the response
    const pages = response.data.pages || [];

    // Calculate the total number of key-value pairs
    const numberOfKVPairs = pages.flatMap(page => page.keyValuePairs || []).length;

    markdown += `🔑 **Key-Value Pairs Extracted:** ${numberOfKVPairs}  \n\n`;

    markdown += `---\n\n`;
    markdown += `## Extracted Key-Value Pairs\n\n`;

    if (numberOfKVPairs === 0) {
      markdown += `No key-value pairs were extracted from the document. This could be because:\n\n`;
      markdown += `- The document doesn't contain structured key-value data\n`;
      markdown += `- The document analysis couldn't recognize any key-value pairs\n`;
      markdown += `- The document pages are blank or contain only unstructured text\n\n`;
    } else {
      markdown += `| Key | Value | Page |\n`;
      markdown += `| --- | ----- | ---- |\n`;

      pages.forEach(page => {
        const keyValuePairs = page.keyValuePairs || [];
        keyValuePairs.forEach(pair => {
          // Ensure key and value content exist
          const keyContent = pair.key?.content || '';
          const valueContent = pair.value?.content || '';

          // Escape pipe characters in markdown table
          const escapedKey = keyContent.replace(/\|/g, '\\|');
          const escapedValue = valueContent.replace(/\|/g, '\\|');

          markdown += `| ${escapedKey} | ${escapedValue} | ${page.pageIndex || 0} |\n`;
        });
      });

      markdown += `\n`;
    }

    return { markdown };
  } catch (error) {
    // Provide a more user-friendly error message
    return {
      markdown: `# Error Extracting Key-Value Pairs\n\nAn error occurred while trying to extract key-value pairs: ${error instanceof Error ? error.message : String(error)}\n\nPlease check your connection and try again.`,
    };
  }
}
