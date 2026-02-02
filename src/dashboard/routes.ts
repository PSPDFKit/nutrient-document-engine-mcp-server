import { Request, Response } from 'express';
import multer from 'multer';
import basicAuth from 'express-basic-auth';
import { DocumentEngineClient } from '../api/Client.js';
import { getEnvironment } from '../utils/Environment.js';
import { logger } from '../utils/Logger.js';
import { dashboardTemplate } from './templates/dashboard.js';
import { uploadResultsTemplate } from './templates/uploadResults.js';
import { errorTemplate } from './templates/error.js';
import { formatFileSize } from '../utils/Common.js';

// Set up multer for file uploads
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

/**
 * Create basic auth middleware for dashboard routes
 */
export function createAuthMiddleware() {
  const env = getEnvironment();
  if (!env.DASHBOARD_USERNAME || !env.DASHBOARD_PASSWORD) {
    throw new Error(
      'DASHBOARD_USERNAME and DASHBOARD_PASSWORD must be provided to enable dashboard'
    );
  }
  return basicAuth({
    users: { [env.DASHBOARD_USERNAME]: env.DASHBOARD_PASSWORD },
    challenge: true,
    realm: 'Document Engine Dashboard',
  });
}

/**
 * Dashboard home page handler
 */
export async function dashboardHandler(client: DocumentEngineClient, req: Request, res: Response) {
  try {
    // Get list of documents
    const response = await client['list-documents']({
      page_size: 100,
      order_by: 'created_at',
      order_direction: 'desc',
    });

    const documents = response.data.data || [];

    // Get message from query parameters if present
    const message = req.query.message as string | undefined;

    // Render HTML dashboard
    res.send(dashboardTemplate(documents, formatFileSize, message));
  } catch (error) {
    logger.error(null, 'Dashboard error', { error });
    res
      .status(500)
      .send(
        errorTemplate(
          `An error occurred while loading the dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      );
  }
}

/**
 * File upload handler
 */
export async function uploadHandler(client: DocumentEngineClient, req: Request, res: Response) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send(errorTemplate('No files were uploaded.'));
    }

    const results = [];
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();

    for (const file of files) {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        const blob = new Blob([file.buffer], { type: 'application/octet-stream' });
        formData.append('file', blob, file.originalname);

        // Upload file to Document Engine with proper content type
        // @ts-expect-error We can pass FormData to this endpoint.
        const response = await client['upload-document']({}, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const documentId = response.data.data?.document_id;
        if (!documentId) {
          throw new Error('No document ID returned from upload');
        }

        results.push({
          filename: file.originalname,
          success: true,
          documentId: documentId,
        });
      } catch (fileError) {
        results.push({
          filename: file.originalname,
          success: false,
          error: fileError instanceof Error ? fileError.message : 'Upload failed',
        });
      }
    }

    // Transform results to match the expected type for the template
    const templateResults = results.map(result => {
      if ('documentId' in result) {
        return {
          filename: result.filename as string,
          success: result.success,
        };
      } else {
        return {
          filename: result.filename as string,
          success: result.success,
          error: result.error,
        };
      }
    });

    // Render upload results
    res.send(uploadResultsTemplate(templateResults));
  } catch (error) {
    logger.error(null, 'File upload error', { error });
    res
      .status(500)
      .send(
        errorTemplate(
          `An error occurred during file upload: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      );
  }
}

/**
 * File download handler
 */
export async function downloadHandler(client: DocumentEngineClient, req: Request, res: Response) {
  try {
    const paramId = req.params.id;
    const documentId = Array.isArray(paramId) ? paramId[0] : paramId;

    if (!documentId) {
      return res.status(400).send(errorTemplate('Document ID is required'));
    }

    // Get document info to get the title for the filename
    const documentInfo = await client['fetch-document-info']({ documentId });

    // Check if document info exists and has title
    const documentData = documentInfo.data.data;
    if (!documentData) {
      throw new Error(`No document data returned for document ID: ${documentId}`);
    }

    const documentTitle = documentData.title || 'document';
    const safeFilename = documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';

    // Download the document as PDF with proper binary response handling
    const response = await client['download-document-pdf']({ documentId }, undefined, {
      responseType: 'arraybuffer',
    });

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);

    res.send(Buffer.from(response.data));
  } catch (error) {
    logger.error(null, 'Document download error', { error });
    res
      .status(500)
      .send(
        errorTemplate(
          `An error occurred while downloading the document: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      );
  }
}

/**
 * File delete handler
 */
export async function deleteHandler(client: DocumentEngineClient, req: Request, res: Response) {
  try {
    const paramId = req.params.id;
    const documentId = Array.isArray(paramId) ? paramId[0] : paramId;

    if (!documentId) {
      return res.status(400).send(errorTemplate('Document ID is required'));
    }

    // Delete the document
    await client['delete-document']({ documentId });

    // Redirect back to dashboard with success message
    res.redirect('/dashboard?message=Document+deleted+successfully');
  } catch (error) {
    logger.error(null, 'Document delete error', { error });
    res
      .status(500)
      .send(
        errorTemplate(
          `An error occurred while deleting the document: ${error instanceof Error ? error.message : 'Unknown error'}`
        )
      );
  }
}
