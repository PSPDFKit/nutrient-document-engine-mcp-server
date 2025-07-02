import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateEnvironment, getEnvironment } from '../src/utils/Environment.js';

describe('Environment Validation', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
  });

  afterEach(async () => {
    // Restore original environment
    process.env = originalEnv;
    // Clear the cached environment by reimporting the module
    vi.resetModules();
  });

  describe('validateEnvironment', () => {
    it('should validate required environment variables', () => {
      process.env = {
        DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: 'test-token-123',
      };

      const result = validateEnvironment();

      expect(result).toEqual({
        DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: 'test-token-123',
        DASHBOARD_PASSWORD: undefined,
        DASHBOARD_USERNAME: undefined,
        CONNECTION_TIMEOUT: 30000,
        MAX_RETRIES: 3,
        RETRY_DELAY: 1000,
        MAX_CONNECTIONS: 100,
        LOG_LEVEL: 'INFO',
        MCP_TRANSPORT: 'stdio',
        PORT: 5100,
        MCP_HOST: 'localhost',
        DOCUMENT_ENGINE_POLL_MAX_RETRIES: 30,
        DOCUMENT_ENGINE_POLL_RETRY_DELAY: 2000,
      });
    });

    it('should use provided optional values', () => {
      process.env = {
        DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: 'test-token-123',
        CONNECTION_TIMEOUT: '45000',
        MAX_RETRIES: '5',
        RETRY_DELAY: '2000',
        MAX_CONNECTIONS: '200',
        LOG_LEVEL: 'DEBUG',
      };

      const result = validateEnvironment();

      expect(result).toEqual({
        DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: 'test-token-123',
        DASHBOARD_PASSWORD: undefined,
        DASHBOARD_USERNAME: undefined,
        CONNECTION_TIMEOUT: 45000,
        MAX_RETRIES: 5,
        RETRY_DELAY: 2000,
        MAX_CONNECTIONS: 200,
        LOG_LEVEL: 'DEBUG',
        MCP_TRANSPORT: 'stdio',
        PORT: 5100,
        MCP_HOST: 'localhost',
        DOCUMENT_ENGINE_POLL_MAX_RETRIES: 30,
        DOCUMENT_ENGINE_POLL_RETRY_DELAY: 2000,
      });
    });

    it('should use defaults when environment is empty', () => {
      process.env = {};

      const result = validateEnvironment();

      expect(result.DOCUMENT_ENGINE_BASE_URL).toBe('http://localhost:5000');
      expect(result.DOCUMENT_ENGINE_API_AUTH_TOKEN).toBe('secret');
      expect(result.PORT).toBe(5100);
    });

    it('should throw error for invalid URL', () => {
      process.env = {
        DOCUMENT_ENGINE_BASE_URL: 'not-a-valid-url',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: 'test-token-123',
      };

      expect(() => validateEnvironment()).toThrow('DOCUMENT_ENGINE_BASE_URL must be a valid URL');
    });

    it('should throw error for empty auth token', () => {
      process.env = {
        DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: '',
      };

      expect(() => validateEnvironment()).toThrow('DOCUMENT_ENGINE_API_AUTH_TOKEN is required');
    });

    it('should throw error for invalid numeric values', () => {
      process.env = {
        DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: 'test-token-123',
        CONNECTION_TIMEOUT: 'not-a-number',
      };

      expect(() => validateEnvironment()).toThrow('Expected number, received nan');
    });

    it('should throw error for invalid log level', () => {
      process.env = {
        DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: 'test-token-123',
        LOG_LEVEL: 'INVALID_LEVEL',
      };

      expect(() => validateEnvironment()).toThrow('Invalid enum value');
    });

    it('should accept all valid log levels', () => {
      const validLevels = ['ERROR', 'WARN', 'WARNING', 'INFO', 'DEBUG'];

      for (const level of validLevels) {
        process.env = {
          DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com',
          DOCUMENT_ENGINE_API_AUTH_TOKEN: 'test-token-123',
          LOG_LEVEL: level,
        };

        const result = validateEnvironment();
        expect(result.LOG_LEVEL).toBe(level);
      }
    });
  });

  describe('getEnvironment', () => {
    it('should cache validated environment', () => {
      process.env = {
        DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: 'test-token-123',
      };

      const result1 = getEnvironment();
      const result2 = getEnvironment();

      // Should return the same object (cached)
      expect(result1).toBe(result2);
    });

    it('should use caching', () => {
      process.env = {
        DOCUMENT_ENGINE_BASE_URL: 'https://api.example.com',
        DOCUMENT_ENGINE_API_AUTH_TOKEN: 'test-token-123',
      };

      const result1 = getEnvironment();
      const result2 = getEnvironment();

      // Should return the same cached object
      expect(result1).toBe(result2);
      expect(result1.DOCUMENT_ENGINE_BASE_URL).toBe('https://api.example.com');
    });
  });
});
