import { createHash, timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';

interface HttpTransportSecurityConfig {
  MCP_TRANSPORT: 'stdio' | 'http';
  MCP_HOST: string;
  MCP_HTTP_AUTH_TOKEN?: string;
}

export function isLoopbackHost(host: string): boolean {
  const normalizedHost = host.trim().toLowerCase();

  if (normalizedHost === 'localhost' || normalizedHost === '::1') {
    return true;
  }

  const ipv4Octets = normalizedHost.split('.');
  if (ipv4Octets.length !== 4 || ipv4Octets.some(octet => !/^\d{1,3}$/.test(octet))) {
    return false;
  }

  const numericOctets = ipv4Octets.map(Number);
  return numericOctets[0] === 127 && numericOctets.every(octet => octet >= 0 && octet <= 255);
}

export function assertHttpTransportSecurity(config: HttpTransportSecurityConfig): void {
  if (config.MCP_TRANSPORT !== 'http' || isLoopbackHost(config.MCP_HOST)) {
    return;
  }

  if (!config.MCP_HTTP_AUTH_TOKEN || config.MCP_HTTP_AUTH_TOKEN.trim().length === 0) {
    throw new Error(
      'MCP_HTTP_AUTH_TOKEN is required when MCP_TRANSPORT=http binds to a non-loopback MCP_HOST'
    );
  }
}

function hashToken(token: string): Buffer {
  return createHash('sha256').update(token, 'utf8').digest();
}

export function createMcpHttpAuthMiddleware(expectedToken: string): RequestHandler {
  if (expectedToken.length === 0) {
    throw new Error('MCP_HTTP_AUTH_TOKEN must not be empty');
  }

  const expectedDigest = hashToken(expectedToken);

  return (req, res, next) => {
    const authorization = req.get('authorization');
    const match = authorization?.match(/^Bearer (.+)$/i);
    const presentedDigest = hashToken(match?.[1] ?? '');

    if (!match || !timingSafeEqual(presentedDigest, expectedDigest)) {
      res.status(401).send('Unauthorized');
      return;
    }

    next();
  };
}
