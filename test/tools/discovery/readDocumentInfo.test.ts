import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readDocumentInfo } from '../../../src/tools/discovery/readDocumentInfo.js';
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

describe('readDocumentInfo', () => {
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('successful scenarios', () => {
    it('should return basic document information', async () => {
      // Mock the client response
      const mockResponse = {
        data: {
          data: {
            pageCount: 5,
          },
        },
      };

      mockClient['fetch-document-info'].mockResolvedValue(mockResponse);

      // Call the function
      const result = await readDocumentInfo(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_metadata: false,
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['fetch-document-info']).toHaveBeenCalledWith({
        documentId: 'doc_123',
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Document Information');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Pages:** 5');
      expect(result.markdown).toContain('**Content Type:** application/pdf');
      expect(result.markdown).not.toContain('## Metadata');
    });

    it('should work with layers', async () => {
      // Mock layer info response for layer-specific endpoint
      mockClient['fetch-document-layer-info'].mockResolvedValue({
        data: {
          data: {
            metadata: {
              title: 'Test Document',
            },
            layer: 'review-layer',
            documentId: 'doc_123',
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-02T12:00:00Z',
          },
        },
      });

      // Call the function with layer
      const result = await readDocumentInfo(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        include_metadata: true,
      });

      expect(mockClient['fetch-document-layer-info']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        layerName: 'review-layer',
      });

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Document Information');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Title:** Test Document');
      expect(result.markdown).toContain('**Layer:** review-layer');
    });

    it('should include metadata when requested', async () => {
      // Mock the client response with metadata
      const mockResponse = {
        data: {
          data: {
            pageCount: 5,
            metadata: {
              title: 'Test Document',
              author: 'Test Author',
              subject: 'Test Subject',
              keywords: 'test, document, api',
              creator: 'Test Creator',
              producer: 'Test Producer',
              dateCreated: '2023-01-01T12:00:00Z',
              dateModified: '2023-01-02T12:00:00Z',
            },
            hasXFA: true,
            permissions: {
              annotationAndForms: true,
              assemble: true,
              extract: false,
              extractAccessibility: true,
              fillForms: true,
              modification: false,
              print: true,
              printHighQuality: false,
            },
            pages: [
              { width: 612, height: 792 },
              { width: 612, height: 792 },
            ],
          },
        },
      };

      mockClient['fetch-document-info'].mockResolvedValue(mockResponse);

      // Call the function with include_metadata = true
      const result = await readDocumentInfo(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_metadata: true,
      });

      // Verify the result contains the metadata
      expect(result.markdown).toContain('## Metadata');
      expect(result.markdown).toContain('- **Title:** Test Document');
      expect(result.markdown).toContain('- **Author:** Test Author');
      expect(result.markdown).toContain('- **Subject:** Test Subject');
      expect(result.markdown).toContain('- **Keywords:** test, document, api');
      expect(result.markdown).toContain('- **Creator:** Test Creator');
      expect(result.markdown).toContain('- **Producer:** Test Producer');
      expect(result.markdown).toContain('- **Creation Date:** 2023-01-01T12:00:00Z');
      expect(result.markdown).toContain('- **Modification Date:** 2023-01-02T12:00:00Z');
      expect(result.markdown).toContain('- **Has XFA Forms:** Yes');

      // Verify permissions are included
      expect(result.markdown).toContain('### Permissions');
      expect(result.markdown).toContain('- **Annotation and Forms:** Allowed');
      expect(result.markdown).toContain('- **Assemble Document:** Allowed');
      expect(result.markdown).toContain('- **Extract Content:** Not Allowed');
      expect(result.markdown).toContain('- **Extract for Accessibility:** Allowed');
      expect(result.markdown).toContain('- **Fill Forms:** Allowed');
      expect(result.markdown).toContain('- **Modify Document:** Not Allowed');
      expect(result.markdown).toContain('- **Print:** Allowed');
      expect(result.markdown).toContain('- **High Quality Printing:** Not Allowed');

      // Verify page information is included
      expect(result.markdown).toContain('### Pages');
      expect(result.markdown).toContain('- **Page 1:** Width: 612, Height: 792');
      expect(result.markdown).toContain('- **Page 2:** Width: 612, Height: 792');
    });

    it('should handle partial metadata', async () => {
      // Mock the client response with partial metadata
      const mockResponse = {
        data: {
          data: {
            pageCount: 5,
            metadata: {
              title: 'Test Document',
              // Other metadata fields are missing
            },
            // No permissions or pages
          },
        },
      };

      mockClient['fetch-document-info'].mockResolvedValue(mockResponse);

      // Call the function with include_metadata = true
      const result = await readDocumentInfo(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_metadata: true,
      });

      // Verify the result contains only the available metadata
      expect(result.markdown).toContain('## Metadata');
      expect(result.markdown).toContain('- **Title:** Test Document');
      expect(result.markdown).not.toContain('- **Author:**');
      expect(result.markdown).not.toContain('### Permissions');
      expect(result.markdown).not.toContain('### Pages');
    });
  });

  describe('error scenarios', () => {
    it('should handle API errors gracefully', async () => {
      // Mock the client to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await readDocumentInfo(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_metadata: false,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Reading Document Information');
      expect(result.markdown).toContain(
        `An error occurred while trying to read document information: ${errorMessage}`
      );
    });
  });
});
