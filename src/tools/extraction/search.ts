import { DocumentEngineClient } from '../../api/Client.js';
import { SearchResult } from '../../api/DocumentEngineSchema.js';
import { z } from 'zod';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { MCPToolOutput } from '../../mcpTools.js';
import { getDocumentInfo } from '../../api/DocumentLayerAbstraction.js';

/**
 * Schema for search tool
 */
export const SearchSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  query: z.string().describe('The search query: text, regex pattern, or preset name'),
  search_type: z
    .enum(['text', 'regex', 'preset'])
    .optional()
    .default('text')
    .describe("Type of search to perform (default: 'text')"),
  start_page: z
    .number()
    .int()
    .min(0)
    .optional()
    .default(0)
    .describe('Page index to start search from (0-based, default: 0)'),
  end_page: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('Last page index to include in search (0-based)'),
  include_annotations: z
    .boolean()
    .optional()
    .default(false)
    .describe('Whether to search inside annotations (default: false)'),
  case_sensitive: z
    .boolean()
    .optional()
    .describe('Override default case sensitivity (default depends on search_type)'),
};

export const SearchInputSchema = z.object(SearchSchema);
export type SearchInput = z.infer<typeof SearchInputSchema>;

/**
 * Search documents for text based on various search types (text, regex, preset)
 */
export async function search(
  client: DocumentEngineClient,
  params: SearchInput
): Promise<MCPToolOutput> {
  try {
    // Validate input
    const validatedParams = SearchInputSchema.parse(params);
    const {
      document_fingerprint,
      query,
      search_type,
      start_page,
      end_page,
      include_annotations,
      case_sensitive,
    } = validatedParams;

    // Get document info to get total page count (for validation and display)
    const docInfo = await getDocumentInfo(client, document_fingerprint);

    const pageCount = docInfo.pageCount || 0;
    const title = docInfo.title || 'Untitled Document';

    // Validate end_page if provided
    const validatedEndPage =
      end_page !== undefined ? Math.min(end_page, pageCount - 1) : pageCount - 1;

    // Make the search request
    const response = await client['search-document']({
      documentId: document_fingerprint.document_id,
      q: query,
      type: search_type,
      start: start_page,
      limit: validatedEndPage + 1, // API expects limit as the last page + 1
      include_annotations: include_annotations,
      ...(case_sensitive !== undefined ? { case_sensitive } : {}),
    });

    const searchResults = response.data.data as SearchResult[];

    // Build the markdown content
    let markdown = `# Search Results\n\n`;
    markdown += `📄 **Document:** ${title}  \n`;
    markdown += `📄 **Document ID:** ${document_fingerprint.document_id}  \n`;
    if (document_fingerprint.layer) {
      markdown += `🔀 **Layer:** ${document_fingerprint.layer}  \n`;
    }
    markdown += `🔍 **Query:** "${query}"  \n`;
    markdown += `🔎 **Search Type:** ${search_type}  \n`;
    markdown += `📋 **Results Found:** ${searchResults.length}  \n`;
    markdown += `📑 **Pages Searched:** ${start_page} to ${validatedEndPage} (of ${pageCount} total)  \n`;
    markdown += `🔠 **Case Sensitive:** ${case_sensitive !== undefined ? (case_sensitive ? 'Yes' : 'No') : search_type === 'text' ? 'No' : 'Yes'}  \n`;
    markdown += `📝 **Include Annotations:** ${include_annotations ? 'Yes' : 'No'}  \n\n`;

    if (searchResults.length === 0) {
      markdown += `## No Results Found\n\n`;
      markdown += `No matches were found for "${query}" in the specified page range.\n\n`;
      markdown += `### Suggestions:\n\n`;
      markdown += `- Check for typos in your search query\n`;
      markdown += `- Try a different search type (text, regex, or preset)\n`;
      markdown += `- Expand your search to include more pages\n`;
      markdown += `- Try a more general search term\n`;
    } else {
      markdown += `---\n\n`;
      markdown += `## Results\n\n`;

      // Group results by page
      const resultsByPage: { [pageIndex: number]: SearchResult[] } = {};
      searchResults.forEach(result => {
        if (!resultsByPage[result.pageIndex]) {
          resultsByPage[result.pageIndex] = [];
        }
        resultsByPage[result.pageIndex].push(result);
      });

      // Display results by page
      Object.keys(resultsByPage)
        .map(Number)
        .sort((a, b) => a - b)
        .forEach(pageIndex => {
          const pageResults = resultsByPage[pageIndex];
          const pageNumber = pageIndex + 1; // Convert to 1-based for display

          markdown += `### Page ${pageNumber} (${pageResults.length} ${pageResults.length === 1 ? 'match' : 'matches'})\n\n`;

          pageResults.forEach((result, index) => {
            const previewText = result.previewText || 'No preview available';

            markdown += `**Match ${index + 1}:**\n\n`;

            // Format preview text with highlighting if range is available
            if (result.previewText && result.rangeInPreview) {
              const [start, length] = result.rangeInPreview;
              const before = previewText.substring(0, start);
              const match = previewText.substring(start, start + length);
              const after = previewText.substring(start + length);

              markdown += `"${before}**${match}**${after}"\n\n`;
            } else {
              markdown += `"${previewText}"\n\n`;
            }

            // Add location information
            if (result.rectsOnPage && result.rectsOnPage.length > 0) {
              markdown += `Location: ${result.rectsOnPage.length} ${result.rectsOnPage.length === 1 ? 'occurrence' : 'occurrences'} on page\n\n`;
            }
          });

          markdown += `---\n\n`;
        });
    }

    // Add tips
    markdown += `💡 **Tips:**\n\n`;
    markdown += `- Use \`extract_text\` to view the full text content of specific pages\n`;
    markdown += `- Use \`add_annotation\` to highlight or mark important search results\n`;

    return { markdown };
  } catch (error) {
    // Provide a more user-friendly error message
    return {
      markdown: `# Error Searching Document\n\nAn error occurred while searching the document: ${error instanceof Error ? error.message : String(error)}\n\nPlease check your connection and try again.`,
    };
  }
}
