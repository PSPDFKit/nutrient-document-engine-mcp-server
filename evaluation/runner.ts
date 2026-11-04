/**
 * Main evaluation runner that orchestrates the focused LLM tool usage evaluation
 */

import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { BaseLanguageModel } from '@langchain/core/language_models/base';
import { ChatOpenAI } from '@langchain/openai';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { mcpToolsToRegister } from '../src/mcpTools.js';
import { getDocumentEngineClient } from '../src/api/ClientFactory.js';
import { z, ZodRawShape } from 'zod';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { FocusedEvaluationResults, ToolUsageResult } from './types.js';
import { TOOL_USAGE_SCENARIOS } from './scenarios.js';
import { ToolUsageEvaluator } from './evaluator.js';
import { EvaluationReporter } from './reporter.js';
import { DocumentEngineClient } from '../src/api/Client.js';
import { createDocumentLayer } from '../src/api/DocumentLayerAbstraction.js';

/**
 * Test document configuration
 */
interface TestDocument {
  filePath: string;
  documentId: string;
  title: string;
}

/**
 * Focused evaluation runner
 */
export class FocusedEvaluationRunner {
  private client?: DocumentEngineClient;
  private evaluator: ToolUsageEvaluator;
  private reporter: EvaluationReporter;

  // Test documents configuration
  private readonly testDocuments: TestDocument[] = [
    {
      filePath: join(process.cwd(), 'assets', 'contract.pdf'),
      documentId: 'doc-12345',
      title: 'Sample Contract Document',
    },
    {
      filePath: join(process.cwd(), 'assets', 'form.pdf'),
      documentId: 'doc-form-123',
      title: 'Sample Form Document',
    },
    {
      filePath: join(process.cwd(), 'assets', 'ocr.pdf'),
      documentId: 'doc-scan-123',
      title: 'Sample Scanned Document',
    },
    {
      filePath: join(process.cwd(), 'assets', 'report.pdf'),
      documentId: 'doc-report-456',
      title: 'Sample Report Document',
    },
    {
      filePath: join(process.cwd(), 'assets', 'A.pdf'),
      documentId: 'doc-111',
      title: 'Sample A Document',
    },
    {
      filePath: join(process.cwd(), 'assets', 'B.pdf'),
      documentId: 'doc-222',
      title: 'Sample B Document',
    },
  ];

  // Layer names used in evaluation scenarios (excluding non-existent-layer for error testing)
  private readonly testLayers: string[] = [
    'additional-pages-layer',
    'analysis-layer',
    'annotation-layer',
    'approval-layer',
    'approved-layer',
    'comments-layer',
    'completed-layer',
    'data-layer',
    'draft-layer',
    'edit-layer',
    'edited-layer',
    'final-layer',
    'final-redaction-layer',
    'finance-layer',
    'markup-layer',
    'metadata-layer',
    'ocr-layer',
    'original-layer',
    'privacy-layer',
    'redaction-layer',
    'review-layer',
    'reviewer-1-layer',
    'reviewer-2-layer',
    'rotation-layer',
    'search-layer',
    'split-layer',
    'temp-layer',
    'template-layer',
    'test-layer',
    'watermark-layer',
  ];

  constructor() {
    this.evaluator = new ToolUsageEvaluator();
    this.reporter = new EvaluationReporter();
  }

  /**
   * Initialize the runner
   */
  async initialize(): Promise<void> {
    console.log('🎯 Initializing focused LLM tool usage evaluation...');
    this.client = await getDocumentEngineClient();

    console.log('✅ Initialized successfully');
  }

