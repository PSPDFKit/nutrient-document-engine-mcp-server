# Document Engine MCP Evaluation Framework

A comprehensive evaluation framework for testing whether LLMs can effectively use Document Engine MCP tools. This framework evaluates tool selection, execution order, efficiency, and parameter correctness across a wide range of document processing scenarios.

## 🎯 What It Tests

This framework evaluates four core aspects of LLM tool usage:

1. **Right Tools** (50% of score) - Does the LLM choose the correct tools?
2. **Right Order** (30% of score) - Does the LLM use tools in the correct sequence?
3. **Efficiency** (20% of score) - Does the LLM minimize unnecessary tool calls?
4. **Correct Parameters** - Does the LLM use the correct parameters for each tool?

## 🏗️ Architecture

The evaluation framework consists of several modular components:

### Core Components

- **`index.ts`** - Main entry point and configuration
- **`runner.ts`** - Orchestrates the evaluation process, manages test documents, and coordinates model testing
- **`evaluator.ts`** - Core evaluation logic for assessing tool usage correctness
- **`scenarios.ts`** - Comprehensive test scenarios covering all tool capabilities
- **`types.ts`** - TypeScript type definitions for strongly-typed evaluation
- **`reporter.ts`** - Results formatting, comparison, and persistence
- **`results/`** - Directory for storing evaluation results with timestamps

### Evaluation Flow

1. **Initialization** - Set up Document Engine client and upload test documents
2. **Model Setup** - Create LangChain agents with Document Engine tools
3. **Scenario Execution** - Run each test scenario against the model
4. **Assessment** - Evaluate tool usage correctness, order, and efficiency
5. **Reporting** - Generate comprehensive results and comparisons

## 🚀 Quick Start

### Prerequisites

```bash
# Set up environment. Replace OpenAI key in .env.
cp .env.example .env

# Run local Document Engine
docker compose up -d
```

### Run Evaluation

```bash
# Run focused evaluation
pnpm eval
```

## 📊 Test Scenarios

The framework includes over 100 comprehensive test scenarios covering:

### Document Discovery Tools
- **List Documents**: Filtering, sorting, pagination, and counting
- **Read Document Info**: Metadata retrieval and document information

### Text Extraction Tools
- **Extract Text**: Page ranges, OCR, coordinates, and formatting options
- **Search**: Text search, regex patterns, presets, and case sensitivity
- **Extract Tables**: Table detection and extraction from documents
- **Extract Key-Value Pairs**: Structured data extraction

### Form Processing Tools
- **Extract Form Data**: Field discovery, filtering, and value extraction
- **Fill Form Fields**: Single and multiple field updates with validation

### Annotation Tools
- **Add Annotation**: Notes, highlights, links with positioning and metadata
- **Read Annotations**: Retrieve existing annotations
- **Delete Annotations**: Remove specific annotations

### Redaction Tools
- **Create Redaction**: Text, regex, and preset-based redactions
- **Apply Redactions**: Execute pending redactions

### Document Editing Tools
- **Add Watermark**: Text and image watermarks with positioning and styling
- **Split Document**: Page-based document splitting
- **Duplicate Document**: Document copying and cloning
- **Add New Page**: Page insertion with size and orientation options
- **Rotate Pages**: Single and multiple page rotation
- **Merge Document Pages**: Combine documents with flexible page ranges

### Multi-Tool Workflows
- **Search then Extract**: Find documents, then extract content
- **Info then Extract**: Get metadata, then extract text
- **Annotate Workflow**: Read document info, then add annotations
- **Redaction Workflow**: Create redactions, then apply them
- **Form Processing**: Extract fields, then fill with new values
- **Document Restructuring**: Duplicate, modify, and enhance documents

### Efficiency Tests
- **Direct Operations**: Execute operations without unnecessary preparatory calls
- **Parameter Optimization**: Use appropriate parameters for each tool

### Order Sensitivity Tests
- **Sequential Dependencies**: Ensure proper tool execution order
- **Workflow Validation**: Test multi-step process requirements

### Edge Cases
- **Zero-based Indexing**: Proper page number handling
- **Parameter Types**: Boolean, numeric, array, and object parameters
- **Complex Scenarios**: Multi-step workflows with interdependencies

## 📋 Sample Output

```
🎯 Initializing focused LLM tool usage evaluation...
📤 Uploading test documents...
   Uploading doc-12345 (Sample Contract Document)...
   ✅ Successfully uploaded doc-12345
   Uploading doc-form-123 (Sample Form Document)...
   ✅ Successfully uploaded doc-form-123
   [...]
📤 All test documents uploaded successfully
✅ Initialized successfully

🔬 Evaluating model: GPT-4o
   Running 100+ tool usage scenarios...
   1/100 ✅ List all documents (100%)
   2/100 ✅ Get document information (100%)
   3/100 ⚠️ Extract text from specific page (70%)
   4/100 ✅ Find document then extract text (100%)
   5/100 ✅ Extract form data (100%)
   6/100 ⚠️ Complex redaction workflow (80%)
   [...]

   Overall Score: 87.5%
   Correct Tools: 92.9%
   Correct Order: 85.7%
   Efficiency: 78.6%

🏆 MODEL COMPARISON - TOOL USAGE EFFECTIVENESS
================================================================================

📊 OVERALL RANKINGS:
🥇 1. GPT-4o              87.5%
🥈 2. GPT-4o-mini         82.1%
🥉 3. GPT-4.1-mini        78.3%
   4. GPT-4.1-nano        71.2%
   5. o3-mini             69.8%

📋 DETAILED BREAKDOWN:
Model               Overall   Tools     Order     Efficiency
------------------------------------------------------------
GPT-4o              87.5%     92.9%     85.7%     78.6%
GPT-4o-mini         82.1%     89.3%     82.1%     75.0%
GPT-4.1-mini        78.3%     85.1%     78.2%     71.5%
GPT-4.1-nano        71.2%     78.8%     72.1%     62.7%
o3-mini             69.8%     76.4%     69.9%     63.1%

🎯 KEY INSIGHTS:
✅ Best performing scenario: simple-list (consistent across models)
❌ Most challenging scenario: complex-document-processing (needs improvement)
================================================================================

📁 Results saved to: evaluation/results/2025-06-19T10:30:45.123Z.json
```

