import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addAnnotation } from '../../../src/tools/annotations/addAnnotation.js';
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

describe('addAnnotation', () => {
  let mockClient: MockedDocumentEngineClient;
  const mockDate = new Date('2023-01-01T12:00:00Z');

  beforeEach(() => {
    mockClient = createMockClient();

    // Mock Date.now() to return a consistent date for testing
    vi.spyOn(global, 'Date').mockImplementation(() => mockDate as unknown as Date);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful scenarios', () => {
    it('should add a note annotation successfully', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            title: 'Test Document',
          },
        },
      };

      // Mock create annotation response
      const mockCreateResponse = {
        data: {
          data: {
            annotation_id: 'anno_123',
          },
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['create-document-annotation'].mockResolvedValue(mockCreateResponse);

      // Call the function
      const result = await addAnnotation(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_number: 0,
        annotation_type: 'note',
        content: 'Test note',
        coordinates: {
          left: 100,
          top: 200,
          width: 50,
          height: 30,
        },
        author: 'Test User',
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['fetch-document-info']).toHaveBeenCalledWith({
        documentId: 'doc_123',
      });

      expect(mockClient['create-document-annotation']).toHaveBeenCalledWith(
        { documentId: 'doc_123' },
        {
          content: {
            v: 2,
            type: 'pspdfkit/note',
            pageIndex: 0,
            bbox: [100, 200, 50, 30],
            text: {
              format: 'plain',
              value: 'Test note',
            },
            icon: 'comment',
            color: '#FFD83F',
            opacity: 1.0,
            creatorName: 'Test User',
          },
          user_id: 'Test User',
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Annotation Added Successfully');
      expect(result.markdown).toContain('**Annotation ID:** anno_123');
      expect(result.markdown).toContain('**Document:** Test Document');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Author:** Test User');
      expect(result.markdown).toContain('**Created:** 2023-01-01T12:00:00.000Z');
      expect(result.markdown).toContain('## Annotation Details');
      expect(result.markdown).toContain('- **Type:** Note (Sticky Note)');
      expect(result.markdown).toContain('- **Page:** 1');
      expect(result.markdown).toContain('- **Content:** "Test note"');
      expect(result.markdown).toContain('- **Location:** Page 1, coordinates (100.0, 200.0)');
      expect(result.markdown).toContain('- **Size:** 50.0 × 30.0');
      expect(result.markdown).toContain('- **Icon:** comment');
      expect(result.markdown).toContain('- **Color:** #FFD83F');
    });

    it('should add a highlight annotation successfully', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            title: 'Test Document',
          },
        },
      };

      // Mock create annotation response
      const mockCreateResponse = {
        data: {
          data: {
            annotation_id: 'anno_456',
          },
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['create-document-annotation'].mockResolvedValue(mockCreateResponse);

      // Call the function
      const result = await addAnnotation(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_number: 1,
        annotation_type: 'highlight',
        content: 'Highlighted text',
        coordinates: {
          left: 150,
          top: 250,
          width: 100,
          height: 20,
        },
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['create-document-annotation']).toHaveBeenCalledWith(
        { documentId: 'doc_123' },
        {
          content: {
            v: 2,
            type: 'pspdfkit/markup/highlight',
            pageIndex: 1,
            bbox: [150, 250, 100, 20],
            rects: [[150, 250, 250, 270]],
            color: '#FFFF00',
            note: 'Highlighted text',
            blendMode: 'multiply',
            opacity: 1.0,
          },
          user_id: undefined,
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Annotation Added Successfully');
      expect(result.markdown).toContain('**Annotation ID:** anno_456');
      expect(result.markdown).toContain('- **Type:** Highlight');
      expect(result.markdown).toContain('- **Page:** 2');
      expect(result.markdown).toContain('- **Content:** "Highlighted text"');
      expect(result.markdown).toContain('- **Color:** #FFFF00');
      expect(result.markdown).toContain('- **Blend Mode:** multiply');
    });

    it('should handle different annotation types', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            title: 'Test Document',
          },
        },
      };

      // Mock create annotation response
      const mockCreateResponse = {
        data: {
          data: {
            annotation_id: 'anno_789',
          },
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['create-document-annotation'].mockResolvedValue(mockCreateResponse);

      // Test different annotation types
      const annotationTypes = [
        'strikeout',
        'underline',
        'ink',
        'text',
        'stamp',
        'image',
        'link',
      ] as const;

      for (const type of annotationTypes) {
        // Call the function
        const result = await addAnnotation(mockClient, {
          document_fingerprint: { document_id: 'doc_123' },
          page_number: 0,
          annotation_type: type,
          content: `Test ${type}`,
          coordinates: {
            left: 100,
            top: 200,
            width: 50,
            height: 30,
          },
        });

        // Verify the result contains the expected markdown
        expect(result.markdown).toContain('# Annotation Added Successfully');
        expect(result.markdown).toContain('**Annotation ID:** anno_789');
        expect(result.markdown).toContain(`- **Content:** "Test ${type}"`);
      }
    });

    it('should handle array response format', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            title: 'Test Document',
          },
        },
      };

      // Mock create annotation response with array format
      const mockCreateResponse = {
        data: {
          data: [
            {
              id: 'anno_array',
              content: {
                type: 'pspdfkit/note',
              },
            },
          ],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['create-document-annotation'].mockResolvedValue(mockCreateResponse);

      // Call the function
      const result = await addAnnotation(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_number: 0,
        annotation_type: 'note',
        content: 'Test note',
        coordinates: {
          left: 100,
          top: 200,
          width: 50,
          height: 30,
        },
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('**Annotation ID:** anno_array');
    });

    it('should work with layers', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            title: 'Test Document',
            layer: 'review-layer',
          },
        },
      };

      // Mock create annotation response
      const mockCreateResponse = {
        data: {
          data: {
            annotation_id: 'anno_layer_123',
          },
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['fetch-document-layer-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['create-document-layer-annotation'].mockResolvedValue(mockCreateResponse);

      // Call the function with layer
      const result = await addAnnotation(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        page_number: 0,
        annotation_type: 'note',
        content: 'Test note on layer',
        coordinates: {
          left: 100,
          top: 200,
          width: 50,
          height: 30,
        },
        author: 'Test User',
      });

      // Verify the layer-specific endpoint was called
      expect(mockClient['create-document-layer-annotation']).toHaveBeenCalledWith(
        {
          documentId: 'doc_123',
          layerName: 'review-layer',
        },
        {
          content: {
            v: 2,
            type: 'pspdfkit/note',
            pageIndex: 0,
            bbox: [100, 200, 50, 30],
            text: {
              format: 'plain',
              value: 'Test note on layer',
            },
            icon: 'comment',
            color: '#FFD83F',
            opacity: 1.0,
            creatorName: 'Test User',
          },
          user_id: 'Test User',
        }
      );

      // Verify the default endpoint was NOT called
      expect(mockClient['create-document-annotation']).not.toHaveBeenCalled();

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Annotation Added Successfully');
      expect(result.markdown).toContain('**Annotation ID:** anno_layer_123');
      expect(result.markdown).toContain('**Document:** Test Document');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Layer:** review-layer');
      expect(result.markdown).toContain('**Author:** Test User');
      expect(result.markdown).toContain('**Content:** "Test note on layer"');
    });
  });

  describe('error scenarios', () => {
    it('should handle API errors gracefully', async () => {
      // Mock the fetch-document-info to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await addAnnotation(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_number: 0,
        annotation_type: 'note',
        content: 'Test note',
        coordinates: {
          left: 100,
          top: 200,
          width: 50,
          height: 30,
        },
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Adding Annotation');
      expect(result.markdown).toContain(
        `An error occurred while trying to add the annotation: ${errorMessage}`
      );
      expect(result.markdown).toContain('Please check your parameters and try again');
    });

    it('should handle unsupported annotation types', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            title: 'Test Document',
          },
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);

      // Call the function with an invalid annotation type
      const result = await addAnnotation(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_number: 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        annotation_type: 'invalid' as any, // Testing invalid annotation type for validation
        content: 'Test note',
        coordinates: {
          left: 100,
          top: 200,
          width: 50,
          height: 30,
        },
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Adding Annotation');
      expect(result.markdown).toContain(
        'An error occurred while trying to add the annotation: Unsupported annotation type: invalid'
      );
    });
  });
});