  /**
   * Upload test documents to Document Engine with specific IDs and create all required layers
   * This ensures all layer evaluation scenarios have the necessary layers available
   */
  private async uploadTestDocuments(): Promise<void> {
    console.log('📤 Uploading test documents...');

    if (!this.client) {
      throw new Error('Please run initialize() first');
    }

    for (const testDoc of this.testDocuments) {
      try {
        console.log(`   Uploading ${testDoc.documentId} (${testDoc.title})...`);

        // Read the file
        const fileBuffer = await readFile(testDoc.filePath);
        const blob = new Blob([fileBuffer], { type: 'application/octet-stream' });
        const formData = new FormData();
        formData.append('file', blob, testDoc.title);
        formData.append('document_id', testDoc.documentId);
        formData.append('title', testDoc.title);
        formData.append('overwrite_existing_document', 'true');

        // Upload with specific document ID and overwrite if exists
        // @ts-expect-error We can send form data.
        await this.client['upload-document']({}, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log(`   ✅ Successfully uploaded ${testDoc.documentId}`);

        // Create all required layers for this document (used in layer evaluation scenarios)
        console.log(`   Creating ${this.testLayers.length} layers for ${testDoc.documentId}...`);
        for (const layerName of this.testLayers) {
          try {
            await createDocumentLayer(this.client, testDoc.documentId, layerName);
            console.log(`   ✅ Created layer: ${layerName}`);
          } catch (error) {
            // Some layers might already exist from previous runs, which is fine
            console.log(`   ⚠️ Layer ${layerName} may already exist: ${error}`);
          }
        }
        console.log(`   ✅ Completed layer creation for ${testDoc.documentId}`);
      } catch (error) {
        console.error(`   ❌ Failed to upload ${testDoc.documentId}:`, error);
        throw new Error(`Failed to upload test document ${testDoc.documentId}: ${error}`);
      }
    }

    console.log('📤 All test documents and layers uploaded successfully');
  }

  /**
   * Evaluate multiple models on tool usage
   */
  async evaluateModels(
    models: Array<{ name: string; llm: BaseLanguageModel }>
  ): Promise<FocusedEvaluationResults[]> {
    const allResults: FocusedEvaluationResults[] = [];

    for (const model of models) {
      // Upload and overwrite the documents from the previous run.
      await this.uploadTestDocuments();

      console.log(`\n🔬 Evaluating model: ${model.name}`);
      const result = await this.evaluateModel(model.name, model.llm);
      allResults.push(result);

      this.reporter.printModelSummary(model.name, result);
    }

    return allResults;
  }

  /**
   * Evaluate a single model
   */
  async evaluateModel(
    modelName: string,
    llm: BaseLanguageModel
  ): Promise<FocusedEvaluationResults> {
    const startTime = Date.now();

    // Create tools
    const tools = mcpToolsToRegister.map(tool => {
      return new DynamicStructuredTool({
        name: tool.name,
        description: `Document processing tool: ${tool.name}`,
        schema: z.object(tool.schema as ZodRawShape),
        func: async args => {
          if (!this.client) {
            throw new Error('Please run initialize() first');
          }

          try {
            const result = await tool.handler(
              this.client,
              args,
              // Mock the request extras.
              {
                signal: new AbortController().signal,
                sendNotification: _ => {
                  return Promise.resolve();
                },
                sendRequest: _ => {
                  return Promise.resolve(args);
                },
                requestId: '',
              }
            );
            return result.content?.[0]?.text || 'Operation completed successfully';
          } catch (error) {
            return `Error: ${error}`;
          }
        },
      });
    });

    // Create agent
    const agent = createReactAgent({ llm, tools });

    console.log(`   Running ${TOOL_USAGE_SCENARIOS.length} tool usage scenarios...`);

    const results: ToolUsageResult[] = [];

    for (let i = 0; i < TOOL_USAGE_SCENARIOS.length; i++) {
      const scenario = TOOL_USAGE_SCENARIOS[i];

      try {
        const result = await this.evaluator.evaluateScenario(scenario, agent);
        results.push(result);

        this.reporter.printScenarioProgress(i, TOOL_USAGE_SCENARIOS.length, scenario, result);
      } catch (error: unknown) {
        this.reporter.printScenarioError(i, TOOL_USAGE_SCENARIOS.length, scenario, error as Error);
        results.push({
          scenarioId: scenario.id,
          description: scenario.description,
          correctTools: false,
          correctOrder: false,
          efficient: false,
          correctParameters: false,
          expectedTools: scenario.expectedTools,
          actualTools: [],
          toolCallCount: 0,
          maxAllowed: scenario.maxToolCalls || 999,
          score: 0,
          issues: [`Execution error: ${error}`],
        });
      }
    }

    // Calculate overall metrics
    const correctToolUsage = results.filter(r => r.correctTools).length / results.length;
    const correctOrderUsage = results.filter(r => r.correctOrder).length / results.length;
    const efficiencyScore = results.filter(r => r.efficient).length / results.length;
    const correctParameterUsage = results.filter(r => r.correctParameters).length / results.length;
    const overallScore =
      (correctToolUsage + correctOrderUsage + efficiencyScore + correctParameterUsage) / 4;

    const duration = Date.now() - startTime;

    return {
      model: modelName,
      totalScenarios: results.length,
      correctToolUsage,
      correctOrderUsage,
      efficiencyScore,
      correctParameterUsage,
      overallScore,
      results,
      timestamp: new Date(),
      duration,
    };
  }

  /**
   * Get the reporter instance for external use
   */
  getReporter(): EvaluationReporter {
    return this.reporter;
  }
}

/**
 * Quick evaluation with multiple models
 */
export async function runFocusedEvaluation(): Promise<FocusedEvaluationResults[]> {
  const runner = new FocusedEvaluationRunner();
  await runner.initialize();

  // Define models to test
  const models = [
    {
      name: 'GPT-4o',
      llm: new ChatOpenAI({ model: 'gpt-4o', temperature: 0 }),
    },
    {
      name: 'GPT-4o-mini',
      llm: new ChatOpenAI({ model: 'gpt-4o-mini', temperature: 0 }),
    },
    {
      name: 'GPT-4.1-mini',
      llm: new ChatOpenAI({ model: 'gpt-4.1-mini', temperature: 0 }),
    },
    {
      name: 'GPT-4.1-nano',
      llm: new ChatOpenAI({ model: 'gpt-4.1-nano', temperature: 0 }),
    },
    {
      name: 'o3-mini',
      llm: new ChatOpenAI({ model: 'o3-mini' }),
    },
  ];

  if (models.length === 0) {
    throw new Error('No models available. Set OPENAI_API_KEY environment variable.');
  }

  const results = await runner.evaluateModels(models);
  const reporter = runner.getReporter();

  reporter.printComparison(results);
  await reporter.saveResults(results);

  return results;
}
