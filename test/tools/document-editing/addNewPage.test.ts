import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { addNewPage } from '../../../src/tools/document-editing/addNewPage.js';
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

describe('addNewPage', () => {
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
    it('should add a new page at the end of the document successfully', async () => {
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
      mockClient['document-apply-instructions'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 6,
          },
        },
      });

      // Call the function
      const result = await addNewPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_size: 'A4',
        orientation: 'portrait',
      });

      // Basic verification - just check that the function completed and returned markdown
      expect(result.markdown).toBeDefined();
      expect(typeof result.markdown).toBe('string');
      expect(result.markdown).toContain('# New Page Added Successfully');
      expect(result.markdown).toContain('**Status:** 1 new page added');
      expect(result.markdown).toContain('**Page Size:** A4');
      expect(result.markdown).toContain('**Orientation:** Portrait');
    });

    it('should add a new page at a specific position successfully', async () => {
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
      mockClient['document-apply-instructions'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 4,
          },
        },
      });

      // Call the function
      const result = await addNewPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        position: 1, // Add after the first page (0-based index)
        page_size: 'Letter',
        orientation: 'landscape',
      });

      // Verify document-apply-instructions was called with the correct parameters
      expect(mockClient['document-apply-instructions']).toHaveBeenCalledWith(
        { documentId: 'doc_123' },
        expect.objectContaining({
          parts: [
            {
              document: { id: '#self' },
              pages: { start: 0, end: 0 },
            },
            {
              page: 'new',
              pageCount: 1,
              layout: {
                size: 'Letter',
                orientation: 'landscape',
              },
            },
            {
              document: { id: '#self' },
              pages: { start: 1, end: -1 },
            },
          ],
        })
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# New Page Added Successfully');
      expect(result.markdown).toContain('**Page Size:** Letter');
      expect(result.markdown).toContain('**Orientation:** Landscape');
      expect(result.markdown).toContain('**Position:** at position 1 (0-based index)');
      expect(result.markdown).toContain('**Original Page Count:** 3');
      expect(result.markdown).toContain('**New Page Count:** 4');
    });

    it('should use default values when optional parameters are not provided', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 2,
            title: 'Test Document',
          },
        },
      });

      // Mock apply instructions response
      mockClient['document-apply-instructions'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 3,
          },
        },
      });

      // Call the function with minimal parameters
      const result = await addNewPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_size: 'A4',
        orientation: 'portrait',
      });

      // Verify document-apply-instructions was called with default values
      expect(mockClient['document-apply-instructions']).toHaveBeenCalledWith(
        { documentId: 'doc_123' },
        expect.objectContaining({
          parts: [
            { document: { id: '#self' } },
            {
              page: 'new',
              pageCount: 1,
              layout: {
                size: 'A4',
                orientation: 'portrait',
              },
            },
          ],
        })
      );

      // Verify the result contains the expected markdown with default values
      expect(result.markdown).toContain('**Page Size:** A4');
      expect(result.markdown).toContain('**Orientation:** Portrait');
      expect(result.markdown).toContain('**Position:** at the end (position 2)');
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
      mockClient['document-layer-apply-instructions'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Document',
            pageCount: 4,
          },
        },
      });

      // Call the function with layer
      const result = await addNewPage(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        page_size: 'Letter',
        orientation: 'landscape',
        position: 2,
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
              pages: { start: 0, end: 1 },
            },
            {
              page: 'new',
              pageCount: 1,
              layout: {
                size: 'Letter',
                orientation: 'landscape',
              },
            },
            {
              document: { id: '#self' },
              pages: { start: 2, end: -1 },
            },
          ],
        })
      );

      // Verify the default endpoint was NOT called
      expect(mockClient['document-apply-instructions']).not.toHaveBeenCalled();

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# New Page Added Successfully');
      expect(result.markdown).toContain('**Status:** 1 new page added');
      expect(result.markdown).toContain('**Document Title:** Test Document');
      expect(result.markdown).toContain('**New Page Count:** 4');
      expect(result.markdown).toContain('**Page Size:** Letter');
      expect(result.markdown).toContain('**Orientation:** Landscape');
      expect(result.markdown).toContain('**Position:** at position 2 (0-based index)');
    });
  });

  describe('error scenarios', () => {
    it('should handle invalid position', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 3,
            title: 'Test Document',
          },
        },
      });

      // Call the function with an invalid position
      const result = await addNewPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        position: 5, // Out of bounds (document has 3 pages)
      });

      // Verify document-apply-instructions was not called
      expect(mockClient['document-apply-instructions']).not.toHaveBeenCalled();

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Adding New Page');
      expect(result.markdown).toContain('**Status:** Failed');
      expect(result.markdown).toContain(
        'An error occurred while trying to add a new page to the document:'
      );
      expect(result.markdown).toContain('Position 5 is out of bounds (document has 3 pages)');
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
      const errorMessage = 'API Error: Failed to add page';
      mockClient['document-apply-instructions'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await addNewPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_size: 'A4',
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Adding New Page');
      expect(result.markdown).toContain(
        `An error occurred while trying to add a new page to the document: ${errorMessage}`
      );
    });

    it('should handle errors from fetch-document-info', async () => {
      // Mock fetch-document-info to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await addNewPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Adding New Page');
      expect(result.markdown).toContain(
        `An error occurred while trying to add a new page to the document: ${errorMessage}`
      );
    });

    it('should handle validation errors', async () => {
      // Call the function with invalid parameters
      const result = await addNewPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        page_size: 'invalid-size' as any, // Testing invalid page size for validation
      });

      // Verify the result contains the validation error
      expect(result.markdown).toContain('# Error Adding New Page');
      expect(result.markdown).toContain(
        'An error occurred while trying to add a new page to the document:'
      );
      expect(result.markdown).toContain('invalid-size');
    });
  });
});
