import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applyRedactions } from '../../../src/tools/annotations/applyRedactions.js';
import { createMockClient, type MockedDocumentEngineClient } from '../../utils/mockTypes.js';

// Mock the logger to prevent console output during tests
vi.mock('../../../src/utils/Logger.js', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('applyRedactions', () => {
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('successful scenarios', () => {
    it('should apply redactions successfully', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Mock apply redactions response
      mockClient['apply-document-redactions'].mockResolvedValue({});

      // Call the function
      const result = await applyRedactions(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        redaction_ids: ['redaction_1', 'redaction_2'],
      });

      // Basic verification - just check that the function completed and returned markdown
      expect(result.markdown).toBeDefined();
      expect(typeof result.markdown).toBe('string');
      expect(result.markdown).toContain('# Redactions Applied Successfully');
      expect(result.markdown).toContain('**Status:** All redactions applied permanently');
      expect(result.markdown).toContain('**Original Document ID:** doc_123');
      expect(result.markdown).toContain('**Redactions Applied:** 2 instances');
    });

    it('should handle document with no title', async () => {
      // Mock document info response with no title
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 3,
            title: undefined,
          },
        },
      });

      // Mock apply redactions response
      mockClient['apply-document-redactions'].mockResolvedValue({});

      // Call the function
      const result = await applyRedactions(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        redaction_ids: ['redaction_1'],
      });

      // Verify the result contains the fallback title
      expect(result.markdown).toContain('**Original Document:** Document doc_123');
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
            layer: 'review-layer',
            documentId: 'doc_123',
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-02T12:00:00Z',
          },
        },
      });

      // Mock apply redactions response
      mockClient['apply-document-layer-redactions'].mockResolvedValue({});

      // Call the function with layer
      const result = await applyRedactions(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        redaction_ids: ['redaction_1', 'redaction_2'],
      });

      // Verify the layer-specific endpoint was called
      expect(mockClient['apply-document-layer-redactions']).toHaveBeenCalledWith(
        {
          documentId: 'doc_123',
          layerName: 'review-layer',
        },
        null,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Verify the default endpoint was NOT called
      expect(mockClient['apply-document-redactions']).not.toHaveBeenCalled();

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Redactions Applied Successfully');
      expect(result.markdown).toContain('**Status:** All redactions applied permanently');
      expect(result.markdown).toContain('**Original Document ID:** doc_123');
      expect(result.markdown).toContain('**Layer:** review-layer');
      expect(result.markdown).toContain('**Redactions Applied:** 2 instances');
      expect(result.markdown).toContain('**Original Document:** Document doc_123');
    });
  });

  describe('error scenarios', () => {
    it('should handle API errors from apply-document-redactions', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Mock apply redactions to throw an error
      const errorMessage = 'API Error: Failed to apply redactions';
      mockClient['apply-document-redactions'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await applyRedactions(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        redaction_ids: ['redaction_1', 'redaction_2'],
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Applying Redactions');
      expect(result.markdown).toContain(
        `An error occurred while trying to apply redactions: ${errorMessage}`
      );
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Redaction IDs:** redaction_1, redaction_2');
      expect(result.markdown).toContain('## Troubleshooting Tips');
    });

    it('should handle errors from fetch-document-info', async () => {
      // Mock fetch-document-info to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await applyRedactions(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        redaction_ids: ['redaction_1'],
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Applying Redactions');
      expect(result.markdown).toContain(
        `An error occurred while trying to apply redactions: ${errorMessage}`
      );
    });

    it('should handle validation errors', async () => {
      // Call the function with invalid parameters (empty redaction_ids array)
      const result = await applyRedactions(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        redaction_ids: [], // Invalid: empty array
      });

      // Verify the result contains the validation error
      expect(result.markdown).toContain('# Error Applying Redactions');
      expect(result.markdown).toContain('An error occurred while trying to apply redactions:');
      expect(result.markdown).toContain('At least one redaction ID is required');
    });

    it('should handle validation errors for empty document_id', async () => {
      // Call the function with invalid parameters (empty document_id)
      const result = await applyRedactions(mockClient, {
        document_fingerprint: { document_id: '' }, // Invalid: empty string
        redaction_ids: ['redaction_1'],
      });

      // Verify the result contains the validation error
      expect(result.markdown).toContain('# Error Applying Redactions');
      expect(result.markdown).toContain('An error occurred while trying to apply redactions:');
      expect(result.markdown).toContain('Document ID is required');
    });
  });
});
