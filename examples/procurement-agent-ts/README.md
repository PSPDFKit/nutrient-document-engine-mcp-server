# Procurement Agent TypeScript

AI-powered procurement document processing system using LangGraph.js and Document Engine MCP Server.

## Overview

This system automatically processes procurement documents and performs 3-way matching between:
- **Purchase Orders (PO)** 
- **Invoices**
- **Payments**

It uses AI agents to classify documents, extract data, find matches, and generate comprehensive reports.

## Prerequisites

- Node.js 18+
- Document Engine running locally
- MCP server running (default: http://localhost:5100/mcp)
- OpenAI API key set in the environment

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
   
4. **Run the example**:
   
   ```bash
   pnpm start
   ```

The system will automatically:
1. Load all PDFs from `../../langgraphjs/assets/procurement/pdfs/`
2. Upload them to Document Engine
3. Classify each document using AI
4. Extract structured data (PO numbers, invoice numbers, amounts, etc.)
5. Perform 3-way matching to find related documents
6. Generate a comprehensive report with insights
