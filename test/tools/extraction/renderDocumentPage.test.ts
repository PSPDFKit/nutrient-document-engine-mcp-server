import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderDocumentPage } from '../../../src/tools/extraction/renderDocumentPage.js';
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

describe('renderDocumentPage', () => {
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('successful scenarios', () => {
    it('should render a single page with width parameter', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 3,
          },
        },
      };

      // Mock rendered page response
      const mockRenderedPageResponse = {
        data: Buffer.from('fake-image-data'),
        headers: {
          'content-type': 'image/png',
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['render-document-page'].mockResolvedValue(mockRenderedPageResponse);

      // Call the function
      const result = await renderDocumentPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [1],
        width: 800,
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['fetch-document-info']).toHaveBeenCalledWith({
        documentId: 'doc_123',
      });

      expect(mockClient['render-document-page']).toHaveBeenCalledWith(
        {
          documentId: 'doc_123',
          pageIndex: 1,
          width: '800',
        },
        null,
        {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'image/png',
          },
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Document Page Render');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Total Pages Rendered:** 1 of 3 total pages');
      expect(result.markdown).toContain('**Image Format:** image/png');
      expect(result.markdown).toContain('**Dimensions:** Width: 800px');
      expect(result.markdown).toContain('### Page 2 of 3');

      // Verify the images array
      expect(result.images).toHaveLength(1);
      expect(result.images![0].mimeType).toBe('image/png');
      expect(result.images![0].base64).toBe(Buffer.from('fake-image-data').toString('base64'));
      expect(result.images![0].pageIndex).toBe(1);
    });

    it('should render a single page with height parameter', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 3,
          },
        },
      };

      // Mock rendered page response
      const mockRenderedPageResponse = {
        data: Buffer.from('fake-image-data'),
        headers: {
          'content-type': 'image/png',
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['render-document-page'].mockResolvedValue(mockRenderedPageResponse);

      // Call the function
      const result = await renderDocumentPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [0],
        height: 600,
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['render-document-page']).toHaveBeenCalledWith(
        {
          documentId: 'doc_123',
          pageIndex: 0,
          height: '600',
        },
        null,
        {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'image/png',
          },
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('**Dimensions:** Height: 600px');
      expect(result.images![0].mimeType).toBe('image/png');
    });

    it('should use default width when neither width nor height is provided', async () => {
      // Mock document info response with page dimensions
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 2,
            pages: [
              {
                pageIndex: 0,
                width: 595,
                height: 842,
              },
              {
                pageIndex: 1,
                width: 595,
                height: 842,
              },
            ],
          },
        },
      };

      // Mock rendered page response
      const mockRenderedPageResponse = {
        data: Buffer.from('fake-image-data'),
        headers: {
          'content-type': 'image/png',
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['render-document-page'].mockResolvedValue(mockRenderedPageResponse);

      // Call the function without width or height
      const result = await renderDocumentPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [0],
      });

      // Verify the client was called with the default width
      expect(mockClient['render-document-page']).toHaveBeenCalledWith(
        {
          documentId: 'doc_123',
          pageIndex: 0,
          width: '800',
        },
        null,
        {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'image/png',
          },
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Document Page Render');
      expect(result.markdown).toContain('**Dimensions:** Width: 800px (default)');
      expect(result.markdown).toContain('**Original Page Size:** 595 × 842 points');
    });

    it('should prioritize width when both width and height are provided', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 2,
            pages: [
              {
                pageIndex: 0,
                width: 595,
                height: 842,
              },
            ],
          },
        },
      };

      // Mock rendered page response
      const mockRenderedPageResponse = {
        data: Buffer.from('fake-image-data'),
        headers: {
          'content-type': 'image/png',
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['render-document-page'].mockResolvedValue(mockRenderedPageResponse);

      // Call the function with both width and height
      const result = await renderDocumentPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [0],
        width: 800,
        height: 600,
      });

      // Verify the client was called with width (prioritized over height)
      expect(mockClient['render-document-page']).toHaveBeenCalledWith(
        {
          documentId: 'doc_123',
          pageIndex: 0,
          width: '800',
        },
        null,
        {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'image/png',
          },
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Document Page Render');
      expect(result.markdown).toContain('**Dimensions:** Width: 800px');
      expect(result.markdown).toContain('**Original Page Size:** 595 × 842 points');
    });

    it('should render multiple pages when pages array is provided', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 5,
            pages: [
              { pageIndex: 0, width: 595, height: 842 },
              { pageIndex: 1, width: 595, height: 842 },
              { pageIndex: 2, width: 595, height: 842 },
              { pageIndex: 3, width: 595, height: 842 },
              { pageIndex: 4, width: 595, height: 842 },
            ],
          },
        },
      };

      // Mock rendered page responses
      const mockRenderedPageResponse = {
        data: Buffer.from('fake-image-data'),
        headers: {
          'content-type': 'image/png',
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['render-document-page'].mockResolvedValue(mockRenderedPageResponse);

      // Call the function with multiple page indices
      const result = await renderDocumentPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [0, 2, 4],
        width: 800,
      });

      // Verify the client was called for each page
      expect(mockClient['render-document-page']).toHaveBeenCalledTimes(3);

      // Check calls for each page
      expect(mockClient['render-document-page']).toHaveBeenCalledWith(
        { documentId: 'doc_123', pageIndex: 0, width: '800' },
        null,
        { responseType: 'arraybuffer', headers: { Accept: 'image/png' } }
      );

      expect(mockClient['render-document-page']).toHaveBeenCalledWith(
        { documentId: 'doc_123', pageIndex: 2, width: '800' },
        null,
        { responseType: 'arraybuffer', headers: { Accept: 'image/png' } }
      );

      expect(mockClient['render-document-page']).toHaveBeenCalledWith(
        { documentId: 'doc_123', pageIndex: 4, width: '800' },
        null,
        { responseType: 'arraybuffer', headers: { Accept: 'image/png' } }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Document Page Render');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Total Pages Rendered:** 3 of 5 total pages');
      expect(result.markdown).toContain('**Dimensions:** Width: 800px');

      // Check for each page in the markdown
      expect(result.markdown).toContain('### Page 1 of 5');
      expect(result.markdown).toContain('### Page 3 of 5');
      expect(result.markdown).toContain('### Page 5 of 5');

      // Verify the images array
      expect(result.images).toHaveLength(3);
      expect(result.images![0].pageIndex).toBe(0);
      expect(result.images![1].pageIndex).toBe(2);
      expect(result.images![2].pageIndex).toBe(4);

      // Check that all images have the correct format
      result.images!.forEach(image => {
        expect(image.mimeType).toBe('image/png');
        expect(image.base64).toBe(Buffer.from('fake-image-data').toString('base64'));
      });
    });

    it('should work with layers', async () => {
      // Mock layer info response
      mockClient['fetch-document-layer-info'].mockResolvedValue({
        data: {
          data: {
            pageCount: 3,
            layer: 'review-layer',
            documentId: 'doc_123',
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-02T12:00:00Z',
          },
        },
      });

      // Mock render response for layer-specific endpoint
      const mockImageBuffer = Buffer.from('fake-image-data');
      mockClient['render-document-layer-page'].mockResolvedValue({
        data: mockImageBuffer,
        headers: {
          'content-type': 'image/png',
        },
      });

      // Call the function with layer
      const result = await renderDocumentPage(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        pages: [0],
        width: 800,
      });

      // Verify the layer-specific endpoint was called
      expect(mockClient['render-document-layer-page']).toHaveBeenCalledWith(
        {
          documentId: 'doc_123',
          layerName: 'review-layer',
          pageIndex: 0,
          width: '800',
        },
        null,
        {
          responseType: 'arraybuffer',
          headers: {
            Accept: 'image/png',
          },
        }
      );

      // Verify the default endpoint was NOT called
      expect(mockClient['render-document-page']).not.toHaveBeenCalled();

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Document Page Render');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Layer:** review-layer');
      expect(result.markdown).toContain('### Page 1 of 3');
    });
  });

  describe('error scenarios', () => {
    it('should handle API errors gracefully', async () => {
      // Mock the client to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await renderDocumentPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [0],
        width: 800,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Rendering Pages');
      expect(result.markdown).toContain(
        `An error occurred while trying to render the pages: ${errorMessage}`
      );
      expect(result.images).toEqual(undefined);
    });

    it('should handle invalid page index', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 2,
          },
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);

      // Call the function with an invalid page index
      const result = await renderDocumentPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [5], // Out of bounds
        width: 800,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Rendering Pages');
      expect(result.markdown).toContain('out of bounds');
    });

    it('should handle invalid page indices in an array', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 3,
          },
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);

      // Call the function with an invalid page index in the array
      const result = await renderDocumentPage(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        pages: [0, 1, 5], // 5 is out of bounds
        width: 800,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Rendering Pages');
      expect(result.markdown).toContain('out of bounds');
    });
  });
});
