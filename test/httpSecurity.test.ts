import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import {
  assertHttpTransportSecurity,
  createMcpHttpAuthMiddleware,
  isLoopbackHost,
} from '../src/utils/HttpSecurity.js';
import { validateEnvironment } from '../src/utils/Environment.js';

describe('HTTP transport security', () => {
  describe('isLoopbackHost', () => {
    it.each(['localhost', 'LOCALHOST', '127.0.0.1', '127.255.255.254', '::1'])(
      'recognizes %s as loopback',
      host => {
        expect(isLoopbackHost(host)).toBe(true);
      }
    );

    it.each(['0.0.0.0', '192.168.1.2', '126.255.255.255', '128.0.0.1', '::'])(
      'recognizes %s as non-loopback',
      host => {
        expect(isLoopbackHost(host)).toBe(false);
      }
    );
  });

  describe('assertHttpTransportSecurity', () => {
    it.each([undefined, '', '   '])(
      'rejects non-loopback HTTP binding with token %j',
      MCP_HTTP_AUTH_TOKEN => {
        expect(() =>
          assertHttpTransportSecurity({
            MCP_TRANSPORT: 'http',
            MCP_HOST: '0.0.0.0',
            MCP_HTTP_AUTH_TOKEN,
          })
        ).toThrow('MCP_HTTP_AUTH_TOKEN');
      }
    );

    it('allows non-loopback HTTP binding with a token', () => {
      expect(() =>
        assertHttpTransportSecurity({
          MCP_TRANSPORT: 'http',
          MCP_HOST: '0.0.0.0',
          MCP_HTTP_AUTH_TOKEN: 'http-secret',
        })
      ).not.toThrow();
    });

    it.each(['localhost', '127.42.0.1', '::1'])(
      'allows loopback HTTP binding without a token for %s',
      MCP_HOST => {
        expect(() =>
          assertHttpTransportSecurity({ MCP_TRANSPORT: 'http', MCP_HOST })
        ).not.toThrow();
      }
    );

    it('does not apply the HTTP token requirement to stdio', () => {
      expect(() =>
        assertHttpTransportSecurity({ MCP_TRANSPORT: 'stdio', MCP_HOST: '0.0.0.0' })
      ).not.toThrow();
    });
  });

  describe('createMcpHttpAuthMiddleware', () => {
    function createApp(expectedToken = 'http-secret') {
      const app = express();
      app.all('/mcp', createMcpHttpAuthMiddleware(expectedToken));
      app.all('/mcp', (_req, res) => res.sendStatus(204));
      app.get('/health', (_req, res) => res.sendStatus(204));
      return app;
    }

    it.each([
      ['missing', undefined],
      ['malformed', 'Basic http-secret'],
      ['empty bearer token', 'Bearer '],
      ['wrong token', 'Bearer wrong-secret'],
    ])('returns 401 for a %s Authorization header', async (_description, authorization) => {
      const testRequest = request(createApp()).post('/mcp');
      if (authorization) {
        testRequest.set('Authorization', authorization);
      }

      await testRequest.expect(401);
    });

    it('allows the configured Bearer token', async () => {
      await request(createApp())
        .post('/mcp')
        .set('Authorization', 'Bearer http-secret')
        .expect(204);
    });

    it('allows the trimmed configured Bearer token', async () => {
      const originalEnv = process.env;
      process.env = {
        MCP_TRANSPORT: 'http',
        MCP_HOST: '0.0.0.0',
        MCP_HTTP_AUTH_TOKEN: 'secret ',
      };

      try {
        const expectedToken = validateEnvironment().MCP_HTTP_AUTH_TOKEN;
        expect(expectedToken).toBe('secret');
        if (!expectedToken) {
          throw new Error('Expected MCP_HTTP_AUTH_TOKEN to be configured');
        }

        await request(createApp(expectedToken))
          .post('/mcp')
          .set('Authorization', 'Bearer secret')
          .expect(204);
      } finally {
        process.env = originalEnv;
      }
    });

    it.each(['get', 'post', 'delete'] as const)('protects %s /mcp', async method => {
      await request(createApp())[method]('/mcp').expect(401);
      await request(createApp())
        [method]('/mcp')
        .set('Authorization', 'Bearer http-secret')
        .expect(204);
    });

    it('does not protect the health endpoint', async () => {
      await request(createApp()).get('/health').expect(204);
    });

    it('authenticates /mcp before parsing JSON request bodies', async () => {
      const app = express();
      app.all('/mcp', createMcpHttpAuthMiddleware('http-secret'));
      app.use(express.json());
      app.post('/mcp', (_req, res) => res.sendStatus(204));

      const malformedJson = '{"invalid"';

      await request(app)
        .post('/mcp')
        .set('Content-Type', 'application/json')
        .send(malformedJson)
        .expect(401);

      await request(app)
        .post('/mcp')
        .set('Content-Type', 'application/json')
        .set('Authorization', 'Bearer http-secret')
        .send(malformedJson)
        .expect(400);
    });
  });
});
