import { z } from 'zod';

/**
 * Shared Zod schema for DocumentFingerprint that can be used across all tools
 */
export const DocumentFingerprintSchema = z
  .object({
    document_id: z
      .string()
      .min(1, 'Document ID is required')
      .describe('The ID on the Document Engine to identify the document'),
    layer: z
      .string()
      .optional()
      .describe('Optional layer name. If not specified, operations will use the default layer'),
  })
  .describe('Document identifier with optional layer');

export type DocumentFingerprint = z.infer<typeof DocumentFingerprintSchema>;
