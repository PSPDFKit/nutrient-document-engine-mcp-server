import { createDocumentEngineClient, ClientConfig } from './Client.js';
import { getEnvironment } from '../utils/Environment.js';
import { Client } from './DocumentEngineSchema.js';

/**
 * Get a Document Engine client instance with current environment
 */
export async function getDocumentEngineClient(): Promise<Client> {
  const env = getEnvironment();

  const config: ClientConfig = {
    baseURL: env.DOCUMENT_ENGINE_BASE_URL,
    authToken: env.DOCUMENT_ENGINE_API_AUTH_TOKEN,
    timeout: env.CONNECTION_TIMEOUT,
    maxRetries: env.MAX_RETRIES,
    retryDelay: env.RETRY_DELAY,
    maxConnections: env.MAX_CONNECTIONS,
  };

  return createDocumentEngineClient(config);
}
