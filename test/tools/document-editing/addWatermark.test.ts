import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addWatermark } from '../../../src/tools/document-editing/addWatermark.js';
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

describe('addWatermark', () => {
  let mockClient: MockedDocumentEngineClient;
  const mockDate = new Date('2023-01-01T12:00:00Z');

  beforeEach(() => {
    mockClient = createMockClient();

    // Mock Date.now for consistent timestamps
    vi.spyOn(Date, 'now').mockReturnValue(mockDate.getTime());

    // Reset mocks
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('successful scenarios', () => {
    it('should add a text watermark successfully', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Mock apply instructions response
      mockClient['document-apply-instructions'].mockResolvedValue({});

      // Call the function
      const result = await addWatermark(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        watermark_type: 'text',
        content: 'CONFIDENTIAL',
        opacity: 0.5,
        rotation: 45,
      });

      // Just verify we got a result
      expect(result.markdown).toBeDefined();
      expect(typeof result.markdown).toBe('string');

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Watermark Applied Successfully');
      expect(result.markdown).toContain('**Status:** Watermark added to all pages');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Pages Watermarked:** 5');
      expect(result.markdown).toContain('**Type:** Text watermark');
      expect(result.markdown).toContain('**Content:** "CONFIDENTIAL"');
      expect(result.markdown).toContain('**Rotation:** 45°');
      expect(result.markdown).toContain('**Opacity:** 50%');
    });

    it('should add an image watermark successfully', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 3,
            title: 'Test Document',
          },
        },
      });

      // Mock apply instructions response
      mockClient['document-apply-instructions'].mockResolvedValue({});

      // Call the function
      const result = await addWatermark(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        watermark_type: 'image',
        content: 'https://example.com/logo.png',
        opacity: 0.3,
        rotation: 0,
      });

      // Verify document-apply-instructions was called with the correct parameters
      expect(mockClient['document-apply-instructions']).toHaveBeenCalledWith(
        { documentId: 'doc_123' },
        expect.objectContaining({
          actions: [
            expect.objectContaining({
              type: 'watermark',
              image: { url: 'https://example.com/logo.png' },
              opacity: 0.3,
              rotation: 0,
            }),
          ],
        })
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Watermark Applied Successfully');
      expect(result.markdown).toContain('**Type:** Image watermark');
      expect(result.markdown).toContain('**Content:** Image from https://example.com/logo.png');
      expect(result.markdown).toContain('**Opacity:** 30%');
      expect(result.markdown).not.toContain('**Font Size:**');
    });

    it('should use default values when optional parameters are not provided', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 1,
            title: 'Test Document',
          },
        },
      });

      // Mock apply instructions response
      mockClient['document-apply-instructions'].mockResolvedValue({});

      // Call the function with minimal parameters
      const result = await addWatermark(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        watermark_type: 'text',
        content: 'DRAFT',
        opacity: 0.7,
        rotation: 0,
      });

      // Verify document-apply-instructions was called with default values
      expect(mockClient['document-apply-instructions']).toHaveBeenCalledWith(
        { documentId: 'doc_123' },
        expect.objectContaining({
          actions: [
            expect.objectContaining({
              type: 'watermark',
              text: 'DRAFT',
              opacity: 0.7, // Default opacity
              rotation: 0, // Default rotation
            }),
          ],
        })
      );

      // Verify the result contains the expected markdown with default values
      expect(result.markdown).toContain('**Opacity:** 70%');
      expect(result.markdown).toContain('**Rotation:** 0°');
    });

    it('should work with layers', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 4,
            title: 'Test Document',
          },
        },
      });

      // Mock layer info response
      mockClient['fetch-document-layer-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 4,
            title: 'Test Document',
            layer: 'review-layer',
            documentId: 'doc_123',
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-02T12:00:00Z',
          },
        },
      });

      // Mock apply instructions response for layer-specific endpoint
      mockClient['document-layer-apply-instructions'].mockResolvedValue({});

      // Call the function with layer
      const result = await addWatermark(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        watermark_type: 'text',
        content: 'REVIEW COPY',
        opacity: 0.4,
        rotation: -45,
      });

      // Verify the layer-specific endpoint was called
      expect(mockClient['document-layer-apply-instructions']).toHaveBeenCalledWith(
        {
          documentId: 'doc_123',
          layerName: 'review-layer',
        },
        expect.objectContaining({
          actions: [
            expect.objectContaining({
              type: 'watermark',
              text: 'REVIEW COPY',
              opacity: 0.4,
              rotation: -45,
            }),
          ],
        })
      );

      // Verify the default endpoint was NOT called
      expect(mockClient['document-apply-instructions']).not.toHaveBeenCalled();

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Watermark Applied Successfully');
      expect(result.markdown).toContain('**Status:** Watermark added to all pages');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Layer:** review-layer');
      expect(result.markdown).toContain('**Pages Watermarked:** 4');
      expect(result.markdown).toContain('**Type:** Text watermark');
      expect(result.markdown).toContain('**Content:** "REVIEW COPY"');
      expect(result.markdown).toContain('**Rotation:** -45°');
      expect(result.markdown).toContain('**Opacity:** 40%');
    });
  });

  describe('error scenarios', () => {
    it('should handle invalid image URL', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Call the function with an invalid image URL
      const result = await addWatermark(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        watermark_type: 'image',
        content: 'not-a-valid-url',
        opacity: 0.5,
        rotation: 45,
      });

      // Verify document-apply-instructions was not called
      expect(mockClient['document-apply-instructions']).not.toHaveBeenCalled();

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Adding Watermark');
      expect(result.markdown).toContain(
        'An error occurred while trying to add watermark to the document: Invalid image URL provided'
      );
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Watermark Type:** image');
      expect(result.markdown).toContain('## Troubleshooting Tips');
    });

    it('should handle API errors from document-apply-instructions', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      });

      // Mock apply instructions to throw an error
      const errorMessage = 'API Error: Failed to apply watermark';
      mockClient['document-apply-instructions'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await addWatermark(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        watermark_type: 'text',
        content: 'CONFIDENTIAL',
        opacity: 0.7,
        rotation: 0,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Adding Watermark');
      expect(result.markdown).toContain(
        `An error occurred while trying to add watermark to the document: ${errorMessage}`
      );
    });

    it('should handle errors from getDocumentInfo', async () => {
      // Mock fetch-document-info to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await addWatermark(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        watermark_type: 'text',
        content: 'CONFIDENTIAL',
        opacity: 0.7,
        rotation: 0,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Adding Watermark');
      expect(result.markdown).toContain(
        `An error occurred while trying to add watermark to the document: ${errorMessage}`
      );
    });
  });
});
