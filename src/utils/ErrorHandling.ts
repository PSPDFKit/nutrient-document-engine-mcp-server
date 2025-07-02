import axios from 'axios';

export class DocumentEngineError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;
  public readonly details?: unknown;

  constructor(message: string, code: string, statusCode?: number, details?: unknown) {
    super(message);
    this.name = 'DocumentEngineError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function handleApiError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    switch (status) {
      case 400:
        throw new DocumentEngineError(
          data?.message || 'Bad request - invalid parameters',
          'BAD_REQUEST',
          400,
          data
        );
      case 401:
        throw new DocumentEngineError(
          'Authentication failed - check your API token',
          'AUTHENTICATION_FAILED',
          401,
          data
        );
      case 403:
        throw new DocumentEngineError(
          'Access forbidden - insufficient permissions',
          'ACCESS_FORBIDDEN',
          403,
          data
        );
      case 404:
        throw new DocumentEngineError(
          data?.message || 'Resource not found',
          'NOT_FOUND',
          404,
          data
        );
      case 409:
        throw new DocumentEngineError(
          data?.message || 'Conflict - resource already exists or is in use',
          'CONFLICT',
          409,
          data
        );
      case 413:
        throw new DocumentEngineError(
          'File too large - exceeds size limits',
          'FILE_TOO_LARGE',
          413,
          data
        );
      case 429:
        throw new DocumentEngineError(
          'Rate limit exceeded - too many requests',
          'RATE_LIMIT_EXCEEDED',
          429,
          data
        );
      case 500:
      case 502:
      case 503:
      case 504:
        throw new DocumentEngineError(
          'Server error - please try again later',
          'SERVER_ERROR',
          status,
          data
        );
      default:
        throw new DocumentEngineError(
          data?.message || error.message || 'Unknown API error',
          'API_ERROR',
          status,
          data
        );
    }
  }

  if (error instanceof Error) {
    throw new DocumentEngineError(error.message, 'UNKNOWN_ERROR', undefined, error);
  }

  throw new DocumentEngineError('An unknown error occurred', 'UNKNOWN_ERROR');
}
