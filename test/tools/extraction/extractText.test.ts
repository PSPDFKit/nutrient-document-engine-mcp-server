import { describe, it, expect, vi, beforeEach } from 'vitest';
import { extractText } from '../../../src/tools/extraction/extractText.js';
import { TextLine } from '../../../src/api/DocumentEngineSchema.js';
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

describe('extractText', () => {
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    mockClient = createMockClient();
  });

  describe('successful scenarios', () => {
    it('should extract text from all pages when no page range is provided', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 2,
          },
        },
      };

      // Mock page text responses
      const mockPage1TextResponse = {
        data: {
          textLines: [
            { contents: 'Line 1 on page 1', left: 10, top: 10, width: 100, height: 20 },
            { contents: 'Line 2 on page 1', left: 10, top: 40, width: 100, height: 20 },
          ] as TextLine[],
        },
      };

      const mockPage2TextResponse = {
        data: {
          textLines: [
            { contents: 'Line 1 on page 2', left: 10, top: 10, width: 100, height: 20 },
            { contents: 'Line 2 on page 2', left: 10, top: 40, width: 100, height: 20 },
          ] as TextLine[],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['get-document-page-text'].mockImplementation(
        ({ pageIndex }: { pageIndex: number }) => {
          if (pageIndex === 0) return Promise.resolve(mockPage1TextResponse);
          if (pageIndex === 1) return Promise.resolve(mockPage2TextResponse);
          return Promise.reject(new Error('Invalid page index'));
        }
      );

      // Call the function
      const result = await extractText(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_coordinates: false,
        ocr_enabled: false,
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['fetch-document-info']).toHaveBeenCalledWith({
        documentId: 'doc_123',
      });

      expect(mockClient['get-document-page-text']).toHaveBeenCalledTimes(2);
      expect(mockClient['get-document-page-text']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        pageIndex: 0,
      });
      expect(mockClient['get-document-page-text']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        pageIndex: 1,
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Text Extraction');
      expect(result.markdown).toContain('**Total Pages:** 2');
      expect(result.markdown).toContain('**Total Words:** 20');
      expect(result.markdown).toContain('**OCR Applied:** No');

      expect(result.markdown).toContain('## Page 1 (10 words)');
      expect(result.markdown).toContain('Line 1 on page 1 Line 2 on page 1');

      expect(result.markdown).toContain('## Page 2 (10 words)');
      expect(result.markdown).toContain('Line 1 on page 2 Line 2 on page 2');

      expect(result.markdown).not.toContain('### Coordinates for Page');
    });

    it('should extract text from specified page range', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 3,
          },
        },
      };

      // Mock page text responses
      const mockPage2TextResponse = {
        data: {
          textLines: [
            { contents: 'Line 1 on page 2', left: 10, top: 10, width: 100, height: 20 },
            { contents: 'Line 2 on page 2', left: 10, top: 40, width: 100, height: 20 },
          ] as TextLine[],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['get-document-page-text'].mockImplementation(
        ({ pageIndex }: { pageIndex: number }) => {
          if (pageIndex === 1) return Promise.resolve(mockPage2TextResponse);
          return Promise.reject(new Error('Invalid page index'));
        }
      );

      // Call the function with page_range
      const result = await extractText(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_range: { start: 1, end: 1 },
        include_coordinates: false,
        ocr_enabled: false,
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['get-document-page-text']).toHaveBeenCalledTimes(1);
      expect(mockClient['get-document-page-text']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        pageIndex: 1,
      });

      // Verify the result contains only page 2
      expect(result.markdown).toContain('## Page 2 (10 words)');
      expect(result.markdown).not.toContain('## Page 1');
      expect(result.markdown).not.toContain('## Page 3');
    });

    it('should include coordinates when requested', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 1,
          },
        },
      };

      // Mock page text response
      const mockPageTextResponse = {
        data: {
          textLines: [
            { contents: 'Line 1', left: 10, top: 10, width: 100, height: 20 },
          ] as TextLine[],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['get-document-page-text'].mockResolvedValue(mockPageTextResponse);

      // Call the function with include_coordinates = true
      const result = await extractText(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_coordinates: true,
        ocr_enabled: false,
      });

      // Verify the result contains coordinates
      expect(result.markdown).toContain('### Coordinates for Page 1');
      expect(result.markdown).toContain('```json');
      expect(result.markdown).toContain('"contents": "Line 1"');
      expect(result.markdown).toContain('"boundingBox": "(left:10, top:10, width:100, height:20)"');
    });

    it('should enable OCR when requested', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 1,
          },
        },
      };

      // Mock page text response
      const mockPageTextResponse = {
        data: {
          textLines: [
            { contents: 'OCR extracted text', left: 10, top: 10, width: 100, height: 20 },
          ] as TextLine[],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['get-document-page-text'].mockResolvedValue(mockPageTextResponse);

      // Call the function with ocr_enabled = true
      const result = await extractText(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_coordinates: false,
        ocr_enabled: true,
      });

      // Verify the client was called with OCR parameter
      expect(mockClient['get-document-page-text']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        pageIndex: 0,
        ocr: 'true',
      });

      // Verify the result indicates OCR was applied
      expect(result.markdown).toContain('**OCR Applied:** Yes');
    });

    it('should handle page ranges with start and end', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            pageCount: 5,
          },
        },
      };

      // Mock page text responses
      const mockPageTextResponse = {
        data: {
          textLines: [
            { contents: 'Page content', left: 10, top: 10, width: 100, height: 20 },
          ] as TextLine[],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['get-document-page-text'].mockResolvedValue(mockPageTextResponse);

      // Call the function with a page range that has start and end
      const result = await extractText(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_range: { start: 0, end: 3 },
        include_coordinates: false,
        ocr_enabled: false,
      });

      // Verify the client was called for the correct pages
      expect(mockClient['get-document-page-text']).toHaveBeenCalledTimes(4);
      expect(mockClient['get-document-page-text']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        pageIndex: 0,
      });
      expect(mockClient['get-document-page-text']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        pageIndex: 1,
      });
      expect(mockClient['get-document-page-text']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        pageIndex: 2,
      });
      expect(mockClient['get-document-page-text']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        pageIndex: 3,
      });

      // Verify the result contains the expected pages
      expect(result.markdown).toContain('## Page 1');
      expect(result.markdown).toContain('## Page 2');
      expect(result.markdown).toContain('## Page 3');
      expect(result.markdown).toContain('## Page 4');
      expect(result.markdown).not.toContain('## Page 5');
    });
  });

  describe('error scenarios', () => {
    it('should handle API errors gracefully', async () => {
      // Mock the client to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await extractText(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_coordinates: false,
        ocr_enabled: false,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Extracting Text');
      expect(result.markdown).toContain(
        `An error occurred while trying to extract text: ${errorMessage}`
      );
    });

    it('should handle invalid page ranges', async () => {
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
      mockClient['get-document-page-text'].mockResolvedValue({
        data: { textLines: [] },
      });

      // Call the function with an invalid page range
      const result = await extractText(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        page_range: { start: 10, end: 20 }, // Out of bounds
        include_coordinates: false,
        ocr_enabled: false,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Extracting Text');
      expect(result.markdown).toContain('out of bounds');
    });
  });
});
