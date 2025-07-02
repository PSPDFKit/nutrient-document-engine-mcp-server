import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteAnnotations } from '../../../src/tools/annotations/deleteAnnotations.js';
import { createMockClient, MockedDocumentEngineClient } from '../../utils/mockTypes.js';

// Import original functions - no mocking needed

// Mock the logger to prevent console output during tests
vi.mock('../../../src/utils/Logger.js', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('deleteAnnotations', () => {
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('successful scenarios', () => {
    it('should delete annotations successfully', async () => {
      // Mock annotation details responses
      const mockAnnotation1 = {
        id: 'anno_123',
        content: {
          type: 'note',
          pageIndex: 0,
          bbox: [100, 200, 50, 30],
          createdAt: '2023-01-01T12:00:00Z',
        },
        createdBy: 'Test User',
      };

      const mockAnnotation2 = {
        id: 'anno_456',
        content: {
          type: 'highlight',
          pageIndex: 1,
          bbox: [150, 250, 100, 20],
          createdAt: '2023-01-02T12:00:00Z',
        },
        createdBy: 'Another User',
      };

      // Set up the mock responses
      mockClient['get-document-annotation'].mockImplementation(
        ({ annotationId }: { annotationId: string }) => {
          if (annotationId === 'anno_123') {
            return Promise.resolve({ data: mockAnnotation1 });
          } else if (annotationId === 'anno_456') {
            return Promise.resolve({ data: mockAnnotation2 });
          }
          return Promise.reject(new Error('Annotation not found'));
        }
      );

      mockClient['delete-document-annotation'].mockResolvedValue({});

      // Call the function
      const result = await deleteAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        annotation_ids: ['anno_123', 'anno_456'],
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['get-document-annotation']).toHaveBeenCalledTimes(2);
      expect(mockClient['get-document-annotation']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        annotationId: 'anno_123',
      });
      expect(mockClient['get-document-annotation']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        annotationId: 'anno_456',
      });

      expect(mockClient['delete-document-annotation']).toHaveBeenCalledTimes(2);
      expect(mockClient['delete-document-annotation']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        annotationId: 'anno_123',
      });
      expect(mockClient['delete-document-annotation']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        annotationId: 'anno_456',
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Annotations Deleted Successfully');
      expect(result.markdown).toContain('**Status:** 2 annotations removed');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Deleted Annotation IDs:** anno_123, anno_456');
      expect(result.markdown).toContain('## Deleted Annotation Details');
      expect(result.markdown).toContain('### Annotation 1: anno_123');
      expect(result.markdown).toContain('- **Type:** note');
      expect(result.markdown).toContain('- **Author:** Test User');
      expect(result.markdown).toContain('- **Page:** 0');
      expect(result.markdown).toContain('### Annotation 2: anno_456');
      expect(result.markdown).toContain('- **Type:** highlight');
      expect(result.markdown).toContain('- **Author:** Another User');
      expect(result.markdown).toContain('- **Page:** 1');
    });

    it('should handle single annotation deletion', async () => {
      // Mock annotation details response
      const mockAnnotation = {
        id: 'anno_123',
        content: {
          type: 'note',
          pageIndex: 0,
          bbox: [100, 200, 50, 30],
          createdAt: '2023-01-01T12:00:00Z',
        },
        createdBy: 'Test User',
      };

      // Set up the mock responses
      mockClient['get-document-annotation'].mockResolvedValue({ data: mockAnnotation });
      mockClient['delete-document-annotation'].mockResolvedValue({});

      // Call the function with a single annotation ID
      const result = await deleteAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        annotation_ids: ['anno_123'],
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['get-document-annotation']).toHaveBeenCalledTimes(1);
      expect(mockClient['delete-document-annotation']).toHaveBeenCalledTimes(1);

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Annotations Deleted Successfully');
      expect(result.markdown).toContain('**Status:** 1 annotation removed');
      expect(result.markdown).not.toContain('**Status:** 1 annotations removed');
    });

    it('should respect confirm_deletion parameter', async () => {
      // Call the function with confirm_deletion = false
      const result = await deleteAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        annotation_ids: ['anno_123'],
        confirm_deletion: false,
      });

      // Verify the client was not called
      expect(mockClient['get-document-annotation']).not.toHaveBeenCalled();
      expect(mockClient['delete-document-annotation']).not.toHaveBeenCalled();

      // Verify the result contains the cancellation message
      expect(result.markdown).toContain('# Annotation Deletion Cancelled');
      expect(result.markdown).toContain('**Status:** Deletion cancelled by user request');
      expect(result.markdown).toContain(
        'The annotation deletion was cancelled because `confirm_deletion` was set to `false`'
      );
    });

    it('should work with layers', async () => {
      // Mock annotation details responses
      const mockAnnotation1 = {
        id: 'anno_123',
        content: {
          type: 'note',
          pageIndex: 0,
          bbox: [100, 200, 50, 30],
          createdAt: '2023-01-01T12:00:00Z',
        },
        createdBy: 'Test User',
      };

      const mockAnnotation2 = {
        id: 'anno_456',
        content: {
          type: 'highlight',
          pageIndex: 1,
          bbox: [150, 250, 100, 20],
          createdAt: '2023-01-02T12:00:00Z',
        },
        createdBy: 'Another User',
      };

      // Set up the mock responses for layer-specific endpoints
      mockClient['get-document-layer-annotation'].mockImplementation(
        ({ annotationId }: { annotationId: string }) => {
          if (annotationId === 'anno_123') {
            return Promise.resolve({ data: mockAnnotation1 });
          } else if (annotationId === 'anno_456') {
            return Promise.resolve({ data: mockAnnotation2 });
          }
          return Promise.reject(new Error('Annotation not found'));
        }
      );

      mockClient['delete-document-layer-annotation'].mockResolvedValue({});

      // Call the function with layer
      const result = await deleteAnnotations(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        annotation_ids: ['anno_123', 'anno_456'],
      });

      // Verify the layer-specific endpoints were called
      expect(mockClient['get-document-layer-annotation']).toHaveBeenCalledTimes(2);
      expect(mockClient['get-document-layer-annotation']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        annotationId: 'anno_123',
        layerName: 'review-layer',
      });
      expect(mockClient['get-document-layer-annotation']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        annotationId: 'anno_456',
        layerName: 'review-layer',
      });

      expect(mockClient['delete-document-layer-annotation']).toHaveBeenCalledTimes(2);
      expect(mockClient['delete-document-layer-annotation']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        annotationId: 'anno_123',
        layerName: 'review-layer',
      });
      expect(mockClient['delete-document-layer-annotation']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        annotationId: 'anno_456',
        layerName: 'review-layer',
      });

      // Verify the default endpoints were NOT called
      expect(mockClient['get-document-annotation']).not.toHaveBeenCalled();
      expect(mockClient['delete-document-annotation']).not.toHaveBeenCalled();

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Annotations Deleted Successfully');
      expect(result.markdown).toContain('**Status:** 2 annotations removed');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Layer:** review-layer');
      expect(result.markdown).toContain('**Deleted Annotation IDs:** anno_123, anno_456');
    });
  });

  describe('error scenarios', () => {
    it('should handle annotation not found error', async () => {
      // Mock the get-document-annotation to throw an error
      mockClient['get-document-annotation'].mockRejectedValue(new Error('Annotation not found'));

      // Call the function
      const result = await deleteAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        annotation_ids: ['anno_123'],
      });

      // Verify the delete-document-annotation was not called
      expect(mockClient['delete-document-annotation']).not.toHaveBeenCalled();

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error: Annotation Not Found');
      expect(result.markdown).toContain('**Status:** Annotation does not exist');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Annotation IDs:** anno_123');
      expect(result.markdown).toContain('## Possible Reasons');
    });

    it('should handle general errors during deletion', async () => {
      // Mock the get-document-annotation to succeed
      mockClient['get-document-annotation'].mockResolvedValue({
        data: {
          id: 'anno_123',
          content: {
            type: 'note',
            pageIndex: 0,
            bbox: [100, 200, 50, 30],
          },
        },
      });

      // Mock the delete-document-annotation to throw an error
      const errorMessage = 'API Error: Permission denied';
      mockClient['delete-document-annotation'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await deleteAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        annotation_ids: ['anno_123'],
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Deleting Annotations');
      expect(result.markdown).toContain(
        `An error occurred while trying to delete the annotations: ${errorMessage}`
      );
      expect(result.markdown).toContain('## Troubleshooting Tips');
    });
  });
});
