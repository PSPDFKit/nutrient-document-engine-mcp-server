import { z } from 'zod';

// Environment variable schema
const environmentSchema = z.object({
  // Document Engine configuration with defaults
  DOCUMENT_ENGINE_BASE_URL: z
    .string()
    .url('DOCUMENT_ENGINE_BASE_URL must be a valid URL')
    .default('http://localhost:5000'),
  DOCUMENT_ENGINE_API_AUTH_TOKEN: z
    .string()
    .min(1, 'DOCUMENT_ENGINE_API_AUTH_TOKEN is required')
    .default('secret'),

  // Optional variables with defaults
  CONNECTION_TIMEOUT: z.coerce.number().positive().default(30000),
  MAX_RETRIES: z.coerce.number().int().min(0).default(3),
  RETRY_DELAY: z.coerce.number().int().min(0).default(1000),
  MAX_CONNECTIONS: z.coerce.number().int().positive().default(100),
  LOG_LEVEL: z
    .enum(['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency'])
    .default('info'),

  // MCP Transport configuration
  MCP_TRANSPORT: z.enum(['stdio', 'http']).default('stdio'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5100),
  MCP_HOST: z.string().default('localhost'),

  // Dashboard configuration (optional - only enabled when both username and password are provided)
  DASHBOARD_USERNAME: z.string().optional(),
  DASHBOARD_PASSWORD: z.string().optional(),

  // Document Engine polling configuration
  DOCUMENT_ENGINE_POLL_MAX_RETRIES: z.coerce.number().int().min(1).default(30),
  DOCUMENT_ENGINE_POLL_RETRY_DELAY: z.coerce.number().int().min(100).default(2000),
});

// Type for validated environment
export type ParsedEnvironment = z.infer<typeof environmentSchema>;

/**
 * Validates and parses environment variables
 * @returns Parsed environment configuration
 * @throws ZodError if validation fails
 */
export function validateEnvironment(): ParsedEnvironment {
  try {
    return environmentSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map(err => {
          const path = err.path.join('.');
          return `${path}: ${err.message}`;
        })
        .join('\n');

      throw new Error(`Environment validation failed:\n${errorMessages}`);
    }
    throw error;
  }
}

/**
 * Gets validated environment configuration with memoization
 */
export const getEnvironment = (() => {
  let cachedEnvironment: ParsedEnvironment | undefined;
  return (): ParsedEnvironment => {
    if (cachedEnvironment === undefined) {
      cachedEnvironment = validateEnvironment();
    }
    return cachedEnvironment;
  };
})();
