import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listDocuments } from '../../../src/tools/discovery/listDocuments.js';
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

describe('listDocuments', () => {
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('successful scenarios', () => {
    it('should return a formatted markdown list of documents', async () => {
      // Mock the client response
      const mockResponse = {
        data: {
          data: [
            {
              id: 'doc_123',
              title: 'Test Document 1',
              createdAt: '2023-01-01T12:00:00Z',
              byteSize: 1024,
              layer: 'default',
            },
            {
              id: 'doc_456',
              title: 'Test Document 2',
              createdAt: '2023-01-02T12:00:00Z',
              byteSize: 2048,
            },
          ],
          document_count: 2,
        },
      };

      mockClient['list-documents'].mockResolvedValue(mockResponse);

      // Call the function
      const result = await listDocuments(mockClient, {});

      // Verify the client was called with the correct parameters
      expect(mockClient['list-documents']).toHaveBeenCalledWith({
        page_size: 10,
        order_by: 'created_at',
        order_direction: 'desc',
        count_remaining: false,
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Document List');
      expect(result.markdown).toContain('Found 2 documents');
      expect(result.markdown).toContain('## Title: Test Document 1');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Created:** 2023-01-01T12:00:00Z');
      expect(result.markdown).toContain('**Size:** 1.0 KB');
      expect(result.markdown).toContain('## Title: Test Document 2');
      expect(result.markdown).toContain('**Document ID:** doc_456');
      expect(result.markdown).toContain('**Created:** 2023-01-02T12:00:00Z');
      expect(result.markdown).toContain('**Size:** 2.0 KB');
    });

    it('should handle pagination cursors', async () => {
      // Mock the client response with pagination cursors
      const mockResponse = {
        data: {
          data: [
            {
              id: 'doc_123',
              title: 'Test Document 1',
              createdAt: '2023-01-01T12:00:00Z',
              byteSize: 1024,
            },
          ],
          document_count: 1,
          next_cursor: 'next_cursor_value',
          prev_cursor: 'prev_cursor_value',
        },
      };

      mockClient['list-documents'].mockResolvedValue(mockResponse);

      // Call the function
      const result = await listDocuments(mockClient, {});

      // Verify the pagination information is included
      expect(result.markdown).toContain('## Pagination');
      expect(result.markdown).toContain('**Previous Page Cursor:** `prev_cursor_value`');
      expect(result.markdown).toContain('**Next Page Cursor:** `next_cursor_value`');
    });

    it('should handle count_remaining parameter', async () => {
      // Mock the client response with count_remaining
      const mockResponse = {
        data: {
          data: [
            {
              id: 'doc_123',
              title: 'Test Document 1',
              createdAt: '2023-01-01T12:00:00Z',
              byteSize: 1024,
            },
          ],
          document_count: 10,
          prev_document_count: 5,
          next_document_count: 4,
        },
      };

      mockClient['list-documents'].mockResolvedValue(mockResponse);

      // Call the function with count_remaining = true
      const result = await listDocuments(mockClient, { count_remaining: true });

      // Verify the client was called with count_remaining = true
      expect(mockClient['list-documents']).toHaveBeenCalledWith(
        expect.objectContaining({
          count_remaining: true,
        })
      );

      // Verify the result contains the count information
      expect(result.markdown).toContain('Found 10 documents (5 before, 4 after current page)');
    });

    it('should handle empty document list', async () => {
      // Mock the client response with no documents
      const mockResponse = {
        data: {
          data: [],
          document_count: 0,
        },
      };

      mockClient['list-documents'].mockResolvedValue(mockResponse);

      // Call the function
      const result = await listDocuments(mockClient, {});

      // Verify the result indicates no documents were found
      expect(result.markdown).toContain('# Document List');
      expect(result.markdown).toContain('Found 0 documents');
      expect(result.markdown).toContain('No documents found.');
    });

    it('should handle optional parameters', async () => {
      // Mock the client response
      const mockResponse = {
        data: {
          data: [
            {
              id: 'doc_123',
              title: 'Test Document 1',
              createdAt: '2023-01-01T12:00:00Z',
              byteSize: 1024,
            },
          ],
          document_count: 1,
        },
      };

      mockClient['list-documents'].mockResolvedValue(mockResponse);

      // Call the function with optional parameters
      await listDocuments(mockClient, {
        limit: 5,
        offset: 10,
        sort_by: 'title',
        sort_order: 'asc',
        cursor: 'test_cursor',
        title: 'Test',
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['list-documents']).toHaveBeenCalledWith({
        page_size: 5,
        order_by: 'title',
        order_direction: 'asc',
        count_remaining: false,
        cursor: 'test_cursor',
        title: 'Test',
      });
    });
  });

  describe('error scenarios', () => {
    it('should handle API errors gracefully', async () => {
      // Mock the client to throw an error
      const errorMessage = 'API Error: Connection failed';
      mockClient['list-documents'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await listDocuments(mockClient, {});

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Listing Documents');
      expect(result.markdown).toContain(
        `An error occurred while trying to list documents: ${errorMessage}`
      );
    });
  });
});
