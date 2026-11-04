/**
 * Test scenarios for focused LLM tool usage evaluation
 */

import { ToolUsageScenario } from './types.js';

/**
 * Comprehensive test scenarios focused on tool usage patterns
 */
export const TOOL_USAGE_SCENARIOS: ToolUsageScenario[] = [
  // === DOCUMENT DISCOVERY TOOLS ===

  // list_documents scenarios
  {
    id: 'simple-list',
    description: 'List all documents',
    query: 'Show me all available documents',
    expectedTools: ['list_documents'],
    maxToolCalls: 1,
  },
  {
    id: 'list-with-limit',
    description: 'List documents with limit',
    query: 'Show me the first 5 documents',
    expectedTools: ['list_documents'],
    maxToolCalls: 1,
    expectedParameters: {
      list_documents: { limit: 5 },
    },
  },
  {
    id: 'list-sorted-by-title',
    description: 'List documents sorted by title',
    query: 'Show me all documents sorted alphabetically by title',
    expectedTools: ['list_documents'],
    maxToolCalls: 1,
    expectedParameters: {
      list_documents: { sort_by: 'title', sort_order: 'asc' },
    },
  },
  {
    id: 'list-with-title-filter',
    description: 'List documents filtered by title',
    query: 'Find documents with "contract" in the title',
    expectedTools: ['list_documents'],
    maxToolCalls: 1,
    expectedParameters: {
      list_documents: { title: 'contract' },
    },
  },
  {
    id: 'list-recent-with-count',
    description: 'List recent documents with remaining count',
    query: 'Show me the 10 most recently updated documents and tell me how many more there are',
    expectedTools: ['list_documents'],
    maxToolCalls: 1,
    expectedParameters: {
      list_documents: {
        limit: 10,
        sort_by: 'updated_at',
        sort_order: 'desc',
        count_remaining: true,
      },
    },
  },

  // read_document_info scenarios
  {
    id: 'simple-info',
    description: 'Get document information',
    query: 'Tell me about document doc-12345',
    expectedTools: ['read_document_info'],
    maxToolCalls: 1,
    expectedParameters: {
      read_document_info: {
        document_fingerprint: { document_id: 'doc-12345' },
      },
    },
  },

  // === TEXT EXTRACTION TOOLS ===

  // extract_text scenarios
  {
    id: 'simple-extract',
    description: 'Extract text from specific page',
    query: 'Extract text from page 2 of document doc-12345',
    expectedTools: ['extract_text'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_text: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_range: { start: 1, end: 1 },
      },
    },
  },
  {
    id: 'extract-with-coordinates',
    description: 'Extract text with position information',
    query: 'Extract text from document doc-12345 and include the coordinate positions',
    expectedTools: ['extract_text'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_text: {
        document_fingerprint: { document_id: 'doc-12345' },
        include_coordinates: true,
      },
    },
  },
  {
    id: 'extract-page-range-with-ocr',
    description: 'Extract text from page range with OCR',
    query: 'Extract text from pages 3 to 4 of document doc-12345 using OCR for scanned content',
    expectedTools: ['extract_text'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_text: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_range: { start: 2, end: 3 },
        ocr_enabled: true,
      },
    },
  },

  // search scenarios
  {
    id: 'simple-search',
    description: 'Search for text in document',
    query: 'Search for "confidential" in document doc-12345',
    expectedTools: ['search'],
    maxToolCalls: 1,
    expectedParameters: {
      search: {
        document_fingerprint: { document_id: 'doc-12345' },
        query: 'confidential',
      },
    },
  },
  {
    id: 'regex-search-case-sensitive',
    description: 'Regex search with case sensitivity',
    query: 'Find all email addresses in document doc-12345 using regex, case sensitive search',
    expectedTools: ['search'],
    maxToolCalls: 1,
    expectedParameters: {
      search: {
        document_fingerprint: { document_id: 'doc-12345' },
        query: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
        search_type: 'regex',
        case_sensitive: true,
      },
    },
  },
  {
    id: 'search-page-range-with-annotations',
    description: 'Search in specific pages including annotations',
    query:
      'Search for "important" in pages 2-4 of document doc-12345, including inside annotations',
    expectedTools: ['search'],
    maxToolCalls: 1,
    expectedParameters: {
      search: {
        document_fingerprint: { document_id: 'doc-12345' },
        query: 'important',
        start_page: 1,
        end_page: 3,
        include_annotations: true,
      },
    },
  },
  {
    id: 'preset-search-phone-numbers',
    description: 'Search using preset for phone numbers',
    query: 'Find all North American phone numbers in document doc-12345',
    expectedTools: ['search'],
    maxToolCalls: 1,
    expectedParameters: {
      search: {
        document_fingerprint: { document_id: 'doc-12345' },
        query: 'north-american-phone-number',
        search_type: 'preset',
      },
    },
  },

  // render_document_page scenarios
  {
    id: 'render-page-with-width',
    description: 'Render a document page with width parameter',
    query: 'Show me page 1 of document doc-12345 as an image with width 800 pixels',
    expectedTools: ['render_document_page'],
    maxToolCalls: 1,
    expectedParameters: {
      render_document_page: {
        document_fingerprint: { document_id: 'doc-12345' },
        pages: [0],
        width: 800,
      },
    },
  },
  {
    id: 'render-page-with-height',
    description: 'Render a document page with height parameter',
    query: 'Render page 3 of document doc-12345 with a height of 600 pixels',
    expectedTools: ['render_document_page'],
    maxToolCalls: 1,
    expectedParameters: {
      render_document_page: {
        document_fingerprint: { document_id: 'doc-12345' },
        pages: [2],
        height: 600,
      },
    },
  },
  {
    id: 'render-first-page',
    description: 'Render the first page of a document',
    query: 'Show me the first page of document doc-12345 as an image',
    expectedTools: ['render_document_page'],
    maxToolCalls: 1,
    expectedParameters: {
      render_document_page: {
        document_fingerprint: { document_id: 'doc-12345' },
        pages: [0],
        width: 800,
      },
    },
  },
  {
    id: 'render-multiple-pages',
    description: 'Render multiple pages of a document',
    query: 'Show me pages 1, 3, and 5 of document doc-12345 as images with width 600 pixels',
    expectedTools: ['render_document_page'],
    maxToolCalls: 1,
    expectedParameters: {
      render_document_page: {
        document_fingerprint: { document_id: 'doc-12345' },
        pages: [0, 2, 4],
        width: 600,
      },
    },
  },
  {
    id: 'render-page-range',
    description: 'Render a range of document pages',
    query: 'Show me the first three pages of document doc-12345',
    expectedTools: ['render_document_page'],
    maxToolCalls: 1,
    expectedParameters: {
      render_document_page: {
        document_fingerprint: { document_id: 'doc-12345' },
        pages: [0, 1, 2],
        width: 800,
      },
    },
  },

  // extract_tables scenarios
  {
    id: 'extract-all-tables',
    description: 'Extract all tables from document',
    query: 'Extract all tables from document doc-12345',
    expectedTools: ['extract_tables'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_tables: { document_fingerprint: { document_id: 'doc-12345' } },
    },
  },
  {
    id: 'extract-tables-page-range',
    description: 'Extract tables from specific pages',
    query: 'Extract tables from pages 3 to 5 of document doc-12345',
    expectedTools: ['extract_tables'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_tables: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_range: { start: 2, end: 4 },
      },
    },
  },

  // === FORM TOOLS ===

  // extract_form_data scenarios
  {
    id: 'extract-all-form-data',
    description: 'Extract all form field data',
    query: 'Show me all the form fields and their values in document doc-form-123',
    expectedTools: ['extract_form_data'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_form_data: { document_fingerprint: { document_id: 'doc-form-123' } },
    },
  },
  {
    id: 'extract-specific-form-fields',
    description: 'Extract specific form fields',
    query: 'Get the values for the "name", "email", and "phone" fields from document doc-form-123',
    expectedTools: ['extract_form_data'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_form_data: {
        document_fingerprint: { document_id: 'doc-form-123' },
        field_names: ['name', 'email', 'phone'],
      },
    },
  },
  {
    id: 'extract-filled-form-fields-only',
    description: 'Extract only filled form fields',
    query: 'Show me only the form fields that have been filled out in document doc-form-123',
    expectedTools: ['extract_form_data'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_form_data: {
        document_fingerprint: { document_id: 'doc-form-123' },
        include_empty_fields: false,
      },
    },
  },

  // fill_form_fields scenarios
  {
    id: 'fill-single-form-field',
    description: 'Fill a single form field',
    query: 'Fill the "name" field with "John Smith" in document doc-form-123',
    expectedTools: ['fill_form_fields'],
    maxToolCalls: 1,
    expectedParameters: {
      fill_form_fields: {
        document_fingerprint: { document_id: 'doc-form-123' },
        field_values: [{ fieldName: 'name', value: 'John Smith' }],
      },
    },
  },
  {
    id: 'fill-multiple-form-fields',
    description: 'Fill multiple form fields with different types',
    query:
      'Fill the form in document doc-form-123: set Name to "Jane Doe", zip code of 00000, and sex of male',
    expectedTools: ['fill_form_fields'],
    maxToolCalls: 1,
    expectedParameters: {
      fill_form_fields: {
        document_fingerprint: { document_id: 'doc-form-123' },
        field_values: [
          { fieldName: 'Name_First', value: 'Jane' },
          { fieldName: 'Name_Last', value: 'Doe' },
          { fieldName: 'ZIP', value: '00000' },
          { fieldName: 'Sex.0', value: 'On' },
        ],
      },
    },
  },
  {
    id: 'fill-form-skip-validation',
    description: 'Fill form fields without validation',
    query:
      'Fill the "custom_field" with "test value" in document doc-form-123, don\'t validate if the field exists',
    expectedTools: ['fill_form_fields'],
    maxToolCalls: 1,
    expectedParameters: {
      fill_form_fields: {
        document_fingerprint: { document_id: 'doc-form-123' },
        field_values: [{ fieldName: 'custom_field', value: 'test value' }],
        validate_required: false,
      },
    },
  },

  // === ANNOTATION TOOLS ===

  // add_annotation scenarios
  {
    id: 'add-simple-note',
    description: 'Add a note annotation',
    query:
      'Add a note saying "Review this section" at coordinates (100, 200) with size 150x50 on page 1 of document doc-12345',
    expectedTools: ['add_annotation'],
    maxToolCalls: 1,
    expectedParameters: {
      add_annotation: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_number: 0,
        annotation_type: 'note',
        content: 'Review this section',
        coordinates: { left: 100, top: 200, width: 150, height: 50 },
      },
    },
  },
  {
    id: 'add-highlight-with-author',
    description: 'Add highlight annotation with author',
    query:
      'Highlight the text at position (50, 300) with size 200x20 on page 3 of document doc-12345, authored by "John Smith"',
    expectedTools: ['add_annotation'],
    maxToolCalls: 1,
    expectedParameters: {
      add_annotation: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_number: 2,
        annotation_type: 'highlight',
        content: '',
        coordinates: { left: 50, top: 300, width: 200, height: 20 },
        author: 'John Smith',
      },
    },
  },
  {
    id: 'add-link-annotation',
    description: 'Add link annotation',
    query:
      'Add a link to "https://example.com" at coordinates (300, 400) with size 100x30 on page 2 of document doc-12345',
    expectedTools: ['add_annotation'],
    maxToolCalls: 1,
    expectedParameters: {
      add_annotation: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_number: 1,
        annotation_type: 'link',
        content: 'https://example.com',
        coordinates: { left: 300, top: 400, width: 100, height: 30 },
      },
    },
  },

  // read_annotations scenarios
  {
    id: 'read-all-annotations',
    description: 'Read all annotations from document',
    query: 'Show me all annotations in document doc-12345',
    expectedTools: ['read_annotations'],
    maxToolCalls: 1,
    expectedParameters: {
      read_annotations: { document_fingerprint: { document_id: 'doc-12345' } },
    },
  },

  // delete_annotations scenarios
  {
    id: 'delete-specific-annotations',
    description: 'Delete specific annotations',
    query: 'Delete annotations with IDs "ann-1" and "ann-2" from document doc-12345',
    expectedTools: ['delete_annotations'],
    maxToolCalls: 1,
    expectedParameters: {
      delete_annotations: {
        document_fingerprint: { document_id: 'doc-12345' },
        annotation_ids: ['ann-1', 'ann-2'],
      },
    },
  },

  // === REDACTION TOOLS ===

  // create_redaction scenarios
  {
    id: 'create-text-redaction',
    description: 'Create redaction for specific text',
    query:
      'Create a redaction to hide all instances of "confidential information" in document doc-12345',
    expectedTools: ['create_redaction'],
    maxToolCalls: 1,
    expectedParameters: {
      create_redaction: {
        document_fingerprint: { document_id: 'doc-12345' },
        redaction_type: 'text',
        text: 'confidential information',
      },
    },
  },
  {
    id: 'create-regex-redaction',
    description: 'Create regex-based redaction',
    query:
      'Create a redaction using regex pattern "\\d{3}-\\d{2}-\\d{4}" to hide SSNs in document doc-12345',
    expectedTools: ['create_redaction'],
    maxToolCalls: 1,
    expectedParameters: {
      create_redaction: {
        document_fingerprint: { document_id: 'doc-12345' },
        redaction_type: 'regex',
        pattern: '\\d{3}-\\d{2}-\\d{4}',
      },
    },
  },
  {
    id: 'create-preset-redaction-emails',
    description: 'Create preset redaction for email addresses',
    query: 'Create a redaction to hide all email addresses in document doc-12345',
    expectedTools: ['create_redaction'],
    maxToolCalls: 1,
    expectedParameters: {
      create_redaction: {
        document_fingerprint: { document_id: 'doc-12345' },
        redaction_type: 'preset',
        preset: 'email-address',
      },
    },
  },
  {
    id: 'create-preset-redaction-credit-cards',
    description: 'Create preset redaction for credit card numbers',
    query: 'Create a redaction to hide all credit card numbers in document doc-12345',
    expectedTools: ['create_redaction'],
    maxToolCalls: 1,
    expectedParameters: {
      create_redaction: {
        document_fingerprint: { document_id: 'doc-12345' },
        redaction_type: 'preset',
        preset: 'credit-card-number',
      },
    },
  },

  // apply_redactions scenarios
  {
    id: 'apply-redactions',
    description: 'Apply all redactions to document',
    query: 'Apply all pending redactions to document doc-12345',
    expectedTools: ['apply_redactions'],
    maxToolCalls: 1,
    expectedParameters: {
      apply_redactions: { document_fingerprint: { document_id: 'doc-12345' } },
    },
  },

  // === DOCUMENT EDITING TOOLS ===

  // add_watermark scenarios
  {
    id: 'add-text-watermark-center',
    description: 'Add centered text watermark',
    query: 'Add a "DRAFT" watermark in the center of all pages in document doc-12345',
    expectedTools: ['add_watermark'],
    maxToolCalls: 1,
    expectedParameters: {
      add_watermark: {
        document_fingerprint: { document_id: 'doc-12345' },
        watermark_type: 'text',
        content: 'DRAFT',
      },
    },
  },
  {
    id: 'add-watermark-custom-opacity-rotation',
    description: 'Add watermark with custom opacity and rotation',
    query:
      'Add a "CONFIDENTIAL" watermark at the bottom-right with 50% opacity, rotated 45 degrees, and font size 24 in document doc-12345',
    expectedTools: ['add_watermark'],
    maxToolCalls: 1,
    expectedParameters: {
      add_watermark: {
        document_fingerprint: { document_id: 'doc-12345' },
        watermark_type: 'text',
        content: 'CONFIDENTIAL',
        opacity: 0.5,
        rotation: 45,
      },
    },
  },
  {
    id: 'add-image-watermark',
    description: 'Add image watermark',
    query:
      'Add an image watermark using "https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg" at the top-left with 80% opacity in document doc-12345',
    expectedTools: ['add_watermark'],
    maxToolCalls: 1,
    expectedParameters: {
      add_watermark: {
        document_fingerprint: { document_id: 'doc-12345' },
        watermark_type: 'image',
        content: 'https://upload.wikimedia.org/wikipedia/en/a/a9/Example.jpg',
        opacity: 0.8,
      },
    },
  },

  // split_document scenarios
  {
    id: 'split-document-by-pages',
    description: 'Split document by page ranges',
    query: 'Split document doc-12345 at pages 3 and 5 to create separate documents',
    expectedTools: ['split_document'],
    maxToolCalls: 1,
    expectedParameters: {
      split_document: {
        document_fingerprint: { document_id: 'doc-12345' },
        split_points: [2, 4],
      },
    },
  },

  // duplicate_document scenarios
  {
    id: 'duplicate-document',
    description: 'Create a copy of document',
    query: 'Make a copy of document doc-12345',
    expectedTools: ['duplicate_document'],
    maxToolCalls: 1,
    expectedParameters: {
      duplicate_document: { document_fingerprint: { document_id: 'doc-12345' } },
    },
  },

  // === HEALTH CHECK TOOL ===

  {
    id: 'health-check',
    description: 'Check system health',
    query: 'Check if the document engine is working properly',
    expectedTools: ['health_check'],
    maxToolCalls: 1,
  },

  // === MULTI-TOOL WORKFLOWS ===

  {
    id: 'search-then-extract',
    description: 'Find document then extract text',
    query:
      'Find documents with "contract" in the title, then extract text from the first page of the first result',
    expectedTools: ['list_documents', 'extract_text'],
    maxToolCalls: 2,
    expectedParameters: {
      list_documents: { title: 'contract' },
      extract_text: { page_range: { start: 0, end: 0 } },
    },
  },
  {
    id: 'info-then-extract-with-coordinates',
    description: 'Get document info then extract text with coordinates',
    query:
      'First tell me about document doc-12345, then extract text from its first page including coordinate positions',
    expectedTools: ['read_document_info', 'extract_text'],
    maxToolCalls: 2,
    expectedParameters: {
      read_document_info: { document_fingerprint: { document_id: 'doc-12345' } },
      extract_text: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_range: { start: 0, end: 0 },
        include_coordinates: true,
      },
    },
  },
  {
    id: 'annotate-workflow-with-author',
    description: 'Read document then add annotation with author',
    query:
      'Check the details of document doc-12345, then add a note saying "Reviewed" at position (100, 100) with size 200x50 on page 1, authored by "Jane Smith"',
    expectedTools: ['read_document_info', 'add_annotation'],
    maxToolCalls: 2,
    expectedParameters: {
      read_document_info: { document_fingerprint: { document_id: 'doc-12345' } },
      add_annotation: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_number: 0,
        annotation_type: 'note',
        content: 'Reviewed',
        coordinates: { left: 100, top: 100, width: 200, height: 50 },
        author: 'Jane Smith',
      },
    },
  },

  // Redaction workflows
  {
    id: 'redaction-workflow-preset',
    description: 'Create and apply preset redaction',
    query: 'Redact all email addresses in document doc-12345',
    expectedTools: ['create_redaction', 'apply_redactions'],
    maxToolCalls: 2,
    expectedParameters: {
      create_redaction: {
        document_fingerprint: { document_id: 'doc-12345' },
        redaction_type: 'preset',
        preset: 'email-address',
      },
      apply_redactions: { document_fingerprint: { document_id: 'doc-12345' } },
    },
  },
  {
    id: 'complex-redaction-multiple-types',
    description: 'Multiple redaction types',
    query: 'Redact both email addresses and phone numbers in document doc-12345',
    expectedTools: ['create_redaction', 'create_redaction', 'apply_redactions'],
    maxToolCalls: 3,
    allowExtraTools: false,
    expectedParameters: {
      create_redaction: [
        {
          document_fingerprint: { document_id: 'doc-12345' },
          redaction_type: 'preset',
          preset: 'email-address',
        },
        {
          document_fingerprint: { document_id: 'doc-12345' },
          redaction_type: 'preset',
          preset: 'north-american-phone-number',
        },
      ],
      apply_redactions: { document_fingerprint: { document_id: 'doc-12345' } },
    },
  },
  {
    id: 'redaction-regex-workflow',
    description: 'Create regex redaction and apply',
    query:
      'Create a redaction for Social Security Numbers (format XXX-XX-XXXX) in document doc-12345 and apply it',
    expectedTools: ['create_redaction', 'apply_redactions'],
    maxToolCalls: 2,
    expectedParameters: {
      create_redaction: {
        document_fingerprint: { document_id: 'doc-12345' },
        redaction_type: 'regex',
        pattern: '\\d{3}-\\d{2}-\\d{4}',
      },
      apply_redactions: { document_fingerprint: { document_id: 'doc-12345' } },
    },
  },

  // Form workflows
  {
    id: 'form-extract-fill-workflow',
    description: 'Extract then fill form data',
    query:
      'First show me the form fields in document doc-form-123, then fill the "name" field with "John Smith"',
    expectedTools: ['extract_form_data', 'fill_form_fields'],
    maxToolCalls: 2,
    expectedParameters: {
      extract_form_data: { document_fingerprint: { document_id: 'doc-form-123' } },
      fill_form_fields: {
        document_fingerprint: { document_id: 'doc-form-123' },
        field_values: [{ fieldName: 'name', value: 'John Smith' }],
      },
    },
  },
  {
    id: 'form-extract-specific-fill-multiple',
    description: 'Extract specific fields then fill multiple',
    query:
      'Check the current values of "name" and "email" fields in document doc-form-123, then fill "name" with "Alice Johnson" and "email" with "alice@example.com"',
    expectedTools: ['extract_form_data', 'fill_form_fields'],
    maxToolCalls: 2,
    expectedParameters: {
      extract_form_data: {
        document_fingerprint: { document_id: 'doc-form-123' },
        field_names: ['name', 'email'],
      },
      fill_form_fields: {
        document_fingerprint: { document_id: 'doc-form-123' },
        field_values: [
          { fieldName: 'name', value: 'Alice Johnson' },
          { fieldName: 'email', value: 'alice@example.com' },
        ],
      },
    },
  },

  // Document editing workflows
  {
    id: 'duplicate-then-watermark-workflow',
    description: 'Duplicate then modify document',
    query: 'Make a copy of document doc-12345, then add a "DRAFT" watermark to the copy',
    expectedTools: ['duplicate_document', 'add_watermark'],
    maxToolCalls: 2,
    expectedParameters: {
      duplicate_document: { document_fingerprint: { document_id: 'doc-12345' } },
      add_watermark: {
        watermark_type: 'text',
        content: 'DRAFT',
      },
    },
  },
  {
    id: 'search-extract-annotate-workflow',
    description: 'Search, extract, then annotate',
    query:
      'Search for "important" in document doc-12345, extract text from pages where it appears, then add a highlight annotation at (200, 300) with size 150x25 on page 1',
    expectedTools: ['search', 'extract_text', 'add_annotation'],
    maxToolCalls: 3,
    expectedParameters: {
      search: {
        document_fingerprint: { document_id: 'doc-12345' },
        query: 'important',
      },
      add_annotation: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_number: 0,
        annotation_type: 'highlight',
        content: '',
        coordinates: { left: 200, top: 300, width: 150, height: 25 },
      },
    },
  },

  // === EFFICIENCY TESTS (should NOT require multiple tools) ===

  {
    id: 'efficiency-single-extract',
    description: 'Extract text efficiently',
    query: 'Get the text content from document doc-12345',
    expectedTools: ['extract_text'],
    maxToolCalls: 1, // Should NOT call read_document_info first
    expectedParameters: {
      extract_text: { document_fingerprint: { document_id: 'doc-12345' } },
    },
  },
  {
    id: 'efficiency-direct-annotation',
    description: 'Add annotation directly',
    query:
      'Add a highlight annotation at coordinates (100, 200) with size 150x30 on page 1 of document doc-12345',
    expectedTools: ['add_annotation'],
    maxToolCalls: 1, // Should NOT call read_document_info first
    expectedParameters: {
      add_annotation: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_number: 0,
        annotation_type: 'highlight',
        content: '',
        coordinates: { left: 100, top: 200, width: 150, height: 30 },
      },
    },
  },
  {
    id: 'efficiency-direct-search',
    description: 'Search directly without document info',
    query: 'Find all instances of "contract" in document doc-12345',
    expectedTools: ['search'],
    maxToolCalls: 1, // Should NOT call read_document_info first
    expectedParameters: {
      search: {
        document_fingerprint: { document_id: 'doc-12345' },
        query: 'contract',
      },
    },
  },

  // === ORDER SENSITIVITY TESTS ===

  {
    id: 'order-create-before-apply',
    description: 'Create redaction before applying',
    query: 'Apply email redactions to document doc-12345',
    expectedTools: ['create_redaction', 'apply_redactions'],
    maxToolCalls: 2,
    allowExtraTools: false, // Order matters - must create before apply
    expectedParameters: {
      create_redaction: {
        document_fingerprint: { document_id: 'doc-12345' },
        redaction_type: 'preset',
        preset: 'email-address',
      },
      apply_redactions: { document_fingerprint: { document_id: 'doc-12345' } },
    },
  },
  {
    id: 'order-search-before-extract',
    description: 'Search before extracting',
    query: 'Find the contract document and extract its summary section',
    expectedTools: ['list_documents', 'extract_text'],
    maxToolCalls: 2,
    allowExtraTools: false, // Must search first to know which document
    expectedParameters: {
      list_documents: { title: 'contract' },
    },
  },
  {
    id: 'order-extract-form-before-fill',
    description: 'Extract form data before filling',
    query: 'Update the form in document doc-form-123 by changing the name field to "Bob Wilson"',
    expectedTools: ['extract_form_data', 'fill_form_fields'],
    maxToolCalls: 2,
    expectedParameters: {
      extract_form_data: { document_fingerprint: { document_id: 'doc-form-123' } },
      fill_form_fields: {
        document_fingerprint: { document_id: 'doc-form-123' },
        field_values: [{ fieldName: 'name', value: 'Bob Wilson' }],
      },
    },
  },

  // === PARAMETER EDGE CASES ===

  {
    id: 'edge-case-zero-based-pages',
    description: 'Test zero-based page indexing understanding',
    query: 'Extract text from the very first page of document doc-12345',
    expectedTools: ['extract_text'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_text: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_range: { start: 0, end: 0 },
      },
    },
  },
  {
    id: 'edge-case-page-range-conversion',
    description: 'Test human-friendly to zero-based page conversion',
    query: 'Search for "summary" in pages 2 through 5 of document doc-12345',
    expectedTools: ['search'],
    maxToolCalls: 1,
    expectedParameters: {
      search: {
        document_fingerprint: { document_id: 'doc-12345' },
        query: 'summary',
        start_page: 1,
        end_page: 4,
      },
    },
  },
  {
    id: 'edge-case-boolean-parameters',
    description: 'Test boolean parameter extraction',
    query:
      'Extract text from document doc-12345 with OCR enabled but without coordinate information',
    expectedTools: ['extract_text'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_text: {
        document_fingerprint: { document_id: 'doc-12345' },
        ocr_enabled: true,
        include_coordinates: false,
      },
    },
  },
  {
    id: 'edge-case-numeric-parameters',
    description: 'Test numeric parameter extraction',
    query:
      'Add a "CONFIDENTIAL" watermark with 25% opacity, rotated 90 degrees counterclockwise, using font size 18 in document doc-12345',
    expectedTools: ['add_watermark'],
    maxToolCalls: 1,
    expectedParameters: {
      add_watermark: {
        document_fingerprint: { document_id: 'doc-12345' },
        watermark_type: 'text',
        content: 'CONFIDENTIAL',
        opacity: 0.25,
        rotation: 90,
      },
    },
  },
  {
    id: 'edge-case-array-parameters',
    description: 'Test array parameter extraction',
    query:
      'Get only the "firstName", "lastName", and "dateOfBirth" fields from document doc-form-123',
    expectedTools: ['extract_form_data'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_form_data: {
        document_fingerprint: { document_id: 'doc-form-123' },
        field_names: ['firstName', 'lastName', 'dateOfBirth'],
      },
    },
  },

  // === EXTRACT KEY-VALUE PAIRS TOOL SCENARIOS ===

  {
    id: 'extract-kvp-full-document',
    description: 'Extract key-value pairs from entire document',
    query: 'Extract all key-value pairs from document doc-form-123',
    expectedTools: ['extract_key_value_pairs'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_key_value_pairs: { document_fingerprint: { document_id: 'doc-form-123' } },
    },
  },
  {
    id: 'extract-kvp-page-range',
    description: 'Extract key-value pairs from specific pages',
    query: 'Extract key-value pairs from page 1 of document doc-form-123',
    expectedTools: ['extract_key_value_pairs'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_key_value_pairs: {
        document_fingerprint: { document_id: 'doc-form-123' },
        page_range: { start: 0, end: 0 },
      },
    },
  },

  // === PAGE MANIPULATION TOOL SCENARIOS ===

  // add_new_page scenarios
  {
    id: 'add-page-default',
    description: 'Add page with default settings',
    query: 'Add a new blank page to document doc-12345',
    expectedTools: ['add_new_page'],
    maxToolCalls: 1,
    expectedParameters: {
      add_new_page: { document_fingerprint: { document_id: 'doc-12345' } },
    },
  },
  {
    id: 'add-page-with-size-orientation',
    description: 'Add page with specific size and orientation',
    query: 'Add a new A3 landscape page to document doc-12345',
    expectedTools: ['add_new_page'],
    maxToolCalls: 1,
    expectedParameters: {
      add_new_page: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_size: 'A3',
        orientation: 'landscape',
      },
    },
  },
  {
    id: 'add-multiple-pages',
    description: 'Add multiple pages at once',
    query: 'Add 3 new Letter size portrait pages to document doc-12345',
    expectedTools: ['add_new_page'],
    maxToolCalls: 1,
    expectedParameters: {
      add_new_page: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_size: 'Letter',
        orientation: 'portrait',
        count: 3,
      },
    },
  },
  {
    id: 'add-page-at-position',
    description: 'Add page at specific position',
    query: 'Insert a new A4 page at position 0 (beginning) of document doc-12345',
    expectedTools: ['add_new_page'],
    maxToolCalls: 1,
    expectedParameters: {
      add_new_page: {
        document_fingerprint: { document_id: 'doc-12345' },
        position: 0,
        page_size: 'A4',
      },
    },
  },
  {
    id: 'add-page-middle-position',
    description: 'Add page in middle of document',
    query: 'Insert 2 Legal size pages at position 5 in document doc-12345',
    expectedTools: ['add_new_page'],
    maxToolCalls: 1,
    expectedParameters: {
      add_new_page: {
        document_fingerprint: { document_id: 'doc-12345' },
        position: 5,
        page_size: 'Legal',
        count: 2,
      },
    },
  },

  // rotate_pages scenarios
  {
    id: 'rotate-single-page',
    description: 'Rotate single page',
    query: 'Rotate page 0 of document doc-12345 by 90 degrees clockwise',
    expectedTools: ['rotate_pages'],
    maxToolCalls: 1,
    expectedParameters: {
      rotate_pages: {
        document_fingerprint: { document_id: 'doc-12345' },
        pages: [0],
        rotation: 90,
      },
    },
  },
  {
    id: 'rotate-multiple-pages',
    description: 'Rotate multiple pages',
    query: 'Rotate pages 1, 3, and 5 of document doc-12345 by 180 degrees',
    expectedTools: ['rotate_pages'],
    maxToolCalls: 1,
    expectedParameters: {
      rotate_pages: {
        document_fingerprint: { document_id: 'doc-12345' },
        pages: [1, 3, 5],
        rotation: 180,
      },
    },
  },
  {
    id: 'rotate-pages-counterclockwise',
    description: 'Rotate pages counter-clockwise',
    query: 'Rotate the first 3 pages of document doc-12345 counter-clockwise by 270 degrees',
    expectedTools: ['rotate_pages'],
    maxToolCalls: 1,
    expectedParameters: {
      rotate_pages: {
        document_fingerprint: { document_id: 'doc-12345' },
        pages: [0, 1, 2],
        rotation: 270,
      },
    },
  },

  // merge_document_pages scenarios
  {
    id: 'merge-full-documents',
    description: 'Merge complete documents',
    query: 'Merge documents doc-111 and doc-222 into a single document',
    expectedTools: ['merge_document_pages'],
    maxToolCalls: 1,
    expectedParameters: {
      merge_document_pages: {
        parts: [
          { document_fingerprint: { document_id: 'doc-111' } },
          { document_fingerprint: { document_id: 'doc-222' } },
        ],
      },
    },
  },
  {
    id: 'merge-with-page-ranges',
    description: 'Merge documents with specific page ranges',
    query: 'Merge pages 0-2 from doc-111 with pages 5-7 from doc-222',
    expectedTools: ['merge_document_pages'],
    maxToolCalls: 1,
    expectedParameters: {
      merge_document_pages: {
        parts: [
          { document_fingerprint: { document_id: 'doc-111' }, page_range: { start: 0, end: 2 } },
          { document_fingerprint: { document_id: 'doc-222' }, page_range: { start: 5, end: 7 } },
        ],
      },
    },
  },
  {
    id: 'merge-with-title',
    description: 'Merge documents with custom title',
    query: 'Merge doc-111 and doc-222 into a document titled "Combined Report"',
    expectedTools: ['merge_document_pages'],
    maxToolCalls: 1,
    expectedParameters: {
      merge_document_pages: {
        parts: [
          { document_fingerprint: { document_id: 'doc-111' } },
          { document_fingerprint: { document_id: 'doc-222' } },
        ],
        title: 'Combined Report',
      },
    },
  },
  {
    id: 'merge-complex-ranges',
    description: 'Merge with complex page ranges',
    query:
      'Create a document combining the first 5 pages of doc-111, all pages from doc-222 titled "Master Document"',
    expectedTools: ['merge_document_pages'],
    maxToolCalls: 1,
    expectedParameters: {
      merge_document_pages: {
        parts: [
          { document_fingerprint: { document_id: 'doc-111' }, page_range: { end: 4 } },
          { document_fingerprint: { document_id: 'doc-222' } },
        ],
        title: 'Master Document',
      },
    },
  },

  // === ENHANCED PARAMETER COVERAGE FOR EXISTING TOOLS ===

  // More list_documents variations
  {
    id: 'list-by-created-date',
    description: 'List documents by creation date',
    query: 'Show me the 15 most recently created documents',
    expectedTools: ['list_documents'],
    maxToolCalls: 1,
    expectedParameters: {
      list_documents: { limit: 15, sort_by: 'created_at', sort_order: 'desc' },
    },
  },
  {
    id: 'list-with-offset',
    description: 'List documents with pagination offset',
    query: 'Show me documents 20-30 sorted by title',
    expectedTools: ['list_documents'],
    maxToolCalls: 1,
    expectedParameters: {
      list_documents: { limit: 10, offset: 19, sort_by: 'title', sort_order: 'asc' },
    },
  },
  {
    id: 'list-with-multiple-filters',
    description: 'List with multiple filters',
    query:
      'Find the first 8 documents with "invoice" in the title, sorted by most recently updated, and tell me how many more exist',
    expectedTools: ['list_documents'],
    maxToolCalls: 1,
    expectedParameters: {
      list_documents: {
        limit: 8,
        title: 'invoice',
        sort_by: 'updated_at',
        sort_order: 'desc',
        count_remaining: true,
      },
    },
  },

  // More search variations
  {
    id: 'search-with-end-page',
    description: 'Search with page range',
    query: 'Find "payment" in the first 5 pages of document doc-12345',
    expectedTools: ['search'],
    maxToolCalls: 1,
    expectedParameters: {
      search: {
        document_fingerprint: { document_id: 'doc-12345' },
        query: 'payment',
        end_page: 4,
      },
    },
  },
  {
    id: 'search-case-insensitive',
    description: 'Case insensitive search',
    query: 'Search for "CONTRACT" in document doc-12345, ignoring case',
    expectedTools: ['search'],
    maxToolCalls: 1,
    expectedParameters: {
      search: {
        document_fingerprint: { document_id: 'doc-12345' },
        query: 'CONTRACT',
        case_sensitive: false,
      },
    },
  },
  {
    id: 'search-preset-ssn',
    description: 'Search using SSN preset',
    query: 'Find all Social Security Numbers in document doc-12345',
    expectedTools: ['search'],
    maxToolCalls: 1,
    expectedParameters: {
      search: {
        document_fingerprint: { document_id: 'doc-12345' },
        query: 'social-security-number',
        search_type: 'preset',
      },
    },
  },
  {
    id: 'search-preset-credit-card',
    description: 'Search using credit card preset',
    query: 'Find all credit card numbers in document doc-12345',
    expectedTools: ['search'],
    maxToolCalls: 1,
    expectedParameters: {
      search: {
        document_fingerprint: { document_id: 'doc-12345' },
        query: 'credit-card-number',
        search_type: 'preset',
      },
    },
  },

  // More extract_text variations
  {
    id: 'extract-text-single-page',
    description: 'Extract text from single specific page',
    query: 'Extract text from just page 5 of document doc-12345',
    expectedTools: ['extract_text'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_text: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_range: { start: 4, end: 4 },
      },
    },
  },
  {
    id: 'extract-text-with-all-options',
    description: 'Extract text with all advanced options',
    query:
      'Extract text from pages 1-10 of document doc-12345 with OCR enabled and include coordinates',
    expectedTools: ['extract_text'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_text: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_range: { start: 0, end: 9 },
        ocr_enabled: true,
        include_coordinates: true,
      },
    },
  },
  {
    id: 'extract-text-from-page-onwards',
    description: 'Extract text from specific page onwards',
    query: 'Extract text from page 8 to the end of document doc-12345',
    expectedTools: ['extract_text'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_text: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_range: { start: 7 },
      },
    },
  },

  // More watermark variations
  {
    id: 'watermark-all-positions',
    description: 'Test watermark positions',
    query: 'Add a "SAMPLE" watermark at the top-left with 60% opacity in document doc-12345',
    expectedTools: ['add_watermark'],
    maxToolCalls: 1,
    expectedParameters: {
      add_watermark: {
        document_fingerprint: { document_id: 'doc-12345' },
        watermark_type: 'text',
        content: 'SAMPLE',
        opacity: 0.6,
      },
    },
  },
  {
    id: 'watermark-with-font-and-rotation',
    description: 'Watermark with font and rotation options',
    query:
      'Add an "URGENT" watermark with font size 36, 70% opacity, rotated 315 degrees at the center of document doc-12345',
    expectedTools: ['add_watermark'],
    maxToolCalls: 1,
    expectedParameters: {
      add_watermark: {
        document_fingerprint: { document_id: 'doc-12345' },
        watermark_type: 'text',
        content: 'URGENT',
        opacity: 0.7,
        rotation: 315,
      },
    },
  },

  // More annotation variations
  {
    id: 'add-annotation-highlight-type',
    description: 'Add highlight annotation',
    query:
      'Add a highlight annotation at (100, 100) with size 200x150 on page 2 of document doc-12345',
    expectedTools: ['add_annotation'],
    maxToolCalls: 1,
    expectedParameters: {
      add_annotation: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_number: 1,
        annotation_type: 'highlight',
        content: '',
        coordinates: { left: 100, top: 100, width: 200, height: 150 },
      },
    },
  },
  {
    id: 'add-annotation-with-metadata',
    description: 'Add annotation with author',
    query:
      'Add a note saying "Check this calculation" at (50, 400) with size 180x60 on page 1 of document doc-12345, authored by "Alice Smith"',
    expectedTools: ['add_annotation'],
    maxToolCalls: 1,
    expectedParameters: {
      add_annotation: {
        document_fingerprint: { document_id: 'doc-12345' },
        page_number: 0,
        annotation_type: 'note',
        content: 'Check this calculation',
        coordinates: { left: 50, top: 400, width: 180, height: 60 },
        author: 'Alice Smith',
      },
    },
  },

  // More form field variations
  {
    id: 'fill-form-mixed-types',
    description: 'Fill form with mixed field types',
    query:
      'Fill the form in document doc-form-123: set "fullName" to "Robert Johnson", "isEmployed" to true, "salary" to 75000, and "startDate" to "2024-01-15"',
    expectedTools: ['fill_form_fields'],
    maxToolCalls: 1,
    expectedParameters: {
      fill_form_fields: {
        document_fingerprint: { document_id: 'doc-form-123' },
        field_values: [
          { fieldName: 'fullName', value: 'Robert Johnson' },
          { fieldName: 'isEmployed', value: true },
          { fieldName: 'salary', value: 75000 },
          { fieldName: 'startDate', value: '2024-01-15' },
        ],
      },
    },
  },
  {
    id: 'extract-form-with-empty',
    description: 'Extract form data including empty fields',
    query: 'Get all form fields from document doc-form-123 including empty ones',
    expectedTools: ['extract_form_data'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_form_data: {
        document_fingerprint: { document_id: 'doc-form-123' },
        include_empty_fields: true,
      },
    },
  },

  // === COMPLEX WORKFLOW SCENARIOS ===

  {
    id: 'complex-document-processing',
    description: 'Complex multi-step document processing',
    query:
      'Find documents with "financial" in the title, extract text from the first result, then create redactions for all SSNs and apply them',
    expectedTools: ['list_documents', 'extract_text', 'create_redaction', 'apply_redactions'],
    maxToolCalls: 4,
    expectedParameters: {
      list_documents: { title: 'financial' },
      create_redaction: {
        redaction_type: 'preset',
        preset: 'social-security-number',
      },
    },
  },
  {
    id: 'document-analysis-workflow',
    description: 'Comprehensive document analysis',
    query:
      'Analyze document doc-report-456: extract key-value pairs, search for "revenue", extract all tables, then add a summary annotation',
    expectedTools: ['extract_key_value_pairs', 'search', 'extract_tables', 'add_annotation'],
    maxToolCalls: 4,
    expectedParameters: {
      extract_key_value_pairs: { document_fingerprint: { document_id: 'doc-report-456' } },
      search: {
        document_fingerprint: { document_id: 'doc-report-456' },
        query: 'revenue',
      },
      extract_tables: { document_fingerprint: { document_id: 'doc-report-456' } },
      add_annotation: {
        document_fingerprint: { document_id: 'doc-report-456' },
        annotation_type: 'note',
      },
    },
  },
  {
    id: 'document-restructuring-workflow',
    description: 'Document restructuring with page operations',
    query:
      'Duplicate document doc-12345, add 2 new pages at the beginning, rotate the last 3 pages 180 degrees, then add a "MODIFIED" watermark',
    expectedTools: ['duplicate_document', 'add_new_page', 'rotate_pages', 'add_watermark'],
    maxToolCalls: 4,
    expectedParameters: {
      duplicate_document: { document_fingerprint: { document_id: 'doc-12345' } },
      add_new_page: {
        position: 0,
        count: 2,
      },
      rotate_pages: {
        rotation: 180,
      },
      add_watermark: {
        watermark_type: 'text',
        content: 'MODIFIED',
      },
    },
  },

  // === LAYER SUPPORT EVALUATION SCENARIOS ===
  // Note: All layers used in these scenarios are automatically created during test setup
  // in evaluation/runner.ts uploadTestDocuments() function

  // Document Discovery with Layers
  {
    id: 'layer-read-document-info',
    description: 'Read document info from specific layer',
    query: 'Get information about document doc-12345 from the "review-layer" layer',
    expectedTools: ['read_document_info'],
    maxToolCalls: 1,
    expectedParameters: {
      read_document_info: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'review-layer',
        },
        include_metadata: true,
      },
    },
  },

  // Text Extraction with Layers
  {
    id: 'layer-extract-text-basic',
    description: 'Extract text from specific layer',
    query: 'Extract text from document doc-12345 in the "annotation-layer" layer',
    expectedTools: ['extract_text'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_text: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'annotation-layer',
        },
      },
    },
  },
  {
    id: 'layer-extract-text-with-coordinates',
    description: 'Extract text from layer with coordinates',
    query:
      'Extract text from document doc-12345 layer "edit-layer" with coordinate information included',
    expectedTools: ['extract_text'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_text: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'edit-layer',
        },
        include_coordinates: true,
      },
    },
  },
  {
    id: 'layer-extract-text-page-range-ocr',
    description: 'Extract text from layer with page range and OCR',
    query: 'Extract text from pages 2-4 of document doc-12345 in layer "ocr-layer" using OCR',
    expectedTools: ['extract_text'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_text: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'ocr-layer',
        },
        page_range: { start: 1, end: 3 },
        ocr_enabled: true,
      },
    },
  },

  // Form Data Extraction with Layers
  {
    id: 'layer-extract-form-data',
    description: 'Extract form data from specific layer',
    query: 'Get form field values from document doc-form-123 in the "completed-layer" layer',
    expectedTools: ['extract_form_data'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_form_data: {
        document_fingerprint: {
          document_id: 'doc-form-123',
          layer: 'completed-layer',
        },
      },
    },
  },
  {
    id: 'layer-extract-specific-form-fields',
    description: 'Extract specific form fields from layer',
    query:
      'Get the "name", "email", and "signature" fields from document doc-form-123 in layer "final-layer"',
    expectedTools: ['extract_form_data'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_form_data: {
        document_fingerprint: {
          document_id: 'doc-form-123',
          layer: 'final-layer',
        },
        field_names: ['name', 'email', 'signature'],
      },
    },
  },

  // Form Field Filling with Layers
  {
    id: 'layer-fill-form-fields',
    description: 'Fill form fields in specific layer',
    query:
      'Fill the "approvedBy" field with "John Manager" in document doc-form-123 layer "approval-layer"',
    expectedTools: ['fill_form_fields'],
    maxToolCalls: 1,
    expectedParameters: {
      fill_form_fields: {
        document_fingerprint: {
          document_id: 'doc-form-123',
          layer: 'approval-layer',
        },
        field_values: [{ fieldName: 'approvedBy', value: 'John Manager' }],
      },
    },
  },

  // Annotation Operations with Layers
  {
    id: 'layer-add-annotation',
    description: 'Add annotation to specific layer',
    query:
      'Add a note saying "Reviewed and approved" at coordinates (200, 300) with size 180x50 on page 1 of document doc-12345 in layer "review-layer"',
    expectedTools: ['add_annotation'],
    maxToolCalls: 1,
    expectedParameters: {
      add_annotation: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'review-layer',
        },
        page_number: 0,
        annotation_type: 'note',
        content: 'Reviewed and approved',
        coordinates: { left: 200, top: 300, width: 180, height: 50 },
      },
    },
  },
  {
    id: 'layer-add-highlight-with-author',
    description: 'Add highlight annotation to layer with author',
    query:
      'Highlight text at position (100, 150) with size 250x25 on page 2 of document doc-12345 in layer "markup-layer", authored by "Jane Reviewer"',
    expectedTools: ['add_annotation'],
    maxToolCalls: 1,
    expectedParameters: {
      add_annotation: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'markup-layer',
        },
        page_number: 1,
        annotation_type: 'highlight',
        content: '',
        coordinates: { left: 100, top: 150, width: 250, height: 25 },
        author: 'Jane Reviewer',
      },
    },
  },
  {
    id: 'layer-read-annotations',
    description: 'Read annotations from specific layer',
    query: 'Show me all annotations in document doc-12345 from the "comments-layer" layer',
    expectedTools: ['read_annotations'],
    maxToolCalls: 1,
    expectedParameters: {
      read_annotations: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'comments-layer',
        },
      },
    },
  },
  {
    id: 'layer-delete-annotations',
    description: 'Delete annotations from specific layer',
    query:
      'Delete annotations with IDs "ann-layer-1" and "ann-layer-2" from document doc-12345 in layer "temp-layer"',
    expectedTools: ['delete_annotations'],
    maxToolCalls: 1,
    expectedParameters: {
      delete_annotations: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'temp-layer',
        },
        annotation_ids: ['ann-layer-1', 'ann-layer-2'],
      },
    },
  },

  // Redaction Operations with Layers
  {
    id: 'layer-create-redaction',
    description: 'Create redaction in specific layer',
    query:
      'Create a redaction to hide all email addresses in document doc-12345 layer "redaction-layer"',
    expectedTools: ['create_redaction'],
    maxToolCalls: 1,
    expectedParameters: {
      create_redaction: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'redaction-layer',
        },
        redaction_type: 'preset',
        preset: 'email-address',
      },
    },
  },
  {
    id: 'layer-create-regex-redaction',
    description: 'Create regex redaction in layer',
    query:
      'Create a redaction using pattern "\\d{3}-\\d{2}-\\d{4}" for SSNs in document doc-12345 layer "privacy-layer"',
    expectedTools: ['create_redaction'],
    maxToolCalls: 1,
    expectedParameters: {
      create_redaction: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'privacy-layer',
        },
        redaction_type: 'regex',
        pattern: '\\d{3}-\\d{2}-\\d{4}',
      },
    },
  },
  {
    id: 'layer-apply-redactions',
    description: 'Apply redactions in specific layer',
    query: 'Apply all pending redactions in document doc-12345 layer "final-redaction-layer"',
    expectedTools: ['apply_redactions'],
    maxToolCalls: 1,
    expectedParameters: {
      apply_redactions: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'final-redaction-layer',
        },
      },
    },
  },

  // Document Editing with Layers
  {
    id: 'layer-add-watermark',
    description: 'Add watermark to specific layer',
    query:
      'Add a "REVIEWED" watermark with 50% opacity in document doc-12345 layer "watermark-layer"',
    expectedTools: ['add_watermark'],
    maxToolCalls: 1,
    expectedParameters: {
      add_watermark: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'watermark-layer',
        },
        watermark_type: 'text',
        content: 'REVIEWED',
        opacity: 0.5,
      },
    },
  },
  {
    id: 'layer-rotate-pages',
    description: 'Rotate pages in specific layer',
    query: 'Rotate pages 1 and 3 by 90 degrees in document doc-12345 layer "rotation-layer"',
    expectedTools: ['rotate_pages'],
    maxToolCalls: 1,
    expectedParameters: {
      rotate_pages: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'rotation-layer',
        },
        pages: [1, 3],
        rotation: 90,
      },
    },
  },
  {
    id: 'layer-add-new-page',
    description: 'Add new page to specific layer',
    query: 'Add a new A4 page at position 2 in document doc-12345 layer "additional-pages-layer"',
    expectedTools: ['add_new_page'],
    maxToolCalls: 1,
    expectedParameters: {
      add_new_page: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'additional-pages-layer',
        },
        position: 2,
        page_size: 'A4',
      },
    },
  },
  {
    id: 'layer-split-document',
    description: 'Split document in specific layer',
    query: 'Split document doc-12345 at page 5 in layer "split-layer"',
    expectedTools: ['split_document'],
    maxToolCalls: 1,
    expectedParameters: {
      split_document: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'split-layer',
        },
        split_points: [4],
      },
    },
  },
  {
    id: 'layer-duplicate-document',
    description: 'Duplicate document from specific layer',
    query: 'Create a copy of document doc-12345 from layer "approved-layer"',
    expectedTools: ['duplicate_document'],
    maxToolCalls: 1,
    expectedParameters: {
      duplicate_document: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'approved-layer',
        },
      },
    },
  },

  // Extraction Tools with Layers
  {
    id: 'layer-extract-tables',
    description: 'Extract tables from specific layer',
    query: 'Extract all tables from document doc-12345 in layer "data-layer"',
    expectedTools: ['extract_tables'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_tables: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'data-layer',
        },
      },
    },
  },
  {
    id: 'layer-extract-tables-page-range',
    description: 'Extract tables from layer with page range',
    query: 'Extract tables from pages 2-4 of document doc-12345 in layer "analysis-layer"',
    expectedTools: ['extract_tables'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_tables: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'analysis-layer',
        },
        page_range: { start: 1, end: 3 },
      },
    },
  },
  {
    id: 'layer-extract-key-value-pairs',
    description: 'Extract key-value pairs from specific layer',
    query: 'Extract key-value pairs from document doc-12345 in layer "metadata-layer"',
    expectedTools: ['extract_key_value_pairs'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_key_value_pairs: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'metadata-layer',
        },
      },
    },
  },
  {
    id: 'layer-search-document',
    description: 'Search document in specific layer',
    query: 'Search for "confidential" in document doc-12345 layer "search-layer"',
    expectedTools: ['search'],
    maxToolCalls: 1,
    expectedParameters: {
      search: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'search-layer',
        },
        query: 'confidential',
      },
    },
  },
  {
    id: 'layer-search-with-options',
    description: 'Search layer with advanced options',
    query:
      'Search for "payment" in pages 3-5 of document doc-12345 layer "finance-layer" including annotations',
    expectedTools: ['search'],
    maxToolCalls: 1,
    expectedParameters: {
      search: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'finance-layer',
        },
        query: 'payment',
        start_page: 2,
        end_page: 4,
        include_annotations: true,
      },
    },
  },
  {
    id: 'layer-render-document-page',
    description: 'Render document page from specific layer',
    query:
      'Show me page 1 of document doc-12345 from layer "final-layer" as an image with width 800 pixels',
    expectedTools: ['render_document_page'],
    maxToolCalls: 1,
    expectedParameters: {
      render_document_page: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'final-layer',
        },
        pages: [0],
        width: 800,
      },
    },
  },

  // Page Merging with Layers
  {
    id: 'layer-merge-document-pages',
    description: 'Merge documents with layer sources',
    query:
      'Merge pages 1-3 from doc-111 layer "review-layer" with pages 5-7 from doc-222 layer "final-layer"',
    expectedTools: ['merge_document_pages'],
    maxToolCalls: 1,
    expectedParameters: {
      merge_document_pages: {
        parts: [
          {
            document_fingerprint: {
              document_id: 'doc-111',
              layer: 'review-layer',
            },
            page_range: { start: 0, end: 2 },
          },
          {
            document_fingerprint: {
              document_id: 'doc-222',
              layer: 'final-layer',
            },
            page_range: { start: 4, end: 6 },
          },
        ],
      },
    },
  },

  // === LAYER WORKFLOW SCENARIOS ===

  {
    id: 'layer-workflow-review-process',
    description: 'Complete layer-based review workflow',
    query:
      'Read document info from doc-12345 layer "draft-layer", extract text from page 1, then add a review note at (100, 200) saying "Looks good" in layer "review-layer"',
    expectedTools: ['read_document_info', 'extract_text', 'add_annotation'],
    maxToolCalls: 3,
    expectedParameters: {
      read_document_info: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'draft-layer',
        },
      },
      extract_text: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'draft-layer',
        },
        page_range: { start: 0, end: 0 },
      },
      add_annotation: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'review-layer',
        },
        page_number: 0,
        annotation_type: 'note',
        content: 'Looks good',
        coordinates: { left: 100, top: 200, width: 150, height: 50 },
      },
    },
  },
  {
    id: 'layer-workflow-redaction-process',
    description: 'Layer-based redaction workflow',
    query:
      'Search for email addresses in doc-12345 layer "original-layer", create redactions for them in layer "redaction-layer", then apply the redactions',
    expectedTools: ['search', 'create_redaction', 'apply_redactions'],
    maxToolCalls: 3,
    expectedParameters: {
      search: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'original-layer',
        },
        query: 'email-address',
        search_type: 'preset',
      },
      create_redaction: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'redaction-layer',
        },
        redaction_type: 'preset',
        preset: 'email-address',
      },
      apply_redactions: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'redaction-layer',
        },
      },
    },
  },
  {
    id: 'layer-workflow-form-completion',
    description: 'Layer-based form completion workflow',
    query:
      'Extract form data from doc-form-123 layer "template-layer", then fill the "signature" field with "Digital Signature" and "date" with "2024-01-15" in layer "completed-layer"',
    expectedTools: ['extract_form_data', 'fill_form_fields'],
    maxToolCalls: 2,
    expectedParameters: {
      extract_form_data: {
        document_fingerprint: {
          document_id: 'doc-form-123',
          layer: 'template-layer',
        },
      },
      fill_form_fields: {
        document_fingerprint: {
          document_id: 'doc-form-123',
          layer: 'completed-layer',
        },
        field_values: [
          { fieldName: 'signature', value: 'Digital Signature' },
          { fieldName: 'date', value: '2024-01-15' },
        ],
      },
    },
  },
  {
    id: 'layer-workflow-document-preparation',
    description: 'Complex layer-based document preparation',
    query:
      'Duplicate document doc-12345 from layer "draft-layer", add a watermark saying "FINAL" in the copy, then extract key-value pairs from the watermarked version',
    expectedTools: ['duplicate_document', 'add_watermark', 'extract_key_value_pairs'],
    maxToolCalls: 3,
    expectedParameters: {
      duplicate_document: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'draft-layer',
        },
      },
      add_watermark: {
        watermark_type: 'text',
        content: 'FINAL',
      },
      extract_key_value_pairs: {
        // Document ID will be from the duplicate result
      },
    },
  },

  // === LAYER ISOLATION AND COMPARISON SCENARIOS ===

  {
    id: 'layer-comparison-annotations',
    description: 'Compare annotations between layers',
    query:
      'Show me annotations from both "reviewer-1-layer" and "reviewer-2-layer" in document doc-12345',
    expectedTools: ['read_annotations', 'read_annotations'],
    maxToolCalls: 2,
    expectedParameters: {
      read_annotations: [
        {
          document_fingerprint: {
            document_id: 'doc-12345',
            layer: 'reviewer-1-layer',
          },
        },
        {
          document_fingerprint: {
            document_id: 'doc-12345',
            layer: 'reviewer-2-layer',
          },
        },
      ],
    },
  },
  {
    id: 'layer-comparison-text-extraction',
    description: 'Compare text between base document and layer',
    query:
      'Extract text from page 1 of document doc-12345 from both the base document and the "edited-layer" layer',
    expectedTools: ['extract_text', 'extract_text'],
    maxToolCalls: 2,
    expectedParameters: {
      extract_text: [
        {
          document_fingerprint: {
            document_id: 'doc-12345',
          },
          page_range: { start: 0, end: 0 },
        },
        {
          document_fingerprint: {
            document_id: 'doc-12345',
            layer: 'edited-layer',
          },
          page_range: { start: 0, end: 0 },
        },
      ],
    },
  },

  // === LAYER ERROR HANDLING SCENARIOS ===

  {
    id: 'layer-error-invalid-layer-name',
    description: 'Handle invalid layer name gracefully',
    query: 'Extract text from document doc-12345 in layer "non-existent-layer"',
    expectedTools: ['extract_text'],
    maxToolCalls: 1,
    expectedParameters: {
      extract_text: {
        document_fingerprint: {
          document_id: 'doc-12345',
          layer: 'non-existent-layer',
        },
      },
    },
  },
  {
    id: 'layer-error-invalid-document-with-layer',
    description: 'Handle invalid document ID with layer',
    query: 'Read document info from invalid-doc-id in layer "test-layer"',
    expectedTools: ['read_document_info'],
    maxToolCalls: 1,
    expectedParameters: {
      read_document_info: {
        document_fingerprint: {
          document_id: 'invalid-doc-id',
          layer: 'test-layer',
        },
      },
    },
  },
];
