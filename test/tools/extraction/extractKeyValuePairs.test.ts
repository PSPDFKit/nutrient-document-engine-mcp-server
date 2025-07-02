import { beforeEach, describe, expect, it, vi } from 'vitest';
import { extractKeyValuePairs } from '../../../src/tools/extraction/extractKeyValuePairs.js';

import {
  BuildResponseJsonContents,
  JsonContentsBbox,
} from '../../../src/api/DocumentEngineSchema.js';
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

describe('extractKeyValuePairs', () => {
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('successful scenarios', () => {
    it('should extract key-value pairs from all pages when no page range is provided', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 2,
          },
        },
      });

      const mockBbox: JsonContentsBbox = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      };

      // Mock build-document response
      const mockBuildResponse: { data: BuildResponseJsonContents } = {
        data: {
          pages: [
            {
              pageIndex: 0,
              keyValuePairs: [
                {
                  confidence: 95,
                  key: { content: 'Name', bbox: mockBbox },
                  value: { content: 'John Doe', bbox: mockBbox, dataType: 'Name' },
                },
                {
                  confidence: 90,
                  key: { content: 'Email', bbox: mockBbox },
                  value: { content: 'john.doe@example.com', bbox: mockBbox, dataType: 'String' },
                },
              ],
            },
            {
              pageIndex: 1,
              keyValuePairs: [
                {
                  confidence: 85,
                  key: { content: 'Phone', bbox: mockBbox },
                  value: { content: '123-456-7890', bbox: mockBbox, dataType: 'PhoneNumber' },
                },
              ],
            },
          ],
        },
      };

      // Set up the mock responses
      mockClient['build-document'].mockResolvedValue(mockBuildResponse);

      // Call the function
      const result = await extractKeyValuePairs(mockClient, {
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
            keyValuePairs: true,
            tables: false,
          },
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Key-Value Pair Extraction');
      expect(result.markdown).toContain('📄 **Document:** Test Document');
      expect(result.markdown).toContain('📑 **Total Pages:** 2');
      expect(result.markdown).toContain('📖 **Pages Processed:** All pages');
      expect(result.markdown).toContain('🔑 **Key-Value Pairs Extracted:** 3');
      expect(result.markdown).toContain('| Key | Value | Page |');
      expect(result.markdown).toContain('| Name | John Doe | 0 |');
    });

    it('should extract key-value pairs from specified page range', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 3,
          },
        },
      });

      const mockBbox: JsonContentsBbox = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      };

      // Mock build-document response
      const mockBuildResponse: { data: BuildResponseJsonContents } = {
        data: {
          pages: [
            {
              pageIndex: 0,
            },
            {
              pageIndex: 1,
              keyValuePairs: [
                {
                  confidence: 80,
                  key: { content: 'Address', bbox: mockBbox },
                  value: { content: '123 Main St', bbox: mockBbox, dataType: 'String' },
                },
              ],
            },
          ],
        },
      };

      // Set up the mock responses
      mockClient['build-document'].mockResolvedValue(mockBuildResponse);

      // Call the function with page_range
      const result = await extractKeyValuePairs(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_range: { start: 2 },
      });
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
            keyValuePairs: true,
            tables: false,
          },
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('📖 **Pages Processed:** 2-end');
      expect(result.markdown).toContain('🔑 **Key-Value Pairs Extracted:** 1');
      expect(result.markdown).toContain('| Key | Value | Page |');
      expect(result.markdown).toContain('| Address | 123 Main St | 1 |');
    });

    it('should handle empty key-value pairs result', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 1,
          },
        },
      });

      // Mock build-document response with empty key-value pairs
      const mockBuildResponse: { data: BuildResponseJsonContents } = {
        data: {
          pages: [
            {
              pageIndex: 0,
              keyValuePairs: [],
            },
          ],
        },
      };

      // Set up the mock responses
      mockClient['build-document'].mockResolvedValue(mockBuildResponse);

      // Call the function
      const result = await extractKeyValuePairs(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('🔑 **Key-Value Pairs Extracted:** 0');
      expect(result.markdown).toContain('No key-value pairs were extracted from the document.');
      expect(result.markdown).toContain("- The document doesn't contain structured key-value data");
    });

    it('should handle missing keyValuePairs property', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 1,
          },
        },
      });

      // Mock build-document response with missing keyValuePairs property
      const mockBuildResponse: { data: BuildResponseJsonContents } = {
        data: {
          pages: [
            {
              pageIndex: 0,
              // No keyValuePairs property
            },
          ],
        },
      };

      // Set up the mock responses
      mockClient['build-document'].mockResolvedValue(mockBuildResponse);

      // Call the function
      const result = await extractKeyValuePairs(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('**Key-Value Pairs Extracted:** 0');
      // The current implementation will show "No key-value pairs were extracted" when numberOfKVPairs is 0
      expect(result.markdown).toContain('No key-value pairs were extracted from the document.');
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

      const mockBbox: JsonContentsBbox = {
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      };

      // Mock build-document response
      const mockBuildResponse: { data: BuildResponseJsonContents } = {
        data: {
          pages: [
            {
              pageIndex: 0,
              keyValuePairs: [
                {
                  confidence: 95,
                  key: { content: 'Layer Name', bbox: mockBbox },
                  value: { content: 'John Layer', bbox: mockBbox, dataType: 'Name' },
                },
                {
                  confidence: 90,
                  key: { content: 'Layer Email', bbox: mockBbox },
                  value: { content: 'layer@example.com', bbox: mockBbox, dataType: 'String' },
                },
              ],
            },
          ],
        },
      };

      // Set up the mock responses
      mockClient['build-document'].mockResolvedValue(mockBuildResponse);

      // Call the function with layer
      const result = await extractKeyValuePairs(mockClient, {
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
            keyValuePairs: true,
            tables: false,
          },
        }
      );

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Key-Value Pair Extraction');
      expect(result.markdown).toContain('📄 **Document:** Test Document');
      expect(result.markdown).toContain('📄 **Document ID:** doc_123');
      expect(result.markdown).toContain('🔀 **Layer:** review-layer');
      expect(result.markdown).toContain('🔑 **Key-Value Pairs Extracted:** 2');
      expect(result.markdown).toContain('| Layer Name | John Layer | 0 |');
      expect(result.markdown).toContain('| Layer Email | layer@example.com | 0 |');
    });
  });

  describe('error scenarios', () => {
    it('should handle API errors gracefully', async () => {
      // Mock fetch-document-info to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await extractKeyValuePairs(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Extracting Key-Value Pairs');
      expect(result.markdown).toContain(
        `An error occurred while trying to extract key-value pairs: ${errorMessage}`
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
      const errorMessage = 'API Error: Key-value extraction failed';
      mockClient['build-document'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await extractKeyValuePairs(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Extracting Key-Value Pairs');
      expect(result.markdown).toContain(
        `An error occurred while trying to extract key-value pairs: ${errorMessage}`
      );
    });
  });
});
