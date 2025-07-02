import axios from 'axios';
import http from 'http';
import https from 'https';
import { handleApiError } from '../utils/ErrorHandling.js';
import { logger } from '../utils/Logger.js';
import { Client } from './DocumentEngineSchema.js';
import { AxiosRequestConfig, OpenAPIClientAxios } from 'openapi-client-axios';

export type DocumentEngineClient = Client;

export interface ClientConfig {
  baseURL: string;
  authToken: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  maxConnections?: number;
}

/**
 * Creates and initializes a Document Engine client
 */
export async function createDocumentEngineClient(config: ClientConfig): Promise<Client> {
  const maxRetries = config.maxRetries || 3;
  const retryDelay = config.retryDelay || 1000;

  const maxConnections = config.maxConnections || 100;
  const httpAgent = new http.Agent({
    keepAlive: true,
    maxSockets: maxConnections,
    maxFreeSockets: 10,
    timeout: 60000,
  });

  const httpsAgent = new https.Agent({
    keepAlive: true,
    maxSockets: maxConnections,
    maxFreeSockets: 10,
    timeout: 60000,
  });

  const openApiAxios = new OpenAPIClientAxios({
    // Takes the OpenAPI yaml file directly from the Server it's targeting.
    definition: './api/upstream.yml',
    axiosConfigDefaults: {
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        Authorization: `Token token="${config.authToken}"`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      httpAgent,
      httpsAgent,
    },
  });

  const client = await openApiAxios.init<Client>();

  setupInterceptors(client);
  addRetryFunctionality(client, maxRetries, retryDelay);

  return client;
}

/**
 * Set up request and response interceptors
 */
function setupInterceptors(client: Client): void {
  client.interceptors.request.use(
    config => {
      logger.request(config.method || 'unknown', config.url || 'unknown', {
        params: config.params,
        body: config.data,
      });
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    response => {
      logger.response(response.status, response.config?.url || 'unknown', {
        data: response.data,
      });
      return response;
    },
    error => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const method = error.config?.method?.toUpperCase();
        const url = error.config?.url || 'unknown';

        logger.error('API Request Failed', {
          method,
          url,
          status,
          message: error.message,
          code: error.code,
        });
      } else {
        logger.error('Non-Axios Error in Response Interceptor', {
          message: error instanceof Error ? error.message : String(error),
        });
      }
      return Promise.reject(error);
    }
  );
}

/**
 * Add retry functionality to the client
 */
function addRetryFunctionality(client: Client, maxRetries: number, retryDelay: number): void {
  // Store the original request method
  const originalRequest = client.request;

  // Override the request method with retry functionality
  const originalRequestTyped = originalRequest as <T>(config: AxiosRequestConfig) => Promise<T>;

  client.request = async function retryableRequest<T>(config: AxiosRequestConfig): Promise<T> {
    async function attempt(retryCount: number): Promise<T> {
      try {
        return await originalRequestTyped<T>(config);
      } catch (error) {
        // If we've exhausted all retries, handle the error and throw
        if (retryCount >= maxRetries) {
          handleApiError(error);
        }

        // Only retry on specific conditions
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const isRetryableError = shouldRetryError(error, status);

          if (isRetryableError) {
            const currentAttempt = retryCount + 1;
            const delay = calculateDelay(retryDelay, retryCount);

            logger.retry(currentAttempt, maxRetries, delay);
            await new Promise(resolve => setTimeout(resolve, delay));
            return attempt(retryCount + 1);
          }
        }

        // Not retryable, handle error and throw
        handleApiError(error);
      }
    }

    return attempt(0);
  };
}

/**
 * Determines if an error should be retried
 */
function shouldRetryError(error: unknown, status?: number): boolean {
  // Retry on network errors (no status)
  if (!status) {
    return true;
  }

  // Retry on 5xx server errors
  if (status >= 500) {
    return true;
  }

  // Retry on specific 4xx errors that might be transient
  if (status === 408 || status === 429) {
    // Request Timeout, Too Many Requests
    return true;
  }

  return false;
}

/**
 * Calculates exponential backoff delay with jitter
 */
function calculateDelay(baseDelay: number, retryCount: number): number {
  const exponentialDelay = baseDelay * Math.pow(2, retryCount);
  const jitter = Math.random() * 0.1 * exponentialDelay; // Add up to 10% jitter
  return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
}
