# OpenAI Agents SDK Document Engine Examples

This directory contains complete examples demonstrating how to use the OpenAI Agents SDK with the Document Engine MCP (Model Context Protocol) server for intelligent PDF document processing workflows.

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

3. **Build Document Engine MCP Server**:
   From the main project directory:
   ```bash
   pnpm build && MCP_TRANSPORT=http pnpm start
   ```

## Available Examples

### 1. Document Assembly (`document-assembler.js`)

Assembles multiple documents into a professional final document with annotations, headers, and watermarks using OpenAI Agents SDK.

**Usage:**

```bash
pnpm document-assembler ../assets/cover.pdf ../assets/contract.pdf ../assets/thanks.pdf
```

**Features:**

- Intelligent document analysis and ordering using Agent handoffs
- Professional annotations and section headers
- Watermark application
- Stakeholder version creation

### 2. Document Compliance Processor (`document-processor.js`)

Autonomous regulatory monitoring system for document compliance using specialized agents.

**Usage:**

```bash
pnpm document-processor ../assets/credit-card-application.pdf
```

**Features:**

- Regulatory adherence scanning with specialized compliance agents
- Automatic redaction of sensitive data
- Audit trail creation
- Compliance report generation

### 3. Form Processing Automation (`form-processor.js`)

Intelligent form processing automation that extracts data from a source document and fills a target form.

**Usage:**

```bash
pnpm form-processor ../assets/credit-card-application.pdf ../assets/form.pdf
```

**Features:**

- Two-document workflow: extracts data from source and fills target form
- Intelligent data mapping between source document and form fields
- Form field extraction and analysis
- Data validation and compliance checking
- Automated form processing with audit trails
- Smart data transformation and field matching

### 4. Report Generation Engine (`report-generator.js`)

Autonomous business intelligence report generation from data files using OpenAI Agents.

**Usage:**

```bash
pnpm report-generator ../assets/finance.xlsx
```

**Features:**

- Data analysis and visualization with specialized agents
- Professional report formatting
- Chart and graph generation
- Business intelligence insights through agent collaboration

### 5. Smart Contract Processing Pipeline (`contract-processor.js`)

Autonomous agent system for monitoring and processing legal agreements with handoffs.

**Usage:**

```bash
pnpm contract-processor ../assets/contract.pdf
```

**Features:**

- Legal document analysis with specialized legal agents
- Contract term extraction
- Compliance verification through agent workflows
- Risk assessment reporting with handoffs to specialized agents

### 6. Data Extraction Showcase (`data-extraction-showcase.js`)

Comprehensive demonstration of Document Engine's data extraction capabilities using specialized agents.

**Usage:**

```bash
# Using npm script
pnpm data-extraction ../assets/ocrTest.pdf
```

**Features:**

- OCR text extraction and quality analysis
- Table extraction with structure preservation
- Key-value pair extraction using AI
- Advanced search with regex patterns
- Content analysis and classification
- Comprehensive data extraction reporting

## Output

- Processed documents are downloaded to the `downloads/` directory
- Each example provides detailed logging of its operations
