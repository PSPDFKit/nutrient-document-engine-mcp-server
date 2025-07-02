/**
 * File handling utilities for document upload and download
 *
 * Provides functions to upload documents to the Document Engine API
 * with proper error handling and content type detection.
 */

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import mime from 'mime-types';

/**
 * Uploads a single document to the Document Engine
 *
 * @param filePath - Path to the document file to upload
 * @returns The document ID assigned by the Document Engine
 * @throws Error if the file doesn't exist or upload fails
 */
export async function uploadDocument(filePath: string): Promise<string> {
  const authToken = process.env.DOCUMENT_ENGINE_API_AUTH_TOKEN || 'secret';
  const baseUrl = process.env.DOCUMENT_ENGINE_API_BASE_URL || 'http://localhost:5000';

  try {
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileContent = await readFile(filePath);
    const contentType = mime.lookup(filePath);

    const fileName = path.basename(filePath);
    const formData = new FormData();
    const blob = new Blob([fileContent], { type: contentType || 'application/octet-stream' });
    formData.append('file', blob, fileName);

    const uploadResult = await fetch(`${baseUrl}/api/documents`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Token token="${authToken}"`,
        Accept: 'application/json',
      },
    });

    if (!uploadResult.ok) {
      const errorText = await uploadResult.text();
      throw new Error(`Upload failed with status ${uploadResult.status}: ${errorText}`);
    }

    const response = (await uploadResult.json()) as { data?: { document_id?: string } };

    if (!response.data) {
      throw new Error(`Upload failed: ${JSON.stringify(response)}`);
    }

    const documentId = response.data.document_id;
    if (!documentId) {
      throw new Error(`No document ID returned for ${fileName}`);
    }

    console.log(`📄 Uploaded ${fileName} → Document ID: ${documentId}`);

    return documentId;
  } catch (error) {
    console.error(`❌ Error uploading document ${filePath}:`, (error as Error).message);
    throw error;
  }
}

/**
 * Uploads multiple documents to the Document Engine with controlled concurrency
 *
 * @param filePaths - Array of file paths to upload
 * @returns Array of document IDs in the same order as the input files
 * @throws Error if any upload fails (does not continue on individual failures)
 *
 * @example
 * const documentIds = await uploadDocuments([
 *   './documents/invoice.pdf',
 *   './documents/purchase-order.pdf'
 * ]);
 */
export async function uploadDocuments(filePaths: string[]): Promise<string[]> {
  const concurrency = 3; // Limit concurrent uploads to avoid overwhelming the server

  console.log(`📤 Uploading ${filePaths.length} documents...`);

  const documentIds: string[] = [];

  for (let i = 0; i < filePaths.length; i += concurrency) {
    const batch = filePaths.slice(i, i + concurrency);

    const batchPromises = batch.map(async (filePath): Promise<string> => {
      return await uploadDocument(filePath);
    });

    const batchResults = await Promise.all(batchPromises);
    documentIds.push(...batchResults);
  }

  return documentIds;
}
