import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRedaction } from '../../../src/tools/annotations/createRedaction.js';
import { createMockClient, type MockedDocumentEngineClient } from '../../utils/mockTypes.js';

// Mock the logger to prevent console output during tests
vi.mock('../../../src/utils/Logger.js', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
  },
}));

describe('createRedaction', () => {
  let mockClient: MockedDocumentEngineClient;
  const mockDate = new Date('2023-01-01T12:00:00Z');

  beforeEach(() => {
    mockClient = createMockClient();

    // Mock Date.now and Math.random for consistent redaction IDs
    Date.now = vi.fn(() => mockDate.getTime());

    Math.random = vi.fn(() => 0.123456789);
  });

  afterEach(() => {
    // Restore original functions
    vi.restoreAllMocks();
  });

  describe('successful scenarios', () => {
    it('should create a regex redaction successfully', async () => {
      // Mock create-document-redactions response with matches
      const mockResponse = {
        data: {
          data: {
            annotations: [
              { id: '123ABC', pageIndex: 0, bbox: [100, 200, 50, 30] },
              { id: '456ABC', pageIndex: 0, bbox: [300, 400, 50, 30] },
              { id: '789ABC', pageIndex: 2, bbox: [150, 250, 50, 30] },
            ],
          },
        },
      };

      mockClient['create-document-redactions'].mockResolvedValue(mockResponse);

      // Call the function
      const result = await createRedaction(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        redaction_type: 'regex',
        pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b', // Email pattern
      });

      // Verify create-document-redactions was called with the correct parameters
      expect(mockClient['create-document-redactions']).toHaveBeenCalledWith(
        { documentId: 'doc_123' },
        {
          strategy: 'regex',
          strategyOptions: {
            regex: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
          },
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Redaction Creation Complete');
      // Check for redaction ID pattern (starts with 'red_' followed by numbers and letters)
      expect(result.markdown).toMatch(/🔍 \*\*Redaction IDs:\*\* \[[A-Za-z0-9, ]+\]/);
      expect(result.markdown).toContain('**Matches Found:** 3 instances');
      expect(result.markdown).toContain('**Pages Affected:** 1, 3');
      expect(result.markdown).toContain('**Preview Available:** Yes');
      expect(result.markdown).toContain('## Redaction Summary');
      expect(result.markdown).toContain('**Type:** Custom Regex');
      expect(result.markdown).toContain(
        '**Pattern:** \\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b'
      );
      expect(result.markdown).toContain('**Matches:** 3 instances');
      expect(result.markdown).toContain('### 📍 Locations Found');
      expect(result.markdown).toContain('- **Page 1:** 2 matches detected');
      expect(result.markdown).toContain('- **Page 3:** 1 match detected');
      expect(result.markdown).toContain('## ⚠️ Important Notes');
      expect(result.markdown).toContain(
        '**Preview mode:** No content has been permanently redacted yet'
      );
      expect(result.markdown).toContain('## Processing Summary');
      expect(result.markdown).toContain('**Document ID:** doc_123');
    });

    it('should create a preset redaction successfully', async () => {
      // Mock create-document-redactions response with matches
      const mockResponse = {
        data: {
          data: {
            annotations: [{ pageIndex: 1, bbox: [100, 200, 50, 30] }],
          },
        },
      };

      mockClient['create-document-redactions'].mockResolvedValue(mockResponse);

      // Call the function
      const result = await createRedaction(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        redaction_type: 'preset',
        preset: 'credit-card-number',
      });

      // Verify create-document-redactions was called with the correct parameters
      expect(mockClient['create-document-redactions']).toHaveBeenCalledWith(
        { documentId: 'doc_123' },
        {
          strategy: 'preset',
          strategyOptions: {
            preset: 'credit-card-number',
          },
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Redaction Creation Complete');
      expect(result.markdown).toContain('**Matches Found:** 1 instance');
      expect(result.markdown).toContain('**Pages Affected:** 2');
      expect(result.markdown).toContain('**Type:** Preset');
      expect(result.markdown).toContain('**Pattern:** credit-card-number');
      expect(result.markdown).toContain('Preset: Credit Card Number');
    });

    it('should create a text redaction successfully', async () => {
      // Mock create-document-redactions response with matches
      const mockResponse = {
        data: {
          data: {
            annotations: [
              { pageIndex: 0, bbox: [100, 200, 50, 30] },
              { pageIndex: 3, bbox: [300, 400, 50, 30] },
            ],
          },
        },
      };

      mockClient['create-document-redactions'].mockResolvedValue(mockResponse);

      // Call the function
      const result = await createRedaction(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        redaction_type: 'text',
        text: 'CONFIDENTIAL',
      });

      // Verify create-document-redactions was called with the correct parameters
      expect(mockClient['create-document-redactions']).toHaveBeenCalledWith(
        { documentId: 'doc_123' },
        {
          strategy: 'text',
          strategyOptions: {
            text: 'CONFIDENTIAL',
          },
        }
      );

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Redaction Creation Complete');
      expect(result.markdown).toContain('**Matches Found:** 2 instances');
      expect(result.markdown).toContain('**Pages Affected:** 1, 4');
      expect(result.markdown).toContain('**Type:** Text Match');
      expect(result.markdown).toContain('**Pattern:** CONFIDENTIAL');
      expect(result.markdown).toContain('Text: CONFIDENTIAL');
    });

    it('should handle no matches found', async () => {
      // Mock create-document-redactions response with no matches
      const mockResponse = {
        data: {
          data: {
            annotations: [],
          },
        },
      };

      mockClient['create-document-redactions'].mockResolvedValue(mockResponse);

      // Call the function
      const result = await createRedaction(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        redaction_type: 'regex',
        pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
      });

      // Verify the result contains the expected markdown
      expect(result.markdown).toContain('# Redaction Creation Complete');
      expect(result.markdown).toContain('**Matches Found:** 0 instances');
      expect(result.markdown).toContain('**Pages Affected:** None');
      expect(result.markdown).toContain('## No Matches Found');
      expect(result.markdown).toContain('**Pattern:** Custom Pattern:');
      expect(result.markdown).toContain('**Suggestion:** Try adjusting your pattern');
    });

    it('should work with layers', async () => {
      // Mock create-document-redactions response with matches
      const mockResponse = {
        data: {
          data: {
            annotations: [
              { id: '123LAYER', pageIndex: 0, bbox: [100, 200, 50, 30] },
              { id: '456LAYER', pageIndex: 1, bbox: [300, 400, 50, 30] },
            ],
          },
        },
      };

      mockClient['create-document-layer-redactions'].mockResolvedValue(mockResponse);

      // Call the function with layer
      const result = await createRedaction(mockClient, {
        document_fingerprint: {
          document_id: 'doc_123',
          layer: 'review-layer',
        },
        redaction_type: 'text',
        text: 'CONFIDENTIAL',
      });

      // Verify the layer-specific endpoint was called
      expect(mockClient['create-document-layer-redactions']).toHaveBeenCalledWith(
        {
          documentId: 'doc_123',
          layerName: 'review-layer',
        },
        {
          strategy: 'text',
          strategyOptions: {
            text: 'CONFIDENTIAL',
          },
        }
      );

      // Verify the default endpoint was NOT called
      expect(mockClient['create-document-redactions']).not.toHaveBeenCalled();

      // Verify the result contains layer information
      expect(result.markdown).toContain('# Redaction Creation Complete');
      expect(result.markdown).toContain('**Redaction IDs:** [123LAYER, 456LAYER]');
      expect(result.markdown).toContain('**Matches Found:** 2 instances');
      expect(result.markdown).toContain('**Pages Affected:** 1, 2');
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Layer:** review-layer');
      expect(result.markdown).toContain('Text: CONFIDENTIAL');
    });
  });

  describe('error scenarios', () => {
    it('should handle API errors from create-document-redactions', async () => {
      // Mock create-document-redactions to throw an error
      const errorMessage = 'API Error: Failed to create redaction';
      mockClient['create-document-redactions'].mockRejectedValue(new Error(errorMessage));

      // Call the function
      const result = await createRedaction(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        redaction_type: 'regex',
        pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
      });

      // Verify the result contains the error message
      expect(result.markdown).toContain('# Error Creating Redaction');
      expect(result.markdown).toContain(
        `An error occurred while trying to create redaction analysis: ${errorMessage}`
      );
      expect(result.markdown).toContain('**Document ID:** doc_123');
      expect(result.markdown).toContain('**Redaction Type:** regex');
      expect(result.markdown).toContain(
        '**Pattern:** \\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b'
      );
      expect(result.markdown).toContain('## Troubleshooting Tips');
    });

    it('should handle validation errors for missing required fields', async () => {
      // Call the function with missing required fields
      const result = await createRedaction(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        redaction_type: 'regex',
        // Missing pattern field
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any); // Testing missing required fields for validation

      // Verify the result contains the validation error
      expect(result.markdown).toContain('# Error Creating Redaction');
      expect(result.markdown).toContain(
        'An error occurred while trying to create redaction analysis:'
      );
      expect(result.markdown).toContain(
        'Invalid redaction configuration: missing required fields for redaction type'
      );
    });

    it('should handle validation errors for invalid redaction type', async () => {
      // Call the function with invalid redaction type
      const result = await createRedaction(mockClient, {
        document_fingerprint: { document_id: 'doc_123' },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        redaction_type: 'invalid' as any, // Testing invalid redaction type for validation
        pattern: 'test',
      });

      // Verify the result contains the validation error
      expect(result.markdown).toContain('# Error Creating Redaction');
      expect(result.markdown).toContain(
        'An error occurred while trying to create redaction analysis:'
      );
      expect(result.markdown).toContain('invalid_enum_value');
    });

    it('should handle validation errors for empty document_id', async () => {
      // Call the function with empty document_id
      const result = await createRedaction(mockClient, {
        document_fingerprint: { document_id: '' },
        redaction_type: 'regex',
        pattern: 'test',
      });

      // Verify the result contains the validation error
      expect(result.markdown).toContain('# Error Creating Redaction');
      expect(result.markdown).toContain(
        'An error occurred while trying to create redaction analysis:'
      );
      expect(result.markdown).toContain('Document ID is required');
    });
  });
});
