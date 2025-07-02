import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import dotenv from 'dotenv';
import { DocumentEngineClient } from '../../src/api/Client.js';
import { getDocumentEngineClient } from '../../src/api/ClientFactory.js';
import { listDocuments } from '../../src/tools/discovery/listDocuments.js';
import { readDocumentInfo } from '../../src/tools/discovery/readDocumentInfo.js';
import { extractText } from '../../src/tools/extraction/extractText.js';
import { extractFormData } from '../../src/tools/forms/extractFormData.js';
import { rotatePages } from '../../src/tools/document-editing/rotatePages.js';
import { addAnnotation } from '../../src/tools/annotations/addAnnotation.js';
import { readAnnotations } from '../../src/tools/annotations/readAnnotations.js';
import { renderDocumentPage } from '../../src/tools/extraction/renderDocumentPage.js';
import { search } from '../../src/tools/extraction/search.js';
import { extractTables } from '../../src/tools/extraction/extractTables.js';
import { extractKeyValuePairs } from '../../src/tools/extraction/extractKeyValuePairs.js';
import { deleteTestDocument, uploadTestDocument } from '../helpers/documentHelpers.js';
import { createDocumentLayer } from '../../src/api/DocumentLayerAbstraction.js';
import path from 'path';

dotenv.config();

/**
 * Layer Integration Tests for Nutrient Document Engine MCP Server
 *
 * These tests verify that layer functionality works correctly across all tools.
 * They require a running Document Engine instance with layer support.
 *
 * Setup is the same as regular integration tests:
 * 1. Copy .env.example to .env
 * 2. Edit .env with your Document Engine credentials
 * 3. Run: pnpm test test/integration/layers.test.ts
 */

// Skip integration tests if environment variables are not set
const skipIntegrationTests =
  !process.env.DOCUMENT_ENGINE_BASE_URL || !process.env.DOCUMENT_ENGINE_AUTH_TOKEN;

// Set NODE_ENV to test to skip environment validation
if (!skipIntegrationTests) {
  process.env.NODE_ENV = 'test';
}

