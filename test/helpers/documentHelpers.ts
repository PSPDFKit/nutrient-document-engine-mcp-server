import path from 'path';
import { DocumentEngineClient } from '../../src/api/Client.js';
import { readFile } from 'fs/promises';

/**
 * Helper function to upload a test document to Document Engine
 * @param client Document Engine client
 * @param filePath
 * @param title
 * @returns The document ID of the uploaded document
 */
export async function uploadTestDocument(
  client: DocumentEngineClient,
  filePath: string,
  title?: string
): Promise<string> {
  // Read the file as a buffer and convert to path
  const fileBuffer = await readFile(filePath);
  const blob = new Blob([fileBuffer], { type: 'application/octet-stream' });
  const formData = new FormData();
  formData.append('file', blob, path.basename(filePath));
  if (title) {
    formData.append('title', title);
  }
  formData.append('overwrite_existing_document', 'true');

  // Upload the document
  const response = await client['upload-document'](
    {},
    // @ts-expect-error a form data upload is supported.
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  // Return the document ID
  const documentId = response.data?.data?.document_id;
  if (!documentId) {
    throw new Error('Failed to upload document - no document ID returned');
  }
  return documentId;
}

/**
 * Helper function to delete a document from Document Engine
 * @param client Document Engine client
 * @param documentId The ID of the document to delete
 * @returns True if the document was deleted successfully
 */
export async function deleteTestDocument(
  client: DocumentEngineClient,
  documentId: string
): Promise<boolean> {
  try {
    // Delete the document
    await client['delete-document']({ documentId });
    return true;
  } catch (error) {
    console.error(`Failed to delete document ${documentId}:`, error);
    return false;
  }
}
