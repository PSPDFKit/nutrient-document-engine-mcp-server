# Configuration Guide

This guide covers configuration options, environment variables, transport modes, and deployment considerations for the Nutrient Document Engine MCP Server.

## Environment Variables

### Required Configuration

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `DOCUMENT_ENGINE_BASE_URL` | Your Document Engine instance URL | `http://localhost:5000` | `https://api.mycompany.com` |
| `DOCUMENT_ENGINE_API_AUTH_TOKEN` | API authentication token | `secret` | `your-secure-token-here` |

### Optional Configuration

| Variable             | Description                                                                                     | Default     | Example    |
|----------------------|-------------------------------------------------------------------------------------------------|-------------|------------|
| `MCP_TRANSPORT`      | Transport type - "stdio" or "http"                                                              | `stdio`     | `http`     |
| `MCP_HOST`           | The host as IP address for the Dashboard and the MCP server and Dashboard                       | `localhost` | `0.0.0.0`  |
| `PORT`               | HTTP server port (HTTP transport only)                                                          | `5100`      | `8080`     |
| `MAX_RETRIES`        | Number of API request retries                                                                   | `3`         | `5`        |
| `CONNECTION_TIMEOUT` | Request timeout in milliseconds                                                                 | `30000`     | `60000`    |
| `RETRY_DELAY`        | Delay between retries in milliseconds                                                           | `1000`      | `2000`     |
| `MAX_CONNECTIONS`    | Maximum concurrent connections                                                                  | `100`       | `200`      |
| `LOG_LEVEL`          | Logging level ("debug", "info", "notice", "warning", "error", "critical", "alert", "emergency") | `info`      | `error`    |
| `DASHBOARD_USERNAME` | Dashboard authentication username (required to enable dashboard)                                | `undefined` | `admin`    |
| `DASHBOARD_PASSWORD` | Dashboard authentication password (required to enable dashboard)                                | `undefined` | `password` |

> MCP_HOST information
>  Setting host to `127.0.0.1` (localhost) ensure that the Dashboard and the MCP server is only accessible locally 
>  Setting host to `0.0.0.0` make it so that the Dashboard and the MCP server is accessible from any IP address assigned to the machine
>
> Note: Host header validation (DNS rebinding protection) is only applied when `MCP_HOST` is a specific host (for example `localhost`, `127.0.0.1`, or `::1`). When binding to all interfaces (`0.0.0.0` or `::`), host validation is not applied; use other protections (auth, firewall, reverse proxy) if exposing the server.

## Transport Modes

### Stdio Transport (Default)

The default transport mode for direct MCP communication over stdin/stdout. Used with Claude Desktop and local development.

**Usage:**
```bash
npx @nutrient-sdk/document-engine-mcp-server
```

**Characteristics:**
- Direct process communication via stdin/stdout.
- No network overhead for MCP communication.
- Web dashboard available on HTTP port when credentials are provided.
- Default for Claude Desktop.
- Minimal configuration required.

**Configuration:**
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

### HTTP Transport

HTTP-based transport with session management, dashboard interface, and REST endpoints.

**Usage:**
```bash
MCP_TRANSPORT=http PORT=5100 npx @nutrient-sdk/document-engine-mcp-server
```

**Characteristics:**
- MCP communication via HTTP at `/mcp` endpoint.
- UUID-based session management.
- Built-in dashboard at `/dashboard` when credentials are provided.
- Health monitoring at `/health`.
- Multiple concurrent client support.

**Configuration:**
```bash
# Basic HTTP setup
MCP_TRANSPORT=http npx @nutrient-sdk/document-engine-mcp-server

# Custom port and credentials
MCP_TRANSPORT=http PORT=8080 DASHBOARD_USERNAME=admin DASHBOARD_PASSWORD=secure npx @nutrient-sdk/document-engine-mcp-server
```

## Dashboard Interface

The web dashboard is available in both transport modes at `http://localhost:5100/dashboard` when both `DASHBOARD_USERNAME` and `DASHBOARD_PASSWORD` environment variables are provided

### Features
- **Document Browser**: View and manage uploaded documents.
- **File Upload**: Drag-and-drop document upload interface.
- **Health Monitoring**: Real-time system status and connectivity.
- **Authentication**: Basic auth protection for security.

### Security Configuration
```bash
# Custom dashboard credentials
DASHBOARD_USERNAME=your_username DASHBOARD_PASSWORD=your_secure_password npx @nutrient-sdk/document-engine-mcp-server
```

## Health Monitoring

### Startup Health Checks
The server includes automatic health polling to ensure Document Engine connectivity:

- **Max Attempts**: 30 connection attempts (configurable via `DOCUMENT_ENGINE_POLL_MAX_RETRIES`)
- **Retry Interval**: 2 seconds between attempts (configurable via `DOCUMENT_ENGINE_POLL_RETRY_DELAY`)
- **Total Timeout**: 60 seconds maximum startup time.