## 🔧 Customization

### Test Documents

The framework automatically uploads test documents from the `assets/` directory:

- `contract.pdf` → `doc-12345` (Sample Contract Document)
- `form.pdf` → `doc-form-123` (Sample Form Document)
- `ocr.pdf` → `doc-scan-123` (Sample Scanned Document)
- `report.pdf` → `doc-report-456` (Sample Report Document)
- `A.pdf` → `doc-111` (Sample A Document)
- `B.pdf` → `doc-222` (Sample B Document)

Documents are automatically uploaded with consistent IDs before each model evaluation.

### Add New Test Scenarios

Add scenarios to `scenarios.ts`:

```typescript
export const TOOL_USAGE_SCENARIOS: ToolUsageScenario[] = [
  // ... existing scenarios
  {
    id: 'my-custom-test',
    description: 'My custom workflow',
    query: 'Find contract documents and redact email addresses',
    expectedTools: ['list_documents', 'create_redaction', 'apply_redactions'],
    maxToolCalls: 3,
    allowExtraTools: false,
    expectedParameters: {
      list_documents: { title: 'contract' },
      create_redaction: {
        redaction_type: 'preset',
        preset: 'email-address',
      },
    },
  },
];
```

### Change Models

Modify the models array in `runner.ts`:

```typescript
const models = [
  {
    name: 'GPT-4o',
    llm: new ChatOpenAI({ model: 'gpt-4o', temperature: 0 }),
  },
  {
    name: 'Claude-3.5-Sonnet',
    llm: new ChatAnthropic({ model: 'claude-3-5-sonnet-20241022' }),
  },
];
```

### Parameter Validation

The framework supports strongly-typed parameter validation:

```typescript
interface ToolUsageScenario {
  // ... other properties
  expectedParameters?: TypedExpectedParameters;
}

// TypedExpectedParameters provides type safety for all tool parameters
interface TypedExpectedParameters {
  list_documents?: Partial<ListDocumentsInput>;
  extract_text?: Partial<ExtractTextInput>;
  // ... all other tools
}
```

## 🎯 Key Benefits

- **Comprehensive**: Tests all Document Engine MCP tools and workflows
- **Scalable**: 100+ scenarios covering simple operations to complex workflows
- **Type-Safe**: Strongly-typed parameter validation and scenario definitions
- **Modular**: Clean separation of concerns with pluggable components
- **Actionable**: Detailed issue identification and scoring breakdown
- **Model Agnostic**: Compare different LLM models objectively
- **Automated**: Handles test document setup and teardown automatically
- **Persistent**: Results saved with timestamps for historical comparison

## 📁 Files

- **`index.ts`** - Main entry point and configuration
- **`runner.ts`** - Evaluation orchestration and model management
- **`evaluator.ts`** - Core evaluation logic and scoring
- **`scenarios.ts`** - Comprehensive test scenario definitions
- **`types.ts`** - TypeScript type definitions
- **`reporter.ts`** - Results formatting and persistence
- **`results/`** - Directory for timestamped evaluation results
- **`README.md`** - This documentation

## 🛠️ Troubleshooting

**"No models available"**: Set `OPENAI_API_KEY` environment variable

**Connection errors**: Verify Document Engine is running and `DOCUMENT_ENGINE_BASE_URL` is correct

**Document upload failures**: Ensure test documents exist in the `assets/` directory

**TypeScript errors**: Run `pnpm build` to compile before running evaluations

**Memory issues**: Reduce the number of scenarios or models being tested concurrently

**Timeout errors**: Increase timeout values in the Document Engine client configuration

## 📈 Understanding Results

### Scoring Breakdown

- **Right Tools (50%)**: Whether the LLM selected the correct tools for the task
- **Right Order (30%)**: Whether tools were used in the correct sequence
- **Efficiency (20%)**: Whether the LLM minimized unnecessary tool calls
- **Correct Parameters**: Whether the LLM used appropriate parameters (tracked separately)

### Result Files

Results are saved in `evaluation/results/` with timestamps. Each result file contains:

- Overall scores per model
- Detailed scenario-by-scenario breakdown
- Tool usage patterns and issues
- Execution timing and metadata

### Best Practices

1. **Run Multiple Models**: Compare different LLM models to identify strengths and weaknesses
2. **Analyze Patterns**: Look for consistent failures across scenarios to identify improvement areas
3. **Monitor Trends**: Track evaluation results over time to measure improvements
4. **Customize Scenarios**: Add domain-specific scenarios for your use case

This comprehensive evaluation framework provides deep insights into LLM tool usage effectiveness for document processing workflows.
