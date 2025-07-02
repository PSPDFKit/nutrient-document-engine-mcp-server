# LangGraph.js Document Engine Examples

This directory contains complete examples demonstrating how to use LangChain.js and LangGraph with the Document Engine MCP (Model Context Protocol) server for intelligent PDF document processing workflows.

## Prerequisites

- Node.js 18+ with pnpm package manager
- Document Engine MCP server running (see main project README)
- OpenAI API key configured

## Setup

1. **Install dependencies**:

   ```bash
   pnpm install
   ```

2. **Environment setup**:
   Create a `.env` file in this directory with:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   MCP_SERVER_URL=http://localhost:5100/mcp
   ```

3. **Start Document Engine MCP Server**:
   From the main project directory:
   ```bash
   pnpm build && MCP_TRANSPORT=http pnpm start
   ```

## Available Examples

### 1. Document Assembly (`document-assembler.js`)

Assembles multiple documents into a professional final document with annotations, headers, and watermarks.

**Usage:**

```bash
pnpm document-assembler ../assets/cover.pdf ../assets/contract.pdf ../assets/thanks.pdf
```

**Features:**

- Intelligent document analysis and ordering
- Professional annotations and section headers
- Watermark application
- Stakeholder version creation

### 2. Document Compliance Processor (`document-processor.js`)

Autonomous regulatory monitoring system for document compliance.

**Usage:**

```bash
pnpm document-processor ../assets/credit-card-application.pdf
```

**Features:**

- Regulatory adherence scanning
- Automatic redaction of sensitive data
- Audit trail creation
- Compliance report generation

### 3. Form Processing Automation (`form-processor.js`)

Intelligent form processing automation with compliance checking.

**Usage:**

```bash
pnpm form-processor ../assets/credit-card-application.pdf ../assets/form.pdf
```

**Features:**

- Form field extraction and analysis
- Data validation and compliance checking
- Automated form processing workflows
- Error detection and correction

### 4. Report Generation Engine (`report-generator.js`)

Autonomous business intelligence report generation from data files.

**Usage:**

```bash
pnpm report-generator ../assets/finance.xlsx
```

**Features:**

- Data analysis and visualization
- Professional report formatting
- Chart and graph generation
- Business intelligence insights

### 5. Smart Contract Processing Pipeline (`contract-processor.js`)

Autonomous agent for monitoring and processing legal agreements.

**Usage:**

```bash
pnpm contract-processor ../assets/contract.pdf
```

**Features:**

- Legal document analysis
- Contract term extraction
- Compliance verification
- Risk assessment reporting

## Shared Utilities

The examples use shared utilities from the `shared/` directory:

### `shared/common.js`

- **`createMCPClient()`**: Creates MCP client for Document Engine
- **`createLLM()`**: Creates configured ChatOpenAI model instance
- **`parseDocumentIds()`**: Parses document IDs from agent responses
- **`handleAgentStream()`**: Handles streaming responses from agents
- **`processCommandLine()`**: Generic command line processing
- **`uploadDocumentWorkflow()`**: Standard document upload workflow

### `shared/fileHandlers.js`

- **`uploadDocuments()`**: Uploads multiple documents to Document Engine
- **`downloadFiles()`**: Downloads processed documents
- File streaming and error handling utilities

## Output

- Processed documents are downloaded to the `downloads/` directory
- Each example provides detailed logging of its operations
- Document IDs are logged for tracking and debugging
