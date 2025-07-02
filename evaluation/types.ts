/**
 * Type definitions for focused LLM tool usage evaluation
 */

import type {
  ListDocumentsInput,
  ReadDocumentInfoInput,
  ExtractTextInput,
  SearchInput,
  ExtractTablesInput,
  ExtractFormDataInput,
  FillFormFieldInput,
  AddAnnotationInput,
  ReadAnnotationsInput,
  DeleteAnnotationsInput,
  CreateRedactionInput,
  ApplyRedactionsInput,
  AddWatermarkInput,
  SplitDocumentInput,
  DuplicateDocumentInput,
  AddNewPageInput,
  RotatePagesInput,
  MergeDocumentPagesInput,
  ExtractKeyValuePairsInput,
  HealthCheckInput,
  RenderDocumentPageInput,
} from '../src/tools/toolSchemas.js';

/**
 * Strongly typed expected parameters interface
 * Each tool can have a single parameter object or an array for multiple calls
 */
export interface TypedExpectedParameters {
  list_documents?: Partial<ListDocumentsInput> | Partial<ListDocumentsInput>[];
  read_document_info?: Partial<ReadDocumentInfoInput> | Partial<ReadDocumentInfoInput>[];
  extract_text?: Partial<ExtractTextInput> | Partial<ExtractTextInput>[];
  search?: Partial<SearchInput> | Partial<SearchInput>[];
  extract_tables?: Partial<ExtractTablesInput> | Partial<ExtractTablesInput>[];
  extract_form_data?: Partial<ExtractFormDataInput> | Partial<ExtractFormDataInput>[];
  fill_form_fields?: Partial<FillFormFieldInput> | Partial<FillFormFieldInput>[];
  add_annotation?: Partial<AddAnnotationInput> | Partial<AddAnnotationInput>[];
  read_annotations?: Partial<ReadAnnotationsInput> | Partial<ReadAnnotationsInput>[];
  delete_annotations?: Partial<DeleteAnnotationsInput> | Partial<DeleteAnnotationsInput>[];
  create_redaction?: Partial<CreateRedactionInput> | Partial<CreateRedactionInput>[];
  apply_redactions?: Partial<ApplyRedactionsInput> | Partial<ApplyRedactionsInput>[];
  add_watermark?: Partial<AddWatermarkInput> | Partial<AddWatermarkInput>[];
  split_document?: Partial<SplitDocumentInput> | Partial<SplitDocumentInput>[];
  duplicate_document?: Partial<DuplicateDocumentInput> | Partial<DuplicateDocumentInput>[];
  add_new_page?: Partial<AddNewPageInput> | Partial<AddNewPageInput>[];
  rotate_pages?: Partial<RotatePagesInput> | Partial<RotatePagesInput>[];
  merge_document_pages?: Partial<MergeDocumentPagesInput> | Partial<MergeDocumentPagesInput>[];
  extract_key_value_pairs?:
    | Partial<ExtractKeyValuePairsInput>
    | Partial<ExtractKeyValuePairsInput>[];
  health_check?: Partial<HealthCheckInput> | Partial<HealthCheckInput>[];
  render_document_page?: Partial<RenderDocumentPageInput> | Partial<RenderDocumentPageInput>[];
}

/**
 * Test scenario focused on tool usage patterns
 */
export interface ToolUsageScenario {
  id: string;
  description: string;
  query: string;
  expectedTools: string[]; // Tools that should be called, in order
  maxToolCalls?: number; // Maximum acceptable tool calls
  allowExtraTools?: boolean; // Whether extra tools are acceptable
  expectedParameters?: TypedExpectedParameters; // Strongly typed expected parameters
}

/**
 * Tool usage evaluation result
 */
export interface ToolUsageResult {
  scenarioId: string;
  description: string;

  // Tool selection
  correctTools: boolean; // Used the right tools
  correctOrder: boolean; // Used tools in right order
  efficient: boolean; // Didn't use too many tools
  correctParameters: boolean; // Used correct parameters

  // Details
  expectedTools: string[];
  actualTools: string[];
  toolCallCount: number;
  maxAllowed: number;
  expectedParameters?: TypedExpectedParameters;
  actualParameters?: Record<string, unknown[]>;

  // Overall score
  score: number; // 0-1 based on the four criteria above

  // Debug info
  issues: string[];
}

/**
 * Overall evaluation results
 */
export interface FocusedEvaluationResults {
  model: string;
  totalScenarios: number;

  // Core metrics
  correctToolUsage: number; // % scenarios with correct tools
  correctOrderUsage: number; // % scenarios with correct order
  efficiencyScore: number; // % scenarios that were efficient
  correctParameterUsage: number; // % scenarios with correct parameters
  overallScore: number; // Average of above four

  // Details
  results: ToolUsageResult[];

  // Summary
  timestamp: Date;
  duration: number;
}

/**
 * Tool call information extracted from agent responses
 */
export interface ToolCall {
  name: string;
  parameters: Record<string, unknown>;
}
