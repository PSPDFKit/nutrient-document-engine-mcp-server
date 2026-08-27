# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.3] - 2026-08-27

### Fixed

- Aligned `.env.example`, documentation, and tests on `DOCUMENT_ENGINE_API_AUTH_TOKEN` (the variable the server actually reads). (#13)
- The optional HTTP transport now fails closed: it refuses to start without inbound authentication configured instead of listening unauthenticated. (#13)

### Added

- MCP registry metadata: `server.json` and the `mcpName` field (`io.github.PSPDFKit/nutrient-document-engine-mcp-server`), first published to the official MCP registry as 0.0.3. (#12)

## [0.0.2]

- Published to npm before this changelog existed; no release notes were recorded and the release was not tagged in git.

## [0.0.1]

- Initial npm release.
