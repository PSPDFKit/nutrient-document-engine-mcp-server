import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rotatePages } from '../../../src/tools/document-editing/rotatePages.js';
import { createMockClient, MockedDocumentEngineClient } from 'test/utils/mockTypes.js';

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

describe('rotatePages', () => {
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
    it('should rotate a single page successfully', async () => {
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
      const result = await rotatePages(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [2], // Rotate the third page (0-based index)
        rotation: 90,
      });

      // Basic verification - just check that the function completed and returned markdown
      expect(result.markdown).toBeDefined();
      expect(typeof result.markdown).toBe('string');
      expect(result.markdown).toContain('# Pages Rotated Successfully');
      expect(result.markdown).toContain('**Status:** Pages rotated');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Pages Rotated:** 1');
      expect(result.markdown).toContain('**Rotation:** Clockwise (90°)');
      expect(result.markdown).toContain('**Detailed Page List:** Page 2');
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

      // Mock apply instructions response for layer-specific endpoint
      mockClient['document-layer-apply-instructions'].mockResolvedValue({});

      // Call the function with layer
      const result = await rotatePages(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        pages: [0, 2],
        rotation: 90,
      });

      // Verify the layer-specific endpoint was called
      expect(mockClient['document-layer-apply-instructions']).toHaveBeenCalledWith(
        {
          documentId: 'doc_123',
          layerName: 'review-layer',
        },
        expect.objectContaining({
          parts: [
            {
              document: { id: '#self' },
              pages: { start: 0, end: 0 },
              actions: [
                {
                  type: 'rotate',
                  rotateBy: 90,
                },
              ],
            },
            {
              document: { id: '#self' },
              pages: { start: 1, end: 1 },
            },
            {
              document: { id: '#self' },
              pages: { start: 2, end: 2 },
              actions: [
                {
                  type: 'rotate',
                  rotateBy: 90,
                },
              ],
            },
          ],
        })
      );

      // Verify the default endpoint was NOT called
      expect(mockClient['document-apply-instructions']).not.toHaveBeenCalled();

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Pages Rotated Successfully');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Layer:** review-layer');
      expect(result.markdown).toContain('**Pages Rotated:** 2 pages');
      expect(result.markdown).toContain('**Rotation Applied:** 90°');
    });

    it('should rotate multiple pages successfully', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 10,
            title: 'Test Document',
          },
        },
      });

      // Mock apply instructions response
      mockClient['document-apply-instructions'].mockResolvedValue({});

      // Call the function
      const result = await rotatePages(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [0, 2, 5], // Rotate pages 1, 3, and 6 (0-based index)
        rotation: 180,
      });

      // Basic verification - just check that the function completed and returned markdown
      expect(result.markdown).toBeDefined();
      expect(typeof result.markdown).toBe('string');
      expect(result.markdown).toContain('# Pages Rotated Successfully');
      expect(result.markdown).toContain('**Pages Rotated:** 3');
      expect(result.markdown).toContain('**Rotation:** Upside down (180°)');
      expect(result.markdown).toContain('**Detailed Page List:** Page 0, Page 2, Page 5');
    });

    it('should rotate all pages successfully', async () => {
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

      // Call the function to rotate all pages
      const result = await rotatePages(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [0, 1, 2], // All pages in a 3-page document
        rotation: 270,
      });

      // Basic verification - just check that the function completed and returned markdown
      expect(result.markdown).toBeDefined();
      expect(typeof result.markdown).toBe('string');
      expect(result.markdown).toContain('# Pages Rotated Successfully');
      expect(result.markdown).toContain('**Pages Rotated:** 3');
      expect(result.markdown).toContain('**Total Document Pages:** 3');
      expect(result.markdown).toContain('**Pages Rotated:** 3/3');
      expect(result.markdown).toContain('**Rotation:** Counter-clockwise (270°)');
      expect(result.markdown).toContain('**Detailed Page List:** Pages 0-2');
    });
  });

  describe('error scenarios', () => {
    it('should handle invalid page indices', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 3,
            title: 'Test Document',
          },
        },
      });

      // Call the function with an invalid page index
      const result = await rotatePages(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [5], // Out of bounds (document has 3 pages)
        rotation: 90,
      });

      // Verify document-apply-instructions was not called
      expect(mockClient['document-apply-instructions']).not.toHaveBeenCalled();

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Rotating Pages');
      expect(result.markdown).toContain('**Status:** Failed');
      expect(result.markdown).toContain(
        'An error occurred while trying to rotate pages in the document:'
      );
      expect(result.markdown).toContain('Page index 5 is out of bounds');
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
      const errorMessage = 'API Error: Failed to rotate pages';
      mockClient['document-apply-instructions'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await rotatePages(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [0],
        rotation: 90,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Rotating Pages');
      expect(result.markdown).toContain(
        `An error occurred while trying to rotate pages in the document: ${errorMessage}`
      );
    });

    it('should handle errors from getDocumentInfo', async () => {
      // Mock fetch-document-info to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await rotatePages(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [0],
        rotation: 90,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Rotating Pages');
      expect(result.markdown).toContain(
        `An error occurred while trying to rotate pages in the document: ${errorMessage}`
      );
    });

    it('should handle validation errors', async () => {
      // Call the function with invalid parameters
      const result = await rotatePages(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [], // Empty pages array
        rotation: 90,
      });

      // Verify the result contains the validation error
      expect(result.markdown).toContain('# Error Rotating Pages');
      expect(result.markdown).toContain(
        'An error occurred while trying to rotate pages in the document:'
      );
      expect(result.markdown).toContain('At least one page is required');
    });

    it('should handle invalid rotation value', async () => {
      // Call the function with an invalid rotation value
      const result = await rotatePages(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [0],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rotation: 45 as any, // Testing invalid rotation value for validation
      });

      // Verify the result contains the validation error
      expect(result.markdown).toContain('# Error Rotating Pages');
      expect(result.markdown).toContain(
        'An error occurred while trying to rotate pages in the document:'
      );
      expect(result.markdown).toContain('45');
    });
  });
});
