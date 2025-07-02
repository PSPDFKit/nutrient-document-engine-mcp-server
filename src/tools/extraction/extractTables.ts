import { DocumentEngineClient } from '../../api/Client.js';
import { z } from 'zod';
import { DocumentFingerprintSchema } from '../schemas/DocumentFingerprintSchema.js';
import { MCPToolOutput } from '../../mcpTools.js';
import { getDocumentInfo } from '../../api/DocumentLayerAbstraction.js';

/**
 * Schema for extract_tables tool
 */
// Create a Zod schema for PageRange
const PageRangeSchema = z.object({
  start: z.number().optional(),
  end: z.number().optional(),
});

export const ExtractTablesSchema = {
  document_fingerprint: DocumentFingerprintSchema,
  page_range: PageRangeSchema.optional().describe(
    'Range of pages to include with start and end indices (0-based)'
  ),
};

export const ExtractTablesInputSchema = z.object(ExtractTablesSchema);
export type ExtractTablesInput = z.infer<typeof ExtractTablesInputSchema>;

/**
 * Extract tables from a document using the build-document API with JSONContentOutput
 */
export async function extractTables(
  client: DocumentEngineClient,
  params: ExtractTablesInput
): Promise<MCPToolOutput> {
  try {
    // Validate input
    const validatedParams = ExtractTablesInputSchema.parse(params);
    const { document_fingerprint, page_range } = validatedParams;

    // Get document info to get total page count and title
    const docInfo = await getDocumentInfo(client, document_fingerprint);

    const pageCount = docInfo.pageCount || 0;
    const title = docInfo.title || 'Untitled Document';

    // Prepare document part with optional page range
    const documentPart: {
      document: { id: string; layer?: string };
      pages?: { start?: number; end?: number };
    } = {
      document: {
        id: document_fingerprint.document_id,
        layer: document_fingerprint.layer,
      },
    };

    // Add page range if provided
    if (page_range) {
      documentPart.pages = page_range;
    }

    // Build request with JSONContentOutput for tables
    const response = await client['build-document'](
      {},
      {
        parts: [documentPart],
        output: {
          type: 'json-content',
          plainText: false,
          structuredText: false,
          keyValuePairs: false,
          tables: true,
        },
      }
    );

    // Extract the tables from the response
    // Ensure pages exist in the response
    const pages = response.data.pages || [];

    const tables = pages.flatMap((page, pageIndex) => {
      return (page.tables || []).map(table => ({
        ...table,
        pageIndex,
      }));
    });

    // Build the markdown content
    let markdown = `# Table Extraction\n\n`;
    markdown += `📄 **Document:** ${title}  \n`;
    markdown += `📄 **Document ID:** ${document_fingerprint.document_id}  \n`;
    if (document_fingerprint.layer) {
      markdown += `🔀 **Layer:** ${document_fingerprint.layer}  \n`;
    }
    markdown += `📑 **Total Pages:** ${pageCount}  \n`;

    // Add page range information if provided
    if (page_range) {
      let pageRangeText = 'Pages ';
      if (page_range.start !== undefined) {
        pageRangeText += `from ${page_range.start}`;
      }
      if (page_range.end !== undefined) {
        pageRangeText += `${page_range.start !== undefined ? ' to ' : ''}${page_range.end}`;
      }
      markdown += `📖 **Pages Processed:** ${pageRangeText}  \n`;
    } else {
      markdown += `📖 **Pages Processed:** All pages  \n`;
    }

    markdown += `📋 **Tables Found:** ${tables.length}  \n\n`;
    markdown += `---\n\n`;

    if (tables.length === 0) {
      markdown += `## No Tables Found\n\n`;
      markdown += `No tables were detected in the document. This could be because:\n\n`;
      markdown += `- The document doesn't contain any tables\n`;
      markdown += `- The tables are represented as images and not as structured data\n`;
      markdown += `- The table detection algorithm couldn't recognize the tables\n\n`;
    } else {
      markdown += `## Extracted Tables\n\n`;

      tables.forEach((table, tableIndex) => {
        const pageNumber = table.pageIndex + 1; // Convert to 1-based for display
        markdown += `### Table ${tableIndex + 1} (Page ${pageNumber})\n\n`;

        // Create markdown table
        if (table.cells && table.cells.length > 0) {
          // Group cells by row
          const rowsMap = new Map();
          table.cells.forEach(cell => {
            if (!rowsMap.has(cell.rowIndex)) {
              rowsMap.set(cell.rowIndex, []);
            }
            rowsMap.get(cell.rowIndex).push(cell);
          });

          // Sort rows by index
          const rows = Array.from(rowsMap.entries())
            .sort(([rowIndexA], [rowIndexB]) => rowIndexA - rowIndexB)
            .map(([_, cells]) => cells);

          // Find the maximum column index to determine table width
          const maxColIndex = Math.max(...table.cells.map(cell => cell.columnIndex));

          // Create header row
          markdown += '| ';
          for (let i = 0; i <= maxColIndex; i++) {
            markdown += `Column ${i + 1} | `;
          }
          markdown += '\n';

          // Create separator row
          markdown += '| ';
          for (let i = 0; i <= maxColIndex; i++) {
            markdown += '--- | ';
          }
          markdown += '\n';

          // Create data rows
          rows.forEach(cells => {
            markdown += '| ';

            // Sort cells by column index
            const sortedCells = [...cells].sort((a, b) => a.columnIndex - b.columnIndex);

            // Fill in empty cells
            let currentColIndex = 0;
            sortedCells.forEach(cell => {
              // Fill in any missing columns before this cell
              while (currentColIndex < cell.columnIndex) {
                markdown += ' | ';
                currentColIndex++;
              }

              // Add this cell's content
              markdown += `${cell.text || ''} | `;
              currentColIndex++;
            });

            // Fill in any remaining columns
            while (currentColIndex <= maxColIndex) {
              markdown += ' | ';
              currentColIndex++;
            }

            markdown += '\n';
          });

          markdown += '\n';
        } else {
          markdown += `*Table structure detected but no cells were found*\n\n`;
        }
      });
    }

    return { markdown };
  } catch (error) {
    // Provide a more user-friendly error message
    return {
      markdown: `# Error Extracting Tables\n\nAn error occurred while trying to extract tables: ${error instanceof Error ? error.message : String(error)}\n\nPlease check your connection and try again.`,
    };
  }
}
