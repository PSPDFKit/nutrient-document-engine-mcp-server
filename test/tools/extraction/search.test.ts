import { describe, it, expect, vi, beforeEach } from 'vitest';
import { search } from '../../../src/tools/extraction/search.js';
import { SearchResult } from '../../../src/api/DocumentEngineSchema.js';
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

describe('search', () => {
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('successful scenarios', () => {
    it('should search a document with default parameters', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      };

      // Mock search response
      const mockSearchResponse = {
        data: {
          data: [
            {
              pageIndex: 0,
              previewText: 'This is a test document with some text to search for.',
              rangeInPreview: [10, 4],
              rectsOnPage: [[10, 20, 30, 40]],
              isAnnotation: false,
            },
            {
              pageIndex: 2,
              previewText: 'Another test on a different page.',
              rangeInPreview: [8, 4],
              rectsOnPage: [[15, 25, 35, 45]],
              isAnnotation: false,
            },
          ] as SearchResult[],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['search-document'].mockResolvedValue(mockSearchResponse);

      // Call the function
      const result = await search(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        query: 'test',
        search_type: 'text',
        start_page: 0,
        include_annotations: false,
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['fetch-document-info']).toHaveBeenCalledWith({
        documentId: 'doc_123',
      });

      expect(mockClient['search-document']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        q: 'test',
        type: 'text',
        start: 0,
        limit: 5, // pageCount
        include_annotations: false,
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Search Results');
      expect(result.markdown).toContain('**Document:** Test Document');
      expect(result.markdown).toContain('**Query:** "test"');
      expect(result.markdown).toContain('**Search Type:** text');
      expect(result.markdown).toContain('**Results Found:** 2');
      expect(result.markdown).toContain('**Pages Searched:** 0 to 4 (of 5 total)');
      expect(result.markdown).toContain('**Case Sensitive:** No');
      expect(result.markdown).toContain('**Include Annotations:** No');

      // Verify page-specific results
      expect(result.markdown).toContain('### Page 1 (1 match)');
      expect(result.markdown).toContain(
        'This is a **test** document with some text to search for.'
      );

      expect(result.markdown).toContain('### Page 3 (1 match)');
      expect(result.markdown).toContain('Another **test** on a different page.');
    });

    it('should search with custom parameters', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 10,
            title: 'Test Document',
          },
        },
      };

      // Mock search response
      const mockSearchResponse = {
        data: {
          data: [
            {
              pageIndex: 3,
              previewText: 'This is a REGEX match.',
              rangeInPreview: [10, 5],
              rectsOnPage: [[10, 20, 30, 40]],
              isAnnotation: false,
            },
          ] as SearchResult[],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['search-document'].mockResolvedValue(mockSearchResponse);

      // Call the function with custom parameters
      const result = await search(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        query: 'REGEX',
        search_type: 'regex',
        start_page: 2,
        end_page: 5,
        include_annotations: false,
        case_sensitive: true,
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['search-document']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        q: 'REGEX',
        type: 'regex',
        start: 2,
        limit: 6, // end_page + 1
        include_annotations: false,
        case_sensitive: true,
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('**Search Type:** regex');
      expect(result.markdown).toContain('**Pages Searched:** 2 to 5 (of 10 total)');
      expect(result.markdown).toContain('**Case Sensitive:** Yes');

      // Verify page-specific results
      expect(result.markdown).toContain('### Page 4 (1 match)');
      expect(result.markdown).toContain('This is a **REGEX** match.');
    });

    it('should handle no search results', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 3,
            title: 'Test Document',
          },
        },
      };

      // Mock empty search response
      const mockSearchResponse = {
        data: {
          data: [] as SearchResult[],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['search-document'].mockResolvedValue(mockSearchResponse);

      // Call the function
      const result = await search(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        query: 'nonexistent',
        search_type: 'text',
        start_page: 0,
        include_annotations: false,
      });

      // Verify the result contains the expected markdown for no results
      expect(result.markdown).toContain('# Search Results');
      expect(result.markdown).toContain('**Results Found:** 0');
      expect(result.markdown).toContain('## No Results Found');
      expect(result.markdown).toContain(
        'No matches were found for "nonexistent" in the specified page range.'
      );
      expect(result.markdown).toContain('### Suggestions:');
      expect(result.markdown).toContain('- Check for typos in your search query');
    });

    it('should search with include_annotations parameter', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 3,
            title: 'Test Document',
          },
        },
      };

      // Mock search response
      const mockSearchResponse = {
        data: {
          data: [
            {
              pageIndex: 0,
              previewText: 'This is an annotation with a test keyword.',
              rangeInPreview: [29, 4],
              rectsOnPage: [[10, 20, 30, 40]],
              isAnnotation: true,
            },
          ] as SearchResult[],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['search-document'].mockResolvedValue(mockSearchResponse);

      // Call the function with include_annotations = true
      const result = await search(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        query: 'test',
        search_type: 'text',
        start_page: 0,
        include_annotations: true,
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['search-document']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        q: 'test',
        type: 'text',
        start: 0,
        limit: 3, // pageCount
        include_annotations: true,
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('**Include Annotations:** Yes');
      expect(result.markdown).toContain('This is an annotation with a **test** keyword.');
    });

    it('should work with layers', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 3,
            title: 'Test Document',
            layer: 'review-layer',
          },
        },
      };

      // Mock search response (search doesn't have layer-specific endpoints)
      const mockSearchResponse = {
        data: {
          data: [
            {
              pageIndex: 0,
              previewText: 'This is a test document with important information.',
              rangeInPreview: [10, 4],
              rectsOnPage: [[100, 200, 150, 20]],
              isAnnotation: false,
            },
            {
              pageIndex: 1,
              previewText: 'Another test match on page 2.',
              rangeInPreview: [8, 4],
              rectsOnPage: [[50, 100, 100, 15]],
              isAnnotation: false,
            },
          ] as SearchResult[],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-layer-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['search-document'].mockResolvedValue(mockSearchResponse);

      // Call the function with layer
      const result = await search(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        query: 'test',
        search_type: 'text',
        start_page: 0,
        include_annotations: false,
      });

      // Verify the search endpoint was called (no layer-specific endpoint)
      expect(mockClient['search-document']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        q: 'test',
        type: 'text',
        start: 0,
        limit: 3,
        include_annotations: false,
      });

      // Verify the result contains layer information in markdown
      expect(result.markdown).toContain('# Search Results');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Layer:** review-layer');
      expect(result.markdown).toContain('**Query:** "test"');
      expect(result.markdown).toContain('**Results Found:** 2');
    });
  });

  describe('error scenarios', () => {
    it('should handle API errors gracefully', async () => {
      // Mock the client to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await search(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        query: 'test',
        search_type: 'text',
        start_page: 0,
        include_annotations: false,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Searching Document');
      expect(result.markdown).toContain(
        `An error occurred while searching the document: ${errorMessage}`
      );
    });

    it('should handle search API errors', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 3,
            title: 'Test Document',
          },
        },
      };

      // Mock the search API to throw an error
      const errorMessage = 'API Error: Invalid search query';
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['search-document'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await search(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        query: 'test',
        search_type: 'text',
        start_page: 0,
        include_annotations: false,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Searching Document');
      expect(result.markdown).toContain(
        `An error occurred while searching the document: ${errorMessage}`
      );
    });

    it('should validate and adjust end_page if it exceeds document page count', async () => {
      // Mock document info response with 5 pages
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 5,
            title: 'Test Document',
          },
        },
      };

      // Mock search response
      const mockSearchResponse = {
        data: {
          data: [] as SearchResult[],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['search-document'].mockResolvedValue(mockSearchResponse);

      // Call the function with end_page > pageCount
      const result = await search(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        query: 'test',
        search_type: 'text',
        start_page: 0,
        include_annotations: false,
        end_page: 10, // Exceeds the document's 5 pages
      });

      // Verify the client was called with the correct parameters (adjusted end_page)
      expect(mockClient['search-document']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        q: 'test',
        type: 'text',
        start: 0,
        limit: 5, // Adjusted to pageCount
        include_annotations: false,
      });

      // Verify the result shows the correct page range
      expect(result.markdown).toContain('**Pages Searched:** 0 to 4 (of 5 total)');
    });
  });
});