describe('Layer Integration Tests - Document Engine API', () => {
  let client: DocumentEngineClient;
  let testDocumentId: string;
  let testLayerId: string;
  let secondLayerId: string;

  beforeAll(async () => {
    console.log('Setting up layer integration tests...');
    console.log('Document Engine URL:', process.env.DOCUMENT_ENGINE_BASE_URL);

    client = await getDocumentEngineClient();
  });

  beforeEach(async () => {
    // Upload a fresh test document before each test
    console.log('Creating a fresh test document for layer tests...');
    testDocumentId = await uploadTestDocument(
      client,
      path.join(__dirname, '..', '..', 'assets', 'contract.pdf'),
      'layers-test.pdf'
    );
    console.log('Created test document with ID:', testDocumentId);

    // Create test layers for each test
    console.log('Creating test layers...');
    try {
      const layer1Response = await createDocumentLayer(client, testDocumentId, 'test-layer-1');
      testLayerId = layer1Response.data?.data?.name || 'test-layer-1';

      const layer2Response = await createDocumentLayer(client, testDocumentId, 'test-layer-2');
      secondLayerId = layer2Response.data?.data?.name || 'test-layer-2';

      console.log('Created layers:', testLayerId, secondLayerId);
    } catch (error) {
      console.error('Failed to create test layers:', error);
      throw error;
    }
  });

  afterEach(async () => {
    console.log('Cleaning up test document and layers:', testDocumentId);
    const deleted = await deleteTestDocument(client, testDocumentId);
    if (deleted) {
      console.log('Successfully deleted test document:', testDocumentId);
    } else {
      console.warn('Failed to delete test document:', testDocumentId);
    }
  });

  afterAll(async () => {
    console.log('Layer integration tests completed');
  });

  describe('Discovery Tools with Layers', () => {
    it('should list documents and show basic functionality', async () => {
      const result = await listDocuments(client, { limit: 5, title: 'layers-test.pdf' });

      expect(result.markdown).toContain('Document List');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).toContain(testLayerId);
      console.log('✅ List Documents: Success');
    });

    it('should read document info with layer context', async () => {
      const result = await readDocumentInfo(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
        include_metadata: true,
      });

      expect(result.markdown).toContain('Document Information');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).toContain(`**Layer:** ${testLayerId}`);
      console.log('✅ Read Document Info with **Layer:** Success');
    });

    it('should read document info without layer (base document)', async () => {
      const result = await readDocumentInfo(client, {
        document_fingerprint: {
          document_id: testDocumentId,
        },
        include_metadata: true,
      });

      expect(result.markdown).toContain('Document Information');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).not.toContain(`Layer:`);
      console.log('✅ Read Document Info without **Layer:** Success');
    });
  });

  describe('Extraction Tools with Layers', () => {
    it('should extract text with layer context', async () => {
      const result = await extractText(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
        include_coordinates: false,
        ocr_enabled: false,
      });

      expect(result.markdown).toContain('Text Extraction');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).toContain(`**Layer:** ${testLayerId}`);
      console.log('✅ Extract Text with **Layer:** Success');
    });

    it('should extract text without layer (base document)', async () => {
      const result = await extractText(client, {
        document_fingerprint: {
          document_id: testDocumentId,
        },
        include_coordinates: false,
        ocr_enabled: false,
      });

      expect(result.markdown).toContain('Text Extraction');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).not.toContain('Layer:');
      console.log('✅ Extract Text without **Layer:** Success');
    });

    it('should extract form data with layer context', async () => {
      const result = await extractFormData(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
        include_empty_fields: false,
      });

      expect(result.markdown).toContain('Form Data Extraction');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).toContain(`**Layer:** ${testLayerId}`);
      console.log('✅ Extract Form Data with **Layer:** Success');
    });

    it('should render document page with layer context', async () => {
      const result = await renderDocumentPage(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
        pages: [0],
        width: 400,
        height: 300,
      });

      expect(result.markdown).toContain('Document Page Render');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).toContain(`**Layer:** ${testLayerId}`);
      console.log('✅ Render Document Page with **Layer:** Success');
    });

    it('should search document with layer context (note: search uses base document)', async () => {
      const result = await search(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
        query: 'contract',
        search_type: 'text',
        start_page: 0,
        include_annotations: false,
      });

      expect(result.markdown).toContain('Search Results');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).toContain(`**Layer:** ${testLayerId}`);
      console.log('✅ Search Document with **Layer:** Success');
    });

    it('should extract tables with layer context', async () => {
      const result = await extractTables(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
      });

      expect(result.markdown).toContain('Table Extraction');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).toContain(`**Layer:** ${testLayerId}`);
      console.log('✅ Extract Tables with **Layer:** Success');
    });

    it('should extract key-value pairs with layer context', async () => {
      const result = await extractKeyValuePairs(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
      });

      expect(result.markdown).toContain('Key-Value Pair Extraction');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).toContain(`**Layer:** ${testLayerId}`);
      console.log('✅ Extract Key-Value Pairs with **Layer:** Success');
    });
  }, 20000);

  describe('Document Editing Tools with Layers', () => {
    it('should rotate pages with layer context', async () => {
      const result = await rotatePages(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
        pages: [0],
        rotation: 90,
      });

      expect(result.markdown).toContain('Pages Rotated');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).toContain(`**Layer:** ${testLayerId}`);
      console.log('✅ Rotate Pages with **Layer:** Success');
    });
  });

  describe('Annotation Tools with Layers', () => {
    it('should add annotation with layer context', async () => {
      const result = await addAnnotation(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
        page_number: 0,
        annotation_type: 'highlight',
        content: 'Test annotation for layer',
        coordinates: {
          left: 100,
          top: 100,
          width: 200,
          height: 50,
        },
      });

      expect(result.markdown).toContain('Annotation Added');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).toContain(`**Layer:** ${testLayerId}`);
      console.log('✅ Add Annotation with **Layer:** Success');
    });

    it('should read annotations with layer context', async () => {
      // First add an annotation to the layer
      await addAnnotation(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
        page_number: 0,
        annotation_type: 'note',
        content: 'Test note for reading',
        coordinates: {
          left: 50,
          top: 50,
          width: 100,
          height: 30,
        },
      });

      const result = await readAnnotations(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
      });

      expect(result.markdown).toContain('Document Annotations');
      expect(result.markdown).toContain(testDocumentId);
      expect(result.markdown).toContain(`**Layer:** ${testLayerId}`);
      console.log('✅ Read Annotations with **Layer:** Success');
    });

    it('should show different annotations in different layers', async () => {
      // Add annotation to first layer
      await addAnnotation(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
        page_number: 0,
        annotation_type: 'text',
        content: 'First layer annotation',
        coordinates: {
          left: 100,
          top: 100,
          width: 200,
          height: 30,
        },
      });

      // Add annotation to second layer
      await addAnnotation(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: secondLayerId,
        },
        page_number: 0,
        annotation_type: 'text',
        content: 'Second layer annotation',
        coordinates: {
          left: 200,
          top: 200,
          width: 150,
          height: 40,
        },
      });

      // Read annotations from first layer
      const layer1Result = await readAnnotations(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
      });

      // Read annotations from second layer
      const layer2Result = await readAnnotations(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: secondLayerId,
        },
      });

      expect(layer1Result.markdown).toContain(`**Layer:** ${testLayerId}`);
      expect(layer2Result.markdown).toContain(`**Layer:** ${secondLayerId}`);

      // Each layer should show its own annotations
      expect(layer1Result.markdown).toContain('First layer annotation');
      expect(layer2Result.markdown).toContain('Second layer annotation');

      console.log('✅ Layer Annotation Isolation: Success');
    });
  });

  describe('Layer Context Switching and Isolation', () => {
    it('should maintain layer isolation between operations', async () => {
      // Get document info from different layers
      const layer1Info = await readDocumentInfo(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: testLayerId,
        },
        include_metadata: true,
      });

      const layer2Info = await readDocumentInfo(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: secondLayerId,
        },
        include_metadata: true,
      });

      expect(layer1Info.markdown).toContain(`**Layer:** ${testLayerId}`);
      expect(layer2Info.markdown).toContain(`**Layer:** ${secondLayerId}`);

      // Both should reference the same document but different layers
      expect(layer1Info.markdown).toContain(testDocumentId);
      expect(layer2Info.markdown).toContain(testDocumentId);

      console.log('✅ Layer Isolation: Success');
    });

    it('should handle rapid layer switching', async () => {
      const operations = [];

      // Alternate between layers rapidly
      for (let i = 0; i < 5; i++) {
        const currentLayer = i % 2 === 0 ? testLayerId : secondLayerId;
        operations.push(
          readDocumentInfo(client, {
            document_fingerprint: {
              document_id: testDocumentId,
              layer: currentLayer,
            },
            include_metadata: false,
          })
        );
      }

      const results = await Promise.all(operations);

      // Verify results maintain correct layer context
      results.forEach((result, index) => {
        const expectedLayer = index % 2 === 0 ? testLayerId : secondLayerId;
        expect(result.markdown).toContain(`**Layer:** ${expectedLayer}`);
        expect(result.markdown).toContain(testDocumentId);
      });

      console.log('✅ Rapid Layer Switching: Success');
    });
  });

  describe('Layer Error Handling', () => {
    it('should handle invalid layer names gracefully', async () => {
      const result = await readDocumentInfo(client, {
        document_fingerprint: {
          document_id: testDocumentId,
          layer: 'non-existent-layer-name',
        },
        include_metadata: true,
      });

      expect(result.markdown).toContain('Error');
      console.log('✅ Invalid Layer Error Handling: Success');
    });

    it('should handle invalid document IDs with layers gracefully', async () => {
      const result = await readDocumentInfo(client, {
        document_fingerprint: {
          document_id: 'invalid-doc-id',
          layer: testLayerId,
        },
        include_metadata: true,
      });

      expect(result.markdown).toContain('Error');
      console.log('✅ Invalid Document + Layer Error Handling: Success');
    });
  });

  describe('Performance with Layers', () => {
    it('should handle concurrent layer operations efficiently', async () => {
      const startTime = Date.now();

      const concurrentOps = Array.from({ length: 10 }, (_, i) =>
        readDocumentInfo(client, {
          document_fingerprint: {
            document_id: testDocumentId,
            layer: i % 2 === 0 ? testLayerId : secondLayerId,
          },
          include_metadata: false,
        })
      );

      const results = await Promise.all(concurrentOps);
      const endTime = Date.now();

      // All operations should succeed
      results.forEach((result, i) => {
        const expectedLayer = i % 2 === 0 ? testLayerId : secondLayerId;
        expect(result.markdown).toContain('Document Information');
        expect(result.markdown).toContain(`**Layer:** ${expectedLayer}`);
      });

      // Should complete in reasonable time
      const totalTime = endTime - startTime;
      expect(totalTime).toBeLessThan(30000); // 30 seconds

      console.log(`✅ Concurrent Layer Operations: Success (${totalTime}ms)`);
    });
  });
});

// Helper to run integration tests conditionally
if (skipIntegrationTests) {
  console.log('⚠️ Layer integration tests skipped. To run layer integration tests:');
  console.log('');
  console.log('1. Set up your Document Engine instance with layer support');
  console.log('2. Set DOCUMENT_ENGINE_BASE_URL environment variable');
  console.log('3. Set DOCUMENT_ENGINE_AUTH_TOKEN environment variable');
  console.log('4. Run: pnpm test test/integration/layers.test.ts');
  console.log('');
  console.log('These tests verify that layer functionality works correctly across all MCP tools.');
}
