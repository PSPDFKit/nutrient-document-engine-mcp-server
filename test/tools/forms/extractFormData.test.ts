import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { extractFormData } from '../../../src/tools/forms/extractFormData.js';
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

// Mock console.log to prevent output during tests
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('extractFormData', () => {
  let mockClient: MockedDocumentEngineClient;

  beforeEach(() => {
    mockClient = createMockClient();

    // Reset console.log mock
    consoleSpy.mockClear();
  });

  afterEach(() => {
    // Restore console.log
    consoleSpy.mockRestore();
  });

  describe('successful scenarios', () => {
    it('should extract form data successfully', async () => {
      // Mock layer info response
      mockClient['fetch-document-layer-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Form Document',
            layer: 'review-layer',
            documentId: 'doc_123',
            createdAt: '2023-01-01T12:00:00Z',
            updatedAt: '2023-01-02T12:00:00Z',
          },
        },
      });
      // Mock form fields response for layer-specific endpoint
      mockClient['get-document-layer-form-fields'].mockResolvedValue({
        data: {
          data: [
            {
              id: 'field_1',
              content: {
                name: 'Full Name',
                type: 'text',
              },
              pageIndex: 0,
              required: true,
            },
            {
              id: 'field_2',
              content: {
                name: 'Email',
                type: 'text',
              },
              pageIndex: 0,
              required: true,
            },
          ],
        },
      });

      // Mock form field values response for layer-specific endpoint
      mockClient['get-document-layer-form-field-values'].mockResolvedValue({
        data: {
          data: {
            formFieldValues: [
              {
                name: 'Full Name',
                value: 'John Doe',
              },
              {
                name: 'Email',
                value: 'john@example.com',
              },
            ],
          },
        },
      });

      // Call the function with layer
      const result = await extractFormData(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        include_empty_fields: true,
      });

      // Verify the layer-specific endpoints were called
      expect(mockClient['get-document-layer-form-fields']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        layerName: 'review-layer',
      });

      expect(mockClient['get-document-layer-form-field-values']).toHaveBeenCalledWith(
        {
          documentId: 'doc_123',
          layerName: 'review-layer',
        },
        null,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      // Verify the default endpoints were NOT called
      expect(mockClient['get-document-form-fields']).not.toHaveBeenCalled();
      expect(mockClient['get-document-form-field-values']).not.toHaveBeenCalled();

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Form Data');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Layer:** review-layer');
      expect(result.markdown).toContain('**Total Form Fields:** 2');
    });

    it('should extract form data successfully without layers', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Form Document',
            pageCount: 1,
          },
        },
      });

      // Mock form fields response
      mockClient['get-document-form-fields'].mockResolvedValue({
        data: {
          data: [
            {
              content: {
                name: 'textField1',
                type: 'text',
                flags: ['required'],
              },
              widgetAnnotations: [
                {
                  content: {
                    pageIndex: 0,
                    bbox: [100, 200, 150, 30],
                  },
                },
              ],
            },
            {
              content: {
                name: 'checkBox1',
                type: 'checkbox',
                flags: [],
              },
              widgetAnnotations: [
                {
                  content: {
                    pageIndex: 1,
                    bbox: [300, 400, 20, 20],
                  },
                },
              ],
            },
          ],
        },
      });

      // Mock form field values response
      mockClient['get-document-form-field-values'].mockResolvedValue({
        data: {
          data: {
            formFieldValues: [
              {
                name: 'textField1',
                value: 'Sample Text Value',
              },
              {
                name: 'checkBox1',
                value: true,
              },
            ],
          },
        },
      });

      // Call the function
      const result = await extractFormData(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_empty_fields: true,
      });

      // Basic verification - just check that the function completed and returned markdown
      expect(result.markdown).toBeDefined();
      expect(typeof result.markdown).toBe('string');
      expect(result.markdown).toContain('# Form Data');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Total Form Fields:** 2');

      // Check for text field
      expect(result.markdown).toContain('## Text Fields (1)');
      expect(result.markdown).toContain('| Field Name | Value | Page | Required |');
      expect(result.markdown).toContain('| textField1 | Sample Text Value | 1 | ✓ |');

      // Check for checkbox field
      expect(result.markdown).toContain('## Checkbox Fields (1)');
      expect(result.markdown).toContain('| Field Name | Value | Page | Required |');
      expect(result.markdown).toContain('| checkBox1 | ✓ | 2 |  |');

      // Check detailed information
      expect(result.markdown).toContain('## Detailed Information');
      expect(result.markdown).toContain('### textField1');
      expect(result.markdown).toContain('- **Type:** Text');
      expect(result.markdown).toContain('- **Value:** Sample Text Value');
      expect(result.markdown).toContain('- **Page:** 1');
      expect(result.markdown).toContain('- **Required:** Yes');
      expect(result.markdown).toContain(
        '- **Location:** Page 1, coordinates (left:100, top:200, width:150, height:30)'
      );

      expect(result.markdown).toContain('### checkBox1');
      expect(result.markdown).toContain('- **Type:** Checkbox');
      expect(result.markdown).toContain('- **Value:** ✓');
      expect(result.markdown).toContain('- **Page:** 2');
      expect(result.markdown).toContain(
        '- **Location:** Page 2, coordinates (left:300, top:400, width:20, height:20)'
      );
    });

    it('should handle filtering by field names', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Form Document',
            pageCount: 1,
          },
        },
      });

      // Mock form fields response
      mockClient['get-document-form-fields'].mockResolvedValue({
        data: {
          data: [
            {
              content: {
                name: 'textField1',
                type: 'text',
              },
              widgetAnnotations: [
                {
                  content: {
                    pageIndex: 0,
                    bbox: [100, 200, 150, 30],
                  },
                },
              ],
            },
            {
              content: {
                name: 'checkBox1',
                type: 'checkbox',
              },
              widgetAnnotations: [
                {
                  content: {
                    pageIndex: 1,
                    bbox: [300, 400, 20, 20],
                  },
                },
              ],
            },
          ],
        },
      });

      // Mock form field values response
      mockClient['get-document-form-field-values'].mockResolvedValue({
        data: {
          data: {
            formFieldValues: [
              {
                name: 'textField1',
                value: 'Sample Text Value',
              },
              {
                name: 'checkBox1',
                value: true,
              },
            ],
          },
        },
      });

      // Call the function with field_names filter
      const result = await extractFormData(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        field_names: ['textField1'],
        include_empty_fields: true,
      });

      // Verify the result contains only the filtered field
      expect(result.markdown).toContain('**Total Form Fields:** 1');
      expect(result.markdown).toContain('## Text Fields (1)');
      expect(result.markdown).toContain('| textField1 |');
      expect(result.markdown).not.toContain('| checkBox1 |');
    });

    it('should handle excluding empty fields', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Form Document',
            pageCount: 1,
          },
        },
      });

      // Mock form fields response
      mockClient['get-document-form-fields'].mockResolvedValue({
        data: {
          data: [
            {
              content: {
                name: 'textField1',
                type: 'text',
              },
              widgetAnnotations: [
                {
                  content: {
                    pageIndex: 0,
                    bbox: [100, 200, 150, 30],
                  },
                },
              ],
            },
            {
              content: {
                name: 'emptyField',
                type: 'text',
              },
              widgetAnnotations: [
                {
                  content: {
                    pageIndex: 1,
                    bbox: [300, 400, 150, 30],
                  },
                },
              ],
            },
          ],
        },
      });

      // Mock form field values response with one empty field
      mockClient['get-document-form-field-values'].mockResolvedValue({
        data: {
          data: {
            formFieldValues: [
              {
                name: 'textField1',
                value: 'Sample Text Value',
              },
              {
                name: 'emptyField',
                value: '',
              },
            ],
          },
        },
      });

      // Call the function with include_empty_fields = false
      const result = await extractFormData(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_empty_fields: false,
      });

      // Verify the result contains only non-empty fields
      expect(result.markdown).toContain('**Total Form Fields:** 1');
      expect(result.markdown).toContain('| textField1 |');
      expect(result.markdown).not.toContain('| emptyField |');
    });

    it('should handle documents with no form fields', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Document Without Forms',
            pageCount: 1,
          },
        },
      });

      // Mock form fields response with empty array
      mockClient['get-document-form-fields'].mockResolvedValue({
        data: {
          data: [],
        },
      });

      // Mock form field values response with empty array
      mockClient['get-document-form-field-values'].mockResolvedValue({
        data: {
          data: {
            formFieldValues: [],
          },
        },
      });

      // Call the function
      const result = await extractFormData(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_empty_fields: true,
      });

      // Verify the result indicates no form fields
      expect(result.markdown).toContain('# Form Data Extraction');
      expect(result.markdown).toContain('**Total Form Fields:** 0');
      expect(result.markdown).toContain('No form fields found in this document');
    });
  });

  describe('error scenarios', () => {
    it('should handle API errors from fetch-document-info', async () => {
      // Mock fetch-document-info to throw an error
      const errorMessage = 'API Error: Document not found';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await extractFormData(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_empty_fields: true,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Extracting Form Data');
      expect(result.markdown).toContain(
        `An error occurred while trying to extract form data: ${errorMessage}`
      );
    });

    it('should handle API errors from get-document-form-fields', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Form Document',
            pageCount: 1,
          },
        },
      });

      // Mock get-document-form-fields to throw an error
      const errorMessage = 'API Error: Failed to get form fields';
      mockClient['get-document-form-fields'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await extractFormData(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_empty_fields: true,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Extracting Form Data');
      expect(result.markdown).toContain(
        `An error occurred while trying to extract form data: ${errorMessage}`
      );
    });

    it('should handle API errors from get-document-form-field-values', async () => {
      // Mock document info response
      mockClient['fetch-document-info'].mockResolvedValue({
        data: {
          data: {
            title: 'Test Form Document',
            pageCount: 1,
          },
        },
      });

      // Mock form fields response
      mockClient['get-document-form-fields'].mockResolvedValue({
        data: {
          data: [
            {
              content: {
                name: 'textField1',
                type: 'text',
              },
              widgetAnnotations: [
                {
                  content: {
                    pageIndex: 0,
                    bbox: [100, 200, 150, 30],
                  },
                },
              ],
            },
          ],
        },
      });

      // Mock get-document-form-field-values to throw an error
      const errorMessage = 'API Error: Failed to get form field values';
      mockClient['get-document-form-field-values'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await extractFormData(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        include_empty_fields: true,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Extracting Form Data');
      expect(result.markdown).toContain(
        `An error occurred while trying to extract form data: ${errorMessage}`
      );
    });
  });
});
