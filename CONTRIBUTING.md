# Contributing to Nutrient Document Engine MCP Server

We welcome contributions to the Nutrient Document Engine MCP Server! This document outlines the process for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/PSPDFKit/nutrient-document-engine-mcp.git`
3. Install dependencies: `pnpm install`
4. Build the project: `pnpm build`
5. Run tests: `pnpm test`

## Development Process

1. Create a new branch for your changes
2. Set up your development environment (see [Development Setup](#development-setup))
3. Make your changes
4. Run `pnpm lint` to ensure code style compliance
5. Run `pnpm format` to format the code
6. Run `pnpm test` to verify all tests pass
7. Test with real Document Engine instance (docker-compose.yml)
8. Submit a pull request

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 9.10.0
- Document Engine instance (for integration testing and examples)

### Environment Configuration

1. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

2. Configure your environment variables:

   ```env
   # Required for integration tests
   DOCUMENT_ENGINE_BASE_URL=http://localhost:5000
   DOCUMENT_ENGINE_API_AUTH_TOKEN=secret

   # Optional configuration
   MCP_TRANSPORT=stdio
   LOG_LEVEL=info
   ```

### Starting Document Engine

For development and testing, start a local Document Engine instance:

```bash
# Start Document Engine with PostgreSQL
docker-compose up -d

# Verify it's running
curl http://localhost:5000/healthcheck
```

## Pull Request Guidelines

- Follow the existing code style and architectural patterns
- Include tests for new functionality (both unit and integration tests)
- Update documentation as needed (README.md, and specifications)
- Keep changes focused and atomic
- Provide a clear description of changes and their purpose
- Ensure all CI checks pass
- Add examples in the `examples/` directory for new features when appropriate

## Code Style and Architecture

### Patterns to Follow

- **Tool Implementation**: Follow existing patterns in `src/tools/`
- **Error Handling**: Use structured error handling with user-friendly messages
- **Type Safety**: Maintain strict TypeScript compliance
- **Markdown Output**: All tools should return structured markdown for AI consumption
- **Environment Validation**: Validate configuration at startup
- **Logging**: Use structured logging with sensitive data redaction

### Adding New Tools

When adding new MCP tools:

1. Create the tool implementation in `src/tools/[category]/`
2. Add TypeScript interfaces in `src/api/Types.ts` if needed
3. Register the tool in `src/mcpTools.ts` with Zod schema validation
4. Add comprehensive unit tests in `test/tools/[category]/`
5. Add integration tests that work with real Document Engine API
6. Update tool documentation and specifications

## Testing

The project uses [Vitest](https://vitest.dev/) as the test framework. The test suite includes:

- **Unit tests**: API calls and business logic with mocked dependencies
- **Integration tests**: Real Document Engine API calls to ensure message format compliance
- **Type checking**: Automated TypeScript validation

### Running Tests

```bash
# Run all tests
pnpm test

# Run only unit tests (fast)
pnpm test:unit

# Run only integration tests (requires Document Engine)
pnpm test:integration

# Watch mode for development
pnpm test:watch

# Type checking
pnpm pretest
```

### Integration Test Setup

Integration tests require a running Document Engine instance:

1. Start Document Engine: `docker-compose up -d`
2. Wait for startup (automatic polling will handle this)
3. Run integration tests: `pnpm test:integration`

The integration tests will:

- Upload test documents to Document Engine
- Execute real API calls through the MCP tools
- Validate response formats and data structures
- Clean up test documents after completion

## Running the Server Locally

### Stdio Transport (Default)

```bash
# Development mode
pnpm start

# With custom configuration
DOCUMENT_ENGINE_BASE_URL=https://your-instance.com pnpm start
```

### HTTP Transport

```bash
# Start HTTP server with dashboard
MCP_TRANSPORT=http PORT=5100 pnpm start

# Access dashboard at http://localhost:5100/dashboard
```

## Project Structure

```
src/
├── api/              # API clients and type definitions
├── tools/            # MCP tool implementations
│   ├── discovery/    # Document discovery tools
│   ├── extraction/   # Content extraction tools
│   ├── forms/        # Form processing tools
│   ├── annotations/  # Annotation management tools
│   └── document-editing/ # Document manipulation tools
├── utils/            # Shared utilities
├── dashboard/        # HTTP dashboard implementation
└── index.ts          # Main MCP server

test/
├── tools/            # Tool-specific tests
├── integration.test.ts # End-to-end API tests
└── helpers/          # Test utilities

examples/
├── document-chat/    # Full-stack chat application
└── langgraphjs/      # LangGraph automation examples
```

## Documentation

When contributing, please update relevant documentation:

- **README.md**: User-facing documentation and setup instructions
- **CLAUDE.md**: Development guidelines and architecture notes
- **docs/specification.md**: Technical specifications
- **Tool READMEs**: Example-specific documentation in `examples/`

## Evaluation and Performance

The project includes an evaluation system for testing tool performance:

```bash
# Run evaluation suite
pnpm eval

# Results are saved to evaluation/results/
```

This helps ensure contributions maintain or improve tool quality and performance.

## Reporting Issues

- Use the [GitHub issue tracker](https://github.com/PSPDFKit/nutrient-document-engine-mcp/issues)
- Search existing issues before creating a new one
- Provide clear reproduction steps and environment details
- Include relevant logs and error messages (with sensitive data redacted)
- Specify Document Engine version and configuration when applicable

## Release Process

Releases follow semantic versioning:

- **Patch**: Bug fixes and small improvements
- **Minor**: New features and tool additions
- **Major**: Breaking changes to API or architecture

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

## Community

- Join discussions in GitHub Issues and Pull Requests
- Help other contributors by reviewing PRs and sharing knowledge

Thank you for contributing to the Nutrient Document Engine MCP Server!
