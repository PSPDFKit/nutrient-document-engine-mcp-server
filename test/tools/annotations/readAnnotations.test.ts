import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readAnnotations } from '../../../src/tools/annotations/readAnnotations.js';
import { AnnotationRecord } from '../../../src/api/DocumentEngineSchema.js';
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

describe('readAnnotations', () => {
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('successful scenarios', () => {
    it('should return annotations for a document', async () => {
      // Create mock annotations
      const mockAnnotations: AnnotationRecord[] = [
        {
          id: 'anno_123',
          content: {
            v: 1,
            stampType: 'Accepted',
            type: 'pspdfkit/stamp',
            pageIndex: 0,
            bbox: [100, 200, 50, 30],
            createdAt: '2023-01-01T12:00:00Z',
            text: 'text',
            icon: 'cross',
          },
          createdBy: 'User 1',
          updatedBy: 'User 1',
        },
        {
          id: 'anno_456',
          content: {
            v: 1,
            type: 'highlight',
            pageIndex: 1,
            bbox: [150, 250, 100, 20],
            createdAt: '2023-01-02T12:00:00Z',
            text: 'test',
            icon: 'check',
          },
          createdBy: 'User 2',
          updatedBy: 'User 2',
        },
        {
          id: 'anno_789',
          content: {
            v: 1,
            type: 'pspdfkit/markup/strikeout',
            pageIndex: 0,
            bbox: [200, 300, 80, 25],
            createdAt: '2023-01-03T12:00:00Z',
            text: 'something',
            icon: 'key',
            rects: [[200, 300, 280, 325]],
          },
          createdBy: 'User 1',
          updatedBy: 'User 1',
        },
      ];

      // Mock the response
      mockClient['get-document-annotations'].mockResolvedValue({
        data: {
          data: {
            annotations: mockAnnotations,
          },
        },
      });

      // Call the function
      const result = await readAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['get-document-annotations']).toHaveBeenCalledWith(
        { documentId: 'doc_123' },
        null,
        { headers: { Accept: 'application/json' } }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Document Annotations');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Total Annotations:** 3');
      expect(result.markdown).toContain('**Pages with Annotations:** 2 (pages 0, 1)');
      expect(result.markdown).toContain('**Authors:** 2 (User 1, User 2)');

      // Verify page sections
      expect(result.markdown).toContain('## Page 0 (2 annotations)');
      expect(result.markdown).toContain('## Page 1 (1 annotation)');

      // Verify annotation details
      expect(result.markdown).toContain('### 📌 Annotation 1: anno_123');
      expect(result.markdown).toContain('- **Type:** Stamp');
      expect(result.markdown).toContain('- **Author:** User 1');
      expect(result.markdown).toContain('- **Created:** 2023-01-01T12:00:00Z');

      expect(result.markdown).toContain('### 🖍️ Annotation 1: anno_456');
      expect(result.markdown).toContain('- **Type:** Highlight');
      expect(result.markdown).toContain('- **Author:** User 2');
      expect(result.markdown).toContain('- **Created:** 2023-01-02T12:00:00Z');

      // Verify summary statistics
      expect(result.markdown).toContain('## Summary by Type');
      expect(result.markdown).toContain('- **📌 Stamps:** 1 annotation');
      expect(result.markdown).toContain('- **🖍️ Highlights:** 1 annotation');
      expect(result.markdown).toContain('- **✏️ Strikeouts:** 1 annotation');

      expect(result.markdown).toContain('## Summary by Author');
      expect(result.markdown).toContain('- **User 1:** 2 annotations');
      expect(result.markdown).toContain('- **User 2:** 1 annotation');
    });

    it('should filter annotations by page number', async () => {
      // Create mock annotations
      const mockAnnotations: AnnotationRecord[] = [
        {
          id: 'anno_123',
          content: {
            v: 1,
            type: 'note',
            pageIndex: 0,
            bbox: [100, 200, 50, 30],
            createdAt: '2023-01-01T12:00:00Z',
            text: 'Sample note',
            icon: 'note',
          },
          createdBy: 'User 1',
          updatedBy: 'User 1',
        },
        {
          id: 'anno_456',
          content: {
            v: 1,
            type: 'highlight',
            pageIndex: 1,
            bbox: [150, 250, 100, 20],
            createdAt: '2023-01-02T12:00:00Z',
            text: 'Highlighted text',
            icon: 'star',
          },
          createdBy: 'User 2',
          updatedBy: 'User 2',
        },
      ];

      // Mock the response
      mockClient['get-document-annotations'].mockResolvedValue({
        data: {
          data: {
            annotations: mockAnnotations,
          },
        },
      });

      // Call the function with page filter
      const result = await readAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_number: 0,
      });

      // Verify the result contains only annotations from page 0
      expect(result.markdown).toContain('**Total Annotations:** 1');
      expect(result.markdown).toContain('**Pages with Annotations:** 1 (pages 0)');
      expect(result.markdown).toContain('### 📝 Annotation 1: anno_123');
      expect(result.markdown).not.toContain('### 🖍️ Annotation');
      expect(result.markdown).toContain('**Applied Filters:**');
      expect(result.markdown).toContain('- Page: 0');
    });

    it('should filter annotations by type', async () => {
      // Create mock annotations
      const mockAnnotations: AnnotationRecord[] = [
        {
          id: 'anno_123',
          content: {
            v: 1,
            type: 'note',
            pageIndex: 0,
            bbox: [100, 200, 50, 30],
            createdAt: '2023-01-01T12:00:00Z',
            text: 'Sample note',
            icon: 'note',
          },
          createdBy: 'User 1',
          updatedBy: 'User 1',
        },
        {
          id: 'anno_456',
          content: {
            v: 1,
            type: 'highlight',
            pageIndex: 1,
            bbox: [150, 250, 100, 20],
            createdAt: '2023-01-02T12:00:00Z',
            color: '#FFFF00',
            text: 'something',
            icon: 'key',
          },
          createdBy: 'User 2',
          updatedBy: 'User 2',
        },
      ];

      // Mock the response
      mockClient['get-document-annotations'].mockResolvedValue({
        data: {
          data: {
            annotations: mockAnnotations,
          },
        },
      });

      // Call the function with type filter
      const result = await readAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        annotation_type: 'highlight',
      });

      // Verify the result contains only highlight annotations
      expect(result.markdown).toContain('**Total Annotations:** 1');
      expect(result.markdown).toContain('**Pages with Annotations:** 1 (pages 1)');
      expect(result.markdown).toContain('### 🖍️ Annotation 1: anno_456');
      expect(result.markdown).not.toContain('### 📝 Annotation');
      expect(result.markdown).toContain('**Applied Filters:**');
      expect(result.markdown).toContain('- Type: highlight');
    });

    it('should filter annotations by author', async () => {
      // Create mock annotations
      const mockAnnotations: AnnotationRecord[] = [
        {
          id: 'anno_123',
          content: {
            v: 1,
            type: 'note',
            pageIndex: 0,
            bbox: [100, 200, 50, 30],
            createdAt: '2023-01-01T12:00:00Z',
            text: 'Sample note',
            icon: 'note',
          },
          createdBy: 'User 1',
          updatedBy: 'User 1',
        },
        {
          id: 'anno_456',
          content: {
            v: 1,
            type: 'highlight',
            pageIndex: 1,
            bbox: [150, 250, 100, 20],
            createdAt: '2023-01-02T12:00:00Z',
            color: '#FFFF00',
            text: 'something',
            icon: 'key',
          },
          createdBy: 'User 2',
          updatedBy: 'User 2',
        },
      ];

      // Mock the response
      mockClient['get-document-annotations'].mockResolvedValue({
        data: {
          data: {
            annotations: mockAnnotations,
          },
        },
      });

      // Call the function with author filter
      const result = await readAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        author: 'User 1',
      });

      // Verify the result contains only annotations from User 1
      expect(result.markdown).toContain('**Total Annotations:** 1');
      expect(result.markdown).toContain('**Pages with Annotations:** 1 (pages 0)');
      expect(result.markdown).toContain('### 📝 Annotation 1: anno_123');
      expect(result.markdown).not.toContain('### 🖍️ Annotation');
      expect(result.markdown).toContain('**Applied Filters:**');
      expect(result.markdown).toContain('- Author: User 1');
    });

    it('should handle documents with no annotations', async () => {
      // Mock the response with no annotations
      mockClient['get-document-annotations'].mockResolvedValue({
        data: {
          data: {
            annotations: [],
          },
        },
      });

      // Call the function
      const result = await readAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result indicates no annotations
      expect(result.markdown).toContain('# Document Annotations');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Total Annotations:** 0');
      expect(result.markdown).toContain('This document does not contain any annotations.');
    });

    it('should handle no matching annotations with filters', async () => {
      // Create mock annotations
      const mockAnnotations: AnnotationRecord[] = [
        {
          id: 'anno_123',
          content: {
            v: 1,
            type: 'note',
            pageIndex: 0,
            bbox: [100, 200, 50, 30],
            createdAt: '2023-01-01T12:00:00Z',
            text: 'Sample note',
            icon: 'note',
          },
          createdBy: 'User 1',
          updatedBy: 'User 1',
        },
      ];

      // Mock the response
      mockClient['get-document-annotations'].mockResolvedValue({
        data: {
          data: {
            annotations: mockAnnotations,
          },
        },
      });

      // Call the function with filters that won't match any annotations
      const result = await readAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_number: 1, // No annotations on page 1
      });

      // Verify the result indicates no matching annotations
      expect(result.markdown).toContain('# Document Annotations');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Total Annotations:** 0');
      expect(result.markdown).toContain(
        '**Note:** Document has 1 total annotations, but none match the specified filters.'
      );
      expect(result.markdown).toContain('**Applied Filters:**');
      expect(result.markdown).toContain('- Page: 1');
    });

    it('should work with layers', async () => {
      // Create mock annotations
      const mockAnnotations: AnnotationRecord[] = [
        {
          id: 'anno_layer_123',
          content: {
            v: 1,
            stampType: 'Accepted',
            type: 'pspdfkit/stamp',
            pageIndex: 0,
            bbox: [100, 200, 50, 30],
            createdAt: '2023-01-01T12:00:00Z',
            text: 'Layer annotation',
            icon: 'cross',
          },
          createdBy: 'User 1',
          updatedBy: 'User 1',
        },
        {
          id: 'anno_layer_456',
          content: {
            v: 1,
            type: 'highlight',
            pageIndex: 1,
            bbox: [150, 250, 100, 20],
            createdAt: '2023-01-02T12:00:00Z',
            text: 'Layer highlight',
            icon: 'check',
          },
          createdBy: 'User 2',
          updatedBy: 'User 2',
        },
      ];

      // Mock the response for layer-specific endpoint
      mockClient['get-document-layer-annotations'].mockResolvedValue({
        data: {
          data: {
            annotations: mockAnnotations,
          },
        },
      });

      // Call the function with layer
      const result = await readAnnotations(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
      });

      // Verify the layer-specific endpoint was called
      expect(mockClient['get-document-layer-annotations']).toHaveBeenCalledWith(
        {
          documentId: 'doc_123',
          layerName: 'review-layer',
        },
        null,
        { headers: { Accept: 'application/json' } }
      );

      // Verify the default endpoint was NOT called
      expect(mockClient['get-document-annotations']).not.toHaveBeenCalled();

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Document Annotations');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Layer:** review-layer');
      expect(result.markdown).toContain('**Total Annotations:** 2');
      expect(result.markdown).toContain('**Pages with Annotations:** 2 (pages 0, 1)');

      // Verify annotation details
      expect(result.markdown).toContain('### 📌 Annotation 1: anno_layer_123');
      expect(result.markdown).toContain('### 🖍️ Annotation 1: anno_layer_456');
    });
  });

  describe('error scenarios', () => {
    it('should handle API errors gracefully', async () => {
      // Mock the client to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['get-document-annotations'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await readAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Reading Annotations');
      expect(result.markdown).toContain(
        `An error occurred while trying to read annotations: ${errorMessage}`
      );
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('## Troubleshooting Tips');
    });

    it('should include filter information in error messages', async () => {
      // Mock the client to throw an error
      const errorMessage = 'API Error: Connection failed';
      mockClient['get-document-annotations'].mockRejectedValue(new Error(errorMessage));

      // Call the function with filters
      const result = await readAnnotations(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_number: 0,
        annotation_type: 'note',
        author: 'User 1',
      });

      // Verify the result contains the error message with filter information
      expect(result.markdown).toContain('# Error Reading Annotations');
      expect(result.markdown).toContain(
        `An error occurred while trying to read annotations: ${errorMessage}`
      );
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Page Filter:** 0');
      expect(result.markdown).toContain('**Type Filter:** note');
      expect(result.markdown).toContain('**Author Filter:** User 1');
    });
  });
});
