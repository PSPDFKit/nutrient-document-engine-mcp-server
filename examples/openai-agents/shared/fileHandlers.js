import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import * as fs from 'node:fs';
import { pipeline, Readable } from 'node:stream';
import { promisify } from 'node:util';
import mime from 'mime-types';

// Add this at the top with other imports
const pipelineAsync = promisify(pipeline);

/**
 * Uploads a single document to the Document Engine
 * @param {string} filePath - Path to the file to upload
 * @param {Object} options - Upload options
 * @param {string} options.baseUrl - Base URL for the Nutrient Document Engine (default: 'http://localhost:5000')
 * @param {Object} options.headers - Additional headers to include
 * @param {string} options.contentType - MIME type of the file (default: 'application/pdf')
 * @returns {Promise<string>} - The document ID of the uploaded file
 */
async function uploadDocument(filePath, options = {}) {
  const authToken = process.env.DOCUMENT_ENGINE_API_AUTH_TOKEN || 'secret';

  const {
    baseUrl = 'http://localhost:5000',
    headers = {
      Authorization: `Token token="${authToken}"`,
      Accept: 'application/json',
    },
  } = options;

  try {
    // Check if file exists
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Read file content
    const fileContent = await readFile(filePath);
    // Get content type from extension
    const contentType = mime.lookup(filePath);

    // Get file name for title
    const fileName = path.basename(filePath);
    const formData = new FormData();
    const blob = new Blob([fileContent], { type: contentType });
    formData.append('file', blob, fileName);

    const uploadResult = await fetch(`${baseUrl}/api/documents`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (!uploadResult.ok) {
      const errorText = await uploadResult.text();
      throw new Error(`Upload failed with status ${uploadResult.status}: ${errorText}`);
    }

    // Parse JSON response
    const response = await uploadResult.json();

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
    console.error(`❌ Error uploading document ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Uploads multiple documents to the Document Engine
 * @param {Array<string>} filePaths - Array of file paths to upload
 * @param {Object} options - Upload options
 * @param {string} options.baseUrl - Base URL for the document service (default: 'http://localhost:5100')
 * @param {number} options.concurrency - Maximum number of concurrent uploads (default: 3)
 * @param {Object} options.headers - Additional headers to include
 * @param {boolean} options.continueOnError - Continue uploading other files if one fails (default: true)
 * @returns {Promise<Array>} - Array of results with success/failure status and document IDs
 */
async function uploadFilePaths(filePaths, options = {}) {
  const { concurrency = 3, continueOnError = true, ...uploadOptions } = options;

  console.log(`📤 Uploading ${filePaths.length} documents...`);

  const results = [];

  // Process uploads in batches to limit concurrency
  for (let i = 0; i < filePaths.length; i += concurrency) {
    const batch = filePaths.slice(i, i + concurrency);

    const batchPromises = batch.map(async filePath => {
      try {
        const documentId = await uploadDocument(filePath, uploadOptions);
        return {
          success: true,
          filePath,
          documentId,
          error: null,
        };
      } catch (error) {
        const result = {
          success: false,
          filePath,
          documentId: null,
          error: error.message,
        };

        if (!continueOnError) {
          throw error;
        }

        return result;
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  // Summary
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(
    `✅ Upload complete! ${successful.length}/${results.length} files uploaded successfully`
  );

  if (failed.length > 0) {
    console.log(`❌ Failed uploads:`);
    failed.forEach(result => {
      console.log(`  - ${path.basename(result.filePath)}: ${result.error}`);
    });
  }

  return results;
}

/**
 * Uploads multiple documents and returns only the successful document IDs
 * @param {Array<string>} filePaths - Array of file paths to upload
 * @param {Object} options - Upload options
 * @returns {Promise<Array<string>>} - Array of document IDs for successfully uploaded files
 */
async function uploadDocuments(filePaths, options = {}) {
  const results = await uploadFilePaths(filePaths, options);
  return results.filter(result => result.success).map(result => result.documentId);
}

/**
 * Downloads a file from a URL and saves it to the specified path
 * @param documentId
 * @param {string} filepath - The local file path to save to
 * @param {Object} options - Additional options
 * @param {Object} options.headers - HTTP headers to include in the request
 * @param {string} options.downloadDir - Directory to save files (default: './downloads')
 * @param {boolean} options.createDirs - Whether to create directories if they don't exist (default: true)
 * @param {boolean} options.overwrite - Whether to overwrite existing files (default: true)
 * @returns {Promise<string>} - The filepath of the downloaded file
 */
async function downloadFile(documentId, filepath, options = {}) {
  const authToken = process.env.DOCUMENT_ENGINE_API_AUTH_TOKEN || 'secret';

  const {
    baseUrl = 'http://localhost:5000',
    headers = {
      Authorization: `Token token="${authToken}"`,
      Accept: 'application/json',
    },
    downloadDir = './downloads',
  } = options;

  try {
    // Make the request
    const response = await fetch(`${baseUrl}/api/documents/${documentId}/pdf`, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    // Resolve the full file path
    const fullPath = path.isAbsolute(filepath) ? filepath : path.join(downloadDir, filepath);

    // Create directory if it doesn't exist
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Check if file exists and handle overwrite
    if (fs.existsSync(fullPath)) {
      throw new Error(`File already exists: ${fullPath}`);
    }

    // Stream the response to file using promisified pipeline
    const fileStream = fs.createWriteStream(fullPath);
    const readableStream = Readable.fromWeb(response.body);

    await pipelineAsync(readableStream, fileStream);

    return fullPath;
  } catch (error) {
    throw new Error(`Failed to download ${documentId}: ${error.message}`);
  }
}

/**
 * Downloads documents by their IDs from the Document Engine
 * @param {Array<string>} documentIds - Array of document IDs to download
 * @returns {Promise<Array>} - Array of results with success/failure status
 */
async function downloadFiles(documentIds) {
  console.log(`📄 Downloading ${documentIds.length} final documents...`);

  const results = [];
  const concurrency = 3;

  // Process downloads in batches to limit concurrency
  for (let i = 0; i < documentIds.length; i += concurrency) {
    const batch = documentIds.slice(i, i + concurrency);

    const batchPromises = batch.map(async (documentId, index) => {
      const filename = `final_document_${documentId}.pdf`;

      try {
        const filepath = await downloadFile(documentId, filename);

        console.log(`✅ Downloaded: ${filename}`);

        return {
          success: true,
          documentId,
          filepath,
          error: null,
        };
      } catch (error) {
        console.error(`❌ Failed to download document ${documentId}:`, error.message);

        return {
          success: false,
          documentId,
          filepath: path.join('./downloads', filename),
          error: error.message,
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  // Summary
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(
    `🎉 Download complete! ${successful.length}/${results.length} files downloaded successfully`
  );

  if (failed.length > 0) {
    console.log(`❌ Failed downloads:`);
    failed.forEach(result => {
      console.log(`  - Document ${result.documentId}: ${result.error}`);
    });
  }

  return results;
}

export { uploadDocuments, downloadFiles };
