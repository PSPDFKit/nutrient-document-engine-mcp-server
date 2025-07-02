import { describe, it, expect, vi, beforeEach } from 'vitest';
import { duplicateDocument } from '../../../src/tools/document-editing/duplicateDocument.js';
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

describe('duplicateDocument', () => {
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    mockClient = createMockClient();

    // Reset mocks
  });

  describe('successful scenarios', () => {
    it('should duplicate a document successfully', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Mock copy-document response
      mockClient['copy-document'].mockResolvedValue({
        data: {
          data: {
            document_id: 'doc_456',
          },
        },
      });

      // Call the function
      const result = await duplicateDocument(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Basic verification - just check that the function completed and returned markdown
      expect(result.markdown).toBeDefined();
      expect(typeof result.markdown).toBe('string');
      expect(result.markdown).toContain('# Document Duplicated Successfully');
      expect(result.markdown).toContain('**Status:** Document copied successfully');
      expect(result.markdown).toContain('**Original Document ID:** doc_123');
      expect(result.markdown).toContain('**New Document ID:** doc_456');
      expect(result.markdown).toContain('## What Was Copied');
      expect(result.markdown).toContain('**All Pages:** 5 pages copied');
      expect(result.markdown).toContain('**Text Content:** All text preserved');
      expect(result.markdown).toContain('**Annotations:** Annotations were copied');
      expect(result.markdown).toContain('**Metadata:** Title and properties updated');
    });

    it('should work with layers', async () => {
      // Mock layer info response
      mockClient['fetch-document-layer-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 3,
            title: 'Test Document',
            layer: 'review-layer',
            documentId: 'doc_123',
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-02T12:00:00Z',
          },
        },
      });

      // Mock copy-document-layer response
      mockClient['copy-document-layer-with-instant-json'].mockResolvedValue({
        data: {
          documentId: 'doc_789',
        },
      });

      // Call the function with layer
      const result = await duplicateDocument(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
      });

      // Verify the layer-specific endpoint was called
      expect(mockClient['copy-document-layer-with-instant-json']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        layerName: 'review-layer',
      });

      // Verify the default endpoint was NOT called
      expect(mockClient['copy-document']).not.toHaveBeenCalled();

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Document Duplicated Successfully');
      expect(result.markdown).toContain('**Status:** Document copied successfully');
      expect(result.markdown).toContain('**Original Document ID:** doc_123');
      expect(result.markdown).toContain('**Original Layer:** review-layer');
      expect(result.markdown).toContain('**New Document ID:** doc_789');
      expect(result.markdown).toContain('**All Pages:** 3 pages copied');
    });
  });

  describe('error scenarios', () => {
    it('should handle document not found', async () => {
      // Mock fetch-document-info to throw an error (document not found)
      mockClient['fetch-document-info'].mockRejectedValue(new Error('Document not found'));

      // Call the function
      const result = await duplicateDocument(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify copy-document was not called
      expect(mockClient['copy-document']).not.toHaveBeenCalled();

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Duplicating Document');
      expect(result.markdown).toContain(
        'An error occurred while trying to duplicate the document: Document not found'
      );
      expect(result.markdown).toContain('**Original Document ID:** doc_123');
      expect(result.markdown).toContain('## Troubleshooting Tips');
    });

    it('should handle API errors from copy-document', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Mock copy-document to throw an error
      const errorMessage = 'API Error: Failed to copy document';
      mockClient['copy-document'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await duplicateDocument(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Duplicating Document');
      expect(result.markdown).toContain(
        `An error occurred while trying to duplicate the document: ${errorMessage}`
      );
      expect(result.markdown).toContain('**Original Document ID:** doc_123');
      expect(result.markdown).toContain('## Troubleshooting Tips');
    });

    it('should handle errors from getDocumentInfo', async () => {
      // Mock fetch-document-info to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await duplicateDocument(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Duplicating Document');
      expect(result.markdown).toContain(
        `An error occurred while trying to duplicate the document: ${errorMessage}`
      );
    });
  });
});
