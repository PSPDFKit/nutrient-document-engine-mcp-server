# Nutrient Document Engine MCP Server

![Document workflows using natural language](https://raw.githubusercontent.com/PSPDFKit/nutrient-document-engine-mcp-server/main/resources/readme-header.png)

[![npm](https://img.shields.io/npm/v/%40nutrient-sdk/document-engine-mcp-server)](https://www.npmjs.com/package/@nutrient-sdk/document-engine-mcp-server)

**Give AI agents full document processing power — self-hosted, on your infrastructure.**

Connect AI assistants and agents to [Nutrient Document Engine](https://www.nutrient.io/document-engine/) through the Model Context Protocol. Extract text, fill forms, redact sensitive data, add annotations, split and merge documents, and more — all through natural language.

## What You Can Do

Once configured, you (or your agent) can interact with documents through natural language:

**You:** *"What documents do I have available?"*
**AI:** *"I can see you have 3 documents: annual-report.pdf, contract-draft.pdf, and tax-form-2023.pdf. Would you like me to analyze any of these?"*

**You:** *"Extract all the names and phone numbers from these invoices"*
**AI:** *"I found 12 contacts: John Smith (555-0123), Sarah Johnson (555-0456)..."*

**You:** *"Redact all social security numbers from these tax forms"*
**AI:** *"I've identified and redacted 3 SSNs across 2 documents. The redacted versions are ready."*

**You:** *"Split this 50-page contract into separate sections"*
**AI:** *"I've split the contract into 5 sections: Terms (pages 1-8), Payment (pages 9-15)..."*

**You:** *"Fill out the application form with the data from the cover letter"*
**AI:** *"I've extracted the applicant's details and filled all 12 form fields. Ready for review."*

## Quick Start

![Document Engine MCP Server + Claude Desktop](https://raw.githubusercontent.com/PSPDFKit/nutrient-document-engine-mcp-server/main/resources/claude-document-engine-mcp.gif?raw=true)

### Prerequisites
- **Docker Compose** — [Download from Docker](https://docs.docker.com/compose/). Required for running Document Engine locally.
- **Node.js 18+** — The MCP server runs via `npx`.

### 1. Start Nutrient Document Engine

```bash
git clone https://github.com/PSPDFKit/nutrient-document-engine-mcp.git
cd nutrient-document-engine-mcp
docker-compose up -d
```

> Document Engine runs with an evaluation license by default. See [Removing Evaluation Limitations](#removing-evaluation-watermarks-and-limitations) for production use.

### 2. Configure Your AI Client

Choose your platform and add the configuration:

<details open>
<summary><strong>Claude Desktop</strong></summary>

Open Settings → Developer → Edit Config, then add:

```json
{
  "mcpServers": {
    "nutrient-document-engine": {
      "command": "npx",
      "args": ["-y", "@nutrient-sdk/document-engine-mcp-server"],
      "env": {
        "DASHBOARD_USERNAME": "admin",
        "DASHBOARD_PASSWORD": "password",
        "DOCUMENT_ENGINE_BASE_URL": "http://localhost:5000",
        "DOCUMENT_ENGINE_API_AUTH_TOKEN": "secret"
      }
    }
  }
}
```
</details>

<details>
<summary><strong>Cursor</strong></summary>

Create `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "nutrient-document-engine": {
      "command": "npx",
      "args": ["-y", "@nutrient-sdk/document-engine-mcp-server"],
      "env": {
        "DOCUMENT_ENGINE_BASE_URL": "http://localhost:5000",
        "DOCUMENT_ENGINE_API_AUTH_TOKEN": "secret"
      }
    }
  }
}
```
</details>

<details>
<summary><strong>Windsurf</strong></summary>

Add to `~/.codeium/windsurf/mcp_config.json`:

```json
{
  "mcpServers": {
    "nutrient-document-engine": {
      "command": "npx",
      "args": ["-y", "@nutrient-sdk/document-engine-mcp-server"],
      "env": {
        "DOCUMENT_ENGINE_BASE_URL": "http://localhost:5000",
        "DOCUMENT_ENGINE_API_AUTH_TOKEN": "secret"
      }
    }
  }
}
```
</details>

<details>
<summary><strong>VS Code (GitHub Copilot)</strong></summary>

Add to `.vscode/settings.json` in your project:

```json
{
  "mcp": {
    "servers": {
      "nutrient-document-engine": {
        "command": "npx",
        "args": ["-y", "@nutrient-sdk/document-engine-mcp-server"],
        "env": {
          "DOCUMENT_ENGINE_BASE_URL": "http://localhost:5000",
          "DOCUMENT_ENGINE_API_AUTH_TOKEN": "secret"
        }
      }
    }
  }
}
```
</details>

<details>
<summary><strong>Other MCP Clients</strong></summary>

Any MCP-compatible client can connect. The server supports both **stdio** (default) and **HTTP** transports:

```bash
# Stdio transport (default)
DOCUMENT_ENGINE_BASE_URL=http://localhost:5000 DOCUMENT_ENGINE_API_AUTH_TOKEN=secret npx @nutrient-sdk/document-engine-mcp-server

# HTTP transport (for programmatic integration)
MCP_TRANSPORT=http PORT=5100 DOCUMENT_ENGINE_BASE_URL=http://localhost:5000 DOCUMENT_ENGINE_API_AUTH_TOKEN=secret npx @nutrient-sdk/document-engine-mcp-server
```
</details>

### 3. Restart Your AI Client

### 4. Upload and Process Documents

1. Open http://localhost:5100/dashboard in your browser
2. Upload documents using the drag-and-drop interface
3. Switch to your AI client and start processing: *"List my documents and extract text from the contract"*

## Available Tools

### Document Discovery
| Tool | Description |
|------|-------------|
| `list_documents` | Browse and filter documents with pagination and sorting |
| `read_document_info` | Get document metadata: title, page count, creation date, file size |

### Content Extraction
| Tool | Description |
|------|-------------|
| `extract_text` | Extract text with OCR support, coordinates, and page range selection |
| `search` | Search by text, regex, or preset patterns (emails, phone numbers, etc.) |
| `extract_tables` | Extract table data into structured formats |
| `extract_key_value_pairs` | Extract structured key-value data using AI |
| `extract_form_data` | Extract form field values from interactive PDF forms |
| `render_document_page` | Render pages as high-quality images |

### Document Editing
| Tool | Description |
|------|-------------|
| `split_document` | Split documents at specified page boundaries |
| `merge_document_pages` | Merge pages from multiple documents |
| `add_watermark` | Add text or image watermarks with positioning and opacity controls |
| `duplicate_document` | Create exact document copies for versioning |
| `add_new_page` | Add new pages to existing documents |
| `rotate_pages` | Rotate document pages |

### Annotations
| Tool | Description |
|------|-------------|
| `add_annotation` | Add highlights, notes, stamps, and links |
| `read_annotations` | Read and filter annotations by type, author, or page |
| `delete_annotations` | Remove specific annotations |

### Forms
| Tool | Description |
|------|-------------|
| `fill_form_fields` | Programmatically fill PDF form fields with validation |

### Security & Redaction
| Tool | Description |
|------|-------------|
| `create_redaction` | Mark sensitive content for redaction (SSNs, credit cards, emails, phone numbers, and more) |
| `apply_redactions` | Permanently apply redactions to remove sensitive content |

### System
| Tool | Description |
|------|-------------|
| `health_check` | Monitor system connectivity and Document Engine status |

## Examples & Documentation

### Examples
| Example | Description |
|---------|-------------|
| [LangGraph Workflows](examples/langgraphjs) | Contract processing, compliance, form automation, report generation |
| [OpenAI Agents SDK](examples/openai-agents) | Document assembly, compliance, data extraction with agent handoffs |
| [Document Chat Interface](examples/document-chat) | Full-stack web app with React + LangGraph |
| [Procurement Agent](examples/procurement-agent-ts) | AI agent for 3-way matching of POs, invoices, and payments |

### Documentation
| Doc | Description |
|-----|-------------|
| [Configuration Guide](docs/configuration.md) | Environment variables, transport modes, dashboard setup |
| [Features Reference](docs/features.md) | Detailed description of all 21 document processing tools |

## Why Nutrient?

### The Read-Write Gap

AI can read and understand documents — but most tools stop there. Nutrient gives AI agents the ability to actually **manipulate** documents: extract data, fill forms, redact PII, add annotations, split, merge, watermark, and more.

- **Beyond PDF reading** — Not just text extraction. Full document manipulation with 21 specialized tools.
- **Self-hosted** — Your documents stay on your infrastructure. No data leaves your network.
- **Production-grade** — Trusted by thousands of companies for mission-critical document processing.
- **Standards-compliant** — PDF/A archiving, redaction presets for regulatory compliance (GDPR, HIPAA, PCI-DSS).
- **AI-native** — Built for AI agent workflows with structured responses, error handling, and batch operations.
- **Framework-agnostic** — Works with Claude, OpenAI, LangChain, CrewAI, or any MCP-compatible system.

## Use with AI Agent Frameworks

This MCP server works with any platform that supports the Model Context Protocol:

- **[Claude Desktop](https://claude.ai/download)** — Direct MCP integration
- **[Cursor](https://cursor.com)** — AI-powered IDE with MCP support
- **[Windsurf](https://codeium.com/windsurf)** — AI-powered IDE with MCP support
- **[VS Code + Copilot](https://code.visualstudio.com/)** — GitHub Copilot MCP integration
- **[LangChain](https://langchain.com)** / **[LangGraph](https://langchain.com/langgraph)** — See [examples](examples/langgraphjs)
- **[OpenAI Agents SDK](https://github.com/openai/openai-agents-python)** — See [examples](examples/openai-agents)
- **Custom agents** — Any MCP-compatible system via stdio or HTTP transport

## Removing Evaluation Watermarks and Limitations

Document Engine runs in evaluation mode with limitations by default. To remove them:

1. **Contact Sales** to purchase a license from [Nutrient](https://www.nutrient.io/contact-sales)
2. **Configure your license** by setting the `ACTIVATION_KEY` environment variable in your [Docker Compose configuration](docker-compose.yml)
3. **Restart Document Engine** to apply the license

For detailed licensing configuration, see the [Document Engine licensing guide](https://www.nutrient.io/guides/document-engine/about/licensing/).

## Server-Based Document Engine Setups

- **On-Premise:** Follow the [Document Engine installation guide](https://www.nutrient.io/getting-started/document-engine/)
- **Managed Cloud:** Use a hosted instance — [setup guide](https://www.nutrient.io/guides/document-engine/deployment/managed-document-engine/)

## Troubleshooting

**Docker containers not starting?**
- Ensure Docker Desktop is running
- Check port 5000 isn't in use: `lsof -i :5000`
- View logs: `docker-compose logs -f`

**MCP server not connecting to Document Engine?**
- Verify Document Engine is healthy: `curl http://localhost:5000/healthcheck`
- Check the `DOCUMENT_ENGINE_BASE_URL` is correct
- Use the `health_check` tool to diagnose connectivity issues

**Dashboard not loading?**
- Ensure both `DASHBOARD_USERNAME` and `DASHBOARD_PASSWORD` are set
- Check port 5100 isn't in use
- Try accessing http://localhost:5100/health first

**Server not appearing in Claude Desktop?**
- Ensure Node.js 18+ is installed (`node --version`)
- Check the config file path is correct for your OS
- Restart Claude Desktop completely (check Task Manager/Activity Monitor)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, testing guidelines, and how to submit pull requests.

## License

MIT License — see [LICENSE](LICENSE) for details.
