import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mergeDocumentPages } from '../../../src/tools/document-editing/mergeDocumentPages.js';
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
  handleApiError: vi.fn(error => error),
}));

describe('mergeDocumentPages', () => {
  let mockClient: MockedDocumentEngineClient;
  const mockDate = new Date('2023-01-01T12:00:00Z');

  beforeEach(() => {
    mockClient = createMockClient();

    // Mock Date to return a consistent date for testing
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);

    // Mock Date.now
    // Mock Date.now() to return a consistent date
    Date.now = vi.fn(() => mockDate.getTime());

    // Reset mocks
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful scenarios', () => {
    it('should merge documents with all pages successfully', async () => {
      // Mock document info responses
      mockClient['fetch-document-info']
        .mockResolvedValueOnce({
          data: {
            data: {
              pageCount: 3,
              title: 'Document 1',
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: {
              pageCount: 2,
              title: 'Document 2',
            },
          },
        });

      // Mock create from instructions response
      mockClient['upload-document'].mockResolvedValue({
        data: {
          data: {
            document_id: 'merged_doc_123',
          },
        },
      });

      // Call the function
      const result = await mergeDocumentPages(mockClient, {
        parts: [
          { document_fingerprint: { document_id: 'doc_1' } },
          { document_fingerprint: { document_id: 'doc_2' } },
        ],
      });

      // Basic verification - just check that the function completed and returned markdown
      expect(result.markdown).toBeDefined();
      expect(typeof result.markdown).toBe('string');
      expect(result.markdown).toContain('# Documents Merged Successfully');
      expect(result.markdown).toContain('**Status:** Documents merged');
      expect(result.markdown).toContain('**New Document ID:** merged_doc_123');
      expect(result.markdown).toContain('**Total Pages:** 5');
      expect(result.markdown).toContain('### Part 1: Document 1');
      expect(result.markdown).toContain('### Part 2: Document 2');
      expect(result.markdown).toContain('**Documents Merged:** 2');
    });

    it('should merge documents with specific page ranges', async () => {
      // Mock document info responses
      mockClient['fetch-document-info']
        .mockResolvedValueOnce({
          data: {
            data: {
              pageCount: 5,
              title: 'Document 1',
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: {
              pageCount: 10,
              title: 'Document 2',
            },
          },
        });

      // Mock create from instructions response
      mockClient['upload-document'].mockResolvedValue({
        data: {
          data: {
            document_id: 'merged_doc_456',
          },
        },
      });

      // Call the function
      const result = await mergeDocumentPages(mockClient, {
        parts: [
          { document_fingerprint: { document_id: 'doc_1' }, page_range: { start: 0, end: 2 } },
          { document_fingerprint: { document_id: 'doc_2' }, page_range: { start: 1, end: 3 } },
          { document_fingerprint: { document_id: 'doc_2' }, page_range: { start: 4, end: 5 } },
        ],
      });

      // Basic verification - just check that the function completed and returned markdown
      expect(mockClient['upload-document']).toHaveBeenCalledTimes(1);

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Documents Merged Successfully');
      expect(result.markdown).toContain('**New Document ID:** merged_doc_456');
      expect(result.markdown).toContain('**Total Pages:** 8');
      expect(result.markdown).toContain('**Pages Included:** 0 to 2 (0-based indices)');
      expect(result.markdown).toContain('**Pages Included:** 1 to 3 (0-based indices)');
      expect(result.markdown).toContain('**Pages Included:** 4 to 5 (0-based indices)');
    });

    it('should handle a mix of full documents and page ranges', async () => {
      // Mock document info responses
      mockClient['fetch-document-info']
        .mockResolvedValueOnce({
          data: {
            data: {
              pageCount: 3,
              title: 'Document 1',
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: {
              pageCount: 5,
              title: 'Document 2',
            },
          },
        });

      // Mock create from instructions response
      mockClient['upload-document'].mockResolvedValue({
        data: {
          data: {
            document_id: 'merged_doc_789',
          },
        },
      });

      // Call the function
      const result = await mergeDocumentPages(mockClient, {
        parts: [
          { document_fingerprint: { document_id: 'doc_1' } }, // All pages
          { document_fingerprint: { document_id: 'doc_2' }, page_range: { start: 1, end: 1 } }, // Specific page
        ],
      });

      // Basic verification - just check that the function completed and returned markdown
      expect(mockClient['upload-document']).toHaveBeenCalledTimes(1);

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Documents Merged Successfully');
      expect(result.markdown).toContain('**Total Pages:** 4');
      expect(result.markdown).toContain('**Pages Included:** All pages');
      expect(result.markdown).toContain('**Pages Included:** 1 to 1 (0-based indices)');
    });

    it('should work with layers', async () => {
      // Mock document info responses for layers
      mockClient['fetch-document-info']
        .mockResolvedValueOnce({
          data: {
            data: {
              pageCount: 4,
              title: 'Document 1',
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: {
              pageCount: 3,
              title: 'Document 2',
            },
          },
        });

      // Mock layer info responses
      mockClient['fetch-document-layer-info']
        .mockResolvedValueOnce({
          data: {
            data: {
              pageCount: 4,
              title: 'Document 1',
              layer: 'review-layer',
              documentId: 'doc_1',
              createdAt: '2023-01-01T12:00:00Z',
              updatedAt: '2023-01-02T12:00:00Z',
            },
          },
        })
        .mockResolvedValueOnce({
          data: {
            data: {
              pageCount: 3,
              title: 'Document 2',
              layer: 'edit-layer',
              documentId: 'doc_2',
              createdAt: '2023-01-01T12:00:00Z',
              updatedAt: '2023-01-02T12:00:00Z',
            },
          },
        });

      // Mock create from instructions response
      mockClient['upload-document'].mockResolvedValue({
        data: {
          data: {
            document_id: 'merged_layer_doc',
          },
        },
      });

      // Call the function with layers
      const result = await mergeDocumentPages(mockClient, {
        parts: [
          {
            document_fingerprint: {
              document_id: 'doc_1',
              layer: 'review-layer',
            },
            page_range: { start: 0, end: 1 },
          },
          {
            document_fingerprint: {
              document_id: 'doc_2',
              layer: 'edit-layer',
            },
          },
        ],
        title: 'Merged with Layers',
      });

      // Verify upload-document was called with layer information
      expect(mockClient['upload-document']).toHaveBeenCalledWith(
        {},
        {
          instructions: {
            parts: [
              {
                document: {
                  id: 'doc_1',
                  layer: 'review-layer',
                },
                pages: { start: 0, end: 1 },
              },
              {
                document: {
                  id: 'doc_2',
                  layer: 'edit-layer',
                },
              },
            ],
          },
          title: 'Merged with Layers',
        }
      );

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Documents Merged Successfully');
      expect(result.markdown).toContain('**New Document ID:** merged_layer_doc');
      expect(result.markdown).toContain('**Total Pages:** 5'); // 2 pages from doc1 + 3 from doc2
      expect(result.markdown).toContain('### Part 1: Document 1');
      expect(result.markdown).toContain('**Document ID:** doc_1');
      expect(result.markdown).toContain('**Layer Name:** review-layer');
      expect(result.markdown).toContain('### Part 2: Document 2');
      expect(result.markdown).toContain('**Document ID:** doc_2');
      expect(result.markdown).toContain('**Layer Name:** edit-layer');
    });
  });

  describe('error scenarios', () => {
    it('should handle out of bounds page ranges', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 3,
            title: 'Test Document',
          },
        },
      });

      // Call the function with an out of bounds page range
      const result = await mergeDocumentPages(mockClient, {
        parts: [
          {
            document_fingerprint: { document_id: 'doc_1' },
            page_range: {
              start: 0,
              end: 4,
            },
          }, // Document only has 3 pages
        ],
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Merging Documents');
      expect(result.markdown).toContain(
        'Page range end 4 is out of bounds (document has 3 pages, valid indices are 0-2)'
      );
    });

    it('should handle API errors from upload-document', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Mock create from instructions to throw an error
      const errorMessage = 'API Error: Failed to merge documents';
      mockClient['upload-document'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await mergeDocumentPages(mockClient, {
        parts: [
          { document_fingerprint: { document_id: 'doc_1' } },
          { document_fingerprint: { document_id: 'doc_2' } },
        ],
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Merging Documents');
      expect(result.markdown).toContain(
        `An error occurred while trying to merge the documents: ${errorMessage}`
      );
    });

    it('should handle errors from getDocumentInfo', async () => {
      // Mock fetch-document-info to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await mergeDocumentPages(mockClient, {
        parts: [
          { document_fingerprint: { document_id: 'doc_1' } },
          { document_fingerprint: { document_id: 'doc_2' } },
        ],
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Merging Documents');
      expect(result.markdown).toContain(
        `An error occurred while trying to merge the documents: ${errorMessage}`
      );
    });

    it('should handle validation errors', async () => {
      // Call the function with invalid parameters (empty parts array)
      const result = await mergeDocumentPages(mockClient, {
        parts: [],
      });

      // Verify the result contains the validation error
      expect(result.markdown).toContain('# Error Merging Documents');
      expect(result.markdown).toContain('An error occurred while trying to merge the documents:');
      expect(result.markdown).toContain('At least one document part is required');
    });
  });
});
