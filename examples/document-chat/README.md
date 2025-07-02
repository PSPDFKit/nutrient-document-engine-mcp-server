# Document Chat

A chat interface for interacting with documents through the Document Engine MCP server using LangGraph and Next.js.

## Overview

Document Chat is a monorepo application that provides a conversational interface for interacting with documents. It consists of two main components:

- **Agents**: A LangGraph-powered agent that connects to the Document Engine MCP server to provide document-related functionality
- **Web**: A Next.js web application that provides a user interface for chatting with the agent

## Prerequisites

- Node.js v20 or later
- pnpm v10 or later
- Document Engine MCP server running (locally or remotely)
- API keys for the required services (see Environment Variables)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Required API keys
OPENAI_API_KEY=""  # Required for the LLM
MCP_SERVER_URL="http://localhost:5100/mcp"  # URL to your Document Engine MCP server
```

## Installation

```bash
# Install dependencies
pnpm install
```

## Development

```bash
# Start both the web and agents applications in development mode
pnpm dev

# Start only the web application
pnpm turbo dev --filter=web

# Start only the agents application
pnpm turbo dev --filter=agents
```

The web application will be available at http://localhost:3000 and the LangGraph agent will be available at http://localhost:2024.

## Building for Production

```bash
# Build all applications
pnpm build

# Build only the web application
pnpm turbo build --filter=web

# Build only the agents application
pnpm turbo build --filter=agents
```

## Architecture

### Agents Application

The agents application uses LangGraph to create a conversational agent that can interact with documents through the Document Engine MCP server. The agent uses:

- OpenAI's GPT-4.1-mini model (configurable)
- LangGraph for agent orchestration
- Document Engine MCP client for document-related tools

### Web Application

The web application provides a user interface for chatting with the agent. It uses:

- Next.js for the web framework
- React for the UI
- TailwindCSS for styling
- LangGraph SDK for connecting to the agent

## Customization

You can customize the agent by modifying the following files:

- `apps/agents/src/react-agent/graph.ts`: The main agent graph
- `apps/agents/src/react-agent/configuration.ts`: Agent configuration

## License

See the LICENSE file in the root directory.
