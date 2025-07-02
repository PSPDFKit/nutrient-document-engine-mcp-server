import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fillFormFields } from '../../../src/tools/forms/fillFormFields.js';
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

describe('fillFormFields', () => {
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
    it('should update form fields successfully', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            title: 'Test Document',
          },
        },
      };

      // Mock form fields response
      const mockFormFieldsResponse = {
        data: {
          data: [{ content: { name: 'field1' } }, { content: { name: 'field2' } }],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['get-document-form-fields'].mockResolvedValue(mockFormFieldsResponse);
      mockClient['update-document-form-field-values'].mockResolvedValue({});

      // Call the function
      const result = await fillFormFields(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        field_values: [
          { fieldName: 'field1', value: 'value1' },
          { fieldName: 'field2', value: 'value2' },
        ],
        validate_required: true,
      });

      // Verify the client was called with the correct parameters
      expect(mockClient['fetch-document-info']).toHaveBeenCalledWith({
        documentId: 'doc_123',
      });

      expect(mockClient['get-document-form-fields']).toHaveBeenCalledWith({
        documentId: 'doc_123',
      });

      expect(mockClient['update-document-form-field-values']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        formFieldValues: [
          {
            name: 'field1',
            value: 'value1',
            type: 'pspdfkit/form-field-value',
            v: 1,
            createdBy: null,
            updatedBy: null,
          },
          {
            name: 'field2',
            value: 'value2',
            type: 'pspdfkit/form-field-value',
            v: 1,
            createdBy: null,
            updatedBy: null,
          },
        ],
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Form Filling Complete');
      expect(result.markdown).toContain('**Document:** Test Document');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Status:** Successfully updated');
      expect(result.markdown).toContain('**Fields Updated:** 2');
      expect(result.markdown).toContain('## Successfully Updated Fields');
      expect(result.markdown).toContain('- ✅ **field1:** Updated to "value1"');
      expect(result.markdown).toContain('- ✅ **field2:** Updated to "value2"');
      expect(result.markdown).not.toContain('**Validation Errors:**');
      expect(result.markdown).not.toContain('**API Error:**');
    });

    it('should handle long field values', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            title: 'Test Document',
          },
        },
      };

      // Mock form fields response
      const mockFormFieldsResponse = {
        data: {
          data: [{ content: { name: 'longField' } }],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['get-document-form-fields'].mockResolvedValue(mockFormFieldsResponse);
      mockClient['update-document-form-field-values'].mockResolvedValue({});

      // Create a long field value
      const longValue =
        'This is a very long field value that should be truncated in the output markdown';

      // Call the function
      const result = await fillFormFields(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        field_values: [{ fieldName: 'longField', value: longValue }],
        validate_required: true,
      });

      // Verify the result truncates the long value
      expect(result.markdown).toContain(
        '- ✅ **longField:** Updated to "This is a very long field value that should be ...'
      );
    });

    it('should skip validation when validate_required is false', async () => {
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
      mockClient['update-document-form-field-values'].mockResolvedValue({});

      // Call the function with validate_required = false
      const result = await fillFormFields(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        field_values: [
          { fieldName: 'field1', value: 'value1' },
          { fieldName: 'field2', value: 'value2' },
        ],
        validate_required: false,
      });

      // Verify get-document-form-fields was not called
      expect(mockClient['get-document-form-fields']).not.toHaveBeenCalled();

      // Verify the update was still performed
      expect(mockClient['update-document-form-field-values']).toHaveBeenCalled();

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('**Status:** Successfully updated');
    });
  });

  describe('error scenarios', () => {
    it('should handle validation errors', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            title: 'Test Document',
          },
        },
      };

      // Mock form fields response with only one valid field
      const mockFormFieldsResponse = {
        data: {
          data: [{ content: { name: 'field1' } }],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['get-document-form-fields'].mockResolvedValue(mockFormFieldsResponse);
      mockClient['update-document-form-field-values'].mockResolvedValue({});

      // Call the function with a non-existent field
      const result = await fillFormFields(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        field_values: [
          { fieldName: 'field1', value: 'value1' },
          { fieldName: 'nonExistentField', value: 'value2' },
        ],
        validate_required: true,
      });

      // Verify the update was not performed due to validation errors
      expect(mockClient['update-document-form-field-values']).not.toHaveBeenCalled();

      // Verify the result contains the validation error
      expect(result.markdown).toContain('**Status:** Update failed');
      expect(result.markdown).toContain('**Validation Errors:**');
      expect(result.markdown).toContain(
        '- ❌ **Validation:** Field "nonExistentField" does not exist in the document'
      );
    });

    it('should handle API errors during update', async () => {
      // Mock document info response
      const mockDocInfoResponse = {
        data: {
          data: {
            title: 'Test Document',
          },
        },
      };

      // Mock form fields response
      const mockFormFieldsResponse = {
        data: {
          data: [{ content: { name: 'field1' } }, { content: { name: 'field2' } }],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['get-document-form-fields'].mockResolvedValue(mockFormFieldsResponse);

      // Mock the update to throw an error
      const errorMessage = 'API Error: Invalid field value';
      mockClient['update-document-form-field-values'].mockRejectedValue({
        response: {
          data: {
            message: errorMessage,
          },
        },
      });

      // Call the function
      const result = await fillFormFields(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        field_values: [
          { fieldName: 'field1', value: 'value1' },
          { fieldName: 'field2', value: 'value2' },
        ],
        validate_required: true,
      });

      // Verify the result contains the API error
      expect(result.markdown).toContain('**Status:** Update failed');
      expect(result.markdown).toContain('**API Error:** API Error: Invalid field value');
    });

    it('should handle errors during form field validation', async () => {
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

      // Mock the get-document-form-fields to throw an error
      mockClient['get-document-form-fields'].mockRejectedValue(
        new Error('Failed to get form fields')
      );

      // Mock the update to succeed
      mockClient['update-document-form-field-values'].mockResolvedValue({});

      // Call the function
      const result = await fillFormFields(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        field_values: [{ fieldName: 'field1', value: 'value1' }],
        validate_required: true,
      });

      // Verify the update was still performed despite validation error
      expect(mockClient['update-document-form-field-values']).toHaveBeenCalled();

      // Verify the result indicates success
      expect(result.markdown).toContain('**Status:** Successfully updated');
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

      // Mock form fields response for layer-specific endpoint
      const mockFormFieldsResponse = {
        data: {
          data: [{ content: { name: 'field1' } }, { content: { name: 'field2' } }],
        },
      };

      // Set up the mock responses
      mockClient['fetch-document-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['fetch-document-layer-info'].mockResolvedValue(mockDocInfoResponse);
      mockClient['get-document-layer-form-fields'].mockResolvedValue(mockFormFieldsResponse);
      mockClient['update-document-layer-form-field-values'].mockResolvedValue({});

      // Call the function with layer
      const result = await fillFormFields(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        field_values: [
          { fieldName: 'field1', value: 'value1' },
          { fieldName: 'field2', value: 'value2' },
        ],
        validate_required: true,
      });

      // Verify the layer-specific endpoints were called
      expect(mockClient['get-document-layer-form-fields']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        layerName: 'review-layer',
      });

      expect(mockClient['update-document-layer-form-field-values']).toHaveBeenCalledWith({
        documentId: 'doc_123',
        layerName: 'review-layer',
        formFieldValues: [
          {
            name: 'field1',
            value: 'value1',
            type: 'pspdfkit/form-field-value',
            v: 1,
            createdBy: null,
            updatedBy: null,
          },
          {
            name: 'field2',
            value: 'value2',
            type: 'pspdfkit/form-field-value',
            v: 1,
            createdBy: null,
            updatedBy: null,
          },
        ],
      });

      // Verify the default endpoints were NOT called
      expect(mockClient['get-document-form-fields']).not.toHaveBeenCalled();
      expect(mockClient['update-document-form-field-values']).not.toHaveBeenCalled();

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Form Filling Complete');
      expect(result.markdown).toContain('**Document:** Test Document');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Status:** Successfully updated');
      expect(result.markdown).toContain('**Fields Updated:** 2');
    });

    it('should handle general errors gracefully', async () => {
      // Mock the client to throw an error
      const errorMessage = 'API Error: Connection failed';
      mockClient['fetch-document-info'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await fillFormFields(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        field_values: [{ fieldName: 'field1', value: 'value1' }],
        validate_required: true,
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Filling Form Fields');
      expect(result.markdown).toContain(
        `An error occurred while trying to fill form fields: ${errorMessage}`
      );
    });
  });
});
