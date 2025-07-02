/**
 * Utility types and functions for creating properly typed mocks in tests
 */

import { vi } from 'vitest';

/**
 * Proper mock type for DocumentEngineClient that includes mock methods
 * Use any to bypass strict typing since this is for test mocking
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MockedDocumentEngineClient = any;

/**
 * Create a properly typed mock DocumentEngineClient
 */
export function createMockClient(): MockedDocumentEngineClient {
  // Use vi.mocked to create a proper mock
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockClient = {} as any;

  // Create a proxy that returns vi.fn() for any property access
  return new Proxy(mockClient, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(target: any, prop: string | symbol) {
      if (!(prop in target)) {
        target[prop] = vi.fn();
      }
      return target[prop];
    },
  }) as MockedDocumentEngineClient;
}

/**
 * Type for Node.js stream write function mocking
 */
export type MockedStreamWrite = ReturnType<typeof vi.fn>;

/**
 * Create properly typed stream write mocks
 */
export function createStreamWriteMocks() {
  return {
    mockStderr: vi.fn(),
    mockStdout: vi.fn(),
    originalStderr: process.stderr.write,
    originalStdout: process.stdout.write,
  };
}

/**
 * Type-safe access to private properties for testing
 */
export type WithPrivateAccess<T, K extends string, V> = T & { [P in K]: V };

/**
 * Helper for accessing private properties in tests
 */
export function withPrivateAccess<T, K extends string, V>(
  obj: T,
  _key: K,
  _valueType?: V
): WithPrivateAccess<T, K, V> {
  return obj as WithPrivateAccess<T, K, V>;
}