### Health Check Tool
Use the `health_check` tool to monitor system status programmatically:

```javascript
// Returns comprehensive health information
{
  "status": "healthy",
  "document_engine": {
    "url": "http://localhost:5000",
    "responding": true,
    "response_time": "45ms"
  },
  "server": {
    "uptime": "2h 15m",
    "memory_usage": "156MB"
  }
}
```

### HTTP Health Endpoint
When using HTTP transport, monitor health via REST endpoint:

```bash
curl http://localhost:5100/health
```

## Document Engine Setup Options

### Local Development (Docker Compose)
Perfect for testing and development:

```bash
git clone https://github.com/PSPDFKit/nutrient-document-engine-mcp.git
cd nutrient-document-engine-mcp
docker-compose up -d
```

**Includes:**
- Document Engine API at `http://localhost:5000`.
- PostgreSQL database for storage.
- Default authentication token: `secret`.
- Web dashboard for document management.

### On-Premise Installation
For production deployments, follow the [Nutrient Document Engine installation guide](https://www.nutrient.io/getting-started/document-engine/).

**Requirements:**
- Linux server or container platform.
- PostgreSQL or compatible database.
- Network access for API communication.
- SSL certificates for production use.

### Managed Cloud Instance
Use Nutrient's hosted Document Engine service - [setup guide](https://www.nutrient.io/guides/document-engine/deployment/managed-document-engine/).

**Benefits:**
- Fully managed infrastructure.
- Automatic scaling and updates.
- Built-in monitoring and support.
- Enterprise security and compliance.

## Document Management

### Document Storage
Documents are stored in your Document Engine's database:

- **Database**: PostgreSQL (default) or compatible.
- **Storage**: Binary data with metadata indexing.
- **Retention**: Controlled by your Document Engine configuration.
- **Backup**: Standard database backup procedures apply.

### Document Upload Methods

1. **Document Engine API**: Direct API upload
   ```bash
   curl -X POST http://localhost:5000/api/documents \
     -H "Authorization: Token token=\"secret\"" \
     -F "file=@document.pdf"
   ```

2. **Dashboard Interface**: Web-based drag-and-drop upload (50MB file size limit)

3. **Third-party Tools**: Any tool compatible with Document Engine API

### Document Discovery
Use the `list_documents` tool to discover available documents:

```javascript
{
  "limit": 50,
  "offset": 0,
  "sort_by": "created_at",
  "sort_order": "desc",
  "title": "contract" // Optional filter
}
```

## Performance Optimization

### Connection Pooling
The MCP server uses a client factory pattern with connection management:

- **Max Connections**: 100 concurrent connections (configurable via `MAX_CONNECTIONS`).
- **Connection Timeout**: 30 seconds (configurable via `CONNECTION_TIMEOUT`).
- **Retry Logic**: 3 attempts with 1-second delay (configurable via `MAX_RETRIES` and `RETRY_DELAY`).

### Caching Strategy
- **Document Metadata**: Cached for fast discovery operations.
- **Health Checks**: Cached for 30 seconds to reduce overhead.
- **Session Data**: Maintained in memory for HTTP transport.

### Large Document Handling
- **Streaming**: Large files processed in chunks.
- **Page Range Support**: Process specific pages to reduce memory usage.
- **Timeout Management**: Configurable timeouts for large operations.

## Security Considerations

### Authentication
- **API Tokens**: Secure token-based authentication with Document Engine.
- **Dashboard Auth**: Basic authentication for web interface.
- **Environment Variables**: Store credentials securely, never in code.

### Network Security
- **HTTPS**: Use SSL/TLS for production deployments.
- **Firewall**: Restrict access to necessary ports only.
- **VPN**: Consider VPN access for sensitive document processing.

### Data Privacy
- **Document Retention**: Configure appropriate retention policies.
- **Audit Logging**: Enable audit trails for compliance.
- **Redaction**: Use built-in redaction tools for sensitive data.
- **Access Control**: Implement role-based access controls.

## Troubleshooting

### Common Issues

**Connection Refused**
```bash
# Check Document Engine status
curl http://localhost:5000/health

# Verify environment variables
echo $DOCUMENT_ENGINE_BASE_URL
echo $DOCUMENT_ENGINE_API_AUTH_TOKEN
```

**Authentication Errors**
- Verify API token matches Document Engine configuration.
- Check token expiration and renewal policies.
- Ensure proper token format and encoding.

**Performance Issues**
- Monitor Document Engine resource usage.
- Check database performance and indexing.
- Review network latency between services.
- Consider scaling Document Engine horizontally.

### Debug Logging
```bash
LOG_LEVEL=debug npx @nutrient-sdk/document-engine-mcp-server
```
