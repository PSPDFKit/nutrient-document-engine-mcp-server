import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { splitDocument } from '../../../src/tools/document-editing/splitDocument.js';
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

// Mock the handleApiError function
vi.mock('../../../src/utils/ErrorHandling.js', () => ({
  handleApiError: vi.fn(error => {
    throw error;
  }),
}));

describe('splitDocument', () => {
  let mockClient: MockedDocumentEngineClient;
  const mockDate = new Date('2023-01-01T12:00:00Z');

  beforeEach(() => {
    mockClient = createMockClient();

    // Mock Date.now() to return a consistent date for testing
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);
    vi.spyOn(global.Math, 'random').mockReturnValue(0.123456789);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful scenarios', () => {
    it('should split a document into multiple parts', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 10,
            title: 'Test Document',
          },
        },
      });

      // Mock copy document response
      mockClient['copy-document']
        .mockResolvedValueOnce({
          data: {
            data: {
              document_id: 'doc_part1',
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: {
              document_id: 'doc_part2',
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: {
              document_id: 'doc_part3',
            },
          },
        });

      // Mock document-apply-instructions response for page removal
      mockClient['document-apply-instructions'].mockResolvedValue({
        data: {
          documentId: 'doc_processed',
        },
      });

      // Call the function with split points
      const result = await splitDocument(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        split_points: [3, 7],
        naming_pattern: 'part_{index}',
      });

      // Basic verification - just check that the function completed and returned markdown
      expect(result.markdown).toBeDefined();
      expect(typeof result.markdown).toBe('string');
      expect(result.markdown).toContain('# Document Split Complete');
      expect(result.markdown).toContain('**Original Document:** Test Document');
      expect(result.markdown).toContain('**Total Pages Processed:** 10');
      expect(result.markdown).toContain('**Split into:** 3 parts');
      expect(result.markdown).toContain('**Split Points Used:** 3, 7');

      // Check for part details
      expect(result.markdown).toContain('### 📄 Part 1:');
      expect(result.markdown).toContain('- **Document ID:** doc_123');
      expect(result.markdown).toContain('- **Pages:** 1-3');

      expect(result.markdown).toContain('### 📄 Part 2:');
      expect(result.markdown).toContain('- **Document ID:** doc_part1');
      expect(result.markdown).toContain('- **Pages:** 4-7');

      expect(result.markdown).toContain('### 📄 Part 3:');
      expect(result.markdown).toContain('- **Document ID:** doc_part2');
      expect(result.markdown).toContain('- **Pages:** 8-10');
    });

    it('should work with layers', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Mock layer info response
      mockClient['fetch-document-layer-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
            layer: 'review-layer',
            documentId: 'doc_123',
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-02T12:00:00Z',
          },
        },
      });

      // Mock copy document response for layer-specific endpoint
      mockClient['copy-document-layer-with-instant-json']
        .mockResolvedValueOnce({
          data: {
            documentId: 'split_doc_part1',
          },
        })
        .mockResolvedValueOnce({
          data: {
            documentId: 'split_doc_part2',
          },
        });

      // Call the function with layer
      const result = await splitDocument(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        split_points: [2, 4],
        naming_pattern: 'split_{index}',
      });

      // Verify copy-document was called with layer information
      expect(mockClient['copy-document-layer-with-instant-json']).toHaveBeenCalledTimes(2);
      expect(mockClient['copy-document-layer-with-instant-json']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        layerName: 'review-layer',
      });

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Document Split Complete');
      expect(result.markdown).toContain('**Original Document:** Test Document');
      expect(result.markdown).toContain('**Total Pages Processed:** 5');
      expect(result.markdown).toContain('**Split into:** 3 parts');
    });

    it('should handle a single split point', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Mock copy document response
      mockClient['copy-document']
        .mockResolvedValueOnce({
          data: {
            data: {
              document_id: 'doc_part1',
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: {
              document_id: 'doc_part2',
            },
          },
        });

      // Mock document-apply-instructions response for page removal
      mockClient['document-apply-instructions'].mockResolvedValue({
        data: {
          documentId: 'doc_processed',
        },
      });

      // Call the function with a single split point
      const result = await splitDocument(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        split_points: [2],
        naming_pattern: 'part_{index}',
      });

      // Verify copy-document was called once (for two parts, using original document as first part)
      expect(mockClient['copy-document']).toHaveBeenCalledTimes(1);

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Document Split Complete');
      expect(result.markdown).toContain('**Split into:** 2 parts');
      expect(result.markdown).toContain('**Split Points Used:** 2');

      // Check for part details
      expect(result.markdown).toContain('### 📄 Part 1:');
      expect(result.markdown).toContain('- **Pages:** 1-2');
      expect(result.markdown).toContain('- **Document ID:** doc_123');

      expect(result.markdown).toContain('### 📄 Part 2:');
      expect(result.markdown).toContain('- **Pages:** 3-5');
      expect(result.markdown).toContain('- **Document ID:** doc_part1');
    });

    it('should handle custom part naming', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 6,
            title: 'Test Document',
          },
        },
      });

      // Mock copy document response
      mockClient['copy-document']
        .mockResolvedValueOnce({
          data: {
            data: {
              document_id: 'doc_part1',
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: {
              document_id: 'doc_part2',
            },
          },
        });

      // Mock document-apply-instructions response for page removal
      mockClient['document-apply-instructions'].mockResolvedValue({
        data: {
          documentId: 'doc_processed',
        },
      });

      // Call the function with custom part naming
      const result = await splitDocument(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        split_points: [3],
        naming_pattern: 'Section {index}',
      });

      // Verify the result contains the custom part naming
      expect(result.markdown).toContain('### 📄 Part 1: Test Document_Section 1.pdf');
      expect(result.markdown).toContain('- **Pages:** 1-3');
      expect(result.markdown).toContain('### 📄 Part 2: Test Document_Section 2.pdf');
      expect(result.markdown).toContain('- **Pages:** 4-6');
    });
  });

  describe('error scenarios', () => {
    it('should handle invalid split points', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Call the function with invalid split points
      const result = await splitDocument(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        split_points: [0, 5, 10], // 0 is too low, 10 is too high
        naming_pattern: 'part_{index}',
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Splitting Document');
      expect(result.markdown).toContain('An error occurred while trying to split the document:');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Split Points:** 0, 5, 10');
      expect(result.markdown).toContain('## Troubleshooting Tips');
    });

    it('should handle API errors during document copy', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Mock copy document to throw an error
      const errorMessage = 'API Error: Failed to copy document';
      mockClient['copy-document'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await splitDocument(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        split_points: [2],
        naming_pattern: 'part_{index}',
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Splitting Document');
      expect(result.markdown).toContain(
        `An error occurred while trying to split the document: ${errorMessage}`
      );
    });

    it('should handle API errors during page removal', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Mock copy document to succeed
      mockClient['copy-document'].mockResolvedValue({
        data: {
          data: {
            document_id: 'doc_part1',
          },
        },
      });

      // Mock apply instructions to throw an error
      const errorMessage = 'API Error: Failed to remove pages';
      mockClient['document-apply-instructions'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await splitDocument(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        split_points: [2],
        naming_pattern: 'part_{index}',
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Splitting Document');
      expect(result.markdown).toContain(
        `An error occurred while trying to split the document: ${errorMessage}`
      );
    });

    it('should handle document info errors', async () => {
      // Mock fetch-document-info to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await splitDocument(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        split_points: [2],
        naming_pattern: 'part_{index}',
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Splitting Document');
      expect(result.markdown).toContain(
        `An error occurred while trying to split the document: ${errorMessage}`
      );
    });
  });
});
