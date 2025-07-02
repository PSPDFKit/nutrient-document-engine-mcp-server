/**
 * Simplified types for procurement document processing
 */

import { z } from 'zod';

export type DocumentType = 'purchase_order' | 'invoice' | 'payment' | 'unknown';

// Zod schema for document classification and extraction
export const DocumentClassificationSchema = z.object({
  // Document classification
  type: z
    .enum(['purchase_order', 'invoice', 'payment', 'unknown'])
    .describe('The type of document being analyzed'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence level of the classification (0.0 to 1.0)'),

  // Common extracted data
  vendor: z.string().nullable().describe('Vendor or supplier name'),
  amount: z.number().nullable().describe('Total amount or value'),
  date: z.string().nullable().describe('Document date (in any recognizable format)'),

  // Reference numbers for matching
  poNumber: z
    .string()
    .nullable()
    .describe('Purchase Order number (if this is a PO or if referenced)'),
  invoiceNumber: z
    .string()
    .nullable()
    .describe('Invoice number (if this is an invoice or if referenced)'),
  paymentReference: z.string().nullable().describe('Payment reference or transaction ID'),

  // Cross-references for matching
  poReference: z
    .string()
    .nullable()
    .describe('PO number mentioned in this document (e.g., on an invoice)'),
  invoiceReference: z
    .string()
    .nullable()
    .describe('Invoice number mentioned in this document (e.g., on a payment)'),

  // Classification reasoning
  reasoning: z.string().describe('Brief explanation of why this classification was chosen'),
});

export interface BaseDocument {
  filename: string;
  path: string;
  documentId?: string;
  source: string;
}

export interface ProcessedDocument extends BaseDocument {
  documentId: string;
  type: DocumentType;
  confidence: number;
  extractedData: {
    // Common fields
    vendor: string | null;
    amount: number | null;
    date: string | null;

    // Reference numbers for matching
    poNumber: string | null;
    invoiceNumber: string | null;
    paymentReference: string | null;

    // For matching across documents
    poReference: string | null; // PO number referenced in invoice
    invoiceReference: string | null; // Invoice number referenced in payment
  };
  reasoning: string; // Classification reasoning from AI
}

export interface DocumentGroup {
  id: string;
  purchaseOrder?: ProcessedDocument;
  invoice?: ProcessedDocument;
  payment?: ProcessedDocument;
  vendor?: string | null;
  totalAmount?: number | null;
  status: 'complete' | 'partial'; // complete = all 3 docs, partial = 2 docs
}

export interface OrphanDocument extends ProcessedDocument {
  reason: string;
  suggestedAction: string;
}
