import { beforeEach, describe, expect, it, vi } from 'vitest';
import { extractTables } from '../../../src/tools/extraction/extractTables.js';
import { createMockClient, MockedDocumentEngineClient } from '../../utils/mockTypes.js';

// Mock the logger to prevent console output during tests
vi.mock('../../../src/utils/Logger.js', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('extract_tables', () => {
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('successful scenarios', () => {
    it('should extract tables from all pages when no page range is provided', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 2,
          },
        },
      });

      // Mock build-document response with tables
      const mockBuildResponse = {
        data: {
          pages: [
            {
              tables: [
                {
                  cells: [
                    { rowIndex: 0, columnIndex: 0, text: 'Header 1' },
                    { rowIndex: 0, columnIndex: 1, text: 'Header 2' },
                    { rowIndex: 1, columnIndex: 0, text: 'Data 1' },
                    { rowIndex: 1, columnIndex: 1, text: 'Data 2' },
                  ],
                },
              ],
            },
            {
              tables: [
                {
                  cells: [
                    { rowIndex: 0, columnIndex: 0, text: 'Table 2 Header' },
                    { rowIndex: 1, columnIndex: 0, text: 'Table 2 Data' },
                  ],
                },
              ],
            },
          ],
        },
      };

      // Set up the mock responses
      mockClient['build-document'].mockResolvedValue(mockBuildResponse);

      // Call the function
      const result = await extractTables(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      expect(mockClient['build-document']).toHaveBeenCalledWith(
        {},
        {
          parts: [
            {
              document: {
                id: 'doc_123',
              },
            },
          ],
          output: {
            type: 'json-content',
            plainText: false,
            structuredText: false,
            keyValuePairs: false,
            tables: true,
          },
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Table Extraction');
      expect(result.markdown).toContain('**Document:** Test Document');
      expect(result.markdown).toContain('**Total Pages:** 2');
      expect(result.markdown).toContain('**Pages Processed:** All pages');
      expect(result.markdown).toContain('**Tables Found:** 2');
      expect(result.markdown).toContain('### Table 1 (Page 1)');
      expect(result.markdown).toContain('### Table 2 (Page 2)');
      expect(result.markdown).toContain('Header 1');
      expect(result.markdown).toContain('Header 2');
      expect(result.markdown).toContain('Data 1');
      expect(result.markdown).toContain('Data 2');
      expect(result.markdown).toContain('Table 2 Header');
      expect(result.markdown).toContain('Table 2 Data');
    });

    it('should extract tables from specified page range', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 3,
          },
        },
      });

      // Mock build-document response with tables
      const mockBuildResponse = {
        data: {
          pages: [
            {
              tables: [
                {
                  cells: [
                    { rowIndex: 0, columnIndex: 0, text: 'Page 2 Table Header' },
                    { rowIndex: 1, columnIndex: 0, text: 'Page 2 Table Data' },
                  ],
                },
              ],
            },
          ],
        },
      };

      // Set up the mock responses
      mockClient['build-document'].mockResolvedValue(mockBuildResponse);

      // Call the function with page_range
      const result = await extractTables(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_range: { start: 2 },
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['build-document']).toHaveBeenCalledWith(
        {},
        {
          parts: [
            {
              document: {
                id: 'doc_123',
              },
              pages: { start: 2 },
            },
          ],
          output: {
            type: 'json-content',
            plainText: false,
            structuredText: false,
            keyValuePairs: false,
            tables: true,
          },
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('**Pages Processed:** Pages from 2');
      expect(result.markdown).toContain('**Tables Found:** 1');
      expect(result.markdown).toContain('### Table 1 (Page 1)');
      expect(result.markdown).toContain('Page 2 Table Header');
      expect(result.markdown).toContain('Page 2 Table Data');
    });

    it('should handle no tables found', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 1,
          },
        },
      });

      // Mock build-document response with no tables
      const mockBuildResponse = {
        data: {
          pages: [
            {
              tables: [],
            },
          ],
        },
      };

      // Set up the mock responses
      mockClient['build-document'].mockResolvedValue(mockBuildResponse);

      // Call the function
      const result = await extractTables(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('**Tables Found:** 0');
      expect(result.markdown).toContain('## No Tables Found');
      expect(result.markdown).toContain('No tables were detected in the document.');
      expect(result.markdown).toContain("- The document doesn't contain any tables");
    });

    it('should handle table structure with no cells', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 1,
          },
        },
      });

      // Mock build-document response with table structure but no cells
      const mockBuildResponse = {
        data: {
          pages: [
            {
              tables: [
                {
                  cells: [],
                },
              ],
            },
          ],
        },
      };

      // Set up the mock responses
      mockClient['build-document'].mockResolvedValue(mockBuildResponse);

      // Call the function
      const result = await extractTables(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('**Tables Found:** 1');
      expect(result.markdown).toContain('### Table 1 (Page 1)');
      expect(result.markdown).toContain('*Table structure detected but no cells were found*');
    });

    it('should work with layers', async () => {
      // Mock layer info response
      mockClient['fetch-document-layer-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            layer: 'review-layer',
            documentId: 'doc_123',
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-02T12:00:00Z',
          },
        },
      });

      // Mock build-document response with tables
      const mockBuildResponse = {
        data: {
          pages: [
            {
              tables: [
                {
                  cells: [
                    { rowIndex: 0, columnIndex: 0, text: 'Layer Header 1' },
                    { rowIndex: 0, columnIndex: 1, text: 'Layer Header 2' },
                    { rowIndex: 1, columnIndex: 0, text: 'Layer Data 1' },
                    { rowIndex: 1, columnIndex: 1, text: 'Layer Data 2' },
                  ],
                },
              ],
            },
          ],
        },
      };

      // Set up the mock responses
      mockClient['build-document'].mockResolvedValue(mockBuildResponse);

      // Call the function with layer
      const result = await extractTables(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
      });

      // Verify the build-document was called with the correct parameters including layer
      expect(mockClient['build-document']).toHaveBeenCalledWith(
        {},
        {
          parts: [
            {
              document: {
                id: 'doc_123',
                layer: 'review-layer',
              },
            },
          ],
          output: {
            type: 'json-content',
            plainText: false,
            structuredText: false,
            keyValuePairs: false,
            tables: true,
          },
        }
      );

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Table Extraction');
      expect(result.markdown).toContain('**Document:** Test Document');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Layer:** review-layer');
      expect(result.markdown).toContain('**Tables Found:** 1');
      expect(result.markdown).toContain('Layer Header 1');
      expect(result.markdown).toContain('Layer Data 1');
    });
  });

  describe('error scenarios', () => {
    it('should handle API errors gracefully', async () => {
      // Mock fetch-document-info to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await extractTables(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Extracting Tables');
      expect(result.markdown).toContain(
        `An error occurred while trying to extract tables: ${errorMessage}`
      );
    });

    it('should handle build-document API errors', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 1,
          },
        },
      });

      // Mock the build-document to throw an error
      const errorMessage = 'API Error: Table extraction failed';
      mockClient['build-document'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await extractTables(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Extracting Tables');
      expect(result.markdown).toContain(
        `An error occurred while trying to extract tables: ${errorMessage}`
      );
    });
  });
});
